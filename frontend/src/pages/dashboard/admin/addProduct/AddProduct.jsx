// import React, { useState, useEffect } from 'react';
// import { useSelector } from 'react-redux';
// import { useAddProductMutation } from '../../../../redux/features/products/productsApi';
// import Select from 'react-select'; 
// import TextInput from './TextInput';
// import SelectInput from './SelectInput';
// import UploadImage from './UploadImage';
// import { useNavigate } from 'react-router-dom';

// // Categories Data
// const categoryData = {
//     men: ['shirts', 'jeans', 'watches', 'shoes', 'jackets', 't-shirts', 'belts', 'wallets', 'suits', 'shorts'],
//     women: ['dress', 'jewellery', 'cosmetics', 'handbags', 'heels', 'tops', 'skirts', 'scarves', 'sunglasses', 'lingerie'],
//     kids: ['toys', 'baby suit', 'school bags', 'pajamas', 'sneakers', 'hats', 'socks', 'raincoats', 'gloves', 'diapers']
// };

// // Dynamic Sizes based on category type
// const sizeOptionsData = {
//     clothing: [
//         { value: 'S', label: 'Small' },
//         { value: 'M', label: 'Medium' },
//         { value: 'L', label: 'Large' },
//         { value: 'XL', label: 'Extra Large' },
//         { value: 'XXL', label: 'Double XL' }
//     ],
//     footwear: [
//         { value: '6', label: 'Size 6' },
//         { value: '7', label: 'Size 7' },
//         { value: '8', label: 'Size 8' },
//         { value: '9', label: 'Size 9' },
//         { value: '10', label: 'Size 10' },
//         { value: '11', label: 'Size 11' }
//     ],
//     default: [] 
// };

// const colorOptions = [
//     { value: 'black', label: 'Black' },
//     { value: 'red', label: 'Red' },
//     { value: 'blue', label: 'Blue' },
//     { value: 'white', label: 'White' },
//     { value: 'gold', label: 'Gold' },
//     { value: 'silver', label: 'Silver' },
//     { value: 'green', label: 'Green' }
// ];

// const AddProduct = () => {
//     const { user } = useSelector((state) => state.auth);
//     const navigate = useNavigate();
//     const [addProduct, { isLoading }] = useAddProductMutation();

//     const [product, setProduct] = useState({
//         name: '',
//         mainCategory: '',
//         category: '',
//         color: [], 
//         size: [],  
//         price: '',
//         stock: '', //  Added Stock State
//         description: ''
//     });

//     const [image, setImage] = useState('');
//     const [subCategories, setSubCategories] = useState([]);
//     const [availableSizeOptions, setAvailableSizeOptions] = useState([]);

//     // Category Change Logic
//     useEffect(() => {
//         if (product.mainCategory && categoryData[product.mainCategory]) {
//             const options = categoryData[product.mainCategory].map(cat => ({
//                 label: cat.charAt(0).toUpperCase() + cat.slice(1),
//                 value: cat
//             }));
//             setSubCategories([{ label: `Select ${product.mainCategory} item`, value: '' }, ...options]);
//         }
//     }, [product.mainCategory]);

//     // Size Logic
//     useEffect(() => {
//         const subCat = product.category.toLowerCase();
//         if (['shoes', 'sneakers', 'heels'].includes(subCat)) {
//             setAvailableSizeOptions(sizeOptionsData.footwear);
//         } else if (['shirts', 't-shirts', 'dress', 'jackets', 'pajamas', 'suits'].includes(subCat)) {
//             setAvailableSizeOptions(sizeOptionsData.clothing);
//         } else {
//             setAvailableSizeOptions([]);
//         }
//     }, [product.category]);

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setProduct({ ...product, [name]: value });
//     };

//     const handleColorChange = (selectedOptions) => {
//         setProduct({ ...product, color: selectedOptions ? selectedOptions.map(opt => opt.value) : [] });
//     };

