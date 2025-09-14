import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Streaming.css';

const Streaming = () => {
  const [streams, setStreams] = useState([]);
  const [currentStream, setCurrentStream] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      username: 'OshiLive48(operator)',
      message: 'Selamat datang di streaming JKT48! Enjoy the show!',
      time: '19:00'
    }
  ]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    fetchStreams();
  }, []);

  const fetchStreams = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/streams`);
      const streamsData = response.data;
      setStreams(streamsData);
      
      // Find live stream or latest upcoming
      const liveStream = streamsData.find(s => s.status === 'live');
      const upcomingStream = streamsData.find(s => s.status === 'upcoming');
      
      setCurrentStream(liveStream || upcomingStream || streamsData[0]);
    } catch (error) {
      console.error('Error fetching streams:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: Date.now(),
        username: 'Anda',
        message: newMessage,
        time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      };
      
      setChatMessages([...chatMessages, message]);
      setNewMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return '';
    
    // Extract video ID from various YouTube URL formats
    const videoIdMatch = url.match(
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
    );
    
    if (videoIdMatch) {
      return `https://www.youtube.com/embed/${videoIdMatch[1]}?autoplay=1&mute=1`;
    }
    
    return url;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!currentStream) {
    return (
      <div className="no-stream">
        <div className="container">
          <h2>Tidak ada streaming saat ini</h2>
          <p>Silakan cek jadwal untuk streaming selanjutnya</p>
        </div>
      </div>
    );
  }

  return (
    <div className="streaming-page">
      {/* Header */}
      <header className="streaming-header">
        <div className="container">
          <div className="stream-info">
            <h1>{currentStream.title} - {currentStream.team}</h1>
            <div className="stream-meta">
              <span className="viewers">
                <i className="fas fa-eye"></i> {Math.floor(Math.random() * 1000) + 500} Penonton
              </span>
              <span className="resolution">
                <i className="fas fa-video"></i> 1080p HD
              </span>
              <span className={`status ${currentStream.status}`}>
                {currentStream.status === 'live' ? 'LIVE' : 
                 currentStream.status === 'upcoming' ? 'UPCOMING' : 'ENDED'}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="streaming-main">
        <div className="container">
          <div className="stream-grid">
            {/* Video Player */}
            <div className="video-container">
              <div className="video-wrapper">
                {currentStream.status === 'live' || currentStream.youtube_url ? (
                  <iframe
                    src={getYouTubeEmbedUrl(currentStream.youtube_url)}
                    title={currentStream.title}
                    frameBorder="0"
                    allowFullScreen
                    allow="autoplay"
                  />
                ) : (
                  <div className="video-placeholder">
                    <div className="placeholder-content">
                      <i className="fas fa-video"></i>
                      <h3>Stream Belum Dimulai</h3>
                      <p>Streaming akan dimulai pada {formatDate(currentStream.date)} - {currentStream.time}</p>
                    </div>
                  </div>
                )}
                
                <div className="stream-overlay">
                  <div className={`stream-status ${currentStream.status}`}>
                    {currentStream.status.toUpperCase()}
                  </div>
                </div>
              </div>
            </div>

            {/* Chat Container */}
            <div className="chat-container">
              <div className="chat-header">
                <h3>Live Chat</h3>
                <div className="chat-actions">
                  <button className="chat-btn refresh-chat" onClick={() => window.location.reload()}>
                    <i className="fas fa-sync-alt"></i>
                  </button>
                </div>
              </div>

              <div className="chat-messages">
                {chatMessages.map((msg) => (
                  <div key={msg.id} className="message">
                    <div className="user-avatar">
                      <i className="fas fa-user-circle"></i>
                    </div>
                    <div className="message-content">
                      <div className="user-name">{msg.username}</div>
                      <div className="message-text">{msg.message}</div>
                      <div className="message-time">{msg.time}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="chat-input">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Kirim pesan..."
                />
                <button className="send-btn" onClick={sendMessage}>
                  <i className="fas fa-paper-plane"></i>
                </button>
              </div>
            </div>
          </div>

          {/* Stream Details */}
          <div className="stream-details">
            <div className="detail-card">
              <h3>Tentang Pertunjukan</h3>
              <p>
                {currentStream.description || 
                 `${currentStream.title} adalah pertunjukan ${currentStream.team} yang menampilkan 
                 lagu-lagu favorit dan performance yang energik dari member JKT48.`}
              </p>
            </div>

            <div className="detail-card">
              <h3>Informasi Stream</h3>
              <div className="stream-info-grid">
                <div className="info-item">
                  <i className="fas fa-calendar"></i>
                  <span>{formatDate(currentStream.date)}</span>
                </div>
                <div className="info-item">
                  <i className="fas fa-clock"></i>
                  <span>{currentStream.time}</span>
                </div>
                <div className="info-item">
                  <i className="fas fa-users"></i>
                  <span>{currentStream.team}</span>
                </div>
              </div>
            </div>

            {/* Next Streams */}
            <div className="detail-card">
              <h3>Jadwal Selanjutnya</h3>
              <div className="next-streams">
                {streams
                  .filter(s => s.id !== currentStream.id && s.status === 'upcoming')
                  .slice(0, 3)
                  .map((stream) => (
                    <div key={stream.id} className="next-stream-item">
                      <div className="next-stream-time">
                        {new Date(stream.date).toLocaleDateString('id-ID', { 
                          month: 'short', 
                          day: 'numeric' 
                        })} - {stream.time}
                      </div>
                      <div className="next-stream-title">{stream.title} - {stream.team}</div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Streaming;