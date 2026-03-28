// import React, { useEffect, useState } from 'react';
// import { useSelector } from 'react-redux';
// import { useParams, useNavigate } from 'react-router-dom';
// import TextInput from '../addProduct/TextInput';
// import UploadImage from '../addProduct/UploadImage';
// import SelectInput from '../addProduct/SelectInput';
// import { useFetchProductByIdQuery, useUpdateProductMutation } from '../../../../redux/features/products/productsApi';

// //  Dynamic Categories Structure (Same as AddProduct)
// const categoryData = {
//     men: ['shirts', 'jeans', 'watches', 'shoes', 'jackets', 't-shirts', 'belts', 'wallets', 'suits', 'shorts'],
//     women: ['dress', 'jewellery', 'cosmetics', 'handbags', 'heels', 'tops', 'skirts', 'scarves', 'sunglasses', 'lingerie'],
//     kids: ['toys', 'baby suit', 'school bags', 'pajamas', 'sneakers', 'hats', 'socks', 'raincoats', 'gloves', 'diapers']
// };

// const colors = [
//     { label: 'Select Color', value: '' },
//     { label: 'Black', value: 'black' },
//     { label: 'Red', value: 'red' },
//     { label: 'Gold', value: 'gold' },
//     { label: 'Blue', value: 'blue' },
//     { label: 'Silver', value: 'silver' },
//     { label: 'Beige', value: 'beige' },
//     { label: 'Green', value: 'green' }
// ];

// const UpdateProduct = () => {
//     const { id } = useParams();
//     const navigate = useNavigate();
//     const { user } = useSelector((state) => state.auth);

//     const [product, setProduct] = useState({
//         name: '',
//         category: '',
//         color: '',
//         price: '',
//         description: '',
//         image: [] // Updated to Array for multi-images
//     });

//     //  New Category States
//     const [mainCategory, setMainCategory] = useState('');
//     const [subCategories, setSubCategories] = useState([]);
//     const [newImage, setNewImage] = useState(null);

//     const { data: productData, isLoading: isProductLoading, error: fetchError, refetch } = useFetchProductByIdQuery(id);
//     const [updateProduct, { isLoading: isUpdating, error: updateError }] = useUpdateProductMutation();

//     //  Effect to fill form with existing data
//     useEffect(() => {
//         if (productData?.product) {
//             const p = productData.product;
//             setProduct({
//                 name: p.name || '',
//                 category: p.category || '',
//                 color: p.color || '',
//                 price: p.price || '',
//                 description: p.description || '',
//                 image: p.image || []
//             });

//             // Find main category based on sub-category
//             for (const main in categoryData) {
//                 if (categoryData[main].includes(p.category)) {
//                     setMainCategory(main);
//                     setSubCategories(categoryData[main]);
//                     break;
//                 }
//             }
//         }
//     }, [productData]);

//     // Handle Main Category Change
//     const handleMainCategoryChange = (e) => {
//         const selectedMain = e.target.value;
//         setMainCategory(selectedMain);
//         setProduct({ ...product, category: '' }); // Reset sub-category
//         setSubCategories(categoryData[selectedMain] || []);
//     };

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setProduct({ ...product, [name]: value });
//     };

