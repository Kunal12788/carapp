import React from 'react';
import { Trip, PaymentStatus } from '../types';
import { Edit2, AlertCircle, CheckCircle2, MapPin } from 'lucide-react';

interface TripListProps {
  trips: Trip[];
  onEdit: (trip: Trip) => void;
}

const TripList: React.FC<TripListProps> = ({ trips, onEdit }) => {
  return (
    <div className="bg-white shadow-sm border border-slate-200 rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50/50 border-b border-slate-200">
            <tr>
              <th className="p-5 font-semibold text-slate-500 uppercase tracking-wider text-xs">Date</th>
              <th className="p-5 font-semibold text-slate-500 uppercase tracking-wider text-xs">Customer & Route</th>
              <th className="p-5 font-semibold text-slate-500 uppercase tracking-wider text-xs">Driver</th>
              <th className="p-5 font-semibold text-slate-500 uppercase tracking-wider text-xs text-right">Finances</th>
              <th className="p-5 font-semibold text-slate-500 uppercase tracking-wider text-xs">Status</th>
              <th className="p-5 font-semibold text-slate-500 uppercase tracking-wider text-xs text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {trips.length === 0 ? (
                <tr>
                    <td colSpan={6} className="p-12 text-center">
                      <div className="flex flex-col items-center justify-center text-slate-400">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                          <MapPin className="w-8 h-8 text-slate-300" />
                        </div>
                        <p className="text-lg font-medium text-slate-600">No trips found</p>
                        <p className="text-sm">Add a new trip to get started with tracking.</p>
                      </div>
                    </td>
                </tr>
            ) : (
                trips.map(trip => (
                <tr key={trip.id} className="hover:bg-slate-50/80 transition group">
                    <td className="p-5 align-top">
                      <div className="font-semibold text-slate-900">{new Date(trip.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</div>
                      <div className="text-xs text-slate-400 font-mono mt-1">{new Date(trip.date).getFullYear()}</div>
                    </td>
                    
                    <td className="p-5 align-top">
                      <div className="flex flex-col gap-1">
                        <span className="font-semibold text-slate-900">{trip.customerName}</span>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                           <span className="truncate max-w-[100px]">{trip.pickupLocation}</span>
                           <span className="text-slate-300">→</span>
                           <span className="truncate max-w-[100px]">{trip.dropLocation}</span>
                        </div>
                      </div>
                    </td>

                    <td className="p-5 align-top">
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-700">{trip.driverName}</span>
                        <span className="text-xs text-slate-400 mt-1">{trip.totalDistance} km</span>
                      </div>
                    </td>

                    <td className="p-5 align-top text-right">
                      <div className="space-y-1">
                        <div className="text-slate-900 font-medium">${trip.totalAmount}</div>
                        <div className={`text-xs font-bold ${trip.netProfit >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                           {trip.netProfit >= 0 ? 'Profit' : 'Loss'}: ${trip.netProfit}
                        </div>
                      </div>
                    </td>

                    <td className="p-5 align-top">
                      {trip.driverPayment.paymentStatus === PaymentStatus.PENDING ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-semibold">
                            <AlertCircle className="w-3.5 h-3.5" /> 
                            Due ${trip.driverPayment.balancePayable}
                          </span>
                      ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Paid
                          </span>
                      )}
                    </td>

                    <td className="p-5 align-top text-right">
                      <button 
                          onClick={() => onEdit(trip)} 
                          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                          title="Edit Trip Details"
                      >
                          <Edit2 className="w-4 h-4" />
                      </button>
                    </td>
                </tr>
                ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TripList;