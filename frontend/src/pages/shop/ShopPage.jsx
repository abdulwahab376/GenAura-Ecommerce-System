import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCards from './ProductCards';
import ShopFiltering from './ShopFiltering';
import { useFetchAllProductsQuery } from '../../redux/features/products/productsApi';

//  Yahan label aur min/max ko Rs. ke mutabiq set kar diya hai
const filters = {
    categories: {
        men: ['pants', 'shirts', 'shoes', 'watches', 'jackets'],
        women: ['dress', 'jewellery', 'cosmetics', 'shirts', 'handbags', 'jackets'],
        kids: ['kids suits', 't-shirts', 'shoes', 'jackets']
    },
    colors: ['all', 'black', 'red', 'gold', 'blue', 'silver', 'beige', 'green', 'purple', 'orange', 'white', 'pink', 'gray', 'brown'],
    priceRanges: [
        { label: 'under-1000', min: 0, max: 1000 },
        { label: '1000-2000', min: 1000, max: 2000 },
        { label: '2000-3000', min: 2000, max: 3000 },
        { label: '3000-above', min: 3000, max: 100000 } // Backend handle kar lega
    ]
};

const ShopPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [filtersState, setFiltersState] = useState({
        category: 'all',
        mainCategory: '', 
        color: 'all',
        priceRange: ''
    });
    
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(16);

    useEffect(() => {
        const categoryParam = searchParams.get('category');
        const mainCategoryParam = searchParams.get('mainCategory');
        const colorParam = searchParams.get('color');
        const priceParam = searchParams.get('priceRange');

        setFiltersState({
            category: categoryParam || 'all',
            mainCategory: mainCategoryParam || '',
            color: colorParam || 'all',
            priceRange: priceParam || ''
        });
        
        setCurrentPage(1);
    }, [searchParams]);

    const { category, mainCategory, color, priceRange } = filtersState;
    
    //  Price Calculation Logic (Backend ko min/max chahiye hote hain)
    const selectedPriceRange = filters.priceRanges.find(p => p.label === priceRange);
    const minPrice = selectedPriceRange ? selectedPriceRange.min : '';
    const maxPrice = selectedPriceRange ? (selectedPriceRange.max === 100000 ? '' : selectedPriceRange.max) : '';

    //  API Query
    const { data: { products = [], totalPages, totalProducts } = {}, error, isLoading } = useFetchAllProductsQuery({
        category: category !== 'all' ? category : '', 
        mainCategory: mainCategory !== 'all' ? mainCategory : '', 
        color: color !== 'all' ? color : '',
        minPrice: minPrice,
        maxPrice: maxPrice,
        page: currentPage,
        limit: productsPerPage
    });

    const handlePageChange = (pageNumber) => {
        if (pageNumber > 0 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const clearFilters = () => {
        setSearchParams({}); 
    };

    if (isLoading) return <div className='section__container text-center text-primary font-bold py-10'>Loading Products...</div>;
    if (error) return <div className='section__container text-center text-red-500 py-10'>Error loading products.</div>;

    const startProduct = (currentPage - 1) * productsPerPage + 1;
    const endProduct = Math.min(startProduct + products.length - 1, totalProducts);

    return (
        <>
            <section className="section__container rounded bg-primary-light">
                <h2 className="section__header">Smart Commerce Shop</h2>
                <p className="section__subheader">
                    {mainCategory ? `Exclusive ${mainCategory.toUpperCase()} Collection` : 'Explore our vast collection'} 
                    {category !== 'all' ? ` in ${category}` : ''}. 
                </p>
            </section>

            <section className='section__container'>
                <div className='flex flex-col md:flex-row md:gap-12 gap-8'>
                    <ShopFiltering
                        filters={filters}
                        filtersState={filtersState}
                        setFiltersState={(incomingState) => {
                            setFiltersState(incomingState);
                            const params = {};
                            if (incomingState.category && incomingState.category !== 'all') params.category = incomingState.category;
                            if (incomingState.mainCategory && incomingState.mainCategory !== '') params.mainCategory = incomingState.mainCategory;
                            if (incomingState.color && incomingState.color !== 'all') params.color = incomingState.color;
                            if (incomingState.priceRange) params.priceRange = incomingState.priceRange;
                            setSearchParams(params);
                        }}
                        clearFilters={clearFilters}
                    />

                    <div className='flex-1'>
                        <h3 className='text-xl font-medium mb-4 text-gray-700'>
                            Showing {totalProducts > 0 ? `${startProduct} to ${endProduct}` : '0'} of {totalProducts} products
                        </h3>
                        
                        {products.length > 0 ? (
                            <ProductCards products={products} />
                        ) : (
                            <div className='text-center py-20 bg-gray-50 rounded-xl border border-dashed'>
                                <i className="ri-search-line text-4xl text-gray-300 mb-2 block"></i>
                                <p className='text-gray-500'>No products found in this price range.</p>
                                <button onClick={clearFilters} className='text-primary font-medium underline mt-2'>Clear all filters</button>
                            </div>
                        )}
                        
                        {/* Pagination Section */}
                        {totalPages > 1 && (
                            <div className="mt-12 flex justify-center gap-2">
                                <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="p-2 w-10 h-10 flex items-center justify-center bg-white border border-gray-300 rounded-full disabled:opacity-30 hover:bg-gray-50">
                                    <i className="ri-arrow-left-s-line"></i>
                                </button>
                                {[...Array(totalPages)].map((_, index) => (
                                    <button key={index} onClick={() => handlePageChange(index + 1)} className={`w-10 h-10 rounded-full font-medium ${currentPage === index + 1 ? 'bg-primary text-white shadow-lg' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'}`}>
                                        {index + 1}
                                    </button>
                                ))}
                                <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="p-2 w-10 h-10 flex items-center justify-center bg-white border border-gray-300 rounded-full disabled:opacity-30 hover:bg-gray-50">
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