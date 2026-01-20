import React, { useState } from 'react';
import { Trip, Vehicle, PaymentStatus } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';
import { Wallet, TrendingUp, AlertTriangle, Activity, Sparkles, ArrowRight } from 'lucide-react';
import { generateBusinessInsight } from '../services/geminiService';

interface DashboardProps {
  trips: Trip[];
  vehicles: Vehicle[];
}

const Dashboard: React.FC<DashboardProps> = ({ trips, vehicles }) => {
  const [insight, setInsight] = useState<string | null>(null);
  const [loadingInsight, setLoadingInsight] = useState(false);

  // --- Calculations ---
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const monthlyTrips = trips.filter(t => {
    const d = new Date(t.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  const totalMonthlyIncome = monthlyTrips.reduce((acc, t) => acc + t.totalAmount, 0);
  const totalMonthlyExpense = monthlyTrips.reduce((acc, t) => acc + t.totalExpense, 0);
  const totalNetProfit = totalMonthlyIncome - totalMonthlyExpense;

  const pendingPayments = trips.reduce((acc, t) => {
    return t.driverPayment.paymentStatus === PaymentStatus.PENDING 
      ? acc + t.driverPayment.balancePayable 
      : acc;
  }, 0);

  // Prepare Chart Data (Last 7 Days)
  const chartData = trips
    .slice(0, 7)
    .reverse()
    .map(t => ({
      date: new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      income: t.totalAmount,
      expense: t.totalExpense,
      profit: t.netProfit
    }));

  const handleGenerateInsight = async () => {
    setLoadingInsight(true);
    const text = await generateBusinessInsight(trips, vehicles);
    setInsight(text);
    setLoadingInsight(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Dashboard</h2>
          <p className="text-slate-500 mt-1">Overview of your fleet's financial performance.</p>
        </div>
        <button 
          onClick={handleGenerateInsight}
          disabled={loadingInsight}
          className="group relative inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-indigo-200 hover:shadow-indigo-300 hover:scale-[1.02] transition-all disabled:opacity-70 disabled:hover:scale-100"
        >
          {loadingInsight ? (
            <span className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Analyzing Data...
            </span>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-indigo-100 group-hover:text-white transition-colors" />
              <span>Generate AI Insights</span>
            </>
          )}
        </button>
      </div>

      {insight && (
        <div className="bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 p-6 rounded-2xl shadow-sm text-slate-700 text-sm leading-relaxed relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Sparkles className="w-24 h-24 text-indigo-600" />
          </div>
          <div className="relative z-10">
            <h4 className="font-bold text-indigo-900 flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4" /> AI Strategic Analysis
            </h4>
            <div className="whitespace-pre-line">{insight}</div>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard 
          title="Monthly Income" 
          value={`$${totalMonthlyIncome.toLocaleString()}`} 
          icon={Wallet} 
          color="emerald" 
        />
        <StatCard 
          title="Net Profit (Mo)" 
          value={`$${totalNetProfit.toLocaleString()}`} 
          icon={TrendingUp} 
          color="blue" 
        />
        <StatCard 
          title="Expenses (Mo)" 
          value={`$${totalMonthlyExpense.toLocaleString()}`} 
          icon={Activity} 
          color="rose" 
        />
        <StatCard 
          title="Pending Driver Pay" 
          value={`$${pendingPayments.toLocaleString()}`} 
          icon={AlertTriangle} 
          color="amber" 
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-800">Financial Trends</h3>
            <span className="text-xs font-medium text-slate-400 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">Last 7 Trips</span>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} barSize={20}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="date" 
                  tick={{fontSize: 12, fill: '#64748b'}} 
                  axisLine={false} 
                  tickLine={false} 
                  dy={10}
                />
                <YAxis 
                  tick={{fontSize: 12, fill: '#64748b'}} 
                  axisLine={false} 
                  tickLine={false}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ fontSize: '12px', fontWeight: 600 }}
                />
                <Legend iconType="circle" wrapperStyle={{paddingTop: '20px'}} />
                <Bar dataKey="income" name="Income" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expense" name="Expense" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                <Bar dataKey="profit" name="Profit" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
           <h3 className="text-lg font-bold text-slate-800 mb-6">Recent Activity</h3>
           <div className="flex-1 overflow-y-auto space-y-5 pr-2 custom-scrollbar">
             {trips.slice(0, 5).map(trip => (
               <div key={trip.id} className="group flex justify-between items-center p-3 hover:bg-slate-50 rounded-xl transition-colors border border-transparent hover:border-slate-100">
                 <div className="flex flex-col">
                   <span className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">{trip.customerName}</span>
                   <span className="text-xs text-slate-500">{new Date(trip.date).toLocaleDateString()}</span>
                 </div>
                 <div className="text-right">
                   <div className={`text-sm font-bold ${trip.netProfit >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                     {trip.netProfit >= 0 ? '+' : ''}${trip.netProfit}
                   </div>
                   <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Net Profit</div>
                 </div>
               </div>
             ))}
             {trips.length === 0 && (
               <div className="h-full flex flex-col items-center justify-center text-center text-slate-400">
                 <div className="bg-slate-50 p-4 rounded-full mb-3">
                   <Activity className="w-6 h-6 text-slate-300" />
                 </div>
                 <p className="text-sm">No recent trips recorded.</p>
               </div>
             )}
           </div>
           {trips.length > 0 && (
             <button className="mt-4 w-full py-2 text-xs font-semibold text-slate-500 hover:text-indigo-600 flex items-center justify-center gap-1 transition-colors">
               View All Trips <ArrowRight className="w-3 h-3" />
             </button>
           )}
        </div>
      </div>
    </div>
  );
};

// Internal Sub-component for better organization
const StatCard = ({ title, value, icon: Icon, color }: { title: string, value: string, icon: any, color: 'emerald' | 'blue' | 'rose' | 'amber' }) => {
  const colorStyles = {
    emerald: 'bg-emerald-100 text-emerald-600',
    blue: 'bg-blue-100 text-blue-600',
    rose: 'bg-rose-100 text-rose-600',
    amber: 'bg-amber-100 text-amber-600',
  };

  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500 font-medium mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{value}</h3>
        </div>
        <div className={`p-3 rounded-xl ${colorStyles[color]} bg-opacity-50`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;