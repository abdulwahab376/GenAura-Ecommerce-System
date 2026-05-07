import React, { useState } from 'react';
import { useAddBundleMutation } from "../../../../redux/features/products/bundleApi";
import { useNavigate } from 'react-router-dom';
import { getBaseUrl } from '../../../../utils/baseUrl';

const AddBundle = () => {
    const [bundle, setBundle] = useState({
        title: '',
        description: '',
        dealPrice: '',
        originalPrice: '',
        badgeText: 'HOT DEAL',
        image: ''
    });

    const [imageFiles, setImageFiles] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [addBundle, { isLoading }] = useAddBundleMutation();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setBundle({ ...bundle, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            setImageFiles(prev => [...prev, ...files]);
            const newPreviews = files.map(file => URL.createObjectURL(file));
            setPreviews(prev => [...prev, ...newPreviews]);
        }
    };

    const removeImage = (index) => {
        setImageFiles(prev => prev.filter((_, i) => i !== index));
        setPreviews(prev => prev.filter((_, i) => i !== index));
    };

    const uploadImageAsBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = async () => {
                try {
                    const response = await fetch(`${getBaseUrl()}/uploadImage`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ image: reader.result }),
                    });
                    if (!response.ok) throw new Error("Server rejected the image");
                    const contentType = response.headers.get("content-type");
                    if (contentType && contentType.includes("application/json")) {
                        const data = await response.json();
                        resolve(data.url || data);
                    } else {
                        const textData = await response.text();
                        resolve(textData);
                    }
                } catch (err) {
                    reject(err);
                }
            };
            reader.onerror = (error) => reject(error);
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (imageFiles.length === 0) {
                alert("Please select at least one image!");
                return;
            }

            const uploadedUrls = [];
            for (const file of imageFiles) {
                const url = await uploadImageAsBase64(file);
                uploadedUrls.push(url);
            }

            const finalBundleData = { 
                ...bundle, 
                image: uploadedUrls[0],
                images: uploadedUrls 
            };

            await addBundle(finalBundleData).unwrap();
            alert("Bundle Deal Published Successfully!");
            navigate('/dashboard/admin');
        } catch (error) {
            console.error("Error:", error);
            alert("Failed to publish deal.");
        }
    };

    return (
        <section className="bg-gray-50 min-h-screen p-6 md:p-10 text-left">
            <div className="max-w-4xl">
                {/* 🚀 Updated Heading: Capitalized & Premium Style */}
                <h2 className="text-3xl font-black text-gray-900 mb-1 uppercase tracking-tight">
                    Create New Bundle Deal
                </h2>
                <p className="text-gray-500 text-sm mb-8 font-medium italic">
                    Combine products and offer special discounts.
                </p>

                <form onSubmit={handleSubmit} className="bg-white p-6 md:p-10 rounded-xl shadow-sm border border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        
                        {/* Left Side */}
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Bundle Title</label>
                                <input 
                                    type="text" name="title" value={bundle.title} onChange={handleChange} 
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400" 
                                    placeholder="e.g. Winter Essentials Pack" required 
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                                <textarea 
                                    name="description" value={bundle.description} onChange={handleChange} 
                                    className="w-full p-3 border border-gray-300 rounded-lg h-32 focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-400" 
                                    placeholder="Enter bundle description..." required 
                                />
                            </div>
                        </div>

                        {/* Right Side */}
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Deal Price</label>
                                    <input type="number" name="dealPrice" value={bundle.dealPrice} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg outline-none" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Original Price</label>
                                    <input type="number" name="originalPrice" value={bundle.originalPrice} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg outline-none" required />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Badge Text</label>
                                <input type="text" name="badgeText" value={bundle.badgeText} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg outline-none" />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Upload Images</label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition-all text-center">
                                    <input type="file" id="file-upload" multiple onChange={handleImageChange} className="hidden" />
                                    <label htmlFor="file-upload" className="cursor-pointer block">
                                        <span className="text-blue-600 font-medium">+ Click to Add Images</span>
                                        <p className="text-xs text-gray-400 mt-1">Select one or more product photos</p>
                                    </label>
                                </div>
                                
                                {/* Preview Grid */}
                                <div className="grid grid-cols-4 gap-2 mt-4">
                                    {previews.map((src, index) => (
                                        <div key={index} className="relative h-16 w-full">
                                            <img src={src} alt="preview" className="h-full w-full object-cover rounded-md border border-gray-200" />
                                            <button 
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="absolute -top-1 -right-1 bg-gray-800 text-white rounded-full w-4 h-4 text-[10px] flex items-center justify-center"
                                            >✕</button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-100 text-right">
                        <button 
                            type="submit" disabled={isLoading} 
                            className="bg-gray-900 text-white px-10 py-3 rounded-lg font-bold hover:bg-black transition-all disabled:bg-gray-400 uppercase tracking-widest text-xs"
                        >
                            {isLoading ? "Publishing..." : "Confirm & Post Bundle"}
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
};

export default AddBundle;