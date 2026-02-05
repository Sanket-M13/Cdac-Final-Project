import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Badge } from 'react-bootstrap';
import { FiFilter, FiMapPin, FiZap, FiClock, FiTruck } from 'react-icons/fi';
import InteractiveMap from '../components/InteractiveMapFixed';
import { vehicleService } from '../services/vehicleService';
import './MapView.css';

const MapView = () => {
  const [filters, setFilters] = useState({
    status: 'all',
    chargerType: 'all'
  });

  const [selectedVehicleType, setSelectedVehicleType] = useState('');
  const [selectedVehicleBrand, setSelectedVehicleBrand] = useState('');
  const [selectedVehicleModel, setSelectedVehicleModel] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [vehicleBrands, setVehicleBrands] = useState([]);
  const [vehicleModels, setVehicleModels] = useState([]);
  const [batteryPercentage, setBatteryPercentage] = useState(80);
  const [calculatedRange, setCalculatedRange] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const sampleVehicleData = {
    Car: [
      { id: 1, name: 'Tata', models: [{ id: 1, name: 'Nexon EV', maxRange: 312 }, { id: 2, name: 'Tigor EV', maxRange: 306 }] },
      { id: 2, name: 'MG', models: [{ id: 3, name: 'ZS EV', maxRange: 419 }, { id: 4, name: 'Comet EV', maxRange: 230 }] },
      { id: 3, name: 'Hyundai', models: [{ id: 5, name: 'Kona Electric', maxRange: 452 }, { id: 6, name: 'Ioniq 5', maxRange: 481 }] },
      { id: 4, name: 'Mahindra', models: [{ id: 7, name: 'eXUV300', maxRange: 375 }, { id: 8, name: 'eKUV100', maxRange: 147 }] },
      { id: 5, name: 'BYD', models: [{ id: 9, name: 'Atto 3', maxRange: 521 }, { id: 10, name: 'e6', maxRange: 415 }] }
    ],
    Bike: [
      { id: 6, name: 'Ather', models: [{ id: 11, name: '450X', maxRange: 146 }, { id: 12, name: '450 Plus', maxRange: 116 }] },
      { id: 7, name: 'TVS', models: [{ id: 13, name: 'iQube', maxRange: 145 }, { id: 14, name: 'X21', maxRange: 113 }] },
      { id: 8, name: 'Bajaj', models: [{ id: 15, name: 'Chetak', maxRange: 108 }] },
      { id: 9, name: 'Hero', models: [{ id: 16, name: 'Vida V1', maxRange: 165 }, { id: 17, name: 'Optima', maxRange: 82 }] },
      { id: 10, name: 'Ola', models: [{ id: 18, name: 'S1 Pro', maxRange: 181 }, { id: 19, name: 'S1 Air', maxRange: 101 }] }
    ]
  };

  useEffect(() => {
    if (selectedVehicleType && sampleVehicleData[selectedVehicleType]) {
      const brands = sampleVehicleData[selectedVehicleType];
      setVehicleBrands(brands);
      
      if (selectedVehicleBrand) {
        const selectedBrand = brands.find(b => b.name === selectedVehicleBrand);
        if (selectedBrand && selectedBrand.models) {
          setVehicleModels(selectedBrand.models);
        }
      } else {
        setVehicleModels([]);
      }
    } else {
      setVehicleBrands([]);
      setVehicleModels([]);
    }
  }, [selectedVehicleType, selectedVehicleBrand]);

  useEffect(() => {
    if (selectedVehicleType && selectedVehicleBrand && vehicleBrands.length > 0) {
      const selectedBrand = vehicleBrands.find(b => b.name === selectedVehicleBrand);
      if (selectedBrand && selectedBrand.models) {
        setVehicleModels(selectedBrand.models);
      }
    }
  }, [vehicleBrands]);

  useEffect(() => {
    if (selectedVehicleBrand) {
      const selectedBrand = vehicleBrands.find(b => b.name === selectedVehicleBrand);
      if (selectedBrand && selectedBrand.models) {
        setVehicleModels(selectedBrand.models);
        setSelectedVehicleModel('');
      }
    } else {
      setVehicleModels([]);
      setSelectedVehicleModel('');
    }
  }, [selectedVehicleBrand, vehicleBrands]);

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

  const handleVehicleNumberChange = (e) => {
    const formatted = formatVehicleNumber(e.target.value);
    setVehicleNumber(formatted);
  };

  const calculateAvailableRange = () => {
    if (!selectedVehicleModel) return 0;
    
    const model = vehicleModels.find(m => m.name === selectedVehicleModel);
    if (!model) return 0;
    
    const maxRange = model.maxRange || 300;
    return Math.floor((maxRange * batteryPercentage) / 100);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const saveVehicleData = async () => {
    try {
      const vehicleData = {
        vehicleType: selectedVehicleType,
        brand: selectedVehicleBrand,
        model: selectedVehicleModel,
        vehicleNumber: vehicleNumber,
        batteryPercent: batteryPercentage
      };
      
      localStorage.setItem('savedVehicleData', JSON.stringify(vehicleData));
      alert('Vehicle data saved successfully!');
    } catch (error) {
      alert('Failed to save vehicle data');
    }
  };

  useEffect(() => {
    const loadUserVehicleData = () => {
      try {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        
        if (userData.vehicleType) {
          setSelectedVehicleType(userData.vehicleType);
          
          if (sampleVehicleData[userData.vehicleType]) {
            const brands = sampleVehicleData[userData.vehicleType];
            setVehicleBrands(brands);
            
            if (userData.vehicleBrand) {
              setSelectedVehicleBrand(userData.vehicleBrand);
              
              const selectedBrand = brands.find(b => b.name === userData.vehicleBrand);
              if (selectedBrand && selectedBrand.models) {
                setVehicleModels(selectedBrand.models);
                
                if (userData.vehicleModel) {
                  setTimeout(() => {
                    setSelectedVehicleModel(userData.vehicleModel);
                  }, 100);
                }
              }
            }
          }
        }
        
        if (userData.vehicleNumber) {
          setVehicleNumber(userData.vehicleNumber);
        }
        
      } catch (error) {
        // Error loading user vehicle data
      }
    };
    
    loadUserVehicleData();
  }, []);

  return (
    <div className="map-view-page" style={{ background: 'var(--bg-900)', minHeight: '100vh', paddingTop: '80px' }}>
      <Container fluid>
        <Row>
          <Col lg={3} className="map-sidebar">
            <Card className="filter-card mb-3" style={{ background: 'var(--card-bg)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <Card.Header style={{ background: 'var(--card-bg)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <h4 className="filter-title" style={{ color: 'var(--fg)' }}>
                  <FiTruck className="me-2" />
                  Vehicle Range Calculator
                </h4>
              </Card.Header>
              <Card.Body style={{ background: 'var(--card-bg)' }}>
                <Form.Group className="mb-3">
                  <Form.Label style={{ color: 'var(--fg)' }}>Vehicle Type</Form.Label>
                  <Form.Select 
                    value={selectedVehicleType}
                    onChange={(e) => setSelectedVehicleType(e.target.value)}
                    style={{ backgroundColor: '#2a2a2a', border: '1px solid rgba(255,255,255,0.3)', color: 'white' }}
                  >
                    <option value="" style={{ backgroundColor: '#2a2a2a', color: 'white' }}>Select Vehicle Type</option>
                    <option value="Car" style={{ backgroundColor: '#2a2a2a', color: 'white' }}>Car</option>
                    <option value="Bike" style={{ backgroundColor: '#2a2a2a', color: 'white' }}>Bike</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label style={{ color: 'var(--fg)' }}>Vehicle Brand</Form.Label>
                  <Form.Select 
                    value={selectedVehicleBrand}
                    onChange={(e) => setSelectedVehicleBrand(e.target.value)}
                    disabled={!selectedVehicleType}
                    style={{ backgroundColor: '#2a2a2a', border: '1px solid rgba(255,255,255,0.3)', color: 'white' }}
                  >
                    <option value="" style={{ backgroundColor: '#2a2a2a', color: 'white' }}>Select Brand</option>
                    {vehicleBrands.map(brand => (
                      <option key={brand.id} value={brand.name} style={{ backgroundColor: '#2a2a2a', color: 'white' }}>{brand.name}</option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label style={{ color: 'var(--fg)' }}>Vehicle Model</Form.Label>
                  <Form.Select 
                    value={selectedVehicleModel}
                    onChange={(e) => setSelectedVehicleModel(e.target.value)}
                    disabled={!selectedVehicleBrand}
                    style={{ backgroundColor: '#2a2a2a', border: '1px solid rgba(255,255,255,0.3)', color: 'white' }}
                  >
                    <option value="" style={{ backgroundColor: '#2a2a2a', color: 'white' }}>Select Model</option>
                    {vehicleModels.map(model => (
                      <option key={model.id} value={model.name} style={{ backgroundColor: '#2a2a2a', color: 'white' }}>{model.name}</option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label style={{ color: 'var(--fg)' }}>Vehicle Number</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g., MH12-AB-1234"
                    value={vehicleNumber}
                    onChange={handleVehicleNumberChange}
                    maxLength={13}
                    style={{ backgroundColor: '#2a2a2a', border: '1px solid rgba(255,255,255,0.3)', color: 'white' }}
                  />
                </Form.Group>

                {selectedVehicleModel && (
                  <>
                    <Form.Group className="mb-3">
                      <Form.Label>Current Battery: {batteryPercentage}%</Form.Label>
                      <Form.Range
                        min={10}
                        max={100}
                        step={5}
                        value={batteryPercentage}
                        onChange={(e) => setBatteryPercentage(parseInt(e.target.value))}
                      />
                    </Form.Group>

                    <div className="range-display mb-3">
                      <Badge bg="success" className="fs-6">
                        Available Range: {calculateAvailableRange()} km
                      </Badge>
                    </div>

                    <Button 
                      className="btn-primary w-100 mb-3"
                      onClick={saveVehicleData}
                    >
                      Save Vehicle Data
                    </Button>
                  </>
                )}
              </Card.Body>
            </Card>

            <Card className="filter-card" style={{ background: 'var(--card-bg)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <Card.Header style={{ background: 'var(--card-bg)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <h4 className="filter-title" style={{ color: 'var(--fg)' }}>
                  <FiFilter className="me-2" />
                  Filter Stations
                </h4>
              </Card.Header>
              <Card.Body style={{ background: 'var(--card-bg)' }}>
                <Form.Group className="mb-3">
                  <Form.Label>Check Availability For</Form.Label>
                  <Form.Control
                    type="date"
                    value={selectedDate}
                    min={new Date().toISOString().split('T')[0]}
                    max={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />
                  <small className="text-muted">Showing availability for {selectedDate === new Date().toISOString().split('T')[0] ? 'Today' : new Date(selectedDate).toLocaleDateString()}</small>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Station Status</Form.Label>
                  <Form.Select 
                    value={filters.status}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                  >
                    <option value="all">All Stations</option>
                    <option value="available">Available</option>
                    <option value="busy">Busy</option>
                    <option value="maintenance">Under Maintenance</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Charger Type</Form.Label>
                  <Form.Select 
                    value={filters.chargerType}
                    onChange={(e) => handleFilterChange('chargerType', e.target.value)}
                  >
                    <option value="all">All Chargers</option>
                    <option value="fast">Fast Charger (50kW+)</option>
                    <option value="slow">Slow Charger (&lt;50kW)</option>
                  </Form.Select>
                </Form.Group>

                <Button className="btn-primary w-100">
                  Apply Filters
                </Button>
              </Card.Body>
            </Card>
          </Col>
          
          <Col lg={9} className="map-container">
            <InteractiveMap 
              filters={filters} 
              userRange={calculateAvailableRange()}
              vehicleData={{
                type: selectedVehicleType,
                brand: selectedVehicleBrand,
                model: selectedVehicleModel,
                vehicleNumber: vehicleNumber,
                batteryPercent: batteryPercentage
              }}
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default MapView;