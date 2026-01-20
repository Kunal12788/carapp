import React, { useState, useEffect } from 'react';
import { Trip, Vehicle, PaymentMode, PaymentStatus } from '../types';
import { X, Save, Calculator } from 'lucide-react';

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
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center z-10">
          <h2 className="text-xl font-bold text-slate-800">
            {initialData ? 'Edit Trip' : 'New Trip Entry'}
          </h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-800">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          
          {/* Section 1: Basic Info */}
          <div>
            <h3 className="text-sm uppercase tracking-wide text-slate-500 font-semibold mb-3 border-b pb-1">Trip Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Date</label>
                <input required type="date" value={formData.date} onChange={e => updateField('date', e.target.value)} className="w-full border rounded-lg p-2 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Vehicle</label>
                <select required value={formData.vehicleId} onChange={e => updateField('vehicleId', e.target.value)} className="w-full border rounded-lg p-2 text-sm">
                  <option value="">Select Vehicle</option>
                  {vehicles.map(v => <option key={v.id} value={v.id}>{v.registrationNumber} ({v.makeModel})</option>)}
                </select>
              </div>
              <div>
                 <label className="block text-xs font-medium text-slate-600 mb-1">Total Trip Amount (Income)</label>
                 <div className="relative">
                    <span className="absolute left-3 top-2 text-slate-400">$</span>
                    <input required type="number" min="0" value={formData.totalAmount} onChange={e => updateField('totalAmount', parseFloat(e.target.value) || 0)} className="w-full border rounded-lg p-2 pl-6 text-sm font-semibold text-green-700 bg-green-50" />
                 </div>
              </div>
            </div>
          </div>

          {/* Section 2: Customer & Route */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-500 uppercase">Customer & Route</h3>
              <div className="grid grid-cols-2 gap-2">
                <input placeholder="Customer Name" value={formData.customerName} onChange={e => updateField('customerName', e.target.value)} className="w-full border rounded-lg p-2 text-sm" />
                <input placeholder="Contact #" value={formData.customerContact} onChange={e => updateField('customerContact', e.target.value)} className="w-full border rounded-lg p-2 text-sm" />
                <input placeholder="Pickup Loc" value={formData.pickupLocation} onChange={e => updateField('pickupLocation', e.target.value)} className="w-full border rounded-lg p-2 text-sm" />
                <input placeholder="Drop Loc" value={formData.dropLocation} onChange={e => updateField('dropLocation', e.target.value)} className="w-full border rounded-lg p-2 text-sm" />
                <input type="time" title="Start Time" value={formData.startTime} onChange={e => updateField('startTime', e.target.value)} className="w-full border rounded-lg p-2 text-sm" />
                <input type="time" title="End Time" value={formData.endTime} onChange={e => updateField('endTime', e.target.value)} className="w-full border rounded-lg p-2 text-sm" />
              </div>
            </div>
            
            <div className="space-y-3">
               <h3 className="text-xs font-bold text-slate-500 uppercase">Driver & Vehicle Stats</h3>
               <div className="grid grid-cols-2 gap-2">
                 <input placeholder="Driver Name" value={formData.driverName} onChange={e => updateField('driverName', e.target.value)} className="w-full border rounded-lg p-2 text-sm" />
                 <input placeholder="Driver Phone" value={formData.driverContact} onChange={e => updateField('driverContact', e.target.value)} className="w-full border rounded-lg p-2 text-sm" />
                 <div className="col-span-2 grid grid-cols-2 gap-2">
                    <div className="bg-slate-50 p-2 rounded border">
                       <label className="block text-[10px] text-slate-400">Start Odometer</label>
                       <input type="number" value={formData.startOdometer} onChange={e => updateField('startOdometer', parseFloat(e.target.value)||0)} className="w-full bg-transparent text-sm font-mono" />
                    </div>
                    <div className="bg-slate-50 p-2 rounded border">
                       <label className="block text-[10px] text-slate-400">End Odometer</label>
                       <input type="number" value={formData.endOdometer} onChange={e => updateField('endOdometer', parseFloat(e.target.value)||0)} className="w-full bg-transparent text-sm font-mono" />
                    </div>
                 </div>
               </div>
            </div>
          </div>

          {/* Section 3: Expenses */}
          <div>
            <h3 className="text-sm uppercase tracking-wide text-slate-500 font-semibold mb-3 border-b pb-1">Expenses & Fuel</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              <div>
                <label className="block text-xs text-slate-600 mb-1">Fuel Cost</label>
                <input type="number" value={formData.expenses?.fuelCost} onChange={e => updateExpense('fuelCost', parseFloat(e.target.value) || 0)} className="w-full border rounded-lg p-2 text-sm" />
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1">Fuel Qty (L)</label>
                <input type="number" value={formData.expenses?.fuelQty} onChange={e => updateExpense('fuelQty', parseFloat(e.target.value) || 0)} className="w-full border rounded-lg p-2 text-sm" />
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1">Tolls</label>
                <input type="number" value={formData.expenses?.tollCharges} onChange={e => updateExpense('tollCharges', parseFloat(e.target.value) || 0)} className="w-full border rounded-lg p-2 text-sm" />
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1">Parking</label>
                <input type="number" value={formData.expenses?.parkingCharges} onChange={e => updateExpense('parkingCharges', parseFloat(e.target.value) || 0)} className="w-full border rounded-lg p-2 text-sm" />
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1">Other</label>
                <input type="number" value={formData.expenses?.otherExpenses} onChange={e => updateExpense('otherExpenses', parseFloat(e.target.value) || 0)} className="w-full border rounded-lg p-2 text-sm" />
              </div>
            </div>
          </div>

          {/* Section 4: Driver Payment */}
          <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
            <h3 className="text-sm font-bold text-orange-800 mb-3 flex items-center gap-2">
              <Calculator className="w-4 h-4" /> Driver Payment
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-orange-700 mb-1">Total Payable</label>
                <input type="number" value={formData.driverPayment?.totalDriverPay} onChange={e => updateDriverPay('totalDriverPay', parseFloat(e.target.value) || 0)} className="w-full border border-orange-200 rounded-lg p-2 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-orange-700 mb-1">Advance Paid</label>
                <input type="number" value={formData.driverPayment?.advancePaid} onChange={e => updateDriverPay('advancePaid', parseFloat(e.target.value) || 0)} className="w-full border border-orange-200 rounded-lg p-2 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-orange-700 mb-1">Payment Mode</label>
                <select value={formData.driverPayment?.paymentMode} onChange={e => updateDriverPay('paymentMode', e.target.value)} className="w-full border border-orange-200 rounded-lg p-2 text-sm bg-white">
                  {Object.values(PaymentMode).map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div className="flex flex-col justify-end">
                <div className="text-xs text-orange-600 font-semibold uppercase">Balance</div>
                <div className="text-xl font-bold text-orange-900">${stats.balancePayable}</div>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs text-slate-600 mb-1">Notes / Remarks</label>
            <textarea value={formData.notes} onChange={e => updateField('notes', e.target.value)} rows={3} className="w-full border rounded-lg p-2 text-sm" placeholder="Any issues, route deviations, or special requests..." />
          </div>

          {/* Live Preview Bar */}
          <div className="bg-slate-900 text-white p-4 rounded-xl flex flex-col md:flex-row justify-between items-center shadow-lg">
             <div className="flex gap-6 mb-2 md:mb-0">
                <div>
                   <span className="block text-xs text-slate-400">Total Expense</span>
                   <span className="text-lg font-bold">${stats.totalExpense}</span>
                </div>
                <div>
                   <span className="block text-xs text-slate-400">Net Profit</span>
                   <span className={`text-lg font-bold ${stats.netProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      ${stats.netProfit}
                   </span>
                </div>
                <div>
                   <span className="block text-xs text-slate-400">Distance</span>
                   <span className="text-lg font-bold">{stats.totalDistance} km</span>
                </div>
             </div>
             <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-2 rounded-lg font-semibold flex items-center gap-2 transition">
               <Save className="w-5 h-5" /> Save Trip
             </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default TripForm;