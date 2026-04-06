// import React, { useMemo, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { Pencil, Sun, Monitor, CheckCircle } from 'lucide-react';
// import { useGetOrderByIdQuery } from '../../../redux/features/orders/orderApi';
// import 'remixicon/fonts/remixicon.css';

// //  FREE MAP IMPORTS
// import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
// import L from 'leaflet';
// import 'leaflet/dist/leaflet.css';

// // ------------------------------------------------------------------
// //  CUSTOM MAP ICONS
// // ------------------------------------------------------------------
// const truckIcon = new L.DivIcon({
//   html: `<div style="background-color: #111827; color: white; padding: 6px; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); display: flex; align-items: center; justify-content: center; width: 36px; height: 36px;">
//             <i class="ri-truck-line text-xl" style="animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;"></i>
//          </div>`,
//   className: 'custom-leaflet-icon',
//   iconSize: [36, 36],
//   iconAnchor: [18, 18],
// });

// const storeIcon = new L.DivIcon({
//   html: `<div style="background-color: white; border: 2px solid #111827; border-radius: 50%; display: flex; align-items: center; justify-content: center; width: 32px; height: 32px;">
//             <i class="ri-store-2-line text-[#111827] text-lg"></i>
//          </div>`,
//   className: 'custom-leaflet-icon',
//   iconSize: [32, 32],
//   iconAnchor: [16, 16],
// });

// const homeIcon = new L.DivIcon({
//   html: `<div style="background-color: white; border: 2px solid #16a34a; border-radius: 50%; display: flex; align-items: center; justify-content: center; width: 32px; height: 32px;">
//             <i class="ri-home-4-line text-[#16a34a] text-lg"></i>
//          </div>`,
//   className: 'custom-leaflet-icon',
//   iconSize: [32, 32],
//   iconAnchor: [16, 16],
// });

// const OrderDetails = () => {
//   // Grabs the ID from /orders/:orderId
//   const { orderId } = useParams();
//   const navigate = useNavigate();

//   //  LIVE POLLING: Fetches data every 3 seconds to catch Admin updates
//   const { data: orderResponse, error, isLoading, refetch } = useGetOrderByIdQuery(orderId, {
//     skip: !orderId,
//     pollingInterval: 3000, 
//     refetchOnMountOrArgChange: true, // Forces fresh data from DB
//   });

//   const order = orderResponse?.order || orderResponse;

//   //  DYNAMIC STATUS MAPPING
//   const currentStep = useMemo(() => {
//     if (!order?.status) return 1;
//     switch (order.status.toLowerCase()) {
//       case 'pending': return 1;
//       case 'processing': return 2;
//       case 'shipped': return 3;
//       case 'completed': return 4;
//       default: return 1;
//     }
//   }, [order?.status]);

//   //  TRACKING DATA
//   const trackingData = useMemo(() => {
//     const map = {
//       1: { location: 'Warehouse - Jhelum', status: 'Order Created', estimatedDelivery: 'March 23, 2026', progress: 5 },
//       2: { location: 'Jhelum Processing Center', status: 'Processing', estimatedDelivery: 'March 22, 2026', progress: 30 },
//       3: { location: 'Lahore Distribution Center', status: 'In Transit', estimatedDelivery: 'March 21, 2026', progress: 70 },
//       4: { location: 'Delivered', status: 'Completed', estimatedDelivery: 'March 19, 2026', progress: 100 },
//     };
//     return map[currentStep] || map[1];
//   }, [currentStep]);

//   //  MAP COORDINATE MATH
//   const warehouseCoords = [32.9405, 73.7276]; // Jhelum
//   const destinationCoords = [31.5204, 74.3587]; // Lahore
  
//   const currentTruckCoords = [
//     warehouseCoords[0] + ((destinationCoords[0] - warehouseCoords[0]) * (trackingData.progress / 100)),
//     warehouseCoords[1] + ((destinationCoords[1] - warehouseCoords[1]) * (trackingData.progress / 100))
//   ];

//   const mapCenter = [32.2304, 74.0431];

