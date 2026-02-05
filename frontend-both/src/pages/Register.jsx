import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiPhone, FiTruck } from 'react-icons/fi';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import emailjs from '@emailjs/browser';
import toast from 'react-hot-toast';
import './Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    vehicleNumber: '',
    vehicleType: '',
    vehicleBrand: '',
    vehicleModel: '',
    role: 'User'
  });
  const [vehicleBrands, setVehicleBrands] = useState([]);
  const [vehicleModels, setVehicleModels] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showCarDetails, setShowCarDetails] = useState(false);
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [emailOTP, setEmailOTP] = useState('');
  const [generatedEmailOTP, setGeneratedEmailOTP] = useState('');
  const [pendingRegistrationData, setPendingRegistrationData] = useState(null);
  const [carDetails, setCarDetails] = useState({
    name: '',
    email: '',
    password: '',
    carNumber: '',
    carBrand: '',
    phone: '',
    vehicleType: '',
    vehicleModel: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [errors, setErrors] = useState({});


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

  const { register } = useAuth();
  const navigate = useNavigate();


  useEffect(() => {
    if (formData.vehicleType && sampleVehicleData[formData.vehicleType]) {
      setVehicleBrands(sampleVehicleData[formData.vehicleType]);
      setFormData(prev => ({ ...prev, vehicleBrand: '', vehicleModel: '' }));
      setVehicleModels([]);
    } else {
      setVehicleBrands([]);
      setVehicleModels([]);
    }
  }, [formData.vehicleType]);


  useEffect(() => {
    if (formData.vehicleBrand) {
      const selectedBrand = vehicleBrands.find(b => b.name === formData.vehicleBrand);
      if (selectedBrand && selectedBrand.models) {
        setVehicleModels(selectedBrand.models);
        setFormData(prev => ({ ...prev, vehicleModel: '' }));
      }
    } else {
      setVehicleModels([]);
    }
  }, [formData.vehicleBrand, vehicleBrands]);

  const formatVehicleNumber = (value) => {

    const cleaned = value.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
    
   
    if (cleaned.length <= 4) {
      return cleaned;
    } else if (cleaned.length <= 6) {
      return cleaned.slice(0, 4) + '-' + cleaned.slice(4);
    } else {
      return cleaned.slice(0, 4) + '-' + cleaned.slice(4, 6) + '-' + cleaned.slice(6, 10);
    }
  };

  const firstNameRegex = /^[a-zA-Z]{2,}$/;
  const lastNameRegex = /^[a-zA-Z]{2,}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[6-9]\d{9}$/;
  const vehicleNumberRegex = /^[A-Z]{2}[0-9]{2}[A-Z]{2}[0-9]{4}$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

  const validateFirstNameOnBlur = () => {
    if (formData.firstName && !firstNameRegex.test(formData.firstName)) {
      setErrors(prev => ({ ...prev, firstName: 'First name must contain only letters (min 2 chars)' }));
    } else {
      setErrors(prev => ({ ...prev, firstName: '' }));
    }
  };

  const validateLastNameOnBlur = () => {
    if (formData.lastName && !lastNameRegex.test(formData.lastName)) {
      setErrors(prev => ({ ...prev, lastName: 'Last name must contain only letters (min 2 chars)' }));
    } else {
      setErrors(prev => ({ ...prev, lastName: '' }));
    }
  };

  const validateEmailOnBlur = () => {
    if (formData.email && !emailRegex.test(formData.email)) {
      setErrors(prev => ({ ...prev, email: 'Invalid email format' }));
    } else {
      setErrors(prev => ({ ...prev, email: '' }));
    }
  };

  const validatePhoneOnBlur = () => {
    if (formData.phone && !phoneRegex.test(formData.phone.replace(/\D/g, ''))) {
      setErrors(prev => ({ ...prev, phone: 'Phone must be 10 digits starting with 6-9' }));
    } else {
      setErrors(prev => ({ ...prev, phone: '' }));
    }
  };

  const validateVehicleNumberOnBlur = () => {
    if (formData.vehicleNumber && !vehicleNumberRegex.test(formData.vehicleNumber.replace(/-/g, ''))) {
      setErrors(prev => ({ ...prev, vehicleNumber: 'Invalid format. Use: MH12AB1234' }));
    } else {
      setErrors(prev => ({ ...prev, vehicleNumber: '' }));
    }
  };

  const validatePasswordOnBlur = () => {
    if (formData.password && !passwordRegex.test(formData.password)) {
      setErrors(prev => ({ ...prev, password: 'Password must contain uppercase, lowercase, number and special character (min 6 chars)' }));
    } else {
      setErrors(prev => ({ ...prev, password: '' }));
    }
  };

  const validateConfirmPasswordOnBlur = () => {
    if (formData.confirmPassword && formData.password !== formData.confirmPassword) {
      setErrors(prev => ({ ...prev, confirmPassword: 'Passwords do not match' }));
    } else {
      setErrors(prev => ({ ...prev, confirmPassword: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (formData.firstName && !firstNameRegex.test(formData.firstName)) {
      newErrors.firstName = 'First name must contain only letters (min 2 chars)';
    }
    if (formData.lastName && !lastNameRegex.test(formData.lastName)) {
      newErrors.lastName = 'Last name must contain only letters (min 2 chars)';
    }
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (formData.phone && !phoneRegex.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Phone must be 10 digits starting with 6-9';
    }
    if (formData.vehicleNumber && !vehicleNumberRegex.test(formData.vehicleNumber.replace(/-/g, ''))) {
      newErrors.vehicleNumber = 'Invalid format. Use: MH12AB1234';
    }
    if (formData.password && !passwordRegex.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, number and special character (min 6 chars)';
    }
    if (formData.confirmPassword && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'vehicleNumber') {
      const formatted = formatVehicleNumber(value);
      setFormData(prev => ({ ...prev, [name]: formatted }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const payload = JSON.parse(atob(credentialResponse.credential.split('.')[1]));
      const googlePassword = payload.sub;
      
      try {
        const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            email: payload.email,
            password: googlePassword
          })
        });
        
        if (loginResponse.ok) {
          const data = await loginResponse.json();
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          toast.success('Welcome back!');
          window.location.href = '/dashboard';
          return;
        }
      } catch (loginError) {
        // Login failed, show registration form
      }
      
      setCarDetails({
        name: payload.name || '',
        email: payload.email || '',
        password: googlePassword,
        carNumber: '',
        carBrand: '',
        phone: '',
        vehicleType: '',
        vehicleModel: ''
      });
      setShowCarDetails(true);
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

  const handleCarDetailsSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateRegistrationForm()) {
      return;
    }
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/google-register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: carDetails.name,
          email: carDetails.email,
          password: carDetails.password,
          phone: carDetails.phone,
          vehicleNumber: carDetails.carNumber.toUpperCase(),
          vehicleBrand: carDetails.carBrand,
          vehicleType: carDetails.vehicleType,
          vehicleModel: carDetails.vehicleModel,
          role: 'User'
        })
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

  const handleEmailVerification = async (e) => {
    e.preventDefault();
    
    if (emailOTP === generatedEmailOTP) {
     
      setLoading(true);
      try {
        const result = await register(pendingRegistrationData);
        
        if (result.success) {
          toast.success('Registration successful! Welcome to EV Charger Finder!');
          navigate('/login');
        } else {
          toast.error(result.message);
        }
      } catch (error) {
        toast.error('Registration failed. Please try again.');
      } finally {
        setLoading(false);
        setShowEmailVerification(false);
      }
    } else {
      toast.error('Invalid OTP');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      const registrationData = {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        vehicleNumber: formData.role === 'User' ? formData.vehicleNumber : '',
        vehicleType: formData.role === 'User' ? formData.vehicleType : '',
        vehicleBrand: formData.role === 'User' ? formData.vehicleBrand : '',
        vehicleModel: formData.role === 'User' ? formData.vehicleModel : '',
        role: formData.email.endsWith('@evcharger.com') ? 'Admin' : formData.role
      };


      if (formData.email.endsWith('@evcharger.com')) {
        const result = await register(registrationData);
        
        if (result.success) {
          toast.success('Registration successful! Welcome to EV Charger Finder!');
          navigate('/login');
        } else {
          toast.error(result.message);
        }
      } else {

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        setGeneratedEmailOTP(otp);
        setPendingRegistrationData(registrationData);
        
        try {
          await emailjs.send(
            'service_5ge65dl',
            'template_q1kndlr',
            {
              email: formData.email,
              userName: `${formData.firstName} ${formData.lastName}`,
              OTP: otp,
              actionTitle: 'Account Verification',
              actionMessage: 'Welcome to EV Charger Finder! Please verify your email address using the OTP below:',
              expiryMinutes: '10',
              year: new Date().getFullYear()
            },
            'qXmPfLLE2JuNBPuuV'
          );
          
          toast.success('OTP sent to your email');
          setShowEmailVerification(true);
        } catch (error) {
          toast.error('Failed to send OTP');
        }
      }
    } catch (error) {
      toast.error('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <Container>
        <Row className="justify-content-center align-items-center min-vh-100">
          <Col md={8} lg={6}>
            <Card className="auth-card">
              <Card.Body className="p-4">
                <div className="text-center mb-4">
                  <div className="auth-logo">
                    <span className="brand-icon">⚡</span>
                  </div>
                  <h2 className="auth-title">Create Account</h2>
                  <p className="auth-subtitle">
                    Join thousands of EV drivers
                  </p>
                </div>

                <div style={{ width: '100%', marginBottom: '1rem' }}>
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => toast.error('Google login failed')}
                    useOneTap={false}
                    text="signup_with"
                    shape="rectangular"
                    theme="filled_black"
                    size="large"
                  />
                </div>

                <div className="divider">
                  <span>or</span>
                </div>

                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <div className="input-group">
                          <FiUser className="input-icon" />
                          <Form.Control
                            type="text"
                            name="firstName"
                            placeholder="First Name"
                            value={formData.firstName}
                            onChange={handleChange}
                            onBlur={validateFirstNameOnBlur}
                            className={`auth-input ${errors.firstName ? 'is-invalid' : ''}`}
                          />
                        </div>
                        {errors.firstName && (
                          <span style={{ color: '#dc3545', fontSize: '14px', display: 'block' }}>
                            {errors.firstName}
                          </span>
                        )}
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <div className="input-group">
                          <FiUser className="input-icon" />
                          <Form.Control
                            type="text"
                            name="lastName"
                            placeholder="Last Name"
                            value={formData.lastName}
                            onChange={handleChange}
                            onBlur={validateLastNameOnBlur}
                            className={`auth-input ${errors.lastName ? 'is-invalid' : ''}`}
                          />
                        </div>
                        {errors.lastName && (
                          <span style={{ color: '#dc3545', fontSize: '14px', display: 'block' }}>
                            {errors.lastName}
                          </span>
                        )}
                      </Form.Group>
                    </Col>
                  </Row>

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

                  <Form.Group className="mb-3">
                    <div className="input-group">
                      <FiPhone className="input-icon" />
                      <Form.Control
                        type="tel"
                        name="phone"
                        placeholder="Phone Number"
                        value={formData.phone}
                        onChange={handleChange}
                        onBlur={validatePhoneOnBlur}
                        className={`auth-input ${errors.phone ? 'is-invalid' : ''}`}
                      />
                    </div>
                    {errors.phone && (
                      <span style={{ color: '#dc3545', fontSize: '14px', display: 'block' }}>
                        {errors.phone}
                      </span>
                    )}
                  </Form.Group>

                  {!formData.email.endsWith('@evcharger.com') && (
                    <Form.Group className="mb-3">
                      <Form.Select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="auth-input"
                        required
                      >
                        <option value="User">User (EV Owner)</option>
                        <option value="StationMaster">Station Master</option>
                      </Form.Select>
                    </Form.Group>
                  )}

                  {(!formData.email.endsWith('@evcharger.com') && formData.role === 'User') && (
                    <>
                      <Form.Group className="mb-3">
                        <div className="input-group">
                          <FiTruck className="input-icon" />
                          <Form.Control
                            type="text"
                            name="vehicleNumber"
                            placeholder="Vehicle Number (e.g., MH12AB1234)"
                            value={formData.vehicleNumber}
                            onChange={handleChange}
                            onBlur={validateVehicleNumberOnBlur}
                            className={`auth-input ${errors.vehicleNumber ? 'is-invalid' : ''}`}
                            maxLength={13}
                          />
                        </div>
                        {errors.vehicleNumber && (
                          <span style={{ color: '#dc3545', fontSize: '14px', display: 'block' }}>
                            {errors.vehicleNumber}
                          </span>
                        )}
                      </Form.Group>

                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Select
                              name="vehicleType"
                              value={formData.vehicleType}
                              onChange={handleChange}
                              className={`auth-input ${errors.vehicleType ? 'is-invalid' : ''}`}
                              required
                            >
                              <option value="">Select Vehicle Type</option>
                              <option value="Car">Car</option>
                              <option value="Bike">Bike</option>
                            </Form.Select>
                            {errors.vehicleType && (
                              <div className="invalid-feedback d-block">
                                {errors.vehicleType}
                              </div>
                            )}
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Select
                              name="vehicleBrand"
                              value={formData.vehicleBrand}
                              onChange={handleChange}
                              className={`auth-input ${errors.vehicleBrand ? 'is-invalid' : ''}`}
                              disabled={!formData.vehicleType || vehicleBrands.length === 0}
                              required
                            >
                              <option value="">{vehicleBrands.length === 0 ? 'Select Vehicle Type First' : 'Select Brand'}</option>
                              {vehicleBrands.map(brand => (
                                <option key={brand.id} value={brand.name}>{brand.name}</option>
                              ))}
                            </Form.Select>
                            {errors.vehicleBrand && (
                              <div className="invalid-feedback d-block">
                                {errors.vehicleBrand}
                              </div>
                            )}
                          </Form.Group>
                        </Col>
                      </Row>

                      <Form.Group className="mb-3">
                        <Form.Select
                          name="vehicleModel"
                          value={formData.vehicleModel}
                          onChange={handleChange}
                          className={`auth-input ${errors.vehicleModel ? 'is-invalid' : ''}`}
                          disabled={!formData.vehicleBrand || vehicleModels.length === 0}
                          required
                        >
                          <option value="">{vehicleModels.length === 0 ? 'Select Brand First' : 'Select Model'}</option>
                          {vehicleModels.map(model => (
                            <option key={model.id} value={model.name}>{model.name}</option>
                          ))}
                        </Form.Select>
                        {errors.vehicleModel && (
                          <div className="invalid-feedback d-block">
                            {errors.vehicleModel}
                          </div>
                        )}
                      </Form.Group>
                    </>
                  )}

                  <Form.Group className="mb-3">
                    <div className="input-group">
                      <FiLock className="input-icon" />
                      <Form.Control
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        onBlur={validatePasswordOnBlur}
                        className={`auth-input ${errors.password ? 'is-invalid' : ''}`}
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                      </button>
                    </div>
                    {errors.password && (
                      <span style={{ color: '#dc3545', fontSize: '14px', display: 'block' }}>
                        {errors.password}
                      </span>
                    )}
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <div className="input-group">
                      <FiLock className="input-icon" />
                      <Form.Control
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        onBlur={validateConfirmPasswordOnBlur}
                        className={`auth-input ${errors.confirmPassword ? 'is-invalid' : ''}`}
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <span style={{ color: '#dc3545', fontSize: '14px', display: 'block' }}>
                        {errors.confirmPassword}
                      </span>
                    )}
                  </Form.Group>

                  <Button 
                    type="submit" 
                    className="btn btn-primary w-100 mb-3"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        Creating Account...
                      </>
                    ) : (
                      'Create Account'
                    )}
                  </Button>
                </Form>

                <div className="text-center">
                  <p className="mb-0">
                    Already have an account?{' '}
                    <Link to="/login" className="auth-link">
                      Sign in here
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
                              required
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
                              required
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
                                  setVehicleBrands(sampleVehicleData[newType]);
                                } else {
                                  setVehicleBrands([]);
                                }
                                setVehicleModels([]);
                              }}
                              className="auth-input"
                              required
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
                                  const selectedBrand = vehicleBrands.find(b => b.name === newBrand);
                                  if (selectedBrand && selectedBrand.models) {
                                    setVehicleModels(selectedBrand.models);
                                  }
                                } else {
                                  setVehicleModels([]);
                                }
                              }}
                              className="auth-input"
                              disabled={!carDetails.vehicleType || vehicleBrands.length === 0}
                              required
                            >
                              <option value="">{vehicleBrands.length === 0 ? 'Select Type First' : 'Select Brand'}</option>
                              {vehicleBrands.map(brand => (
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
                              disabled={!carDetails.carBrand || vehicleModels.length === 0}
                              required
                            >
                              <option value="">{vehicleModels.length === 0 ? 'Select Brand First' : 'Select Model'}</option>
                              {vehicleModels.map(model => (
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
            
            {/* Email Verification Modal */}
            {showEmailVerification && (
              <div className="modal-overlay" onClick={() => setShowEmailVerification(false)}>
                <Card className="auth-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '400px' }}>
                  <Card.Body className="p-4">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <div>
                        <h3 className="auth-title mb-1">Verify Email</h3>
                        <p className="auth-subtitle mb-0">Enter OTP sent to your email</p>
                      </div>
                      <button 
                        className="btn-close" 
                        onClick={() => setShowEmailVerification(false)}
                        style={{ background: 'none', border: 'none', color: 'white', fontSize: '24px' }}
                      >
                        ×
                      </button>
                    </div>
                    
                    <Form onSubmit={handleEmailVerification}>
                      <Form.Group className="mb-3">
                        <Form.Control
                          type="text"
                          placeholder="Enter 6-digit OTP"
                          value={emailOTP}
                          onChange={(e) => setEmailOTP(e.target.value)}
                          className="auth-input"
                          maxLength={6}
                          required
                        />
                      </Form.Group>
                      <Button type="submit" className="btn btn-primary w-100" disabled={loading}>
                        {loading ? 'Verifying...' : 'Verify & Register'}
                      </Button>
                    </Form>
                  </Card.Body>
                </Card>
              </div>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Register;