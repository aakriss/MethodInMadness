import { useState } from 'react'
import './App.css'

/* ── Types ── */
interface Product {
  id: string
  name: string
  price: number
  category: string
  description: string
  sizes: string[]
  color: string
  image: string
  imgHeight: 'short' | 'medium' | 'tall'
  nudge: number // vertical offset in px for scattered feel
  width: number // percentage width within column (60-90)
}

interface CartItem {
  product: Product
  size: string
  qty: number
}

type Page = 'home' | 'shop' | 'product' | 'about' | 'contact'

/* ── Placeholder Products ── */
const products: Product[] = [
  { id: '1', name: 'Classic Straight Leg', price: 128, category: 'Pants', description: 'Clean lines, tailored fit. A wardrobe essential built for everyday wear with premium cotton twill.', sizes: ['S', 'M', 'L', 'XL'], color: '#2c2c2c', image: '/images/mim3.png', imgHeight: 'tall', nudge: 0, width: 82 },
  { id: '2', name: 'Raw Selvedge Denim', price: 185, category: 'Denim', description: 'Japanese selvedge denim, raw unwashed. Develops unique fading patterns over time.', sizes: ['S', 'M', 'L', 'XL'], color: '#1a2a3a', image: '/images/mim4.png', imgHeight: 'medium', nudge: 40, width: 70 },
  { id: '3', name: 'Midnight Jogger', price: 95, category: 'Joggers', description: 'Technical fabric meets street style. Tapered fit with ribbed cuffs and hidden zip pockets.', sizes: ['S', 'M', 'L', 'XL'], color: '#1a1a2e', image: '/images/mim5.png', imgHeight: 'short', nudge: 20, width: 75 },
  { id: '4', name: 'Washed Black Slim', price: 145, category: 'Denim', description: 'Washed black stretch denim with a slim silhouette. Comfortable all-day wear.', sizes: ['S', 'M', 'L', 'XL'], color: '#222222', image: '/images/mim6.png', imgHeight: 'tall', nudge: 60, width: 68 },
  { id: '5', name: 'Cargo Wide Leg', price: 158, category: 'Pants', description: 'Oversized cargo pockets on a wide-leg canvas pant. Relaxed, utilitarian, bold.', sizes: ['S', 'M', 'L', 'XL'], color: '#3a3a2e', image: '/images/mim7.png', imgHeight: 'medium', nudge: 10, width: 85 },
  { id: '6', name: 'French Terry Sweatpant', price: 88, category: 'Joggers', description: 'Heavyweight french terry with a relaxed drape. Elevated loungewear.', sizes: ['S', 'M', 'L', 'XL'], color: '#2e2e2e', image: '/images/mim8.png', imgHeight: 'tall', nudge: 50, width: 72 },
  { id: '7', name: 'Tailored Trouser Short', price: 78, category: 'Shorts', description: '7-inch inseam trouser short in structured cotton. Smart-casual summer essential.', sizes: ['S', 'M', 'L', 'XL'], color: '#3a3028', image: '/images/mim9.png', imgHeight: 'short', nudge: 30, width: 78 },
  { id: '8', name: 'Indigo Wash Straight', price: 165, category: 'Denim', description: 'Deep indigo wash on 14oz denim. Classic five-pocket construction.', sizes: ['S', 'M', 'L', 'XL'], color: '#182848', image: '/images/mim3.png', imgHeight: 'medium', nudge: 0, width: 65 },
  { id: '9', name: 'Ripstop Cargo Short', price: 72, category: 'Shorts', description: 'Durable ripstop nylon cargo short. Lightweight, quick-dry, ready for anything.', sizes: ['S', 'M', 'L', 'XL'], color: '#2a3a2a', image: '/images/mim5.png', imgHeight: 'short', nudge: 45, width: 80 },
  { id: '10', name: 'Pleated Wide Leg', price: 168, category: 'Pants', description: 'Double-pleated wide leg in Japanese cotton. Architectural silhouette.', sizes: ['S', 'M', 'L', 'XL'], color: '#1e1e1e', image: '/images/mim7.png', imgHeight: 'tall', nudge: 15, width: 74 },
]

const featuredIds = ['1', '2', '5', '7', '8']
const featuredAngles = [-120, -60, 0, 60, 120]

const filterCategories = ['All', 'Pants', 'Denim', 'Joggers', 'Shorts']