//   const timelineSteps = [
//     { icon: Pencil, label: 'Your order has been created and is awaiting processing.' },
//     { icon: Sun, label: 'Your order is currently being processed.' },
//     { icon: Monitor, label: 'Your order has been shipped.' },
//     { icon: CheckCircle, label: 'Your order has been successfully completed.' },
//   ];

//   const timestamp = order?.createdAt ? new Date(order.createdAt).toLocaleString() : 'Loading...';

//   if (isLoading) return <div className="min-h-screen flex items-center justify-center font-bold text-gray-500">Loading Order Details...</div>;
//   if (error || !order) return <div className="min-h-screen flex items-center justify-center font-bold text-red-500">Error: Order Not Found.</div>;

//   return (
//     <div className="min-h-screen bg-white font-sans">

//       {/* Content */}
//       <main className="max-w-7xl mx-auto px-6 py-10">
//         <div className="flex justify-between items-end mb-2">
//             <h2 className="text-2xl font-bold text-gray-900 capitalize">Payment {order.status}</h2>
//             {/* Fallback Refresh Button just in case */}
//             <button onClick={refetch} className="text-xs text-indigo-600 font-bold bg-indigo-50 px-3 py-1 rounded-full hover:bg-indigo-100">
//                 <i className="ri-refresh-line mr-1"></i> Refresh Status
//             </button>
//         </div>
//         <p className="text-sm text-gray-700 mb-1">Order ID: #{order._id}</p>
//         <p className="text-sm text-gray-700 mb-10 capitalize">Status: {order.status}</p>

//         {/* Timeline */}
//         <div className="flex items-start justify-between mb-16 overflow-x-auto">
//           {timelineSteps.map((step, i) => {
//             const Icon = step.icon;
//             const isActive = i < currentStep;
//             const isLast = i === timelineSteps.length - 1;
//             return (
//               <div key={i} className="flex-1 flex flex-col items-start relative min-w-[150px]">
//                 <div className="flex items-center w-full">
//                   <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors duration-500 ${isActive ? 'text-gray-900 bg-gray-100' : 'text-gray-300'}`}>
//                     <Icon size={18} />
//                   </div>
//                   {!isLast && (
//                     <div className={`flex-1 h-px transition-colors duration-500 ${isActive ? 'bg-gray-900' : 'bg-gray-300'}`}></div>
//                   )}
//                 </div>
//                 <div className="mt-3 pr-4">
//                   <p className="text-xs text-gray-500 mb-1">{i === 0 ? timestamp : ''}</p>
//                   <p className="text-xs text-gray-400 leading-relaxed">{step.label}</p>
//                 </div>
//               </div>
//             );
//           })}
//         </div>

//         {/* Live Tracking Section */}
//         <div className="border-t border-gray-200 pt-8">
//           <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
//             <i className="ri-map-pin-line text-blue-600"></i> Live Map Tracking
//           </h3>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//             <div>
//               <p className="text-xs text-gray-500 mb-1">Current Location</p>
//               <p className="text-sm text-gray-900 font-medium">{trackingData.location}</p>
//             </div>
//             <div>
//               <p className="text-xs text-gray-500 mb-1">Estimated Delivery</p>
//               <p className="text-sm text-gray-900 font-medium">{trackingData.estimatedDelivery}</p>
//             </div>
//             <div>
//               <p className="text-xs text-gray-500 mb-1">Tracking Status</p>
//               <p className="text-sm text-gray-900 font-medium">{trackingData.status}</p>
//             </div>
//           </div>

//           {/* Progress Bar */}
//           <div className="mb-8">
//             <div className="flex justify-between text-xs text-gray-500 mb-2">
//               <span>Order Created</span>
//               <span>Processing</span>
//               <span>Shipped</span>
//               <span>Delivered</span>
//             </div>
//             <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
//               <div
//                 className="h-full bg-gray-900 rounded-full transition-all duration-1000 ease-in-out"
//                 style={{ width: `${trackingData.progress}%` }}
//               ></div>
//             </div>
//           </div>

//           {/*  REAL GEOGRAPHICAL MAP */}
//           <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm relative z-0">
//             <MapContainer 
//                 center={mapCenter} 
//                 zoom={8} 
//                 scrollWheelZoom={false} 
//                 style={{ height: '400px', width: '100%', zIndex: 0 }}
//             >
//               <TileLayer
//                 attribution='&copy; OpenStreetMap'
//                 url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//               />

