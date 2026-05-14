import React from 'react';
import { useSelector } from 'react-redux';
import { useGetUserStatsQuery } from '../../../../redux/features/stats/statsApi';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import UserStats from './UserStats';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const UserDMain = () => {
  const { user } = useSelector((state) => state.auth);
  const { data: stats, error, isLoading } = useGetUserStatsQuery(user?.email);

  if (isLoading) return <p className="text-center text-gray-400 mt-10 animate-pulse font-medium tracking-widest">Loading stats...</p>;
  if (!stats) return <p className="text-center text-gray-500 mt-10">No stats available.</p>;

  // Humne data ko do alag datasets mein divide kiya hai taake dono scales par bars bari nazar ayen
  const finalData = {
    labels: ['Total Payments', 'Total Reviews', 'Purchased Items'],
    datasets: [
      {
        label: 'Payments',
        data: [Number(stats.totalPayments) || 0, 0, 0],
        backgroundColor: 'rgba(99, 102, 241, 0.8)',
        yAxisID: 'y',
        borderRadius: 8,
        barThickness: 35, // 👈 Width yahan se kam ki hai
      },
      {
        label: 'Counts',
        data: [0, Number(stats.totalReviews) || 0, Number(stats.totalPurchasedProducts) || 0],
        backgroundColor: ['transparent', 'rgba(245, 158, 11, 0.8)', 'rgba(34, 197, 94, 0.8)'],
        yAxisID: 'y1',
        borderRadius: 8,
        barThickness: 35, // 👈 Width yahan se kam ki hai
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#fff',
        titleColor: '#1e293b',
        bodyColor: '#64748b',
        borderColor: '#f1f5f9',
        borderWidth: 1,
        padding: 12,
      },
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        beginAtZero: true,
        grid: { color: '#f8fafc', drawBorder: false },
        ticks: {
          color: '#6366f1',
          font: { size: 10, weight: '600' },
          callback: (value) => 'Rs.' + value.toLocaleString()
        }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        beginAtZero: true,
        // Choti values ko bara dikhane ke liye max limit adjust ki hai
        max: Math.max(Number(stats.totalReviews), Number(stats.totalPurchasedProducts)) + 10,
        grid: { drawOnChartArea: false },
        ticks: {
          color: '#f59e0b',
          font: { size: 10, weight: '600' }
        }
      },
      x: {
        stacked: true, // Bars ko ek dusre ke upar overlap hone se bachane ke liye
        grid: { display: false },
        ticks: { color: '#64748b', font: { size: 11, weight: '600' } }
      }
    }
  };

  return (
    <div className="p-6 bg-[#f8fafc] min-h-screen">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight uppercase">User Dashboard</h1>
        <p className="text-sm text-slate-400 font-medium">Activity Analytics for {user?.username || 'User'}</p>
      </div>

      <UserStats stats={stats}/>
      
      <div className="mt-10 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.03)] relative overflow-hidden">
        
        {/* Soft Background Glows */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/50 rounded-full blur-[80px] -mr-32 -mt-32"></div>
        
        <div className="flex items-center justify-between mb-10 relative z-10">
            <div>
                <h2 className="text-sm font-bold text-slate-700">Balanced Performance View</h2>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mt-1">Dual-Scale Analytics</p>
            </div>
            <div className="flex gap-4 bg-slate-50/50 p-2 rounded-xl border border-slate-100">
                <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                    <span className="text-[9px] font-black text-slate-500 uppercase">Cash</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                    <span className="text-[9px] font-black text-slate-500 uppercase">Counts</span>
                </div>
            </div>
        </div>
        
        <div className="h-[400px] w-full relative z-10">
          <Bar data={finalData} options={options} />
        </div>
      </div>
    </div>
  );
};

export default UserDMain;