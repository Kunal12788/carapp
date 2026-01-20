import React from 'react';
import { Trip, PaymentStatus } from '../types';
import { Edit2, AlertCircle } from 'lucide-react';

interface TripListProps {
  trips: Trip[];
  onEdit: (trip: Trip) => void;
}

const TripList: React.FC<TripListProps> = ({ trips, onEdit }) => {
  return (
    <div className="bg-white shadow-sm border border-slate-200 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="p-4 font-semibold text-slate-600">Date/ID</th>
              <th className="p-4 font-semibold text-slate-600">Customer & Route</th>
              <th className="p-4 font-semibold text-slate-600">Driver & Vehicle</th>
              <th className="p-4 font-semibold text-slate-600 text-right">Income</th>
              <th className="p-4 font-semibold text-slate-600 text-right">Expense</th>
              <th className="p-4 font-semibold text-slate-600 text-right">Profit</th>
              <th className="p-4 font-semibold text-slate-600">Status</th>
              <th className="p-4 font-semibold text-slate-600">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {trips.length === 0 ? (
                <tr>
                    <td colSpan={8} className="p-8 text-center text-slate-400">No trips found. Add a new trip to get started.</td>
                </tr>
            ) : (
                trips.map(trip => (
                <tr key={trip.id} className="hover:bg-slate-50 transition">
                    <td className="p-4">
                    <div className="font-medium text-slate-900">{new Date(trip.date).toLocaleDateString()}</div>
                    <div className="text-xs text-slate-500 font-mono">#{trip.id.slice(0, 6)}</div>
                    </td>
                    <td className="p-4">
                    <div className="font-medium text-slate-900">{trip.customerName}</div>
                    <div className="text-xs text-slate-500">{trip.pickupLocation} → {trip.dropLocation}</div>
                    </td>
                    <td className="p-4">
                    <div className="font-medium text-slate-900">{trip.driverName}</div>
                    <div className="text-xs text-slate-500">Distance: {trip.totalDistance} km</div>
                    </td>
                    <td className="p-4 text-right font-medium text-slate-900">
                    ${trip.totalAmount}
                    </td>
                    <td className="p-4 text-right text-slate-600">
                    ${trip.totalExpense}
                    </td>
                    <td className="p-4 text-right font-bold">
                    <span className={trip.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}>
                        ${trip.netProfit}
                    </span>
                    </td>
                    <td className="p-4">
                    {trip.driverPayment.paymentStatus === PaymentStatus.PENDING ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-medium">
                        <AlertCircle className="w-3 h-3" /> Due: ${trip.driverPayment.balancePayable}
                        </span>
                    ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                        Paid
                        </span>
                    )}
                    </td>
                    <td className="p-4">
                    <button 
                        onClick={() => onEdit(trip)} 
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
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