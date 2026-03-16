import { useEffect, useState, useMemo } from 'react';
import { API_BASE_URL } from '../config';
import VehicleForm from './VehicleForm';
import ContactInquiries from './ContactInquiries';
import { getVehicleImageUrl } from '../utils/image-utils';
import type { User, Vehicle } from '../types';

interface AdminDashboardProps {
  user?: User;
  token: string;
  onLogout: () => void;
}

export default function AdminDashboard({ user, token, onLogout }: AdminDashboardProps) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'list' | 'add' | 'edit'>('list');
  const [activeTab, setActiveTab] = useState<'inventory' | 'leads'>('inventory');
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  // Search & Pagination State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'available' | 'sold'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Delete Modal State
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; vehicleId: number | null }>({
    isOpen: false,
    vehicleId: null
  });

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/vehicles`);
      const data = await response.json();
      setVehicles(data);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  // Filtering Logic
  const filteredVehicles = useMemo(() => {
    return vehicles.filter(v => {
      const matchesSearch = 
        v.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.vin.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.year.toString().includes(searchTerm);
      
      const matchesStatus = statusFilter === 'all' || v.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [vehicles, searchTerm, statusFilter]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredVehicles.length / itemsPerPage);
  const paginatedVehicles = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredVehicles.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredVehicles, currentPage]);

  const handleToggleStatus = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === 'available' ? 'sold' : 'available';
    try {
      const response = await fetch(`${API_BASE_URL}/vehicles/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setVehicles(vehicles.map(v => v.id === id ? { ...v, status: newStatus } : v));
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const openDeleteModal = (id: number) => {
    setDeleteModal({ isOpen: true, vehicleId: id });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, vehicleId: null });
  };

  const confirmDelete = async () => {
    if (!deleteModal.vehicleId) return;

    try {
      const response = await fetch(`${API_BASE_URL}/vehicles/${deleteModal.vehicleId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setVehicles(vehicles.filter(v => v.id !== deleteModal.vehicleId));
        closeDeleteModal();
      }
    } catch (error) {
      console.error('Error deleting vehicle:', error);
    }
  };

  const handleSave = (savedVehicle: Vehicle) => {
    if (view === 'edit') {
      setVehicles(vehicles.map(v => v.id === savedVehicle.id ? savedVehicle : v));
    } else {
      setVehicles([savedVehicle, ...vehicles]);
    }
    setView('list');
    setEditingVehicle(null);
  };

  const handleEdit = async (id: number) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/vehicles/${id}`);
      const data = await response.json();
      setEditingVehicle(data);
      setView('edit');
    } catch (error) {
      console.error('Error fetching vehicle details:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={closeDeleteModal}></div>
          <div className="relative bg-white w-full max-w-sm p-8 rounded-[2rem] shadow-2xl animate-in zoom-in-95 duration-300 border border-gray-100">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-6 border border-red-100">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="text-xl font-black text-gray-900 tracking-tighter uppercase">Terminate Asset?</h3>
              <p className="text-sm text-gray-400 mt-2 font-medium">This operation is permanent and cannot be reversed from the records.</p>
              
              <div className="grid grid-cols-2 gap-4 w-full mt-8">
                <button 
                  onClick={closeDeleteModal}
                  className="px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest text-gray-400 hover:text-black hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmDelete}
                  className="px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest bg-black text-white hover:bg-red-600 transition-all shadow-lg shadow-black/10"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sub-Header / Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14">
            <div className="flex space-x-8 h-full">
              <button 
                onClick={() => { setView('list'); setActiveTab('inventory'); }}
                className={`flex items-center px-1 border-b-2 text-sm font-medium transition-all ${
                  activeTab === 'inventory' ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-gray-600'
                }`}
              >
                Inventory
              </button>
              <button 
                onClick={() => { setView('list'); setActiveTab('leads'); }}
                className={`flex items-center px-1 border-b-2 text-sm font-medium transition-all ${
                  activeTab === 'leads' ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-gray-600'
                }`}
              >
                Leads
              </button>
            </div>
            
            <div className="flex items-center gap-4">
               <button 
                onClick={onLogout}
                className="px-3 py-1 text-[10px] font-bold text-gray-400 hover:text-red-600 uppercase tracking-widest transition-colors"
              >
                Logout
              </button>
              <div className="flex items-center gap-3 px-4 py-1.5 bg-gray-50 rounded-full border border-gray-100 shadow-sm">
                <div className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </div>
                <div className="flex flex-col items-start leading-none">
                  <span className="text-[10px] font-black text-gray-900 uppercase tracking-tighter">
                    {user?.firstName} {user?.lastName}
                  </span>
                  <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                    Verified Administrator
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {view === 'list' ? (
          activeTab === 'inventory' ? (
            <div className="space-y-6 animate-in fade-in duration-500">
              {/* Interactive Stats Row */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <button 
                  onClick={() => { setStatusFilter('all'); setCurrentPage(1); }}
                  className={`relative p-6 rounded-2xl border transition-all duration-300 text-left overflow-hidden group ${
                    statusFilter === 'all' ? 'bg-black text-white border-black shadow-xl shadow-black/10' : 'bg-white text-gray-900 border-gray-100 hover:border-gray-200 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center justify-between relative z-10">
                    <span className={`text-[10px] font-black uppercase tracking-widest ${statusFilter === 'all' ? 'text-gray-400' : 'text-gray-400 group-hover:text-gray-600'}`}>Total Inventory</span>
                    <div className={`h-2 w-2 rounded-full ${statusFilter === 'all' ? 'bg-white' : 'bg-gray-300'}`}></div>
                  </div>
                  <div className="mt-2 text-4xl font-black relative z-10 tracking-tighter">{vehicles.length}</div>
                  {statusFilter === 'all' && <div className="absolute right-4 bottom-0 text-white/15 font-black text-7xl pointer-events-none tracking-tighter uppercase">All</div>}
                </button>

                <button 
                  onClick={() => { setStatusFilter('available'); setCurrentPage(1); }}
                  className={`relative p-6 rounded-2xl border transition-all duration-300 text-left overflow-hidden group ${
                    statusFilter === 'available' ? 'bg-green-500 text-white border-green-500 shadow-xl shadow-green-500/20' : 'bg-white text-gray-900 border-gray-100 hover:border-green-200 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center justify-between relative z-10">
                    <span className={`text-[10px] font-black uppercase tracking-widest ${statusFilter === 'available' ? 'text-green-100' : 'text-green-500'}`}>Available</span>
                    <div className={`h-2 w-2 rounded-full ${statusFilter === 'available' ? 'bg-white' : 'bg-green-500'}`}></div>
                  </div>
                  <div className="mt-2 text-4xl font-black relative z-10 tracking-tighter">
                    {vehicles.filter(v => v.status === 'available').length}
                  </div>
                  {statusFilter === 'available' && <div className="absolute right-4 bottom-0 text-white/20 font-black text-7xl pointer-events-none tracking-tighter uppercase">Ready</div>}
                </button>

                <button 
                  onClick={() => { setStatusFilter('sold'); setCurrentPage(1); }}
                  className={`relative p-6 rounded-2xl border transition-all duration-300 text-left overflow-hidden group ${
                    statusFilter === 'sold' ? 'bg-blue-600 text-white border-blue-600 shadow-xl shadow-blue-600/20' : 'bg-white text-gray-900 border-gray-100 hover:border-blue-200 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center justify-between relative z-10">
                    <span className={`text-[10px] font-black uppercase tracking-widest ${statusFilter === 'sold' ? 'text-blue-100' : 'text-blue-600'}`}>Sold Assets</span>
                    <div className={`h-2 w-2 rounded-full ${statusFilter === 'sold' ? 'bg-white' : 'bg-blue-50'}`}></div>
                  </div>
                  <div className="mt-2 text-4xl font-black relative z-10 tracking-tighter">
                    {vehicles.filter(v => v.status === 'sold').length}
                  </div>
                  {statusFilter === 'sold' && <div className="absolute right-4 bottom-0 text-white/20 font-black text-7xl pointer-events-none tracking-tighter uppercase">Sold</div>}
                </button>
              </div>

              {/* Management Header */}
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-8 py-6 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-black text-gray-900 tracking-tighter uppercase">
                      {statusFilter === 'all' ? 'Inventory' : statusFilter} Management
                    </h2>
                    <p className="text-xs text-gray-400 font-medium mt-1">
                      {filteredVehicles.length} vehicles matching current criteria
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <input 
                        type="text" 
                        placeholder="Search by Make, Model, VIN..."
                        value={searchTerm}
                        onChange={(e) => { 
                          setSearchTerm(e.target.value || ''); 
                          setCurrentPage(1); 
                        }}
                        className="bg-gray-50 border-none rounded-xl px-4 py-2 text-sm w-64 focus:ring-2 focus:ring-black transition-all"
                      />
                    </div>
                    <button 
                      onClick={() => setView('add')}
                      className="bg-black text-white px-6 py-2 rounded-xl text-sm font-black hover:bg-gray-800 transition-all active:scale-95 shadow-lg shadow-black/10"
                    >
                      + ADD VEHICLE
                    </button>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-100">
                    <thead>
                      <tr className="bg-gray-50/50">
                        <th className="px-8 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Vehicle Details</th>
                        <th className="px-8 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">VIN Identification</th>
                        <th className="px-8 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Listing Price</th>
                        <th className="px-8 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Status</th>
                        <th className="px-8 py-4 text-right text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-50">
                      {loading ? (
                        <tr>
                          <td colSpan={5} className="px-8 py-20 text-center">
                            <div className="flex flex-col items-center justify-center space-y-3">
                              <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
                              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest italic">Syncing Database...</span>
                            </div>
                          </td>
                        </tr>
                      ) : paginatedVehicles.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-8 py-20 text-center">
                            <div className="text-gray-300 font-black text-2xl tracking-tighter opacity-50 uppercase">No records found</div>
                            <p className="text-xs text-gray-400 mt-2 uppercase font-bold tracking-widest">Adjust your filters and try again</p>
                          </td>
                        </tr>
                      ) : (
                        paginatedVehicles.map((vehicle) => (
                          <tr key={vehicle.id} className="group hover:bg-gray-50/50 transition-colors">
                            <td className="px-8 py-5 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="h-12 w-20 flex-shrink-0 bg-gray-100 rounded-xl overflow-hidden mr-4 border border-gray-100 shadow-sm transition-transform group-hover:scale-105 duration-300">
                                  <img 
                                    className="h-full w-full object-cover" 
                                    src={getVehicleImageUrl(vehicle.image_main)} 
                                    alt="" 
                                  />
                                </div>
                                <div>
                                  <div className="text-sm font-black text-gray-900 tracking-tight">
                                    {vehicle.year} {vehicle.make}
                                  </div>
                                  <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">{vehicle.model}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-8 py-5 whitespace-nowrap">
                              <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded text-[10px] font-mono font-bold border border-gray-200 uppercase tracking-tighter">
                                {vehicle.vin}
                              </span>
                            </td>
                            <td className="px-8 py-5 whitespace-nowrap">
                              <div className="text-sm font-black text-gray-900 tracking-tight">
                                ${Number(vehicle.price).toLocaleString()}
                              </div>
                            </td>
                            <td className="px-8 py-5 whitespace-nowrap">
                              <button 
                                onClick={() => handleToggleStatus(vehicle.id, vehicle.status)}
                                className={`px-4 py-1.5 inline-flex text-[10px] leading-5 font-black rounded-full border transition-all active:scale-95 ${
                                  vehicle.status === 'available' 
                                    ? 'bg-green-50 text-green-700 border-green-100 hover:bg-green-500 hover:text-white' 
                                    : 'bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-500 hover:text-white'
                                }`}
                              >
                                {vehicle.status.toUpperCase()}
                              </button>
                            </td>
                            <td className="px-8 py-5 whitespace-nowrap text-right text-xs font-medium">
                              <div className="flex justify-end gap-2">
                                <button 
                                  onClick={() => handleEdit(vehicle.id)}
                                  className="p-2 hover:bg-white rounded-lg transition-all border border-transparent hover:border-gray-200 text-gray-400 hover:text-black"
                                  title="Edit Vehicle"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                </button>
                                <button 
                                  onClick={() => openDeleteModal(vehicle.id)}
                                  className="p-2 hover:bg-red-50 rounded-lg transition-all border border-transparent hover:border-red-100 text-gray-400 hover:text-red-600"
                                  title="Delete Vehicle"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Footer */}
                {!loading && totalPages > 1 && (
                  <div className="px-8 py-4 bg-gray-50/50 border-t border-gray-50 flex items-center justify-between">
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                      Showing {(currentPage-1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredVehicles.length)} of {filteredVehicles.length}
                    </div>
                    <div className="flex gap-2">
                      <button 
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(prev => prev - 1)}
                        className={`p-2 rounded-lg border transition-all ${
                          currentPage === 1 ? 'bg-gray-100 text-gray-300 border-gray-100 cursor-not-allowed' : 'bg-white text-black border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <button 
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(prev => prev + 1)}
                        className={`p-2 rounded-lg border transition-all ${
                          currentPage === totalPages ? 'bg-gray-100 text-gray-300 border-gray-100 cursor-not-allowed' : 'bg-white text-black border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="animate-in slide-in-from-bottom duration-500">
              <ContactInquiries token={token} />
            </div>
          )
        ) : (
          <div className="max-w-4xl mx-auto animate-in zoom-in duration-300">
            <VehicleForm 
              vehicle={editingVehicle} 
              onSave={handleSave} 
              onCancel={() => { setView('list'); setEditingVehicle(null); }}
              token={token}
            />
          </div>
        )}
      </main>
    </div>
  );
}
