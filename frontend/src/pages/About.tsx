import { motion } from 'framer-motion';
import { ShieldCheck, Users, Target, Award, Heart, Handshake, Lightbulb } from 'lucide-react';

const About = () => {
  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };



  return (
    <div className="w-full bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-700 to-blue-600 text-white py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0dGVybiBpZD0icGF0dGVybiIgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIiBwYXR0ZXJuVHJhbnNmb3JtPSJyb3RhdGUoNDUpIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ0cmFuc3BhcmVudCIvPjxwYXRoIGQ9Ik0zMCAxMHYxMEg1MHYxMEgzMHYxMEgxMHYtMTBoMjBWMjBoLTIweiIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIvPjwvcGF0dGVybj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI3BhdHRlcm4pIi8+PC9zdmc+')] opacity-20"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About <span className="text-amber-300">हिन्दू सेवा केंद्र</span></h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed">
              Empowering Communities Through Trusted Service Connections
            </p>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent"></div>
      </section>
      {/* Our Story */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <motion.div 
              className="lg:w-1/2 mb-12 lg:mb-0"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1932&q=80" 
                  alt="Our story" 
                  className="rounded-2xl shadow-2xl w-full h-auto"
                />
                <div className="absolute -bottom-6 -right-6 bg-blue-600 text-white p-6 rounded-2xl shadow-lg hidden md:block">
                  <Heart className="w-10 h-10" fill="currentColor" />
                  <p className="mt-2 font-semibold">Serving Since 2023</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="lg:w-1/2"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              transition={{ delay: 0.2 }}
            >
              <span className="text-blue-600 font-semibold">OUR JOURNEY</span>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">Building Bridges in the Community</h2>
              <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                हिन्दू सेवा केंद्र was born from a simple yet powerful vision: to create meaningful connections between skilled local vendors and the community members who need their services. We recognized the challenges faced by both service providers and consumers in establishing reliable, trustworthy relationships in today's fast-paced world.
              </p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-blue-100 p-2 rounded-full mr-4">
                    <Handshake className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Trusted Network</h3>
                    <p className="text-gray-600">Every vendor is thoroughly vetted to ensure quality and reliability.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-blue-100 p-2 rounded-full mr-4">
                    <Lightbulb className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Innovative Platform</h3>
                    <p className="text-gray-600">Seamlessly connect with service providers through our user-friendly interface.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-blue-50 to-blue-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: '500+', label: 'Happy Customers' },
              { number: '200+', label: 'Verified Vendors' },
              { number: '50+', label: 'Services Offered' },
              { number: '98%', label: 'Satisfaction Rate' }
            ].map((stat, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <p className="text-3xl font-bold text-blue-700 mb-2">{stat.number}</p>
                <p className="text-gray-600">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* Our Mission & Values */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-blue-600 font-semibold">OUR VALUES</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Guiding Principles</h2>
            <p className="text-gray-600">These core values shape everything we do at हिन्दू सेवा केंद्र and guide our mission to connect communities through trusted services.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: 'Community First',
                icon: <Users className="w-10 h-10 text-blue-600" />,
                description: 'Strengthening local communities by supporting service providers and ensuring quality service delivery.'
              },
              {
                title: 'Trust & Integrity',
                icon: <ShieldCheck className="w-10 h-10 text-blue-600" />,
                description: 'Every vendor is thoroughly vetted to ensure reliability and trustworthiness in every service provided.'
              },
              {
                title: 'Accessibility',
                icon: <Target className="w-10 h-10 text-blue-600" />,
                description: 'Making quality services accessible to everyone, regardless of location or economic status.'
              },
              {
                title: 'Excellence',
                icon: <Award className="w-10 h-10 text-blue-600" />,
                description: 'Committed to excellence in service delivery and customer satisfaction.'
              }
            ].map((value, index) => (
              <motion.div 
                key={index}
                className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* Team Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-blue-600 font-semibold">OUR TEAM</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Meet Our Leadership</h2>
            <p className="text-gray-600">
              The passionate individuals driving हिन्दू सेवा केंद्र forward with innovation and dedication.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                name: 'Pradip Mishra',
                role: 'Founder & CEO',
                image: 'https://randomuser.me/api/portraits/men/32.jpg',
                bio: 'Visionary leader with a passion for community service and digital transformation.'
              },
              {
                name: 'Durgesh Rajpurohit',
                role: 'CTO',
                image: 'https://randomuser.me/api/portraits/men/45.jpg',
                bio: 'Technology expert driving our platform\'s innovation and technical excellence.'
              },
              {
                name: 'Kapil Kanodiya',
                role: 'Operations Head',
                image: 'https://randomuser.me/api/portraits/men/68.jpg',
                bio: 'Ensures smooth operations and exceptional service delivery across all platforms.'
              },
              {
                name: 'Rahul Shah',
                role: 'Marketing Director',
                image: 'https://randomuser.me/api/portraits/men/22.jpg',
                bio: 'Creative mind behind our brand presence and community engagement strategies.'
              }
            ].map((member, index) => (
              <motion.div 
                key={index}
                className="group bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="relative w-40 h-40 mx-auto mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-700 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="relative w-full h-full rounded-full object-cover border-4 border-white z-10"
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-blue-600 font-medium mb-4">{member.role}</p>
                <p className="text-gray-600">{member.bio}</p>
                <div className="mt-4 flex justify-center space-x-3">
                  <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
                    <span className="sr-only">LinkedIn</span>
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
                    <span className="sr-only">Twitter</span>
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-700 to-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Join Our Community?</h2>
            <p className="text-xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Whether you're looking for trusted services or want to offer your expertise, we'd love to have you on board.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a 
                href="/register" 
                className="bg-white text-blue-700 hover:bg-gray-100 font-semibold py-3 px-8 rounded-full transition-colors duration-300 inline-block"
              >
                Sign Up Now
              </a>
              <a 
                href="/contact" 
                className="border-2 border-white text-white hover:bg-white hover:bg-opacity-10 font-semibold py-3 px-8 rounded-full transition-colors duration-300 inline-block"
              >
                Contact Us
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};
export default About;