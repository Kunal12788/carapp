import React, { useState } from 'react';
import { Vehicle } from '../types';
import { Truck, AlertTriangle, CheckCircle, Plus, Trash2 } from 'lucide-react';

interface VehicleListProps {
  vehicles: Vehicle[];
  onAdd: (v: Vehicle) => void;
  onDelete: (id: string) => void;
}

const VehicleList: React.FC<VehicleListProps> = ({ vehicles, onAdd, onDelete }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newVehicle, setNewVehicle] = useState<Partial<Vehicle>>({});

  const isUrgent = (dateStr: string) => {
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-800">Fleet Maintenance</h2>
        <button onClick={() => setIsAdding(true)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
          <Plus className="w-4 h-4" /> Add Vehicle
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-blue-200 animate-in fade-in slide-in-from-top-4">
          <h3 className="font-semibold mb-4">New Vehicle Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input placeholder="Registration Number (e.g. NY-555)" className="border p-2 rounded" onChange={e => setNewVehicle({...newVehicle, registrationNumber: e.target.value})} />
            <input placeholder="Make & Model (e.g. Toyota Sienna)" className="border p-2 rounded" onChange={e => setNewVehicle({...newVehicle, makeModel: e.target.value})} />
            <div className="col-span-1">
                <label className="text-xs text-slate-500 block">Next Service Due</label>
                <input type="date" className="border p-2 rounded w-full" onChange={e => setNewVehicle({...newVehicle, nextServiceDueDate: e.target.value})} />
            </div>
            <div className="col-span-1">
                <label className="text-xs text-slate-500 block">Insurance Expiry</label>
                <input type="date" className="border p-2 rounded w-full" onChange={e => setNewVehicle({...newVehicle, insuranceExpiryDate: e.target.value})} />
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={() => setIsAdding(false)} className="text-slate-500 px-4 py-2">Cancel</button>
            <button onClick={handleSave} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">Save Vehicle</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicles.map(v => (
          <div key={v.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition">
            <div className="p-4 border-b border-slate-100 flex justify-between items-start bg-slate-50">
              <div className="flex gap-3">
                <div className="bg-white p-2 rounded-lg border">
                  <Truck className="w-6 h-6 text-slate-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">{v.registrationNumber}</h3>
                  <p className="text-xs text-slate-500">{v.makeModel}</p>
                </div>
              </div>
              <button onClick={() => onDelete(v.id)} className="text-slate-400 hover:text-red-500">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Next Service</span>
                <span className={`font-medium flex items-center gap-1 ${isUrgent(v.nextServiceDueDate) ? 'text-red-600' : 'text-slate-700'}`}>
                   {isUrgent(v.nextServiceDueDate) && <AlertTriangle className="w-3 h-3" />}
                   {v.nextServiceDueDate || 'N/A'}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Insurance</span>
                <span className={`font-medium flex items-center gap-1 ${isUrgent(v.insuranceExpiryDate) ? 'text-red-600' : 'text-slate-700'}`}>
                   {isUrgent(v.insuranceExpiryDate) && <AlertTriangle className="w-3 h-3" />}
                   {v.insuranceExpiryDate || 'N/A'}
                </span>
              </div>
              <div className="pt-2 mt-2 border-t border-slate-100">
                 <div className="flex items-center gap-2 text-xs text-green-600">
                    <CheckCircle className="w-3 h-3" /> Status: Active
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