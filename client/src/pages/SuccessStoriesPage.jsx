import { useEffect, useState } from 'react'

const fontTitle = "'Cormorant Garamond', 'Playfair Display SC', serif"
const fontUi    = "'Inter', sans-serif"
const fontBody  = "'Arimo', 'Source Sans Pro', sans-serif"

function SuccessStoriesPage() {
  const [stories, setStories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/success-stories`)
      .then(res => res.json())
      .then(data => { setStories(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      minHeight: '100vh', background: '#0a0c10',
      fontFamily: fontBody, color: '#8fa0b0', fontSize: 16,
    }}>
      Завантаження...
    </div>
  )

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,700&family=Inter:wght@400;500;600;700&family=Arimo:wght@400;500;600;700&display=swap');

        :root {
          --bg:       #0a0c10;
          --surface:  #11151c;
          --surface-2:#171c24;
          --border:   rgba(255,255,255,0.07);
          --accent:   #ff6b2b;
          --accent-h: #e55a1f;
          --text:     #f0f4fb;
          --muted:    #c5cdd8;
          --soft:     #8fa0b0;
          --success-bg:  #12291e;
          --success-fg:  #4ade80;
        }

        .ss-shell {
          min-height: 100vh;
          background:
            radial-gradient(circle at top right, rgba(255,107,43,0.10), transparent 28%),
            var(--bg);
          font-family: var(--font-body, 'Arimo', sans-serif);
          color: var(--text);
          -webkit-font-smoothing: antialiased;
        }

        .ss-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 56px 40px 80px;
        }

        /* ── Hero header ── */
        .ss-header { margin-bottom: 48px; }

        .ss-eyebrow {
          display: inline-block;
          font-family: ${fontUi};
          font-size: 11px; font-weight: 700;
          letter-spacing: 0.16em; text-transform: uppercase;
          color: var(--accent); margin-bottom: 14px;
        }

        .ss-header h1 {
          font-family: ${fontTitle};
          font-size: clamp(36px, 5vw, 58px);
          font-weight: 700; line-height: 1.05;
          letter-spacing: -0.01em; color: var(--text);
          margin: 0 0 16px;
        }

        .ss-header h1 span { color: var(--accent); }

        .ss-header p {
          font-family: ${fontBody};
          font-size: 15px; line-height: 1.75;
          color: var(--muted); max-width: 560px; margin: 0;
        }

        /* ── Grid ── */
        .ss-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 20px;
        }

        .ss-empty {
          grid-column: 1 / -1;
          padding: 80px 20px; text-align: center;
          font-family: ${fontBody}; font-size: 16px; color: var(--soft);
        }

        /* ── Story card ── */
        .ss-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 22px; overflow: hidden;
          display: flex; flex-direction: column;
          transition: border-color .2s ease, transform .2s ease, box-shadow .2s ease;
        }
        .ss-card:hover {
          border-color: rgba(255,107,43,0.45);
          transform: translateY(-3px);
          box-shadow: 0 16px 40px rgba(0,0,0,0.28);
        }

        .ss-card-img {
          width: 100%; height: 210px; object-fit: cover; display: block;
        }
        .ss-card-placeholder {
          width: 100%; height: 210px;
          background: var(--surface-2);
          display: flex; align-items: center; justify-content: center;
          font-size: 52px;
        }

        .ss-card-body { padding: 20px; display: flex; flex-direction: column; gap: 10px; flex: 1; }

        .ss-adopted-badge {
          display: inline-flex; align-items: center; gap: 6px;
          background: var(--success-bg); color: var(--success-fg);
          font-family: ${fontUi}; font-size: 11px; font-weight: 700;
          letter-spacing: 0.06em; padding: 5px 12px; border-radius: 999px;
          width: fit-content;
        }
        .ss-adopted-dot {
          width: 7px; height: 7px; border-radius: 50%; background: var(--success-fg); flex-shrink: 0;
        }

        .ss-card-name {
          font-family: ${fontTitle};
          font-size: 22px; font-weight: 700;
          color: var(--text); margin: 0; line-height: 1.15;
        }

        .ss-card-story {
          font-family: ${fontBody};
          font-size: 14px; line-height: 1.72; color: var(--muted);
          margin: 0;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .ss-card-date {
          font-family: ${fontUi};
          font-size: 11px; color: var(--soft);
          margin-top: auto; padding-top: 6px;
          border-top: 1px solid var(--border);
        }

        /* ── Support block ── */
        .ss-support {
          margin-top: 64px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 28px; padding: 56px 40px;
          text-align: center;
        }

        .ss-support h2 {
          font-family: ${fontTitle};
          font-size: clamp(26px, 3.5vw, 38px); font-weight: 700;
          color: var(--text); margin: 0 0 14px; letter-spacing: -0.01em;
        }

        .ss-support p {
          font-family: ${fontBody};
          font-size: 15px; line-height: 1.75; color: var(--muted);
          max-width: 480px; margin: 0 auto 32px;
        }

        .ss-btn-row { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; }

        .ss-btn-primary {
          background: var(--accent); color: #fff;
          font-family: ${fontUi}; font-size: 14px; font-weight: 700;
          padding: 14px 28px; border-radius: 999px; border: 0;
          cursor: pointer;
          transition: background .18s, transform .18s;
        }
        .ss-btn-primary:hover { background: var(--accent-h); transform: translateY(-2px); }

        .ss-btn-ghost {
          background: transparent; color: var(--muted);
          font-family: ${fontUi}; font-size: 14px; font-weight: 600;
          padding: 14px 28px; border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.15);
          cursor: pointer;
          transition: border-color .18s, color .18s, transform .18s;
        }
        .ss-btn-ghost:hover { border-color: rgba(255,255,255,0.35); color: var(--text); transform: translateY(-2px); }

        /* ── Responsive ── */
        @media (max-width: 640px) {
          .ss-inner { padding: 36px 20px 60px; }
          .ss-support { padding: 36px 20px; }
          .ss-btn-row { flex-direction: column; align-items: stretch; }
          .ss-btn-primary, .ss-btn-ghost { text-align: center; }
        }
      `}</style>

      <div className="ss-shell">
        <div className="ss-inner">

          {/* ── Заголовок ── */}
          <header className="ss-header">
            <span className="ss-eyebrow">Змінені долі</span>
            <h1>
              Щасливі хвости —<br />
              <span>Успішні історії</span>
            </h1>
            <p>
              Від кризи до турботи — це обличчя стійкості та родини,
              які відкрили серця для другого шансу.
            </p>
          </header>

          {/* ── Картки ── */}
          <div className="ss-grid">
            {stories.length === 0 ? (
              <div className="ss-empty">
                🐾 Поки немає історій
              </div>
            ) : (
              stories.map(story => (
                <article key={story._id} className="ss-card">
                  {story.imageUrl ? (
                    <img
                      src={story.imageUrl}
                      alt={story.animalName}
                      className="ss-card-img"
                      loading="lazy"
                    />
                  ) : (
                    <div className="ss-card-placeholder">🐾</div>
                  )}

                  <div className="ss-card-body">
                    <div className="ss-adopted-badge">
                      <span className="ss-adopted-dot" />
                      Усиновлено
                    </div>

                    <h2 className="ss-card-name">{story.animalName}</h2>

                    <p className="ss-card-story">{story.story}</p>

                    <p className="ss-card-date">
                      {new Date(story.adoptedAt).toLocaleDateString('uk-UA', {
                        day: 'numeric', month: 'long', year: 'numeric',
                      })}
                    </p>
                  </div>
                </article>
              ))
            )}
          </div>

          {/* ── Секція підтримки ── */}
          <div className="ss-support">
            <h2>Підтримай наші місії</h2>
            <p>
              Кожна історія усиновлення починається з рятувальної місії.
              Твій внесок фінансує транспорт, медичну допомогу та безпечне
              тимчасове житло для тварин.
            </p>
            <div className="ss-btn-row">
              <button className="ss-btn-primary">Задонатити на порятунок</button>
              <button className="ss-btn-ghost">Стати тимчасовим господарем</button>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}

export default SuccessStoriesPage