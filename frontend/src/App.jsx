import { useCallback, useEffect, useState } from 'react'
import './App.css'

const emptyBrand = { name: '', website: '', description: '' }
const demoBrands = [
  { id: 'demo-northstar', name: 'Northstar Outfitters', website: 'https://northstar.example', description: 'Sample brand for dashboard preview.' },
  { id: 'demo-orbit', name: 'Orbit Audio', website: 'https://orbit.example', description: 'Sample brand for dashboard preview.' },
  { id: 'demo-fieldnotes', name: 'Fieldnotes Coffee', website: 'https://fieldnotes.example', description: 'Sample brand for dashboard preview.' },
]
const demoSocialAccounts = [
  { id: 'demo-social-1', brand_id: 'demo-northstar', platform: 'Instagram', username: '@northstar_demo', url: 'https://example.com/northstar-social' },
  { id: 'demo-social-2', brand_id: 'demo-northstar', platform: 'YouTube', username: '@northstar-demo', url: 'https://example.com/northstar-video' },
  { id: 'demo-social-3', brand_id: 'demo-orbit', platform: 'X', username: '@orbit_audio_demo', url: 'https://example.com/orbit-social' },
]
const demoApps = [
  { id: 'demo-app-1', brand_id: 'demo-northstar', name: 'Northstar Trail Guide', developer: 'Northstar Outfitters (sample)', platform: 'iOS' },
  { id: 'demo-app-2', brand_id: 'demo-orbit', name: 'Orbit Player', developer: 'Orbit Audio (sample)', platform: 'Android' },
]

async function request(path, options) {
  const response = await fetch(path, {
    ...options,
    headers: {
      ...(options?.body ? { 'Content-Type': 'application/json' } : {}),
      ...options?.headers,
    },
  })

  if (!response.ok) {
    const detail = await response.json().catch(() => null)
    const message = typeof detail?.detail === 'string' ? detail.detail : null
    throw new Error(message || `Request failed (${response.status})`)
  }

  return response.status === 204 ? null : response.json()
}

