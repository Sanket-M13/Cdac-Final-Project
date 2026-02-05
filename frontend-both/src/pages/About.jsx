import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { FiZap, FiUsers, FiTarget, FiAward } from 'react-icons/fi';
import './About.css';
import chargerImage from "../assets/charger.svg";
import linkedin from "../assets/linkedin.svg";
import user from "../assets/user.svg";


const About = () => {
  const stats = [
    { icon: FiZap, number: '10,000+', label: 'Charging Stations' },
    { icon: FiUsers, number: '50,000+', label: 'Happy Users' },
    { icon: FiTarget, number: '99.9%', label: 'Uptime' },
    { icon: FiAward, number: '24/7', label: 'Support' }
  ];

  const team = [
    {
      name: 'Sanket Mandavgane',
      link: 'https://www.linkedin.com/in/sanket-mandavgane-123456789/'
    },
    {
      name: 'Sanket Shalukar',
      link: 'https://www.linkedin.com/in/sanket-shalukar-89022a204/'
    },
    {
      name: 'Vedant Shiradhonakar',
      link: 'https://www.linkedin.com/in/vedantshiradhonkar/'
    },
    {
      name: 'Nishant Desle',
      link: 'https://www.linkedin.com/in/nishant-desle-b5ab54284/'
    },
    {
      name: 'Sanjukta Sarkar',
      link: 'https://www.linkedin.com/in/sanjukta-sarkar-2b4b091ba/'
    }
  ];

  return (
    <div className="about-page">
      <Container>
        {/* Hero Section */}
        <Row className="justify-content-center text-center mb-5">
          <Col lg={8}>
            <div className="about-hero">
              <h1 className="about-title">About EV Charger Finder</h1>
              <p className="about-subtitle">
                We're on a mission to make electric vehicle charging accessible, 
                reliable, and convenient for everyone.
              </p>
            </div>
          </Col>
        </Row>

        {/* Stats Section */}
        <Row className="stats-section mb-5">
          {stats.map((stat, index) => (
            <Col key={index} md={6} lg={3} className="mb-4">
              <Card className="stat-card text-center">
                <Card.Body>
                  <div className="stat-icon">
                    <stat.icon size={32} />
                  </div>
                  <h3 className="stat-number">{stat.number}</h3>
                  <p className="stat-label">{stat.label}</p>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Mission Section */}
        <Row className="mission-section mb-5">
          <Col lg={6}>
            <div className="mission-content">
              <h2 className="section-title">Our Mission</h2>
              <p className="mission-text">
                At EV Charger Finder, we believe that the future of transportation is electric. 
                Our platform connects EV drivers with reliable charging stations, making it easier 
                than ever to plan trips, find available chargers, and contribute to a cleaner planet.
              </p>
              <p className="mission-text">
                We're committed to building the most comprehensive and user-friendly EV charging 
                network, supporting the transition to sustainable transportation one charge at a time.
              </p>
            </div>
          </Col>
          <Col lg={3}>
            <div className="mission-image">
              <img 
                src={chargerImage} 
                alt="EV Charging Station"
                className="charger-image"
              />
            </div>
          </Col>
        </Row>

        {/* Values Section */}
        <Row className="values-section mb-5">
          <Col>
            <h2 className="section-title text-center mb-4">Our Values</h2>
          </Col>
        </Row>
        <Row>
          <Col md={4} className="mb-4">
            <Card className="value-card">
              <Card.Body>
                <div className="value-icon">
                  <FiZap size={24} />
                </div>
                <h4>Innovation</h4>
                <p>
                  We continuously innovate to provide cutting-edge solutions 
                  for the evolving EV ecosystem.
                </p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="mb-4">
            <Card className="value-card">
              <Card.Body>
                <div className="value-icon">
                  <FiUsers size={24} />
                </div>
                <h4>Community</h4>
                <p>
                  Building a strong community of EV enthusiasts and supporting 
                  sustainable transportation adoption.
                </p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="mb-4">
            <Card className="value-card">
              <Card.Body>
                <div className="value-icon">
                  <FiTarget size={24} />
                </div>
                <h4>Reliability</h4>
                <p>
                  Providing accurate, real-time information you can trust 
                  for all your charging needs.
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Team Section */}
        <Row className="team-section">
          <Col>
            <h2 className="section-title text-center mb-4">Meet Our Team</h2>
          </Col>
        </Row>
        <Row className="justify-content-center">
          {team.map((member, index) => (
            <Col key={index} md={6} lg={4} className="mb-4">
              <Card className="team-card">
                <Card.Body className="text-center d-flex flex-column align-items-center">
                <div className="value-icon">
                  <FiUsers size={24} />
                </div>
                  <h4 className="team-name">{member.name}</h4>
                  <a href={member.link} className="team-linkedin"> <img
                    src={linkedin}
                    alt="LinkedIn profile"
                    style={{ width: '400px', height: '40px', marginTop: '10px' }}
                  /></a>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* CTA Section */}
        <Row className="cta-section text-center">
          <Col lg={8} className="mx-auto">
            <div className="cta-content">
              <h2 className="cta-title">Ready to Start Your EV Journey?</h2>
              <p className="cta-text">
                Join thousands of EV drivers who trust us to find reliable charging stations.
              </p>
              <div className="cta-buttons">
                <a href="/register" className="btn btn-primary me-3">
                  Get Started
                </a>
                <a href="/find-chargers" className="btn btn-secondary">
                  Find Chargers
                </a>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default About;