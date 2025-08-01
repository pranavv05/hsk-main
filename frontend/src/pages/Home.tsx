import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { 
  Star, 
  CheckCircle, 
  ThumbsUp, 
  Sparkles, 
  ArrowRight, 
  Wrench, 
  ShieldCheck, 
  Plug, 
  Droplets, 
  PaintBucket, 
  Truck,
  UserPlus,
  Search
} from 'lucide-react';
import Button from '../components/ui/Button';

const Home = () => {
  useEffect(() => {
    // Smooth scroll for anchor links
    const anchorLinks = document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]');
    anchorLinks.forEach((anchor) => {
      anchor.addEventListener('click', (e: Event) => {
        e.preventDefault();
        const targetId = anchor.getAttribute('href');
        if (targetId) {
          const targetElement = document.querySelector(targetId);
          if (targetElement) {
            targetElement.scrollIntoView({
              behavior: 'smooth'
            });
          }
        }
      });
    });
  }, []);

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="w-full bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0dGVybiBpZD0icGF0dGVybiIgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIiBwYXR0ZXJuVHJhbnNmb3JtPSJyb3RhdGUoNDUpIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ0cmFuc3BhcmVudCIvPjxwYXRoIGQ9Ik0zMCAxMHYxMEg1MHYxMEgzMHYxMEgxMHYtMTBoMjBWMjBoLTIweiIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIvPjwvcGF0dGVybj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI3BhdHRlcm4pIi8+PC9zdmc+')] opacity-20"></div>
        <div className="container mx-auto px-4 py-24 md:py-32 flex flex-col md:flex-row items-center relative z-10">
          <motion.div 
            className="md:w-1/2 mb-12 md:mb-0"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center px-4 py-2 rounded-full bg-blue-500/20 backdrop-blur-sm mb-6">
              <Sparkles className="w-5 h-5 mr-2 text-yellow-300" />
              <span className="text-sm font-medium">Trusted by 10,000+ happy customers</span>
            </motion.div>
            
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
              variants={fadeInUp}
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-yellow-400">
                Hindu Seva Kendra
              </span>
              <br />
              <span className="text-white">Connecting Quality Services to Your Doorstep</span>
            </motion.h1>
            
            <motion.p 
              className="text-lg md:text-xl mb-8 text-blue-100 max-w-2xl"
              variants={fadeInUp}
            >
              Discover trusted local professionals for all your service needs or join our network to grow your business. 
              We're building stronger communities through reliable service delivery.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4"
              variants={fadeInUp}
            >
              <Link to="/register" className="block w-full sm:w-auto">
                <Button 
                  variant="secondary" 
                  size="lg"
                  className="w-full sm:w-auto bg-yellow-400 hover:bg-yellow-300 text-blue-900 font-semibold transform hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Find Services
                </Button>
              </Link>
              <Link to="/register" className="block w-full sm:w-auto">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="w-full sm:w-auto border-2 border-white/30 hover:border-white/70 text-white hover:bg-white/10 font-medium transition-all duration-300"
                >
                  Become a Vendor
                </Button>
              </Link>
            </motion.div>
            
            <motion.div 
              className="mt-10 flex flex-wrap items-center gap-6 text-sm text-blue-100"
              variants={fadeInUp}
            >
              <div className="flex items-center">
                <div className="flex -space-x-2 mr-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-blue-500"></div>
                  ))}
                </div>
                <span>5000+ Happy Customers</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-green-400 mr-2"></div>
                <span>1000+ Verified Vendors</span>
              </div>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="md:w-1/2 flex justify-center relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.3, duration: 0.8 } }}
          >
            <div className="relative">
              <div className="absolute -top-6 -left-6 w-64 h-64 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
              <div className="absolute -bottom-8 -right-8 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
              <img 
                src="https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1932&q=80" 
                alt="Service providers and customers" 
                className="relative z-10 rounded-2xl shadow-2xl border-4 border-white/20 w-full max-w-2xl h-auto transform hover:scale-[1.02] transition-transform duration-500"
              />
            </div>
          </motion.div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-blue-50 to-transparent"></div>
      </section>
      {/* Features Section */}
      <section className="py-20 bg-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-blue-50 to-transparent -z-0"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-100 rounded-full -mr-32 -mb-32 opacity-20"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-800 font-medium mb-4">
              <Star className="w-5 h-5 mr-2 text-yellow-400" />
              Why Choose Us
            </div>
            <h2 className="text-4xl font-bold mb-4 text-gray-900">
              Experience the <span className="text-blue-600">Best Service</span> in Town
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We are committed to providing the best service experience by connecting qualified vendors with users in need.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              className="bg-white rounded-xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-100"
              whileHover={{ y: -5 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <div className="w-20 h-20 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-6 text-blue-600">
                <CheckCircle className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Verified Vendors</h3>
              <p className="text-gray-600">
                Every vendor is thoroughly vetted to ensure the highest standards of quality and reliability for your peace of mind.
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-white rounded-xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-100"
              whileHover={{ y: -5 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <div className="w-20 h-20 rounded-2xl bg-yellow-50 text-yellow-600 flex items-center justify-center mb-6">
                <Star className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Lightning Fast</h3>
              <p className="text-gray-600">
                Get connected with top-rated service providers in minutes, not days. We value your time as much as you do.
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-white rounded-xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-100"
              whileHover={{ y: -5 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <div className="w-20 h-20 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-6 text-blue-600">
                <ThumbsUp className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">100% Satisfaction</h3>
              <p className="text-gray-600">
                Your satisfaction is our priority. We ensure quality service delivery with our satisfaction guarantee.
              </p>
            </motion.div>
          </div>
          
          <div className="mt-16 text-center">
            <Link to="/about" className="inline-flex items-center text-blue-600 font-medium hover:text-blue-700 group">
              Learn more about our standards
              <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>
      {/* Services Section */}
      <section className="py-20 relative bg-gradient-to-b from-white to-gray-50 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-100 rounded-full opacity-20"></div>
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-yellow-100 rounded-full opacity-30"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-800 font-medium mb-4">
              <Star className="w-5 h-5 mr-2 text-yellow-400" />
              Our Services
            </div>
            <h2 className="text-4xl font-bold mb-4 text-gray-900">
              Comprehensive <span className="text-blue-600">Service Solutions</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We offer a wide range of professional services to meet all your needs. 
              Our verified vendors are experts in their respective fields.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Home Repairs',
                icon: <Wrench className="w-8 h-8" />,
                description: 'Professional repair services for all your household needs, from minor fixes to major renovations.'
              },
              {
                title: 'Cleaning Services',
                icon: <ShieldCheck className="w-8 h-8" />,
                description: 'Expert cleaning services to keep your space spotless and hygienic.'
              },
              {
                title: 'Electrical Work',
                icon: <Plug className="w-8 h-8" />,
                description: 'Certified electricians for safe and reliable electrical installations and repairs.'
              },
              {
                title: 'Plumbing Services',
                icon: <Droplets className="w-8 h-8" />,
                description: 'Comprehensive plumbing solutions for both residential and commercial properties.'
              },
              {
                title: 'Painting',
                icon: <PaintBucket className="w-8 h-8" />,
                description: 'Transform your space with our professional interior and exterior painting services.'
              },
              {
                title: 'Carpentry',
                icon: <Truck className="w-8 h-8" />,
                description: 'Skilled carpenters for custom furniture, repairs, and woodworking projects.'
              }
            ].map((service, index) => (
              <motion.div 
                key={index} 
                className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-100"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6 group-hover:bg-blue-100 transition-colors duration-300">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">{service.title}</h3>
                <p className="text-gray-600 mb-6">{service.description}</p>
                <Link 
                  to="/register" 
                  className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium group-hover:translate-x-1 transition-transform duration-300"
                >
                  Find Vendors
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-16 text-center">
            <Link 
              to="/services" 
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-white bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
            >
              View All Services
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>
      {/* How It Works */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-5">
          <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
          <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-800 font-medium mb-4">
              <Sparkles className="w-5 h-5 mr-2 text-yellow-400" />
              Simple Steps
            </div>
            <h2 className="text-4xl font-bold mb-4 text-gray-900">
              How It <span className="text-blue-600">Works</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our platform makes it incredibly easy to connect with skilled service providers in your area.
              Get started in just a few simple steps.
            </p>
          </motion.div>
          
          <div className="relative">
            {/* Connector Line */}
            <div className="absolute top-24 left-1/2 transform -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-blue-200 via-blue-400 to-blue-200 hidden md:block"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
              {[
                {
                  step: '1',
                  icon: <UserPlus className="w-6 h-6" />,
                  title: 'Create an Account',
                  description: 'Sign up as a user looking for services or as a vendor offering services.'
                },
                {
                  step: '2',
                  icon: <Search className="w-6 h-6" />,
                  title: 'Find or Get Found',
                  description: 'Browse through verified vendors or list your services and wait for requests.'
                },
                {
                  step: '3',
                  icon: <CheckCircle className="w-6 h-6" />,
                  title: 'Get Service or Serve',
                  description: 'Receive quality service from trusted professionals or start serving customers.'
                }
              ].map((item, index) => (
                <motion.div 
                  key={index} 
                  className="relative bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 group"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.2 }}
                  whileHover={{ y: -5 }}
                >
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                    {item.icon}
                  </div>
                  <div className="w-16 h-16 rounded-full bg-blue-600 text-white text-2xl font-bold flex items-center justify-center mx-auto mb-6 border-4 border-white shadow-lg group-hover:bg-blue-700 transition-colors duration-300">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900">{item.title}</h3>
                  <p className="text-gray-600">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
          
          <div className="mt-16 text-center">
            <Link 
              to="/register" 
              className="inline-flex items-center px-8 py-4 border border-transparent text-base font-medium rounded-full text-white bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
            >
              Get Started Now
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>
      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-6">
            What Our Users Say
          </h2>
          <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">
            Don't just take our word for it. See what our users have to say
            about their experience.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[{
            name: 'Rajesh Kumar',
            role: 'Homeowner',
            image: 'https://randomuser.me/api/portraits/men/32.jpg',
            testimonial: 'I found a reliable plumber within hours. The service quality was excellent and pricing transparent.'
          }, {
            name: 'Priya Sharma',
            role: 'Vendor - Electrician',
            image: 'https://randomuser.me/api/portraits/women/44.jpg',
            testimonial: 'My business has grown significantly since joining Hindu Seva Kendra. The platform connects me directly with customers.'
          }, {
            name: 'Amit Patel',
            role: 'Office Manager',
            image: 'https://randomuser.me/api/portraits/men/22.jpg',
            testimonial: 'We use Hindu Seva Kendra for all our office maintenance needs. Consistent quality and professional service every time.'
          }].map((testimonial, index) => <div key={index} className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                <div className="flex items-center mb-4">
                  <img src={testimonial.image} alt={testimonial.name} className="w-14 h-14 rounded-full mr-4 border-2 border-blue-200" />
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-blue-600 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-700 italic">
                  "{testimonial.testimonial}"
                </p>
                <div className="mt-4 flex">
                  {[1, 2, 3, 4, 5].map(star => <Star key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" />)}
                </div>
              </div>)}
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="bg-blue-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Join our community today and experience the convenience of finding
            trusted service providers or growing your service business.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/register">
              <Button variant="secondary" size="lg">
                Register as User
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-blue-600">
                Register as Vendor
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;