// import React, { useState } from 'react'

// const ShopFiltering = ({ filters, filtersState, setFiltersState, clearFilters }) => {
//     // Track rakhte hain ke kaunsi category open hai
//     const [openCategory, setOpenCategory] = useState('men'); 

//     const toggleMainCategory = (category) => {
//         setOpenCategory(openCategory === category ? null : category);
//     };

//     // Toggle logic function for category
//     const handleCategoryClick = (categoryValue) => {
//         // FIXED LOGIC: If 'all' is clicked, set category to '' to show all products.
//         // Otherwise, toggle the selected category.
//         let nextCategory;
//         if (categoryValue === 'all') {
//             nextCategory = '';
//             setOpenCategory(null);
//         } else {
//             nextCategory = filtersState.category === categoryValue ? '' : categoryValue;
//         }
        
//         setFiltersState({ ...filtersState, category: nextCategory });
//     };

//     return (
//         <div className="space-y-6 flex-shrink-0 w-full md:w-64 bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
//             <div className="flex items-center justify-between mb-2">
//                 <h3 className="text-xl font-bold text-gray-800">Shop Filters</h3>
//                 <button className="text-sm text-primary hover:underline font-medium" onClick={clearFilters}>
//                     Clear All
//                 </button>
//             </div>

//             {/* Categories Section */}
//             <div className="space-y-4">
//                 <h4 className='font-semibold text-gray-700 border-b pb-2'>Categories</h4>
                
//                 {/* 1. "All" Option - Logic Fixed to check for empty string */}
//                 <button 
//                     onClick={() => handleCategoryClick('all')}
//                     className={`flex items-center justify-between w-full p-2 rounded-lg transition-all ${
//                         filtersState.category === '' 
//                         ? 'bg-primary text-white shadow-md' 
//                         : 'bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-gray-700'
//                     }`}
//                 >
//                     <span className="capitalize font-bold">All Products</span>
//                     {filtersState.category === '' && <i className="ri-check-line"></i>}
//                 </button>

//                 {/* 2. Main Categories (Men, Women, Kids) */}
//                 {Object.keys(filters.categories).map((mainCat) => (
//                     <div key={mainCat} className="space-y-2">
//                         <button 
//                             onClick={() => toggleMainCategory(mainCat)}
//                             className={`flex items-center justify-between w-full p-2 rounded-lg transition-all ${
//                                 openCategory === mainCat ? 'bg-primary/10 text-primary' : 'hover:bg-gray-50 text-gray-700'
//                             }`}
//                         >
//                             <span className="capitalize font-bold">{mainCat}</span>
//                             <i className={`ri-arrow-${openCategory === mainCat ? 'up' : 'down'}-s-line`}></i>
//                         </button>

//                         {openCategory === mainCat && (
//                             <div className="ml-4 space-y-2 animate-fadeIn">
//                                 {filters.categories[mainCat].map((subCat) => (
//                                     <label key={subCat} className='flex items-center group cursor-pointer'>
//                                         <input
//                                             type="radio"
//                                             name="category"
//                                             value={subCat}
//                                             checked={filtersState.category === subCat}
//                                             onClick={() => handleCategoryClick(subCat)}
//                                             onChange={() => {}} 
//                                             className="hidden"
//                                         />
//                                         <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center transition-all ${
//                                             filtersState.category === subCat ? 'border-primary bg-primary' : 'border-gray-300 group-hover:border-primary'
//                                         }`}>
//                                             {filtersState.category === subCat && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
//                                         </div>
//                                         <span className={`capitalize text-sm transition-colors ${
//                                             filtersState.category === subCat ? 'text-primary font-semibold' : 'text-gray-500'
//                                         }`}>
//                                             {subCat}
//                                         </span>
//                                     </label>
//                                 ))}
//                             </div>
//                         )}
//                     </div>
//                 ))}
//             </div>