function App() {
  const [brands, setBrands] = useState([])
  const [selectedBrandId, setSelectedBrandId] = useState(null)
  const [socialAccounts, setSocialAccounts] = useState([])
  const [officialApps, setOfficialApps] = useState([])
  const [detailsForBrandId, setDetailsForBrandId] = useState(null)
  const [form, setForm] = useState(emptyBrand)
  const [databaseStatus, setDatabaseStatus] = useState('Checking')
  const [isDemo, setIsDemo] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const loadBrands = useCallback(async () => {
    const data = await request('/api/brands')
    setBrands(data)
    setSelectedBrandId((currentId) =>
      data.some((brand) => brand.id === currentId) ? currentId : data[0]?.id ?? null,
    )
  }, [])

  useEffect(() => {
    let active = true

    Promise.all([request('/api/brands'), request('/health')])
      .then(([brandData, health]) => {
        if (!active) return
        setBrands(brandData)
        setSelectedBrandId(brandData[0]?.id ?? null)
        setDatabaseStatus(health?.database === 'connected' ? 'Connected' : 'Disconnected')
      })
      .catch((loadError) => {
        if (!active) return
        setIsDemo(true)
        setBrands(demoBrands)
        setSelectedBrandId(demoBrands[0].id)
        setSocialAccounts(demoSocialAccounts.filter((account) => account.brand_id === demoBrands[0].id))
        setOfficialApps(demoApps.filter((app) => app.brand_id === demoBrands[0].id))
        setDetailsForBrandId(demoBrands[0].id)
        setDatabaseStatus('Sample data')
        setError(loadError.message)
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    if (isDemo || selectedBrandId === null) {
      return
    }

    let active = true
    Promise.all([
      request(`/api/brands/${selectedBrandId}/social-accounts`),
      request(`/api/brands/${selectedBrandId}/apps`),
    ])
      .then(([accounts, apps]) => {
        if (!active) return
        setSocialAccounts(accounts)
        setOfficialApps(apps)
        setDetailsForBrandId(selectedBrandId)
      })
      .catch((loadError) => {
        if (active) setError(loadError.message)
      })

    return () => {
      active = false
    }
  }, [isDemo, selectedBrandId])

  const visibleSocialAccounts = detailsForBrandId === selectedBrandId ? socialAccounts : []
  const visibleOfficialApps = detailsForBrandId === selectedBrandId ? officialApps : []

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    if (isDemo) {
      const newBrand = {
        ...form,
        id: `demo-${Date.now()}`,
        website: form.website || null,
        description: form.description || null,
      }
      setBrands((currentBrands) => [...currentBrands, newBrand])
      setSelectedBrandId(newBrand.id)
      setSocialAccounts([])
      setOfficialApps([])
      setDetailsForBrandId(newBrand.id)
      setForm(emptyBrand)
      return
    }

    setSaving(true)

    try {
      const newBrand = await request('/api/brands', {
        method: 'POST',
        body: JSON.stringify({
          ...form,
          website: form.website || null,
          description: form.description || null,
        }),
      })
      setForm(emptyBrand)
      await loadBrands()
      setSelectedBrandId(newBrand.id)
    } catch (saveError) {
      setError(saveError.message)
    } finally {
      setSaving(false)
    }
  }

  const selectedBrand = brands.find((brand) => brand.id === selectedBrandId)

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">BrandGuard</p>
          <h1>Digital Risk Protection Dashboard</h1>
        </div>
        <button
          className="primary-btn"
          onClick={() => document.getElementById('brand-name')?.focus()}
        >
          + Add Brand
        </button>
      </header>

      <section className="status-row">
        <div className={`status-card ${databaseStatus === 'Connected' ? 'online' : ''}`}>
          <span className="dot" />
          System Status
          <strong>{isDemo ? 'Preview' : databaseStatus === 'Connected' ? 'Online' : databaseStatus}</strong>
        </div>
        <div className="status-card">
          API
          <strong>{loading ? 'Checking' : isDemo ? 'Demo mode' : error ? 'Needs attention' : 'Connected'}</strong>
        </div>
        <div className="status-card">
          Database
          <strong>{isDemo ? 'Sample data' : databaseStatus}</strong>
        </div>
      </section>

      {isDemo ? (
        <aside className="demo-notice" role="status">
          <strong>Demo preview — not connected to a live database.</strong>
          <span>
            Showing sample records so you can explore the dashboard. Changes made here stay in this browser session only.
            Start the backend and connect its database to load and save real records.
          </span>
          {error && <small>Connection detail: {error}</small>}
        </aside>
      ) : error && <p className="error-message" role="alert">{error}</p>}

      <section className="stats-grid">
        {[
          { label: 'Brands tracked', value: brands.length },
          { label: 'Social accounts', value: visibleSocialAccounts.length },
          { label: 'Official apps', value: visibleOfficialApps.length },
          { label: 'Alerts today', value: '—' },
        ].map((item) => (
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
            <span>{brands.length} total</span>
          </div>
          <div className="table-list">
            {loading ? (
              <p className="empty-state">Loading brands…</p>
            ) : brands.length ? (
              brands.map((brand) => (
                <button
                  key={brand.id}
                  className={`row-item brand-row ${brand.id === selectedBrandId ? 'selected' : ''}`}
                  onClick={() => setSelectedBrandId(brand.id)}
                  aria-pressed={brand.id === selectedBrandId}
                >
                  <span>
                    <strong>{brand.name}</strong>
                    <small>{brand.website || 'No website provided'}</small>
                  </span>
                  <span className="status-text">View details</span>
                </button>
              ))
            ) : (
              <p className="empty-state">No brands yet. Add one to get started.</p>
            )}
          </div>
        </div>

        <div className="panel form-panel">
          <div className="panel-header">
            <h2>Add brand</h2>
          </div>
          <form className="brand-form" onSubmit={handleSubmit}>
            <label>
              Brand name
              <input
                id="brand-name"
                type="text"
                placeholder="Enter brand name"
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                required
                maxLength={255}
              />
            </label>
            <label>
              Website
              <input
                type="url"
                placeholder="https://example.com"
                value={form.website}
                onChange={(event) => setForm({ ...form, website: event.target.value })}
              />
            </label>
            <label>
              Description
              <textarea
                rows="4"
                placeholder="Short brand summary"
                value={form.description}
                onChange={(event) => setForm({ ...form, description: event.target.value })}
              />
            </label>
            <button type="submit" className="primary-btn full" disabled={saving}>
              {saving ? 'Saving…' : isDemo ? 'Add sample brand' : 'Save brand'}
            </button>
          </form>
        </div>
      </section>

      <section className="lower-grid">
        <div className="panel">
          <div className="panel-header">
            <h2>Social Accounts</h2>
            <span>{selectedBrand?.name || 'Select a brand'}</span>
          </div>
          <ul className="list-stack">
            {visibleSocialAccounts.length ? visibleSocialAccounts.map((account) => (
              <li key={account.id}>
                <div>
                  <strong>{account.platform}</strong>
                  <small>{account.username}</small>
                </div>
                {account.url && <a href={account.url} target="_blank" rel="noreferrer">{account.url}</a>}
              </li>
            )) : <li className="empty-state">No social accounts for this brand.</li>}
          </ul>
        </div>

        <div className="panel">
          <div className="panel-header">
            <h2>Official Apps</h2>
            <span>{selectedBrand?.name || 'Select a brand'}</span>
          </div>
          <ul className="list-stack">
            {visibleOfficialApps.length ? visibleOfficialApps.map((officialApp) => (
              <li key={officialApp.id}>
                <div>
                  <strong>{officialApp.name}</strong>
                  <small>{officialApp.developer}</small>
                </div>
                <span>{officialApp.platform}</span>
              </li>
            )) : <li className="empty-state">No official apps for this brand.</li>}
          </ul>
        </div>
      </section>
    </div>
  )
}

export default App