//               {/* Start Pin */}
//               <Marker position={warehouseCoords} icon={storeIcon}>
//                 <Popup><b>Warehouse</b><br/>Jhelum, Punjab</Popup>
//               </Marker>

//               {/* End Pin */}
//               <Marker position={destinationCoords} icon={homeIcon}>
//                 <Popup><b>Delivery Address</b><br/>Lahore, Punjab</Popup>
//               </Marker>

//               {/* Live Truck */}
//               <Marker position={currentTruckCoords} icon={truckIcon}>
//                 <Popup>
//                     <b>Status: {order.status}</b><br/>
//                     {currentStep === 4 ? 'Package Delivered!' : 'On the way to destination...'}
//                 </Popup>
//               </Marker>
//             </MapContainer>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default OrderDetails;




// import React, { useMemo, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { Pencil, Sun, Monitor, CheckCircle, MapPin, Truck, RefreshCw } from 'lucide-react';
// import { useGetOrderByIdQuery } from '../../../redux/features/orders/orderApi';
// import 'remixicon/fonts/remixicon.css';

// // FREE MAP IMPORTS
// import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
// import L from 'leaflet';
// import 'leaflet/dist/leaflet.css';

// // ------------------------------------------------------------------
// // ADVANCED CUSTOM ICONS (With Dynamic Labels)
// // ------------------------------------------------------------------
// const createTruckIcon = (currentLocation) => new L.DivIcon({
//   html: `
//     <div style="display: flex; flex-direction: column; align-items: center; width: 100px;">
//       <div style="background: #111827; color: white; padding: 2px 8px; border-radius: 6px; font-size: 10px; font-weight: bold; margin-bottom: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.3); border: 1px solid #374151; white-space: nowrap;">
//         ${currentLocation}
//       </div>
//       <div style="background-color: #111827; color: white; padding: 7px; border-radius: 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.2); display: flex; align-items: center; justify-content: center; width: 38px; height: 38px;">
//         <i class="ri-truck-line text-xl" style="animation: pulse 2s infinite;"></i>
//       </div>
//     </div>`,
//   className: 'custom-truck-icon',
//   iconSize: [100, 60],
//   iconAnchor: [50, 55],
// });

// const storeIcon = new L.DivIcon({
//   html: `<div style="background-color: white; border: 2px solid #111827; border-radius: 50%; display: flex; align-items: center; justify-content: center; width: 32px; height: 32px;"><i class="ri-store-2-line text-[#111827] text-lg"></i></div>`,
//   className: 'custom-icon', iconSize: [32, 32], iconAnchor: [16, 16],
// });

// const homeIcon = new L.DivIcon({
//   html: `<div style="background-color: white; border: 2px solid #16a34a; border-radius: 50%; display: flex; align-items: center; justify-content: center; width: 32px; height: 32px;"><i class="ri-home-4-line text-[#16a34a] text-lg"></i></div>`,
//   className: 'custom-icon', iconSize: [32, 32], iconAnchor: [16, 16],
// });

// const OrderDetails = () => {
//   const { orderId } = useParams();
//   const navigate = useNavigate();

//   const { data: orderResponse, error, isLoading, refetch } = useGetOrderByIdQuery(orderId, {
//     skip: !orderId,
//     pollingInterval: 3000, 
//   });

//   const order = orderResponse?.order || orderResponse;

//   // 1. DYNAMIC STATUS & STEP MAPPING
//   const currentStep = useMemo(() => {
//     if (!order?.status) return 1;
//     switch (order.status.toLowerCase()) {
//       case 'pending': return 1;
//       case 'processing': return 2;
//       case 'shipped': return 3;
//       case 'completed': return 4;
//       default: return 1;
//     }
//   }, [order?.status]);

//   // 2. ADVANCED TRACKING DATA (Dynamic Estimates & Cities)
//   const warehouseCoords = [32.9405, 73.7276]; // Jhelum
//   const destinationCoords = order?.address?.coordinates || [31.5204, 74.3587]; // Default Lahore if missing
//   const destinationCity = order?.address?.city || "Your Location";

