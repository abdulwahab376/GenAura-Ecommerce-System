import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ProductCards from '../shop/ProductCards';
import { useFetchAllProductsQuery } from '../../redux/features/products/productsApi';

const CategoryPage = () => {
    const { categoryName } = useParams(); // URL se 'men', 'dress', etc milega
    
    // ✅ CONDITION: Agar click 'men' par hua hai to mainCategory use karo
    // Baqi sab (dress, jewellery) ke liye purana 'category' filter hi chalega
    const queryParams = {
        category: categoryName === 'men' ? '' : categoryName,
        mainCategory: categoryName === 'men' ? 'men' : '',
        limit: 100 
    };

    const { data, error, isLoading } = useFetchAllProductsQuery(queryParams);

    // Data handling safety
    const products = data?.products || data || [];

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [categoryName]);

    if (isLoading) return <div className="p-10 text-center font-bold text-primary">Loading...</div>;
    if (error) return <div className="p-10 text-red-500 text-center">Error fetching products.</div>;

    return (
        <>
            <section className='section__container bg-primary-light text-center'>
                <h2 className="section__header capitalize">{categoryName} Collection</h2>
                <p className="section__subheader">
                    Browse our premium {categoryName} items.
                </p>
            </section>

            <div className='section__container'>
                {products.length > 0 ? (
                    <ProductCards products={products} />
                ) : (
                    <div className="text-center py-20 bg-gray-50 rounded-lg">
                        <p className="text-gray-500 font-medium">
                            No products found in "{categoryName}".
                        </p>
                    </div>
                )}
            </div>
        </>
    );
};

export default CategoryPage;