// import React, { useState } from 'react';
// import ProductCards from './ProductCards';
// import ShopFiltering from './ShopFiltering';
// import { useFetchAllProductsQuery } from '../../redux/features/products/productsApi';

// const filters = {
//     categories: ['all', 'accessories', 'dress', 'jewellery', 'cosmetics'],
//     colors: ['all', 'black', 'red', 'gold', 'blue', 'silver', 'beige', 'green'],
//     priceRanges: [
//         { label: 'Under $50', min: 0, max: 50 },
//         { label: '$50 - $100', min: 50, max: 100 },
//         { label: '$100 - $200', min: 100, max: 200 },
//         { label: '$200 and above', min: 200, max: Infinity }
//     ]
// };

// const ShopPage = () => {
//     const [filtersState, setFiltersState] = useState({
//         category: 'all',
//         color: 'all',
//         priceRange: ''
//     });
    
//     const [currentPage, setCurrentPage] = useState(1);
//     const [productsPerPage] = useState(8);

//     const { category, color, priceRange } = filtersState;
//     const [minPrice, maxPrice] = priceRange.split('-').map(Number);

//     const { data: { products = [], totalPages, totalProducts } = {}, error, isLoading } = useFetchAllProductsQuery({
//         category: category !== 'all' ? category : '',
//         color: color !== 'all' ? color : '',
//         minPrice: isNaN(minPrice) ? '' : minPrice,
//         maxPrice: isNaN(maxPrice) ? '' : maxPrice,
//         page: currentPage,
//         limit: productsPerPage
//     });


//     const handlePageChange = (pageNumber) => {
//         console.log(`Changing to page: ${pageNumber}`);
//         if (pageNumber > 0 && pageNumber <= totalPages) {
//             setCurrentPage(pageNumber);
//         }
//     };

//     const clearFilters = () => {
//         setFiltersState({
//             category: 'all',
//             color: 'all',
//             priceRange: ''
//         });
//     };

//     if (isLoading) return <p>Loading...</p>;
//     if (error) return <p>Error loading products.</p>;

//     const startProduct = (currentPage - 1) * productsPerPage + 1;
//     const endProduct = startProduct + products.length - 1;

//     return (
//         <>
//             <section className="section__container rounded bg-primary-light">
//                 <h2 className="section__header">Shop Page</h2>
//                 <p className="section__subheader">
//                     Discover the Hottest Picks: Elevate Your Style with Our Curated
//                     Collection of Trending Women's Fashion Products.
//                 </p>
//             </section>
//             <section className='section__container'>
//                 <div className='flex flex-col md:flex-row md:gap-12 gap-8'>
//                     {/* left side */}
//                     <ShopFiltering
//                         filters={filters}
//                         filtersState={filtersState}
//                         setFiltersState={setFiltersState}
//                         clearFilters={clearFilters}
//                     />

//                     {/* right side */}
//                     <div>
//                         <h3 className='text-xl font-medium mb-4'>Showing {startProduct} to {endProduct} of {totalProducts} products</h3>
//                         <ProductCards products={products} />
                        
//                         {/* Pagination controls */}
//                         <div className="mt-6 flex justify-center">
//                             <button
//                                 onClick={() => handlePageChange(currentPage - 1)}
//                                 disabled={currentPage === 1}
//                                 className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md mr-2"
//                             >
//                                 Previous
//                             </button>
//                             {[...Array(totalPages)].map((_, index) => (
//                                 <button
//                                     key={index}
//                                     onClick={() => handlePageChange(index + 1)}
//                                     className={`px-4 py-2 ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'} rounded-md mx-1`}
//                                 >
//                                     {index + 1}
//                                 </button>
//                             ))}
//                             <button
//                                 onClick={() => handlePageChange(currentPage + 1)}
//                                 disabled={currentPage === totalPages}
//                                 className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md ml-2"
//                             >
//                                 Next
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             </section>
//         </>
//     );
// };

// export default ShopPage;





import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCards from './ProductCards';
import ShopFiltering from './ShopFiltering';
import { useFetchAllProductsQuery } from '../../redux/features/products/productsApi';

// Nested Filter Structure
const filters = {
    categories: {
        men: ['shirts', 'jeans', 'watches', 'shoes', 'jackets'],
        women: ['dress', 'jewellery', 'cosmetics', 'handbags', 'heels', 'tops', 'skirts', 'scarves', 'sunglasses', 'lingerie'],
        kids: ['toys', 'baby suit', 'school bags', 'pajamas', 'sneakers', 'hats', 'socks', 'raincoats', 'gloves', 'diapers']
    },
    colors: ['all', 'black', 'red', 'gold', 'blue', 'silver', 'beige', 'green'],
    priceRanges: [
        { label: 'Under $50', min: 0, max: 50 },
        { label: '$50 - $100', min: 50, max: 100 },
        { label: '$100 - $200', min: 100, max: 200 },
        { label: '$200 and above', min: 200, max: Infinity }
    ]
};

