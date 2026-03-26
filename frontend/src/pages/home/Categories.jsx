import React from 'react';
import { Link } from 'react-router-dom';
import category1 from "../../assets/category-1.jpg"
import category2 from "../../assets/category-2.jpg"
import category3 from "../../assets/category-3.jpg"
import category4 from "../../assets/category-4.jpg"

const Categories = () => {
    const categories = [
        // ✅ Name aur Path dono change kar diye hain (Mens Collection)
        { name: 'Mens Collection', path: 'men', image: category1 },
        { name: 'Dress Collection', path: 'dress', image: category2 },
        { name: 'Jewellery', path: 'jewellery', image: category3},
        { name: 'Cosmetics', path: 'cosmetics', image: category4 },
    ];

    return (
        <div className="product__grid"> 
            {categories.map((category) => (
                <Link
                    key={category.name}
                    to={`/categories/${category.path}`}
                    className="categories__card group"
                >
                    {/* Circle Size Fix: h-28 w-28 (Size fix hai taake picture adjust ho jaye) */}
                    <div className="w-28 h-28 mx-auto overflow-hidden rounded-full border-2 border-gray-100 group-hover:border-primary transition-all duration-300 shadow-sm">
                        <img 
                            src={category.image} 
                            alt={category.name} 
                            // Object-cover ensures picture fits inside circle
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                        />
                    </div>
                    <h4 className="mt-4 text-center font-medium group-hover:text-primary transition-colors">
                        {category.name}
                    </h4>
                </Link>
            ))}
        </div>
    );
};

export default Categories;