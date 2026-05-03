import { useMemo, useState } from 'react'

const missionsSeed = [
  {
    id: '7712',
    name: 'Cooper',
    emoji: '🐕',
    status: 'Critical',
    priority: 1,
    distance: '2.4 km',
    location: 'Industrial Zone — Terminal B',
    summary: 'Severe dehydration, possible limb trauma.',
    team: 'Dr. Aris + 2',
    updated: '4 min ago',
    heartRate: '128 BPM',
    action: 'Dispatch now',
    theme: 'danger',
  },
  {
    id: '7690',
    name: 'Luna',
    emoji: '🐈',
    status: 'Stable',
    priority: 3,
    distance: '5.1 km',
    location: 'Residential Transfer — Sector 4',
    summary: 'Post-op recovery, needs monitoring and feeding.',
    team: 'Nurse Milla + 1',
    updated: '12 min ago',
    heartRate: '112 BPM',
    action: 'Review report',
    theme: 'calm',
  },
  {
    id: '7724',
    name: 'Milo',
    emoji: '🦊',
    status: 'Watch',
    priority: 2,
    distance: '1.1 km',
    location: 'East Bridge Underpass',
    summary: 'Possible sprain, alert but movement is limited.',
    team: 'Field Unit B',
    updated: '9 min ago',
    heartRate: '104 BPM',
    action: 'Assign volunteer',
    theme: 'watch',
  },
  {
    id: '7731',
    name: 'Nova',
    emoji: '🐕',
    status: 'Critical',
    priority: 1,
    distance: '3.0 km',
    location: 'Dock 3 — Storage Yard',
    summary: 'Open wound, rescue route prepared, urgent pickup.',
    team: 'Rapid Team A',
    updated: '2 min ago',
    heartRate: '136 BPM',
    action: 'Accept mission',
    theme: 'danger',
  },
]

const logisticsSeed = [
  { id: 1, icon: '📋', title: 'Supply run', detail: 'Medical kit restock for central clinic', eta: '45 min', type: 'Low' },
  { id: 2, icon: '🏠', title: 'Shelter maintenance', detail: 'Water and sanitation check in Kennel A', eta: 'Now', type: 'Scheduled' },
  { id: 3, icon: '🚑', title: 'Transport pickup', detail: 'Crate and ambulance required at Dock 2', eta: '15 min', type: 'High' },
]

const medicalSeed = [
  { id: 1, patient: 'Cooper', treatment: 'IV fluids', doctor: 'Dr. Aris', status: 'Urgent' },
  { id: 2, patient: 'Luna', treatment: 'Post-op monitoring', doctor: 'Nurse Milla', status: 'Stable' },
  { id: 3, patient: 'Nova', treatment: 'Wound cleaning', doctor: 'Rapid Team A', status: 'Critical' },
]

const archiveSeed = [
  { id: 'A-102', name: 'Bella', result: 'Adopted', date: 'Apr 28' },
  { id: 'A-097', name: 'Rocky', result: 'Transferred to shelter', date: 'Apr 25' },
  { id: 'A-091', name: 'Misty', result: 'Recovered', date: 'Apr 21' },
]

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: '▦' },
  { id: 'rescues', label: 'Active Rescues', icon: '✦' },
  { id: 'dispatch', label: 'Dispatch', icon: '⊹' },
  { id: 'medical', label: 'Medical Log', icon: '♥' },
  { id: 'archive', label: 'Archive', icon: '▤' },
]

function statusTone(status) {
  if (status === 'Critical') return { fg: '#fff1f1', bg: '#8f1d1d', dot: '#ff6b6b' }
  if (status === 'Stable') return { fg: '#dcfce7', bg: '#143220', dot: '#4ade80' }
  if (status === 'Urgent') return { fg: '#fff7ed', bg: '#7c2d12', dot: '#fb923c' }
  return { fg: '#fef3c7', bg: '#3d2f12', dot: '#fbbf24' }
}

function themeFromStatus(status) {
  if (status === 'Critical') return 'danger'
  if (status === 'Stable') return 'calm'
  return 'watch'
}

function actionFromStatus(status) {
  if (status === 'Critical') return 'Dispatch now'
  if (status === 'Stable') return 'Review report'
  return 'Assign volunteer'
}

function StatCard({ label, value, meta }) {
  return (
    <section className="stat-card">
      <span className="eyebrow">{label}</span>
      <strong>{value}</strong>
      <p>{meta}</p>
    </section>
  )
}

