import { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle, MessageSquare, User, Mail as MailIcon, HelpCircle } from 'lucide-react';
import Button from '../components/ui/Button';
import { motion } from 'framer-motion';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};
const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const {
      name,
      value
    } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, you would send the form data to a server
    console.log('Form submitted:', formData);
    setIsSubmitted(true);
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };
  return (
    <div className="w-full bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-700 to-blue-600 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSg0NSkiPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNwYXR0ZXJuKSIvPjwvc3ZnPg==')]"></div>
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Get in Touch</h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              We're here to help and answer any questions you might have. We look forward to hearing from you!
            </p>
          </motion.div>
        </div>
      </section>
      {/* Contact Information */}
      <section className="py-16 md:py-24 relative">
        <div className="absolute inset-0 bg-blue-50 -z-10"></div>
        <div className="container mx-auto px-4">
          <motion.div 
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Contact Information */}
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white p-8 md:p-12">
                <h2 className="text-3xl font-bold mb-6">Contact Information</h2>
                <p className="text-blue-100 mb-8 text-lg">
                  Have questions about our platform? Want to learn more about becoming a vendor or using our services? 
                  Our team is ready to assist you with any inquiries you may have.
                </p>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="bg-blue-500/20 p-3 rounded-lg mr-4">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Our Location</h3>
                      <p className="text-blue-100">
                        123 Main Street, City, State, 400001, India
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-blue-500/20 p-3 rounded-lg mr-4">
                      <Phone className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Phone</h3>
                      <p className="text-blue-100">+91 6359220055</p>
                      <p className="text-blue-100 text-sm mt-1">Mon-Sun: 9:00 AM - 8:00 PM</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-blue-500/20 p-3 rounded-lg mr-4">
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Email</h3>
                      <p className="text-blue-100">helphskhelp@gmail.com</p>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <h3 className="font-semibold text-lg mb-3">Follow Us</h3>
                    <div className="flex space-x-4">
                      {['Facebook', 'Twitter', 'Instagram', 'LinkedIn'].map((social, index) => (
                        <a 
                          key={index} 
                          href="#" 
                          className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-white hover:bg-blue-500/30 transition-colors"
                          aria-label={social}
                        >
                          <span className="sr-only">{social}</span>
                          
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              {/* Contact Form */}
              <div className="p-8 md:p-12">
                <div className="flex items-center mb-8">
                  <div className="bg-blue-100 p-2 rounded-full mr-3">
                    <Send className="w-6 h-6 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">Send us a Message</h2>
                </div>
                
                {isSubmitted ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded-r"
                  >
                    <div className="flex">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                      <div>
                        <p className="font-medium text-green-800">Message Sent Successfully!</p>
                        <p className="text-green-700">Thank you for contacting us. We'll get back to you within 24 hours.</p>
                      </div>
                    </div>
                  </motion.div>
                ) : null}
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="relative">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="John Doe"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="relative">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MailIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="your@email.com"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="relative">
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                      Subject <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MessageSquare className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="How can we help you?"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      Your Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Please share more details about your inquiry..."
                      required
                    ></textarea>
                  </div>
                  
                  <div className="pt-2">
                    <Button 
                      type="submit" 
                      variant="primary" 
                      className="w-full py-3 text-base font-medium flex items-center justify-center space-x-2"
                    >
                      <Send className="w-5 h-5" />
                      <span>Send Message</span>
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Map Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div 
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-6xl mx-auto"
          >
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Find Us on Map</h2>
              <div className="w-20 h-1 bg-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
                Visit our office or get in touch with us for any inquiries. We're here to help you with all your service needs.
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200">
              <div className="aspect-w-16 aspect-h-9 h-96 w-full">
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <div className="text-center p-6">
                    <MapPin className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Our Office Location</h3>
                    <p className="text-gray-600 mb-4">123 Main Street, City, State, 400001, India</p>
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="bg-blue-50 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-700 mb-1">{item.description}</p>
                  {item.subDescription && <p className="text-gray-700">{item.subDescription}</p>}
                  {item.link ? (
                    <a 
                      href={item.link} 
                      className="inline-block mt-4 text-blue-600 hover:text-blue-800 font-medium flex items-center"
                    >
                      {item.action}
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </a>
                  ) : (
                    <p className="mt-4 text-gray-500 text-sm">{item.action}</p>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center mb-16"
          >
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-4">
              <HelpCircle className="w-5 h-5 mr-2" />
              HAVE QUESTIONS?
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600 text-lg">
              Find answers to common questions about our services, registration process, and more.
            </p>
          </motion.div>
          
          <div className="max-w-3xl mx-auto space-y-4">
            {[
              {
                question: 'How do I register as a vendor?',
                answer: "You can register as a vendor by clicking on the 'Register' button in the navigation menu and selecting 'Vendor Registration'. You'll need to provide your personal details, service information, and verification documents."
              },
              {
                question: 'Is there a fee to join the platform?',
                answer: 'Registration is free for both users and vendors. We may have premium features in the future, but basic access to the platform will always remain free.'
              },
              {
                question: 'How are vendors verified?',
                answer: 'We verify vendors through their provided ID proof, address verification, and service credentials. This ensures that only legitimate service providers are listed on our platform.'
              },
              {
                question: "What if I'm not satisfied with a service?",
                answer: "If you're not satisfied with a service, you can raise a concern through our platform. We take all user feedback seriously and work with vendors to resolve any issues."
              },
              {
                question: 'How long does it take to get a response?',
                answer: 'We typically respond to all inquiries within 24 hours during business days. For urgent matters, please call our support line for immediate assistance.'
              },
              {
                question: 'What services do you offer?',
                answer: 'We offer a wide range of services including plumbing, electrical work, cleaning, carpentry, pest control, and more. Our platform connects you with trusted local service providers for all your needs.'
              }
            ].map((faq, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-gray-100"
              >
                <div className="p-5 md:p-6">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <span className="text-blue-600 mr-3">Q{index + 1}.</span>
                    {faq.question}
                  </h3>
                  <div className="mt-3 pl-8">
                    <p className="text-gray-700">{faq.answer}</p>
                  </div>
                </div>
              </motion.div>
            ))}
            
            <div className="text-center mt-10">
              <p className="text-gray-600 mb-4">Still have questions?</p>
              <Button 
                variant="outline" 
                className="border-blue-600 text-blue-600 hover:bg-blue-50 flex items-center mx-auto"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Contact Our Support Team
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
export default Contact;