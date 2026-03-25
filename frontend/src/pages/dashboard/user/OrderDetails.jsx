import React, { useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Pencil, Sun, Monitor, CheckCircle } from 'lucide-react';
import { useGetOrderByIdQuery } from '../../../redux/features/orders/orderApi';
import 'remixicon/fonts/remixicon.css';

//  FREE MAP IMPORTS
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// ------------------------------------------------------------------
//  CUSTOM MAP ICONS
// ------------------------------------------------------------------
const truckIcon = new L.DivIcon({
  html: `<div style="background-color: #111827; color: white; padding: 6px; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); display: flex; align-items: center; justify-content: center; width: 36px; height: 36px;">
            <i class="ri-truck-line text-xl" style="animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;"></i>
         </div>`,
  className: 'custom-leaflet-icon',
  iconSize: [36, 36],
  iconAnchor: [18, 18],
});

const storeIcon = new L.DivIcon({
  html: `<div style="background-color: white; border: 2px solid #111827; border-radius: 50%; display: flex; align-items: center; justify-content: center; width: 32px; height: 32px;">
            <i class="ri-store-2-line text-[#111827] text-lg"></i>
         </div>`,
  className: 'custom-leaflet-icon',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

const homeIcon = new L.DivIcon({
  html: `<div style="background-color: white; border: 2px solid #16a34a; border-radius: 50%; display: flex; align-items: center; justify-content: center; width: 32px; height: 32px;">
            <i class="ri-home-4-line text-[#16a34a] text-lg"></i>
         </div>`,
  className: 'custom-leaflet-icon',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

const OrderDetails = () => {
  // Grabs the ID from /orders/:orderId
  const { orderId } = useParams();
  const navigate = useNavigate();

  //  LIVE POLLING: Fetches data every 3 seconds to catch Admin updates
  const { data: orderResponse, error, isLoading, refetch } = useGetOrderByIdQuery(orderId, {
    skip: !orderId,
    pollingInterval: 3000, 
    refetchOnMountOrArgChange: true, // Forces fresh data from DB
  });

  const order = orderResponse?.order || orderResponse;

  //  DYNAMIC STATUS MAPPING
  const currentStep = useMemo(() => {
    if (!order?.status) return 1;
    switch (order.status.toLowerCase()) {
      case 'pending': return 1;
      case 'processing': return 2;
      case 'shipped': return 3;
      case 'completed': return 4;
      default: return 1;
    }
  }, [order?.status]);

  //  TRACKING DATA
  const trackingData = useMemo(() => {
    const map = {
      1: { location: 'Warehouse - Jhelum', status: 'Order Created', estimatedDelivery: 'March 23, 2026', progress: 5 },
      2: { location: 'Jhelum Processing Center', status: 'Processing', estimatedDelivery: 'March 22, 2026', progress: 30 },
      3: { location: 'Lahore Distribution Center', status: 'In Transit', estimatedDelivery: 'March 21, 2026', progress: 70 },
      4: { location: 'Delivered', status: 'Completed', estimatedDelivery: 'March 19, 2026', progress: 100 },
    };
    return map[currentStep] || map[1];
  }, [currentStep]);

  //  MAP COORDINATE MATH
  const warehouseCoords = [32.9405, 73.7276]; // Jhelum
  const destinationCoords = [31.5204, 74.3587]; // Lahore
  
  const currentTruckCoords = [
    warehouseCoords[0] + ((destinationCoords[0] - warehouseCoords[0]) * (trackingData.progress / 100)),
    warehouseCoords[1] + ((destinationCoords[1] - warehouseCoords[1]) * (trackingData.progress / 100))
  ];

  const mapCenter = [32.2304, 74.0431];

  const timelineSteps = [
    { icon: Pencil, label: 'Your order has been created and is awaiting processing.' },
    { icon: Sun, label: 'Your order is currently being processed.' },
    { icon: Monitor, label: 'Your order has been shipped.' },
    { icon: CheckCircle, label: 'Your order has been successfully completed.' },
  ];

  const timestamp = order?.createdAt ? new Date(order.createdAt).toLocaleString() : 'Loading...';

  if (isLoading) return <div className="min-h-screen flex items-center justify-center font-bold text-gray-500">Loading Order Details...</div>;
  if (error || !order) return <div className="min-h-screen flex items-center justify-center font-bold text-red-500">Error: Order Not Found.</div>;

  return (
    <div className="min-h-screen bg-white font-sans">

      {/* Content */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex justify-between items-end mb-2">
            <h2 className="text-2xl font-bold text-gray-900 capitalize">Payment {order.status}</h2>
            {/* Fallback Refresh Button just in case */}
            <button onClick={refetch} className="text-xs text-indigo-600 font-bold bg-indigo-50 px-3 py-1 rounded-full hover:bg-indigo-100">
                <i className="ri-refresh-line mr-1"></i> Refresh Status
            </button>
        </div>
        <p className="text-sm text-gray-700 mb-1">Order ID: #{order._id}</p>
        <p className="text-sm text-gray-700 mb-10 capitalize">Status: {order.status}</p>

        {/* Timeline */}
        <div className="flex items-start justify-between mb-16 overflow-x-auto">
          {timelineSteps.map((step, i) => {
            const Icon = step.icon;
            const isActive = i < currentStep;
            const isLast = i === timelineSteps.length - 1;
            return (
              <div key={i} className="flex-1 flex flex-col items-start relative min-w-[150px]">
                <div className="flex items-center w-full">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors duration-500 ${isActive ? 'text-gray-900 bg-gray-100' : 'text-gray-300'}`}>
                    <Icon size={18} />
                  </div>
                  {!isLast && (
                    <div className={`flex-1 h-px transition-colors duration-500 ${isActive ? 'bg-gray-900' : 'bg-gray-300'}`}></div>
                  )}
                </div>
                <div className="mt-3 pr-4">
                  <p className="text-xs text-gray-500 mb-1">{i === 0 ? timestamp : ''}</p>
                  <p className="text-xs text-gray-400 leading-relaxed">{step.label}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Live Tracking Section */}
        <div className="border-t border-gray-200 pt-8">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <i className="ri-map-pin-line text-blue-600"></i> Live Map Tracking
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <p className="text-xs text-gray-500 mb-1">Current Location</p>
              <p className="text-sm text-gray-900 font-medium">{trackingData.location}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Estimated Delivery</p>
              <p className="text-sm text-gray-900 font-medium">{trackingData.estimatedDelivery}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Tracking Status</p>
              <p className="text-sm text-gray-900 font-medium">{trackingData.status}</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between text-xs text-gray-500 mb-2">
              <span>Order Created</span>
              <span>Processing</span>
              <span>Shipped</span>
              <span>Delivered</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gray-900 rounded-full transition-all duration-1000 ease-in-out"
                style={{ width: `${trackingData.progress}%` }}
              ></div>
            </div>
          </div>

          {/*  REAL GEOGRAPHICAL MAP */}
          <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm relative z-0">
            <MapContainer 
                center={mapCenter} 
                zoom={8} 
                scrollWheelZoom={false} 
                style={{ height: '400px', width: '100%', zIndex: 0 }}
            >
              <TileLayer
                attribution='&copy; OpenStreetMap'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {/* Start Pin */}
              <Marker position={warehouseCoords} icon={storeIcon}>
                <Popup><b>Warehouse</b><br/>Jhelum, Punjab</Popup>
              </Marker>

              {/* End Pin */}
              <Marker position={destinationCoords} icon={homeIcon}>
                <Popup><b>Delivery Address</b><br/>Lahore, Punjab</Popup>
              </Marker>

              {/* Live Truck */}
              <Marker position={currentTruckCoords} icon={truckIcon}>
                <Popup>
                    <b>Status: {order.status}</b><br/>
                    {currentStep === 4 ? 'Package Delivered!' : 'On the way to destination...'}
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OrderDetails;