//   const trackingData = useMemo(() => {
//     const map = {
//       1: { location: 'Warehouse - Jhelum', status: 'Packing Order', estimate: 'Within 24 Hours', progress: 5 },
//       2: { location: 'Gujrat Transit Hub', status: 'In Processing', estimate: '2-3 Days', progress: 35 },
//       3: { location: 'In Transit to ' + destinationCity, status: 'Shipped', estimate: 'Arriving Tomorrow', progress: 75 },
//       4: { location: destinationCity, status: 'Delivered', estimate: 'Delivered Successfully', progress: 100 },
//     };
//     return map[currentStep] || map[1];
//   }, [currentStep, destinationCity]);

//   // 3. LIVE TRUCK POSITION CALCULATION
//   const currentTruckCoords = [
//     warehouseCoords[0] + ((destinationCoords[0] - warehouseCoords[0]) * (trackingData.progress / 100)),
//     warehouseCoords[1] + ((destinationCoords[1] - warehouseCoords[1]) * (trackingData.progress / 100))
//   ];

//   const timelineSteps = [
//     { icon: Pencil, label: 'Order Created & Confirmed' },
//     { icon: Sun, label: 'Order is being Processed' },
//     { icon: Monitor, label: 'Order Shipped & In Transit' },
//     { icon: CheckCircle, label: 'Order Delivered Successfully' },
//   ];

//   if (isLoading) return <div className="min-h-screen flex items-center justify-center font-bold text-indigo-600 animate-pulse">Syncing Order Live...</div>;
//   if (error || !order) return <div className="min-h-screen flex items-center justify-center font-bold text-red-500">Order Data Not Found.</div>;

//   return (
//     <div className="min-h-screen bg-[#F9FAFB] font-sans pb-20">
//       <main className="max-w-7xl mx-auto px-4 md:px-8 py-10">
        
//         {/* TOP HEADER */}
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
//           <div>
//             <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-2">
//                ORDER TRACKING <span className="text-indigo-600 font-medium text-lg">#{order._id.slice(-8).toUpperCase()}</span>
//             </h1>
//             <p className="text-sm text-gray-500 mt-1 font-medium">Placed on: {new Date(order.createdAt).toLocaleString()}</p>
//           </div>
//           <button onClick={refetch} className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-gray-50 transition-all text-gray-700">
//             <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} /> Refresh Tracking
//           </button>
//         </div>

//         {/* TIMELINE SECTION */}
//         <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mb-8">
//           <div className="flex items-center justify-between overflow-x-auto gap-4">
//             {timelineSteps.map((step, i) => {
//               const Icon = step.icon;
//               const isActive = i < currentStep;
//               const isCurrent = i + 1 === currentStep;
//               return (
//                 <div key={i} className="flex-1 min-w-[120px] relative">
//                   <div className="flex items-center">
//                     <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 transition-all duration-700 ${isActive ? 'bg-indigo-600 text-white shadow-lg' : 'bg-gray-100 text-gray-400'}`}>
//                       <Icon size={20} />
//                     </div>
//                     {i !== timelineSteps.length - 1 && (
//                       <div className={`flex-1 h-1 mx-2 rounded-full ${isActive ? 'bg-indigo-600' : 'bg-gray-100'}`}></div>
//                     )}
//                   </div>
//                   <p className={`mt-4 text-xs font-bold uppercase tracking-wider ${isCurrent ? 'text-indigo-600' : 'text-gray-400'}`}>
//                     {step.label}
//                   </p>
//                 </div>
//               );
//             })}
//           </div>
//         </div>

//         {/* TRACKING STATS CARD */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//           {[
//             { label: 'Current Location', value: trackingData.location, icon: <MapPin size={18} className="text-blue-500" /> },
//             { label: 'Estimated Delivery', value: trackingData.estimate, icon: <Sun size={18} className="text-orange-500" /> },
//             { label: 'Carrier Status', value: trackingData.status, icon: <Truck size={18} className="text-green-500" /> }
//           ].map((stat, i) => (
//             <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
//               <div className="flex items-center gap-3 mb-2">
//                 {stat.icon}
//                 <span className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">{stat.label}</span>
//               </div>
//               <p className="text-lg font-black text-gray-900">{stat.value}</p>
//             </div>
//           ))}
//         </div>

