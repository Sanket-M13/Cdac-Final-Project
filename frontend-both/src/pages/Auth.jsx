import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { FiMail, FiLock, FiUser, FiCar } from 'react-icons/fi';
import { GoogleLogin } from '@react-oauth/google';
import toast from 'react-hot-toast';
import './Auth.css';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showOTP, setShowOTP] = useState(false);
  const [showCarDetails, setShowCarDetails] = useState(false);
  const [googleUserData, setGoogleUserData] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    otp: '',
    vehicleType: '',
    vehicleBrand: '',
    vehicleModel: '',
    vehicleNumber: '',
    phone: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const sendOTP = async () => {
    try {
      const response = await fetch('https://evcharger-springboot.onrender.com/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email })
      });
      
      if (response.ok) {
        setShowOTP(true);
        toast.success('OTP sent to your email');
      } else {
        toast.error('Failed to send OTP');
      }
    } catch (error) {
      toast.error('Error sending OTP');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isLogin && !showOTP) {
      await sendOTP();
      return;
    }
    
    try {
      const endpoint = isLogin ? '/api/auth/login-otp' : '/api/auth/register';
      const response = await fetch(`https://evcharger-springboot.onrender.com${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        toast.success(isLogin ? 'Login successful' : 'Account created successfully');
        window.location.href = '/';
      } else {
        toast.error('Authentication failed');
      }
    } catch (error) {
      toast.error('Error during authentication');
    }
  };

  const handleCarDetailsSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('https://evcharger-springboot.onrender.com/api/auth/update-car-details', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${googleUserData.token}`
        },
        body: JSON.stringify({
          vehicleType: formData.vehicleType,
          vehicleBrand: formData.vehicleBrand,
          vehicleModel: formData.vehicleModel,
          vehicleNumber: formData.vehicleNumber,
          phone: formData.phone
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('user', JSON.stringify(data.user));
        toast.success('Car details saved successfully');
        window.location.href = '/';
      } else {
        toast.error('Failed to save car details');
      }
    } catch (error) {
      toast.error('Error saving car details');
    }
  };

  const handleGoogleClick = async () => {
    toast.info('Google authentication - Demo mode');
    // For now, create a demo Google user
    try {
      const response = await fetch('https://evcharger-springboot.onrender.com/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          token: 'demo-token',
          email: 'demo@gmail.com',
          name: 'Demo User'
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        setGoogleUserData(data);
        setShowCarDetails(true);
        toast.success('Please provide your vehicle details');
      }
    } catch (error) {
      toast.error('Demo Google login');
    }
  };

  if (showCarDetails) {
    return (
      <div className="auth-page">
        <Container>
          <Row className="justify-content-center align-items-center min-vh-100">
            <Col md={6} lg={4}>
              <Card className="auth-card">
                <Card.Body className="p-4">
                  <div className="text-center mb-4">
                    <h2 className="auth-title">Vehicle Details</h2>
                    <p className="auth-subtitle">Tell us about your electric vehicle</p>
                  </div>

                  <Form onSubmit={handleCarDetailsSubmit}>
                    <Form.Group className="mb-3">
                      <div className="input-group">
                        <FiCar className="input-icon" />
                        <Form.Select
                          name="vehicleType"
                          value={formData.vehicleType}
                          onChange={handleInputChange}
                          className="auth-input"
                          required
                        >
                          <option value="">Select Vehicle Type</option>
                          <option value="Car">Car</option>
                          <option value="Bike">Bike</option>
                          <option value="Scooter">Scooter</option>
                          <option value="Bus">Bus</option>
                          <option value="Truck">Truck</option>
                        </Form.Select>
                      </div>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Control
                        type="text"
                        name="vehicleBrand"
                        placeholder="Vehicle Brand (e.g., Tesla, Tata)"
                        value={formData.vehicleBrand}
                        onChange={handleInputChange}
                        className="auth-input"
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Control
                        type="text"
                        name="vehicleModel"
                        placeholder="Vehicle Model (e.g., Model 3, Nexon EV)"
                        value={formData.vehicleModel}
                        onChange={handleInputChange}
                        className="auth-input"
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Control
                        type="text"
                        name="vehicleNumber"
                        placeholder="Vehicle Number (e.g., MH12AB1234)"
                        value={formData.vehicleNumber}
                        onChange={handleInputChange}
                        className="auth-input"
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Control
                        type="tel"
                        name="phone"
                        placeholder="Phone Number"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="auth-input"
                        required
                      />
                    </Form.Group>

                    <Button type="submit" className="btn btn-primary w-100 mb-3">
                      Complete Registration
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <Container>
        <Row className="justify-content-center align-items-center min-vh-100">
          <Col md={6} lg={4}>
            <Card className="auth-card">
              <Card.Body className="p-4">
                <div className="text-center mb-4">
                  <h2 className="auth-title">
                    {showOTP ? 'Enter OTP' : (isLogin ? 'Welcome Back' : 'Create Account')}
                  </h2>
                  <p className="auth-subtitle">
                    {showOTP 
                      ? 'Check your email for the verification code'
                      : (isLogin 
                        ? 'Sign in to access your charging dashboard' 
                        : 'Join thousands of EV drivers')
                    }
                  </p>
                </div>

                {!showOTP && (
                  <>
                    <Button 
                      variant="outline-light" 
                      className="w-100 mb-3 d-flex align-items-center justify-content-center"
                      onClick={handleGoogleClick}
                      style={{ padding: '12px', border: '1px solid #dadce0', backgroundColor: 'white', color: '#3c4043' }}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" className="me-2">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      {isLogin ? 'Sign in with Google' : 'Sign up with Google'}
                    </Button>

                    <div className="divider">
                      <span>or</span>
                    </div>
                  </>
                )}

                <Form onSubmit={handleSubmit}>
                  {showOTP ? (
                    <Form.Group className="mb-3">
                      <Form.Control
                        type="text"
                        name="otp"
                        placeholder="Enter 6-digit OTP"
                        value={formData.otp}
                        onChange={handleInputChange}
                        className="auth-input text-center"
                        maxLength={6}
                        required
                      />
                    </Form.Group>
                  ) : (
                    <>
                      {!isLogin && (
                        <Form.Group className="mb-3">
                          <div className="input-group">
                            <FiUser className="input-icon" />
                            <Form.Control
                              type="text"
                              name="name"
                              placeholder="Full Name"
                              value={formData.name}
                              onChange={handleInputChange}
                              className="auth-input"
                              required
                            />
                          </div>
                        </Form.Group>
                      )}

                      <Form.Group className="mb-3">
                        <div className="input-group">
                          <FiMail className="input-icon" />
                          <Form.Control
                            type="email"
                            name="email"
                            placeholder="Email Address"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="auth-input"
                            required
                          />
                        </div>
                      </Form.Group>

                      {!isLogin && (
                        <Form.Group className="mb-4">
                          <div className="input-group">
                            <FiLock className="input-icon" />
                            <Form.Control
                              type="password"
                              name="password"
                              placeholder="Password"
                              value={formData.password}
                              onChange={handleInputChange}
                              className="auth-input"
                              required
                            />
                          </div>
                        </Form.Group>
                      )}
                    </>
                  )}

                  <Button type="submit" className="btn btn-primary w-100 mb-3">
                    {showOTP ? 'Verify OTP' : (isLogin ? 'Send OTP' : 'Create Account')}
                  </Button>
                </Form>

                {showOTP && (
                  <div className="text-center mb-3">
                    <button
                      type="button"
                      className="toggle-auth"
                      onClick={() => setShowOTP(false)}
                    >
                      Back to login
                    </button>
                  </div>
                )}

                <div className="text-center">
                  <button
                    type="button"
                    className="toggle-auth"
                    onClick={() => setIsLogin(!isLogin)}
                  >
                    {isLogin 
                      ? "Don't have an account? Sign up" 
                      : "Already have an account? Sign in"
                    }
                  </button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Auth;
