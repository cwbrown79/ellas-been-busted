import React, { useState, useEffect } from 'react';

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
const [showAdminLogin, setShowAdminLogin] = useState(false);
const [showAdminDashboard, setShowAdminDashboard] = useState(false);
const [pendingPhotos, setPendingPhotos] = useState([]);
const [approvedPhotos, setApprovedPhotos] = useState([]);
const [showOldBusts, setShowOldBusts] = useState(false);
const [editingCropPhoto, setEditingCropPhoto] = useState(null);
const [cropX, setCropX] = useState(0);
const [cropY, setCropY] = useState(0);
const [cropZoom, setCropZoom] = useState(100);
const [isDraggingCrop, setIsDraggingCrop] = useState(false);
const [cropDragStart, setCropDragStart] = useState({ x: 0, y: 0 });
  const [savedPhotoCrops, setSavedPhotoCrops] = useState({});
  useEffect(() => {
  loadApprovedPhotos();
}, []);
const [adminPassword, setAdminPassword] = useState('');
const [adminLoginError, setAdminLoginError] = useState('');
 const [submitForm, setSubmitForm] = useState({
  photo: null,
  caption: '',
  category: 'Everyday',
  submittedBy: ''
});
  const handleAdminLogin = async () => {
  setAdminLoginError('');

  try {
    const response = await fetch('/api/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        password: adminPassword,
      }),
    });

    if (!response.ok) {
      setAdminLoginError('Incorrect password.');
      return;
    }

    setShowAdminLogin(false);
setShowAdminDashboard(true);
await loadPendingPhotos();
  } catch (error) {
    console.error('Admin login error:', error);
    setAdminLoginError('Unable to log in. Please try again.');
  }
};
async function loadPendingPhotos() {
  try {
    const response = await fetch('/api/admin/photos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        password: adminPassword,
      }),
    });

    if (!response.ok) {
      throw new Error('Unable to load pending photos');
    }

    const photos = await response.json();
    setPendingPhotos(photos);
  } catch (error) {
    console.error('Failed to load pending photos:', error);
    alert('Unable to load pending photos.');
  }
}

async function loadApprovedPhotos() {
  try {
    const response = await fetch('/api/photos');

    if (!response.ok) {
      throw new Error('Unable to load approved photos');
    }

    const photos = await response.json();
    setApprovedPhotos(photos);
  } catch (error) {
    console.error('Failed to load approved photos:', error);
  }
}
  
