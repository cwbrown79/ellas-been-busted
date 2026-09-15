import React, { useState } from 'react';

const recentBusts = [
  { title: 'Sunsets suit you', tag: 'Beach' },
  { title: 'Weekend evidence', tag: 'Friends' },
  { title: 'Partners in crime', tag: 'Family' },
  { title: 'Game day behavior', tag: 'College' },
  { title: 'Some things never change', tag: 'Throwback' },
  { title: 'Good people, great memories', tag: 'Friends' },
  { title: 'Caught smiling', tag: 'Everyday' },
  { title: 'Same girl. New adventure.', tag: 'Travel' }
];

function PhotoPlaceholder({ index, title, tag }) {
  return (
    <article className={`photo-card photo-${(index % 6) + 1}`}>
      <div className="photo-placeholder">
        <span>Ella Photo</span>
      </div>
      <div className="photo-copy">
        <p className="photo-tag">{tag}</p>
        <h3>{title}</h3>
      </div>
    </article>
  );
}

export default function App() {
    const [showSubmitForm, setShowSubmitForm] = useState(false);
 const [submitForm, setSubmitForm] = useState({
  photo: null,
  caption: '',
  category: 'Everyday',
  submittedBy: ''
});
  
  return (
    <div className="site-shell">
      <header className="topbar">
        <a className="brand" href="#home">Ella's Been Busted <span>♡</span></a>
        <nav className="nav">
          <a href="#home">Home</a>
          <a href="#gallery">Gallery</a>
          <a href="#submit">Submit a Photo</a>
          <a href="#about">About</a>
        </nav>
        <button className="admin-button" type="button">Admin Login</button>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="hero-photo">
  <video
    className="hero-video"
    autoPlay
    muted
    loop
    playsInline
  >
    <source src="/ella-hero.mp4" type="video/mp4" />
  </video>
</div>

          <div className="hero-overlay">
            <p className="eyebrow">Same girl. Different stories.</p>
            <h1>Ella's Been<br/>Busted <span>♡</span></h1>
            <p className="hero-text">
              A collection of the moments, memories, and mischief that make Ella... Ella.
            </p>
            <div className="hero-actions">
              <a className="button primary" href="#gallery">View Gallery →</a>
              <a className="button secondary" href="#submit">Submit a Photo</a>
            </div>
          </div>
        </section>

        <section className="features">
          <div><strong>Capture</strong><span>Funny, candid, and unforgettable moments.</span></div>
          <div><strong>Share</strong><span>Have a photo to share? Send it in.</span></div>
          <div><strong>Remember</strong><span>Keep all those great Ella memories together.</span></div>
          <div><strong>Enjoy</strong><span>New photos and throwbacks added regularly.</span></div>
        </section>

        <section className="gallery-section" id="gallery">
          <div className="section-heading">
            <div>
              <p className="eyebrow">The latest evidence</p>
              <h2>Recent Busts</h2>
            </div>
            <a href="#gallery">View full gallery →</a>
          </div>

          <div className="photo-grid">
            {recentBusts.map((item, index) => (
              <PhotoPlaceholder key={item.title} index={index} {...item} />
            ))}
          </div>
        </section>

        <section className="submit-banner" id="submit">
          <div className="polaroids" aria-hidden="true">
            <div className="polaroid p1"><span>Then</span></div>
            <div className="polaroid p2"><span>Now</span></div>
          </div>
          <div className="submit-copy">
            <p className="eyebrow">Have a photo?</p>
            <h2>Submit a Bust</h2>
            <p>Help keep the memories going. Visitor submissions will be reviewed before appearing in the gallery.</p>
            <button
  className="button light"
  type="button"
  onClick={() => setShowSubmitForm(true)}
>
  Submit a Photo →
</button>
          </div>
        </section>
{showSubmitForm && (
  <section className="submit-form-section">
    <div className="submit-form">
      <h2>Submit a Photo</h2>
      <p>Share your favorite Ella moment.</p>

      <label>
        Photo
        <input
          type="file"
          accept="image/*"
          onChange={(e) =>
            setSubmitForm({ ...submitForm, photo: e.target.files[0] })
          }
        />
      </label>

      <label>
        Caption
        <input
          type="text"
          value={submitForm.caption}
          onChange={(e) =>
            setSubmitForm({ ...submitForm, caption: e.target.value })
          }
          placeholder="What was Ella caught doing?"
        />
      </label>

      <label>
        Category
        <select
          value={submitForm.category}
          onChange={(e) =>
            setSubmitForm({ ...submitForm, category: e.target.value })
          }
        >
          <option>Everyday</option>
          <option>Friends</option>
          <option>Family</option>
          <option>College</option>
          <option>Beach</option>
          <option>Travel</option>
          <option>Throwback</option>
        </select>
      </label>

      <label>
        Submitted By
        <input
          type="text"
          value={submitForm.submittedBy}
          onChange={(e) =>
            setSubmitForm({ ...submitForm, submittedBy: e.target.value })
          }
          placeholder="Your name"
        />
      </label>

      <div className="submit-form-actions">
        <button className="button light" type="button">
          Submit Photo →
        </button>

        <button
          className="button"
          type="button"
          onClick={() => setShowSubmitForm(false)}
        >
          Cancel
        </button>
      </div>
    </div>
  </section>
)}
        
        <section className="about" id="about">
          <p className="eyebrow">About the site</p>
          <h2>Good people. Great memories.</h2>
          <p>
            Ella's Been Busted is a family-and-friends photo collection built for the funny,
            sweet, ridiculous, and unforgettable moments worth keeping.
          </p>
        </section>
      </main>

      <footer>
        <div className="footer-brand">Ella's Been Busted ♡</div>
        <div className="footer-links">
          <a href="#home">Home</a>
          <a href="#gallery">Gallery</a>
          <a href="#submit">Submit</a>
          <a href="#about">About</a>
        </div>
        <p>Good people. Great memories.</p>
      </footer>
    </div>
  );
}
