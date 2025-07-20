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

// Developer Badge Component
const DeveloperBadge = ({ skillAnalytics }) => {
  // Calculate years of experience since 2023
  const calculateExperience = () => {
    const startYear = 2023;
    const currentYear = new Date().getFullYear();
    return Math.max(0, currentYear - startYear);
  };

  // Determine developer level based on skill analytics or fallback to years of experience
  const getDeveloperLevel = () => {
    // If skill analytics data is available, use it to determine the level
    if (skillAnalytics && skillAnalytics.senior_level_analysis) {
      const { level } = skillAnalytics.senior_level_analysis;

      if (level === 'Senior') {
        return {
          level: 'Senior Developer',
          gradient: 'from-purple-400 to-purple-600',
          textColor: 'text-white',
          bgColor: 'bg-gradient-to-r from-purple-400 to-purple-600',
          darkBgColor: 'dark:from-purple-500 dark:to-purple-700',
          borderColor: 'border-purple-300',
          darkBorderColor: 'dark:border-purple-600',
          shadowColor: 'shadow-purple-500/20',
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
            </svg>
          )
        };
      } else if (level === 'Mid-level') {
        return {
          level: 'Mid Level Developer',
          gradient: 'from-blue-400 to-blue-600',
          textColor: 'text-white',
          bgColor: 'bg-gradient-to-r from-blue-400 to-blue-600',
          darkBgColor: 'dark:from-blue-500 dark:to-blue-700',
          borderColor: 'border-blue-300',
          darkBorderColor: 'dark:border-blue-600',
          shadowColor: 'shadow-blue-500/20',
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
            </svg>
          )
        };
      } else {
        return {
          level: 'Junior Developer',
          gradient: 'from-green-400 to-green-600',
          textColor: 'text-white',
          bgColor: 'bg-gradient-to-r from-green-400 to-green-600',
          darkBgColor: 'dark:from-green-500 dark:to-green-700',
          borderColor: 'border-green-300',
          darkBorderColor: 'dark:border-green-600',
          shadowColor: 'shadow-green-500/20',
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-11.25a.75.75 0 00-1.5 0v4.59L7.3 9.24a.75.75 0 00-1.1 1.02l3.25 3.5a.75.75 0 001.1 0l3.25-3.5a.75.75 0 10-1.1-1.02l-1.95 2.1V6.75z" clipRule="evenodd" />
            </svg>
          )
        };
      }
    }

    // Fallback to years of experience if skill analytics data is not available
    const years = calculateExperience();

    if (years < 0) { // This condition will never be true with the current calculation
      return {
        level: 'Junior Developer',
        gradient: 'from-green-400 to-green-600',
        textColor: 'text-white',
        bgColor: 'bg-gradient-to-r from-green-400 to-green-600',
        darkBgColor: 'dark:from-green-500 dark:to-green-700',
        borderColor: 'border-green-300',
        darkBorderColor: 'dark:border-green-600',
        shadowColor: 'shadow-green-500/20',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-11.25a.75.75 0 00-1.5 0v4.59L7.3 9.24a.75.75 0 00-1.1 1.02l3.25 3.5a.75.75 0 001.1 0l3.25-3.5a.75.75 0 10-1.1-1.02l-1.95 2.1V6.75z" clipRule="evenodd" />
          </svg>
        )
      };
    } else if (years < 5) {
      return {
        level: 'Mid Level Developer',
        gradient: 'from-blue-400 to-blue-600',
        textColor: 'text-white',
        bgColor: 'bg-gradient-to-r from-blue-400 to-blue-600',
        darkBgColor: 'dark:from-blue-500 dark:to-blue-700',
        borderColor: 'border-blue-300',
        darkBorderColor: 'dark:border-blue-600',
        shadowColor: 'shadow-blue-500/20',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
          </svg>
        )
      };
    } else {
      return {
        level: 'Experienced Developer',
        gradient: 'from-purple-400 to-purple-600',
        textColor: 'text-white',
        bgColor: 'bg-gradient-to-r from-purple-400 to-purple-600',
        darkBgColor: 'dark:from-purple-500 dark:to-purple-700',
        borderColor: 'border-purple-300',
        darkBorderColor: 'dark:border-purple-600',
        shadowColor: 'shadow-purple-500/20',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
          </svg>
        )
      };
    }
  };

  const { level, gradient, textColor, bgColor, darkBgColor, borderColor, darkBorderColor, shadowColor, icon } = getDeveloperLevel();

  return (
    <div className="absolute top-4 right-4 z-10">
      {/* Modern badge design with enhanced visibility */}
      <div className={`${bgColor} ${darkBgColor} ${textColor} rounded-md shadow-xl px-3.5 py-2 border border-white/30 backdrop-blur-md transition-all duration-300 hover:shadow-2xl transform hover:scale-105 hover:translate-y-[-2px] ring-2 ring-white/10`}>
        <div className="flex items-center space-x-2">
          <div className="bg-white/30 rounded-full p-1.5 shadow-inner">
            {icon}
          </div>
          <span className="font-bold text-sm tracking-wide">{level}</span>
        </div>

        {/* Enhanced shine effect */}
        <div className="absolute inset-0 overflow-hidden rounded-md pointer-events-none">
          <div className="absolute -top-6 left-0 right-0 h-10 bg-white/20 blur-sm transform rotate-15"></div>
        </div>
      </div>
    </div>
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

  const [projects, setProjects] = useState([]);
  const [blogPosts, setBlogPosts] = useState([]);
  const [skillAnalytics, setSkillAnalytics] = useState(null);

  const [isNavOpen, setIsNavOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  // Handle scroll events for navbar styling and active section
  useEffect(() => {
    const handleScroll = () => {
      // Add shadow to navbar when scrolled
      setScrolled(window.scrollY > 50);

      // Determine active section based on scroll position
      const sections = ['home', 'about', 'experience', 'skills', 'projects', 'blog', 'contact'];
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

  // Fetch settings, skills, projects, blog posts, and skill analytics on component mount
  useEffect(() => {
    fetchSettings();
    fetchSkills();
    fetchProjects();
    fetchBlogPosts();
    fetchSkillAnalytics();

    // Track page visit
    trackPageVisit();
  }, []);

  // Fetch skill analytics data
  const fetchSkillAnalytics = async () => {
    try {
      const response = await axios.get('/api/skill-analytics');
      setSkillAnalytics(response.data);
      console.log('Skill analytics data:', response.data);
    } catch (error) {
      console.error('Error fetching skill analytics:', error);
    }
  };

  // Track page visit for analytics
  const trackPageVisit = async () => {
    try {
      await axios.post('/api/analytics/track', {
        page: window.location.pathname
      });
      console.log('Page visit tracked successfully');
    } catch (error) {
      console.error('Error tracking page visit:', error);
    }
  };

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

  const fetchProjects = async () => {
    try {
      const response = await axios.get('/api/featured-projects');
      // Filter only active projects
      const activeProjects = response.data.data.filter(project => project.is_active);
      setProjects(activeProjects);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const fetchBlogPosts = async () => {
    try {
      const response = await axios.get('/api/blog-posts');
      // Filter only active blog posts
      const activePosts = response.data.data.filter(post => post.is_active);
      setBlogPosts(activePosts);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    }
  };

  // Close mobile menu when a link is clicked
  const handleNavLinkClick = () => {
    setIsNavOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">

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
              {['home', 'about', 'experience', 'skills', 'projects', 'blog', 'contact'].map((item) => (
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
              <a
                href="/me-administrator"
                className={`transition-colors duration-300 ${
                  scrolled
                    ? 'text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400'
                    : 'text-white/80 hover:text-white'
                }`}
                aria-label="Admin Dashboard"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                </svg>
              </a>
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
              {['home', 'about', 'experience', 'skills', 'projects', 'blog', 'contact'].map((item) => (
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
              <a
                href="/me-administrator"
                className="py-2 px-4 rounded-md transition-colors duration-300 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center"
                onClick={handleNavLinkClick}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                </svg>
                Admin Dashboard
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header id="home" className="relative overflow-hidden bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="absolute inset-0 bg-[url('/img/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
        <div className="relative container mx-auto px-6 py-28 md:py-36 lg:py-44 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fadeIn">
            Reggie Ambrocio
          </h1>
          <p className="text-xl md:text-2xl mb-10 max-w-2xl animate-fadeIn animation-delay-200">
            Full Stack Developer & Digital Craftsman
          </p>
          <div className="flex flex-wrap gap-6 justify-center animate-fadeIn animation-delay-300">
            <a
              href="#contact"
              className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-medium transition duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              aria-label="Contact Me - Jump to contact form"
            >
              Get in Touch
            </a>
            <a
              href="#projects"
              className="bg-purple-700 text-white hover:bg-purple-800 px-8 py-4 rounded-lg font-medium transition duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              aria-label="View My Work - Jump to projects section"
            >
              View My Work
            </a>
          </div>

          {/* Social Media Links */}
          <div className="flex items-center space-x-6 mt-12 animate-fadeIn animation-delay-400">
            <a
              href={settings.github_url}
              className="text-white hover:text-white/80 transition duration-300"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub Profile"
            >
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
            </a>
            <a
              href={settings.linkedin_url}
              className="text-white hover:text-white/80 transition duration-300"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn Profile"
            >
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
            <a
              href={settings.twitter_url}
              className="text-white hover:text-white/80 transition duration-300"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter Profile"
            >
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>
          </div>
        </div>
      </header>

      {/* About Section */}
      <section id="about" className="py-16 md:py-24 bg-white dark:bg-gray-800 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-purple-200/20 to-blue-200/20 dark:from-purple-900/10 dark:to-blue-900/10 rounded-full blur-3xl -z-10 transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-tr from-blue-200/20 to-purple-200/20 dark:from-blue-900/10 dark:to-purple-900/10 rounded-full blur-3xl -z-10 transform translate-x-1/2 translate-y-1/2"></div>

        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800 dark:text-white inline-block relative">
              <span className="relative z-10">About Me</span>
              <span className="absolute bottom-1 left-0 w-full h-3 bg-purple-100 dark:bg-purple-900/30 -z-10 transform -rotate-1"></span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Get to know me better - my skills and what drives me as a developer.
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <div className="relative w-full max-w-md mx-auto group perspective">
                <div className="relative rounded-xl overflow-hidden transform transition-transform duration-700 group-hover:rotate-y-12 shadow-2xl">
                  <DeveloperBadge skillAnalytics={skillAnalytics} />
                  <img
                    src="/images/_CDR9065.png"
                    alt="Reggie Ambrocio"
                    className="w-full transition-all duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                <div className="mt-8 flex justify-center space-x-4">
                  <a
                    href="/cv/Blue Simple Professional CV Resume.pdf"
                    download
                    className="inline-flex items-center px-5 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition duration-300 shadow-md hover:shadow-xl transform hover:-translate-y-1"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Download CV
                  </a>

                  <a
                    href="#contact"
                    className="inline-flex items-center px-5 py-3 bg-white dark:bg-gray-700 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800 rounded-lg hover:bg-purple-50 dark:hover:bg-gray-600 transition duration-300 shadow-md hover:shadow-xl transform hover:-translate-y-1"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    Contact Me
                  </a>
                </div>
              </div>
            </div>

            <div className="md:w-1/2 space-y-8">
              {/* Bio card with quote styling */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-xl border border-gray-100 dark:border-gray-700 relative transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                <div className="absolute top-4 left-4 text-6xl text-purple-200 dark:text-purple-900 opacity-50">"</div>
                <div className="relative z-10">
                  <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                    {settings.about_me_1}
                  </p>
                </div>
                <div className="absolute bottom-4 right-4 text-6xl text-purple-200 dark:text-purple-900 opacity-50">"</div>
              </div>

              {/* Skills and expertise */}
              <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 rounded-xl p-8 shadow-xl border border-gray-100 dark:border-gray-700">
                <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  Expertise & Approach
                </h3>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                  {settings.about_me_2}
                </p>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {['Problem Solver', 'Clean Code', 'User-Focused', 'Continuous Learner', 'Team Player', 'Detail-Oriented'].map((trait, index) => (
                    <div key={index} className="bg-white dark:bg-gray-700 px-3 py-2 rounded-lg shadow-sm border border-gray-100 dark:border-gray-600 text-center text-gray-700 dark:text-gray-300 text-sm font-medium transform transition-transform duration-300 hover:scale-105 hover:shadow-md">
                      {trait}
                    </div>
                  ))}
                </div>
              </div>

              {/* Personal interests */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-xl border border-gray-100 dark:border-gray-700 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-b from-purple-100 to-transparent dark:from-purple-900/20 dark:to-transparent -z-10 rounded-bl-[100px]"></div>

                <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Beyond Coding
                </h3>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  {settings.about_me_3}
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Professional Experience Section */}
      <section id="experience" className="py-16 md:py-24 bg-gradient-to-br from-gray-100 to-white dark:from-gray-800 dark:to-gray-900 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-purple-200/20 to-indigo-200/20 dark:from-purple-900/10 dark:to-indigo-900/10 rounded-full blur-3xl -z-10 transform translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-tr from-indigo-200/20 to-purple-200/20 dark:from-indigo-900/10 dark:to-purple-900/10 rounded-full blur-3xl -z-10 transform -translate-x-1/3 translate-y-1/3"></div>

        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800 dark:text-white inline-block relative">
              <span className="relative z-10">Professional Experience</span>
              <span className="absolute bottom-1 left-0 w-full h-3 bg-indigo-100 dark:bg-indigo-900/30 -z-10 transform rotate-1"></span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              A showcase of my professional journey and the expertise I've developed along the way.
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            {/* Experience Cards with Modern Design */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Experience Item 1 */}
              <div className="group bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                <div className="flex flex-col">
                  {/* Company info */}
                  <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-6 flex flex-col items-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-2xl -z-10 transform translate-x-1/2 -translate-y-1/2"></div>
                    <div className="text-center">
                      <h3 className="text-xl font-bold mb-1">Full Stack Developer</h3>
                      <div className="text-indigo-100 font-medium mb-4">TechInnovate Solutions</div>
                      <div className="text-sm text-indigo-100">2023 - Present</div>
                    </div>
                    <div className="mt-6">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-6 md:p-8">
                    <h4 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Full Stack Development & Team Leadership</h4>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      Led the development of enterprise-level web applications using React, Laravel, and AWS. Implemented CI/CD pipelines that reduced deployment time by 40% and improved code quality through automated testing.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-300 text-xs font-medium rounded-full">React</span>
                      <span className="px-3 py-1 bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-300 text-xs font-medium rounded-full">Laravel</span>
                      <span className="px-3 py-1 bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300 text-xs font-medium rounded-full">AWS</span>
                      <span className="px-3 py-1 bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-300 text-xs font-medium rounded-full">Team Leadership</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Experience Item 2 */}
              <div className="group bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                <div className="flex flex-col">
                  {/* Company info */}
                  <div className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white p-6 flex flex-col items-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-2xl -z-10 transform translate-x-1/2 -translate-y-1/2"></div>
                    <div className="text-center">
                      <h3 className="text-xl font-bold mb-1">Web Developer</h3>
                      <div className="text-blue-100 font-medium mb-4">Digital Creations Agency</div>
                      <div className="text-sm text-blue-100">2022 - 2023</div>
                    </div>
                    <div className="mt-6">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-6 md:p-8">
                    <h4 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Frontend Development & UI/UX Implementation</h4>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      Developed responsive web applications for various clients, focusing on creating intuitive user interfaces and seamless user experiences. Collaborated with designers to transform concepts into functional, visually appealing websites.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300 text-xs font-medium rounded-full">JavaScript</span>
                      <span className="px-3 py-1 bg-cyan-100 text-cyan-600 dark:bg-cyan-900/40 dark:text-cyan-300 text-xs font-medium rounded-full">Tailwind CSS</span>
                      <span className="px-3 py-1 bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-300 text-xs font-medium rounded-full">Vue.js</span>
                      <span className="px-3 py-1 bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-300 text-xs font-medium rounded-full">UI/UX</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Experience Item 3 */}
              <div className="group bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                <div className="flex flex-col">
                  {/* Company info */}
                  <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white p-6 flex flex-col items-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-2xl -z-10 transform translate-x-1/2 -translate-y-1/2"></div>
                    <div className="text-center">
                      <h3 className="text-xl font-bold mb-1">Junior Developer</h3>
                      <div className="text-emerald-100 font-medium mb-4">StartUp Innovations</div>
                      <div className="text-sm text-emerald-100">2021 - 2022</div>
                    </div>
                    <div className="mt-6">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-6 md:p-8">
                    <h4 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Full Stack Development & Learning</h4>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      Assisted in developing web applications using PHP and JavaScript. Gained hands-on experience with database design, API integration, and responsive web development while working in an agile environment.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-300 text-xs font-medium rounded-full">PHP</span>
                      <span className="px-3 py-1 bg-teal-100 text-teal-600 dark:bg-teal-900/40 dark:text-teal-300 text-xs font-medium rounded-full">MySQL</span>
                      <span className="px-3 py-1 bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-300 text-xs font-medium rounded-full">jQuery</span>
                      <span className="px-3 py-1 bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-300 text-xs font-medium rounded-full">Responsive Design</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-16 md:py-24 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center text-gray-800 dark:text-white">
            My Skills
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 text-center mb-12 max-w-3xl mx-auto">
            A comprehensive overview of my technical abilities and expertise across different domains.
          </p>

          {/* Skill Analytics Summary */}
          {skillAnalytics && skillAnalytics.senior_level_analysis && (
            <div className="mb-16 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 max-w-5xl mx-auto">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-purple-600 dark:text-purple-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6 6a3 3 0 013-3h2a3 3 0 013 3v2a3 3 0 01-3 3H9a3 3 0 01-3-3V6z" clipRule="evenodd" />
                  <path d="M13 10a3 3 0 013 3v1a1 1 0 01-1 1H5a1 1 0 01-1-1v-1a3 3 0 013-3h6z" />
                </svg>
                Developer Level Assessment
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
                <div className="md:col-span-1">
                  <div className="flex flex-col items-center">
                    <div className={`w-24 h-24 rounded-full flex items-center justify-center text-white text-2xl font-bold ${
                      skillAnalytics.senior_level_analysis.level === 'Senior'
                        ? 'bg-green-500'
                        : skillAnalytics.senior_level_analysis.level === 'Mid-level'
                        ? 'bg-yellow-500'
                        : 'bg-blue-500'
                    }`}>
                      {skillAnalytics.senior_level_analysis.scores.overall}%
                    </div>
                    <h4 className="text-lg font-bold text-center text-gray-800 dark:text-white mt-3">
                      {skillAnalytics.senior_level_analysis.level} Developer
                    </h4>
                  </div>
                </div>

                <div className="md:col-span-3">
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {skillAnalytics.senior_level_analysis.analysis}
                  </p>

                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Frontend</h5>
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mr-2">
                          <div
                            className={`h-2.5 rounded-full ${
                              skillAnalytics.senior_level_analysis.scores.frontend >= 80
                                ? 'bg-green-500'
                                : skillAnalytics.senior_level_analysis.scores.frontend >= 50
                                ? 'bg-yellow-500'
                                : 'bg-blue-500'
                            }`}
                            style={{ width: `${skillAnalytics.senior_level_analysis.scores.frontend}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                          {skillAnalytics.senior_level_analysis.scores.frontend}%
                        </span>
                      </div>
                    </div>

                    <div>
                      <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Backend</h5>
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mr-2">
                          <div
                            className={`h-2.5 rounded-full ${
                              skillAnalytics.senior_level_analysis.scores.backend >= 80
                                ? 'bg-green-500'
                                : skillAnalytics.senior_level_analysis.scores.backend >= 50
                                ? 'bg-yellow-500'
                                : 'bg-blue-500'
                            }`}
                            style={{ width: `${skillAnalytics.senior_level_analysis.scores.backend}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                          {skillAnalytics.senior_level_analysis.scores.backend}%
                        </span>
                      </div>
                    </div>

                    <div>
                      <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">DevOps</h5>
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mr-2">
                          <div
                            className={`h-2.5 rounded-full ${
                              skillAnalytics.senior_level_analysis.scores.devops >= 80
                                ? 'bg-green-500'
                                : skillAnalytics.senior_level_analysis.scores.devops >= 50
                                ? 'bg-yellow-500'
                                : 'bg-blue-500'
                            }`}
                            style={{ width: `${skillAnalytics.senior_level_analysis.scores.devops}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                          {skillAnalytics.senior_level_analysis.scores.devops}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Top Skills Section (if analytics data is available) */}
          {skillAnalytics && skillAnalytics.top_skills && skillAnalytics.top_skills.length > 0 && (
            <div className="mb-16">
              <h3 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">
                Top Skills
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {skillAnalytics.top_skills.slice(0, 6).map((skill, index) => (
                  <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-5 border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-lg">
                    <div className="flex items-center mb-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold mr-3"
                        style={{
                          backgroundColor:
                            skill.category === 'frontend' ? 'rgba(124, 58, 237, 0.8)' :
                            skill.category === 'backend' ? 'rgba(79, 70, 229, 0.8)' :
                            'rgba(37, 99, 235, 0.8)'
                        }}
                      >
                        {index + 1}
                      </div>
                      <h4 className="text-lg font-semibold text-gray-800 dark:text-white">{skill.name}</h4>
                    </div>
                    <div className="mt-2">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Proficiency</span>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{skill.proficiency || 100}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                        <div
                          className={`h-2.5 rounded-full ${
                            skill.proficiency >= 80 ? 'bg-green-500' :
                            skill.proficiency >= 50 ? 'bg-yellow-500' :
                            'bg-blue-500'
                          }`}
                          style={{ width: `${skill.proficiency || 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 capitalize mt-3">
                      Category: {skill.category}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

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
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800 dark:text-white inline-block relative">
              <span className="relative z-10">Featured Projects</span>
              <span className="absolute bottom-1 left-0 w-full h-3 bg-purple-100 dark:bg-purple-900/30 -z-10 transform -rotate-1"></span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Explore some of my recent work. Each project represents unique challenges and solutions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {projects.length > 0 ? (
              projects.map((project, index) => (
                <div
                  key={project.id}
                  className={`group relative bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 animate-fadeIn ${
                    index === 1 ? 'animation-delay-200' : index === 2 ? 'animation-delay-300' : ''
                  }`}
                >
                  {index === 0 && (
                    <div className="absolute top-0 right-0 bg-gradient-to-l from-purple-600 to-purple-500 text-white text-xs font-bold px-4 py-2 rounded-bl-lg z-10 shadow-md transform transition-transform duration-300 group-hover:scale-105 border-b border-l border-white/20">
                      <span className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        Featured
                      </span>
                    </div>
                  )}
                  <div className="relative overflow-hidden">
                    <img
                      src={project.image_url || `https://images.unsplash.com/photo-1557821552-17105176677c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400&q=80`}
                      alt={project.title}
                      className="w-full h-52 object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                      <div className="p-4 w-full">
                        <div className="flex space-x-3 justify-center">
                          {project.project_url && (
                            <a href={project.project_url} target="_blank" rel="noopener noreferrer" className="bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full transition-colors duration-300" title="View Demo">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                              </svg>
                            </a>
                          )}
                          {project.github_url && (
                            <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full transition-colors duration-300" title="View Code">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-3 text-gray-800 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">{project.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies && project.technologies.map((tech, techIndex) => (
                        <span
                          key={techIndex}
                          className={`px-3 py-1 ${
                            techIndex % 3 === 0 ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-300' :
                            techIndex % 3 === 1 ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300' :
                            'bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-300'
                          } text-xs font-medium rounded-full`}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    {(project.project_url || project.github_url) && (
                      <a
                        href={project.project_url || project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-purple-600 dark:text-purple-400 font-medium hover:text-purple-700 dark:hover:text-purple-300 transition-colors duration-300"
                      >
                        <span>View Project</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              ))
            ) : (
              // Fallback content if no projects are available
              <>
                {/* Project 1 */}
                <div className="group relative bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 animate-fadeIn">
                  <div className="absolute top-0 right-0 bg-gradient-to-l from-purple-600 to-purple-500 text-white text-xs font-bold px-4 py-2 rounded-bl-lg z-10 shadow-md transform transition-transform duration-300 group-hover:scale-105 border-b border-l border-white/20">
                    <span className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      Featured
                    </span>
                  </div>
                  <div className="relative overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1557821552-17105176677c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400&q=80"
                      alt="E-Commerce Platform"
                      className="w-full h-52 object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                      <div className="p-4 w-full">
                        <div className="flex space-x-3 justify-center">
                          <a href="#" className="bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full transition-colors duration-300" title="View Demo">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                            </svg>
                          </a>
                          <a href="#" className="bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full transition-colors duration-300" title="View Code">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-3 text-gray-800 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">E-Commerce Platform</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                      A full-featured online store with product management, cart functionality, and secure checkout. Includes user authentication, payment processing, and order tracking.
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="px-3 py-1 bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-300 text-xs font-medium rounded-full">Laravel</span>
                      <span className="px-3 py-1 bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300 text-xs font-medium rounded-full">React</span>
                      <span className="px-3 py-1 bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-300 text-xs font-medium rounded-full">MySQL</span>
                    </div>
                    <a
                      href="#"
                      className="inline-flex items-center text-purple-600 dark:text-purple-400 font-medium hover:text-purple-700 dark:hover:text-purple-300 transition-colors duration-300"
                    >
                      <span>View Project</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </a>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="text-center mt-12">
            <a
              href="#"
              className="inline-flex items-center px-6 py-3 border-2 border-purple-600 text-purple-600 dark:text-purple-400 dark:border-purple-400 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition duration-300 font-medium"
            >
              View All Projects
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section id="blog" className="py-16 md:py-24 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800 dark:text-white inline-block relative">
              <span className="relative z-10">Blog & Articles</span>
              <span className="absolute bottom-1 left-0 w-full h-3 bg-blue-100 dark:bg-blue-900/30 -z-10 transform rotate-1"></span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              I share my insights and experiences in web development, best practices, and emerging technologies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {blogPosts.length > 0 ? (
              blogPosts.map((post, index) => (
                <div
                  key={post.id}
                  className={`group bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 animate-fadeIn ${
                    index === 1 ? 'animation-delay-200' : index === 2 ? 'animation-delay-300' : ''
                  } flex flex-col h-full`}
                >
                  <div className="relative">
                    <img
                      src={post.image_url || `https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=300&q=80`}
                      alt={post.title}
                      className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {post.is_featured && (
                      <div className="absolute top-0 right-0 bg-gradient-to-l from-purple-600 to-purple-500 text-white text-xs font-bold px-4 py-2 rounded-bl-lg z-10 shadow-md transform transition-transform duration-300 group-hover:scale-105 border-b border-l border-white/20">
                        <span className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                          </svg>
                          Popular
                        </span>
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 bg-gradient-to-r from-black/70 to-transparent w-full p-4">
                      <div className="flex items-center text-xs text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>{new Date(post.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold mb-3 text-gray-800 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4 flex-1 line-clamp-3">
                      {post.content}
                    </p>
                    <div className="mt-auto">
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags && post.tags.map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className={`px-3 py-1 ${
                              tagIndex % 3 === 0 ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-300' :
                              tagIndex % 3 === 1 ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300' :
                              'bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-300'
                            } text-xs font-medium rounded-full`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      {post.url && (
                        <a
                          href={post.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-purple-600 dark:text-purple-400 font-medium hover:text-purple-700 dark:hover:text-purple-300 transition-colors duration-300"
                        >
                          <span>Read Full Article</span>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              // Fallback content if no blog posts are available
              <>
                {/* Blog Post 1 */}
                <div className="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 animate-fadeIn flex flex-col h-full">
                  <div className="relative">
                    <img
                      src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=300&q=80"
                      alt="React Custom Hooks"
                      className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-0 right-0 bg-gradient-to-l from-purple-600 to-purple-500 text-white text-xs font-bold px-4 py-2 rounded-bl-lg z-10 shadow-md transform transition-transform duration-300 group-hover:scale-105 border-b border-l border-white/20">
                      <span className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                        </svg>
                        Popular
                      </span>
                    </div>
                    <div className="absolute bottom-0 left-0 bg-gradient-to-r from-black/70 to-transparent w-full p-4">
                      <div className="flex items-center text-xs text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>June 15, 2023</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold mb-3 text-gray-800 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">
                      Building Scalable React Applications with Custom Hooks
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4 flex-1 line-clamp-3">
                      Custom hooks are one of React's most powerful features, allowing developers to extract and reuse stateful logic across components. In this article, I explore how to create and implement custom hooks to improve code reusability, readability, and maintainability in large-scale React applications.
                    </p>
                    <div className="mt-auto">
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="px-3 py-1 bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-300 text-xs font-medium rounded-full">React</span>
                        <span className="px-3 py-1 bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300 text-xs font-medium rounded-full">JavaScript</span>
                        <span className="px-3 py-1 bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-300 text-xs font-medium rounded-full">Web Development</span>
                      </div>
                      <a
                        href="#"
                        className="inline-flex items-center text-purple-600 dark:text-purple-400 font-medium hover:text-purple-700 dark:hover:text-purple-300 transition-colors duration-300"
                      >
                        <span>Read Full Article</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="text-center mt-12">
            <a
              href="#"
              className="inline-flex items-center px-6 py-3 border-2 border-purple-600 text-purple-600 dark:text-purple-400 dark:border-purple-400 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition duration-300 font-medium"
            >
              View All Articles
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 md:py-24 bg-white dark:bg-gray-800 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-200/30 to-blue-200/30 dark:from-purple-900/10 dark:to-blue-900/10 rounded-full blur-3xl -z-10 transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-green-200/30 to-teal-200/30 dark:from-green-900/10 dark:to-teal-900/10 rounded-full blur-3xl -z-10 transform -translate-x-1/2 translate-y-1/2"></div>

        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800 dark:text-white inline-block relative">
              <span className="relative z-10">Get In Touch</span>
              <span className="absolute bottom-1 left-0 w-full h-3 bg-green-100 dark:bg-green-900/30 -z-10 transform rotate-1"></span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Have a question or want to work together? Feel free to reach out!
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 max-w-6xl mx-auto">
            {/* Contact Form */}
            <div className="lg:col-span-3 animate-fadeIn">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 p-8 relative overflow-hidden">
                {/* Decorative corner accent */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-b from-purple-100 to-transparent dark:from-purple-900/20 dark:to-transparent -z-10 rounded-bl-[100px]"></div>

                <h3 className="text-xl font-bold mb-6 text-gray-800 dark:text-white">Send a Message</h3>
                <ContactForm />
              </div>
            </div>

            {/* Contact Information */}
            <div className="lg:col-span-2 flex flex-col justify-center">
              <div className="space-y-6">
                {/* Email Card */}
                <div className="group bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 animate-fadeIn animation-delay-200">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-md group-hover:shadow-purple-500/30 transition-all duration-300 group-hover:scale-110">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold mb-1 text-gray-800 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">Email</h3>
                      <p className="text-gray-600 dark:text-gray-300">{settings.email}</p>
                      <a href={`mailto:${settings.email}`} className="inline-flex items-center mt-2 text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors duration-300">
                        <span>Send an email</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>

                {/* Phone Card */}
                <div className="group bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 animate-fadeIn animation-delay-300">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md group-hover:shadow-blue-500/30 transition-all duration-300 group-hover:scale-110">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold mb-1 text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">Phone</h3>
                      <p className="text-gray-600 dark:text-gray-300">{settings.phone}</p>
                      <a href={`tel:${settings.phone.replace(/\s+/g, '')}`} className="inline-flex items-center mt-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-300">
                        <span>Call me</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>

                {/* Location Card */}
                <div className="group bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 animate-fadeIn animation-delay-400">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md group-hover:shadow-green-500/30 transition-all duration-300 group-hover:scale-110">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold mb-1 text-gray-800 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300">Location</h3>
                      <p className="text-gray-600 dark:text-gray-300">{settings.location}</p>
                      <a href={`https://maps.google.com/?q=${encodeURIComponent(settings.location)}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center mt-2 text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-colors duration-300">
                        <span>View on map</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
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
