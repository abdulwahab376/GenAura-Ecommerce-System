import React from "react";

const Contact = () => {
  return (
    <div className="bg-white min-h-screen">
      {/* --- Banner Section --- */}
      <section className="bg-primary-light py-20 px-6 text-center">
        <h1 className="text-5xl font-black text-gray-900 tracking-tighter mb-4">
          CONTACT <span className="text-primary">US</span>
        </h1>
        <p className="max-w-2xl mx-auto text-gray-600 text-lg">
          We’re here to help you with your order, style advice, or anything else you need. Reach out to our dedicated team in Jhelum.
        </p>
      </section>

      {/* --- Contact Cards Section --- */}
      <div className="max-w-7xl mx-auto px-6 -mt-10 mb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1: Call Us */}
          <div className="bg-white p-10 rounded-[2rem] shadow-xl border border-gray-100 text-center hover:scale-105 transition-transform duration-300">
            <div className="w-16 h-16 bg-red-50 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="ri-phone-fill text-3xl"></i>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2 uppercase tracking-widest">Call Us</h3>
            <p className="text-gray-500 mb-4">Monday - Saturday (9am - 6pm)</p>
            <p className="text-primary font-black text-lg">+92 300 1234567</p>
          </div>

          {/* Card 2: Email Us */}
          <div className="bg-white p-10 rounded-[2rem] shadow-xl border border-gray-100 text-center hover:scale-105 transition-transform duration-300">
            <div className="w-16 h-16 bg-red-50 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="ri-mail-send-fill text-3xl"></i>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2 uppercase tracking-widest">Email Us</h3>
            <p className="text-gray-500 mb-4">We reply within 24 hours</p>
            <p className="text-primary font-black text-lg">support@lebaba.com</p>
          </div>

          {/* Card 3: Visit Us */}
          <div className="bg-white p-10 rounded-[2rem] shadow-xl border border-gray-100 text-center hover:scale-105 transition-transform duration-300">
            <div className="w-16 h-16 bg-red-50 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="ri-map-pin-2-fill text-3xl"></i>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2 uppercase tracking-widest">Visit Us</h3>
            <p className="text-gray-500 mb-2 text-primary font-black">Postal Code: 49600</p>
            <p className="text-gray-500 italic">Jhelum, Punjab, Pakistan</p>
          </div>

        </div>
      </div>

      {/* --- Map & Socials Section --- */}
      <section className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center mb-20">
        
        {/* Map Container - Jhelum focus */}
        <div className="rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-gray-50 h-[400px]">
          <iframe
            title="Lebaba Jhelum Location"
            className="w-full h-full grayscale hover:grayscale-0 transition-all duration-700"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d53363.48622116238!2d73.712165!3d32.932824!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x391f90e36399e69f%3A0x6476b71f92e9c20a!2sJhelum%2C%20Punjab%2C%20Pakistan!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s"
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>

        {/* Social Link Section */}
        <div className="space-y-6">
          <h2 className="text-4xl font-black text-gray-900 leading-tight">
            Connect with Lebaba <br /> in Jhelum
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            From the banks of the Jhelum River to your doorstep. Join our growing community and experience the best of fashion with local trust.
          </p>
          
          <div className="flex gap-4">
            <a href="#" className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center hover:bg-primary transition-colors text-xl shadow-lg">
              <i className="ri-instagram-line"></i>
            </a>
            <a href="#" className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center hover:bg-primary transition-colors text-xl shadow-lg">
              <i className="ri-facebook-fill"></i>
            </a>
            <a href="#" className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center hover:bg-primary transition-colors text-xl shadow-lg">
              <i className="ri-whatsapp-line"></i>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;