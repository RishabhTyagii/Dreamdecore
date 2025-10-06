"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Navbar from '../components/Navbar';
import styles from '../styles/Home.module.css';

export default function Home() {
  const [homeContent, setHomeContent] = useState(null);
  const [services, setServices] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const BASE_URL = "http://127.0.0.1:8000";

  // Helper to safely form image URLs
  const getImageUrl = (path) => {
    if (!path) return "";
    return path.startsWith("http") ? path : `${BASE_URL}${path}`;
  };

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const [homeRes, serviceRes, portfolioRes, testimonialRes] = await Promise.all([
          fetch(`${BASE_URL}/api/home-content/`),
          fetch(`${BASE_URL}/api/services/`),
          fetch(`${BASE_URL}/api/portfolio/`),
          fetch(`${BASE_URL}/api/testimonials/`),
        ]);

        const homeData = await homeRes.json();
        const serviceData = await serviceRes.json();
        const portfolioData = await portfolioRes.json();
        const testimonialData = await testimonialRes.json();

        setHomeContent(homeData[0]);
        setServices(serviceData);
        setPortfolio(portfolioData);
        setTestimonials(testimonialData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  // Intersection observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add(styles.visible);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll(`.${styles.fadeIn}`).forEach((el) => observer.observe(el));
    
    return () => observer.disconnect();
  }, [homeContent, services, portfolio, testimonials]);

  // Filter portfolio items
  const filteredPortfolio = activeFilter === 'all' 
    ? portfolio 
    : portfolio.filter(item => item.category?.toLowerCase() === activeFilter);

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}>
          <div className={styles.spinner}></div>
          <p>Loading Elegant Interiors...</p>
        </div>
      </div>
    );
  }

  if (!homeContent) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorContent}>
          <h2>Unable to Load Content</h2>
          <p>Please check if the server is running and try again.</p>
          <button 
            onClick={() => window.location.reload()} 
            className={styles.retryButton}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Use the Navbar Component */}
      <Navbar />

      {/* Hero Section */}
      <section id="home" className={`${styles.hero} ${styles.fadeIn}`}>
        {homeContent.hero_image && (
          <Image
            src={getImageUrl(homeContent.hero_image)}
            alt="Hero"
            fill
            className={styles.heroBackground}
            priority
          />
        )}
        <div className={styles.heroOverlay}></div>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>{homeContent.title}</h1>
          {homeContent.subtitle && (
            <p className={styles.btn}>{homeContent.subtitle}</p>
          )}
          <div className={styles.heroBtns}>
            <a href="#portfolio" className={styles.btn}>View Our Work</a>
            <a href="#contact" className={`${styles.btn} ${styles.btnOutline}`}>Get In Touch</a>
          </div>
        </div>
      </section>

      {/* About Section */}
      {homeContent.about_section && (
        <section id="about" className={`${styles.section} ${styles.about} ${styles.fadeIn}`}>
          <div className={styles.container}>
            <div className={styles.aboutContent}>
              <div className={styles.aboutText}>
                <h2>About Elegant Interiors</h2>
                <p>{homeContent.about_section}</p>
                <p>Our team of talented designers works closely with you to understand your vision and bring it to life, ensuring every detail is perfect.</p>
                <p>We believe that great design has the power to transform lives, and we're passionate about creating environments that inspire and delight.</p>
                <a href="#contact" className={styles.btn}>Learn More</a>
              </div>
              <div className={styles.aboutImage}>
                <Image
                  src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=958&q=80"
                  alt="About Us"
                  width={600}
                  height={400}
                  className={styles.aboutImg}
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Services Section */}
      {services.length > 0 && (
        <section id="services" className={`${styles.section} ${styles.services} ${styles.fadeIn}`}>
          <div className={styles.container}>
            <div className={styles.sectionTitle}>
              <h2>Our Services</h2>
              <p>We offer a comprehensive range of interior design services to meet all your needs</p>
            </div>
            <div className={styles.servicesGrid}>
              {services.map((service, index) => (
                <div 
                  key={service.id} 
                  className={`${styles.serviceCard} ${styles.fadeIn}`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {service.image && (
                    <div className={styles.serviceImage}>
                      <Image
                        src={getImageUrl(service.image)}
                        alt={service.title}
                        width={400}
                        height={280}
                        className={styles.serviceImg}
                      />
                    </div>
                  )}
                  <div className={styles.serviceContent}>
                    <h3>{service.title}</h3>
                    <p>{service.description}</p>
                    <a href="#contact" className={styles.serviceLink}>
                      Learn More <i className="fas fa-arrow-right"></i>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Portfolio Section */}
      {portfolio.length > 0 && (
        <section id="portfolio" className={`${styles.section} ${styles.portfolio} ${styles.fadeIn}`}>
          <div className={styles.container}>
            <div className={styles.sectionTitle}>
              <h2>Our Portfolio</h2>
              <p>Explore some of our recent projects that showcase our design expertise</p>
            </div>
            <div className={styles.portfolioFilters}>
              <button 
                className={`${styles.filterBtn} ${activeFilter === 'all' ? styles.active : ''}`}
                onClick={() => setActiveFilter('all')}
              >
                All
              </button>
              <button 
                className={`${styles.filterBtn} ${activeFilter === 'residential' ? styles.active : ''}`}
                onClick={() => setActiveFilter('residential')}
              >
                Residential
              </button>
              <button 
                className={`${styles.filterBtn} ${activeFilter === 'commercial' ? styles.active : ''}`}
                onClick={() => setActiveFilter('commercial')}
              >
                Commercial
              </button>
              <button 
                className={`${styles.filterBtn} ${activeFilter === 'hospitality' ? styles.active : ''}`}
                onClick={() => setActiveFilter('hospitality')}
              >
                Hospitality
              </button>
            </div>
            <div className={styles.portfolioGrid}>
              {filteredPortfolio.map((item, index) => (
                <div 
                  key={item.id} 
                  className={`${styles.portfolioItem} ${styles.fadeIn}`}
                  data-category={item.category?.toLowerCase()}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {item.image && (
                    <div className={styles.portfolioImage}>
                      <Image
                        src={getImageUrl(item.image)}
                        alt={item.title}
                        width={400}
                        height={300}
                        className={styles.portfolioImg}
                      />
                    </div>
                  )}
                  <div className={styles.portfolioOverlay}>
                    <h3>{item.title}</h3>
                    <p>{item.category}</p>
                  </div>
                  <div className={styles.portfolioContent}>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                    <span className={styles.portfolioCategory}>{item.category}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials Section */}
      {testimonials.length > 0 && (
        <section id="testimonials" className={`${styles.section} ${styles.testimonials} ${styles.fadeIn}`}>
          <div className={styles.container}>
            <div className={styles.sectionTitle}>
              <h2>Client Testimonials</h2>
              <p>What our clients say about our work and services</p>
            </div>
            <div className={styles.testimonialsSlider}>
              {testimonials.map((testimonial, index) => (
                <div 
                  key={testimonial.id} 
                  className={`${styles.testimonialItem} ${styles.fadeIn}`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <p className={styles.testimonialText}>"{testimonial.content}"</p>
                  <div className={styles.testimonialAuthor}>
                    {testimonial.client_image && (
                      <div className={styles.authorImage}>
                        <Image
                          src={getImageUrl(testimonial.client_image)}
                          alt={testimonial.client_name}
                          width={60}
                          height={60}
                          className={styles.clientImage}
                        />
                      </div>
                    )}
                    <div className={styles.authorInfo}>
                      <h4>{testimonial.client_name}</h4>
                      <p>{testimonial.client_project || "Homeowner"}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact Section */}
      <section id="contact" className={`${styles.section} ${styles.contact} ${styles.fadeIn}`}>
        <div className={styles.container}>
          <div className={styles.sectionTitle}>
            <h2>Get In Touch</h2>
            <p>Ready to transform your space? Contact us for a consultation</p>
          </div>
          <div className={styles.contactContent}>
            <div className={styles.contactInfo}>
              <div className={styles.contactInfoItem}>
                <div className={styles.contactIcon}>
                  <i className="fas fa-map-marker-alt"></i>
                </div>
                <div className={styles.contactDetails}>
                  <h3>Our Location</h3>
                  <p>123 Design Street, Creative City, CC 12345</p>
                </div>
              </div>
              <div className={styles.contactInfoItem}>
                <div className={styles.contactIcon}>
                  <i className="fas fa-phone"></i>
                </div>
                <div className={styles.contactDetails}>
                  <h3>Phone Number</h3>
                  <p>+1 (555) 123-4567</p>
                </div>
              </div>
              <div className={styles.contactInfoItem}>
                <div className={styles.contactIcon}>
                  <i className="fas fa-envelope"></i>
                </div>
                <div className={styles.contactDetails}>
                  <h3>Email Address</h3>
                  <p>info@elegantinteriors.com</p>
                </div>
              </div>
              <div className={styles.contactInfoItem}>
                <div className={styles.contactIcon}>
                  <i className="fas fa-clock"></i>
                </div>
                <div className={styles.contactDetails}>
                  <h3>Working Hours</h3>
                  <p>Monday - Friday: 9am - 6pm</p>
                  <p>Saturday: 10am - 4pm</p>
                </div>
              </div>
            </div>
            <div className={styles.contactForm}>
              <form onSubmit={(e) => {
                e.preventDefault();
                alert('Thank you for your message! We will get back to you soon.');
                e.target.reset();
              }}>
                <div className={styles.formGroup}>
                  <input 
                    type="text" 
                    className={styles.formControl}
                    placeholder="Your Name" 
                    required 
                  />
                </div>
                <div className={styles.formGroup}>
                  <input 
                    type="email" 
                    className={styles.formControl}
                    placeholder="Your Email" 
                    required 
                  />
                </div>
                <div className={styles.formGroup}>
                  <input 
                    type="text" 
                    className={styles.formControl}
                    placeholder="Subject" 
                  />
                </div>
                <div className={styles.formGroup}>
                  <textarea 
                    className={styles.formControl}
                    placeholder="Your Message" 
                    rows="6"
                    required
                  ></textarea>
                </div>
                <button type="submit" className={styles.btn}>Send Message</button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.footerContent}>
            <div className={styles.footerCol}>
              <h3>Elegant Interiors</h3>
              <p>Creating beautiful, functional spaces that inspire and delight. Transform your environment with our expert design services.</p>
              <div className={styles.socialLinks}>
                <a href="#"><i className="fab fa-facebook-f"></i></a>
                <a href="#"><i className="fab fa-twitter"></i></a>
                <a href="#"><i className="fab fa-instagram"></i></a>
                <a href="#"><i className="fab fa-linkedin-in"></i></a>
                <a href="#"><i className="fab fa-pinterest"></i></a>
              </div>
            </div>
            <div className={styles.footerCol}>
              <h3>Quick Links</h3>
              <ul className={styles.footerLinks}>
                <li><a href="#home">Home</a></li>
                <li><a href="#about">About Us</a></li>
                <li><a href="#services">Services</a></li>
                <li><a href="#portfolio">Portfolio</a></li>
                <li><a href="#testimonials">Testimonials</a></li>
                <li><a href="#contact">Contact</a></li>
              </ul>
            </div>
            <div className={styles.footerCol}>
              <h3>Our Services</h3>
              <ul className={styles.footerLinks}>
                <li><a href="#">Residential Design</a></li>
                <li><a href="#">Commercial Design</a></li>
                <li><a href="#">Space Planning</a></li>
                <li><a href="#">Furniture Selection</a></li>
                <li><a href="#">Color Consultation</a></li>
                <li><a href="#">Lighting Design</a></li>
              </ul>
            </div>
            <div className={styles.footerCol}>
              <h3>Newsletter</h3>
              <p>Subscribe to our newsletter for the latest updates and design tips.</p>
              <form onSubmit={(e) => e.preventDefault()}>
                <div className={styles.formGroup}>
                  <input 
                    type="email" 
                    className={styles.formControl}
                    placeholder="Your Email" 
                    required 
                  />
                </div>
                <button type="submit" className={styles.btn}>Subscribe</button>
              </form>
            </div>
          </div>
          <div className={styles.footerBottom}>
            <p>&copy; 2024 Elegant Interiors. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}