function StatusPill({ status }) {
  const tone = statusTone(status)
  return (
    <span className="status-pill" style={{ color: tone.fg, background: tone.bg }}>
      <span className="status-dot" style={{ background: tone.dot }} />
      {status}
    </span>
  )
}

function MissionRow({ mission, active, onSelect }) {
  return (
    <button type="button" className={`mission-row ${active ? 'active' : ''}`} onClick={() => onSelect(mission.id)}>
      <div className={`mission-thumb ${mission.theme}`}>{mission.emoji}</div>

      <div className="mission-copy">
        <div className="mission-topline">
          <h3>Case #{mission.id}: {mission.name}</h3>
          <StatusPill status={mission.status} />
        </div>

        <p>{mission.location}</p>

        <div className="mission-meta">
          <span>{mission.distance}</span>
          <span>{mission.updated}</span>
          <span>{mission.team}</span>
        </div>
      </div>
    </button>
  )
}

function SectionCard({ title, subtitle, children }) {
  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <h3>{title}</h3>
          {subtitle && <p>{subtitle}</p>}
        </div>
      </div>
      <div className="panel-pad">{children}</div>
    </section>
  )
}

export default function HomePage() {
  const [missions, setMissions] = useState(missionsSeed)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeSection, setActiveSection] = useState('rescues')
  const [selectedId, setSelectedId] = useState(missionsSeed[0].id)
  const [filter, setFilter] = useState('All')
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState('Priority')
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  const [form, setForm] = useState({
    name: '',
    emoji: '🐕',
    status: 'Watch',
    priority: '2',
    distance: '',
    location: '',
    summary: '',
    team: '',
    heartRate: '',
  })

  const visibleMissions = useMemo(() => {
    let items = [...missions]

    if (query.trim()) {
      const q = query.toLowerCase()
      items = items.filter((mission) =>
        [mission.name, mission.location, mission.status, mission.summary, mission.team]
          .join(' ')
          .toLowerCase()
          .includes(q)
      )
    }

    if (filter !== 'All') {
      items = items.filter((mission) => mission.status === filter)
    }

    if (sort === 'Priority') {
      items.sort((a, b) => a.priority - b.priority)
    } else if (sort === 'Distance') {
      items.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance))
    } else {
      items.sort((a, b) => a.name.localeCompare(b.name))
    }

    return items
  }, [missions, filter, query, sort])

  const selectedMission =
    visibleMissions.find((mission) => mission.id === selectedId) ||
    missions.find((mission) => mission.id === selectedId) ||
    missions[0]

  const criticalCount = missions.filter((item) => item.status === 'Critical').length
  const stableCount = missions.filter((item) => item.status === 'Stable').length
  const watchCount = missions.filter((item) => item.status === 'Watch').length
  const inTransitCount = missions.length + 8

  function resetForm() {
    setForm({
      name: '',
      emoji: '🐕',
      status: 'Watch',
      priority: '2',
      distance: '',
      location: '',
      summary: '',
      team: '',
      heartRate: '',
    })
  }

  function handleFormChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  function handleCreateMission(e) {
    e.preventDefault()

    if (!form.name.trim() || !form.location.trim() || !form.summary.trim()) {
      return
    }

    const id = String(Date.now()).slice(-4)
    const newMission = {
      id,
      name: form.name.trim(),
      emoji: form.emoji,
      status: form.status,
      priority: Number(form.priority),
      distance: form.distance.trim() || '0.0 km',
      location: form.location.trim(),
      summary: form.summary.trim(),
      team: form.team.trim() || 'Unassigned',
      updated: 'Just now',
      heartRate: form.heartRate.trim() || 'N/A',
      action: actionFromStatus(form.status),
      theme: themeFromStatus(form.status),
    }

    setMissions((prev) => [newMission, ...prev])
    setSelectedId(newMission.id)
    setActiveSection('rescues')
    setIsCreateOpen(false)
    resetForm()
  }

  function renderContent() {
    if (activeSection === 'dashboard') {
      return (
        <>
          <section className="hero-block">
            <div className="hero-copy">
              <h2>Dashboard</h2>
              <p>Overview of rescue activity, critical alerts, logistics load, and current medical flow.</p>
            </div>

            <div className="topbar-actions">
              <button className="collapse-btn" type="button" onClick={() => setSidebarOpen((prev) => !prev)}>
                {sidebarOpen ? 'Hide menu' : 'Show menu'}
              </button>
            </div>
          </section>

          <section className="stats-grid">
            <StatCard label="Critical alerts" value={String(criticalCount).padStart(2, '0')} meta="Immediate response required" />
            <StatCard label="Stable cases" value={String(stableCount).padStart(2, '0')} meta="Animals under controlled care" />
            <StatCard label="Watch list" value={String(watchCount).padStart(2, '0')} meta="Observation and follow-up needed" />
            <StatCard label="In transit" value={String(inTransitCount).padStart(2, '0')} meta="Teams and vehicles moving now" />
          </section>

          <section className="workspace">
            <SectionCard title="Priority board" subtitle="Quick overview of urgent assignments">
              <div className="simple-list">
                {missions.slice(0, 3).map((item) => (
                  <div className="simple-row" key={item.id}>
                    <div>
                      <strong>#{item.id} — {item.name}</strong>
                      <p>{item.location}</p>
                    </div>
                    <StatusPill status={item.status} />
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard title="Operations note" subtitle="Live command summary">
              <div className="detail-note">
                <p>Two critical field missions require immediate transport coordination, while stable cases continue under controlled observation and support staff review.</p>
              </div>
            </SectionCard>
          </section>
        </>
      )
    }

    if (activeSection === 'dispatch') {
      return (
        <>
          <section className="hero-block">
            <div className="hero-copy">
              <h2>Dispatch</h2>
              <p>Coordinate teams, assign routes, and track outgoing rescue transport requests.</p>
            </div>

            <div className="topbar-actions">
              <button className="collapse-btn" type="button" onClick={() => setSidebarOpen((prev) => !prev)}>
                {sidebarOpen ? 'Hide menu' : 'Show menu'}
              </button>
            </div>
          </section>

          <section className="logistics" aria-label="Dispatch queue">
            {logisticsSeed.map((item) => (
              <button key={item.id} className="logistics-item" type="button">
                <div className="logistics-icon">{item.icon}</div>
                <div>
                  <h4>{item.title}</h4>
                  <p>{item.detail}</p>
                </div>
                <div className="logistics-meta">
                  <strong>{item.eta}</strong>
                  <span>{item.type}</span>
                </div>
              </button>
            ))}
          </section>
        </>
      )
    }

    if (activeSection === 'medical') {
      return (
        <>
          <section className="hero-block">
            <div className="hero-copy">
              <h2>Medical Log</h2>
              <p>Review treatment progress, assigned staff, and recovery updates for each patient.</p>
            </div>

            <div className="topbar-actions">
              <button className="collapse-btn" type="button" onClick={() => setSidebarOpen((prev) => !prev)}>
                {sidebarOpen ? 'Hide menu' : 'Show menu'}
              </button>
            </div>
          </section>

          <SectionCard title="Medical records" subtitle="Latest care actions">
            <div className="simple-list">
              {medicalSeed.map((item) => (
                <div className="simple-row" key={item.id}>
                  <div>
                    <strong>{item.patient}</strong>
                    <p>{item.treatment} · {item.doctor}</p>
                  </div>
                  <StatusPill status={item.status} />
                </div>
              ))}
            </div>
          </SectionCard>
        </>
      )
    }

    if (activeSection === 'archive') {
      return (
        <>
          <section className="hero-block">
            <div className="hero-copy">
              <h2>Archive</h2>
              <p>Browse completed rescue missions, recovery outcomes, and shelter transfer history.</p>
            </div>

            <div className="topbar-actions">
              <button className="collapse-btn" type="button" onClick={() => setSidebarOpen((prev) => !prev)}>
                {sidebarOpen ? 'Hide menu' : 'Show menu'}
              </button>
            </div>
          </section>

          <SectionCard title="Completed cases" subtitle="Resolved and archived missions">
            <div className="simple-list">
              {archiveSeed.map((item) => (
                <div className="simple-row" key={item.id}>
                  <div>
                    <strong>{item.name}</strong>
                    <p>Case {item.id} · {item.date}</p>
                  </div>
                  <span className="archive-tag">{item.result}</span>
                </div>
              ))}
            </div>
          </SectionCard>
        </>
      )
    }

    return (
      <>
        <section className="hero-block">
          <div className="hero-copy">
            <h2>Active Rescues</h2>
            <p>Track active rescue cases, dispatch teams, and review field details in one place.</p>
          </div>

          <div className="topbar-actions">
            <button className="collapse-btn" type="button" onClick={() => setSidebarOpen((prev) => !prev)}>
              {sidebarOpen ? 'Hide menu' : 'Show menu'}
            </button>
          </div>
        </section>

        <section className="stats-grid" aria-label="Mission statistics">
          <StatCard label="Critical alerts" value={String(criticalCount).padStart(2, '0')} meta="Rescues needing immediate action" />
          <StatCard label="In transit" value={String(inTransitCount).padStart(2, '0')} meta="Teams currently moving" />
          <StatCard label="Safe today" value={String(stableCount + 28).padStart(2, '0')} meta="Successful extractions today" />
          <StatCard label="Capacity" value="84%" meta="Available shelter and transport load" />
        </section>

        <section className="workspace">
          <div className="panel">
            <div className="panel-header">
              <div>
                <h3>Active mission stream</h3>
                <p>Pick a mission to review the current status and dispatch notes.</p>
              </div>

              <div className="controls">
                <input
                  className="search"
                  type="text"
                  placeholder="Search missions"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  autoComplete="off"
                />

                {['All', 'Critical', 'Stable', 'Watch'].map((value) => (
                  <button
                    key={value}
                    type="button"
                    className={`toolbar-btn ${filter === value ? 'active' : ''}`}
                    onClick={() => setFilter(value)}
                  >
                    {value}
                  </button>
                ))}

                {['Priority', 'Distance', 'Name'].map((value) => (
                  <button
                    key={value}
                    type="button"
                    className={`toolbar-btn ${sort === value ? 'active' : ''}`}
                    onClick={() => setSort(value)}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>

            <div className="mission-list">
              {visibleMissions.length > 0 ? (
                visibleMissions.map((mission) => (
                  <MissionRow
                    key={mission.id}
                    mission={mission}
                    active={selectedMission?.id === mission.id}
                    onSelect={setSelectedId}
                  />
                ))
              ) : (
                <div className="detail-note">
                  <p>No missions match the current search or filters.</p>
                </div>
              )}
            </div>
          </div>

          {selectedMission && (
            <aside className="panel detail-card">
              <div className={`hero ${selectedMission.theme}`}>{selectedMission.emoji}</div>

              <div className="detail-body">
                <div className="detail-head">
                  <div>
                    <StatusPill status={selectedMission.status} />
                    <h3 style={{ marginTop: 12 }}>Case #{selectedMission.id}: {selectedMission.name}</h3>
                    <p>{selectedMission.location}</p>
                  </div>

                  <span className="distance-chip">{selectedMission.distance}</span>
                </div>

                <div className="detail-grid">
                  <div className="mini-card">
                    <span>Assigned team</span>
                    <strong>{selectedMission.team}</strong>
                  </div>

                  <div className="mini-card">
                    <span>Heart rate</span>
                    <strong>{selectedMission.heartRate}</strong>
                  </div>
                </div>

                <div className="detail-note">
                  <p>{selectedMission.summary}</p>
                </div>

                <div className="detail-actions">
                  <button className="detail-primary-btn" type="button">{selectedMission.action}</button>
                  <button className="detail-ghost-btn" type="button">Open case</button>
                </div>
              </div>
            </aside>
          )}
        </section>

        <section className="logistics" aria-label="Secondary logistics">
          <div className="logistics-head">
            <h3>Secondary logistics</h3>
            <span className="eyebrow small-no-margin">Support queue</span>
          </div>

          {logisticsSeed.map((item) => (
            <button key={item.id} className="logistics-item" type="button">
              <div className="logistics-icon">{item.icon}</div>
              <div>
                <h4>{item.title}</h4>
                <p>{item.detail}</p>
              </div>
              <div className="logistics-meta">
                <strong>{item.eta}</strong>
                <span>{item.type}</span>
              </div>
            </button>
          ))}
        </section>
      </>
    )
  }

  return (
    <div className="missions-shell">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        :root {
          --bg: #07090d;
          --panel: #11151c;
          --panel-2: #171c24;
          --panel-3: #0d1117;
          --border: rgba(255,255,255,0.08);
          --text: #f4f7fb;
          --muted: #9aa4b2;
          --soft: #6b7280;
          --accent: #ff6b2b;
          --shadow: 0 18px 48px rgba(0,0,0,0.24);
          --radius: 22px;
        }

        * {
          box-sizing: border-box;
        }

        .missions-shell {
          min-height: calc(100vh - 60px);
          background:
            radial-gradient(circle at top right, rgba(255,107,43,0.12), transparent 26%),
            linear-gradient(180deg, #07090d 0%, #090c11 100%);
          color: var(--text);
          font-family: 'Inter', sans-serif;
        }

        .layout {
          display: grid;
          grid-template-columns: ${sidebarOpen ? '188px 1fr' : '1fr'};
          gap: 24px;
          min-height: calc(100vh - 60px);
        }

        .sidebar {
          min-width: 0;
          min-height: calc(100vh - 60px);
          background: linear-gradient(180deg, #05070b 0%, #070912 100%);
          border-right: 1px solid rgba(255,255,255,0.05);
        }

        .command-card {
          margin: 14px 8px 14px;
          border: 1px solid rgba(255,255,255,0.08);
          background: linear-gradient(180deg, rgba(32,30,54,0.95), rgba(25,24,42,0.92));
          border-radius: 12px;
          padding: 8px 10px;
          display: flex;
          align-items: center;
          gap: 9px;
        }

        .command-icon {
          width: 36px;
          height: 36px;
          border-radius: 11px;
          display: grid;
          place-items: center;
          background: linear-gradient(135deg, #ff7b32, #ff5a1f);
          color: white;
          font-size: 13px;
          font-weight: 700;
          flex-shrink: 0;
        }

        .command-card h3 {
          margin: 0;
          font-size: 10px;
          font-weight: 700;
          color: #f4f4f8;
          line-height: 1.15;
        }

        .command-card p {
          margin: 3px 0 0;
          font-size: 8px;
          letter-spacing: 0.16em;
          color: #73778a;
          line-height: 1.1;
        }

        .nav-list {
          display: grid;
          padding: 0 0 8px;
          border-top: 1px solid rgba(255,255,255,0.04);
          border-bottom: 1px solid rgba(255,255,255,0.04);
        }

        .ref-nav-link {
          position: relative;
          min-height: 42px;
          border-radius: 0;
          padding: 0 13px;
          color: #6f7385;
          border: 0;
          background: transparent;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          width: 100%;
          cursor: pointer;
          text-align: left;
        }

        .ref-nav-link:hover {
          background: rgba(255,255,255,0.02);
          color: #d5d8e3;
        }

        .ref-nav-link.active {
          background: linear-gradient(90deg, rgba(255,107,43,0.12), rgba(255,107,43,0.04));
          color: #ff6b2b;
        }

        .ref-nav-link.active::before {
          content: '';
          position: absolute;
          left: 0;
          top: 8px;
          bottom: 8px;
          width: 3px;
          border-radius: 0 3px 3px 0;
          background: #ff6b2b;
        }

        .nav-icon {
          width: 12px;
          display: inline-flex;
          justify-content: center;
          font-size: 10px;
        }

        .sidebar-footer-ref {
          padding: 12px 8px 14px;
          display: grid;
          gap: 6px;
        }

        .new-mission-btn,
        .footer-link-btn,
        .collapse-btn,
        .toolbar-btn,
        .mission-row,
        .detail-primary-btn,
        .detail-ghost-btn,
        .logistics-item,
        .modal-close-btn,
        .modal-submit-btn {
          transition: transform .18s ease, background .18s ease, border-color .18s ease;
        }

        .new-mission-btn:hover,
        .footer-link-btn:hover,
        .collapse-btn:hover,
        .toolbar-btn:hover,
        .mission-row:hover,
        .detail-primary-btn:hover,
        .detail-ghost-btn:hover,
        .logistics-item:hover,
        .modal-close-btn:hover,
        .modal-submit-btn:hover {
          transform: translateY(-1px);
        }

        .new-mission-btn {
          width: 100%;
          min-height: 40px;
          border: 0;
          border-radius: 999px;
          background: linear-gradient(135deg, #ff7c32, #f35a19);
          color: white;
          font-size: 13px;
          font-weight: 800;
          cursor: pointer;
        }

        .footer-link-btn {
          width: 100%;
          text-align: left;
          background: transparent;
          border: 0;
          color: #6f7385;
          padding: 6px 0;
          font-size: 12px;
          cursor: pointer;
        }

        .content {
          min-width: 0;
          display: grid;
          gap: 24px;
          padding: 28px 28px 28px 0;
        }

        .hero-block {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          gap: 16px;
          align-items: start;
        }

        .hero-copy h2 {
          margin: 0;
          font-size: 42px;
          line-height: 1.05;
        }

        .hero-copy p {
          margin: 12px 0 0;
          max-width: 620px;
          color: var(--muted);
          font-size: 16px;
          line-height: 1.6;
        }

        .topbar-actions {
          display: flex;
          justify-content: flex-end;
        }

        .collapse-btn,
        .toolbar-btn,
        .modal-close-btn {
          border: 1px solid var(--border);
          background: var(--panel);
          color: var(--text);
          border-radius: 14px;
          min-height: 46px;
          padding: 0 16px;
          cursor: pointer;
        }

        .modal-submit-btn,
        .detail-primary-btn {
          border: 0;
          background: linear-gradient(135deg, #ff7f47 0%, #ff6b2b 100%);
          color: white;
          border-radius: 14px;
          min-height: 46px;
          padding: 0 16px;
          cursor: pointer;
          font-weight: 700;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 16px;
        }

        .stat-card,
        .panel {
          background: rgba(17,21,28,0.94);
          border: 1px solid var(--border);
          border-radius: 24px;
          box-shadow: var(--shadow);
        }

        .stat-card {
          padding: 18px;
        }

        .eyebrow {
          display: block;
          margin-bottom: 10px;
          color: var(--muted);
          font-size: 12px;
          font-weight: 600;
          letter-spacing: .08em;
          text-transform: uppercase;
        }

        .small-no-margin {
          margin-bottom: 0;
        }

        .stat-card strong {
          display: block;
          font-size: 28px;
          line-height: 1;
          margin-bottom: 8px;
        }

        .stat-card p,
        .panel-header p,
        .mission-copy > p,
        .logistics-item p,
        .simple-row p {
          margin: 0;
          color: var(--muted);
          font-size: 14px;
          line-height: 1.5;
        }

        .workspace {
          display: grid;
          grid-template-columns: minmax(0, 1.2fr) minmax(320px, 420px);
          gap: 20px;
          align-items: start;
        }

        .panel-header {
          padding: 20px 20px 16px;
          border-bottom: 1px solid var(--border);
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          gap: 12px;
          align-items: center;
        }

        .panel-header h3,
        .logistics-head h3 {
          margin: 0;
          font-size: 18px;
        }

        .panel-pad {
          padding: 16px;
        }

        .controls {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .search,
        .form-input,
        .form-select,
        .form-textarea {
          width: 100%;
          border-radius: 14px;
          border: 1px solid var(--border);
          background: var(--panel-3);
          color: var(--text);
          padding: 12px 14px;
          outline: none;
          font: inherit;
        }

        .search {
          min-width: 220px;
          border-radius: 999px;
        }

        .form-textarea {
          min-height: 110px;
          resize: vertical;
        }

        .toolbar-btn.active {
          background: rgba(255,255,255,0.08);
        }

        .mission-list,
        .logistics,
        .simple-list {
          display: grid;
          gap: 12px;
        }

        .mission-list {
          padding: 16px;
        }

        .mission-row,
        .logistics-item,
        .simple-row {
          width: 100%;
          border: 1px solid var(--border);
          background: var(--panel-2);
          color: inherit;
          border-radius: 18px;
          padding: 14px;
        }

        .mission-row {
          display: grid;
          grid-template-columns: 70px 1fr;
          gap: 14px;
          text-align: left;
          cursor: pointer;
        }

        .mission-row.active {
          border-color: rgba(255,107,43,0.6);
          background: linear-gradient(180deg, rgba(255,107,43,0.08), rgba(255,255,255,0.02));
        }

        .mission-thumb {
          width: 70px;
          height: 70px;
          border-radius: 18px;
          display: grid;
          place-items: center;
          font-size: 34px;
        }

        .mission-thumb.danger { background: linear-gradient(180deg, #4a201f, #2b1212); }
        .mission-thumb.calm { background: linear-gradient(180deg, #12312b, #10201d); }
        .mission-thumb.watch { background: linear-gradient(180deg, #3f3217, #241c0f); }

        .mission-topline,
        .detail-head,
        .simple-row,
        .logistics-head {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 12px;
        }

        .mission-topline h3,
        .detail-head h3 {
          margin: 0;
          font-size: 16px;
        }

        .mission-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          color: var(--soft);
          font-size: 12px;
        }

        .status-pill,
        .archive-tag,
        .distance-chip {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          border-radius: 999px;
          padding: 7px 12px;
          font-size: 12px;
          font-weight: 700;
          white-space: nowrap;
        }

        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .detail-card {
          overflow: hidden;
        }

        .hero {
          min-height: 220px;
          display: grid;
          place-items: center;
          font-size: 96px;
          border-bottom: 1px solid var(--border);
        }

        .hero.danger { background: linear-gradient(180deg, #5c2622 0%, #241110 100%); }
        .hero.calm { background: linear-gradient(180deg, #173830 0%, #0d1514 100%); }
        .hero.watch { background: linear-gradient(180deg, #55451e 0%, #20180b 100%); }

        .detail-body {
          padding: 20px;
          display: grid;
          gap: 18px;
        }

        .detail-head p {
          margin: 6px 0 0;
          color: var(--muted);
          font-size: 14px;
        }

        .distance-chip,
        .archive-tag {
          border: 1px solid var(--border);
          background: var(--panel-3);
          color: var(--text);
        }

        .detail-grid,
        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .mini-card,
        .detail-note {
          border-radius: 18px;
          background: var(--panel-3);
          border: 1px solid var(--border);
          padding: 16px;
        }

        .mini-card span {
          display: block;
          color: var(--muted);
          font-size: 12px;
          margin-bottom: 8px;
        }

        .mini-card strong {
          font-size: 18px;
        }

        .detail-note p {
          margin: 0;
          color: #d0d5dd;
          line-height: 1.6;
          font-size: 14px;
        }

        .detail-actions,
        .modal-actions {
          display: flex;
          gap: 12px;
        }

        .detail-primary-btn,
        .detail-ghost-btn,
        .modal-close-btn,
        .modal-submit-btn {
          flex: 1;
          min-height: 46px;
          font-weight: 700;
        }

        .detail-ghost-btn {
          border: 1px solid var(--border);
          background: var(--panel);
          color: var(--text);
          border-radius: 14px;
          cursor: pointer;
        }

        .logistics-item {
          text-align: left;
          display: grid;
          grid-template-columns: 44px 1fr auto;
          gap: 14px;
          align-items: center;
          cursor: pointer;
        }

        .logistics-icon {
          width: 44px;
          height: 44px;
          border-radius: 14px;
          display: grid;
          place-items: center;
          background: var(--panel-2);
          font-size: 20px;
        }

        .logistics-item h4,
        .simple-row strong {
          margin: 0 0 4px;
          font-size: 15px;
        }

        .logistics-meta {
          text-align: right;
        }

        .logistics-meta strong {
          display: block;
          font-size: 14px;
        }

        .logistics-meta span {
          color: var(--muted);
          font-size: 12px;
        }

        .modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.62);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          z-index: 1000;
        }

        .modal-card {
          width: min(680px, 100%);
          height: min(88vh, 760px);
          background: #0f141b;
          border: 1px solid var(--border);
          border-radius: 24px;
          box-shadow: 0 24px 60px rgba(0,0,0,0.45);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          margin: auto;
        }

        .modal-head {
          padding: 20px 20px 16px;
          border-bottom: 1px solid var(--border);
          flex-shrink: 0;
        }

        .modal-head h3 {
          margin: 0 0 6px;
          font-size: 22px;
        }

        .modal-head p {
          margin: 0;
          color: var(--muted);
          font-size: 14px;
        }

        .modal-form {
          display: flex;
          flex-direction: column;
          flex: 1;
          min-height: 0;
        }

        .modal-scroll {
          flex: 1;
          min-height: 0;
          padding: 20px;
          display: grid;
          gap: 14px;
          overflow-y: auto;
          overflow-x: hidden;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .modal-scroll::-webkit-scrollbar {
          display: none;
        }

        .form-field {
          display: grid;
          gap: 8px;
        }

        .form-field label {
          font-size: 13px;
          color: #d7dde6;
          font-weight: 600;
        }

        .modal-actions {
          padding: 16px 20px 20px;
          border-top: 1px solid var(--border);
          background: #0f141b;
          flex-shrink: 0;
        }

        @media (max-width: 1180px) {
          .workspace {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 980px) {
          .layout {
            grid-template-columns: 1fr;
          }

          .sidebar {
            display: ${sidebarOpen ? 'block' : 'none'};
            min-height: auto;
          }

          .content {
            padding: 20px 16px 24px;
          }
        }

        @media (max-width: 780px) {
          .hero-block,
          .mission-row,
          .detail-grid,
          .form-grid,
          .logistics-item {
            grid-template-columns: 1fr;
          }

          .mission-thumb {
            width: 100%;
            height: 120px;
          }

          .detail-head,
          .simple-row,
          .logistics-head,
          .topbar-actions,
          .controls,
          .detail-actions,
          .modal-actions {
            flex-direction: column;
            align-items: stretch;
          }

          .hero-copy h2 {
            font-size: 34px;
          }

          .modal-card {
            height: min(92vh, 760px);
            width: 100%;
          }

          .modal-backdrop {
            padding: 12px;
          }
        }
      `}</style>

      <div className="layout">
        {sidebarOpen && (
          <aside className="sidebar">
            <div className="command-card">
              <div className="command-icon">✦</div>
              <div>
                <h3>Command Center</h3>
                <p>SECTOR 7 DELTA</p>
              </div>
            </div>

            <nav className="nav-list" aria-label="Main navigation">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`ref-nav-link ${activeSection === item.id ? 'active' : ''}`}
                  onClick={() => setActiveSection(item.id)}
                >
                  <span className="nav-icon" aria-hidden="true">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>

            <div className="sidebar-footer-ref">
              <button className="new-mission-btn" type="button" onClick={() => setIsCreateOpen(true)}>
                New Mission
              </button>
              <button className="footer-link-btn" type="button">Support</button>
              <button className="footer-link-btn" type="button">Sign Out</button>
            </div>
          </aside>
        )}

        <main className="content">
          {renderContent()}
        </main>
      </div>

      {isCreateOpen && (
        <div className="modal-backdrop" onClick={() => setIsCreateOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h3>Create new mission</h3>
              <p>Add a rescue case and place it directly into the active mission stream.</p>
            </div>

            <form className="modal-form" onSubmit={handleCreateMission} autoComplete="off">
              <div className="modal-scroll">
                <div className="form-grid">
                  <div className="form-field">
                    <label htmlFor="name">Animal name</label>
                    <input
                      id="name"
                      name="name"
                      className="form-input"
                      value={form.name}
                      onChange={handleFormChange}
                      placeholder="Cooper"
                      autoComplete="new-password"
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="emoji">Emoji</label>
                    <select
                      id="emoji"
                      name="emoji"
                      className="form-select"
                      value={form.emoji}
                      onChange={handleFormChange}
                      autoComplete="off"
                    >
                      <option value="🐕">🐕 Dog</option>
                      <option value="🐈">🐈 Cat</option>
                      <option value="🦊">🦊 Fox</option>
                      <option value="🐺">🐺 Wolf</option>
                      <option value="🐇">🐇 Rabbit</option>
                    </select>
                  </div>

                  <div className="form-field">
                    <label htmlFor="status">Status</label>
                    <select
                      id="status"
                      name="status"
                      className="form-select"
                      value={form.status}
                      onChange={handleFormChange}
                      autoComplete="off"
                    >
                      <option value="Critical">Critical</option>
                      <option value="Watch">Watch</option>
                      <option value="Stable">Stable</option>
                    </select>
                  </div>

                  <div className="form-field">
                    <label htmlFor="priority">Priority</label>
                    <select
                      id="priority"
                      name="priority"
                      className="form-select"
                      value={form.priority}
                      onChange={handleFormChange}
                      autoComplete="off"
                    >
                      <option value="1">1 — High</option>
                      <option value="2">2 — Medium</option>
                      <option value="3">3 — Low</option>
                    </select>
                  </div>

                  <div className="form-field">
                    <label htmlFor="distance">Distance</label>
                    <input
                      id="distance"
                      name="distance"
                      className="form-input"
                      value={form.distance}
                      onChange={handleFormChange}
                      placeholder="2.4 km"
                      autoComplete="off"
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="heartRate">Heart rate</label>
                    <input
                      id="heartRate"
                      name="heartRate"
                      className="form-input"
                      value={form.heartRate}
                      onChange={handleFormChange}
                      placeholder="128 BPM"
                      autoComplete="off"
                    />
                  </div>
                </div>

                <div className="form-field">
                  <label htmlFor="location">Location</label>
                  <input
                    id="location"
                    name="location"
                    className="form-input"
                    value={form.location}
                    onChange={handleFormChange}
                    placeholder="Industrial Zone — Terminal B"
                    autoComplete="new-password"
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="team">Assigned team</label>
                  <input
                    id="team"
                    name="team"
                    className="form-input"
                    value={form.team}
                    onChange={handleFormChange}
                    placeholder="Dr. Aris + 2"
                    autoComplete="off"
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="summary">Summary</label>
                  <textarea
                    id="summary"
                    name="summary"
                    className="form-textarea"
                    value={form.summary}
                    onChange={handleFormChange}
                    placeholder="Short case description..."
                    autoComplete="off"
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="modal-close-btn" onClick={() => setIsCreateOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="modal-submit-btn">
                  Create mission
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}