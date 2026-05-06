const font = "'DM Sans', 'Inter', sans-serif"

export default function LoginPromptModal({ open, onClose, onLogin, onContinueWithoutAccount }) {
  if (!open) return null

  return (
    <>
      <div onClick={onClose} style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)',
        zIndex: 500, backdropFilter: 'blur(6px)',
      }} />

      <div style={{
        position: 'fixed', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 501, width: '100%', maxWidth: 420,
        background: '#1a1a1a', borderRadius: 24,
        border: '1px solid #2a2a2a', padding: '44px 36px',
        fontFamily: font, textAlign: 'center',
      }}>
        <button onClick={onClose} style={{
          position: 'absolute', top: 14, right: 14,
          background: '#222', border: 'none', color: '#888',
          width: 28, height: 28, borderRadius: '50%',
          fontSize: 16, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>×</button>

        <div style={{
          width: 64, height: 64, borderRadius: '50%',
          background: 'linear-gradient(135deg,#ff6b2b22,#ff450011)',
          border: '1px solid #ff6b2b44',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 20px', fontSize: 28,
        }}>🐾</div>

        <h2 style={{
          color: '#fff', fontSize: 22, fontWeight: 700,
          margin: '0 0 12px', lineHeight: 1.3,
        }}>
          Щоб продовжити —<br />
          <span style={{
            background: 'linear-gradient(90deg,#ff6b2b,#ff4500)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>увійдіть в акаунт</span>
        </h2>

        <p style={{
          color: '#666', fontSize: 14, lineHeight: 1.7,
          margin: '0 0 32px',
        }}>
          Тільки зареєстровані користувачі можуть додавати місії та керувати тваринами.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button onClick={onLogin} style={{
            background: 'linear-gradient(90deg,#ff6b2b,#ff4500)',
            border: 'none', borderRadius: 12, padding: '14px 0',
            color: '#fff', fontSize: 14, fontWeight: 700,
            cursor: 'pointer', fontFamily: font,
          }}>
            Увійти або зареєструватися
          </button>
          <button onClick={onContinueWithoutAccount || onClose} style={{
            background: 'transparent', border: '1px solid #2a2a2a',
            borderRadius: 12, padding: '13px 0',
            color: '#666', fontSize: 14,
            cursor: 'pointer', fontFamily: font,
          }}>
            Продовжити без акаунту
          </button>
        </div>
      </div>
    </>
  )
}