//             {/* Colors Section */}
//             <div className="pt-4 border-t border-gray-100">
//                 <h4 className='font-semibold text-gray-700 mb-3'>Color</h4>
//                 <div className="flex flex-wrap gap-2">
//                     {filters.colors.map(color => (
//                         <label key={color} className='cursor-pointer group' title={color}>
//                             <input 
//                                 type="radio" 
//                                 name="color" 
//                                 value={color} 
//                                 className="hidden" 
//                                 checked={filtersState.color === color}
//                                 onClick={() => {
//                                     const nextColor = filtersState.color === color ? '' : color;
//                                     setFiltersState({ ...filtersState, color: nextColor });
//                                 }}
//                                 onChange={() => {}} 
//                             />
//                             <div className={`w-7 h-7 rounded-full border-2 shadow-sm flex items-center justify-center transition-all ${
//                                 filtersState.color === color ? 'border-primary scale-110' : 'border-gray-200 hover:scale-105'
//                             }`} 
//                             style={{backgroundColor: color === 'all' ? '#e5e7eb' : color}}>
//                                 {filtersState.color === color && (
//                                     <i className={`ri-check-line text-xs ${color === 'white' || color === 'all' ? 'text-black' : 'text-white'}`}></i>
//                                 )}
//                                 {color === 'all' && filtersState.color !== 'all' && <span className="text-[8px] font-bold">ALL</span>}
//                             </div>
//                         </label>
//                     ))}
//                 </div>
//             </div>

//             {/* Price Range Section */}
//             <div className="pt-4 border-t border-gray-100">
//                 <h4 className='font-semibold text-gray-700 mb-3'>Price Range</h4>
//                 <div className="space-y-2">
//                     {filters.priceRanges.map((range) => {
//                         const rangeValue = `${range.min}-${range.max}`;
//                         return (
//                             <label key={range.label} className='flex items-center group cursor-pointer'>
//                                 <input
//                                     type="radio"
//                                     name="priceRange"
//                                     value={rangeValue}
//                                     checked={filtersState.priceRange === rangeValue}
//                                     onClick={() => {
//                                         const nextRange = filtersState.priceRange === rangeValue ? '' : rangeValue;
//                                         setFiltersState({ ...filtersState, priceRange: nextRange });
//                                     }}
//                                     onChange={() => {}}
//                                     className="hidden"
//                                 />
//                                 <div className={`w-5 h-5 rounded border-2 mr-3 flex items-center justify-center transition-all ${
//                                     filtersState.priceRange === rangeValue ? 'border-primary bg-primary' : 'border-gray-300 group-hover:border-primary'
//                                 }`}>
//                                     {filtersState.priceRange === rangeValue && <i className="ri-check-line text-white text-xs"></i>}
//                                 </div>
//                                 <span className={`text-sm transition-colors ${
//                                     filtersState.priceRange === rangeValue ? 'text-primary font-semibold' : 'text-gray-600'
//                                 }`}>
//                                     {range.label}
//                                 </span>
//                             </label>
//                         );
//                     })}
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default ShopFiltering;



import React, { useState } from 'react'