//     const handleImageChange = (images) => {
//         setNewImage(images); // Multi-image array from UploadImage
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         const updatedProduct = {
//             ...product,
//             image: newImage ? newImage : product.image, 
//             author: user?._id
//         };

//         try {
//             await updateProduct({ id: id, ...updatedProduct }).unwrap();
//             alert('Product updated successfully!');
//             await refetch();
//             navigate("/dashboard/manage-products");
//         } catch (err) {
//             console.error('Failed to update product:', err);
//         }
//     };

//     if (isProductLoading) return <p className="p-10 text-center">Loading product...</p>;
//     if (fetchError) return <p className="text-red-500 p-10">Error fetching product.</p>;

//     return (
//         <div className="container mx-auto mt-8 px-4">
//             <h2 className="text-2xl font-bold mb-6">Update Product</h2>
//             <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-sm border">
                
//                 <TextInput
//                     label="Product Name"
//                     name="name"
//                     value={product.name}
//                     onChange={handleChange}
//                     placeholder="Product name"
//                 />

//                 {/*  Main Category Dropdown */}
//                 <div className="space-y-1">
//                     <label className="block text-sm font-medium text-gray-700">Main Category</label>
//                     <select
//                         value={mainCategory}
//                         onChange={handleMainCategoryChange}
//                         className="add-product-InputCSS"
//                     >
//                         <option value="">Select Main Category</option>
//                         <option value="men">Men</option>
//                         <option value="women">Women</option>
//                         <option value="kids">Kids</option>
//                     </select>
//                 </div>

//                 {/*  Sub Category Dropdown */}
//                 <SelectInput
//                     label="Sub Category"
//                     name="category"
//                     value={product.category}
//                     onChange={handleChange}
//                     options={[
//                         { label: 'Select Sub Category', value: '' },
//                         ...subCategories.map(sub => ({ label: sub.charAt(0).toUpperCase() + sub.slice(1), value: sub }))
//                     ]}
//                 />

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <SelectInput
//                         label="Color"
//                         name="color"
//                         value={product.color}
//                         onChange={handleChange}
//                         options={colors}
//                     />
//                     <TextInput
//                         label="Price"
//                         name="price"
//                         type="number"
//                         value={product.price}
//                         onChange={handleChange}
//                     />
//                 </div>

//                 <UploadImage
//                     name="image"
//                     id="image"
//                     value={newImage || product.image} 
//                     setImage={handleImageChange} 
//                     placeholder='Upload product images'
//                 />

//                 <div>
//                     <label className="block text-sm font-medium text-gray-700">Description</label>
//                     <textarea
//                         rows={6}
//                         name="description"
//                         value={product.description}
//                         onChange={handleChange}
//                         className="add-product-InputCSS"
//                         placeholder='Product description...'
//                     />
//                 </div>

//                 <button
//                     type="submit"
//                     className="add-product-btn w-full"
//                     disabled={isUpdating}
//                 >
//                     {isUpdating ? 'Updating...' : 'Update Product'}
//                 </button>
//             </form>
//         </div>
//     );
// };

// export default UpdateProduct;





import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import Select from 'react-select'; 
import TextInput from '../addProduct/TextInput';
import UploadImage from '../addProduct/UploadImage';
import SelectInput from '../addProduct/SelectInput';
import { useFetchProductByIdQuery, useUpdateProductMutation } from '../../../../redux/features/products/productsApi';

const categoryData = {
    men: ['shirts', 'pants', 'watches', 'shoes', 'jackets'],
    women: ['dress', 'jewellery', 'cosmetics', 'handbags', 'shirts','jackets'],
    kids: ['kids suits', 't-shirts', 'shoes', 'pants', 'jackets']
};

const sizeOptionsData = {
    clothing: [
        { value: 'S', label: 'Small' }, { value: 'M', label: 'Medium' },
        { value: 'L', label: 'Large' }, { value: 'XL', label: 'Extra Large' },
        { value: 'XXL', label: 'Double XL' }
    ],
    pantsAdult: [
        { value: '28', label: '28 Waist' }, { value: '30', label: '30 Waist' },
        { value: '32', label: '32 Waist' }, { value: '34', label: '34 Waist' },
        { value: '36', label: '36 Waist' }, { value: '38', label: '38 Waist' },
    ],
    kidsSizes: [
        { value: '2-3Y', label: '2-3 Years' }, { value: '4-5Y', label: '4-5 Years' },
        { value: '6-7Y', label: '6-7 Years' }, { value: '8-9Y', label: '8-9 Years' },
        { value: '10-12Y', label: '10-12 Years' },
    ],
    footwear: [
        { value: '6', label: 'Size 6' }, { value: '7', label: 'Size 7' },
        { value: '8', label: 'Size 8' }, { value: '9', label: 'Size 9' },
        { value: '10', label: 'Size 10' },{ value: '11', label: 'Size 11' },
    ],
    default: []
};

// ✅ SAARE COLORS WAPIS ADD KAR DIYE HIN
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
    { value: 'pink', label: 'Pink' },
    { value: 'beige', label: 'Beige' },
    { value: 'gray', label: 'Gray' },
    { value: 'brown', label: 'Brown' }
];

const UpdateProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);

    const [product, setProduct] = useState({
        name: '', category: '', color: [], size: [], 
        price: '', stock: '', description: '', image: []
    });

    const [mainCategory, setMainCategory] = useState('');
    const [subCategories, setSubCategories] = useState([]);
    const [availableSizeOptions, setAvailableSizeOptions] = useState([]);
    const [newImage, setNewImage] = useState(null);

    const { data: productData, isLoading: isProductLoading, refetch } = useFetchProductByIdQuery(id);
    const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

    useEffect(() => {
        if (productData?.product) {
            const p = productData.product;
            const initialCategory = p.category || '';
            
            setProduct({
                name: p.name || '',
                category: initialCategory,
                color: Array.isArray(p.color) ? p.color : [], 
                size: Array.isArray(p.size) ? p.size : [],
                price: p.price || '',
                stock: p.stock || '', 
                description: p.description || '',
                image: p.image || []
            });

            for (const main in categoryData) {
                if (categoryData[main].includes(initialCategory.toLowerCase())) {
                    setMainCategory(main);
                    setSubCategories(categoryData[main]);
                    break;
                }
            }
        }
    }, [productData]);

    useEffect(() => {
        if (!product.category) {
            setAvailableSizeOptions([]);
            return;
        }
        const subCat = product.category.toLowerCase().trim();
        const mCat = mainCategory.toLowerCase();

        if (['shoes'].includes(subCat)) {
            setAvailableSizeOptions(sizeOptionsData.footwear);
        } else if (mCat === 'kids') {
            setAvailableSizeOptions(sizeOptionsData.kidsSizes);
        } else if (subCat === 'pants' && (mCat === 'men' || mCat === 'women')) {
            setAvailableSizeOptions(sizeOptionsData.pantsAdult);
        } else if (['shirts', 't-shirts', 'dress', 'jackets', 'kids suits', 'kids suit'].includes(subCat)) {
            setAvailableSizeOptions(sizeOptionsData.clothing);
        } else {
            setAvailableSizeOptions([]);
        }
    }, [product.category, mainCategory]);

    const handleMainCategoryChange = (e) => {
        const selectedMain = e.target.value;
        setMainCategory(selectedMain);
        setProduct(prev => ({ ...prev, category: '', size: [] }));
        setSubCategories(categoryData[selectedMain] || []);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct(prev => ({ ...prev, [name]: value }));
    };

    const handleColorChange = (selected) => {
        setProduct(prev => ({ ...prev, color: selected ? selected.map(opt => opt.value) : [] }));
    };

    const handleSizeChange = (selected) => {
        setProduct(prev => ({ ...prev, size: selected ? selected.map(opt => opt.value) : [] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const updatedProduct = {
            ...product,
            image: newImage ? newImage : product.image, 
            author: user?._id
        };

        try {
            await updateProduct({ id: id, ...updatedProduct }).unwrap();
            alert('Product updated successfully!');
            await refetch();
            navigate("/dashboard/manage-products");
        } catch (err) { console.error(err); }
    };

    const customSelectStyles = {
        control: (base) => ({
            ...base,
            border: '1px solid #d1d5db',
            borderRadius: '0.375rem',
            padding: '2px',
            boxShadow: 'none',
            '&:hover': { border: '1px solid #6366f1' }
        })
    };

    if (isProductLoading) return <p className="p-10 text-center font-bold">Loading Data...</p>;

    return (
        <div className="container mx-auto mt-8 px-4">
            <h2 className="text-2xl font-black mb-6 uppercase tracking-tighter">Update <span className="text-indigo-600">Inventory</span></h2>
            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                
                <TextInput label="Product Name" name="name" value={product.name} onChange={handleChange} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="block text-sm font-bold text-gray-700">Main Category</label>
                        <select 
                            value={mainCategory} 
                            onChange={handleMainCategoryChange} 
                            className="w-full p-2.5 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                        >
                            <option value="">Select Group</option>
                            <option value="men">Men</option>
                            <option value="women">Women</option>
                            <option value="kids">Kids</option>
                        </select>
                    </div>
                    <SelectInput
                        label="Sub Category"
                        name="category"
                        value={product.category}
                        onChange={handleChange}
                        options={subCategories.map(sub => ({ label: sub.toUpperCase(), value: sub }))}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                        <label className="block text-sm font-bold text-gray-700">Available Colors</label>
                        <Select
                            isMulti
                            options={colorOptions}
                            styles={customSelectStyles}
                            value={colorOptions.filter(opt => product.color.includes(opt.value))}
                            onChange={handleColorChange}
                            placeholder="Select colors..."
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="block text-sm font-bold text-gray-700">Available Sizes</label>
                        <Select
                            isMulti
                            key={`sz-upd-${mainCategory}-${product.category}`}
                            options={availableSizeOptions}
                            styles={customSelectStyles}
                            value={availableSizeOptions.filter(opt => product.size.includes(opt.value))}
                            onChange={handleSizeChange}
                            placeholder={availableSizeOptions.length === 0 ? "Select sub-category first" : "Choose sizes"}
                            isDisabled={availableSizeOptions.length === 0}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-5 rounded-xl border border-gray-200">
                    <TextInput label="Price ($)" name="price" type="number" value={product.price} onChange={handleChange} />
                    <TextInput label="Update Stock" name="stock" type="number" value={product.stock} onChange={handleChange} />
                    <div className="flex flex-col">
                        <label className="block text-sm font-bold text-gray-700 mb-1">Product Image</label>
                        <UploadImage setImage={setNewImage} />
                    </div>
                </div>

                <textarea 
                    rows={4} 
                    name="description" 
                    value={product.description} 
                    onChange={handleChange} 
                    className="w-full p-4 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all" 
                    placeholder="Describe the product material, fit, and style..."
                />

                <button type="submit" className="w-full bg-gray-900 text-white py-4 rounded-xl font-black uppercase tracking-widest hover:bg-indigo-600 shadow-xl transition-all" disabled={isUpdating}>
                    {isUpdating ? 'Saving Changes...' : 'Save Product Updates'}
                </button>
            </form>
        </div>
    );
};

export default UpdateProduct;