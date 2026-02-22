import React, { useState,useContext} from 'react';
import { Package, Menu, X, TrendingUp, BarChart, Shield, Smartphone, PieChart, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram, Check, Users, Building2, Crown, Zap, Clock, ChevronRight } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { AuthContext } from '../context/Authprovider';
import { Link } from 'react-router-dom';
import { login } from '../services/ApiService';

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [Loading, setLoading] = useState(false);
  const [Errors, setErrors] = useState("");
  const navigate = useNavigate();
  const { setIsLoggedIn } = useContext(AuthContext);

  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  const handleInputChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value
    });
  };

  const openLoginModal = () => {
    setShowLoginModal(true);
    setIsMenuOpen(false);
    setLoginData({
      username: '',
      password: ''
    });
    setErrors("");
  };

  const toggleMobileMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors("");

    const userData = { email: loginData.email, password: loginData.password };
    console.log(userData)

    try {
      const response = await login(userData);
      localStorage.setItem('accessToken', response.data.tokens.access);
      localStorage.setItem('refreshToken',response.data.tokens.refresh);
      
      setIsLoggedIn(true);
      navigate('/dashboard');
      
    } catch (error) {
      console.log("error: ",error)
      setErrors("Invalid Credentials");
      
    } finally {
      setLoading(false);
    }
  };

  const pricingPlans = [
    {
      name: "Starter",
      price: "49",
      icon: Users,
      color: "blue",
      popular: false,
      description: "Perfect for small teams getting started",
      features: [
        "1 Admin Account",
        "Up to 2 Team Members",
        "5,000 Product Limit",
        "Basic Analytics",
        "Email Support",
        "Mobile App Access",
        "Cloud Storage (10GB)"
      ],
      organization: {
        admins: 1,
        employees: 2
      }
    },
    {
      name: "Professional",
      price: "99",
      icon: Building2,
      color: "purple",
      popular: true,
      description: "Ideal for growing businesses",
      features: [
        "2 Admin Accounts",
        "Up to 10 Team Members",
        "Unlimited Products",
        "Advanced Analytics & Reports",
        "Priority Email & Chat Support",
        "Mobile App Access",
        "Cloud Storage (50GB)",
        "API Access",
        "Custom Workflows"
      ],
      organization: {
        admins: 2,
        employees: 10
      }
    },
    {
      name: "Enterprise",
      price: "249",
      icon: Crown,
      color: "amber",
      popular: false,
      description: "For large organizations with advanced needs",
      features: [
        "Unlimited Admin Accounts",
        "Unlimited Team Members",
        "Unlimited Products",
        "Custom Analytics & BI Tools",
        "24/7 Dedicated Support",
        "Mobile App Access",
        "Cloud Storage (Unlimited)",
        "Full API Access",
        "Custom Integrations",
        "Advanced Security Features",
        "Training & Onboarding",
        "SLA Guarantee"
      ],
      organization: {
        admins: "Unlimited",
        employees: "Unlimited"
      }
    }
  ];

  return (
    <div className="bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-md sticky top-0 z-50 backdrop-blur-sm bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center space-x-2">
                <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-2 rounded-lg">
                  <Package className="text-white" size={24} />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">IMS</span>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-center space-x-1">
                <a href="#home" className="nav-link text-gray-900 hover:bg-blue-50 hover:text-blue-600 px-4 py-2 rounded-lg text-sm font-medium transition-all">Home</a>
                <a href="#features" className="nav-link text-gray-600 hover:bg-blue-50 hover:text-blue-600 px-4 py-2 rounded-lg text-sm font-medium transition-all">Features</a>
                <a href="#pricing" className="nav-link text-gray-600 hover:bg-blue-50 hover:text-blue-600 px-4 py-2 rounded-lg text-sm font-medium transition-all">Pricing</a>
                <a href="#about" className="nav-link text-gray-600 hover:bg-blue-50 hover:text-blue-600 px-4 py-2 rounded-lg text-sm font-medium transition-all">About</a>
                <a href="#contact" className="nav-link text-gray-600 hover:bg-blue-50 hover:text-blue-600 px-4 py-2 rounded-lg text-sm font-medium transition-all">Contact</a>
                <button onClick={openLoginModal} className="text-gray-600 hover:bg-gray-50 hover:text-gray-900 px-4 py-2 rounded-lg text-sm font-medium transition-all ml-2">Login</button>
                <Link to="/company-form" className="bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 px-5 py-2 rounded-lg text-sm font-medium transition-all shadow-md hover:shadow-lg">Get Started</Link>
              </div>
            </div>
            <div className="md:hidden">
              <button onClick={toggleMobileMenu} className="text-gray-600 hover:text-gray-900 focus:outline-none p-2">
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t shadow-lg">
            <div className="px-4 pt-2 pb-4 space-y-1">
              <a href="#home" className="block text-gray-900 hover:bg-blue-50 hover:text-blue-600 px-3 py-2 rounded-lg text-base font-medium transition-all">Home</a>
              <a href="#features" className="block text-gray-600 hover:bg-blue-50 hover:text-blue-600 px-3 py-2 rounded-lg text-base font-medium transition-all">Features</a>
              <a href="#pricing" className="block text-gray-600 hover:bg-blue-50 hover:text-blue-600 px-3 py-2 rounded-lg text-base font-medium transition-all">Pricing</a>
              <a href="#about" className="block text-gray-600 hover:bg-blue-50 hover:text-blue-600 px-3 py-2 rounded-lg text-base font-medium transition-all">About</a>
              <a href="#contact" className="block text-gray-600 hover:bg-blue-50 hover:text-blue-600 px-3 py-2 rounded-lg text-base font-medium transition-all">Contact</a>
              <button onClick={openLoginModal} className="block w-full text-left text-gray-600 hover:bg-gray-50 px-3 py-2 rounded-lg text-base font-medium transition-all">Login</button>
              <Link to="/company-form" className="block w-full text-left bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 py-2 rounded-lg text-base font-medium transition-all shadow-md">Get Started</Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/50 to-transparent"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center">
            <div className="inline-flex items-center bg-blue-500/20 backdrop-blur-sm border border-blue-400/30 rounded-full px-4 py-2 mb-8">
              <Zap className="text-yellow-300 mr-2" size={16} />
              <span className="text-sm font-medium">Trusted by 10,000+ businesses worldwide</span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Inventory Management
              <span className="block bg-gradient-to-r from-blue-200 to-white bg-clip-text text-transparent">Made Simple</span>
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Streamline your inventory operations with our cutting-edge management solution. Real-time tracking, powerful analytics, and seamless collaboration.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/company-form" className="group bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-xl font-semibold transition-all shadow-xl hover:shadow-2xl hover:scale-105 flex items-center justify-center">
                Get Started Free
                <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
              </Link>
              <button onClick={() => document.getElementById('pricing').scrollIntoView({ behavior: 'smooth' })} className="border-2 border-white/50 backdrop-blur-sm bg-white/10 text-white hover:bg-white hover:text-blue-600 px-8 py-4 rounded-xl font-semibold transition-all hover:scale-105">
                View Pricing
              </button>
            </div>
            <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm text-blue-200">
              <div className="flex items-center">
                <Check className="mr-2 text-green-300" size={18} />
                No credit card required
              </div>
              <div className="flex items-center">
                <Check className="mr-2 text-green-300" size={18} />
                14-day free trial
              </div>
              <div className="flex items-center">
                <Check className="mr-2 text-green-300" size={18} />
                Cancel anytime
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Powerful Features for Your Business</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Everything you need to manage your inventory efficiently and scale your operations</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="group p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-white border border-blue-100 hover:shadow-xl hover:scale-105 transition-all duration-300">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg group-hover:shadow-xl transition-shadow">
                  <TrendingUp className="text-white" size={32} />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Real-time Tracking</h3>
              <p className="text-gray-600 leading-relaxed">Monitor your inventory levels in real-time with advanced analytics, automated alerts, and comprehensive reporting tools</p>
            </div>
            
            <div className="group p-8 rounded-2xl bg-gradient-to-br from-purple-50 to-white border border-purple-100 hover:shadow-xl hover:scale-105 transition-all duration-300">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg group-hover:shadow-xl transition-shadow">
                  <Users className="text-white" size={32} />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Team Collaboration</h3>
              <p className="text-gray-600 leading-relaxed">Organize your team with role-based access, seamless communication, and collaborative workflows for maximum efficiency</p>
            </div>
            
            <div className="group p-8 rounded-2xl bg-gradient-to-br from-green-50 to-white border border-green-100 hover:shadow-xl hover:scale-105 transition-all duration-300">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-lg group-hover:shadow-xl transition-shadow">
                  <Shield className="text-white" size={32} />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Secure & Reliable</h3>
              <p className="text-gray-600 leading-relaxed">Enterprise-grade security with data encryption, regular backups, and 99.9% uptime guarantee to keep your data safe</p>
            </div>
            
            <div className="group p-8 rounded-2xl bg-gradient-to-br from-amber-50 to-white border border-amber-100 hover:shadow-xl hover:scale-105 transition-all duration-300">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl shadow-lg group-hover:shadow-xl transition-shadow">
                  <Smartphone className="text-white" size={32} />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Mobile Access</h3>
              <p className="text-gray-600 leading-relaxed">Manage your inventory on the go with our responsive mobile interface and dedicated iOS & Android apps</p>
            </div>
            
            <div className="group p-8 rounded-2xl bg-gradient-to-br from-rose-50 to-white border border-rose-100 hover:shadow-xl hover:scale-105 transition-all duration-300">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-gradient-to-br from-rose-500 to-rose-600 rounded-2xl shadow-lg group-hover:shadow-xl transition-shadow">
                  <BarChart className="text-white" size={32} />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Advanced Analytics</h3>
              <p className="text-gray-600 leading-relaxed">Make data-driven decisions with powerful analytics, custom reports, and predictive insights for inventory optimization</p>
            </div>
            
            <div className="group p-8 rounded-2xl bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 hover:shadow-xl hover:scale-105 transition-all duration-300">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl shadow-lg group-hover:shadow-xl transition-shadow">
                  <Zap className="text-white" size={32} />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Automation</h3>
              <p className="text-gray-600 leading-relaxed">Automate repetitive tasks, set up smart alerts, and create custom workflows to save time and reduce errors</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Choose Your Plan</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Flexible pricing options to match your organization's size and needs</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => {
              const IconComponent = plan.icon;
              const colorClasses = {
                blue: { 
                  border: 'border-blue-200', 
                  bg: 'from-blue-50 to-white',
                  icon: 'from-blue-500 to-blue-600',
                  button: 'bg-blue-600 hover:bg-blue-700',
                  badge: 'bg-blue-100 text-blue-700'
                },
                purple: { 
                  border: 'border-purple-300', 
                  bg: 'from-purple-50 to-white',
                  icon: 'from-purple-500 to-purple-600',
                  button: 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700',
                  badge: 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                },
                amber: { 
                  border: 'border-amber-200', 
                  bg: 'from-amber-50 to-white',
                  icon: 'from-amber-500 to-amber-600',
                  button: 'bg-amber-600 hover:bg-amber-700',
                  badge: 'bg-amber-100 text-amber-700'
                }
              };
              const colors = colorClasses[plan.color];
              
              return (
                <div key={index} className={`relative p-8 rounded-2xl bg-gradient-to-br ${colors.bg} border-2 ${colors.border} ${plan.popular ? 'shadow-2xl scale-105 md:scale-110 z-10' : 'shadow-lg hover:shadow-xl'} transition-all duration-300`}>
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className={`inline-block ${colors.badge} px-4 py-1 rounded-full text-sm font-semibold shadow-lg`}>
                        Most Popular
                      </span>
                    </div>
                  )}
                  
                  <div className="text-center mb-6">
                    <div className="flex justify-center mb-4">
                      <div className={`p-4 bg-gradient-to-br ${colors.icon} rounded-2xl shadow-lg`}>
                        <IconComponent className="text-white" size={32} />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <p className="text-gray-600 text-sm mb-4">{plan.description}</p>
                    <div className="flex items-baseline justify-center">
                      <span className="text-5xl font-bold text-gray-900">${plan.price}</span>
                      <span className="text-gray-600 ml-2">/month</span>
                    </div>
                  </div>

                  <div className="mb-6 p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-gray-200">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-700 font-medium">Organization Size:</span>
                    </div>
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 text-sm flex items-center">
                          <Crown size={16} className="mr-2 text-amber-500" />
                          Admins
                        </span>
                        <span className="font-semibold text-gray-900">{plan.organization.admins}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 text-sm flex items-center">
                          <Users size={16} className="mr-2 text-blue-500" />
                          Team Members
                        </span>
                        <span className="font-semibold text-gray-900">{plan.organization.employees}</span>
                      </div>
                    </div>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <Check className="text-green-500 mr-3 flex-shrink-0 mt-0.5" size={18} />
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link 
                    to="/company-form"
                    className={`block text-center w-full ${colors.button} text-white py-3 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg hover:scale-105`}
                  >
                    Get Started
                  </Link>
                </div>
              );
            })}
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-600">All plans include 14-day free trial • No credit card required</p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">About IMS</h2>
              <p className="text-gray-600 mb-4 leading-relaxed text-lg">
                IMS is a comprehensive inventory management solution designed to help businesses of all sizes optimize their stock control processes. Our platform combines powerful features with an intuitive interface to deliver exceptional user experience.
              </p>
              <p className="text-gray-600 mb-6 leading-relaxed text-lg">
                With over 10 years of industry experience, we've helped thousands of businesses reduce costs, improve efficiency, and scale their operations seamlessly.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-gray-700">
                  <div className="p-1 bg-green-100 rounded-full mr-3">
                    <Check className="text-green-600" size={18} />
                  </div>
                  <span className="text-lg">Cloud-based solution for remote access</span>
                </li>
                <li className="flex items-center text-gray-700">
                  <div className="p-1 bg-green-100 rounded-full mr-3">
                    <Check className="text-green-600" size={18} />
                  </div>
                  <span className="text-lg">Automated inventory tracking</span>
                </li>
                <li className="flex items-center text-gray-700">
                  <div className="p-1 bg-green-100 rounded-full mr-3">
                    <Check className="text-green-600" size={18} />
                  </div>
                  <span className="text-lg">Advanced reporting and analytics</span>
                </li>
                <li className="flex items-center text-gray-700">
                  <div className="p-1 bg-green-100 rounded-full mr-3">
                    <Check className="text-green-600" size={18} />
                  </div>
                  <span className="text-lg">24/7 customer support</span>
                </li>
              </ul>
              <Link to="/company-form" className="inline-block bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl hover:scale-105">
                Start Your Free Trial
              </Link>
            </div>
            <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl p-12 text-center shadow-xl">
              <div className="flex justify-center mb-6">
                <div className="p-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl shadow-2xl">
                  <PieChart className="text-white" size={64} />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-3">10,000+</h3>
              <p className="text-xl text-gray-700 mb-6">Businesses Trust IMS</p>
              <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="bg-white/60 backdrop-blur-sm p-4 rounded-xl">
                  <p className="text-2xl font-bold text-blue-600">99.9%</p>
                  <p className="text-sm text-gray-600">Uptime</p>
                </div>
                <div className="bg-white/60 backdrop-blur-sm p-4 rounded-xl">
                  <p className="text-2xl font-bold text-purple-600">24/7</p>
                  <p className="text-sm text-gray-600">Support</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Get in Touch</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Name</label>
                  <input type="text" className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" placeholder="Your Name" />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Email</label>
                  <input type="email" className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" placeholder="your@email.com" />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Message</label>
                  <textarea rows="5" className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none" placeholder="Your message..."></textarea>
                </div>
                <button onClick={() => alert('Message sent successfully!')} className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all font-semibold shadow-lg hover:shadow-xl hover:scale-105">
                  Send Message
                </button>
              </div>
            </div>
            <div className="space-y-8">
              <div className="bg-white p-8 rounded-2xl shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-center group">
                    <div className="p-3 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition-colors">
                      <Mail className="text-blue-600" size={20} />
                    </div>
                    <span className="ml-4 text-gray-700">info@ims.com</span>
                  </div>
                  <div className="flex items-center group">
                    <div className="p-3 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition-colors">
                      <Phone className="text-blue-600" size={20} />
                    </div>
                    <span className="ml-4 text-gray-700">+1 (555) 123-4567</span>
                  </div>
                  <div className="flex items-start group">
                    <div className="p-3 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition-colors">
                      <MapPin className="text-blue-600" size={20} />
                    </div>
                    <span className="ml-4 text-gray-700">123 Business Ave, Suite 100, City, State 12345</span>
                  </div>
                </div>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Business Hours</h3>
                <div className="space-y-3 text-gray-700">
                  <div className="flex items-center">
                    <Clock className="text-blue-600 mr-3" size={20} />
                    <div>
                      <p className="font-medium">Monday - Friday</p>
                      <p className="text-sm text-gray-600">9:00 AM - 6:00 PM</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Clock className="text-blue-600 mr-3" size={20} />
                    <div>
                      <p className="font-medium">Saturday</p>
                      <p className="text-sm text-gray-600">10:00 AM - 4:00 PM</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Clock className="text-blue-600 mr-3" size={20} />
                    <div>
                      <p className="font-medium">Sunday</p>
                      <p className="text-sm text-gray-600">Closed</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-8 rounded-2xl shadow-lg text-white">
                <h3 className="text-xl font-bold mb-4">Follow Us</h3>
                <p className="mb-6 text-blue-100">Stay connected for updates and news</p>
                <div className="flex space-x-4">
                  <a href="#" className="p-3 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-all hover:scale-110">
                    <Facebook size={24} />
                  </a>
                  <a href="#" className="p-3 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-all hover:scale-110">
                    <Twitter size={24} />
                  </a>
                  <a href="#" className="p-3 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-all hover:scale-110">
                    <Linkedin size={24} />
                  </a>
                  <a href="#" className="p-3 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-all hover:scale-110">
                    <Instagram size={24} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-2 rounded-lg">
                <Package className="text-white" size={24} />
              </div>
              <span className="text-2xl font-bold ml-3">IMS</span>
            </div>
            <p className="text-gray-400 mb-4">Inventory Management System</p>
            <p className="text-gray-500">&copy; 2024 IMS. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
              <button onClick={() => setShowLoginModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg">
                <X size={24} />
              </button>
            </div>
            {Errors && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
                {Errors}
              </div>
            )}
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={loginData.email || ""}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter your username"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Password</label>
                <input
                  type="password"
                  name="password"
                  value={loginData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter your password"
                  required
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="flex items-center cursor-pointer">
                  <input type="checkbox" className="mr-2 w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500" />
                  <span className="text-gray-600 text-sm">Remember me</span>
                </label>
                <a href="#" className="text-blue-600 text-sm hover:underline font-medium">Forgot password?</a>
              </div>
              <button 
                type="submit"
                disabled={Loading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {Loading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>
            <p className="text-center mt-6 text-gray-600">
              Don't have an account?{' '}
              <Link to="/company-form" onClick={() => setShowLoginModal(false)} className="text-blue-600 hover:underline font-semibold">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}