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
    const [urls, setUrls] = useState([]); // Ab ye array hogi

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
        const uploadedUrls = [];

        try {
            // Loop chalayen ge jitni bhi files select ki hain
            for (let i = 0; i < files.length; i++) {
                const base64 = await convertBase64(files[i]);
                
                // Har image ko bari bari backend pe upload karein
                const res = await axios.post("http://localhost:5000/uploadImage", { image: base64 });
                
                // Backend se aane wala URL array mein dalain
                uploadedUrls.push(res.data);
            }

            setUrls(uploadedUrls); // Local state update karein preview ke liye
            setImage(uploadedUrls); // Main form state mein array bhejein (Model match karne ke liye)
            alert(`${uploadedUrls.length} Images uploaded successfully`);
            
        } catch (error) {
            console.error("Upload error:", error);
            alert("Failed to upload images");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <label htmlFor={name} className="block text-sm font-medium text-gray-700">
                Product Images (You can select multiple)
            </label>
            <input
                onChange={uploadImages}
                name={name}
                id={name}
                type="file"
                multiple //  Ye attribute multiple files select karne deta hai
                className="add-product-InputCSS"
            />
            
            {loading && (
                <div className="mt-2 text-sm text-blue-600">
                    <p>Uploading {urls.length + 1}...</p>
                </div>
            )}

            {/* Preview Section: Tamam uploaded pictures nazar ayengi */}
            {urls.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                    {urls.map((u, index) => (
                        <div key={index} className="relative">
                            <img src={u} alt={`Uploaded ${index}`} className="w-20 h-20 object-cover rounded border" />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default UploadImage;