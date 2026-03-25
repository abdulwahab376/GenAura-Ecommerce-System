// // import React, { useEffect, useState } from 'react';
// // import { useDispatch, useSelector } from 'react-redux';
// // import { useEditProfileMutation } from '../../../redux/features/auth/authApi';
// // import { setUser } from '../../../redux/features/auth/authSlice';
// // import avatarImg from "../../../assets/avatar.png";

// // const UserProfile = () => {
// //   const dispatch = useDispatch();
// //   const { user } = useSelector((state) => state.auth);
// //   const [editProfile, { isLoading, isError, isSuccess, error }] = useEditProfileMutation();

// //   const [formData, setFormData] = useState({
// //     username: '',
// //     profileImage: '',
// //     bio: '',
// //     profession: '',
// //     userId: ''
// //   });

// //   const [isModalOpen, setIsModalOpen] = useState(false);

// //   useEffect(() => {
// //     if (user) {
// //       setFormData({
// //         username: user.username || '',
// //         profileImage: user.profileImage || '',
// //         bio: user.bio || '',
// //         profession: user.profession || '',
// //         userId: user._id || ''
// //       });
// //     }
// //   }, [user]);

// //   const handleChange = (e) => {
// //     setFormData({
// //       ...formData,
// //       [e.target.name]: e.target.value,
// //     });
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();

// //     const updatedUser = {
// //       username: formData.username,
// //       profileImage: formData.profileImage,
// //       bio: formData.bio,
// //       profession: formData.profession,
// //       userId: formData.userId
// //     };

// //     try {
// //       const response = await editProfile(updatedUser).unwrap();
// //       dispatch(setUser(response.user)); // Update Redux state
// //       localStorage.setItem('user', JSON.stringify(response.user)); // Update local storage
// //       alert('Profile updated successfully!');
// //     } catch (err) {
// //       console.error('Failed to update profile:', err);
// //       alert('Failed to update profile. Please try again.');
// //     }

// //     setIsModalOpen(false); // Close the modal after submission
// //   };

// //   return (
// //     <div className="container mx-auto p-6">
// //       <div className="bg-white shadow-md rounded-lg p-6">
// //         <div className="flex items-center mb-4">
// //           <img
// //             src={formData.profileImage || avatarImg}
// //             alt="Profile"
// //             className="w-32 h-32 object-cover rounded-full"
// //           />
// //           <div className="ml-6">
// //             <h2 className="text-2xl font-bold">Username: {formData.username || 'N/A'}</h2>
// //             <p className="text-gray-700">User Bio: {formData.bio || 'N/A'}</p>
// //             <p className="text-gray-700">Profession: {formData.profession || 'N/A'}</p>
// //           </div>
// //           <button
// //             onClick={() => setIsModalOpen(true)}
// //             className="ml-auto text-blue-500 hover:text-blue-700"
// //           >
// //             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
// //               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3H4a1 1 0 00-1 1v14a1 1 0 001 1h7m2 0h7a1 1 0 001-1V4a1 1 0 00-1-1h-7m-2 0v14"></path>
// //             </svg>
// //           </button>
// //         </div>
// //       </div>

// //       {/* Modal for Editing */}
// //       {isModalOpen && (
// //         <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
// //           <div className="bg-white p-6 rounded-lg md:w-96 max-w-xl mx-auto relative">
// //             <button
// //               onClick={() => setIsModalOpen(false)}
// //               className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
// //             >
// //               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
// //                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
// //               </svg>
// //             </button>
// //             <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
// //             <form onSubmit={handleSubmit}>
// //               <div className="mb-4">
// //                 <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
// //                 <input
// //                   type="text"
// //                   name="username"
// //                   value={formData.username}
// //                   onChange={handleChange}
// //                   className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm"
// //                   required
// //                 />
// //               </div>

// //               <div className="mb-4">
// //                 <label htmlFor="profileImage" className="block text-sm font-medium text-gray-700">Profile Image URL</label>
// //                 <input
// //                   type="text"
// //                   name="profileImage"
// //                   value={formData.profileImage}
// //                   onChange={handleChange}
// //                   className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm"
// //                 />
// //               </div>

