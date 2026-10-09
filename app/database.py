from pydantic_settings import BaseSettings, SettingsConfigDict
from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker


DEFAULT_SQLITE_URL = "sqlite:///./brandguard.db"
DEFAULT_POSTGRES_URL = "postgresql+psycopg2://brandguard:brandguard@localhost:5432/brandguard"


class Settings(BaseSettings):
    DATABASE_URL: str = DEFAULT_SQLITE_URL

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore",
    )


settings = Settings()


def _build_engine():
    database_url = settings.DATABASE_URL or DEFAULT_SQLITE_URL

    if database_url.startswith("sqlite"):
        return create_engine(database_url, connect_args={"check_same_thread": False})

    try:
        return create_engine(database_url, pool_pre_ping=True)
    except ModuleNotFoundError:
        return create_engine(DEFAULT_SQLITE_URL, connect_args={"check_same_thread": False})


engine = _build_engine()

SessionLocal = sessionmaker(
    bind=engine,
    autocommit=False,
    autoflush=False,
)


class Base(DeclarativeBase):
    pass


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
