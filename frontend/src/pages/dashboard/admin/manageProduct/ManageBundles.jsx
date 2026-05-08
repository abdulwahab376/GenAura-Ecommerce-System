import React from 'react';
// 4 martaba ../ taake aap 'src' folder tak wapas ja saken
import { useGetBundlesQuery, useDeleteBundleMutation } from "../../../../redux/features/products/bundleApi";
import { Link } from 'react-router-dom';
import { Edit, Trash2, ExternalLink } from 'lucide-react';
import { toast } from 'react-hot-toast';

const ManageBundles = () => {
    const { data: bundles, isLoading, error, refetch } = useGetBundlesQuery();
    const [deleteBundle] = useDeleteBundleMutation();

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this bundle deal?")) {
            try {
                await deleteBundle(id).unwrap();
                toast.success("Bundle deleted successfully!");
                refetch();
            } catch (err) {
                toast.error("Failed to delete bundle.");
                console.error(err);
            }
        }
    };

    if (isLoading) return <div className="p-10 text-center font-bold text-slate-400">Loading Bundles...</div>;
    if (error) return <div className="p-10 text-center text-red-500">Error loading bundles.</div>;

    return (
        <section className="p-6 bg-slate-50 min-h-screen">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Manage Hot Deals</h2>
                        <p className="text-slate-500 text-xs font-medium uppercase tracking-widest">Edit or remove your active bundles</p>
                    </div>
                    <Link 
                        to="/dashboard/add-bundle" 
                        className="bg-red-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-red-700 transition-all shadow-lg shadow-red-100"
                    >
                        + Add New Bundle
                    </Link>
                </div>

                <div className="bg-white rounded-[24px] shadow-xl shadow-slate-200/60 overflow-hidden border border-slate-100">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-900 text-white">
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[2px]">Image</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[2px]">Bundle Details</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[2px]">Price (Rs.)</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[2px] text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {bundles && bundles.map((bundle, index) => (
                                <tr key={bundle._id} className="hover:bg-slate-50/80 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="w-16 h-16 bg-white border border-slate-100 rounded-lg overflow-hidden p-1">
                                            <img 
                                                src={bundle.image} 
                                                alt={bundle.title} 
                                                className="w-full h-full object-contain"
                                            />
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <h4 className="font-black text-slate-900 text-sm uppercase tracking-tight">{bundle.title}</h4>
                                        <p className="text-[10px] text-slate-400 font-medium truncate max-w-[200px] italic">{bundle.description}</p>
                                        <span className="inline-block mt-1 px-2 py-0.5 bg-green-100 text-green-700 text-[8px] font-black rounded uppercase">
                                            {bundle.badgeText || "ACTIVE"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-bold text-slate-700">
                                        <div className="flex flex-col">
                                            <span className="text-red-600">Rs. {bundle.dealPrice}</span>
                                            <span className="text-[10px] text-slate-300 line-through">Rs. {bundle.originalPrice}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center gap-3">
                                            {/* Edit Button */}
                                            <Link 
                                                to={`/dashboard/edit-bundle/${bundle._id}`}
                                                className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                                                title="Edit Bundle"
                                            >
                                                <Edit size={16} />
                                            </Link>
                                            
                                            {/* Delete Button */}
                                            <button 
                                                onClick={() => handleDelete(bundle._id)}
                                                className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all shadow-sm"
                                                title="Delete Bundle"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {bundles?.length === 0 && (
                        <div className="p-20 text-center">
                            <p className="text-slate-300 font-black uppercase tracking-widest text-sm">No Bundles Found</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default ManageBundles;