//     const handleSizeChange = (selectedOptions) => {
//         setProduct({ ...product, size: selectedOptions ? selectedOptions.map(opt => opt.value) : [] });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             //  Sending stock along with other product details
//             await addProduct({ ...product, image, author: user?._id }).unwrap();
//             alert('Product added successfully!');
//             navigate("/shop");
//         } catch (err) { 
//             console.error(err); 
//             alert('Failed to add product. Check console for details.');
//         }
//     };

//     const customSelectStyles = {
//         control: (base) => ({
//             ...base,
//             padding: '2px',
//             borderRadius: '0.375rem',
//             border: '1px solid #d1d5db',
//             boxShadow: 'none',
//             '&:hover': { border: '1px solid #3b82f6' }
//         })
//     };

//     return (
//         <div className="container mx-auto mt-8 p-6 bg-white shadow-md rounded-lg border">
//             <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2 tracking-tight uppercase">
//                 Add New Product <span className="text-indigo-600">(Lebaba Inventory)</span>
//             </h2>
            
//             <form onSubmit={handleSubmit} className="space-y-6">
                
//                 <TextInput label="Product Name" name="name" value={product.name} onChange={handleChange} placeholder="Ex: Signature Classic Polo" />

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <SelectInput
//                         label="Main Category"
//                         name="mainCategory"
//                         value={product.mainCategory}
//                         onChange={handleChange}
//                         options={[
//                             { label: 'Select Group', value: '' },
//                             { label: 'Men', value: 'men' },
//                             { label: 'Women', value: 'women' },
//                             { label: 'Kids', value: 'kids' }
//                         ]}
//                     />
//                     <SelectInput label="Sub Category" name="category" value={product.category} onChange={handleChange} options={subCategories} />
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <div className="space-y-1">
//                         <label className="block text-sm font-bold text-slate-700">Select Colors</label>
//                         <Select
//                             isMulti
//                             options={colorOptions}
//                             styles={customSelectStyles}
//                             onChange={handleColorChange}
//                             placeholder="Choose colors..."
//                         />
//                     </div>

//                     <div className="space-y-1">
//                         <label className="block text-sm font-bold text-slate-700">Select Sizes</label>
//                         <Select
//                             isMulti
//                             options={availableSizeOptions}
//                             styles={customSelectStyles}
//                             onChange={handleSizeChange}
//                             placeholder={availableSizeOptions.length > 0 ? "Choose sizes..." : "N/A"}
//                             isDisabled={availableSizeOptions.length === 0}
//                         />
//                     </div>
//                 </div>

//                 {/* Updated Row: Price, Stock, and Image Upload */}
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-dashed border-slate-200">
//                     <TextInput label="Price ($)" name="price" type="number" value={product.price} onChange={handleChange} placeholder="99.99" />
                    
//                     {/*  New Stock Input Field */}
//                     <TextInput 
//                         label="Initial Stock" 
//                         name="stock" 
//                         type="number" 
//                         value={product.stock} 
//                         onChange={handleChange} 
//                         placeholder="Ex: 50" 
//                     />

//                     <div className="flex flex-col">
//                         <label className="block text-sm font-bold text-slate-700 mb-1">Product Image</label>
//                         <UploadImage name="image" id="image" setImage={setImage} />
//                     </div>
//                 </div>

//                 <div>
//                     <label className="block text-sm font-bold text-slate-700 mb-1 text-uppercase tracking-wider">Product Description</label>
//                     <textarea 
//                         rows={4} 
//                         name="description" 
//                         value={product.description} 
//                         onChange={handleChange} 
//                         className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all" 
//                         placeholder='Detail characteristics, fabric type, etc...' 
//                     />
//                 </div>

//                 <button 
//                     type="submit" 
//                     className={`w-full py-4 rounded-xl font-black uppercase tracking-widest text-white transition-all shadow-lg ${isLoading ? 'bg-slate-400' : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-200'}`} 
//                     disabled={isLoading}
//                 >
//                     {isLoading ? 'Processing...' : 'Add Product'}
//                 </button>
//             </form>
//         </div>
//     );
// };

