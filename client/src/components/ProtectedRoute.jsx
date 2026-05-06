import { useNavigate } from 'react-router-dom'

export default function LoginPromptModal({ onClose, onLogin }) {
  const navigate = useNavigate()

  const handleLogin = () => {
    if (onLogin) {
      onLogin()
    } else {
      navigate('/auth')
    }
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.75)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        backdropFilter: 'blur(4px)',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#1a1a1a',
          border: '1px solid #2a2a2a',
          borderRadius: 20,
          padding: '40px 36px',
          maxWidth: 400,
          width: '100%',
          textAlign: 'center',
          fontFamily: "'Inter', sans-serif",
          animation: 'modalPop 0.2s cubic-bezier(0.34,1.56,0.64,1)',
        }}
      >
        <style>{`
          @keyframes modalPop {
            from { opacity: 0; transform: scale(0.92); }
            to   { opacity: 1; transform: scale(1); }
          }
        `}</style>

        <div style={{ fontSize: 44, marginBottom: 16 }}>🔒</div>

        <h2 style={{
          color: '#fff',
          fontSize: 20,
          fontWeight: 700,
          margin: '0 0 10px',
          fontFamily: "'Merriweather', serif",
        }}>
          Потрібен вхід
        </h2>

        <p style={{
          color: '#666',
          fontSize: 14,
          lineHeight: 1.6,
          margin: '0 0 28px',
        }}>
          Щоб заповнювати форму адопції, увійдіть або створіть акаунт. Це займе менше хвилини.
        </p>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={handleLogin}
            style={{
              background: '#ff6b2b',
              border: 'none',
              borderRadius: 10,
              padding: '12px 22px',
              color: '#fff',
              fontWeight: 600,
              fontSize: 14,
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            Увійти / Зареєструватися
          </button>

          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: '1px solid #333',
              borderRadius: 10,
              padding: '12px 22px',
              color: '#777',
              fontWeight: 600,
              fontSize: 14,
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            Закрити
          </button>
        </div>
      </div>
    </div>
  )
}