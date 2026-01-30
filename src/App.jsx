import React, { useState, useRef } from 'react';

function App() {
  const [view, setView] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const otpRefs = useRef([]);

  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Fill next input
    if (value && index < 5) {
      otpRefs.current[index + 1].focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1].focus();
    }
  };

  React.useEffect(() => {
    const timer = setTimeout(() => {
      const firstInput = document.querySelector('.login-card input:not([style*="display: none"])');
      if (firstInput) firstInput.focus();
    }, 150);
    return () => clearTimeout(timer);
  }, [view]);

  const renderView = () => {
    switch (view) {
      case 'signup-step1':
        return (
          <div className="login-card">
            <h2 className="yellow-text no-margin">Create an account</h2>
            <StepIndicator currentStep={1} />

            <form onSubmit={(e) => { e.preventDefault(); setView('signup-step2'); }} autoComplete="off">
              <div className="form-group margin-top">
                <label>Name</label>
                <div className="input-wrapper">
                  <input type="text" placeholder="Enter your name" className="highlight-border" autoComplete="off" />
                </div>
              </div>

              <div className="form-group">
                <label>Enter Your Mail ID</label>
                <div className="input-wrapper">
                  <input type="email" placeholder="Enter your Mail ID" autoComplete="off" />
                </div>
              </div>

              <button className="main-btn" type="submit">Continue</button>
            </form>

            <p className="footer-text">
              Already Have An Account? <span onClick={() => setView('login')}>Log In</span>
            </p>
          </div>
        );

      case 'signup-step2':
        return (
          <div className="login-card">
            <h2 className="yellow-text no-margin">Set Password</h2>
            <StepIndicator currentStep={2} />

            <form onSubmit={(e) => { e.preventDefault(); setView('signup-step3'); }} autoComplete="off">
              {/* Dummy hidden password to confuse browser */}
              <input type="password" name="prevent_autofill" style={{ display: 'none' }} />

              <div className="form-group margin-top">
                <label>Password</label>
                <div className="input-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    name={`reg_pass_${Math.random()}`}
                    placeholder="Enter Password"
                    autoComplete="new-password"
                  />
                  <span className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeIconOpen /> : <EyeIconClosed />}
                  </span>
                </div>
              </div>

              <div className="form-group">
                <label>Confirm Password</label>
                <div className="input-wrapper">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name={`reg_conf_${Math.random()}`}
                    placeholder="Re-enter Password"
                    autoComplete="new-password"
                  />
                  <span className="eye-icon" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                    {showConfirmPassword ? <EyeIconOpen /> : <EyeIconClosed />}
                  </span>
                </div>
              </div>

              <button className="main-btn" type="submit">Create Account</button>
            </form>

            <p className="footer-text">
              <span onClick={() => setView('signup-step1')}>Go Back</span>
            </p>
          </div>
        );

      case 'signup-step3':
        return (
          <div className="login-card">
            <h2 className="yellow-text no-margin">Verify Email</h2>
            <StepIndicator currentStep={3} />

            <form onSubmit={(e) => { e.preventDefault(); console.log('OTP Verified'); }} autoComplete="off">
              <div className="otp-container">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => (otpRefs.current[idx] = el)}
                    type="text"
                    maxLength="1"
                    value={digit}
                    className="otp-box"
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    inputMode="numeric"
                  />
                ))}
              </div>

              <button className="main-btn" type="submit">Verify & Finish</button>
            </form>

            <p className="footer-text">
              Didn't receive code? <span onClick={() => setOtp(['', '', '', '', '', ''])}>Resend OTP</span>
            </p>
            <p className="footer-text small-margin">
              <span onClick={() => setView('signup-step2')}>Change Password Details</span>
            </p>
          </div>
        );

      case 'login':
        return (
          <div className="login-card">
            <h2>Login to your account</h2>
            <form onSubmit={(e) => e.preventDefault()} autoComplete="off">
              {/* Dummy hidden inputs to confuse browsers */}
              <input type="text" name="fake_email" style={{ display: 'none' }} />
              <input type="password" name="fake_password" style={{ display: 'none' }} />

              <div className="form-group">
                <label>Email</label>
                <div className="input-wrapper">
                  <input
                    type="email"
                    name={`email_${Math.random()}`}
                    placeholder="Enter your Mail ID"
                    className="highlight-border"
                    autoComplete="off"
                    spellCheck="false"
                  />
                </div>
              </div>

              <div className="form-group">
                <div className="password-header">
                  <label>Password</label>
                  <button type="button" onClick={() => setView('forgot-step1')} className="forgot-link-btn">Forgot ?</button>
                </div>
                <div className="input-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    name={`pass_${Math.random()}`}
                    placeholder="Enter your password"
                    autoComplete="new-password"
                  />
                  <span className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeIconOpen /> : <EyeIconClosed />}
                  </span>
                </div>
              </div>

              <button className="main-btn" type="submit">Login now</button>
            </form>

            <p className="footer-text">
              Don't Have An Account? <span onClick={() => setView('signup-step1')}>Sign Up</span>
            </p>
          </div>
        );

      case 'forgot-step1':
        return (
          <div className="login-card">
            <h2 className="yellow-text no-margin">Reset Password</h2>
            <p className="subtitle">Enter your mail ID to receive OTP</p>

            <form onSubmit={(e) => { e.preventDefault(); setOtp(['', '', '', '', '', '']); setView('forgot-step2'); }} autoComplete="off">
              <div className="form-group margin-top">
                <label>Enter Your Mail ID</label>
                <div className="input-wrapper">
                  <input type="email" placeholder="Enter your Mail ID" className="highlight-border" autoComplete="off" />
                </div>
              </div>

              <button className="main-btn" type="submit">Send OTP</button>
            </form>

            <p className="footer-text">
              Back to <span onClick={() => setView('login')}>Log In</span>
            </p>
          </div>
        );

      case 'forgot-step2':
        return (
          <div className="login-card">
            <h2 className="yellow-text no-margin">Verify Identity</h2>
            <p className="subtitle">Enter the 6-digit OTP sent for password reset</p>

            <form onSubmit={(e) => { e.preventDefault(); console.log('Forgot Flow OTP Verified'); }} autoComplete="off">
              <div className="otp-container">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => (otpRefs.current[idx] = el)}
                    type="text"
                    maxLength="1"
                    value={digit}
                    className="otp-box"
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    inputMode="numeric"
                  />
                ))}
              </div>

              <button className="main-btn" type="submit">Verify & Continue</button>
            </form>

            <p className="footer-text">
              Didn't receive code? <span onClick={() => setOtp(['', '', '', '', '', ''])}>Resend OTP</span>
            </p>
            <p className="footer-text small-margin">
              <span onClick={() => setView('forgot-step1')}>Go Back</span>
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="app-container">
      {/* Brand Logo Top Right */}
      <img src="/logo.png" alt="Brand Logo" className="brand-logo" />

      <video autoPlay muted loop playsInline className="background-video">
        <source src="/Subtle_natural_motion_1080p_202601301326.mp4" type="video/mp4" />
      </video>

      <div className="particles">
        <div className="particle" style={{ width: '40px', height: '40px', left: '10%', top: '20%', animationDelay: '0s' }}></div>
        <div className="particle" style={{ width: '20px', height: '20px', left: '30%', top: '60%', animationDelay: '-5s' }}></div>
        <div className="particle" style={{ width: '30px', height: '30px', left: '70%', top: '10%', animationDelay: '-10s' }}></div>
        <div className="particle" style={{ width: '15px', height: '15px', left: '80%', top: '80%', animationDelay: '-15s' }}></div>
      </div>

      <div className="background-overlay"></div>
      {renderView()}
    </div>
  );
}

const StepIndicator = ({ currentStep }) => (
  <div className="step-roadmap">
    <div className={`step-dot ${currentStep >= 1 ? 'active' : ''}`}>1</div>
    <div className={`step-line ${currentStep >= 2 ? 'active' : ''}`}></div>
    <div className={`step-dot ${currentStep >= 2 ? 'active' : ''}`}>2</div>
    <div className={`step-line ${currentStep >= 3 ? 'active' : ''}`}></div>
    <div className={`step-dot ${currentStep >= 3 ? 'active' : ''}`}>3</div>
  </div>
);

const EyeIconOpen = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);

const EyeIconClosed = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
    <line x1="1" y1="1" x2="23" y2="23"></line>
  </svg>
);

export default App;
