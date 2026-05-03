import { useState } from 'react'

const font = "'DM Sans', 'Inter', sans-serif"
const mono = "'DM Mono', 'Courier New', monospace"

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
              A tactical approach to animal welfare. Precision logistics meets radical empathy
              for the voiceless. Sector 7 Delta Ops.
            </p>
          </div>

          <FooterColumn title="COMMAND" links={['Dashboard', 'Active Feed', 'Dispatch']} />
          <FooterColumn title="IMPACT" links={['Adoptions', 'Medical Log', 'Archive']} />
          <FooterColumn title="SUPPORT" links={['Help Center', 'Donate', 'Volunteer']} />
          <FooterColumn title="LEGAL" links={['Privacy', 'Terms']} />
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
            © 2024 Command Center Delta. Operative Network. All rights reserved.
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
    helpType: 'Volunteer',
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
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;1,700&family=DM+Mono:wght@400;500&display=swap');

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
            <SectionTag>GET INVOLVED</SectionTag>

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
                  }}
                >
                  Help Animals Find
                  <br />
                  <span style={{ color: '#ff6b2b' }}>Care, Safety, Home</span>
                </h1>

                <p style={{ color: '#8d8d8d', fontSize: 16, lineHeight: 1.9, maxWidth: 650, marginBottom: 28 }}>
                  SafeTails is a local initiative from Lviv, Ukraine. We bring together
                  volunteers, foster families, and caring people who want to help rescued
                  animals recover and start a new life.
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
                    Join as Volunteer
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
                    View Stories
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
                    ['3', 'Core team members'],
                    ['Lviv', 'Main location'],
                    ['24/7', 'Care and support mindset'],
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
                    HOW YOU CAN HELP
                  </div>

                  <div style={{ display: 'grid', gap: 12 }}>
                    {[
                      'Volunteer with daily coordination and support',
                      'Become a foster home for an animal',
                      'Help with transport and logistics',
                      'Support communication and outreach',
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
                  <div style={{ color: '#fff', fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
                    Small team, real impact
                  </div>
                  <p style={{ color: '#8b7f79', fontSize: 13, lineHeight: 1.8, margin: 0 }}>
                    Every volunteer, foster family, and caring message matters. Even one small
                    action can change an animal’s future.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section id="volunteer-form" style={{ padding: '10px 0 70px' }}>
            <SectionTag>VOLUNTEER / FOSTER</SectionTag>

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
                <h2 style={{ fontSize: 36, margin: '0 0 14px' }}>Become part of SafeTails</h2>
                <p style={{ color: '#8a8a8a', fontSize: 14, lineHeight: 1.9, marginBottom: 24 }}>
                  We are looking for people who want to help animals through care, foster
                  support, transport, and communication. Fill in the form and tell us how you
                  would like to join.
                </p>

                <div style={{ display: 'grid', gap: 12 }}>
                  {[
                    ['Volunteer', 'Support daily work, communication, and coordination.'],
                    ['Foster', 'Temporarily care for an animal before adoption.'],
                    ['Transport', 'Help move animals or supplies when needed.'],
                    ['Other help', 'Join with any skill or support you can offer.'],
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
                <h2 style={{ fontSize: 32, margin: '0 0 18px' }}>Application form</h2>

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
                    placeholder="Full name"
                    style={inputStyle}
                  />
                  <input
                    name="city"
                    value={form.city}
                    onChange={onChange}
                    placeholder="City"
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
                    placeholder="Phone or email"
                    style={inputStyle}
                  />
                  <select
                    name="helpType"
                    value={form.helpType}
                    onChange={onChange}
                    style={inputStyle}
                  >
                    <option>Volunteer</option>
                    <option>Foster</option>
                    <option>Transport</option>
                    <option>Other</option>
                  </select>
                </div>

                <input
                  name="availability"
                  value={form.availability}
                  onChange={onChange}
                  placeholder="Availability"
                  style={{ ...inputStyle, marginBottom: 14 }}
                />

                <input
                  name="experience"
                  value={form.experience}
                  onChange={onChange}
                  placeholder="Experience with animals"
                  style={{ ...inputStyle, marginBottom: 14 }}
                />

                <textarea
                  name="note"
                  value={form.note}
                  onChange={onChange}
                  placeholder="Tell us how you would like to help"
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
                  Submit application
                </button>
              </form>
            </div>
          </section>

          <section id="stories" style={{ padding: '10px 0 70px' }}>
            <SectionTag>SUCCESS STORIES</SectionTag>

            <div style={{ marginBottom: 22 }}>
              <h2 style={{ fontSize: 40, margin: '0 0 12px' }}>Stories with a warm ending</h2>
              <p style={{ color: '#8a8a8a', fontSize: 14, lineHeight: 1.9, maxWidth: 720 }}>
                Rescue is not only about emergencies. It is also about healing, patience,
                trust, and the people who help animals move from fear to safety.
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
                title="Luna"
                text="Luna needed calm care and time to trust people again. With support and patience, she recovered and found a loving family."
                status="Recovered and adopted"
                bg="linear-gradient(160deg,#111224,#20233f)"
              />
              <StoryCard
                title="Rex"
                text="Rex arrived tired and anxious. Step by step, volunteers helped him regain confidence and prepare for a new home."
                status="Supported by volunteers"
                bg="linear-gradient(160deg,#925d2b,#d29d56)"
              />
              <StoryCard
                title="Mia"
                text="Mia was very small and needed foster care. A temporary home gave her safety, and later she found a permanent family."
                status="Foster success story"
                bg="linear-gradient(160deg,#7d3c31,#b96b56)"
              />
            </div>
          </section>

          <section id="about-team" style={{ padding: '10px 0 84px' }}>
            <SectionTag>ABOUT / TEAM</SectionTag>

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
                <h2 style={{ fontSize: 36, margin: '0 0 14px' }}>Who we are</h2>
                <p style={{ color: '#8b8b8b', fontSize: 14, lineHeight: 1.9, marginBottom: 18 }}>
                  SafeTails is an animal rescue initiative based in Lviv, Ukraine. We focus on helping
                  animals through support, care, foster opportunities, and finding safe homes.
                </p>
                <p style={{ color: '#8b8b8b', fontSize: 14, lineHeight: 1.9, marginBottom: 18 }}>
                  Our team is small, but we care deeply about creating a better future for animals in
                  need through rescue, coordination, and community support.
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
                    ['Mission', 'Rescue, care, and rehome animals'],
                    ['Focus', 'Support, fostering, and safe adoption'],
                    ['Based in', 'Lviv, Ukraine'],
                    ['Team', '3 core members'],
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
                <h2 style={{ fontSize: 36, margin: '0 0 14px' }}>Contact us</h2>
                <p style={{ color: '#8b8b8b', fontSize: 14, lineHeight: 1.9, marginBottom: 20 }}>
                  If you want to become a volunteer, support the project, or ask about foster care,
                  you can reach us directly.
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
                    <div style={contactLabelStyle}>PHONE</div>
                    <a
                      href="tel:0637776633"
                      style={{ color: '#fff', textDecoration: 'none', fontSize: 15 }}
                    >
                      0637776633
                    </a>
                  </div>

                  <div style={contactCardStyle}>
                    <div style={contactLabelStyle}>ADDRESS</div>
                    <div style={{ color: '#fff', fontSize: 15 }}>
                      Ukraine, Lviv, вул. Шевченка, 20
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
              <TeamCard name="Ольга" role="Coordination and support" />
              <TeamCard name="Юліана" role="Volunteer communication" />
              <TeamCard name="Анна" role="Animal care support" />
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