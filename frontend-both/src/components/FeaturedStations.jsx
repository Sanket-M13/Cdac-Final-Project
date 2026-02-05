import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Badge } from 'react-bootstrap';
import { FiMapPin, FiZap, FiClock } from 'react-icons/fi';
import { stationService } from '../services/stationService';
import './FeaturedStations.css';

const FeaturedStations = () => {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStations();
  }, []);

  const fetchStations = async () => {
    try {
      const data = await stationService.getAllStations();
      const stationsData = Array.isArray(data) ? data : data.stations || [];
      // Take only first 3 stations for featured display
      setStations(stationsData.slice(0, 3));
    } catch (error) {
      console.error('Error fetching stations:', error);
      // Fallback to empty array on error
      setStations([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="featured-stations">
        <Container>
          <Row>
            <Col>
              <h2 className="section-title">Featured Stations</h2>
              <div className="stations-grid">
                {[1, 2, 3].map(i => (
                  <div key={i} className="station-card skeleton">
                    <div className="station-image skeleton"></div>
                    <div className="station-content">
                      <div className="skeleton-line"></div>
                      <div className="skeleton-line short"></div>
                    </div>
                  </div>
                ))}
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    );
  }

  return (
    <section className="featured-stations">
      <Container>
        <Row className="justify-content-center text-center mb-5">
          <Col lg={8}>
            <h2 className="section-title">Featured Stations</h2>
            <p className="section-subtitle">
              Popular charging stations near you
            </p>
          </Col>
        </Row>
        
        <Row>
          {stations.map(station => (
            <Col key={station.id} lg={4} md={6} className="mb-4">
              <div className="station-card">
                <div className="station-image">
                  <img src="https://images.unsplash.com/photo-1593941707882-a5bac6861d75?w=300&h=200&fit=crop" alt={station.name} />
                  <Badge 
                    className={`availability-badge ${station.status === 'Available' ? 'available' : 'busy'}`}
                  >
                    {station.status === 'Available' ? 'Available' : 'Busy'}
                  </Badge>
                </div>
                
                <div className="station-content">
                  <h3 className="station-name">{station.name}</h3>
                  
                  <div className="station-meta">
                    <div className="meta-item">
                      <FiMapPin size={16} />
                      <span>{station.address}</span>
                    </div>
                    <div className="meta-item">
                      <FiZap size={16} />
                      <span>₹{station.pricePerKwh}/kWh</span>
                    </div>
                    <div className="meta-item">
                      <FiClock size={16} />
                      <span>{station.availableSlots}/{station.totalSlots} available</span>
                    </div>
                  </div>
                  
                  <div className="connectors">
                    {(station.connectorTypes || []).map(connector => (
                      <Badge key={connector} className="connector-badge">
                        {connector}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default FeaturedStations;