// //               <div className="mb-4">
// //                 <label htmlFor="bio" className="block text-sm font-medium text-gray-700">Bio</label>
// //                 <textarea
// //                   name="bio"
// //                   value={formData.bio}
// //                   onChange={handleChange}
// //                   className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm"
// //                   rows="3"
// //                 />
// //               </div>

// //               <div className="mb-4">
// //                 <label htmlFor="profession" className="block text-sm font-medium text-gray-700">Profession</label>
// //                 <input
// //                   type="text"
// //                   name="profession"
// //                   value={formData.profession}
// //                   onChange={handleChange}
// //                   className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm"
// //                 />
// //               </div>

// //               <button
// //                 type="submit"
// //                 className={`mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded-md ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
// //                 disabled={isLoading}
// //               >
// //                 {isLoading ? 'Saving...' : 'Save Changes'}
// //               </button>
// //               {isError && <p className="mt-2 text-red-500">Failed to update profile. Please try again.</p>}
// //               {isSuccess && <p className="mt-2 text-green-500">Profile updated successfully!</p>}
// //             </form>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default UserProfile;


// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useEditProfileMutation } from '../../../redux/features/auth/authApi';
// import { setUser } from '../../../redux/features/auth/authSlice';
// import avatarImg from "../../../assets/avatar.png";

// const UserProfile = () => {
//   const dispatch = useDispatch();
//   const { user } = useSelector((state) => state.auth);
//   const [editProfile, { isLoading, isError, isSuccess }] = useEditProfileMutation();

//   const [formData, setFormData] = useState({
//     username: '',
//     profileImage: '',
//     bio: '',
//     profession: '',
//     userId: ''
//   });

//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [uploading, setUploading] = useState(false); // Image upload state

//   useEffect(() => {
//     if (user) {
//       setFormData({
//         username: user.username || '',
//         profileImage: user.profileImage || '',
//         bio: user.bio || '',
//         profession: user.profession || '',
//         userId: user._id || ''
//       });
//     }
//   }, [user]);

//   // --- Cloudinary Upload Logic ---
//   const handleFileUpload = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     const data = new FormData();
//     data.append("file", file);
//     data.append("upload_preset", "YOUR_PRESET_NAME"); // <-- Apna preset name yahan likhein
//     data.append("cloud_name", "YOUR_CLOUD_NAME");     // <-- Apna cloud name yahan likhein

//     try {
//       setUploading(true);
//       const res = await fetch("https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload", {
//         method: "POST",
//         body: data,
//       });
//       const fileData = await res.json();
      
//       if (fileData.secure_url) {
//         setFormData({ ...formData, profileImage: fileData.secure_url });
//         alert("Image uploaded to Cloudinary!");
//       }
//     } catch (error) {
//       console.error("Cloudinary Error:", error);
//       alert("Failed to upload image.");
//     } finally {
//       setUploading(false);
//     }
//   };

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await editProfile(formData).unwrap();
//       dispatch(setUser(response.user)); 
//       localStorage.setItem('user', JSON.stringify(response.user));
//       alert('Profile updated successfully!');
//       setIsModalOpen(false);
//     } catch (err) {
//       console.error('Failed to update profile:', err);
//     }
//   };

//   return (
//     <div className="container mx-auto p-6">
//       <div className="bg-white shadow-md rounded-lg p-6">
//         <div className="flex items-center mb-4">
//           <img
//             src={formData.profileImage || avatarImg}
//             alt="Profile"
//             className="w-32 h-32 object-cover rounded-full border-2 border-primary"
//           />
//           <div className="ml-6">
//             <h2 className="text-2xl font-bold">{formData.username || 'N/A'}</h2>
//             <p className="text-gray-700 italic">{formData.profession || 'Profession not set'}</p>
//             <p className="text-gray-600 mt-2">{formData.bio || 'No bio available'}</p>
//           </div>
//           <button
//             onClick={() => setIsModalOpen(true)}
//             className="ml-auto bg-primary/10 p-2 rounded-full hover:bg-primary/20 transition-all"
//           >
//             <i className="ri-edit-line text-xl text-primary"></i>
//           </button>
//         </div>
//       </div>

//       {/* Modal for Editing */}
//       {isModalOpen && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white p-6 rounded-xl w-full max-w-md relative shadow-2xl">
//             <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-black">
//               <i className="ri-close-line text-2xl"></i>
//             </button>
            