const ShopPage = () => {
    const [searchParams] = useSearchParams();
    const [filtersState, setFiltersState] = useState({
        category: 'all',
        mainCategory: '', // Main category ke liye state
        color: 'all',
        priceRange: ''
    });
    
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(8);

    // Sync filters with URL parameters
    useEffect(() => {
        const categoryParam = searchParams.get('category');
        const mainCategoryParam = searchParams.get('mainCategory');

        if (categoryParam) {
            // Agar sub-category select hui hai
            setFiltersState(prev => ({ 
                ...prev, 
                category: categoryParam, 
                mainCategory: '' 
            }));
        } else if (mainCategoryParam) {
            // Agar Navbar se main category (Men/Women) click hui hai
            setFiltersState(prev => ({ 
                ...prev, 
                category: 'all', 
                mainCategory: mainCategoryParam 
            }));
        } else {
            setFiltersState(prev => ({ 
                ...prev, 
                category: 'all', 
                mainCategory: '' 
            }));
        }
    }, [searchParams]);

    const { category, mainCategory, color, priceRange } = filtersState;
    const [minPrice, maxPrice] = priceRange.split('-').map(Number);

    // API Query Logic
    // Agar sub-category 'all' hai toh mainCategory bhejenge, warna sub-category
    const selectedCategory = category !== 'all' ? category : (mainCategory || '');

    const { data: { products = [], totalPages, totalProducts } = {}, error, isLoading } = useFetchAllProductsQuery({
        category: selectedCategory,
        color: color !== 'all' ? color : '',
        minPrice: isNaN(minPrice) ? '' : minPrice,
        maxPrice: isNaN(maxPrice) ? '' : maxPrice,
        page: currentPage,
        limit: productsPerPage
    });

    const handlePageChange = (pageNumber) => {
        if (pageNumber > 0 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
            window.scrollTo({ top: 500, behavior: 'smooth' });
        }
    };

    const clearFilters = () => {
        setFiltersState({
            category: 'all',
            mainCategory: '',
            color: 'all',
            priceRange: ''
        });
    };

    if (isLoading) return <div className='section__container text-center'>Loading...</div>;
    if (error) return <div className='section__container text-center text-red-500'>Error loading products.</div>;

    const startProduct = (currentPage - 1) * productsPerPage + 1;
    const endProduct = startProduct + products.length - 1;

    return (
        <>
            <section className="section__container rounded bg-primary-light">
                <h2 className="section__header">Lebaba Shop</h2>
                <p className="section__subheader">
                    Explore our vast collection {mainCategory ? `for ${mainCategory.toUpperCase()}` : ''}. 
                    Find exactly what you need with our advanced filtering.
                </p>
            </section>

            <section className='section__container'>
                <div className='flex flex-col md:flex-row md:gap-12 gap-8'>
                    <ShopFiltering
                        filters={filters}
                        filtersState={filtersState}
                        setFiltersState={setFiltersState}
                        clearFilters={clearFilters}
                    />

                    <div className='flex-1'>
                        <h3 className='text-xl font-medium mb-4'>
                            Showing {products.length > 0 ? `${startProduct} to ${endProduct}` : '0'} of {totalProducts} products
                        </h3>
                        
                        {products.length > 0 ? (
                            <ProductCards products={products} />
                        ) : (
                            <div className='text-center py-10 text-gray-500'>No products found matching these filters.</div>
                        )}
                        
                        {totalPages > 1 && (
                            <div className="mt-10 flex justify-center gap-2">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg disabled:opacity-50 hover:bg-gray-50 transition-all"
                                >
                                    <i className="ri-arrow-left-s-line"></i>
                                </button>
                                
                                {[...Array(totalPages)].map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handlePageChange(index + 1)}
                                        className={`px-4 py-2 rounded-lg font-medium transition-all ${
                                            currentPage === index + 1 
                                            ? 'bg-primary text-white shadow-md' 
                                            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                                        }`}
                                    >
                                        {index + 1}
                                    </button>
                                ))}
                                
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg disabled:opacity-50 hover:bg-gray-50 transition-all"
                                >
                                    <i className="ri-arrow-right-s-line"></i>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </>
    );
};

export default ShopPage;