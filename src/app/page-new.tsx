export default function Home() {
  return (
    <div 
      className="min-h-screen"
      style={{
        background: 'linear-gradient(135deg, #F8F5F0 0%, #FAFAF7 50%, #F8F5F0 100%)',
        fontFamily: 'Quintessential, serif'
      }}
    >
      {/* Navigation Bar */}
      <div 
        className="fixed top-0 left-0 right-0 z-50 p-6"
        style={{ backdropFilter: 'blur(20px)' }}
      >
        <div className="max-w-7xl mx-auto">
          <div 
            className="flex justify-between items-center px-8 py-4 rounded-2xl border"
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 12px 40px rgba(0, 87, 167, 0.15), inset 0 2px 0 rgba(255, 255, 255, 0.3)',
            }}
          >
            {/* Left side - Trigger Library */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => window.location.href = '/admin'}
                className="group flex items-center gap-3 px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
                style={{
                  background: 'rgba(0, 87, 167, 0.12)',
                  border: '1px solid rgba(0, 87, 167, 0.25)',
                  color: '#0057A7',
                  boxShadow: '0 6px 20px rgba(0, 87, 167, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
                }}
              >
                <svg className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Trigger Library</span>
              </button>
            </div>

            {/* Right side - API Status & Configuration */}
            <div className="flex items-center gap-4">
              {/* API Status */}
              <div 
                className="flex items-center gap-3 px-4 py-2 rounded-full"
                style={{
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.4)',
                }}
              >
                <div className="w-3 h-3 rounded-full animate-pulse shadow-lg bg-red-400" />
                <span 
                  className="text-sm font-medium"
                  style={{ color: '#DC2626' }}
                >
                  No API Key
                </span>
              </div>

              <button
                onClick={() => alert('API Key configuration will be added here')}
                className="group flex items-center gap-3 px-6 py-3 rounded-xl font-semibold text-white transition-all duration-300 hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, rgba(198, 166, 100, 0.9) 0%, rgba(198, 166, 100, 0.7) 100%)',
                  border: '1px solid rgba(198, 166, 100, 0.4)',
                  boxShadow: '0 6px 20px rgba(198, 166, 100, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
                }}
              >
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1721 9z" />
                </svg>
                <span>Add API Key</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8 pt-24">
        {/* Hero Section */}
        <div className="text-center mb-16 relative">
          {/* Background */}
          <div 
            className="absolute inset-0 rounded-3xl border"
            style={{
              background: 'rgba(255, 255, 255, 0.25)',
              backdropFilter: 'blur(40px)',
              border: '1px solid rgba(255, 255, 255, 0.4)',
              boxShadow: `
                0 50px 120px rgba(0, 87, 167, 0.2),
                0 25px 60px rgba(0, 87, 167, 0.15),
                inset 0 2px 0 rgba(255, 255, 255, 0.5),
                inset 0 -2px 0 rgba(0, 87, 167, 0.15)
              `,
              transform: 'scale(1.02)',
            }}
          >
            {/* Aura Effect */}
            <div 
              className="absolute inset-0 opacity-40 rounded-3xl animate-pulse"
              style={{
                background: 'radial-gradient(ellipse at center, rgba(0, 87, 167, 0.25) 0%, rgba(198, 166, 100, 0.2) 40%, transparent 80%)',
                transform: 'scale(1.1)',
              }}
            />
          </div>
          
          {/* Logo and Title Section */}
          <div className="relative z-10 py-20">
            {/* Logo */}
            <div className="flex justify-center items-center mb-12">
              <div className="relative group">
                {/* Golden Halo */}
                <div 
                  className="absolute inset-0 rounded-full opacity-70 animate-pulse"
                  style={{
                    background: 'radial-gradient(circle, rgba(198, 166, 100, 0.9) 0%, rgba(198, 166, 100, 0.5) 50%, rgba(198, 166, 100, 0.2) 100%)',
                    transform: 'scale(3)',
                    filter: 'blur(50px)',
                  }}
                />
                
                {/* Logo Image */}
                <img 
                  src="/logo-prism.png" 
                  alt="Prism Logo" 
                  className="w-40 h-40 relative z-10 drop-shadow-2xl group-hover:scale-110 transition-transform duration-500"
                  style={{
                    filter: 'drop-shadow(0 0 40px rgba(198, 166, 100, 0.8)) drop-shadow(0 0 80px rgba(0, 87, 167, 0.4))',
                  }}
                />
                
                {/* Floating Particles */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-6 left-6 w-3 h-3 bg-yellow-300 rounded-full animate-pulse opacity-70"></div>
                  <div className="absolute top-12 right-8 w-2 h-2 bg-blue-300 rounded-full animate-pulse opacity-50" style={{ animationDelay: '0.5s' }}></div>
                  <div className="absolute bottom-8 left-10 w-2.5 h-2.5 bg-yellow-400 rounded-full animate-pulse opacity-60" style={{ animationDelay: '1s' }}></div>
                  <div className="absolute bottom-12 right-6 w-1.5 h-1.5 bg-purple-300 rounded-full animate-pulse opacity-40" style={{ animationDelay: '1.5s' }}></div>
                </div>
              </div>
            </div>
            
            {/* Title Section */}
            <div className="mb-8">
              <h1 
                className="text-7xl md:text-8xl font-bold mb-6 animate-bounce"
                style={{
                  background: 'linear-gradient(135deg, #0057A7 0%, #C6A664 50%, #0057A7 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  textShadow: '0 8px 16px rgba(0, 87, 167, 0.5), 0 4px 8px rgba(198, 166, 100, 0.4)',
                }}
              >
                Prism
              </h1>
              
              <h2 
                className="text-4xl md:text-5xl font-medium mb-8 animate-pulse"
                style={{ 
                  color: '#0057A7',
                  textShadow: '0 4px 8px rgba(198, 166, 100, 0.5)',
                }}
              >
                See the persuasion beneath words
              </h2>
              
              <p 
                className="text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed opacity-90"
                style={{ color: '#5D6D7E' }}
              >
                Unlock the hidden architecture of persuasion in any text with our advanced AI-powered analysis
              </p>
            </div>
          </div>
        </div>

        {/* Input Section */}
        <div className="mb-16 relative">
          {/* Container */}
          <div 
            className="relative p-12 rounded-3xl transition-all duration-600"
            style={{
              background: 'rgba(255, 255, 255, 0.3)',
              backdropFilter: 'blur(60px) saturate(200%) brightness(1.1)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: `
                0 100px 250px rgba(0, 87, 167, 0.2),
                0 50px 125px rgba(0, 87, 167, 0.15),
                0 25px 62px rgba(0, 87, 167, 0.1),
                inset 0 2px 0 rgba(255, 255, 255, 0.7),
                inset 0 -2px 0 rgba(0, 87, 167, 0.15)
              `,
            }}
          >
            <div className="relative">
              {/* Text Area */}
              <textarea
                placeholder=""
                className="w-full px-8 py-8 border-0 rounded-2xl focus:outline-none resize-none leading-relaxed text-lg transition-all duration-500"
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  minHeight: '500px',
                  maxHeight: '80vh',
                  fontSize: '1.1rem',
                  color: '#2C2C2C',
                  backdropFilter: 'blur(30px) saturate(180%) brightness(1.05)',
                  boxShadow: `
                    inset 0 2px 0 rgba(255, 255, 255, 0.4),
                    inset 0 -1px 0 rgba(0, 87, 167, 0.08),
                    0 12px 40px rgba(0, 87, 167, 0.1)
                  `,
                }}
              />
              
              {/* Placeholder */}
              <div 
                className="absolute inset-0 flex items-center justify-center pointer-events-none px-8 py-8"
              >
                <div className="text-center">
                  <p 
                    className="text-2xl mb-4 opacity-80"
                    style={{ 
                      color: '#0057A7',
                      textShadow: '0 2px 4px rgba(198, 166, 100, 0.3)' 
                    }}
                  >
                    Paste your copy... and let Prism reveal the persuasion beneath your words.
                  </p>
                  <div className="flex justify-center space-x-2">
                    <div 
                      className="w-2 h-2 rounded-full animate-pulse"
                      style={{ backgroundColor: '#0057A7' }}
                    ></div>
                    <div 
                      className="w-2 h-2 rounded-full animate-pulse"
                      style={{ 
                        backgroundColor: '#C6A664',
                        animationDelay: '0.2s' 
                      }}
                    ></div>
                    <div 
                      className="w-2 h-2 rounded-full animate-pulse"
                      style={{ 
                        backgroundColor: '#0057A7',
                        animationDelay: '0.4s' 
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="flex justify-center mb-16">
          <div className="relative group">
            {/* Glow */}
            <div 
              className="absolute inset-0 rounded-3xl opacity-80 animate-pulse"
              style={{
                background: 'radial-gradient(ellipse, rgba(0, 87, 167, 0.6) 0%, rgba(198, 166, 100, 0.4) 50%, transparent 70%)',
                transform: 'scale(1.1)',
                filter: 'blur(20px)',
              }}
            />
            
            {/* Button */}
            <button
              onClick={() => alert('Analysis feature will be implemented here!')}
              className="relative px-20 py-6 rounded-3xl text-2xl font-medium transition-all duration-600 transform hover:scale-105 overflow-hidden group"
              style={{
                background: 'linear-gradient(135deg, rgba(0, 87, 167, 0.95) 0%, rgba(0, 61, 115, 0.95) 100%)',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.4)',
                boxShadow: `
                  0 40px 100px rgba(0, 87, 167, 0.5),
                  0 20px 50px rgba(0, 87, 167, 0.4),
                  0 10px 25px rgba(0, 87, 167, 0.3),
                  inset 0 2px 0 rgba(255, 255, 255, 0.5),
                  inset 0 -2px 0 rgba(0, 0, 0, 0.2),
                  0 0 0 1px rgba(255, 255, 255, 0.2)
                `,
              }}
            >
              {/* Light Ray Sweep */}
              <div 
                className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1500"
                style={{
                  background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.6) 50%, transparent 100%)',
                }}
              />
              
              {/* Button Content */}
              <div className="relative z-10 flex items-center gap-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
                Reveal the Triggers
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