//         {/* MAP SECTION */}
//         <div className="bg-white p-4 rounded-3xl shadow-xl border border-gray-100 overflow-hidden relative">
//           <div className="absolute top-8 left-8 z-[1000] bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-2xl border border-white/20">
//              <p className="text-[10px] font-bold text-indigo-600 uppercase mb-1">Live Feed</p>
//              <div className="flex items-center gap-2">
//                 <span className="w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
//                 <p className="text-sm font-black text-gray-900">Track: In Route to Destination</p>
//              </div>
//           </div>

//           <MapContainer center={[32.1, 74.0]} zoom={8} scrollWheelZoom={false} style={{ height: '500px', width: '100%', borderRadius: '20px' }}>
//             <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

//             {/* Warehouse Marker */}
//             <Marker position={warehouseCoords} icon={storeIcon}>
//               <Popup><div className="font-bold">Main Warehouse</div>Jhelum City</Popup>
//             </Marker>

//             {/* Destination Marker */}
//             <Marker position={destinationCoords} icon={homeIcon}>
//               <Popup><div className="font-bold">Customer Address</div>{destinationCity}</Popup>
//             </Marker>

//             {/* 🚀 MOVING TRUCK WITH DYNAMIC LABEL */}
//             <Marker position={currentTruckCoords} icon={createTruckIcon(trackingData.location)}>
//               <Popup>
//                  <div className="p-2">
//                     <p className="font-bold text-indigo-600 uppercase text-[10px]">Current Status</p>
//                     <p className="text-sm font-bold">{order.status}</p>
//                     <hr className="my-2"/>
//                     <p className="text-[10px] text-gray-500">Last scanned at {trackingData.location}</p>
//                  </div>
//               </Popup>
//             </Marker>
//           </MapContainer>
//         </div>

//       </main>
//     </div>
//   );
// };

// export default OrderDetails;



import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Pencil, Sun, Monitor, CheckCircle, MapPin, Truck, RefreshCw, XCircle } from 'lucide-react';
import { useGetOrderByIdQuery } from '../../../redux/features/orders/orderApi';
import 'remixicon/fonts/remixicon.css';

// MAP IMPORTS
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// ------------------------------------------------------------------
// ADVANCED CUSTOM ICONS
// ------------------------------------------------------------------
const createTruckIcon = (currentLocation, isRejected) => new L.DivIcon({
  html: `
    <div style="display: flex; flex-direction: column; align-items: center; width: 120px;">
      <div style="background: ${isRejected ? '#ef4444' : '#111827'}; color: white; padding: 2px 8px; border-radius: 6px; font-size: 10px; font-weight: bold; margin-bottom: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.3); white-space: nowrap;">
        ${currentLocation}
      </div>
      <div style="background-color: ${isRejected ? '#ef4444' : '#111827'}; color: white; padding: 7px; border-radius: 10px; display: flex; align-items: center; justify-content: center; width: 38px; height: 38px;">
        <i class="${isRejected ? 'ri-error-warning-line' : 'ri-truck-line'} text-xl" style="${!isRejected && 'animation: pulse 2s infinite;'}"></i>
      </div>
    </div>`,
  className: 'custom-truck-icon',
  iconSize: [120, 60],
  iconAnchor: [60, 55],
});

const storeIcon = new L.DivIcon({
  html: `<div style="background-color: white; border: 2px solid #111827; border-radius: 50%; display: flex; align-items: center; justify-content: center; width: 32px; height: 32px;"><i class="ri-store-2-line text-[#111827] text-lg"></i></div>`,
  className: 'custom-icon', iconSize: [32, 32], iconAnchor: [16, 16],
});

const homeIcon = new L.DivIcon({
  html: `<div style="background-color: white; border: 2px solid #16a34a; border-radius: 50%; display: flex; align-items: center; justify-content: center; width: 32px; height: 32px;"><i class="ri-home-4-line text-[#16a34a] text-lg"></i></div>`,
  className: 'custom-icon', iconSize: [32, 32], iconAnchor: [16, 16],
});