function App() {
  const [page, setPage] = useState<Page>('home')
  const [shopHovered, setShopHovered] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [selectedSize, setSelectedSize] = useState('')
  const [activeFilter, setActiveFilter] = useState('All')
  const [cart, setCart] = useState<CartItem[]>([])
  const [cartOpen, setCartOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0)
  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.qty, 0)

  const filteredProducts = activeFilter === 'All'
    ? products
    : products.filter(p => p.category === activeFilter)

  function navigate(p: Page, filter?: string) {
    setPage(p)
    if (filter) setActiveFilter(filter)
    setMenuOpen(false)
    window.scrollTo(0, 0)
  }

  function viewProduct(product: Product) {
    setSelectedProduct(product)
    setSelectedSize('')
    setPage('product')
    window.scrollTo(0, 0)
  }

  function addToCart() {
    if (!selectedProduct || !selectedSize) return
    setCart(prev => {
      const existing = prev.find(
        item => item.product.id === selectedProduct.id && item.size === selectedSize
      )
      if (existing) {
        return prev.map(item =>
          item.product.id === selectedProduct.id && item.size === selectedSize
            ? { ...item, qty: item.qty + 1 }
            : item
        )
      }
      return [...prev, { product: selectedProduct, size: selectedSize, qty: 1 }]
    })
    setCartOpen(true)
  }

  function removeFromCart(productId: string, size: string) {
    setCart(prev => prev.filter(item => !(item.product.id === productId && item.size === size)))
  }

  return (
    <div className="app">
      {/* ── Header ── */}
      <header className="header">
        <div className="brand" onClick={() => navigate('home')} role="button" tabIndex={0}>
          <img src="/images/mim2.png" alt="Method In Madness" className="brand-logo" />
        </div>

        <button
          className={`hamburger ${menuOpen ? 'active' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <span /><span /><span />
        </button>

        <nav className={`nav ${menuOpen ? 'open' : ''}`}>
          <a onClick={() => navigate('shop')}>Shop</a>
          <a onClick={() => navigate('about')}>About</a>
          <a onClick={() => navigate('contact')}>Contact</a>
          <button className="cart-btn" onClick={() => setCartOpen(true)} aria-label="Cart">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>
        </nav>
      </header>

      {/* ── Home ── */}
      {page === 'home' && (
        <main className="hero">
          <video
            className="hero-video"
            autoPlay
            loop
            muted
            playsInline
            src="/images/A38DE232-1A05-4750-A74C-146338B38ADC.MP4"
          />
          <div className="hero-overlay" />
          <div
            className="shop-container"
            onMouseEnter={() => setShopHovered(true)}
            onMouseLeave={() => setShopHovered(false)}
            onClick={() => setShopHovered(prev => !prev)}
          >
            {featuredIds.map((id, i) => {
              const p = products.find(prod => prod.id === id)!
              return (
                <div
                  key={id}
                  className={`tab-option ${shopHovered ? 'visible' : ''}`}
                  style={{
                    '--angle': `${featuredAngles[i]}deg`,
                    '--delay': `${i * 0.06}s`,
                  } as React.CSSProperties}
                  onClick={(e) => {
                    e.stopPropagation()
                    viewProduct(p)
                  }}
                >
                  <img src={p.image} alt={p.name} className="tab-product-img" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; (e.target as HTMLImageElement).parentElement!.style.backgroundColor = p.color }} />
                  <span className="tab-product-name">{p.name}</span>
                </div>
              )
            })}
            <button className="shop-btn" onClick={() => navigate('shop')}>
              <img src="/images/mim2.png" alt="Shop" className="shop-logo" />
            </button>
          </div>
        </main>
      )}

      {/* ── Shop ── */}
      {page === 'shop' && (
        <main className="page shop-page">
          <h1 className="page-title">Shop</h1>
          <div className="filter-bar">
            {filterCategories.map(cat => (
              <button
                key={cat}
                className={`filter-btn ${activeFilter === cat ? 'active' : ''}`}
                onClick={() => setActiveFilter(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="product-grid">
            {filteredProducts.map((product, i) => (
              <div
                key={product.id}
                className={`product-card ${i % 2 === 0 ? 'nudge-left' : 'nudge-right'}`}
                onClick={() => viewProduct(product)}
                style={{
                  '--i': i,
                  '--nudge': `${product.nudge}px`,
                  '--card-width': `${product.width}%`,
                } as React.CSSProperties}
              >
                <div className={`product-image img-${product.imgHeight}`}>
                  <img src={product.image} alt={product.name} className="product-img" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; (e.target as HTMLImageElement).parentElement!.style.backgroundColor = product.color }} />
                  <span className="product-image-label">{product.category}</span>
                </div>
                <div className="product-info">
                  <span className="product-name">{product.name}</span>
                  <span className="product-price">${product.price}</span>
                </div>
              </div>
            ))}
          </div>
        </main>
      )}

      {/* ── Product Detail ── */}
      {page === 'product' && selectedProduct && (
        <main className="page product-detail">
          <button className="back-btn" onClick={() => navigate('shop')}>
            &larr; Back to Shop
          </button>
          <div className="product-detail-layout">
            <div className="product-detail-image">
              <img src={selectedProduct.image} alt={selectedProduct.name} className="product-img detail-img" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; (e.target as HTMLImageElement).parentElement!.style.backgroundColor = selectedProduct.color }} />
            </div>
            <div className="product-detail-info">
              <h1 className="product-detail-name">{selectedProduct.name}</h1>
              <p className="product-detail-price">${selectedProduct.price}</p>
              <p className="product-detail-desc">{selectedProduct.description}</p>
              <div className="size-selector">
                <span className="size-label">Size</span>
                <div className="size-options">
                  {selectedProduct.sizes.map(size => (
                    <button
                      key={size}
                      className={`size-btn ${selectedSize === size ? 'active' : ''}`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
              <button
                className="add-to-cart-btn"
                onClick={addToCart}
                disabled={!selectedSize}
              >
                {selectedSize ? 'Add to Cart' : 'Select a Size'}
              </button>
            </div>
          </div>
        </main>
      )}

      {/* ── About ── */}
      {page === 'about' && (
        <main className="page about-page">
          <h1 className="page-title">About</h1>
          <div className="about-content">
            <p>
              Method In Madness was born from a simple belief: pants should be more than
              an afterthought. We obsess over every stitch, every fabric choice, every
              silhouette — because what you wear from the waist down defines how you move
              through the world.
            </p>
            <p>
              Founded in 2026, we work with small-batch manufacturers who share our
              commitment to quality over quantity. Each piece is designed to last, to age
              beautifully, and to become a part of your story.
            </p>
            <p>
              No trends. No shortcuts. Just pants, done right.
            </p>
          </div>
        </main>
      )}

      {/* ── Contact ── */}
      {page === 'contact' && (
        <main className="page contact-page">
          <h1 className="page-title">Contact</h1>
          <div className="contact-content">
            <p>We'd love to hear from you.</p>
            <div className="contact-details">
              <div className="contact-item">
                <span className="contact-label">Email</span>
                <span>hello@methodinmadness.com</span>
              </div>
              <div className="contact-item">
                <span className="contact-label">Instagram</span>
                <span>@methodinmadness</span>
              </div>
              <div className="contact-item">
                <span className="contact-label">Based in</span>
                <span>Los Angeles, CA</span>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* ── Footer ── */}
      <footer className="footer">
        <div className="footer-links">
          <a onClick={() => navigate('shop')}>Shop</a>
          <a onClick={() => navigate('about')}>About</a>
          <a onClick={() => navigate('contact')}>Contact</a>
        </div>
        <span className="footer-copy">&copy; 2026 Method In Madness</span>
      </footer>

      {/* ── Cart Sidebar ── */}
      <div className={`cart-overlay ${cartOpen ? 'visible' : ''}`} onClick={() => setCartOpen(false)} />
      <aside className={`cart-sidebar ${cartOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <h2>Cart</h2>
          <button className="cart-close" onClick={() => setCartOpen(false)}>&times;</button>
        </div>
        {cart.length === 0 ? (
          <p className="cart-empty">Your cart is empty.</p>
        ) : (
          <>
            <div className="cart-items">
              {cart.map(item => (
                <div key={`${item.product.id}-${item.size}`} className="cart-item">
                  <div className="cart-item-swatch" style={{ backgroundColor: item.product.color }} />
                  <div className="cart-item-details">
                    <span className="cart-item-name">{item.product.name}</span>
                    <span className="cart-item-meta">Size {item.size} &middot; Qty {item.qty}</span>
                    <span className="cart-item-price">${item.product.price * item.qty}</span>
                  </div>
                  <button
                    className="cart-item-remove"
                    onClick={() => removeFromCart(item.product.id, item.size)}
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
            <div className="cart-footer">
              <div className="cart-total">
                <span>Total</span>
                <span>${cartTotal}</span>
              </div>
              <button className="checkout-btn" disabled>Checkout Coming Soon</button>
            </div>
          </>
        )}
      </aside>
    </div>
  )
}

export default App
