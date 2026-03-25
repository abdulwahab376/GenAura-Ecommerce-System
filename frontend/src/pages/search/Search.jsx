// import React, { useState } from 'react';
// import productsData from '../../data/products.json';
// import ProductCards from '../shop/ProductCards';

// const Search = () => {
//     const [searchQuery, setSearchQuery] = useState('');
//     const [filteredProducts, setFilteredProducts] = useState(productsData);

//     const handleSearch = () => {
//         const query = searchQuery.toLowerCase();

//         const filtered = productsData.filter(product =>
//             product.name.toLowerCase().includes(query) ||
//             product.description.toLowerCase().includes(query)
//         );
//         setFilteredProducts(filtered);
//     };

//     return (
//         <>
//             <section className="section__container bg-primary-light">
//                 <h2 className="section__header">Search Products</h2>
//                 <p className="section__subheader">
//                     Browse a diverse range of categories, from chic dresses to versatile accessories. Elevate your style today!
//                 </p>
//             </section>
//             <section className="section__container">
//                 <div className="w-full mb-12 flex flex-col md:flex-row items-center justify-center gap-4">
//                     <input
//                         type="text"
//                         placeholder="Search for products..."
//                         value={searchQuery}
//                         onChange={(e) => setSearchQuery(e.target.value)}
//                         className="search-bar w-full max-w-4xl p-2 border rounded"
//                     />
//                     <button
//                         onClick={handleSearch}
//                         className="search-button w-full md:w-auto py-2 px-8 bg-primary text-white rounded"
//                     >
//                         Search
//                     </button>
//                 </div>
//                 <ProductCards products={filteredProducts}/>
                
//             </section>
//         </>

//     );
// };

// export default Search;


import React, { useState, useEffect } from 'react';
// import productsData from '../../data/products.json'; // ❌ Isay delete kar den
import ProductCards from '../shop/ProductCards';
import { useFetchAllProductsQuery } from '../../redux/features/products/productsApi'; //  API hook import karein

const Search = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredProducts, setFilteredProducts] = useState([]);

    //  Database se fresh products fetch karein
    const { data: { products = [] } = {}, isLoading, error } = useFetchAllProductsQuery({
        category: '',
        color: '',
        minPrice: '',
        maxPrice: '',
        page: 1,
        limit: 100 // Zyada products fetch karein taake search sahi chale
    });

    // Jab database se data aaye, to usay initial state mein set karein
    useEffect(() => {
        if (products) {
            setFilteredProducts(products);
        }
    }, [products]);

    const handleSearch = () => {
        const query = searchQuery.toLowerCase();

        //  Ab yeh Database wale products ko filter kare ga
        const filtered = products.filter(product =>
            product.name.toLowerCase().includes(query) ||
            product.description.toLowerCase().includes(query)
        );
        setFilteredProducts(filtered);
    };

    if (isLoading) return <div className="p-10 text-center">Loading fresh products...</div>;
    if (error) return <div className="p-10 text-center text-red-500">Error fetching products!</div>;

    return (
        <>
            <section className="section__container bg-primary-light">
                <h2 className="section__header">Search Products</h2>
                <p className="section__subheader">
                    Browse our latest collection directly from Jhelum. Elevate your style today!
                </p>
            </section>
            
            <section className="section__container">
                <div className="w-full mb-12 flex flex-col md:flex-row items-center justify-center gap-4">
                    <input
                        type="text"
                        placeholder="Search for products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-bar w-full max-w-4xl p-3 border rounded-xl outline-none focus:border-primary transition-all"
                    />
                    <button
                        onClick={handleSearch}
                        className="search-button w-full md:w-auto py-3 px-10 bg-primary text-white rounded-xl hover:bg-black transition-all font-bold"
                    >
                        Search
                    </button>
                </div>

                {/* Search Results */}
                {filteredProducts.length > 0 ? (
                    <ProductCards products={filteredProducts}/>
                ) : (
                    <div className="text-center py-10 text-gray-500">
                        No products found for "{searchQuery}"
                    </div>
                )}
                
            </section>
        </>
    );
};

export default Search;