//             <h2 className="text-xl font-bold mb-6 text-slate-800 border-b pb-2">Edit Your Profile</h2>
            
//             <form onSubmit={handleSubmit} className="space-y-4">
//               {/* Profile Image File Input */}
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-1">Upload New Profile Picture</label>
//                 <input
//                   type="file"
//                   onChange={handleFileUpload}
//                   className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
//                 />
//                 {uploading && <p className="text-xs text-blue-500 mt-1 animate-pulse">Uploading to Cloudinary...</p>}
//               </div>

//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-1">Username</label>
//                 <input
//                   type="text"
//                   name="username"
//                   value={formData.username}
//                   onChange={handleChange}
//                   className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary outline-none"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-1">Profession</label>
//                 <input
//                   type="text"
//                   name="profession"
//                   value={formData.profession}
//                   onChange={handleChange}
//                   className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary outline-none"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-1">Bio</label>
//                 <textarea
//                   name="bio"
//                   value={formData.bio}
//                   onChange={handleChange}
//                   className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary outline-none"
//                   rows="3"
//                 />
//               </div>

//               <button
//                 type="submit"
//                 className={`w-full py-3 px-4 rounded-lg font-bold text-white transition-all ${
//                   isLoading || uploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary hover:shadow-lg'
//                 }`}
//                 disabled={isLoading || uploading}
//               >
//                 {isLoading ? 'Updating...' : 'Save All Changes'}
//               </button>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default UserProfile;


import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useEditProfileMutation } from '../../../redux/features/auth/authApi';
import { setUser } from '../../../redux/features/auth/authSlice';
import avatarImg from "../../../assets/avatar.png";

const UserProfile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [editProfile, { isLoading }] = useEditProfileMutation();

  const [formData, setFormData] = useState({
    username: '',
    profileImage: '',
    bio: '',
    profession: '',
    userId: ''
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        profileImage: user.profileImage || '',
        bio: user.bio || '',
        profession: user.profession || '',
        userId: user._id || ''
      });
    }
  }, [user]);

  // --- Cloudinary Direct Upload Logic ---
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", uploadPreset);
    data.append("cloud_name", cloudName);

    try {
      setUploading(true);
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: data,
      });
      
      const fileData = await res.json();
      
      if (fileData.secure_url) {
        setFormData({ ...formData, profileImage: fileData.secure_url });
        alert("Image uploaded successfully!");
      } else {
        alert("Upload failed! Please check your preset settings.");
      }
    } catch (error) {
      console.error("Cloudinary Error:", error);
      alert("Error uploading image.");
    } finally {
      setUploading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await editProfile(formData).unwrap();
      dispatch(setUser(response.user)); 
      localStorage.setItem('user', JSON.stringify(response.user));
      alert('Profile updated in database!');
      setIsModalOpen(false);
    } catch (err) {
      console.error('Failed to update profile:', err);
      alert('Database update failed.');
    }
  };

  return (
    <div className="container mx-auto p-6">
      {/* Profile Card */}
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="relative">
            <img
              src={formData.profileImage || avatarImg}
              alt="Profile"
              className="w-40 h-40 object-cover rounded-full border-4 border-blue-50 shadow-md"
            />
            {uploading && (
               <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">Uploading...</span>
               </div>
            )}
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-3xl font-extrabold text-gray-800">{formData.username || 'User Name'}</h2>
            <p className="text-blue-600 font-medium mb-3">{formData.profession || 'Profession'}</p>
            <p className="text-gray-500 leading-relaxed max-w-md">{formData.bio || 'No bio added yet.'}</p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all shadow-md"
          >
            Edit Profile
          </button>
        </div>
      </div>

      {/* Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-2xl w-full max-w-md relative shadow-2xl">
            <button 
              onClick={() => setIsModalOpen(false)} 
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
            
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Update Information</h2>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">Profile Photo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">Profession</label>
                <input
                  type="text"
                  name="profession"
                  value={formData.profession}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  rows="3"
                />
              </div>

              <button
                type="submit"
                className={`w-full py-3 rounded-xl font-bold text-white shadow-lg transition-all ${
                  isLoading || uploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                }`}
                disabled={isLoading || uploading}
              >
                {isLoading ? 'Saving to DB...' : 'Save All Changes'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;