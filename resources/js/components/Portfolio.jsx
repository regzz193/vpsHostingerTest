import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Contact Form Component
const ContactForm = () => {
  const [formData, setFormData] = useState({
    sender: '',
    email: '',
    subject: '',
    content: ''
  });

  const [status, setStatus] = useState({
    submitting: false,
    success: false,
    error: null
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [id]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setStatus({ submitting: true, success: false, error: null });

    try {
      await axios.post('/api/messages', {
        sender: formData.sender,
        email: formData.email,
        subject: formData.subject,
        content: formData.content
      });

      // Reset form and show success message
      setFormData({ sender: '', email: '', subject: '', content: '' });
      setStatus({ submitting: false, success: true, error: null });

      // Clear success message after 5 seconds
      setTimeout(() => {
        setStatus(prevStatus => ({ ...prevStatus, success: false }));
      }, 5000);
    } catch (error) {
      console.error('Error sending message:', error);
      setStatus({
        submitting: false,
        success: false,
        error: error.response?.data?.errors || 'Failed to send message. Please try again.'
      });
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {status.success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Success!</strong>
          <span className="block sm:inline"> Your message has been sent successfully.</span>
        </div>
      )}

      {status.error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {typeof status.error === 'string' ? status.error : 'Failed to send message. Please try again.'}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="sender" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Name
          </label>
          <input
            type="text"
            id="sender"
            value={formData.sender}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-purple-600 focus:border-transparent dark:bg-gray-700 dark:text-white"
            placeholder="Your name"
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-purple-600 focus:border-transparent dark:bg-gray-700 dark:text-white"
            placeholder="Your email"
            required
          />
        </div>
      </div>
      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Subject
        </label>
        <input
          type="text"
          id="subject"
          value={formData.subject}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-purple-600 focus:border-transparent dark:bg-gray-700 dark:text-white"
          placeholder="Subject"
          required
        />
      </div>
      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Message
        </label>
        <textarea
          id="content"
          value={formData.content}
          onChange={handleChange}
          rows="5"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-purple-600 focus:border-transparent dark:bg-gray-700 dark:text-white"
          placeholder="Your message"
          required
        ></textarea>
      </div>
      <button
        type="submit"
        disabled={status.submitting}
        className={`w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-6 rounded-md hover:opacity-90 transition duration-300 ${
          status.submitting ? 'opacity-70 cursor-not-allowed' : ''
        }`}
      >
        {status.submitting ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
};

const Portfolio = () => {
  const [settings, setSettings] = useState({
    email: 'reggie.ambrocio@example.com',
    phone: '+1 (415) 555-0123',
    location: 'San Francisco, CA',
    about_me_1: "Hello! I'm Reggie, a passionate full-stack developer with expertise in building modern web applications. I specialize in creating responsive, user-friendly interfaces and robust backend systems.",
    about_me_2: "With a strong foundation in Laravel, React, and Tailwind CSS, I bring ideas to life through clean, efficient code and thoughtful design. I'm constantly learning and exploring new technologies to enhance my skills and deliver better solutions.",
    about_me_3: "When I'm not coding, you can find me exploring new technologies, contributing to open-source projects, or sharing my knowledge through writing and mentoring.",
    github_url: 'https://github.com/reggieambrocio',
    linkedin_url: 'https://linkedin.com/in/reggie-ambrocio',
    twitter_url: 'https://twitter.com/reggieambrocio'
  });

  const [skills, setSkills] = useState({
    frontend: [],
    backend: [],
    devops: []
  });

  const [isNavOpen, setIsNavOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  // Handle scroll events for navbar styling and active section
  useEffect(() => {
    const handleScroll = () => {
      // Add shadow to navbar when scrolled
      setScrolled(window.scrollY > 50);

      // Determine active section based on scroll position
      const sections = ['home', 'about', 'skills', 'projects', 'blog', 'contact'];
      const sectionElements = sections.map(id => document.getElementById(id));

      const currentSection = sectionElements.reduce((acc, section) => {
        if (!section) return acc;
        const rect = section.getBoundingClientRect();
        const offset = 100; // Offset to trigger section change earlier

        if (rect.top <= offset && rect.bottom > offset) {
          return section.id;
        }
        return acc;
      }, 'home');

      setActiveSection(currentSection);
    };

    // Add smooth scrolling
    document.documentElement.style.scrollBehavior = 'smooth';

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.documentElement.style.scrollBehavior = '';
    };
  }, []);

  // Fetch settings and skills on component mount
  useEffect(() => {
    fetchSettings();
    fetchSkills();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await axios.get('/api/profile-settings');
      setSettings(prevSettings => ({
        ...prevSettings,
        ...response.data.data
      }));
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const fetchSkills = async () => {
    try {
      const response = await axios.get('/api/skills/grouped');
      setSkills(response.data.data);
    } catch (error) {
      console.error('Error fetching skills:', error);
    }
  };

  // Close mobile menu when a link is clicked
  const handleNavLinkClick = () => {
    setIsNavOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Floating Social Media Links */}
      <div className="fixed right-6 top-1/2 transform -translate-y-1/2 z-50 flex flex-col space-y-4">
        <a
          href={settings.github_url}
          className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 p-3 rounded-full shadow-lg transition duration-300"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub Profile"
        >
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
          </svg>
        </a>
        <a
          href={settings.linkedin_url}
          className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 p-3 rounded-full shadow-lg transition duration-300"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn Profile"
        >
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
          </svg>
        </a>
        <a
          href={settings.twitter_url}
          className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 p-3 rounded-full shadow-lg transition duration-300"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Twitter Profile"
        >
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
          </svg>
        </a>
      </div>

      {/* Fixed Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm shadow-md'
            : 'bg-transparent'
        }`}
        aria-label="Main navigation"
      >
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between py-4">
            {/* Logo/Name */}
            <a
              href="#home"
              className={`text-xl font-bold transition-colors duration-300 ${
                scrolled
                  ? 'text-gray-900 dark:text-white'
                  : 'text-white'
              }`}
              aria-label="Reggie Ambrocio - Back to top"
            >
              Reggie Ambrocio
            </a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {['home', 'about', 'skills', 'projects', 'blog', 'contact'].map((item) => (
                <a
                  key={item}
                  href={`#${item}`}
                  className={`capitalize transition-colors duration-300 ${
                    activeSection === item
                      ? scrolled
                        ? 'text-purple-600 dark:text-purple-400 font-medium'
                        : 'text-white font-medium'
                      : scrolled
                        ? 'text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400'
                        : 'text-white/80 hover:text-white'
                  }`}
                  aria-current={activeSection === item ? 'page' : undefined}
                  onClick={handleNavLinkClick}
                >
                  {item}
                </a>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              type="button"
              className={`md:hidden p-2 rounded-md ${
                scrolled
                  ? 'text-gray-700 dark:text-gray-300'
                  : 'text-white'
              }`}
              onClick={() => setIsNavOpen(!isNavOpen)}
              aria-expanded={isNavOpen}
              aria-controls="mobile-menu"
              aria-label="Toggle menu"
            >
              {isNavOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          <div
            id="mobile-menu"
            className={`md:hidden transition-all duration-300 overflow-hidden ${
              isNavOpen ? 'max-h-96 pb-6' : 'max-h-0'
            }`}
            aria-hidden={!isNavOpen}
          >
            <div className="flex flex-col space-y-4">
              {['home', 'about', 'skills', 'projects', 'blog', 'contact'].map((item) => (
                <a
                  key={item}
                  href={`#${item}`}
                  className={`capitalize py-2 px-4 rounded-md transition-colors duration-300 ${
                    activeSection === item
                      ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 font-medium'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                  aria-current={activeSection === item ? 'page' : undefined}
                  onClick={handleNavLinkClick}
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header id="home" className="relative overflow-hidden bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="absolute inset-0 bg-[url('/img/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
        <div className="relative container mx-auto px-6 py-24 md:py-32 lg:py-40 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Reggie Ambrocio
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl">
            Full Stack Developer & Digital Craftsman
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="#contact"
              className="bg-white text-purple-600 hover:bg-gray-100 px-6 py-3 rounded-lg font-medium transition duration-300"
              aria-label="Contact Me - Jump to contact form"
            >
              Contact Me
            </a>
            <a
              href="#projects"
              className="bg-transparent border border-white hover:bg-white/10 px-6 py-3 rounded-lg font-medium transition duration-300"
              aria-label="View My Work - Jump to projects section"
            >
              View My Work
            </a>
            <a
              href="#blog"
              className="bg-transparent border border-white hover:bg-white/10 px-6 py-3 rounded-lg font-medium transition duration-300"
              aria-label="Read My Blog - Jump to blog section"
            >
              Read My Blog
            </a>
          </div>
        </div>
      </header>

      {/* About Section */}
      <section id="about" className="py-16 md:py-24 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-gray-800 dark:text-white">
            About Me
          </h2>
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <img
                src="/images/_CDR9065.png"
                alt="Reggie Ambrocio"
                className="rounded-lg shadow-lg w-full max-w-md mx-auto"
              />
              <div className="mt-6 text-center">
                <a
                  href="/cv/Blue Simple Professional CV Resume.pdf"
                  download
                  className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition duration-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download CV
                </a>
              </div>
            </div>
            <div className="md:w-1/2">
              <p className="text-lg mb-6 text-gray-600 dark:text-gray-300">
                {settings.about_me_1}
              </p>
              <p className="text-lg mb-6 text-gray-600 dark:text-gray-300">
                {settings.about_me_2}
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                {settings.about_me_3}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-16 md:py-24 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-gray-800 dark:text-white">
            My Skills
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Frontend Skills */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
              <div className="text-purple-600 dark:text-purple-400 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Frontend Development</h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                {skills.frontend && skills.frontend.length > 0 ? (
                  skills.frontend.map(skill => (
                    <li key={skill.id} className="flex items-center">
                      <span className="mr-2">•</span>
                      {skill.name}
                    </li>
                  ))
                ) : (
                  <li className="flex items-center">
                    <span className="mr-2">•</span>
                    Loading skills...
                  </li>
                )}
              </ul>
            </div>

            {/* Backend Skills */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
              <div className="text-blue-600 dark:text-blue-400 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Backend Development</h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                {skills.backend && skills.backend.length > 0 ? (
                  skills.backend.map(skill => (
                    <li key={skill.id} className="flex items-center">
                      <span className="mr-2">•</span>
                      {skill.name}
                    </li>
                  ))
                ) : (
                  <li className="flex items-center">
                    <span className="mr-2">•</span>
                    Loading skills...
                  </li>
                )}
              </ul>
            </div>

            {/* DevOps Skills */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
              <div className="text-green-600 dark:text-green-400 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">DevOps & Tools</h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                {skills.devops && skills.devops.length > 0 ? (
                  skills.devops.map(skill => (
                    <li key={skill.id} className="flex items-center">
                      <span className="mr-2">•</span>
                      {skill.name}
                    </li>
                  ))
                ) : (
                  <li className="flex items-center">
                    <span className="mr-2">•</span>
                    Loading skills...
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-16 md:py-24 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-gray-800 dark:text-white">
            Featured Projects
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Project 1 */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg overflow-hidden shadow-md transition-transform duration-300 hover:transform hover:scale-105">
              <img
                src="https://images.unsplash.com/photo-1557821552-17105176677c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400&q=80"
                alt="E-Commerce Platform"
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">E-Commerce Platform</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  A full-featured online store with product management, cart functionality, and secure checkout.
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1 bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-200 text-sm rounded-full">Laravel</span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200 text-sm rounded-full">React</span>
                  <span className="px-3 py-1 bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-200 text-sm rounded-full">MySQL</span>
                </div>
                <a
                  href="#"
                  className="text-purple-600 dark:text-purple-400 font-medium hover:underline"
                >
                  View Project →
                </a>
              </div>
            </div>

            {/* Project 2 */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg overflow-hidden shadow-md transition-transform duration-300 hover:transform hover:scale-105">
              <img
                src="https://images.unsplash.com/photo-1540350394557-8d14678e7f91?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400&q=80"
                alt="Task Management App"
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">Task Management App</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  A collaborative task management tool with real-time updates and team collaboration features.
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1 bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-200 text-sm rounded-full">Next.js</span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200 text-sm rounded-full">Tailwind</span>
                  <span className="px-3 py-1 bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-200 text-sm rounded-full">Firebase</span>
                </div>
                <a
                  href="#"
                  className="text-purple-600 dark:text-purple-400 font-medium hover:underline"
                >
                  View Project →
                </a>
              </div>
            </div>

            {/* Project 3 */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg overflow-hidden shadow-md transition-transform duration-300 hover:transform hover:scale-105">
              <img
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400&q=80"
                alt="Analytics Dashboard"
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">Analytics Dashboard</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  A comprehensive analytics dashboard with data visualization and reporting capabilities.
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1 bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-200 text-sm rounded-full">Vue.js</span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200 text-sm rounded-full">Express</span>
                  <span className="px-3 py-1 bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-200 text-sm rounded-full">MongoDB</span>
                </div>
                <a
                  href="#"
                  className="text-purple-600 dark:text-purple-400 font-medium hover:underline"
                >
                  View Project →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section id="blog" className="py-16 md:py-24 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-gray-800 dark:text-white">
            Blog & Articles
          </h2>
          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-center text-gray-600 dark:text-gray-300 mb-12">
              I share my insights and experiences in web development, best practices, and emerging technologies.
            </p>

            <div className="space-y-10">
              {/* Blog Post 1 */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>June 15, 2023</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-gray-800 dark:text-white">
                    Building Scalable React Applications with Custom Hooks
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Custom hooks are one of React's most powerful features, allowing developers to extract and reuse stateful logic across components. In this article, I explore how to create and implement custom hooks to improve code reusability, readability, and maintainability in large-scale React applications.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-3 py-1 bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-200 text-sm rounded-full">React</span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200 text-sm rounded-full">JavaScript</span>
                    <span className="px-3 py-1 bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-200 text-sm rounded-full">Web Development</span>
                  </div>
                  <a
                    href="#"
                    className="text-purple-600 dark:text-purple-400 font-medium hover:underline inline-flex items-center"
                  >
                    Read Full Article
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* Blog Post 2 */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>May 22, 2023</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-gray-800 dark:text-white">
                    Optimizing Laravel API Performance for High-Traffic Applications
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    As applications scale, API performance becomes increasingly critical. In this deep dive, I share techniques I've implemented to optimize Laravel API endpoints, including efficient database queries, caching strategies, and asynchronous processing. Learn how these optimizations reduced response times by 60% in a recent project.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-3 py-1 bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-200 text-sm rounded-full">Laravel</span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200 text-sm rounded-full">API</span>
                    <span className="px-3 py-1 bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-200 text-sm rounded-full">Performance</span>
                  </div>
                  <a
                    href="#"
                    className="text-purple-600 dark:text-purple-400 font-medium hover:underline inline-flex items-center"
                  >
                    Read Full Article
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* Blog Post 3 */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>April 10, 2023</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-gray-800 dark:text-white">
                    From Concept to Deployment: Building a Full-Stack E-Commerce Platform
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    In this case study, I walk through the entire process of creating a modern e-commerce platform from initial concept to production deployment. I discuss the technical decisions made along the way, challenges encountered, and solutions implemented. This article provides insights into architecture planning, technology selection, and development workflow.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-3 py-1 bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-200 text-sm rounded-full">Full-Stack</span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200 text-sm rounded-full">E-Commerce</span>
                    <span className="px-3 py-1 bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-200 text-sm rounded-full">Case Study</span>
                  </div>
                  <a
                    href="#"
                    className="text-purple-600 dark:text-purple-400 font-medium hover:underline inline-flex items-center"
                  >
                    Read Full Article
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-10 text-center">
              <a
                href="#"
                className="inline-flex items-center px-6 py-3 border border-purple-600 text-purple-600 dark:text-purple-400 dark:border-purple-400 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition duration-300"
              >
                View All Articles
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 md:py-24 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-gray-800 dark:text-white">
            Get In Touch
          </h2>
          <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 p-8">
            <ContactForm />
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">Email</h3>
              <p className="text-gray-600 dark:text-gray-300">{settings.email}</p>
            </div>

            <div>
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">Phone</h3>
              <p className="text-gray-600 dark:text-gray-300">{settings.phone}</p>
            </div>

            <div>
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">Location</h3>
              <p className="text-gray-600 dark:text-gray-300">{settings.location}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-6 text-center">
          <p>&copy; {new Date().getFullYear()} Reggie Ambrocio. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Portfolio;
