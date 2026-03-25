import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ProductCards from '../shop/ProductCards';
// JSON file ki jagah apni Redux API use karein
import { useFetchAllProductsQuery } from '../../redux/features/products/productsApi';

const CategoryPage = () => {
    const { categoryName } = useParams();
    
    // Database se products mangwaein filter ke saath
    const { data: { products = [] } = {}, error, isLoading } = useFetchAllProductsQuery({
        category: categoryName,
        limit: 100 // taake saari products aa jayein
    });

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [categoryName]);

    if (isLoading) return <div className="p-10 text-center font-bold text-indigo-600">Loading Products...</div>;
    if (error) return <div className="p-10 text-red-500 text-center">Error fetching products: {error.message}</div>;

    return (
        <>
            <section className='section__container bg-primary-light'>
                <h2 className="section__header capitalize">{categoryName}</h2>
                <p className="section__subheader">
                    Browse a diverse range of categories, from chic dresses to versatile accessories. Elevate your style today!
                </p>
            </section>

            {/* products card */}
            <div className='section__container'>
                {products.length > 0 ? (
                    <ProductCards products={products} />
                ) : (
                    <div className="text-center py-10 text-gray-500">
                        No products found in "{categoryName}" category.
                    </div>
                )}
            </div>
        </>
    );
};

export default CategoryPage;