// export default AddProduct;




import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useAddProductMutation } from '../../../../redux/features/products/productsApi';
import Select from 'react-select'; 
import TextInput from './TextInput';
import SelectInput from './SelectInput';
import UploadImage from './UploadImage';
import { useNavigate } from 'react-router-dom';

const categoryData = {
    men: ['pants', 'shirts', 'shoes', 'watches', 'jackets'],
    women: ['dress', 'jewelry', 'cosmetics', 'shirts', 'handbags', 'jackets'],
    kids: ['kids suits', 't-shirts', 'shoes', 'pants', 'jackets']
};

const sizeOptionsData = {
    clothing: [
        { value: 'S', label: 'Small' },
        { value: 'M', label: 'Medium' },
        { value: 'L', label: 'Large' },
        { value: 'XL', label: 'Extra Large' },
        { value: 'XXL', label: 'Double XL' }
    ],
    pantsAdult: [
        { value: '28', label: '28 Waist' },
        { value: '30', label: '30 Waist' },
        { value: '32', label: '32 Waist' },
        { value: '34', label: '34 Waist' },
        { value: '36', label: '36 Waist' },
        { value: '38', label: '38 Waist' },
    ],
    kidsSizes: [
        { value: '2-3Y', label: '2-3 Years' },
        { value: '4-5Y', label: '4-5 Years' },
        { value: '6-7Y', label: '6-7 Years' },
        { value: '8-9Y', label: '8-9 Years' },
        { value: '10-12Y', label: '10-12 Years' },
    ],
    footwear: [
        { value: '6', label: 'Size 6' },
        { value: '7', label: 'Size 7' },
        { value: '8', label: 'Size 8' },
        { value: '9', label: 'Size 9' },
        { value: '10', label: 'Size 10' }
    ],
    default: [] 
};

// ✅ SAARE COLORS WAPIS ADD KAR DIYE HAIN
const colorOptions = [
    { value: 'black', label: 'Black' },
    { value: 'red', label: 'Red' },
    { value: 'blue', label: 'Blue' },
    { value: 'white', label: 'White' },
    { value: 'gold', label: 'Gold' },
    { value: 'silver', label: 'Silver' },
    { value: 'green', label: 'Green' },
    { value: 'purple', label: 'Purple' },
    { value: 'orange', label: 'Orange' },
    { value: 'beige', label: 'Beige' },
    { value: 'pink', label: 'Pink' },
    { value: 'gray', label: 'Gray' },
    { value: 'brown', label: 'Brown' },
];

