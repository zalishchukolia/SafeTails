import { useState } from 'react'


const font = "'Inter', sans-serif"
const mono = "'Inter', monospace"


function SectionTag({ children }) {
  return (
    <div
      style={{
        display: 'inline-block',
        border: '1px solid #2b2b2b',
        borderRadius: 999,
        padding: '6px 14px',
        fontSize: 10,
        color: '#7c7c7c',
        letterSpacing: 2,
        fontFamily: mono,
        marginBottom: 18,
      }}
    >
      {children}
    </div>
  )
}


function StoryCard({ title, text, status, bg }) {
  return (
    <div
      style={{
        background: '#151515',
        border: '1px solid #242424',
        borderRadius: 24,
        overflow: 'hidden',
        boxShadow: '0 10px 30px #00000025',
      }}
    >
      <div
        style={{
          height: 220,
          background: bg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 74,
        }}
      >
        🐾
      </div>


      <div style={{ padding: 22 }}>
        <h3 style={{ color: '#fff', fontSize: 22, margin: '0 0 10px' }}>{title}</h3>
        <p style={{ color: '#8e8e8e', fontSize: 14, lineHeight: 1.8, marginBottom: 16 }}>
          {text}
        </p>


        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: '#1b1b1b',
            border: '1px solid #2a2a2a',
            borderRadius: 999,
            padding: '8px 12px',
            color: '#ffb089',
            fontSize: 12,
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: '#ff6b2b',
              display: 'inline-block',
            }}
          />
          {status}
        </div>
      </div>
    </div>
  )
}


function TeamCard({ name, role }) {
  return (
    <div
      style={{
        background: '#141414',
        border: '1px solid #232323',
        borderRadius: 20,
        padding: 22,
      }}
    >
      <div
        style={{
          width: 58,
          height: 58,
          borderRadius: '50%',
          background: 'linear-gradient(135deg,#ff6b2b,#ff4500)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontWeight: 700,
          fontSize: 20,
          marginBottom: 14,
        }}
      >
        {name[0]}
      </div>


      <div style={{ color: '#fff', fontSize: 18, fontWeight: 700, marginBottom: 6 }}>
        {name}
      </div>


      <div style={{ color: '#8a8a8a', fontSize: 13, lineHeight: 1.7 }}>{role}</div>
    </div>
  )
}


function FooterColumn({ title, links }) {
  return (
    <div>
      <div
        style={{
          fontSize: 10,
          color: '#555',
          letterSpacing: 2,
          fontFamily: mono,
          marginBottom: 16,
        }}
      >
        {title}
      </div>


      {links.map((link) => (
        <div
          key={link}
          style={{
            fontSize: 13,
            color: '#8a8a8a',
            marginBottom: 12,
            cursor: 'pointer',
          }}
        >
          {link}
        </div>
      ))}
    </div>
  )
}


function Footer() {
  return (
    <footer
      style={{
        background: '#0d0d0d',
        fontFamily: font,
        borderTop: '1px solid #1e1e1e',
        marginTop: 'auto',
      }}
    >
      <div style={{ maxWidth: 1320, margin: '0 auto', padding: '42px 40px 26px' }}>
        <div
          className="footer-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr',
            gap: 34,
            marginBottom: 30,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 22,
                fontWeight: 700,
                fontStyle: 'italic',
                background: 'linear-gradient(90deg,#ff6b2b,#ff4500)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: 14,
              }}
            >
              SafeTails
            </div>


            <p
              style={{
                fontSize: 13,
                color: '#717171',
                lineHeight: 1.8,
                maxWidth: 290,
                margin: 0,
              }}
            >
              Допомагаємо тваринам знайти безпеку, турботу та новий дім.
              Разом ми можемо змінити їхнє майбутнє.
            </p>
          </div>


          <FooterColumn title="НАВІГАЦІЯ" links={['Панель', 'Тварини', 'Відправка']} />
          <FooterColumn title="ДОПОМОГА" links={['Прихисток', 'Медична карта', 'Архів']} />
          <FooterColumn title="ПІДТРИМКА" links={['Довідка', 'Донат', 'Волонтерство']} />
          <FooterColumn title="ПРАВОВА" links={['Конфіденційність', 'Умови']} />
        </div>


        <div
          style={{
            borderTop: '1px solid #1a1a1a',
            paddingTop: 18,
            display: 'flex',
            justifyContent: 'space-between',
            gap: 20,
            flexWrap: 'wrap',
            alignItems: 'center',
          }}
        >
          <span style={{ fontSize: 12, color: '#4d4d4d' }}>
            © 2024 SafeTails. Всі права захищені.
          </span>


          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ fontSize: 14, color: '#4d4d4d', cursor: 'pointer' }}>↗</span>
            <span style={{ fontSize: 14, color: '#4d4d4d', cursor: 'pointer' }}>✦</span>
          </div>
        </div>
      </div>
    </footer>
  )
}


