import React from 'react';
import { useFetchAllProductsQuery } from '../../../redux/features/products/productsApi'; 
import ProductCards from "../ProductCards"; 

const RelatedProducts = ({ category, currentProductId }) => {
    
    const { data, isLoading } = useFetchAllProductsQuery({
        category: category || '',
        limit: 10 
    });

    const allProducts = data?.products || [];

    const filteredProducts = allProducts.filter(p => p._id !== currentProductId).slice(0, 4);

    if (isLoading) return <div className="p-10 text-center text-xs uppercase font-bold text-slate-300 animate-pulse tracking-widest">Finding items you may like...</div>;

    if (filteredProducts.length === 0) return null;

    return (
        /* 🚀 mt-20 ko mt-10 kiya aur pt-16 ko pt-8 kiya taake space kam ho jaye */
        <div className="mt-2 border-t border-slate-100 pt-2 pb-20">
            <div className="mb-8 text-left px-4">
                <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Related Products</h3>
                <div className="w-12 h-1 bg-red-600 mt-2"></div>
            </div>

            <div className="px-4">
                <ProductCards products={filteredProducts} />
            </div>
        </div>
    );
};

export default RelatedProducts;