const handleApprovePhoto = async (photoId) => {
  try {
    const response = await fetch(`/api/admin/photos/${photoId}/approve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
     body: JSON.stringify({
  password: adminPassword,
  cropX: savedPhotoCrops[photoId]?.cropX ?? 0,
  cropY: savedPhotoCrops[photoId]?.cropY ?? 0,
  cropZoom: savedPhotoCrops[photoId]?.cropZoom ?? 100,
}),
    });

    if (!response.ok) {
      throw new Error('Unable to approve photo');
    }

    setPendingPhotos((photos) =>
      photos.filter((photo) => photo.id !== photoId)
    );
  await loadApprovedPhotos();
  } catch (error) {
    console.error('Failed to approve photo:', error);
    alert('Unable to approve photo.');
  }
};

const handleRejectPhoto = async (photoId) => {
  const confirmed = window.confirm(
    'Reject this photo? This will permanently delete it.'
  );

  if (!confirmed) {
    return;
  }

  try {
    const response = await fetch(`/api/admin/photos/${photoId}/reject`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        password: adminPassword,
      }),
    });

    if (!response.ok) {
      throw new Error('Unable to reject photo');
    }

    setPendingPhotos((photos) =>
      photos.filter((photo) => photo.id !== photoId)
    );
  } catch (error) {
    console.error('Failed to reject photo:', error);
    alert('Unable to reject photo.');
  }
};
  
  const handleSubmitPhoto = async () => {
  if (!submitForm.photo) {
    alert('Please choose a photo.');
    return;
  }

  try {
    const formData = new FormData();
    formData.append('photo', submitForm.photo);
    formData.append('caption', submitForm.caption);
    formData.append('category', submitForm.category);
    formData.append('submittedBy', submitForm.submittedBy);

    const response = await fetch('/api/photos', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    alert('Photo submitted! It will appear after approval.');

    setSubmitForm({
      photo: null,
      caption: '',
      category: 'Everyday',
      submittedBy: ''
    });

    setShowSubmitForm(false);
  } catch (error) {
    console.error(error);
    alert('There was a problem submitting the photo. Please try again.');
  }
};
  
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
        <button
  className="admin-button"
  type="button"
  onClick={() => setShowAdminLogin(true)}
>
  Admin Login
</button>
      </header>
{showAdminLogin && (
  <div className="admin-login-overlay">
    <div className="admin-login-box">
      <h2>Admin Login</h2>
      <p>Enter the admin password to manage submitted photos.</p>

    <input
  type="password"
  placeholder="Password"
  value={adminPassword}
  onChange={(e) => setAdminPassword(e.target.value)}
  onKeyDown={(e) => {
    if (e.key === 'Enter') {
      handleAdminLogin();
    }
  }}
/>

{adminLoginError && (
  <p className="admin-login-error">{adminLoginError}</p>
)}

      <div className="admin-login-actions">
        <button
  className="button light"
  type="button"
  onClick={handleAdminLogin}
>
  Login
</button>

        <button
          className="button"
          type="button"
          onClick={() => setShowAdminLogin(false)}
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}

{editingCropPhoto && (
  <div className="admin-crop-overlay">
    <div className="admin-crop-box">
      <h2>Adjust Photo</h2>

      <p>
        Adjust how this photo will appear in the gallery.
        The original photo will not be changed.
      </p>

    <div
  className="admin-crop-preview"
  onMouseDown={(e) => {
    e.preventDefault();
    setIsDraggingCrop(true);
    setCropDragStart({
      x: e.clientX - cropX,
      y: e.clientY - cropY
    });
  }}
  onMouseMove={(e) => {
    if (!isDraggingCrop) return;

    setCropX(e.clientX - cropDragStart.x);
    setCropY(e.clientY - cropDragStart.y);
  }}
  onMouseUp={() => setIsDraggingCrop(false)}
  onMouseLeave={() => setIsDraggingCrop(false)}
  style={{
    cursor: isDraggingCrop ? 'grabbing' : 'grab'
  }}
>
  <img
    src={`/uploads/${editingCropPhoto.filename}`}
    alt={editingCropPhoto.caption || 'Photo crop preview'}
    draggable="false"
    style={{
      transform: `translate(${cropX}px, ${cropY}px) scale(${cropZoom / 100})`
    }}
  />
</div>

<div className="crop-zoom-controls">
  <button
    className="button"
    type="button"
    onClick={() => setCropZoom((z) => Math.max(50, z - 10))}
  >
    −
  </button>

  <span>{cropZoom}%</span>

  <button
    className="button"
    type="button"
    onClick={() => setCropZoom((z) => Math.min(250, z + 10))}
  >
    +
  </button>
</div>
      <div className="admin-crop-actions">
        <button
          className="button light"
          type="button"
         onClick={() => {
  setSavedPhotoCrops((current) => ({
    ...current,
    [editingCropPhoto.id]: {
      cropX,
      cropY,
      cropZoom,
    },
  }));
  setEditingCropPhoto(null);
}}
        >
          Save Position
        </button>

        <button
          className="button"
          type="button"
          onClick={() => {
            setEditingCropPhoto(null);
           setCropX(0);
setCropY(0);
            setCropZoom(100);
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}
      
{showAdminDashboard && (
  <div className="admin-dashboard-overlay">
    <div className="admin-dashboard">
      <div className="admin-dashboard-header">
        <div>
          <h2>Photo Approvals</h2>
          <p>Review photos submitted to Ella's Been Busted.</p>
        </div>

        <button
          className="button"
          type="button"
          onClick={() => {
            setShowAdminDashboard(false);
            setAdminPassword('');
            setPendingPhotos([]);
          }}
        >
          Log Out
        </button>
      </div>

      {pendingPhotos.length === 0 ? (
        <p>No photos are waiting for approval.</p>
      ) : (
        <div className="admin-photo-grid">
          {pendingPhotos.map((photo) => (
            <div className="admin-photo-card" key={photo.id}>
              <img
                src={`/uploads/${photo.filename}`}
                alt={photo.caption || 'Submitted Ella photo'}
              />

              <h3>{photo.caption || 'Untitled Photo'}</h3>

              <p>
                <strong>Category:</strong> {photo.category}
              </p>

              {photo.submitted_by && (
                <p>
                  <strong>Submitted by:</strong> {photo.submitted_by}
                </p>
              )}

              <div className="admin-photo-actions">
  <button
    className="button light"
    type="button"
    onClick={() => {
     setEditingCropPhoto(photo);
setCropX(0);
setCropY(0);
setCropZoom(100);
    }}
  >
    Adjust Photo
  </button>

  <button
    className="button light"
    type="button"
    onClick={() => handleApprovePhoto(photo.id)}
  >
    Approve
  </button>

  <button
    className="button"
    type="button"
    onClick={() => handleRejectPhoto(photo.id)}
  >
    Reject
  </button>
</div>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
)}
      
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
  {approvedPhotos.length > 0 ? (
  approvedPhotos.slice(0, 20).map((photo) => (
      <article className="photo-card" key={photo.id}>
       <div className="gallery-photo-frame">
  <img
    src={`/uploads/${photo.filename}`}
    alt={photo.caption || "Ella photo"}
    className="gallery-photo"
    style={{
      transform: `translate(${photo.crop_x ?? 0}px, ${photo.crop_y ?? 0}px) scale(${(photo.crop_zoom ?? 100) / 100})`,
    }}
  />
</div>
        <div className="photo-copy">
          <p className="photo-tag">{photo.category || "Everyday"}</p>
          <h3>{photo.caption || "Ella's Been Busted"}</h3>
        </div>
      </article>
    ))
  ) : (
    recentBusts.map((item, index) => (
      <PhotoPlaceholder key={item.title} index={index} {...item} />
    ))
  )}
</div>
        </section>

        <section className="submit-banner" id="submit">
         <div className="polaroids" aria-hidden="true">
  <div className="polaroid p1">
    <img src="/ella-then.jpg" alt="" />
    <span>Then</span>
  </div>
  <div className="polaroid p2">
    <img src="/ella-now.jpg" alt="" />
    <span>Now</span>
  </div>
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
       <button
  className="button light"
  type="button"
  onClick={handleSubmitPhoto}
>
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
