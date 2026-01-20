import React, { useState } from 'react';
import { Trip, Vehicle, PaymentStatus } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';
import { Wallet, TrendingUp, AlertTriangle, Activity, Sparkles } from 'lucide-react';
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
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Operational Overview</h2>
        <button 
          onClick={handleGenerateInsight}
          disabled={loadingInsight}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-50"
        >
          {loadingInsight ? (
            <span>Analyzing...</span>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>AI Analysis</span>
            </>
          )}
        </button>
      </div>

      {insight && (
        <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-xl text-indigo-900 text-sm whitespace-pre-line">
          <strong>AI Insights:</strong>
          <div className="mt-2">{insight}</div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 text-green-600 rounded-full">
              <Wallet className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Monthly Income</p>
              <h3 className="text-2xl font-bold text-slate-900">${totalMonthlyIncome.toLocaleString()}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Net Profit (Mo)</p>
              <h3 className="text-2xl font-bold text-slate-900">${totalNetProfit.toLocaleString()}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-100 text-red-600 rounded-full">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Expenses (Mo)</p>
              <h3 className="text-2xl font-bold text-slate-900">${totalMonthlyExpense.toLocaleString()}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-100 text-orange-600 rounded-full">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Pending Driver Pay</p>
              <h3 className="text-2xl font-bold text-slate-900">${pendingPayments.toLocaleString()}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 lg:col-span-2">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Financial Trends (Last 7 Trips)</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" tick={{fontSize: 12}} />
                <YAxis tick={{fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                  itemStyle={{ fontSize: '12px' }}
                />
                <Legend />
                <Bar dataKey="income" name="Income" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expense" name="Expense" fill="#ef4444" radius={[4, 4, 0, 0]} />
                <Bar dataKey="profit" name="Profit" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
           <h3 className="text-lg font-semibold text-slate-800 mb-4">Recent Trips</h3>
           <div className="space-y-4">
             {trips.slice(0, 5).map(trip => (
               <div key={trip.id} className="flex justify-between items-center pb-3 border-b border-slate-50 last:border-0 last:pb-0">
                 <div>
                   <p className="text-sm font-medium text-slate-900">{trip.customerName}</p>
                   <p className="text-xs text-slate-500">{new Date(trip.date).toLocaleDateString()}</p>
                 </div>
                 <span className={`text-sm font-bold ${trip.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                   {trip.netProfit >= 0 ? '+' : ''}${trip.netProfit}
                 </span>
               </div>
             ))}
             {trips.length === 0 && <p className="text-sm text-slate-400">No trips recorded yet.</p>}
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;