const AddProduct = () => {
    const { user } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const [addProduct, { isLoading }] = useAddProductMutation();

    const [product, setProduct] = useState({
        name: '', mainCategory: '', category: '',
        color: [], size: [], price: '', stock: '', description: ''
    });

    const [image, setImage] = useState('');
    const [subCategories, setSubCategories] = useState([]);
    const [availableSizeOptions, setAvailableSizeOptions] = useState([]);

    useEffect(() => {
        if (product.mainCategory && categoryData[product.mainCategory]) {
            const options = categoryData[product.mainCategory].map(cat => ({
                label: cat.charAt(0).toUpperCase() + cat.slice(1),
                value: cat
            }));
            setSubCategories([{ label: `Select ${product.mainCategory} item`, value: '' }, ...options]);
        }
    }, [product.mainCategory]);

    useEffect(() => {
        const subCat = product.category.toLowerCase().trim();
        const mainCat = product.mainCategory.toLowerCase();

        if (['shoes'].includes(subCat)) {
            setAvailableSizeOptions(sizeOptionsData.footwear);
        } 
        else if (mainCat === 'kids') {
            setAvailableSizeOptions(sizeOptionsData.kidsSizes);
        }
        else if (subCat === 'pants' && (mainCat === 'men' || mainCat === 'women')) {
            setAvailableSizeOptions(sizeOptionsData.pantsAdult);
        }
        else if (['shirts', 't-shirts', 'dress', 'jackets', 'kids suits', 'kids suit'].includes(subCat)) {
            setAvailableSizeOptions(sizeOptionsData.clothing);
        } else {
            setAvailableSizeOptions([]);
        }
    }, [product.category, product.mainCategory]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct({ ...product, [name]: value });
    };

    const handleColorChange = (selectedOptions) => {
        setProduct({ ...product, color: selectedOptions ? selectedOptions.map(opt => opt.value) : [] });
    };

    const handleSizeChange = (selectedOptions) => {
        setProduct({ ...product, size: selectedOptions ? selectedOptions.map(opt => opt.value) : [] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await addProduct({ ...product, image, author: user?._id }).unwrap();
            alert('Product added successfully!');
            navigate("/shop");
        } catch (err) { 
            alert('Failed to add product.');
        }
    };

    const customSelectStyles = {
        control: (base) => ({
            ...base,
            padding: '2px',
            borderRadius: '0.375rem',
            border: '1px solid #d1d5db',
            boxShadow: 'none',
            '&:hover': { border: '1px solid #3b82f6' }
        })
    };

    return (
        <div className="container mx-auto mt-8 p-6 bg-white shadow-md rounded-lg border">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2 uppercase tracking-tight">
                Add New Product <span className="text-indigo-600">(Lebaba Inventory)</span>
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                <TextInput label="Product Name" name="name" value={product.name} onChange={handleChange} placeholder="Ex: Cotton Chinos" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <SelectInput
                        label="Main Category"
                        name="mainCategory"
                        value={product.mainCategory}
                        onChange={handleChange}
                        options={[
                            { label: 'Select Group', value: '' },
                            { label: 'Men', value: 'men' },
                            { label: 'Women', value: 'women' },
                            { label: 'Kids', value: 'kids' }
                        ]}
                    />
                    <SelectInput label="Sub Category" name="category" value={product.category} onChange={handleChange} options={subCategories} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                        <label className="block text-sm font-bold text-slate-700">Colors</label>
                        <Select
                            isMulti
                            options={colorOptions}
                            styles={customSelectStyles}
                            onChange={handleColorChange}
                            placeholder="Select colors..."
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="block text-sm font-bold text-slate-700">Sizes</label>
                        <Select
                            key={`size-add-${product.mainCategory}-${product.category}`}
                            isMulti
                            options={availableSizeOptions}
                            styles={customSelectStyles}
                            onChange={handleSizeChange}
                            placeholder={availableSizeOptions.length > 0 ? "Choose sizes..." : "Select category first"}
                            isDisabled={availableSizeOptions.length === 0}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-dashed border-slate-200">
                    <TextInput label="Price ($)" name="price" type="number" value={product.price} onChange={handleChange} placeholder="99.99" />
                    <TextInput label="Initial Stock" name="stock" type="number" value={product.stock} onChange={handleChange} placeholder="50" />
                    <div className="flex flex-col">
                        <label className="block text-sm font-bold text-slate-700 mb-1"></label>
                        <UploadImage name="image" id="image" setImage={setImage} />
                    </div>
                </div>

                <textarea 
                    rows={4} 
                    name="description" 
                    value={product.description} 
                    onChange={handleChange} 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
                    placeholder="Product details..." 
                />

                <button 
                    type="submit" 
                    className={`w-full py-4 rounded-xl font-black uppercase tracking-widest text-white transition-all shadow-lg ${isLoading ? 'bg-slate-400' : 'bg-indigo-600 hover:bg-indigo-700'}`} 
                    disabled={isLoading}
                >
                    {isLoading ? 'Processing...' : 'Add Product'}
                </button>
            </form>
        </div>
    );
};

export default AddProduct;