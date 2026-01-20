import React, { useState, useEffect } from 'react';
import { ViewState, Trip, Vehicle } from './types';
import Dashboard from './components/Dashboard';
import TripList from './components/TripList';
import TripForm from './components/TripForm';
import VehicleList from './components/VehicleList';
import { LayoutDashboard, Car, Calendar, Plus, Menu } from 'lucide-react';

const App: React.FC = () => {
  // --- State ---
  const [view, setView] = useState<ViewState>('DASHBOARD');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showTripModal, setShowTripModal] = useState(false);
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);

  // --- Mock Data Init (Persisted in LocalStorage) ---
  const [trips, setTrips] = useState<Trip[]>(() => {
    const saved = localStorage.getItem('navexa_trips');
    return saved ? JSON.parse(saved) : [];
  });

  const [vehicles, setVehicles] = useState<Vehicle[]>(() => {
    const saved = localStorage.getItem('navexa_vehicles');
    if (saved) return JSON.parse(saved);
    // Default initial vehicle
    return [{
      id: 'v1',
      registrationNumber: 'AB-123-CD',
      makeModel: 'Toyota Sienna 2022',
      lastServiceDate: '2023-10-01',
      nextServiceDueDate: '2024-04-01',
      oilChangeDate: '2023-10-01',
      tyreChangeDate: '',
      brakeServiceDate: '',
      batteryReplacementDate: '',
      insuranceExpiryDate: '2024-08-15',
      pollutionExpiryDate: ''
    }];
  });

  // --- Effects ---
  useEffect(() => {
    localStorage.setItem('navexa_trips', JSON.stringify(trips));
  }, [trips]);

  useEffect(() => {
    localStorage.setItem('navexa_vehicles', JSON.stringify(vehicles));
  }, [vehicles]);

  // --- Handlers ---
  const handleSaveTrip = (trip: Trip) => {
    if (editingTrip) {
      setTrips(trips.map(t => t.id === trip.id ? trip : t));
    } else {
      setTrips([...trips, trip]);
    }
    setShowTripModal(false);
    setEditingTrip(null);
  };

  const handleDeleteVehicle = (id: string) => {
    setVehicles(vehicles.filter(v => v.id !== id));
  };

  const handleAddVehicle = (v: Vehicle) => {
    setVehicles([...vehicles, v]);
  };

  const openNewTripModal = () => {
    setEditingTrip(null);
    setShowTripModal(true);
  };

  const openEditTripModal = (trip: Trip) => {
    setEditingTrip(trip);
    setShowTripModal(true);
  };

  // --- Navigation Items ---
  const navItems = [
    { id: 'DASHBOARD', label: 'Overview', icon: LayoutDashboard },
    { id: 'TRIPS', label: 'Trips & Expenses', icon: Calendar },
    { id: 'VEHICLES', label: 'Fleet Assets', icon: Car },
  ];

  return (
    <div className="min-h-screen bg-gray-50/50 flex font-sans text-slate-900">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-72 bg-[#0f172a] text-slate-300 fixed h-full z-20 border-r border-slate-800 shadow-2xl">
        <div className="p-8 pb-4">
          <div className="flex items-center gap-3 mb-1">
             <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-blue-500 flex items-center justify-center text-white font-bold text-lg">N</div>
             <h1 className="text-2xl font-bold tracking-tight text-white">Navexa</h1>
          </div>
          <p className="text-xs text-slate-500 ml-11 font-medium tracking-wide uppercase">Operations OS</p>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-1.5">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setView(item.id as ViewState)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 text-sm font-medium group relative overflow-hidden ${
                view === item.id 
                  ? 'bg-indigo-600/10 text-white shadow-inner shadow-white/5' 
                  : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              {view === item.id && <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 rounded-full my-3"></div>}
              <item.icon className={`w-5 h-5 transition-colors ${view === item.id ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 mx-4 mb-6 bg-slate-800/50 rounded-2xl border border-slate-700/50">
          <p className="text-xs text-slate-400 mb-3 px-1">Quick Action</p>
          <button 
            onClick={openNewTripModal}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-900/40 hover:scale-[1.02]"
          >
            <Plus className="w-5 h-5" /> New Trip
          </button>
        </div>
      </aside>

      {/* Mobile Header & Content */}
      <main className="flex-1 md:ml-72 flex flex-col min-h-screen">
        {/* Mobile Header */}
        <header className="md:hidden bg-[#0f172a] text-white p-4 flex justify-between items-center sticky top-0 z-30 shadow-lg border-b border-slate-800">
           <div className="flex items-center gap-2">
             <div className="w-7 h-7 rounded bg-indigo-600 flex items-center justify-center font-bold">N</div>
             <h1 className="text-xl font-bold tracking-tight">Navexa</h1>
           </div>
           <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 rounded-lg hover:bg-slate-800 transition">
             <Menu className="w-6 h-6" />
           </button>
        </header>

        {/* Mobile Navigation Dropdown */}
        {isMobileMenuOpen && (
           <div className="md:hidden bg-[#1e293b] text-slate-300 p-4 space-y-2 fixed w-full z-20 top-16 shadow-2xl border-b border-slate-700">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => {
                    setView(item.id as ViewState);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full text-left p-3 rounded-xl flex items-center gap-3 ${view === item.id ? 'bg-indigo-600 text-white' : 'hover:bg-slate-700'}`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </button>
              ))}
               <button 
                onClick={() => {
                  openNewTripModal();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left p-3 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 mt-4 font-bold flex items-center gap-3 justify-center"
              >
                <Plus className="w-5 h-5" /> New Trip
              </button>
           </div>
        )}

        {/* Main Content Area */}
        <div className="p-6 md:p-10 max-w-7xl mx-auto w-full">
          {view === 'DASHBOARD' && <Dashboard trips={trips} vehicles={vehicles} />}
          
          {view === 'TRIPS' && (
            <div className="space-y-8 animate-in fade-in duration-300">
               <div className="flex justify-between items-center">
                 <div>
                   <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Trips & Expenses</h2>
                   <p className="text-slate-500 mt-1">Detailed logs of your operational history.</p>
                 </div>
               </div>
               <TripList trips={trips} onEdit={openEditTripModal} />
            </div>
          )}

          {view === 'VEHICLES' && (
             <div className="animate-in fade-in duration-300">
               <VehicleList vehicles={vehicles} onAdd={handleAddVehicle} onDelete={handleDeleteVehicle} />
             </div>
          )}
        </div>
      </main>

      {/* Modal Layer */}
      {showTripModal && (
        <TripForm 
          onClose={() => setShowTripModal(false)} 
          onSave={handleSaveTrip} 
          vehicles={vehicles}
          initialData={editingTrip}
        />
      )}
    </div>
  );
};

export default App;