// import React, { useState } from 'react';
// import axios from 'axios';

// const UploadImage = ({ name, setImage }) => {
//     const [loading, setLoading] = useState(false);
//     const [url, setUrl] = useState("");

//     const convertBase64 = (file) => {
//         return new Promise((resolve, reject) => {
//             const fileReader = new FileReader();
//             fileReader.readAsDataURL(file);

//             fileReader.onload = () => {
//                 resolve(fileReader.result);
//             };

//             fileReader.onerror = (error) => {
//                 reject(error);
//             };
//         });
//     };

//     const uploadSingleImage = (base64) => {
//         setLoading(true);
//         axios
//             .post("http://localhost:5000/uploadImage", { image: base64 })
//             .then((res) => {
//                 const imageUrl = res.data;
//                 setUrl(imageUrl);
//                 // console.log(imageUrl);
//                 alert("Image uploaded successfully");
//                 setImage(imageUrl); 
//             })
//             .then(() => setLoading(false))
//             .catch((error) => {
//                 console.error(error);
//                 setLoading(false);
//             });
//     };

//     const uploadImage = async (event) => {
//         const files = event.target.files;

//         if (files.length === 1) {
//             const base64 = await convertBase64(files[0]);
//             uploadSingleImage(base64);
//             return;
//         }

//         const base64s = [];
//         for (let i = 0; i < files.length; i++) {
//             const base = await convertBase64(files[i]);
//             base64s.push(base);
//         }

//         // Handle multiple image uploads if needed
//     };

//     return (
//         <div>
//             <label htmlFor={name} className="block text-sm font-medium text-gray-700">
//                 Image
//             </label>
//             <input
//                 onChange={uploadImage}
        
//                 name={name}
//                 id={name}
//                 type="file"
//                 className="add-product-InputCSS"
//             />
//             {loading && (
//                 <div className="mt-2 text-sm text-blue-600">
//                     <p>Uploading...</p>
//                 </div>
//             )}
//             {url && (
//                 <div className="mt-2 text-sm text-green-600">
//                     <p>Image uploaded successfully!</p>
//                     <img src={url} alt="Uploaded" />
//                 </div>
//             )}
//         </div>
//     );
// };

// export default UploadImage;


import React, { useState } from 'react';
import axios from 'axios';

const UploadImage = ({ name, setImage }) => {
    const [loading, setLoading] = useState(false);
    const [urls, setUrls] = useState([]);

    const convertBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = () => resolve(fileReader.result);
            fileReader.onerror = (error) => reject(error);
        });
    };

    const uploadImages = async (event) => {
        const files = event.target.files;
        if (files.length === 0) return;

        setLoading(true);
        const uploadedUrls = [...urls]; // Pehle se majood images ko rakhein

        try {
            for (let i = 0; i < files.length; i++) {
                const base64 = await convertBase64(files[i]);
                const res = await axios.post("http://localhost:5000/uploadImage", { image: base64 });
                uploadedUrls.push(res.data);
            }

            setUrls(uploadedUrls);
            setImage(uploadedUrls);
            
        } catch (error) {
            console.error("Upload error:", error);
            alert("Failed to upload images");
        } finally {
            setLoading(false);
        }
    };

    // ✅ Image Order Change karne ka function (Move Left/Right)
    const moveImage = (index, direction) => {
        const newUrls = [...urls];
        const nextIndex = direction === 'left' ? index - 1 : index + 1;

        if (nextIndex < 0 || nextIndex >= newUrls.length) return;

        // Swap elements
        [newUrls[index], newUrls[nextIndex]] = [newUrls[nextIndex], newUrls[index]];

        setUrls(newUrls);
        setImage(newUrls);
    };

    // ✅ Image Delete karne ka function
    const removeImage = (index) => {
        const newUrls = urls.filter((_, i) => i !== index);
        setUrls(newUrls);
        setImage(newUrls);
    };

    return (
        <div className="space-y-4">
            <label htmlFor={name} className="block text-sm font-bold text-gray-700 uppercase tracking-wider">
                Product Images <span className="text-gray-400 text-xs">(First image will be Main)</span>
            </label>
            
            <input
                onChange={uploadImages}
                name={name}
                id={name}
                type="file"
                multiple
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
            />
            
            {loading && (
                <div className="flex items-center gap-2 text-sm text-blue-600 animate-pulse">
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <p>Uploading images...</p>
                </div>
            )}

            {/* Preview Section with Ordering Logic */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
                {urls.map((u, index) => (
                    <div key={index} className={`relative group border-2 rounded-xl p-1 transition-all ${index === 0 ? 'border-green-500 shadow-md' : 'border-gray-100 hover:border-indigo-300'}`}>
                        
                        {/* Main Label */}
                        {index === 0 && (
                            <span className="absolute -top-2 -left-2 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full z-10 shadow-sm">
                                MAIN
                            </span>
                        )}

                        <img src={u} alt={`Uploaded ${index}`} className="w-full h-28 object-cover rounded-lg" />

                        {/* Control Buttons */}
                        <div className="flex justify-between items-center mt-2 bg-gray-50 rounded-lg p-1">
                            <div className="flex gap-1">
                                <button 
                                    type="button"
                                    onClick={() => moveImage(index, 'left')}
                                    disabled={index === 0}
                                    className={`p-1 rounded ${index === 0 ? 'text-gray-300' : 'text-indigo-600 hover:bg-indigo-100'}`}
                                >
                                    ◀
                                </button>
                                <button 
                                    type="button"
                                    onClick={() => moveImage(index, 'right')}
                                    disabled={index === urls.length - 1}
                                    className={`p-1 rounded ${index === urls.length - 1 ? 'text-gray-300' : 'text-indigo-600 hover:bg-indigo-100'}`}
                                >
                                    ▶
                                </button>
                            </div>
                            
                            <button 
                                type="button"
                                onClick={() => removeImage(index)}
                                className="text-red-500 hover:bg-red-50 p-1 rounded transition-colors"
                            >
                                🗑️
                            </button>
                        </div>
                        
                        <p className="text-[10px] text-center mt-1 text-gray-400 font-medium">Position: {index + 1}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UploadImage;