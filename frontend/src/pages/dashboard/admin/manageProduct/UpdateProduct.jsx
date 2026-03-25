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
    men: ['shirts', 'jeans', 'watches', 'shoes', 'jackets', 't-shirts', 'belts', 'wallets', 'suits', 'shorts'],
    women: ['dress', 'jewellery', 'cosmetics', 'handbags', 'heels', 'tops', 'skirts', 'scarves', 'sunglasses', 'lingerie'],
    kids: ['toys', 'baby suit', 'school bags', 'pajamas', 'sneakers', 'hats', 'socks', 'raincoats', 'gloves', 'diapers']
};

const sizeOptionsData = {
    clothing: [
        { value: 'S', label: 'Small' }, { value: 'M', label: 'Medium' },
        { value: 'L', label: 'Large' }, { value: 'XL', label: 'Extra Large' },
        { value: 'XXL', label: 'Double XL' }
    ],
    footwear: [
        { value: '6', label: 'Size 6' }, { value: '7', label: 'Size 7' },
        { value: '8', label: 'Size 8' }, { value: '9', label: 'Size 9' },
        { value: '10', label: 'Size 10' }
    ],
    default: []
};

const colorOptions = [
    { value: 'black', label: 'Black' }, { value: 'red', label: 'Red' },
    { value: 'blue', label: 'Blue' }, { value: 'white', label: 'White' },
    { value: 'gold', label: 'Gold' }, { value: 'silver', label: 'Silver' },
    { value: 'green', label: 'Green' }
];

const UpdateProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);

    const [product, setProduct] = useState({
        name: '',
        category: '',
        color: [], 
        size: [],  
        price: '',
        stock: '', //  Added Stock State
        description: '',
        image: []
    });

    const [mainCategory, setMainCategory] = useState('');
    const [subCategories, setSubCategories] = useState([]);
    const [availableSizeOptions, setAvailableSizeOptions] = useState([]);
    const [newImage, setNewImage] = useState(null);

    const { data: productData, isLoading: isProductLoading, error: fetchError, refetch } = useFetchProductByIdQuery(id);
    const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

    //  Load existing product data including stock
    useEffect(() => {
        if (productData?.product) {
            const p = productData.product;
            setProduct({
                name: p.name || '',
                category: p.category || '',
                color: Array.isArray(p.color) ? p.color : [], 
                size: Array.isArray(p.size) ? p.size : [],
                price: p.price || '',
                stock: p.stock || '', //  Setting initial stock value
                description: p.description || '',
                image: p.image || []
            });

            for (const main in categoryData) {
                if (categoryData[main].includes(p.category)) {
                    setMainCategory(main);
                    setSubCategories(categoryData[main]);
                    break;
                }
            }
        }
    }, [productData]);

    useEffect(() => {
        const subCat = product.category.toLowerCase();
        if (['shoes', 'sneakers', 'heels'].includes(subCat)) {
            setAvailableSizeOptions(sizeOptionsData.footwear);
        } else if (['shirts', 't-shirts', 'dress', 'jackets', 'suits'].includes(subCat)) {
            setAvailableSizeOptions(sizeOptionsData.clothing);
        } else {
            setAvailableSizeOptions([]);
        }
    }, [product.category]);

    const handleMainCategoryChange = (e) => {
        const selectedMain = e.target.value;
        setMainCategory(selectedMain);
        setProduct({ ...product, category: '' });
        setSubCategories(categoryData[selectedMain] || []);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct({ ...product, [name]: value });
    };

    const handleColorChange = (selected) => {
        setProduct({ ...product, color: selected ? selected.map(opt => opt.value) : [] });
    };

    const handleSizeChange = (selected) => {
        setProduct({ ...product, size: selected ? selected.map(opt => opt.value) : [] });
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
            padding: '2px'
        })
    };

    if (isProductLoading) return <p className="p-10 text-center">Loading...</p>;

    return (
        <div className="container mx-auto mt-8 px-4">
            <h2 className="text-2xl font-bold mb-6">Update Product</h2>
            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-sm border">
                
                <TextInput label="Product Name" name="name" value={product.name} onChange={handleChange} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">Main Category</label>
                        <select value={mainCategory} onChange={handleMainCategoryChange} className="add-product-InputCSS">
                            <option value="">Select Main Category</option>
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
                        <label className="block text-sm font-medium text-gray-700">Colors</label>
                        <Select
                            isMulti
                            options={colorOptions}
                            styles={customSelectStyles}
                            value={colorOptions.filter(opt => product.color.includes(opt.value))}
                            onChange={handleColorChange}
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">Sizes</label>
                        <Select
                            isMulti
                            options={availableSizeOptions}
                            styles={customSelectStyles}
                            value={availableSizeOptions.filter(opt => product.size.includes(opt.value))}
                            onChange={handleSizeChange}
                            isDisabled={availableSizeOptions.length === 0}
                        />
                    </div>
                </div>

                {/* Updated Row: Price, Stock, and Image */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <TextInput label="Price" name="price" type="number" value={product.price} onChange={handleChange} />
                    
                    {/*  New Stock Input Field for Update */}
                    <TextInput 
                        label="Update Stock" 
                        name="stock" 
                        type="number" 
                        value={product.stock} 
                        onChange={handleChange} 
                    />

                    <UploadImage name="image" id="image" value={newImage || product.image} setImage={setNewImage} />
                </div>

                <textarea 
                    rows={4} 
                    name="description" 
                    value={product.description} 
                    onChange={handleChange} 
                    className="add-product-InputCSS w-full p-3 border rounded-md" 
                />

                <button type="submit" className="add-product-btn w-full bg-indigo-600 text-white py-3 rounded-md font-bold hover:bg-indigo-700 transition-all" disabled={isUpdating}>
                    {isUpdating ? 'Updating...' : 'Update Product'}
                </button>
            </form>
        </div>
    );
};

export default UpdateProduct;