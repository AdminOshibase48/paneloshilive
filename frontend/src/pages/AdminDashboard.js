import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('packages');
  const [packages, setPackages] = useState([]);
  const [streams, setStreams] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(false);

  // Form states
  const [packageForm, setPackageForm] = useState({
    name: '',
    price: '',
    period: '/bulan',
    image_url: '',
    features: ''
  });

  const [streamForm, setStreamForm] = useState({
    title: '',
    team: '',
    date: '',
    time: '',
    youtube_url: '',
    description: '',
    status: 'upcoming'
  });

  const API_BASE = process.env.REACT_APP_BACKEND_URL;
  const AUTH_TOKEN = 'admin_token_oshilive48'; // Simple auth for now

  const axiosConfig = {
    headers: {
      'Authorization': `Bearer ${AUTH_TOKEN}`
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [packagesRes, streamsRes, paymentRes, statsRes] = await Promise.all([
        axios.get(`${API_BASE}/api/packages`),
        axios.get(`${API_BASE}/api/streams`),
        axios.get(`${API_BASE}/api/payment-methods`),
        axios.get(`${API_BASE}/api/admin/stats`, axiosConfig)
      ]);
      
      setPackages(packagesRes.data);
      setStreams(streamsRes.data);
      setPaymentMethods(paymentRes.data);
      setStats(statsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePackageSubmit = async (e) => {
    e.preventDefault();
    try {
      const packageData = {
        ...packageForm,
        price: parseInt(packageForm.price),
        features: packageForm.features.split(',').map(f => f.trim())
      };
      
      await axios.post(`${API_BASE}/api/packages`, packageData, axiosConfig);
      
      setPackageForm({
        name: '',
        price: '',
        period: '/bulan',
        image_url: '',
        features: ''
      });
      
      fetchData();
      alert('Package created successfully!');
    } catch (error) {
      console.error('Error creating package:', error);
      alert('Error creating package');
    }
  };

  const handleStreamSubmit = async (e) => {
    e.preventDefault();
    try {
      const streamData = {
        ...streamForm,
        date: new Date(streamForm.date + 'T' + streamForm.time)
      };
      
      await axios.post(`${API_BASE}/api/streams`, streamData, axiosConfig);
      
      setStreamForm({
        title: '',
        team: '',
        date: '',
        time: '',
        youtube_url: '',
        description: '',
        status: 'upcoming'
      });
      
      fetchData();
      alert('Stream created successfully!');
    } catch (error) {
      console.error('Error creating stream:', error);
      alert('Error creating stream');
    }
  };

  const deletePackage = async (id) => {
    if (window.confirm('Are you sure you want to delete this package?')) {
      try {
        await axios.delete(`${API_BASE}/api/packages/${id}`, axiosConfig);
        fetchData();
        alert('Package deleted successfully!');
      } catch (error) {
        console.error('Error deleting package:', error);
        alert('Error deleting package');
      }
    }
  };

  const deleteStream = async (id) => {
    if (window.confirm('Are you sure you want to delete this stream?')) {
      try {
        await axios.delete(`${API_BASE}/api/streams/${id}`, axiosConfig);
        fetchData();
        alert('Stream deleted successfully!');
      } catch (error) {
        console.error('Error deleting stream:', error);
        alert('Error deleting stream');
      }
    }
  };

  const updateStreamStatus = async (id, status) => {
    try {
      const stream = streams.find(s => s.id === id);
      await axios.put(`${API_BASE}/api/streams/${id}`, { ...stream, status }, axiosConfig);
      fetchData();
    } catch (error) {
      console.error('Error updating stream status:', error);
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
    <div className="admin-dashboard">
      <div className="container">
        <header className="admin-header">
          <h1><i className="fas fa-crown"></i> Admin Dashboard OshiLive48</h1>
          <p>Kelola paket membership dan streaming events</p>
        </header>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-box"></i>
            </div>
            <div className="stat-info">
              <h3>{stats.total_packages || 0}</h3>
              <p>Total Packages</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-video"></i>
            </div>
            <div className="stat-info">
              <h3>{stats.total_streams || 0}</h3>
              <p>Total Streams</p>
            </div>
          </div>
          
          <div className="stat-card live">
            <div className="stat-icon">
              <i className="fas fa-broadcast-tower"></i>
            </div>
            <div className="stat-info">
              <h3>{stats.live_streams || 0}</h3>
              <p>Live Now</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-users"></i>
            </div>
            <div className="stat-info">
              <h3>{stats.total_users || 0}</h3>
              <p>Total Users</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="admin-tabs">
          <button 
            className={activeTab === 'packages' ? 'active' : ''}
            onClick={() => setActiveTab('packages')}
          >
            <i className="fas fa-box"></i> Packages
          </button>
          <button 
            className={activeTab === 'streams' ? 'active' : ''}
            onClick={() => setActiveTab('streams')}
          >
            <i className="fas fa-video"></i> Streams
          </button>
          <button 
            className={activeTab === 'payments' ? 'active' : ''}
            onClick={() => setActiveTab('payments')}
          >
            <i className="fas fa-credit-card"></i> Payments
          </button>
        </div>

        {/* Packages Tab */}
        {activeTab === 'packages' && (
          <div className="admin-content">
            <div className="admin-grid">
              <div className="form-section">
                <h2><i className="fas fa-plus"></i> Tambah Paket Baru</h2>
                <form onSubmit={handlePackageSubmit}>
                  <div className="form-group">
                    <label>Nama Paket</label>
                    <input
                      type="text"
                      className="form-control"
                      value={packageForm.name}
                      onChange={(e) => setPackageForm({...packageForm, name: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Harga (Rp)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={packageForm.price}
                      onChange={(e) => setPackageForm({...packageForm, price: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Periode</label>
                    <select
                      className="form-control"
                      value={packageForm.period}
                      onChange={(e) => setPackageForm({...packageForm, period: e.target.value})}
                    >
                      <option value="/bulan">Bulanan</option>
                      <option value="/3 bulan">3 Bulanan</option>
                      <option value="/6 bulan">6 Bulanan</option>
                      <option value="/tahun">Tahunan</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>URL Gambar</label>
                    <input
                      type="url"
                      className="form-control"
                      value={packageForm.image_url}
                      onChange={(e) => setPackageForm({...packageForm, image_url: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Fitur (pisahkan dengan koma)</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={packageForm.features}
                      onChange={(e) => setPackageForm({...packageForm, features: e.target.value})}
                      placeholder="Contoh: Akses HD, 2 Device, Archive"
                      required
                    />
                  </div>
                  
                  <button type="submit" className="btn btn-primary">
                    <i className="fas fa-save"></i> Simpan Paket
                  </button>
                </form>
              </div>

              <div className="list-section">
                <h2><i className="fas fa-list"></i> Daftar Paket</h2>
                <div className="packages-list">
                  {packages.map((pkg) => (
                    <div key={pkg.id} className="package-item">
                      <div className="package-info">
                        <h4>{pkg.name}</h4>
                        <p>{formatPrice(pkg.price)} {pkg.period}</p>
                        <div className="features-preview">
                          {pkg.features.slice(0, 2).map((feat, idx) => (
                            <span key={idx} className="feature-tag">{feat}</span>
                          ))}
                          {pkg.features.length > 2 && <span className="feature-tag">+{pkg.features.length - 2} more</span>}
                        </div>
                      </div>
                      <div className="package-actions">
                        <button 
                          className="btn btn-danger btn-sm"
                          onClick={() => deletePackage(pkg.id)}
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Streams Tab */}
        {activeTab === 'streams' && (
          <div className="admin-content">
            <div className="admin-grid">
              <div className="form-section">
                <h2><i className="fas fa-plus"></i> Tambah Stream Baru</h2>
                <form onSubmit={handleStreamSubmit}>
                  <div className="form-group">
                    <label>Judul Stream</label>
                    <input
                      type="text"
                      className="form-control"
                      value={streamForm.title}
                      onChange={(e) => setStreamForm({...streamForm, title: e.target.value})}
                      placeholder="Contoh: Pajama Drive"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Team</label>
                    <select
                      className="form-control"
                      value={streamForm.team}
                      onChange={(e) => setStreamForm({...streamForm, team: e.target.value})}
                      required
                    >
                      <option value="">Pilih Team</option>
                      <option value="Team J">Team J</option>
                      <option value="Team KIII">Team KIII</option>
                      <option value="Team T">Team T</option>
                      <option value="All Teams">All Teams</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>Tanggal</label>
                    <input
                      type="date"
                      className="form-control"
                      value={streamForm.date}
                      onChange={(e) => setStreamForm({...streamForm, date: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Waktu</label>
                    <input
                      type="time"
                      className="form-control"
                      value={streamForm.time}
                      onChange={(e) => setStreamForm({...streamForm, time: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>YouTube URL</label>
                    <input
                      type="url"
                      className="form-control"
                      value={streamForm.youtube_url}
                      onChange={(e) => setStreamForm({...streamForm, youtube_url: e.target.value})}
                      placeholder="https://youtube.com/watch?v=..."
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Deskripsi</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={streamForm.description}
                      onChange={(e) => setStreamForm({...streamForm, description: e.target.value})}
                      placeholder="Deskripsi optional tentang pertunjukan"
                    />
                  </div>
                  
                  <button type="submit" className="btn btn-primary">
                    <i className="fas fa-save"></i> Simpan Stream
                  </button>
                </form>
              </div>

              <div className="list-section">
                <h2><i className="fas fa-list"></i> Daftar Streams</h2>
                <div className="streams-list">
                  {streams.map((stream) => (
                    <div key={stream.id} className="stream-item">
                      <div className="stream-info">
                        <h4>{stream.title}</h4>
                        <p><i className="fas fa-users"></i> {stream.team}</p>
                        <p><i className="fas fa-calendar"></i> {new Date(stream.date).toLocaleDateString('id-ID')} - {stream.time}</p>
                        <div className="stream-status">
                          <span className={`status-badge ${stream.status}`}>
                            {stream.status.toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="stream-actions">
                        <select
                          value={stream.status}
                          onChange={(e) => updateStreamStatus(stream.id, e.target.value)}
                          className="status-select"
                        >
                          <option value="upcoming">Upcoming</option>
                          <option value="live">Live</option>
                          <option value="ended">Ended</option>
                        </select>
                        <button 
                          className="btn btn-danger btn-sm"
                          onClick={() => deleteStream(stream.id)}
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Payments Tab */}
        {activeTab === 'payments' && (
          <div className="admin-content">
            <h2><i className="fas fa-credit-card"></i> Metode Pembayaran</h2>
            <div className="payment-methods-grid">
              {paymentMethods.map((method) => (
                <div key={method.id} className="payment-method-card">
                  <div className="payment-icon">
                    <i className={
                      method.type === 'qris' ? 'fas fa-qrcode' :
                      method.type === 'ewallet' ? 'fas fa-mobile-alt' :
                      method.type === 'donation' ? 'fas fa-heart' :
                      'fas fa-credit-card'
                    }></i>
                  </div>
                  <h3>{method.name}</h3>
                  <p className="payment-type">{method.type}</p>
                  <div className="payment-details">
                    {method.type === 'ewallet' && method.details.number && (
                      <p><i className="fas fa-phone"></i> {method.details.number}</p>
                    )}
                    {method.type === 'donation' && method.details.url && (
                      <a href={method.details.url} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">
                        <i className="fas fa-external-link-alt"></i> Visit
                      </a>
                    )}
                    {method.type === 'manual' && method.details.url && (
                      <a href={method.details.url} target="_blank" rel="noopener noreferrer" className="btn btn-success btn-sm">
                        <i className="fab fa-whatsapp"></i> WhatsApp
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;