const ShopFiltering = ({ filters, filtersState, setFiltersState, clearFilters }) => {
    const [openCategory, setOpenCategory] = useState('men'); 

    const toggleMainCategory = (category) => {
        setOpenCategory(openCategory === category ? null : category);
    };

    const handleCategoryClick = (categoryValue) => {
        let nextCategory;
        if (categoryValue === 'all' || filtersState.category === categoryValue) {
            nextCategory = ''; 
        } else {
            nextCategory = categoryValue;
        }
        setFiltersState({ ...filtersState, category: nextCategory });
    };

    return (
        <div className="space-y-6 flex-shrink-0 w-full md:w-64 bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-bold text-gray-800">Shop Filters</h3>
                <button className="text-sm text-primary hover:underline font-medium" onClick={clearFilters}>
                    Clear All
                </button>
            </div>

            {/* Categories Section */}
            <div className="space-y-4">
                <h4 className='font-semibold text-gray-700 border-b pb-2'>Categories</h4>
                
                <button 
                    onClick={() => {
                        setFiltersState({ ...filtersState, category: '', mainCategory: '' });
                        setOpenCategory(null);
                    }}
                    className={`flex items-center justify-between w-full p-2 rounded-lg transition-all ${
                        (filtersState.category === '' && filtersState.mainCategory === '') 
                        ? 'bg-primary text-white shadow-md' 
                        : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                    }`}
                >
                    <span className="capitalize font-bold">All Products</span>
                    {(filtersState.category === '' && filtersState.mainCategory === '') && <i className="ri-check-line"></i>}
                </button>

                {Object.keys(filters.categories).map((mainCat) => (
                    <div key={mainCat} className="space-y-2">
                        <button 
                            onClick={() => {
                                toggleMainCategory(mainCat);
                                setFiltersState({...filtersState, mainCategory: mainCat, category: ''});
                            }}
                            className={`flex items-center justify-between w-full p-2 rounded-lg transition-all ${
                                filtersState.mainCategory === mainCat ? 'bg-primary/10 text-primary' : 'hover:bg-gray-50 text-gray-700'
                            }`}
                        >
                            <span className="capitalize font-bold">{mainCat}</span>
                            <i className={`ri-arrow-${openCategory === mainCat ? 'up' : 'down'}-s-line`}></i>
                        </button>

                        {openCategory === mainCat && (
                            <div className="ml-4 space-y-2 animate-fadeIn">
                                {filters.categories[mainCat].map((subCat) => (
                                    <label key={subCat} className='flex items-center group cursor-pointer'>
                                        <input
                                            type="radio"
                                            name="category"
                                            checked={filtersState.category === subCat}
                                            onChange={() => handleCategoryClick(subCat)}
                                            className="hidden"
                                        />
                                        <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center transition-all ${
                                            filtersState.category === subCat ? 'border-primary bg-primary' : 'border-gray-300 group-hover:border-primary'
                                        }`}>
                                            {filtersState.category === subCat && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                                        </div>
                                        <span className={`capitalize text-sm ${filtersState.category === subCat ? 'text-primary font-semibold' : 'text-gray-500'}`}>
                                            {subCat}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Colors Section */}
            <div className="pt-4 border-t border-gray-100">
                <h4 className='font-semibold text-gray-700 mb-3'>Color</h4>
                <div className="flex flex-wrap gap-2">
                    {filters.colors.map(color => (
                        <label key={color} className='cursor-pointer group'>
                            <input 
                                type="radio" 
                                name="color" 
                                checked={filtersState.color === color}
                                onChange={() => setFiltersState({ ...filtersState, color: color })}
                                className="hidden" 
                            />
                            <div className={`w-7 h-7 rounded-full border-2 shadow-sm flex items-center justify-center transition-all ${
                                filtersState.color === color ? 'border-primary scale-110' : 'border-gray-200 hover:scale-105'
                            }`} 
                            style={{backgroundColor: color === 'all' ? '#e5e7eb' : color}}>
                                {filtersState.color === color && (
                                    <i className={`ri-check-line text-xs ${color === 'white' || color === 'all' ? 'text-black' : 'text-white'}`}></i>
                                )}
                            </div>
                        </label>
                    ))}
                </div>
            </div>

            {/* Price Range Section - UPDATED WITH MANUAL LABELS */}
            <div className="pt-4 border-t border-gray-100">
                <h4 className='font-semibold text-gray-700 mb-3'>Price Range</h4>
                <div className="space-y-2">
                    {filters.priceRanges.map((range) => {
                        // ✅ Yahan hum label ko customize kar rahe hain
                        let displayLabel = range.label;
                        
                        // Check karein ke back-end se kya label aa raha hai aur usay badal dein
                        if (range.label === 'all') {
                            displayLabel = "All Prices";
                        } else if (range.label.includes('under') || range.label.includes('0-1000')) {
                            displayLabel = "Under Rs. 1000";
                        } else if (range.label.includes('1000-2000')) {
                            displayLabel = "Rs. 1000 - Rs. 2000";
                        } else if (range.label.includes('2000-3000')) {
                            displayLabel = "Rs. 2000 - Rs. 3000";
                        } else if (range.label.includes('above') || range.label.includes('3000-')) {
                            displayLabel = "Rs. 3000 & Above";
                        } else {
                            // Fallback: Agar koi match na ho to bas $ ko Rs. se replace kar do
                            displayLabel = range.label.replace(/\$/g, 'Rs. ');
                        }

                        return (
                            <label key={range.label} className='flex items-center group cursor-pointer'>
                                <input
                                    type="radio"
                                    name="priceRange"
                                    value={range.label}
                                    checked={filtersState.priceRange === range.label}
                                    onChange={() => setFiltersState({ ...filtersState, priceRange: range.label })}
                                    className="hidden"
                                />
                                <div className={`w-5 h-5 rounded border-2 mr-3 flex items-center justify-center transition-all ${
                                    filtersState.priceRange === range.label ? 'border-primary bg-primary' : 'border-gray-300 group-hover:border-primary'
                                }`}>
                                    {filtersState.priceRange === range.label && <i className="ri-check-line text-white text-xs"></i>}
                                </div>
                                <span className={`text-sm ${filtersState.priceRange === range.label ? 'text-primary font-semibold' : 'text-gray-600'}`}>
                                    {displayLabel}
                                </span>
                            </label>
                        );
                    })}
                </div>
            </div>
        </div>
    )
}

export default ShopFiltering;