import './App.css'

const stats = [
  { label: 'Brands tracked', value: '128' },
  { label: 'Social accounts', value: '1,240' },
  { label: 'Official apps', value: '96' },
  { label: 'Alerts today', value: '18' },
]

const brands = [
  { name: 'Nike', website: 'nike.com', risk: 'Low', status: 'Monitoring' },
  { name: 'Spotify', website: 'spotify.com', risk: 'Medium', status: 'Needs review' },
  { name: 'Microsoft', website: 'microsoft.com', risk: 'Low', status: 'Monitoring' },
]

const socialAccounts = [
  { platform: 'Instagram', handle: '@nike', url: 'instagram.com/nike' },
  { platform: 'X', handle: '@Nike', url: 'x.com/Nike' },
  { platform: 'YouTube', handle: '@Nike', url: 'youtube.com/@Nike' },
]

const officialApps = [
  { name: 'Nike Run Club', platform: 'Android', developer: 'Nike, Inc.' },
  { name: 'Nike Training Club', platform: 'iOS', developer: 'Nike, Inc.' },
  { name: 'SNKRS', platform: 'Android', developer: 'Nike, Inc.' },
]

function App() {
  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">BrandGuard</p>
          <h1>Digital Risk Protection Dashboard</h1>
        </div>
        <button className="primary-btn">+ Add Brand</button>
      </header>

      <section className="status-row">
        <div className="status-card online">
          <span className="dot" />
          System Status
          <strong>Online</strong>
        </div>
        <div className="status-card">
          Last sync
          <strong>2 mins ago</strong>
        </div>
        <div className="status-card">
          Database
          <strong>Connected</strong>
        </div>
      </section>

      <section className="stats-grid">
        {stats.map((item) => (
          <div key={item.label} className="stat-card">
            <span>{item.label}</span>
            <strong>{item.value}</strong>
          </div>
        ))}
      </section>

      <section className="content-grid">
        <div className="panel">
          <div className="panel-header">
            <h2>Brands</h2>
            <a href="#">View all</a>
          </div>
          <div className="table-list">
            {brands.map((brand) => (
              <div key={brand.name} className="row-item">
                <div>
                  <strong>{brand.name}</strong>
                  <small>{brand.website}</small>
                </div>
                <span className={`pill ${brand.risk.toLowerCase()}`}>{brand.risk}</span>
                <span className="status-text">{brand.status}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="panel form-panel">
          <div className="panel-header">
            <h2>Add brand</h2>
          </div>
          <form className="brand-form">
            <label>
              Brand name
              <input type="text" placeholder="Enter brand name" />
            </label>
            <label>
              Website
              <input type="text" placeholder="https://example.com" />
            </label>
            <label>
              Description
              <textarea rows="4" placeholder="Short brand summary" />
            </label>
            <button type="submit" className="primary-btn full">Save brand</button>
          </form>
        </div>
      </section>

      <section className="lower-grid">
        <div className="panel">
          <div className="panel-header">
            <h2>Social Accounts</h2>
          </div>
          <ul className="list-stack">
            {socialAccounts.map((account) => (
              <li key={`${account.platform}-${account.handle}`}>
                <div>
                  <strong>{account.platform}</strong>
                  <small>{account.handle}</small>
                </div>
                <a href={`https://${account.url}`}>{account.url}</a>
              </li>
            ))}
          </ul>
        </div>

        <div className="panel">
          <div className="panel-header">
            <h2>Official Apps</h2>
          </div>
          <ul className="list-stack">
            {officialApps.map((app) => (
              <li key={app.name}>
                <div>
                  <strong>{app.name}</strong>
                  <small>{app.developer}</small>
                </div>
                <span>{app.platform}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  )
}

export default App
