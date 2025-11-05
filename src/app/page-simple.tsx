'use client';

export default function Home() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #F8F5F0 0%, #FAFAF7 50%, #F8F5F0 100%)',
      fontFamily: 'Quintessential, serif',
      padding: '20px'
    }}>
      {/* Navigation */}
      <div style={{
        position: 'fixed',
        top: '20px',
        left: '20px',
        right: '20px',
        background: 'rgba(255, 255, 255, 0.9)',
        padding: '20px',
        borderRadius: '20px',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        zIndex: 1000
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button 
            onClick={() => window.location.href = '/admin'}
            style={{
              background: 'rgba(0, 87, 167, 0.1)',
              border: '1px solid rgba(0, 87, 167, 0.3)',
              color: '#0057A7',
              padding: '12px 24px',
              borderRadius: '12px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '600'
            }}
          >
            Trigger Library
          </button>
          
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              padding: '8px 16px',
              borderRadius: '20px',
              color: '#DC2626',
              fontSize: '14px'
            }}>
              No API Key
            </div>
            
            <button 
              onClick={() => alert('API Key configuration')}
              style={{
                background: 'linear-gradient(135deg, rgba(198, 166, 100, 0.9) 0%, rgba(198, 166, 100, 0.7) 100%)',
                border: '1px solid rgba(198, 166, 100, 0.4)',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '12px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '600'
              }}
            >
              Add API Key
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ 
        marginTop: '120px',
        maxWidth: '1200px',
        margin: '120px auto 0',
        padding: '0 20px'
      }}>
        {/* Hero Section */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          {/* Logo */}
          <div style={{ marginBottom: '40px' }}>
            <img 
              src="/logo-prism.png" 
              alt="Prism Logo" 
              style={{
                width: '160px',
                height: '160px',
                filter: 'drop-shadow(0 0 40px rgba(198, 166, 100, 0.8))',
                marginBottom: '20px'
              }}
            />
          </div>
          
          {/* Title */}
          <h1 style={{
            fontSize: '80px',
            fontWeight: 'bold',
            marginBottom: '20px',
            background: 'linear-gradient(135deg, #0057A7 0%, #C6A664 50%, #0057A7 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textShadow: '0 8px 16px rgba(0, 87, 167, 0.5)'
          }}>
            Prism
          </h1>
          
          <h2 style={{
            fontSize: '48px',
            fontWeight: '500',
            marginBottom: '20px',
            color: '#0057A7',
            textShadow: '0 4px 8px rgba(198, 166, 100, 0.5)'
          }}>
            See the persuasion beneath words
          </h2>
          
          <p style={{
            fontSize: '24px',
            color: '#5D6D7E',
            maxWidth: '800px',
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            Unlock the hidden architecture of persuasion in any text with our advanced AI-powered analysis
          </p>
        </div>

        {/* Input Section */}
        <div style={{ marginBottom: '60px' }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.3)',
            backdropFilter: 'blur(40px)',
            border: '1px solid rgba(255, 255, 255, 0.4)',
            borderRadius: '24px',
            padding: '40px',
            boxShadow: '0 50px 120px rgba(0, 87, 167, 0.2)'
          }}>
            <textarea
              placeholder="Paste your copy... and let Prism reveal the persuasion beneath your words."
              style={{
                width: '100%',
                minHeight: '400px',
                background: 'rgba(255, 255, 255, 0.2)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '16px',
                padding: '24px',
                fontSize: '18px',
                color: '#2C2C2C',
                fontFamily: 'Quintessential, serif',
                resize: 'vertical',
                outline: 'none'
              }}
            />
          </div>
        </div>

        {/* CTA Button */}
        <div style={{ textAlign: 'center' }}>
          <button
            onClick={() => alert('Analysis feature will be implemented here!')}
            style={{
              background: 'linear-gradient(135deg, rgba(0, 87, 167, 0.95) 0%, rgba(0, 61, 115, 0.95) 100%)',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.4)',
              padding: '24px 80px',
              borderRadius: '24px',
              fontSize: '24px',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 40px 100px rgba(0, 87, 167, 0.5)',
              transition: 'transform 0.3s ease'
            }}
            onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
          >
            Reveal the Triggers
          </button>
        </div>
      </div>
    </div>
  );
}
