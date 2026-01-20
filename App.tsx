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
    { id: 'VEHICLES', label: 'Vehicles', icon: Car },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-white fixed h-full z-20">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            Navexa
          </h1>
          <p className="text-xs text-slate-400 mt-1">Travel Operations OS</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setView(item.id as ViewState)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition text-sm font-medium ${
                view === item.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={openNewTripModal}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition"
          >
            <Plus className="w-5 h-5" /> New Trip
          </button>
        </div>
      </aside>

      {/* Mobile Header & Content */}
      <main className="flex-1 md:ml-64 flex flex-col min-h-screen">
        {/* Mobile Header */}
        <header className="md:hidden bg-slate-900 text-white p-4 flex justify-between items-center sticky top-0 z-30 shadow-lg">
           <h1 className="text-xl font-bold">Navexa</h1>
           <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
             <Menu className="w-6 h-6" />
           </button>
        </header>

        {/* Mobile Navigation Dropdown */}
        {isMobileMenuOpen && (
           <div className="md:hidden bg-slate-800 text-white p-4 space-y-2 fixed w-full z-20 top-16 shadow-xl">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => {
                    setView(item.id as ViewState);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full text-left p-3 rounded-lg ${view === item.id ? 'bg-blue-600' : ''}`}
                >
                  {item.label}
                </button>
              ))}
               <button 
                onClick={() => {
                  openNewTripModal();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left p-3 rounded-lg bg-indigo-600 mt-2 font-bold"
              >
                + New Trip
              </button>
           </div>
        )}

        {/* Main Content Area */}
        <div className="p-4 md:p-8 max-w-7xl mx-auto w-full">
          {view === 'DASHBOARD' && <Dashboard trips={trips} vehicles={vehicles} />}
          
          {view === 'TRIPS' && (
            <div className="space-y-6 animate-in fade-in duration-300">
               <div className="flex justify-between items-center">
                 <h2 className="text-2xl font-bold text-slate-800">Trip Management</h2>
                 {/* Mobile floating button alternative can go here if needed */}
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