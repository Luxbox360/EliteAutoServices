import { useState, useEffect } from 'react';
import { getVehicleImageUrl } from '../utils/image-utils';
import type { Page, ContactVehicleInfo } from '../App';
import type { Vehicle } from '../types';

interface VehicleDetailPageProps {
  vehicleId: number;
  setCurrentPage: (page: Page) => void;
  setSelectedVehicleId: (id: number | null) => void;
  onInquire: (vehicleInfo: ContactVehicleInfo) => void;
}

export default function VehicleDetailPage({
  vehicleId,
  setCurrentPage,
  setSelectedVehicleId,
  onInquire,
}: VehicleDetailPageProps) {
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    fetch(`https://backend-production-35cd.up.railway.app/api/vehicles/${vehicleId}`)
      .then(res => res.json())
      .then((data: Vehicle) => {
        setVehicle(data);
        setCurrentImageIndex(0);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error:', err);
        setLoading(false);
      });
  }, [vehicleId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-black uppercase tracking-widest italic">Loading data...</p>
        </div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 uppercase font-black tracking-tighter text-2xl">
        Vehicle not found
      </div>
    );
  }

  const allImages = [
    vehicle.image_main,
    ...(Array.isArray(vehicle.images) ? vehicle.images : [])
  ].filter(Boolean) as string[];

  const currentImageSrc = getVehicleImageUrl(allImages[currentImageIndex]);

  const handleBackToVehicles = () => {
    setSelectedVehicleId(null);
    setCurrentPage('vehicles');
  };

  const specsData = (vehicle.specs as any) || {
    condition: 'Excellent',
    warranty: '12 Months',
    features: ['Fully Inspected', 'Clean Title']
  };

  return (
    <div className="bg-white min-h-screen pb-24">
      {/* Dynamic Breadcrumb */}
      <nav className="bg-gray-50/50 border-b border-gray-100 py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
            <button onClick={() => setCurrentPage('home')} className="hover:text-black transition-colors">Portal</button>
            <span className="opacity-30">/</span>
            <button onClick={handleBackToVehicles} className="hover:text-black transition-colors">Inventory</button>
            <span className="opacity-30">/</span>
            <span className="text-black">{vehicle.year} {vehicle.make} {vehicle.model}</span>
          </div>
        </div>
      </nav>

      <section className="pt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-16 mb-24">
          
          {/* Left: Gallery */}
          <div className="lg:col-span-7 space-y-8">
            <div className="relative aspect-[16/10] bg-gray-50 rounded-[3rem] overflow-hidden border border-gray-100 shadow-2xl shadow-black/5 group">
              <img
                src={currentImageSrc}
                alt=""
                className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-105"
              />
              
              {allImages.length > 1 && (
                <div className="absolute inset-0 flex items-center justify-between p-8 opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <button 
                    onClick={() => setCurrentImageIndex(prev => (prev === 0 ? allImages.length - 1 : prev - 1))}
                    className="w-14 h-14 bg-white/90 backdrop-blur-xl rounded-full flex items-center justify-center shadow-2xl hover:bg-black hover:text-white transition-all transform hover:scale-110 active:scale-95"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
                  </button>
                  <button 
                    onClick={() => setCurrentImageIndex(prev => (prev === allImages.length - 1 ? 0 : prev + 1))}
                    className="w-14 h-14 bg-white/90 backdrop-blur-xl rounded-full flex items-center justify-center shadow-2xl hover:bg-black hover:text-white transition-all transform hover:scale-110 active:scale-95"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
                  </button>
                </div>
              )}
            </div>

            {/* Thumbnails */}
            <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
              {allImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`flex-shrink-0 w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all duration-300 ${
                    currentImageIndex === index ? 'border-black scale-95 shadow-lg' : 'border-transparent opacity-40 hover:opacity-100'
                  }`}
                >
                  <img src={getVehicleImageUrl(img)} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Core Info */}
          <div className="lg:col-span-5 flex flex-col pt-4">
            <div className="mb-10">
              <div className="flex items-center gap-4 mb-6">
                <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] shadow-sm ${
                  vehicle.status === 'available' ? 'bg-green-500 text-white' : 'bg-blue-600 text-white'
                }`}>
                  {vehicle.status}
                </span>
                <span className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.4em]">VIN / {vehicle.vin}</span>
              </div>
              <h1 className="text-6xl font-black text-gray-900 tracking-tighter uppercase leading-[0.85] mb-4">
                {vehicle.year}<br />{vehicle.make}
              </h1>
              <p className="text-3xl font-black text-gray-400 uppercase tracking-widest">{vehicle.model}</p>
              
              <div className="mt-12 flex items-baseline gap-3">
                <span className="text-xl font-black text-gray-300">$</span>
                <span className="text-7xl font-black text-black tracking-tighter italic">
                  {Number(vehicle.price).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Stats Matrix */}
            <div className="grid grid-cols-2 gap-px bg-gray-100 rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm mb-12">
              <div className="p-8 bg-white hover:bg-gray-50 transition-colors">
                <span className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Mileage</span>
                <span className="text-xl font-black text-gray-900 tracking-tight">{Number(vehicle.mileage).toLocaleString()}</span>
              </div>
              <div className="p-8 bg-white hover:bg-gray-50 transition-colors">
                <span className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Finish</span>
                <span className="text-xl font-black text-gray-900 tracking-tight uppercase">{vehicle.color || 'STND'}</span>
              </div>
              <div className="p-8 bg-white hover:bg-gray-50 transition-colors">
                <span className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Engine</span>
                <span className="text-xl font-black text-gray-900 tracking-tight uppercase">{vehicle.engine || 'STND'}</span>
              </div>
              <div className="p-8 bg-white hover:bg-gray-50 transition-colors">
                <span className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Trans</span>
                <span className="text-xl font-black text-gray-900 tracking-tight uppercase">{vehicle.transmission || 'AUTO'}</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="space-y-4">
              <button 
                onClick={() => onInquire({
                  id: vehicle.id,
                  year: vehicle.year,
                  make: vehicle.make,
                  model: vehicle.model,
                  price: Number(vehicle.price),
                  image: vehicle.image_main || 'placeholder.jpg'
                })}
                className="w-full py-7 bg-black text-white text-[11px] font-black uppercase tracking-[0.4em] rounded-[2rem] hover:bg-blue-600 transition-all shadow-2xl shadow-black/20 transform active:scale-[0.98]"
              >
                Direct Inquiry
              </button>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 px-6 py-4 rounded-2xl flex flex-col justify-center border border-gray-100">
                  <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Title</span>
                  <span className="text-[10px] font-black text-gray-900 uppercase">{vehicle.title_status}</span>
                </div>
                <div className="bg-gray-50 px-6 py-4 rounded-2xl flex flex-col justify-center border border-gray-100">
                  <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Status</span>
                  <span className="text-[10px] font-black text-gray-900 uppercase">Certified</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Profile Section */}
        <div className="border-t border-gray-100 pt-24 grid lg:grid-cols-12 gap-20">
          <div className="lg:col-span-7 space-y-10">
            <div className="flex items-center gap-6">
              <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase leading-none">Technical Profile</h2>
              <div className="h-px bg-gray-100 flex-1"></div>
            </div>
            <p className="text-lg text-gray-500 leading-[1.8] font-medium whitespace-pre-wrap max-w-3xl">
              {vehicle.description || `Proprietary analysis of the ${vehicle.year} ${vehicle.make} ${vehicle.model}. This unit exhibits exceptional structural integrity and mechanical cohesion. Configured with a ${vehicle.color} finish and ${vehicle.engine} specifications, it represents a distinctive acquisition for the discerning operator.`}
            </p>
          </div>

          <div className="lg:col-span-5 space-y-10">
            <div className="flex items-center gap-6">
              <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase leading-none">Feature Stack</h2>
              <div className="h-px bg-gray-100 flex-1"></div>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {(specsData.features || ['Fully Inspected', 'Clean Title']).map((feature: string, idx: number) => (
                <div key={idx} className="flex items-center justify-between p-5 bg-gray-50 rounded-2xl border border-gray-100 hover:border-black transition-all group">
                  <span className="text-[11px] font-black text-gray-700 uppercase tracking-wider">{feature}</span>
                  <div className="w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center group-hover:bg-black group-hover:border-black transition-all">
                    <svg className="w-3 h-3 text-green-600 opacity-0 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" /></svg>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="relative mt-16 p-10 bg-black rounded-[3rem] text-white overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 rounded-full blur-[100px] opacity-20 pointer-events-none translate-x-1/2 -translate-y-1/2"></div>
              <h3 className="text-2xl font-black uppercase tracking-tighter mb-4 relative z-10">Secure Acquisition</h3>
              <p className="text-[11px] font-medium text-gray-400 mb-8 leading-relaxed uppercase tracking-widest relative z-10">Contact our specialist desk to initiate the procurement process or schedule a technical inspection.</p>
              <a href="tel:+12815202646" className="inline-flex items-center gap-4 px-10 py-4 bg-white text-black text-[11px] font-black uppercase tracking-[0.3em] rounded-full hover:bg-blue-600 hover:text-white transition-all transform hover:scale-105 relative z-10">
                <span>(281) 520-2646</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
