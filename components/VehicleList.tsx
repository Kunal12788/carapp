import React, { useState } from 'react';
import { Vehicle } from '../types';
import { Truck, AlertTriangle, CheckCircle2, Plus, Trash2, Calendar, Wrench } from 'lucide-react';

interface VehicleListProps {
  vehicles: Vehicle[];
  onAdd: (v: Vehicle) => void;
  onDelete: (id: string) => void;
}

const VehicleList: React.FC<VehicleListProps> = ({ vehicles, onAdd, onDelete }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newVehicle, setNewVehicle] = useState<Partial<Vehicle>>({});

  const isUrgent = (dateStr: string) => {
    if (!dateStr) return false;
    const due = new Date(dateStr);
    const today = new Date();
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays < 7; // Urgent if less than 7 days
  };

  const handleSave = () => {
    if (newVehicle.registrationNumber && newVehicle.makeModel) {
      const v: Vehicle = {
        id: Math.random().toString(36).substr(2, 9),
        registrationNumber: newVehicle.registrationNumber,
        makeModel: newVehicle.makeModel,
        lastServiceDate: newVehicle.lastServiceDate || '',
        nextServiceDueDate: newVehicle.nextServiceDueDate || '',
        oilChangeDate: '',
        tyreChangeDate: '',
        brakeServiceDate: '',
        batteryReplacementDate: '',
        insuranceExpiryDate: newVehicle.insuranceExpiryDate || '',
        pollutionExpiryDate: ''
      };
      onAdd(v);
      setIsAdding(false);
      setNewVehicle({});
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
           <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Fleet Assets</h2>
           <p className="text-slate-500 mt-1">Manage vehicles and track maintenance schedules.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)} 
          className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
        >
          <Plus className="w-4 h-4" /> Add Vehicle
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-6 rounded-2xl shadow-xl border border-indigo-100 animate-in fade-in slide-in-from-top-4 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
          <h3 className="font-bold text-lg text-slate-900 mb-6">Register New Vehicle</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase">Registration</label>
              <input placeholder="e.g. NY-555" className="border border-slate-200 p-3 rounded-lg w-full text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition" onChange={e => setNewVehicle({...newVehicle, registrationNumber: e.target.value})} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase">Make & Model</label>
              <input placeholder="e.g. Toyota Sienna" className="border border-slate-200 p-3 rounded-lg w-full text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition" onChange={e => setNewVehicle({...newVehicle, makeModel: e.target.value})} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase">Next Service Due</label>
              <input type="date" className="border border-slate-200 p-3 rounded-lg w-full text-sm text-slate-600 focus:ring-2 focus:ring-indigo-500 outline-none" onChange={e => setNewVehicle({...newVehicle, nextServiceDueDate: e.target.value})} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase">Insurance Expiry</label>
              <input type="date" className="border border-slate-200 p-3 rounded-lg w-full text-sm text-slate-600 focus:ring-2 focus:ring-indigo-500 outline-none" onChange={e => setNewVehicle({...newVehicle, insuranceExpiryDate: e.target.value})} />
            </div>
          </div>
          <div className="flex gap-3 justify-end pt-4 border-t border-slate-100">
            <button onClick={() => setIsAdding(false)} className="px-5 py-2.5 text-sm font-medium text-slate-500 hover:text-slate-800 transition">Cancel</button>
            <button onClick={handleSave} className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition shadow-md shadow-indigo-200">Save Vehicle</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicles.map(v => (
          <div key={v.id} className="group bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg hover:border-indigo-100 transition-all duration-300">
            <div className="p-5 border-b border-slate-100 flex justify-between items-start bg-gradient-to-br from-slate-50 to-white">
              <div className="flex gap-4">
                <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm group-hover:scale-110 transition-transform">
                  <Truck className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg tracking-tight">{v.registrationNumber}</h3>
                  <p className="text-xs font-medium text-slate-500">{v.makeModel}</p>
                </div>
              </div>
              <button onClick={() => onDelete(v.id)} className="text-slate-300 hover:text-rose-500 transition-colors p-1">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between group/item">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
                    <Wrench className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Next Service</p>
                    <p className={`text-sm font-semibold ${isUrgent(v.nextServiceDueDate) ? 'text-rose-600' : 'text-slate-700'}`}>
                      {v.nextServiceDueDate || 'Not Scheduled'}
                    </p>
                  </div>
                </div>
                {isUrgent(v.nextServiceDueDate) && <AlertTriangle className="w-5 h-5 text-rose-500 animate-pulse" />}
              </div>

              <div className="flex items-center justify-between group/item">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Insurance</p>
                    <p className={`text-sm font-semibold ${isUrgent(v.insuranceExpiryDate) ? 'text-rose-600' : 'text-slate-700'}`}>
                      {v.insuranceExpiryDate || 'Not Scheduled'}
                    </p>
                  </div>
                </div>
                {isUrgent(v.insuranceExpiryDate) && <AlertTriangle className="w-5 h-5 text-rose-500 animate-pulse" />}
              </div>

              <div className="pt-4 mt-2 border-t border-slate-100">
                 <div className="flex items-center gap-2 text-xs font-medium text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full w-fit">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Active in Fleet
                 </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VehicleList;