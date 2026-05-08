import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetBundleByIdQuery, useUpdateBundleMutation } from '../../../../redux/features/products/bundleApi';
import { getBaseUrl } from '../../../../utils/baseUrl';
import { toast } from 'react-hot-toast';
import { X } from 'lucide-react'; // Cross icon ke liye

const UpdateBundle = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: bundleData, isLoading: isFetching } = useGetBundleByIdQuery(id);
    const [updateBundle, { isLoading: isUpdating }] = useUpdateBundleMutation();

    const [bundle, setBundle] = useState({
        title: '',
        description: '',
        dealPrice: '',
        originalPrice: '',
        badgeText: '',
        image: '',
        images: []
    });

    useEffect(() => {
        if (bundleData) {
            setBundle({
                title: bundleData.title || '',
                description: bundleData.description || '',
                dealPrice: bundleData.dealPrice || '',
                originalPrice: bundleData.originalPrice || '',
                badgeText: bundleData.badgeText || '',
                image: bundleData.image || '',
                images: bundleData.images || []
            });
        }
    }, [bundleData]);

    const handleChange = (e) => {
        setBundle({ ...bundle, [e.target.name]: e.target.value });
    };

    // ✅ Image Remove Function
    const handleRemoveImage = (indexToRemove) => {
        const updatedImages = bundle.images.filter((_, index) => index !== indexToRemove);
        setBundle({
            ...bundle,
            images: updatedImages,
            image: updatedImages[0] || '' // Agar pehli photo delete ho toh next wali main ban jaye
        });
    };

    // ✅ New Image Upload Logic
    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files);
        const loadingToast = toast.loading("Uploading new images...");
        
        try {
            const uploadedUrls = [];
            for (const file of files) {
                const reader = new FileReader();
                const url = await new Promise((resolve, reject) => {
                    reader.readAsDataURL(file);
                    reader.onload = async () => {
                        try {
                            const response = await fetch(`${getBaseUrl()}/uploadImage`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ image: reader.result }),
                            });
                            const data = await response.json();
                            resolve(data.url || data);
                        } catch (err) { reject(err); }
                    };
                });
                uploadedUrls.push(url);
            }
            
            setBundle(prev => ({
                ...prev,
                images: [...prev.images, ...uploadedUrls],
                image: prev.image || uploadedUrls[0]
            }));
            toast.success("Images uploaded!", { id: loadingToast });
        } catch (error) {
            toast.error("Upload failed", { id: loadingToast });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateBundle({ id, ...bundle }).unwrap();
            toast.success("Bundle Updated Successfully!");
            navigate('/dashboard/manage-bundles');
        } catch (error) {
            console.error(error);
            toast.error("Failed to update bundle.");
        }
    };

    if (isFetching) return <div className="p-10 text-center font-bold text-slate-400">Loading Bundle Data...</div>;

    return (
        <section className="bg-gray-50 min-h-screen p-6 md:p-10 text-left">
            <div className="max-w-4xl">
                <h2 className="text-3xl font-black text-gray-900 mb-1 uppercase tracking-tight">Update Bundle Deal</h2>
                <p className="text-gray-500 text-sm mb-8 font-medium italic">Modify the details of your hot deal.</p>

                <form onSubmit={handleSubmit} className="bg-white p-6 md:p-10 rounded-xl shadow-sm border border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Bundle Title</label>
                                <input type="text" name="title" value={bundle.title} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" required />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                                <textarea name="description" value={bundle.description} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg h-32 outline-none focus:ring-2 focus:ring-blue-500" required />
                            </div>
                        </div>

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

                            {/* ✅ IMAGE SECTION WITH CROSS BUTTON */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Images (Click X to remove)</label>
                                <div className="grid grid-cols-4 gap-3 mt-2">
                                    {bundle.images.map((img, index) => (
                                        <div key={index} className="relative group h-16 w-full">
                                            <img src={img} className="h-full w-full object-cover rounded-md border" alt="bundle" />
                                            <button 
                                                type="button"
                                                onClick={() => handleRemoveImage(index)}
                                                className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-0.5 shadow-lg hover:bg-red-700 transition-colors"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ))}
                                    {/* Add Image Button */}
                                    <label className="h-16 w-full border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-all text-gray-400 font-bold text-xl">
                                        <input type="file" multiple className="hidden" onChange={handleImageUpload} />
                                        +
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-100 text-right">
                        <button type="submit" disabled={isUpdating} className="bg-gray-900 text-white px-10 py-3 rounded-lg font-bold hover:bg-black transition-all disabled:bg-gray-400 uppercase tracking-widest text-xs">
                            {isUpdating ? "Updating..." : "Update Bundle Details"}
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
};

export default UpdateBundle;