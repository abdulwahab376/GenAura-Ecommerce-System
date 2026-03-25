// import React from 'react';
// import bannerImg from "../../assets/header.png"
// import { Link } from 'react-router-dom';

// const Banner = () => {
//   return (
//     <header className="section__container header__container">
//       <div className="header__content z-30">
//         <h4>UP TO 20% DISCOUNT ON</h4>
//         <h1>Girl's Fashion</h1>
//         <p>
//           Discover the latest trends and express your unique style with our Women's Fashion website. Explore a curated collection of clothing, accessories, and footwear that caters to every taste and occasion.
//         </p>
//         <button className="btn"><Link to="/shop">EXPLORE NOW</Link></button>
//       </div>
//       <div className="header__image">
//         <img src={bannerImg} alt="header" />
//       </div>
//     </header>
//   );
// };

// export default Banner;



import React from 'react';
import bannerImg from "../../assets/header.png";
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Banner = () => {
  return (
    <header className="section__container header__container overflow-hidden">
      
      {/* Left Content */}
      <motion.div 
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="header__content z-30"
      >
        <h4 className="uppercase tracking-widest text-orange-500 font-bold text-sm mb-2">
          New Arrivals • Up to 20% Off
        </h4>
        
        <h1 className="text-slate-900 leading-tight text-4xl md:text-5xl font-extrabold mb-4">
          Elevate Your <br /> 
          Everyday Style
        </h1>
        
        <p className="text-slate-600 text-sm md:text-base mb-6">
          Experience the future of smart shopping. Discover a premium collection 
          of fashion and lifestyle essentials designed for everyone.
        </p>
        
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="btn"
        >
          <Link to="/shop">EXPLORE COLLECTION</Link>
        </motion.button>
      </motion.div>

      {/* Right Image Container */}
      <div className="header__image" style={{ 
        position: 'relative', 
        height: '100%', 
        minHeight: '400px',
        width: '100%' 
      }}>
        <motion.img 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          animate={{ y: [0, -12, 0] }} 
          transition={{ 
            initial: { duration: 0.8 },
            animate: { duration: 4, repeat: Infinity, ease: "easeInOut" } 
          }}
          src={bannerImg} 
          alt="Smart Commerce Banner" 
          style={{ 
            position: 'absolute', 
            bottom: '-120px',    
            right: '0',          
            left: 'auto',        
            transform: 'none',   
            // Yahan se size control ho raha hai
            width: '100%',       // 90% se barha kar 100% kar diya
            maxWidth: '500px',   // 450px se barha kar 550px kar diya (isay mazeed barha sakte hain)
            height: 'auto',
            objectFit: 'contain'
          }} 
        />
      </div>
    </header>
  );
};

export default Banner;