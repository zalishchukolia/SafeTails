import { useState } from 'react'

export default function Chat() {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Привіт! Я помічник SafeTails 🐾 Допоможу знайти тварину або відповім на питання про адопцію!' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const sendMessage = async () => {
    if (!input.trim()) return

    const userMessage = { role: 'user', text: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      })
      const data = await res.json()
      setMessages(prev => [...prev, { role: 'assistant', text: data.reply }])
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', text: 'Щось пішло не так 😢' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <div style={{ height: '400px', overflowY: 'auto', border: '1px solid #ccc', borderRadius: '8px', padding: '16px', marginBottom: '12px' }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            textAlign: msg.role === 'user' ? 'right' : 'left',
            marginBottom: '12px'
          }}>
            <span style={{
              background: msg.role === 'user' ? '#007bff' : '#f0f0f0',
              color: msg.role === 'user' ? '#fff' : '#000',
              padding: '8px 12px',
              borderRadius: '12px',
              display: 'inline-block',
              maxWidth: '80%'
            }}>
              {msg.text}
            </span>
          </div>
        ))}
        {loading && <div>⏳ Печатає...</div>}
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          placeholder="Напиши повідомлення..."
          style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }}
        />
        <button onClick={sendMessage} style={{ padding: '10px 20px', borderRadius: '8px', background: '#007bff', color: '#fff', border: 'none' }}>
          Надіслати
        </button>
      </div>
    </div>
  )
}