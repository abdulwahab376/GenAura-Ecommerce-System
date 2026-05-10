// import React from 'react'
// import Banner from './Banner'
// import Categories from './Categories'
// import HeroSection from './HeroSection'
// import TrendingProducts from '../shop/TrendingProducts'
// import DealsSection from './DealsSection'
// import PromoBanner from './PromoBanner'
// import Blogs from '../blogs/Blogs'

// const Home = () => {
//   return (
//     <>
//     <Banner/>
//     <Categories/>
//     <HeroSection/>
//     <TrendingProducts/>
//     <DealsSection/>
//     <PromoBanner/>
//     <Blogs/>
//     </>
//   )
// }

// export default Home



import React from 'react'
import Banner from './Banner'
import Categories from './Categories'
import HeroSection from './HeroSection'
import TrendingProducts from '../shop/TrendingProducts'
// 🚀 Naya Component Import (Jo hum ne abhi design kiya hai)
import DealProducts from "../../components/DealProducts";
import DealsSection from './DealsSection'
import PromoBanner from './PromoBanner'
import Blogs from '../blogs/Blogs'
import RecommendedForYou from "./RecommendedForYou";

const Home = () => {
  return (
    <>
      <Banner />
      <Categories />
      <HeroSection />

      {/* 1. Trending Products Section */}
      <TrendingProducts />

      {/* 2. New Section: Deals Of This Month Products (Clean Grid) */}
      <DealProducts />

      {/* 3. Deals Banner Section (Blue Background wala) */}
      <DealsSection />
      <RecommendedForYou />
      <PromoBanner />
      <Blogs />
    </>
  )
}

export default Home