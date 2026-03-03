import { useState } from 'react'
import './App.css'

const categories = [
  { label: 'Pants', angle: -120 },
  { label: 'Denim', angle: -60 },
  { label: 'Joggers', angle: 0 },
  { label: 'Shorts', angle: 60 },
  { label: 'New Arrivals', angle: 120 },
]

function App() {
  const [hovered, setHovered] = useState(false)

  return (
    <div className="app">
      <header className="header">
        <div className="brand">METHOD IN MADNESS</div>
        <nav className="nav">
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
          <button className="cart-btn" aria-label="Cart">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
          </button>
        </nav>
      </header>

      <main className="hero">
        <div
          className="shop-container"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {categories.map((cat, i) => (
            <a
              key={cat.label}
              href={`#${cat.label.toLowerCase().replace(' ', '-')}`}
              className={`tab-option ${hovered ? 'visible' : ''}`}
              style={{
                '--angle': `${cat.angle}deg`,
                '--delay': `${i * 0.05}s`,
              } as React.CSSProperties}
            >
              {cat.label}
            </a>
          ))}
          <button className="shop-btn">SHOP</button>
        </div>
      </main>

      <footer className="footer">
        <span>&copy; 2026 Method In Madness</span>
      </footer>
    </div>
  )
}

export default App
