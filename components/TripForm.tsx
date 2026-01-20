import React, { useState, useEffect } from 'react';
import { Trip, Vehicle, PaymentMode, PaymentStatus } from '../types';
import { X, Save, Calculator, Calendar, MapPin, User, Truck, DollarSign } from 'lucide-react';

interface TripFormProps {
  onSave: (trip: Trip) => void;
  onClose: () => void;
  vehicles: Vehicle[];
  initialData?: Trip | null;
}

const TripForm: React.FC<TripFormProps> = ({ onSave, onClose, vehicles, initialData }) => {
  // --- State Initialization ---
  const [formData, setFormData] = useState<Partial<Trip>>({
    date: new Date().toISOString().split('T')[0],
    vehicleId: vehicles[0]?.id || '',
    driverName: '',
    driverContact: '',
    customerName: '',
    customerContact: '',
    pickupLocation: '',
    dropLocation: '',
    startTime: '',
    endTime: '',
    totalAmount: 0,
    startOdometer: 0,
    endOdometer: 0,
    notes: '',
    expenses: {
      fuelCost: 0,
      fuelQty: 0,
      tollCharges: 0,
      parkingCharges: 0,
      otherExpenses: 0
    },
    driverPayment: {
      totalDriverPay: 0,
      advancePaid: 0,
      balancePayable: 0,
      paymentStatus: PaymentStatus.PENDING,
      paymentMode: PaymentMode.CASH
    }
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  // --- Handlers ---
  
  const updateField = (field: keyof Trip, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateExpense = (field: keyof Trip['expenses'], value: number) => {
    setFormData(prev => ({
      ...prev,
      expenses: { ...prev.expenses!, [field]: value }
    }));
  };

  const updateDriverPay = (field: keyof Trip['driverPayment'], value: any) => {
    setFormData(prev => ({
      ...prev,
      driverPayment: { ...prev.driverPayment!, [field]: value }
    }));
  };

  // --- Derived Calculations on Submit (or real-time for display) ---
  const calculateFinancials = () => {
    const expenses = formData.expenses!;
    const driver = formData.driverPayment!;
    
    // Total Expense = Fuel + Toll + Parking + Other + Driver Pay
    const totalExpense = 
      expenses.fuelCost + 
      expenses.tollCharges + 
      expenses.parkingCharges + 
      expenses.otherExpenses + 
      driver.totalDriverPay;

    // Net Profit
    const netProfit = (formData.totalAmount || 0) - totalExpense;

    // Distance
    const totalDistance = (formData.endOdometer || 0) - (formData.startOdometer || 0);

    // Driver Balance
    const balancePayable = driver.totalDriverPay - driver.advancePaid;
    const paymentStatus = balancePayable <= 0 ? PaymentStatus.PAID : PaymentStatus.PENDING;

    return { totalExpense, netProfit, totalDistance, balancePayable, paymentStatus };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const calculations = calculateFinancials();

    const finalTrip: Trip = {
      ...(formData as Trip),
      id: initialData?.id || Math.random().toString(36).substr(2, 9),
      totalDistance: calculations.totalDistance,
      totalExpense: calculations.totalExpense,
      netProfit: calculations.netProfit,
      driverPayment: {
        ...formData.driverPayment!,
        balancePayable: calculations.balancePayable,
        paymentStatus: calculations.paymentStatus
      }
    };

    onSave(finalTrip);
  };

  const stats = calculateFinancials();

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-100 px-8 py-5 flex justify-between items-center z-10 rounded-t-2xl">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
              {initialData ? 'Edit Trip Details' : 'Record New Trip'}
            </h2>
            <p className="text-sm text-slate-500">Fill in the operational and financial details.</p>
          </div>
          <button onClick={onClose} className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-500 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8 flex-1 overflow-y-auto">
          
          {/* Section 1: Core Info */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-5">
               <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 space-y-4">
                  <div className="flex items-center gap-2 text-indigo-600 font-semibold text-sm mb-2">
                    <Calendar className="w-4 h-4" /> Trip Schedule
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1.5">Date</label>
                    <input required type="date" value={formData.date} onChange={e => updateField('date', e.target.value)} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-500 mb-1.5">Start Time</label>
                      <input type="time" value={formData.startTime} onChange={e => updateField('startTime', e.target.value)} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-500 mb-1.5">End Time</label>
                      <input type="time" value={formData.endTime} onChange={e => updateField('endTime', e.target.value)} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                    </div>
                  </div>
               </div>

               <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 space-y-4">
                   <div className="flex items-center gap-2 text-indigo-600 font-semibold text-sm mb-2">
                    <MapPin className="w-4 h-4" /> Route
                  </div>
                  <div className="space-y-3">
                    <input placeholder="Pickup Location" value={formData.pickupLocation} onChange={e => updateField('pickupLocation', e.target.value)} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                    <input placeholder="Drop Location" value={formData.dropLocation} onChange={e => updateField('dropLocation', e.target.value)} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                  </div>
               </div>
            </div>

            <div className="md:col-span-4 bg-emerald-50/50 p-6 rounded-xl border border-emerald-100">
               <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm mb-4">
                  <DollarSign className="w-4 h-4" /> Revenue
               </div>
               <label className="block text-xs font-medium text-emerald-700 mb-2">Total Trip Income</label>
               <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500 font-bold text-lg">$</span>
                  <input required type="number" min="0" value={formData.totalAmount} onChange={e => updateField('totalAmount', parseFloat(e.target.value) || 0)} className="w-full border border-emerald-200 rounded-xl py-3 pl-8 pr-4 text-2xl font-bold text-emerald-700 bg-white focus:ring-2 focus:ring-emerald-500 outline-none placeholder-emerald-200" placeholder="0.00" />
               </div>
               <p className="text-xs text-emerald-600 mt-2 opacity-80">Enter the gross amount billed to the customer.</p>
            </div>
          </div>

          {/* Section 2: Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
               <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                 <User className="w-3 h-3" /> Customer & Driver
               </h3>
               <div className="grid grid-cols-2 gap-3">
                 <input placeholder="Customer Name" value={formData.customerName} onChange={e => updateField('customerName', e.target.value)} className="col-span-2 border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                 <input placeholder="Customer Phone" value={formData.customerContact} onChange={e => updateField('customerContact', e.target.value)} className="col-span-2 md:col-span-1 border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                 
                 <div className="col-span-2 h-px bg-slate-100 my-1"></div>

                 <input placeholder="Driver Name" value={formData.driverName} onChange={e => updateField('driverName', e.target.value)} className="col-span-2 md:col-span-1 border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                 <input placeholder="Driver Phone" value={formData.driverContact} onChange={e => updateField('driverContact', e.target.value)} className="col-span-2 md:col-span-1 border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
               </div>
            </div>
            
            <div className="space-y-4">
               <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                 <Truck className="w-3 h-3" /> Vehicle Log
               </h3>
               <select required value={formData.vehicleId} onChange={e => updateField('vehicleId', e.target.value)} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white">
                  <option value="">Select Vehicle Used</option>
                  {vehicles.map(v => <option key={v.id} value={v.id}>{v.registrationNumber} - {v.makeModel}</option>)}
               </select>

               <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div>
                     <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Start Odometer</label>
                     <input type="number" value={formData.startOdometer} onChange={e => updateField('startOdometer', parseFloat(e.target.value)||0)} className="w-full bg-white border border-slate-200 rounded p-2 text-sm font-mono" />
                  </div>
                  <div>
                     <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">End Odometer</label>
                     <input type="number" value={formData.endOdometer} onChange={e => updateField('endOdometer', parseFloat(e.target.value)||0)} className="w-full bg-white border border-slate-200 rounded p-2 text-sm font-mono" />
                  </div>
                  <div className="col-span-2 text-right">
                     <span className="text-xs text-slate-500">Total Distance: </span>
                     <span className="font-bold text-slate-800">{stats.totalDistance} km</span>
                  </div>
               </div>
            </div>
          </div>

          <div className="h-px bg-slate-100"></div>

          {/* Section 3: Financial Breakdown */}
          <div>
            <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Calculator className="w-4 h-4 text-slate-500" /> Expense Breakdown
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div>
                <label className="block text-xs text-slate-500 mb-1.5">Fuel Cost</label>
                <input type="number" value={formData.expenses?.fuelCost} onChange={e => updateExpense('fuelCost', parseFloat(e.target.value) || 0)} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-rose-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1.5">Fuel Qty (L)</label>
                <input type="number" value={formData.expenses?.fuelQty} onChange={e => updateExpense('fuelQty', parseFloat(e.target.value) || 0)} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-slate-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1.5">Tolls</label>
                <input type="number" value={formData.expenses?.tollCharges} onChange={e => updateExpense('tollCharges', parseFloat(e.target.value) || 0)} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-rose-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1.5">Parking</label>
                <input type="number" value={formData.expenses?.parkingCharges} onChange={e => updateExpense('parkingCharges', parseFloat(e.target.value) || 0)} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-rose-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1.5">Other</label>
                <input type="number" value={formData.expenses?.otherExpenses} onChange={e => updateExpense('otherExpenses', parseFloat(e.target.value) || 0)} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-rose-500 outline-none" />
              </div>
            </div>
          </div>

          {/* Section 4: Driver Payment Card */}
          <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100">
            <h3 className="text-sm font-bold text-amber-800 mb-4">Driver Payment Settlement</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label className="block text-xs font-semibold text-amber-700 mb-1.5 uppercase">Total Payable</label>
                <input type="number" value={formData.driverPayment?.totalDriverPay} onChange={e => updateDriverPay('totalDriverPay', parseFloat(e.target.value) || 0)} className="w-full border border-amber-200 bg-white rounded-lg p-2.5 text-sm font-semibold" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-amber-700 mb-1.5 uppercase">Advance Paid</label>
                <input type="number" value={formData.driverPayment?.advancePaid} onChange={e => updateDriverPay('advancePaid', parseFloat(e.target.value) || 0)} className="w-full border border-amber-200 bg-white rounded-lg p-2.5 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-amber-700 mb-1.5 uppercase">Mode</label>
                <select value={formData.driverPayment?.paymentMode} onChange={e => updateDriverPay('paymentMode', e.target.value)} className="w-full border border-amber-200 bg-white rounded-lg p-2.5 text-sm">
                  {Object.values(PaymentMode).map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div className="flex flex-col justify-end items-end">
                <div className="text-xs text-amber-600 font-semibold uppercase mb-1">Balance Due</div>
                <div className="text-2xl font-bold text-amber-900">${stats.balancePayable}</div>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1.5">Additional Notes</label>
            <textarea value={formData.notes} onChange={e => updateField('notes', e.target.value)} rows={3} className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none" placeholder="Any vehicle issues, customer feedback, or route deviations..." />
          </div>

        </form>

        {/* Footer Bar */}
        <div className="bg-slate-900 text-white p-6 rounded-b-2xl flex flex-col md:flex-row justify-between items-center shadow-lg gap-4">
             <div className="flex gap-8">
                <div>
                   <span className="block text-xs text-slate-400 uppercase font-bold tracking-wider">Total Expense</span>
                   <span className="text-xl font-bold font-mono">${stats.totalExpense}</span>
                </div>
                <div>
                   <span className="block text-xs text-slate-400 uppercase font-bold tracking-wider">Net Profit</span>
                   <span className={`text-xl font-bold font-mono ${stats.netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      ${stats.netProfit}
                   </span>
                </div>
             </div>
             <button type="button" onClick={handleSubmit} className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-900/50 hover:scale-105 active:scale-95">
               <Save className="w-5 h-5" /> Save Trip Entry
             </button>
        </div>
      </div>
    </div>
  );
};

export default TripForm;