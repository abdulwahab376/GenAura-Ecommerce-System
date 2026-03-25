// import React, { useState } from 'react';
// import products from "../../data/products.json";

// import ProductCards from './ProductCards';

// const TrendingProducts = () => {
//   const [visibleProducts, setVisibleProducts] = useState(8);

//   const loadMoreProducts = () => {
//     setVisibleProducts(prevCount => prevCount + 4);
//   };

//   return (
//     <section className="section__container product__container">
//       <h2 className="section__header">Trending Products</h2>
//       <p className="section__subheader mb-12">
//         Discover the Hottest Picks: Elevate Your Style with Our Curated
//         Collection of Trending Women's Fashion Products.
//       </p>

//       {/* products card */}
//       <ProductCards products={products.slice(0, visibleProducts)} />

//        {/* Load More button */}
//       <div className="product__btn">
//         {visibleProducts < products.length && (
//           <button className="btn" onClick={loadMoreProducts}>
//             Load More
//           </button>
//         )}
//       </div>
//     </section>
//   );
// };

// export default TrendingProducts;

import React, { useState } from 'react';
// import products from "../../data/products.json"; // ❌ Isay delete kar den
import ProductCards from './ProductCards';
import { useFetchAllProductsQuery } from '../../redux/features/products/productsApi';

const TrendingProducts = () => {
    const [visibleProducts, setVisibleProducts] = useState(8);

    //  Database se products fetch karein
    const { data: { products = [] } = {}, error, isLoading } = useFetchAllProductsQuery({
        limit: visibleProducts, // Agar aapki API limit support karti hai
    });

    const loadMoreProducts = () => {
        setVisibleProducts(prevCount => prevCount + 4);
    };

    if (isLoading) return <div className="p-10 text-center">Loading trending products...</div>;
    if (error) return <div className="p-10 text-center text-red-500">Error fetching products!</div>;

    return (
        <section className="section__container product__container">
            <h2 className="section__header">Trending Products</h2>
            <p className="section__subheader mb-12">
                Discover the Hottest Picks: Elevate Your Style with Our Curated
                Collection of Trending Products.
            </p>

            {/*  Ab data JSON se nahi, Database (RTK Query) se aa raha hai */}
            <ProductCards products={products.slice(0, visibleProducts)} />

            {/* Load More button */}
            <div className="product__btn">
                {visibleProducts < products.length && (
                    <button className="btn" onClick={loadMoreProducts}>
                        Load More
                    </button>
                )}
            </div>
        </section>
    );
};

export default TrendingProducts;