const OrderDetails = () => {
  const { orderId } = useParams();
  const { data: orderResponse, error, isLoading, refetch } = useGetOrderByIdQuery(orderId, {
    skip: !orderId,
    pollingInterval: 3000, 
  });

  const order = orderResponse?.order || orderResponse;

  // 1. CITY TO COORDINATES MAPPER
  const cityCoordsMap = {
    "jhelum": [32.9333, 73.7333],
    "lahore": [31.5204, 74.3587],
    "gujrat": [32.5736, 74.0789],
    "gujranwala": [32.1877, 74.1945],
    "islamabad": [33.6844, 73.0479],
    "rawalpindi": [33.5651, 73.0169],
    "sialkot": [32.4945, 74.5229],
    "karachi": [24.8607, 67.0011]
  };

  // 2. DYNAMIC LOCATION LOGIC
  const warehouseCoords = [32.9405, 73.7276]; 
  const destinationCity = order?.address?.city || "Customer Location";
  const cityKey = destinationCity.toLowerCase().trim();
  const destinationCoords = cityCoordsMap[cityKey] || [31.5204, 74.3587]; 
  const isLocalDelivery = cityKey === "jhelum";

  // 3. STATUS HANDLING
  const isRejected = order?.status?.toLowerCase() === 'rejected';
  
  const currentStep = useMemo(() => {
    if (isRejected) return 0;
    if (!order?.status) return 1;
    switch (order.status.toLowerCase()) {
      case 'pending': return 1;
      case 'processing': return 2;
      case 'shipped': return 3;
      case 'completed': return 4;
      default: return 1;
    }
  }, [order?.status, isRejected]);

  // 4. SMART TRACKING DATA (Estimate & Movement Fix)
  const trackingData = useMemo(() => {
    if (isRejected) {
      return { location: 'Order Cancelled', status: 'Rejected', estimate: 'N/A', progress: 0 };
    }

    if (isLocalDelivery) {
      const local = {
        1: { location: 'Warehouse - Jhelum', status: 'Awaiting Pack', estimate: 'Within 24 Hours', progress: 3 },
        2: { location: 'Warehouse (Packing)', status: 'Processing', estimate: 'Arriving Today', progress: 15 },
        3: { location: 'Out for Delivery (Jhelum)', status: 'Shipped', estimate: 'Within 1 Hour', progress: 85 },
        4: { location: destinationCity, status: 'Delivered', estimate: 'Delivered', progress: 100 },
      };
      return local[currentStep] || local[1];
    }

    const outstation = {
      1: { location: 'Warehouse - Jhelum', status: 'Pending', estimate: '2-3 Days', progress: 3 },
      2: { location: 'Warehouse (Loading)', status: 'Processing', estimate: '1-2 Days', progress: 15 },
      3: { location: 'In Transit (GT Road)', status: 'Shipped', estimate: 'Tomorrow', progress: 65 },
      4: { location: destinationCity, status: 'Delivered', estimate: 'Delivered', progress: 100 },
    };
    return outstation[currentStep] || outstation[1];
  }, [currentStep, destinationCity, isLocalDelivery, isRejected]);

  // 5. TRUCK POSITION MATH
  const currentTruckCoords = [
    warehouseCoords[0] + ((destinationCoords[0] - warehouseCoords[0]) * (trackingData.progress / 100)),
    warehouseCoords[1] + ((destinationCoords[1] - warehouseCoords[1]) * (trackingData.progress / 100))
  ];

  const timelineSteps = [
    { icon: Pencil, label: 'Order Created' },
    { icon: Sun, label: 'Processing' },
    { icon: Monitor, label: 'Shipped' },
    { icon: CheckCircle, label: 'Delivered' },
  ];

  if (isLoading) return <div className="min-h-screen flex items-center justify-center font-bold text-indigo-600 animate-pulse text-xl">Loading Live Tracking...</div>;
  if (error || !order) return <div className="min-h-screen flex items-center justify-center font-bold text-red-500">Error: Order Not Found.</div>;

  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans pb-20">
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-10">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-3">
               TRACK ORDER <span className={`px-3 py-1 rounded-full text-xs font-bold ${isRejected ? 'bg-red-100 text-red-600' : 'bg-indigo-100 text-indigo-600'}`}>
                {order.orderId || order._id.slice(-8).toUpperCase()}
               </span>
            </h1>
            <p className="text-xs text-gray-500 mt-2 font-semibold">PLACED ON: {new Date(order.createdAt).toLocaleString()}</p>
          </div>
          <button onClick={refetch} className="flex items-center gap-2 bg-white border border-gray-200 px-5 py-2.5 rounded-2xl text-xs font-bold shadow-sm hover:bg-gray-50 transition-all text-gray-800">
            <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} /> REFRESH LIVE STATUS
          </button>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mb-8">
          <div className="flex items-center justify-between overflow-x-auto gap-4">
            {isRejected ? (
                <div className="flex items-center gap-3 text-red-600 font-bold">
                    <XCircle size={24} /> This order was rejected/cancelled.
                </div>
            ) : (
                timelineSteps.map((step, i) => {
                    const Icon = step.icon;
                    const isActive = i < currentStep;
                    const isCurrent = i + 1 === currentStep;
                    return (
                      <div key={i} className="flex-1 min-w-[120px] relative">
                        <div className="flex items-center">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 transition-all duration-700 ${isActive ? 'bg-indigo-600 text-white shadow-lg' : 'bg-gray-100 text-gray-400'}`}>
                            <Icon size={18} />
                          </div>
                          {i !== timelineSteps.length - 1 && (
                            <div className={`flex-1 h-1 mx-2 rounded-full ${isActive ? 'bg-indigo-600' : 'bg-gray-100'}`}></div>
                          )}
                        </div>
                        <p className={`mt-4 text-[10px] font-black uppercase tracking-widest ${isCurrent ? 'text-indigo-600' : 'text-gray-400'}`}>
                          {step.label}
                        </p>
                      </div>
                    );
                  })
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { label: 'Live Location', value: trackingData.location, icon: <MapPin size={18} className="text-blue-500" /> },
            { label: 'Estimate Time', value: trackingData.estimate, icon: <Sun size={18} className="text-orange-500" /> },
            { label: 'Current Status', value: trackingData.status, icon: <Truck size={18} className="text-green-500" /> }
          ].map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="bg-gray-50 p-3 rounded-xl">{stat.icon}</div>
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">{stat.label}</span>
                <p className="text-md font-black text-gray-900">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {!isRejected && (
            <div className="mb-10 px-2">
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden border border-gray-50">
                    <div 
                        className="h-full bg-indigo-600 rounded-full transition-all duration-1000 ease-in-out shadow-[0_0_10px_rgba(79,70,229,0.5)]"
                        style={{ width: `${trackingData.progress}%` }}
                    ></div>
                </div>
            </div>
        )}

        <div className="bg-white p-3 rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden relative">
          <div className="absolute top-10 left-10 z-[1000] bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white">
             <div className="flex items-center gap-3">
                <span className={`w-2.5 h-2.5 rounded-full ${isRejected ? 'bg-red-500' : 'bg-green-500 animate-ping'}`}></span>
                <p className="text-sm font-black text-gray-800 uppercase tracking-tight">Live Tracking Active</p>
             </div>
          </div>

          <MapContainer center={isLocalDelivery ? warehouseCoords : [32.1, 74.0]} zoom={isLocalDelivery ? 12 : 8} style={{ height: '550px', width: '100%', borderRadius: '2rem' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            <Marker position={warehouseCoords} icon={storeIcon}>
              <Popup><div className="font-bold">OneCart Warehouse</div>Jhelum, Punjab</Popup>
            </Marker>

            <Marker position={destinationCoords} icon={homeIcon}>
              <Popup><div className="font-bold">Delivery Address</div>{destinationCity}</Popup>
            </Marker>

            <Marker position={currentTruckCoords} icon={createTruckIcon(trackingData.location, isRejected)}>
              <Popup>
                 <div className="p-1">
                    <p className="font-black text-indigo-600 uppercase text-[10px]">Package Info</p>
                    <p className="text-xs font-bold mt-1">Status: {trackingData.status}</p>
                 </div>
              </Popup>
            </Marker>
          </MapContainer>
        </div>
      </main>
    </div>
  );
};

export default OrderDetails;