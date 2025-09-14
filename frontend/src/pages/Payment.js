import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Payment.css';

const Payment = () => {
  const [packages, setPackages] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1); // 1: Select Package, 2: Select Payment, 3: Confirmation

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [packagesRes, paymentsRes] = await Promise.all([
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/packages`),
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/payment-methods`)
      ]);
      
      setPackages(packagesRes.data);
      setPaymentMethods(paymentsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
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

  const handlePackageSelect = (pkg) => {
    setSelectedPackage(pkg);
    setStep(2);
  };

  const handlePaymentSelect = (payment) => {
    setSelectedPayment(payment);
    setStep(3);
  };

  const handleWhatsAppConfirm = () => {
    const message = `Halo, saya ingin berlangganan paket ${selectedPackage.name} seharga ${formatPrice(selectedPackage.price)}${selectedPackage.period} melalui ${selectedPayment.name}. Mohon informasi lebih lanjut untuk pembayaran.`;
    const whatsappUrl = `https://wa.me/6285939105633?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const getPaymentIcon = (type) => {
    switch (type) {
      case 'qris':
        return 'fas fa-qrcode';
      case 'ewallet':
        return 'fas fa-mobile-alt';
      case 'donation':
        return 'fas fa-heart';
      case 'manual':
        return 'fab fa-whatsapp';
      default:
        return 'fas fa-credit-card';
    }
  };

  const getPaymentColor = (type) => {
    switch (type) {
      case 'qris':
        return '#00a0dc';
      case 'ewallet':
        return '#00d4ff';
      case 'donation':
        return '#ff6b6b';
      case 'manual':
        return '#25d366';
      default:
        return '#666';
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="payment-page">
      <div className="container">
        {/* Progress Steps */}
        <div className="payment-steps">
          <div className={`step ${step >= 1 ? 'active' : ''}`}>
            <div className="step-number">1</div>
            <span>Pilih Paket</span>
          </div>
          <div className="step-line"></div>
          <div className={`step ${step >= 2 ? 'active' : ''}`}>
            <div className="step-number">2</div>
            <span>Metode Pembayaran</span>
          </div>
          <div className="step-line"></div>
          <div className={`step ${step >= 3 ? 'active' : ''}`}>
            <div className="step-number">3</div>
            <span>Konfirmasi</span>
          </div>
        </div>

        {/* Step 1: Package Selection */}
        {step === 1 && (
          <div className="payment-step">
            <h2 className="step-title">Pilih Paket Membership</h2>
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
                    
                    <button 
                      className="btn btn-primary"
                      onClick={() => handlePackageSelect(pkg)}
                    >
                      Pilih Paket
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Payment Method Selection */}
        {step === 2 && (
          <div className="payment-step">
            <div className="selected-package-summary">
              <h3>Paket Terpilih: {selectedPackage.name}</h3>
              <p>Harga: {formatPrice(selectedPackage.price)}{selectedPackage.period}</p>
            </div>

            <h2 className="step-title">Pilih Metode Pembayaran</h2>
            <div className="payment-methods-grid">
              {paymentMethods.map((method) => (
                <div 
                  key={method.id} 
                  className="payment-method-card"
                  onClick={() => handlePaymentSelect(method)}
                  style={{ borderColor: getPaymentColor(method.type) }}
                >
                  <div 
                    className="payment-icon"
                    style={{ backgroundColor: getPaymentColor(method.type) }}
                  >
                    <i className={getPaymentIcon(method.type)}></i>
                  </div>
                  <h4>{method.name}</h4>
                  <p className="payment-type">{method.type}</p>
                  
                  {method.type === 'ewallet' && method.details.number && (
                    <p className="payment-detail">
                      <i className="fas fa-phone"></i> {method.details.number}
                    </p>
                  )}
                  
                  {method.type === 'qris' && (
                    <p className="payment-detail">
                      <i className="fas fa-qrcode"></i> Scan QR Code
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div className="step-actions">
              <button className="btn btn-outline" onClick={() => setStep(1)}>
                <i className="fas fa-arrow-left"></i> Kembali
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Confirmation */}
        {step === 3 && (
          <div className="payment-step">
            <div className="confirmation-card">
              <h2 className="step-title">Konfirmasi Pembayaran</h2>
              
              <div className="order-summary">
                <div className="summary-item">
                  <span>Paket:</span>
                  <span>{selectedPackage.name}</span>
                </div>
                <div className="summary-item">
                  <span>Harga:</span>
                  <span>{formatPrice(selectedPackage.price)}{selectedPackage.period}</span>
                </div>
                <div className="summary-item">
                  <span>Metode Pembayaran:</span>
                  <span>{selectedPayment.name}</span>
                </div>
              </div>

              {/* QRIS Payment */}
              {selectedPayment.type === 'qris' && (
                <div className="payment-details">
                  <h3>Pembayaran QRIS</h3>
                  <div className="qris-container">
                    <img src="/img/qr-code.png" alt="QR Code" className="qr-code" />
                    <p>Scan QR Code dengan aplikasi e-wallet atau mobile banking Anda</p>
                  </div>
                  <div className="payment-instructions">
                    <h4>Cara Pembayaran:</h4>
                    <ol>
                      <li>Buka aplikasi e-wallet atau mobile banking</li>
                      <li>Pilih menu "Scan QR" atau "QRIS"</li>
                      <li>Scan QR Code di atas</li>
                      <li>Masukkan nominal: {formatPrice(selectedPackage.price)}</li>
                      <li>Konfirmasi pembayaran</li>
                      <li>Screenshot bukti pembayaran</li>
                    </ol>
                  </div>
                </div>
              )}

              {/* E-Wallet Payment */}
              {selectedPayment.type === 'ewallet' && (
                <div className="payment-details">
                  <h3>Pembayaran {selectedPayment.name}</h3>
                  <div className="ewallet-info">
                    <div className="ewallet-number">
                      <i className="fas fa-mobile-alt"></i>
                      <span>{selectedPayment.details.number}</span>
                    </div>
                    <p>Transfer ke nomor {selectedPayment.name} di atas</p>
                  </div>
                  <div className="payment-instructions">
                    <h4>Cara Pembayaran:</h4>
                    <ol>
                      <li>Buka aplikasi {selectedPayment.name}</li>
                      <li>Pilih menu "Transfer" atau "Kirim"</li>
                      <li>Masukkan nomor: {selectedPayment.details.number}</li>
                      <li>Masukkan nominal: {formatPrice(selectedPackage.price)}</li>
                      <li>Tambahkan catatan: "OshiLive48 - {selectedPackage.name}"</li>
                      <li>Konfirmasi pembayaran</li>
                      <li>Screenshot bukti pembayaran</li>
                    </ol>
                  </div>
                </div>
              )}

              {/* Saweria Payment */}
              {selectedPayment.type === 'donation' && (
                <div className="payment-details">
                  <h3>Pembayaran Saweria</h3>
                  <p>Klik tombol di bawah untuk melakukan pembayaran melalui Saweria</p>
                  <a 
                    href={selectedPayment.details.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn btn-primary btn-large"
                  >
                    <i className="fas fa-external-link-alt"></i> Bayar via Saweria
                  </a>
                </div>
              )}

              {/* Confirmation Actions */}
              <div className="confirmation-actions">
                <button 
                  className="btn btn-success btn-large"
                  onClick={handleWhatsAppConfirm}
                >
                  <i className="fab fa-whatsapp"></i> Konfirmasi via WhatsApp
                </button>
                
                <button className="btn btn-outline" onClick={() => setStep(2)}>
                  <i className="fas fa-arrow-left"></i> Ubah Pembayaran
                </button>
              </div>

              <div className="payment-note">
                <i className="fas fa-info-circle"></i>
                <p>Setelah melakukan pembayaran, silakan konfirmasi via WhatsApp dengan menyertakan bukti transfer untuk aktivasi akun Anda.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Payment;