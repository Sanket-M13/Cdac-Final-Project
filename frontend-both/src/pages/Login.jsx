import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import emailjs from '@emailjs/browser';
import toast from 'react-hot-toast';
import './Auth.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateEmailOnBlur = () => {
    if (formData.email && !emailRegex.test(formData.email)) {
      setErrors(prev => ({ ...prev, email: 'Invalid email format' }));
    } else {
      setErrors(prev => ({ ...prev, email: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const [showCarDetails, setShowCarDetails] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordStep, setForgotPasswordStep] = useState(1);
  const [forgotPasswordData, setForgotPasswordData] = useState({
    email: '',
    otp: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [generatedOTP, setGeneratedOTP] = useState('');
  const [carDetails, setCarDetails] = useState({
    name: '',
    email: '',
    carNumber: '',
    carBrand: '',
    phone: '',
    vehicleType: '',
    vehicleModel: ''
  });
  const [carBrands, setCarBrands] = useState([]);
  const [carModels, setCarModels] = useState([]);
  const [formErrors, setFormErrors] = useState({});

  const sampleVehicleData = {
    Car: [
      { id: 1, name: 'Tata', models: [{ id: 1, name: 'Nexon EV' }, { id: 2, name: 'Tigor EV' }] },
      { id: 2, name: 'MG', models: [{ id: 3, name: 'ZS EV' }, { id: 4, name: 'Comet EV' }] },
      { id: 3, name: 'Hyundai', models: [{ id: 5, name: 'Kona Electric' }, { id: 6, name: 'Ioniq 5' }] },
      { id: 4, name: 'Mahindra', models: [{ id: 7, name: 'eXUV300' }, { id: 8, name: 'eKUV100' }] },
      { id: 5, name: 'BYD', models: [{ id: 9, name: 'Atto 3' }, { id: 10, name: 'e6' }] }
    ],
    Bike: [
      { id: 6, name: 'Ather', models: [{ id: 11, name: '450X' }, { id: 12, name: '450 Plus' }] },
      { id: 7, name: 'TVS', models: [{ id: 13, name: 'iQube' }, { id: 14, name: 'X21' }] },
      { id: 8, name: 'Bajaj', models: [{ id: 15, name: 'Chetak' }] },
      { id: 9, name: 'Hero', models: [{ id: 16, name: 'Vida V1' }, { id: 17, name: 'Optima' }] },
      { id: 10, name: 'Ola', models: [{ id: 18, name: 'S1 Pro' }, { id: 19, name: 'S1 Air' }] }
    ]
  };
  const [googleToken, setGoogleToken] = useState(null);

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const payload = JSON.parse(atob(credentialResponse.credential.split('.')[1]));
      
      const response = await fetch('https://evcharger-springboot.onrender.com/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: payload.email,
          name: payload.name
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        toast.success('Login successful!');
        window.location.href = '/dashboard';
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Google login failed');
      }
    } catch (error) {
      toast.error('Failed to process Google login');
    }
  };



  const validateRegistrationForm = () => {
    const errors = {};
    
    const phoneRegex = /^[0-9]{10}$/;
    if (!carDetails.phone) {
      errors.phone = 'Phone number is required';
    } else if (!phoneRegex.test(carDetails.phone)) {
      errors.phone = 'Phone number must be 10 digits';
    }
    
    const carNumberRegex = /^[A-Z]{2}[0-9]{2}[A-Z]{2}[0-9]{4}$/;
    if (!carDetails.carNumber) {
      errors.carNumber = 'Car number is required';
    } else if (!carNumberRegex.test(carDetails.carNumber.toUpperCase())) {
      errors.carNumber = 'Invalid format. Use: MH12AB1234';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    
    if (forgotPasswordStep === 1) {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOTP(otp);
      
      try {
        await emailjs.send(
          'service_5ge65dl',
          'template_q1kndlr',
          {
            email: forgotPasswordData.email,
            userName: 'User',
            OTP: otp,
            actionTitle: 'Password Reset',
            actionMessage: 'You requested to reset your password. Use the OTP below to proceed:',
            expiryMinutes: '10',
            year: new Date().getFullYear()
          },
          'qXmPfLLE2JuNBPuuV'
        );
        
        toast.success('OTP sent to your email');
        setForgotPasswordStep(2);
      } catch (error) {
        toast.error('Failed to send OTP');
      }
    } else if (forgotPasswordStep === 2) {
      if (forgotPasswordData.otp === generatedOTP) {
        setForgotPasswordStep(3);
        toast.success('OTP verified');
      } else {
        toast.error('Invalid OTP');
      }
    } else if (forgotPasswordStep === 3) {
      if (forgotPasswordData.newPassword !== forgotPasswordData.confirmPassword) {
        toast.error('Passwords do not match');
        return;
      }
      
      toast.success('Password updated successfully');
      setShowForgotPassword(false);
      setForgotPasswordStep(1);
      setForgotPasswordData({ email: '', otp: '', newPassword: '', confirmPassword: '' });
    }
  };

  const handleCarDetailsSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateRegistrationForm()) {
      return;
    }
    
    try {
      const requestData = {
        name: carDetails.name,
        email: carDetails.email,
        password: carDetails.password,
        phone: carDetails.phone,
        vehicleNumber: carDetails.carNumber.toUpperCase(),
        vehicleBrand: carDetails.carBrand,
        vehicleType: carDetails.vehicleType,
        vehicleModel: carDetails.vehicleModel,
        role: 'User'
      };
      
      const response = await fetch('https://evcharger-springboot.onrender.com/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData)
      });
      
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        toast.success('Registration successful!');
        setShowCarDetails(false);
        
        window.location.href = '/dashboard';
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Registration failed');
      }
    } catch (error) {
      toast.error('Registration error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        toast.success('Login successful!');
        const userRole = localStorage.getItem('userRole');
        
        if (userRole === 'Admin') {
          navigate('/admin/dashboard', { replace: true });
        } else if (userRole === 'StationMaster') {
          navigate('/station-master/dashboard', { replace: true });
        } else {
          navigate('/dashboard', { replace: true });
        }
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="floating-elements">
        <div className="floating-icon icon-1">⚡</div>
        <div className="floating-icon icon-2">🔋</div>
        <div className="floating-icon icon-3">🚗</div>
        <div className="floating-icon icon-4">🌱</div>
      </div>
      
      <Container>
        <Row className="justify-content-center align-items-center min-vh-100">
          <Col md={6} lg={4}>
            <div className="welcome-banner">
              <h1 className="banner-title">EV Charger Finder</h1>
              <p className="banner-subtitle">Find, Book & Charge with Confidence</p>
            </div>
            
            <Card className="auth-card">
              <Card.Body className="p-4">
                <div className="text-center mb-4">
                  <div className="auth-logo">
                    <span className="brand-icon">⚡</span>
                  </div>
                  <h2 className="auth-title">Welcome Back</h2>
                  <p className="auth-subtitle">
                    Sign in to access your charging dashboard
                  </p>
                </div>

                <div style={{ width: '100%', marginBottom: '1rem' }}>
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => toast.error('Google login failed')}
                    useOneTap={false}
                    text="signin_with"
                    shape="rectangular"
                    theme="filled_black"
                    size="large"
                  />
                </div>

                <div className="divider">
                  <span>or</span>
                </div>

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <div className="input-group">
                      <FiMail className="input-icon" />
                      <Form.Control
                        type="text"
                        name="email"
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={handleChange}
                        onBlur={validateEmailOnBlur}
                        className={`auth-input ${errors.email ? 'is-invalid' : ''}`}
                      />
                    </div>
                    {errors.email && (
                      <span style={{ color: '#dc3545', fontSize: '14px', display: 'block' }}>
                        {errors.email}
                      </span>
                    )}
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <div className="input-group">
                      <FiLock className="input-icon" />
                      <Form.Control
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        className="auth-input"
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                      </button>
                    </div>
                  </Form.Group>

                  <Button 
                    type="submit" 
                    className="btn btn-primary w-100 mb-3"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        Signing In...
                      </>
                    ) : (
                      'Sign In'
                    )}
                  </Button>

                  <div className="text-center mb-3">
                    <button 
                      type="button" 
                      className="auth-link" 
                      onClick={() => setShowForgotPassword(true)}
                      style={{ background: 'none', border: 'none', textDecoration: 'underline' }}
                    >
                      Forgot Password?
                    </button>
                  </div>
                </Form>

                <div className="text-center">
                  <p className="mb-0">
                    Don't have an account?{' '}
                    <Link to="/register" className="auth-link">
                      Sign up here
                    </Link>
                  </p>
                </div>
              </Card.Body>
            </Card>
            
            {/* Registration Modal */}
            {showCarDetails && (
              <div className="modal-overlay" onClick={() => setShowCarDetails(false)}>
                <Card className="auth-card registration-modal" onClick={(e) => e.stopPropagation()}>
                  <Card.Body className="p-4">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <div>
                        <h3 className="auth-title mb-1">Complete Registration</h3>
                        <p className="auth-subtitle mb-0">Fill in your details to continue</p>
                      </div>
                      <button 
                        className="btn-close" 
                        onClick={() => setShowCarDetails(false)}
                        style={{ background: 'none', border: 'none', color: 'white', fontSize: '24px' }}
                      >
                        ×
                      </button>
                    </div>
                    
                    <Form onSubmit={handleCarDetailsSubmit}>
                      <div className="row">
                        <div className="col-md-6">
                          <Form.Group className="mb-3">
                            <Form.Control
                              type="text"
                              placeholder="Full Name"
                              value={carDetails.name}
                              className="auth-input"
                              disabled
                            />
                          </Form.Group>
                        </div>
                        <div className="col-md-6">
                          <Form.Group className="mb-3">
                            <Form.Control
                              type="email"
                              placeholder="Email"
                              value={carDetails.email}
                              className="auth-input"
                              disabled
                            />
                          </Form.Group>
                        </div>
                      </div>
                      
                      <div className="row">
                        <div className="col-md-6">
                          <Form.Group className="mb-3">
                            <Form.Control
                              type="tel"
                              placeholder="Phone Number (10 digits)"
                              value={carDetails.phone}
                              onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                                setCarDetails({...carDetails, phone: value});
                                if (formErrors.phone) setFormErrors({...formErrors, phone: ''});
                              }}
                              className={`auth-input ${formErrors.phone ? 'is-invalid' : ''}`}
                            />
                            {formErrors.phone && <div className="invalid-feedback d-block">{formErrors.phone}</div>}
                          </Form.Group>
                        </div>
                        <div className="col-md-6">
                          <Form.Group className="mb-3">
                            <Form.Control
                              type="text"
                              placeholder="Car Number (MH12AB1234)"
                              value={carDetails.carNumber}
                              onChange={(e) => {
                                const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10);
                                setCarDetails({...carDetails, carNumber: value});
                                if (formErrors.carNumber) setFormErrors({...formErrors, carNumber: ''});
                              }}
                              className={`auth-input ${formErrors.carNumber ? 'is-invalid' : ''}`}
                            />
                            {formErrors.carNumber && <div className="invalid-feedback d-block">{formErrors.carNumber}</div>}
                          </Form.Group>
                        </div>
                      </div>
                      
                      <div className="row">
                        <div className="col-md-4">
                          <Form.Group className="mb-3">
                            <Form.Select
                              value={carDetails.vehicleType}
                              onChange={(e) => {
                                const newType = e.target.value;
                                setCarDetails({...carDetails, vehicleType: newType, carBrand: '', vehicleModel: ''});
                                if (newType && sampleVehicleData[newType]) {
                                  setCarBrands(sampleVehicleData[newType]);
                                } else {
                                  setCarBrands([]);
                                }
                                setCarModels([]);
                              }}
                              className="auth-input"
                            >
                              <option value="">Vehicle Type</option>
                              <option value="Car">Car</option>
                              <option value="Bike">Bike</option>
                            </Form.Select>
                          </Form.Group>
                        </div>
                        <div className="col-md-4">
                          <Form.Group className="mb-3">
                            <Form.Select
                              value={carDetails.carBrand}
                              onChange={(e) => {
                                const newBrand = e.target.value;
                                setCarDetails({...carDetails, carBrand: newBrand, vehicleModel: ''});
                                if (newBrand) {
                                  const selectedBrand = carBrands.find(b => b.name === newBrand);
                                  if (selectedBrand && selectedBrand.models) {
                                    setCarModels(selectedBrand.models);
                                  }
                                } else {
                                  setCarModels([]);
                                }
                              }}
                              className="auth-input"
                              disabled={!carDetails.vehicleType || carBrands.length === 0}
                            >
                              <option value="">{carBrands.length === 0 ? 'Select Type First' : 'Select Brand'}</option>
                              {carBrands.map(brand => (
                                <option key={brand.id} value={brand.name}>{brand.name}</option>
                              ))}
                            </Form.Select>
                          </Form.Group>
                        </div>
                        <div className="col-md-4">
                          <Form.Group className="mb-3">
                            <Form.Select
                              value={carDetails.vehicleModel}
                              onChange={(e) => setCarDetails({...carDetails, vehicleModel: e.target.value})}
                              className="auth-input"
                              disabled={!carDetails.carBrand || carModels.length === 0}
                            >
                              <option value="">{carModels.length === 0 ? 'Select Brand First' : 'Select Model'}</option>
                              {carModels.map(model => (
                                <option key={model.id} value={model.name}>{model.name}</option>
                              ))}
                            </Form.Select>
                          </Form.Group>
                        </div>
                      </div>
                      
                      <Button type="submit" className="btn btn-primary w-100 mt-3">
                        Complete Registration
                      </Button>
                    </Form>
                  </Card.Body>
                </Card>
              </div>
            )}
            
            {/* Forgot Password Modal */}
            {showForgotPassword && (
              <div className="modal-overlay" onClick={() => setShowForgotPassword(false)}>
                <Card className="auth-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '400px' }}>
                  <Card.Body className="p-4">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <h3 className="auth-title mb-0">Reset Password</h3>
                      <button 
                        className="btn-close" 
                        onClick={() => setShowForgotPassword(false)}
                        style={{ background: 'none', border: 'none', color: 'white', fontSize: '24px' }}
                      >
                        ×
                      </button>
                    </div>
                    
                    <Form onSubmit={handleForgotPassword}>
                      {forgotPasswordStep === 1 && (
                        <>
                          <Form.Group className="mb-3">
                            <Form.Control
                              type="email"
                              placeholder="Enter your email"
                              value={forgotPasswordData.email}
                              onChange={(e) => setForgotPasswordData({...forgotPasswordData, email: e.target.value})}
                              className="auth-input"
                            />
                          </Form.Group>
                          <Button type="submit" className="btn btn-primary w-100">
                            Send OTP
                          </Button>
                        </>
                      )}
                      
                      {forgotPasswordStep === 2 && (
                        <>
                          <Form.Group className="mb-3">
                            <Form.Control
                              type="text"
                              placeholder="Enter 6-digit OTP"
                              value={forgotPasswordData.otp}
                              onChange={(e) => setForgotPasswordData({...forgotPasswordData, otp: e.target.value})}
                              className="auth-input"
                              maxLength={6}
                            />
                          </Form.Group>
                          <Button type="submit" className="btn btn-primary w-100">
                            Verify OTP
                          </Button>
                        </>
                      )}
                      
                      {forgotPasswordStep === 3 && (
                        <>
                          <Form.Group className="mb-3">
                            <Form.Control
                              type="password"
                              placeholder="New Password"
                              value={forgotPasswordData.newPassword}
                              onChange={(e) => setForgotPasswordData({...forgotPasswordData, newPassword: e.target.value})}
                              className="auth-input"
                            />
                          </Form.Group>
                          <Form.Group className="mb-3">
                            <Form.Control
                              type="password"
                              placeholder="Confirm New Password"
                              value={forgotPasswordData.confirmPassword}
                              onChange={(e) => setForgotPasswordData({...forgotPasswordData, confirmPassword: e.target.value})}
                              className="auth-input"
                            />
                          </Form.Group>
                          <Button type="submit" className="btn btn-primary w-100">
                            Update Password
                          </Button>
                        </>
                      )}
                    </Form>
                  </Card.Body>
                </Card>
              </div>
            )}
            
            <div className="trust-indicators">
              <div className="trust-item">
                <span className="trust-icon">🔒</span>
                <span>Secure & Encrypted</span>
              </div>
              <div className="trust-item">
                <span className="trust-icon">⚡</span>
                <span>500+ Charging Stations</span>
              </div>
              <div className="trust-item">
                <span className="trust-icon">🌍</span>
                <span>Eco-Friendly Network</span>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;