export default function FindingNewBeginningsPage() {
  const [form, setForm] = useState({
    fullName: '',
    city: '',
    contact: '',
    helpType: 'Волонтер',
    availability: '',
    experience: '',
    note: '',
  })


  const onChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }


  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700;900&family=Inter:wght@400;500;600;700&display=swap');


        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body { margin: 0; background: #0f0f0f; }
        input, textarea, select, button { outline: none; }


        @media (max-width: 1100px) {
          .hero-grid,
          .form-grid,
          .about-grid,
          .stories-grid,
          .team-grid,
          .footer-grid {
            grid-template-columns: 1fr !important;
          }
        }


        @media (max-width: 700px) {
          .page-wrap {
            padding: 32px 20px 70px !important;
          }


          .hero-title {
            font-size: 40px !important;
            line-height: 1.08 !important;
          }


          .double-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>


      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          background: '#0f0f0f',
          color: '#fff',
          fontFamily: font,
        }}
      >
        <main
          className="page-wrap"
          style={{
            maxWidth: 1280,
            margin: '0 auto',
            padding: '48px 40px 84px',
            flex: 1,
            width: '100%',
          }}
        >
          <section style={{ padding: '18px 0 58px' }}>
            <SectionTag>ДОЛУЧИТИСЯ</SectionTag>


            <div
              className="hero-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: '1.1fr 0.9fr',
                gap: 24,
                alignItems: 'stretch',
              }}
            >
              <div>
                <h1
                  className="hero-title"
                  style={{
                    fontSize: 60,
                    lineHeight: 1.03,
                    margin: '0 0 18px',
                    letterSpacing: -2,
                    fontFamily: "'Merriweather', serif",
                  }}
                >
                  Допоможи тваринам знайти
                  <br />
                  <span style={{ color: '#ff6b2b' }}>турботу, безпеку, дім</span>
                </h1>


                <p style={{ color: '#8d8d8d', fontSize: 16, lineHeight: 1.9, maxWidth: 650, marginBottom: 28 }}>
                  SafeTails — місцева ініціатива зі Львова, Україна. Ми об'єднуємо
                  волонтерів, прийомні сім'ї та небайдужих людей, які хочуть допомогти
                  врятованим тваринам одужати та розпочати нове життя.
                </p>


                <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 26 }}>
                  <a
                    href="#volunteer-form"
                    style={{
                      textDecoration: 'none',
                      background: 'linear-gradient(90deg,#ff6b2b,#ff4500)',
                      color: '#fff',
                      borderRadius: 999,
                      padding: '14px 22px',
                      fontSize: 14,
                      fontWeight: 700,
                    }}
                  >
                    Стати волонтером
                  </a>


                  <a
                    href="#stories"
                    style={{
                      textDecoration: 'none',
                      background: '#171717',
                      color: '#fff',
                      border: '1px solid #2a2a2a',
                      borderRadius: 999,
                      padding: '14px 22px',
                      fontSize: 14,
                      fontWeight: 600,
                    }}
                  >
                    Історії успіху
                  </a>
                </div>


                <div
                  className="double-grid"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, minmax(0,1fr))',
                    gap: 14,
                  }}
                >
                  {[
                    ['3', 'Учасники команди'],
                    ['Львів', 'Основна локація'],
                    ['24/7', 'Турбота та підтримка'],
                  ].map(([value, label]) => (
                    <div
                      key={label}
                      style={{
                        background: '#141414',
                        border: '1px solid #232323',
                        borderRadius: 18,
                        padding: '18px',
                      }}
                    >
                      <div style={{ color: '#ff6b2b', fontSize: 28, fontWeight: 700, marginBottom: 6 }}>
                        {value}
                      </div>
                      <div style={{ color: '#7c7c7c', fontSize: 12, lineHeight: 1.7 }}>
                        {label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>


              <div
                style={{
                  background: 'linear-gradient(145deg,#1a1411,#2b1d17)',
                  border: '1px solid #2b201c',
                  borderRadius: 28,
                  padding: 28,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ fontSize: 11, color: '#9d8a80', letterSpacing: 2, fontFamily: mono, marginBottom: 18 }}>
                    ЯК ВИ МОЖЕТЕ ДОПОМОГТИ
                  </div>


                  <div style={{ display: 'grid', gap: 12 }}>
                    {[
                      'Волонтерити з координацією та підтримкою щодня',
                      'Стати прийомною сім\'єю для тварини',
                      'Допомагати з транспортуванням та логістикою',
                      'Підтримувати комунікацію та поширення інформації',
                    ].map((item) => (
                      <div
                        key={item}
                        style={{
                          background: '#171312',
                          border: '1px solid #2b2320',
                          borderRadius: 16,
                          padding: '14px 16px',
                          color: '#d2c3bb',
                          fontSize: 14,
                        }}
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>


                <div
                  style={{
                    marginTop: 20,
                    background: '#120f0f',
                    border: '1px solid #2b2320',
                    borderRadius: 18,
                    padding: 18,
                  }}
                >
                  <div style={{ color: '#fff', fontSize: 18, fontWeight: 700, marginBottom: 8, fontFamily: "'Merriweather', serif" }}>
                    Маленька команда — реальний вплив
                  </div>
                  <p style={{ color: '#8b7f79', fontSize: 13, lineHeight: 1.8, margin: 0 }}>
                    Кожен волонтер, прийомна сім'я та небайдуже повідомлення важливі.
                    Навіть одна маленька дія може змінити майбутнє тварини.
                  </p>
                </div>
              </div>
            </div>
          </section>


          <section id="volunteer-form" style={{ padding: '10px 0 70px' }}>
            <SectionTag>ВОЛОНТЕР / ПРИЙОМНА СІМ'Я</SectionTag>


            <div
              className="form-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: '0.92fr 1.08fr',
                gap: 24,
              }}
            >
              <div
                style={{
                  background: '#141414',
                  border: '1px solid #232323',
                  borderRadius: 24,
                  padding: 28,
                }}
              >
                <h2 style={{ fontSize: 36, margin: '0 0 14px', fontFamily: "'Merriweather', serif" }}>
                  Стань частиною SafeTails
                </h2>
                <p style={{ color: '#8a8a8a', fontSize: 14, lineHeight: 1.9, marginBottom: 24 }}>
                  Ми шукаємо людей, які хочуть допомагати тваринам через турботу, прийомний
                  догляд, транспортування та комунікацію. Заповни форму та розкажи, як хочеш
                  долучитися.
                </p>


                <div style={{ display: 'grid', gap: 12 }}>
                  {[
                    ['Волонтер', 'Підтримка щоденної роботи, комунікації та координації.'],
                    ['Прийомна сім\'я', 'Тимчасовий догляд за твариною перед тим, як вона знайде дім.'],
                    ['Транспорт', 'Допомога з перевезенням тварин або припасів за потреби.'],
                    ['Інша допомога', 'Долучайся з будь-якими навичками або підтримкою.'],
                  ].map(([title, text]) => (
                    <div
                      key={title}
                      style={{
                        background: '#181818',
                        border: '1px solid #272727',
                        borderRadius: 18,
                        padding: '16px 18px',
                      }}
                    >
                      <div style={{ color: '#fff', fontSize: 16, fontWeight: 700, marginBottom: 6 }}>
                        {title}
                      </div>
                      <div style={{ color: '#7c7c7c', fontSize: 13, lineHeight: 1.7 }}>
                        {text}
                      </div>
                    </div>
                  ))}
                </div>
              </div>


              <form
                style={{
                  background: '#151515',
                  border: '1px solid #242424',
                  borderRadius: 24,
                  padding: 28,
                }}
              >
                <h2 style={{ fontSize: 32, margin: '0 0 18px', fontFamily: "'Merriweather', serif" }}>
                  Форма заявки
                </h2>


                <div
                  className="double-grid"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 14,
                    marginBottom: 14,
                  }}
                >
                  <input
                    name="fullName"
                    value={form.fullName}
                    onChange={onChange}
                    placeholder="Повне ім'я"
                    style={inputStyle}
                  />
                  <input
                    name="city"
                    value={form.city}
                    onChange={onChange}
                    placeholder="Місто"
                    style={inputStyle}
                  />
                </div>


                <div
                  className="double-grid"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 14,
                    marginBottom: 14,
                  }}
                >
                  <input
                    name="contact"
                    value={form.contact}
                    onChange={onChange}
                    placeholder="Телефон або email"
                    style={inputStyle}
                  />
                  <select
                    name="helpType"
                    value={form.helpType}
                    onChange={onChange}
                    style={inputStyle}
                  >
                    <option>Волонтер</option>
                    <option>Прийомна сім'я</option>
                    <option>Транспорт</option>
                    <option>Інше</option>
                  </select>
                </div>


                <input
                  name="availability"
                  value={form.availability}
                  onChange={onChange}
                  placeholder="Доступність"
                  style={{ ...inputStyle, marginBottom: 14 }}
                />


                <input
                  name="experience"
                  value={form.experience}
                  onChange={onChange}
                  placeholder="Досвід з тваринами"
                  style={{ ...inputStyle, marginBottom: 14 }}
                />


                <textarea
                  name="note"
                  value={form.note}
                  onChange={onChange}
                  placeholder="Розкажи, як хочеш допомогти"
                  rows={6}
                  style={{ ...inputStyle, resize: 'vertical', paddingTop: 14, marginBottom: 18 }}
                />


                <button
                  type="button"
                  style={{
                    width: '100%',
                    background: 'linear-gradient(90deg,#ff6b2b,#ff4500)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 18,
                    padding: '15px 18px',
                    fontSize: 15,
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontFamily: font,
                  }}
                >
                  Надіслати заявку
                </button>
              </form>
            </div>
          </section>


          <section id="stories" style={{ padding: '10px 0 70px' }}>
            <SectionTag>ІСТОРІЇ УСПІХУ</SectionTag>


            <div style={{ marginBottom: 22 }}>
              <h2 style={{ fontSize: 40, margin: '0 0 12px', fontFamily: "'Merriweather', serif" }}>
                Історії з теплим фіналом
              </h2>
              <p style={{ color: '#8a8a8a', fontSize: 14, lineHeight: 1.9, maxWidth: 720 }}>
                Порятунок — це не лише про надзвичайні ситуації. Це також про зцілення,
                терпіння, довіру та людей, які допомагають тваринам перейти від страху до безпеки.
              </p>
            </div>


            <div
              className="stories-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, minmax(0,1fr))',
                gap: 20,
              }}
            >
              <StoryCard
                title="Луна"
                text="Луна потребувала спокійного догляду та часу, щоб знову навчитися довіряти людям. З підтримкою і терпінням вона одужала та знайшла люблячу сім'ю."
                status="Одужала та знайшла дім"
                bg="linear-gradient(160deg,#111224,#20233f)"
              />
              <StoryCard
                title="Рекс"
                text="Рекс прийшов втомленим і тривожним. Крок за кроком волонтери допомогли йому відновити впевненість і підготуватися до нового дому."
                status="За підтримки волонтерів"
                bg="linear-gradient(160deg,#925d2b,#d29d56)"
              />
              <StoryCard
                title="Міа"
                text="Міа була зовсім маленькою і потребувала прийомного догляду. Тимчасовий дім дав їй безпеку, а згодом вона знайшла постійну сім'ю."
                status="Успішна прийомна сім'я"
                bg="linear-gradient(160deg,#7d3c31,#b96b56)"
              />
            </div>
          </section>


          <section id="about-team" style={{ padding: '10px 0 84px' }}>
            <SectionTag>ПРО НАС / КОМАНДА</SectionTag>


            <div
              className="about-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 24,
                marginBottom: 22,
              }}
            >
              <div
                style={{
                  background: '#141414',
                  border: '1px solid #232323',
                  borderRadius: 24,
                  padding: 28,
                }}
              >
                <h2 style={{ fontSize: 36, margin: '0 0 14px', fontFamily: "'Merriweather', serif" }}>
                  Хто ми
                </h2>
                <p style={{ color: '#8b8b8b', fontSize: 14, lineHeight: 1.9, marginBottom: 18 }}>
                  SafeTails — ініціатива з порятунку тварин, що базується у Львові, Україна.
                  Ми допомагаємо тваринам через підтримку, догляд, можливості прийомних сімей
                  та пошук безпечних домівок.
                </p>
                <p style={{ color: '#8b8b8b', fontSize: 14, lineHeight: 1.9, marginBottom: 18 }}>
                  Наша команда невелика, але ми глибоко переймаємося створенням кращого
                  майбутнього для тварин, яким потрібна допомога.
                </p>


                <div
                  className="double-grid"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, minmax(0,1fr))',
                    gap: 14,
                    marginTop: 20,
                  }}
                >
                  {[
                    ['Місія', 'Рятувати, доглядати та знаходити дім для тварин'],
                    ['Напрямок', 'Підтримка, прийомні сім\'ї та безпечний прихисток'],
                    ['Локація', 'Львів, Україна'],
                    ['Команда', '3 основні учасники'],
                  ].map(([k, v]) => (
                    <div
                      key={k}
                      style={{
                        background: '#181818',
                        border: '1px solid #262626',
                        borderRadius: 16,
                        padding: '14px 16px',
                      }}
                    >
                      <div style={{ color: '#6f6f6f', fontSize: 11, fontFamily: mono, letterSpacing: 1, marginBottom: 8 }}>
                        {k}
                      </div>
                      <div style={{ color: '#fff', fontSize: 14 }}>{v}</div>
                    </div>
                  ))}
                </div>
              </div>


              <div
                style={{
                  background: '#141414',
                  border: '1px solid #232323',
                  borderRadius: 24,
                  padding: 28,
                }}
              >
                <h2 style={{ fontSize: 36, margin: '0 0 14px', fontFamily: "'Merriweather', serif" }}>
                  Зв'яжіться з нами
                </h2>
                <p style={{ color: '#8b8b8b', fontSize: 14, lineHeight: 1.9, marginBottom: 20 }}>
                  Якщо ви хочете стати волонтером, підтримати проєкт або дізнатися про
                  прийомний догляд — зв'яжіться з нами напряму.
                </p>


                <div style={{ display: 'grid', gap: 14 }}>
                  <div style={contactCardStyle}>
                    <div style={contactLabelStyle}>EMAIL</div>
                    <a
                      href="mailto:safetails.rescue@gmail.com"
                      style={{ color: '#ff6b2b', textDecoration: 'none', fontSize: 15 }}
                    >
                      safetails.rescue@gmail.com
                    </a>
                  </div>


                  <div style={contactCardStyle}>
                    <div style={contactLabelStyle}>ТЕЛЕФОН</div>
                    <a
                      href="tel:0637776633"
                      style={{ color: '#fff', textDecoration: 'none', fontSize: 15 }}
                    >
                      0637776633
                    </a>
                  </div>


                  <div style={contactCardStyle}>
                    <div style={contactLabelStyle}>АДРЕСА</div>
                    <div style={{ color: '#fff', fontSize: 15 }}>
                      Україна, Львів, вул. Шевченка, 20
                    </div>
                  </div>
                </div>
              </div>
            </div>


            <div
              className="team-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, minmax(0,1fr))',
                gap: 18,
              }}
            >
              <TeamCard name="Ольга" role="Координація та підтримка" />
              <TeamCard name="Юліана" role="Комунікація з волонтерами" />
              <TeamCard name="Анна" role="Догляд за тваринами" />
            </div>
          </section>
        </main>


        <Footer />
      </div>
    </>
  )
}


const inputStyle = {
  width: '100%',
  background: '#101010',
  color: '#fff',
  border: '1px solid #262626',
  borderRadius: 16,
  padding: '14px 16px',
  fontSize: 14,
  fontFamily: font,
}


const contactCardStyle = {
  background: '#181818',
  border: '1px solid #262626',
  borderRadius: 16,
  padding: '16px 18px',
}


const contactLabelStyle = {
  color: '#6f6f6f',
  fontSize: 11,
  fontFamily: mono,
  letterSpacing: 1,
  marginBottom: 8,
}