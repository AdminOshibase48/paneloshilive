import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Home.css';

const Home = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/packages`);
      setPackages(response.data);
    } catch (err) {
      setError('Failed to load packages');
      console.error('Error fetching packages:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1>OSHI<span>LIVE</span>48</h1>
              <h2>OFFICIAL STREAMING</h2>
              <p>Nikmati streaming pertunjukan Theater JKT48 dengan kualitas premium dan harga terjangkau.</p>
              <div className="hero-buttons">
                <a href="/streaming" className="btn btn-primary">
                  <i className="fas fa-play"></i> Watch Now
                </a>
                <a href="#packages" className="btn btn-outline">
                  <i className="fas fa-crown"></i> Gabung Member
                </a>
              </div>
            </div>
            <div className="hero-image">
              <img src="https://res.cloudinary.com/haymzm4wp/image/upload/v1746940686/gnzangtum7a8ygmk8hvj.jpg" alt="JKT48 Theater" className="floating" />
            </div>
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section id="packages" className="packages">
        <div className="container">
          <h2 className="section-title">Paket <span>Membership</span></h2>
          <p className="section-subtitle">Pilih paket yang sesuai dengan kebutuhan Anda</p>
          
          {error && (
            <div className="error-message">
              <p>{error}</p>
            </div>
          )}

          <div className="packages-grid">
            {packages.map((pkg, index) => (
              <div key={pkg.id} className={`package-card ${index === 1 ? 'popular' : ''}`}>
                {index === 1 && <div className="popular-badge">POPULAR</div>}
                
                <div className="package-image">
                  <img src={pkg.image_url} alt={pkg.name} />
                </div>
                
                <div className="package-content">
                  <h3>{pkg.name}</h3>
                  <div className="price">
                    {formatPrice(pkg.price)}
                    <span>{pkg.period}</span>
                  </div>
                  
                  <ul className="features">
                    {pkg.features.map((feature, idx) => (
                      <li key={idx}>
                        <i className="fas fa-check"></i> {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <a href="/payment" className="btn btn-primary">
                    Pilih Paket
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq">
        <div className="container">
          <h2 className="section-title">Pertanyaan <span>Umum</span></h2>
          <div className="faq-container">
            <div className="faq-item">
              <h3>Bagaimana cara berlangganan OshiLive48?</h3>
              <p>Pilih paket membership yang diinginkan, lakukan pembayaran melalui metode yang tersedia, dan akun Anda akan aktif setelah konfirmasi pembayaran.</p>
            </div>
            
            <div className="faq-item">
              <h3>Apa perbedaan antar paket?</h3>
              <p>Perbedaan utama terletak pada kualitas streaming, jumlah device, dan fitur tambahan seperti rekaman show dan bonus content.</p>
            </div>
            
            <div className="faq-item">
              <h3>Metode pembayaran apa saja yang tersedia?</h3>
              <p>Kami menerima pembayaran melalui QRIS, E-wallet (GoPay, Dana, OVO), Saweria, dan transfer manual.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;