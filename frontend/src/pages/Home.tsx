import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Shield, Users, Clock, Check, Star, Loader } from 'lucide-react';
import { fetchServices, fetchTestimonials, fetchFeatures } from '../utils/apiService';
interface Service {
  id: string;
  name: string;
  icon: string;
}
interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  image: string;
  rating: number;
}
interface Feature {
  id: string;
  icon: string;
  title: string;
  description: string;
}
export function Home() {
  const {
    user
  } = useAuth();
  const [features, setFeatures] = useState<Feature[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState({
    features: true,
    services: true,
    testimonials: true
  });
  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const featuresData = await fetchFeatures();
        setFeatures(featuresData);
        setLoading(prev => ({
          ...prev,
          features: false
        }));
      } catch (error) {
        console.error('Error loading features:', error);
        setLoading(prev => ({
          ...prev,
          features: false
        }));
      }
      try {
        const servicesData = await fetchServices();
        setServices(servicesData);
        setLoading(prev => ({
          ...prev,
          services: false
        }));
      } catch (error) {
        console.error('Error loading services:', error);
        setLoading(prev => ({
          ...prev,
          services: false
        }));
      }
      try {
        const testimonialsData = await fetchTestimonials();
        setTestimonials(testimonialsData);
        setLoading(prev => ({
          ...prev,
          testimonials: false
        }));
      } catch (error) {
        console.error('Error loading testimonials:', error);
        setLoading(prev => ({
          ...prev,
          testimonials: false
        }));
      }
    };
    loadHomeData();
  }, []);
  // Helper function to render icon based on name
  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'shield':
        return <Shield className="h-8 w-8 text-blue-600" />;
      case 'users':
        return <Users className="h-8 w-8 text-blue-600" />;
      case 'clock':
        return <Clock className="h-8 w-8 text-blue-600" />;
      default:
        return <Check className="h-8 w-8 text-blue-600" />;
    }
  };
  return <div className="bg-white w-full">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-50 via-white to-green-50">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="text-orange-600">Hindu</span>
                <span className="text-orange-600"> Seva </span>
                <span className="text-orange-600">Kendra</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 text-orange- 400">
                "सेवा ही हमारा संकल्प है"
              </p>
              <div className="flex flex-wrap gap-4">
                {user ? <Link to={user.role === 'user' ? '/dashboard/user' : user.role === 'vendor' ? '/dashboard/vendor' : '/dashboard/admin'} className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors">
                    Go to Dashboard
                  </Link> : <>
                    <Link to="/register" className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors">
                      Join Now
                    </Link>
                    <Link to="/login" className="bg-gray-200 text-gray-800 px-6 py-3 rounded-md hover:bg-gray-300 transition-colors">
                      Login
                    </Link>
                  </>}
              </div>
            </div>
            <div className="md:w-1/2">
              <img src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80" alt="Hindu Seva Kendra Community" className="rounded-lg shadow-lg" />
            </div>
          </div>
        </div>
      </section>
      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose Hindu Seva Kendra?
          </h2>
          {loading.features ? <div className="flex justify-center items-center py-12">
              <Loader className="h-8 w-8 text-blue-600 animate-spin" />
            </div> : <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map(feature => <div key={feature.id} className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-100">
                  <div className="mb-4">{renderIcon(feature.icon)}</div>
                  <h3 className="text-xl font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>)}
            </div>}
        </div>
      </section>
      {/* Services Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">
            Services We Offer
          </h2>
          <p className="text-gray-600 text-center mb-12">
            Find trusted professionals for all your service needs
          </p>
          {loading.services ? <div className="flex justify-center items-center py-12">
              <Loader className="h-8 w-8 text-blue-600 animate-spin" />
            </div> : <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {services.map(service => <div key={service.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>{service.name}</span>
                </div>)}
            </div>}
          <div className="mt-10 text-center">
            <Link to="/register" className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors">
              Find a Service Provider
            </Link>
          </div>
        </div>
      </section>
      {/* Testimonials Section */}
{/*       <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            What Our Community Says
          </h2>
          {loading.testimonials ? <div className="flex justify-center items-center py-12">
              <Loader className="h-8 w-8 text-blue-600 animate-spin" />
            </div> : <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map(testimonial => <div key={testimonial.id} className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-100">
                  <div className="flex items-center mb-4">
                    <img src={testimonial.image} alt={testimonial.name} className="h-12 w-12 rounded-full object-cover mr-4" />
                    <div>
                      <h3 className="font-semibold">{testimonial.name}</h3>
                      <p className="text-gray-600 text-sm">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => <Star key={i} className={`h-4 w-4 ${i < testimonial.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />)}
                  </div>
                  <p className="text-gray-600">{testimonial.content}</p>
                </div>)}
            </div>}
        </div>
      </section> */}
      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8">
            Join our community today and connect with trusted service providers
          </p>
          <div className="flex justify-center space-x-4">
            <Link to="/register" className="bg-white text-blue-600 px-6 py-3 rounded-md hover:bg-gray-100 transition-colors">
              Register Now
            </Link>
            <Link to="/about" className="bg-transparent border border-white text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors">
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </div>;
}
