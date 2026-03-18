import { useState, useEffect } from 'react';
import { getVehicleImageUrl } from '../utils/image-utils';
import { API_BASE_URL } from '../config';
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
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state

  useEffect(() => {
    fetch(`${API_BASE_URL}/vehicles/${vehicleId}`)
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
      <div className="min-h-screen flex items-center justify-center bg-zinc-50/50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-zinc-200 border-t-zinc-600 rounded-full animate-spin"></div>
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 italic">Syncing inventory...</p>
        </div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen flex items-center justify-center text-zinc-500 uppercase font-black tracking-tighter text-xl">
        Asset Not Located
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
    <div className="bg-[#f5f5f5] min-h-screen pb-24 font-sans text-zinc-800">
      
      {/* Fullscreen Image Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
          <button 
            onClick={() => setIsModalOpen(false)}
            className="absolute top-6 right-6 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          
          <div className="relative w-full max-w-5xl aspect-video">
            <img src={currentImageSrc} alt="" className="w-full h-full object-contain drop-shadow-2xl" />
            
            {allImages.length > 1 && (
              <div className="absolute inset-0 flex items-center justify-between px-4">
                <button 
                  onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(prev => (prev === 0 ? allImages.length - 1 : prev - 1)); }}
                  className="w-14 h-14 bg-black/50 hover:bg-black/80 rounded-full flex items-center justify-center text-white backdrop-blur-md transition-all"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(prev => (prev === allImages.length - 1 ? 0 : prev + 1)); }}
                  className="w-14 h-14 bg-black/50 hover:bg-black/80 rounded-full flex items-center justify-center text-white backdrop-blur-md transition-all"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <section className="pt-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-10 mb-16">
          
          {/* Gallery Module */}
          <div className="lg:col-span-7 space-y-4">
            <div 
              onClick={() => setIsModalOpen(true)}
              className="relative aspect-[16/10] bg-white rounded-2xl overflow-hidden border border-zinc-200 shadow-md group cursor-pointer"
            >
              <img
                src={currentImageSrc}
                alt=""
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              />
              <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-md p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                <svg className="w-5 h-5 text-zinc-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
              </div>
              
              {allImages.length > 1 && (
                <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <button 
                    onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(prev => (prev === 0 ? allImages.length - 1 : prev - 1)); }}
                    className="w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-md hover:bg-zinc-800 hover:text-white transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(prev => (prev === allImages.length - 1 ? 0 : prev + 1)); }}
                    className="w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-md hover:bg-zinc-800 hover:text-white transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
                  </button>
                </div>
              )}
            </div>

            <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
              {allImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                    currentImageIndex === index ? 'border-zinc-500 shadow-sm' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={getVehicleImageUrl(img)} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Asset Details Sidebar */}
          <div className="lg:col-span-5 flex flex-col pt-2">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <span className={`px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider shadow-sm ${
                  vehicle.status === 'available' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {vehicle.status}
                </span>
                <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-widest">VIN / {vehicle.vin}</span>
              </div>
              <h1 className="text-4xl font-extrabold text-zinc-800 tracking-tight leading-tight mb-1">
                {vehicle.year} {vehicle.make}
              </h1>
              <p className="text-2xl font-medium text-zinc-500 tracking-wide mb-6">{vehicle.model}</p>
              
              <div className="flex items-baseline gap-2">
                <span className="font-semibold text-[#00ad00] text-[42px] leading-none">$</span>
                <span className="text-5xl font-black text-zinc-800 tracking-tight">
                  {Number(vehicle.price).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Stats Matrix */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              {[
                { label: 'Mileage', value: Number(vehicle.mileage).toLocaleString() + ' mi' },
                { label: 'Finish', value: vehicle.color || 'N/A' },
                { label: 'Engine', value: vehicle.engine || 'Standard' },
                { label: 'Transmission', value: vehicle.transmission || 'Auto' }
              ].map((stat, i) => (
                <div key={i} className="p-5 bg-white rounded-xl border border-zinc-200 shadow-sm flex flex-col justify-center">
                  <span className="text-[10px] font-semibold text-[#9f4300] uppercase tracking-wider mb-1">{stat.label}</span>
                  <span className="text-base font-bold text-zinc-700 capitalize">{stat.value}</span>
                </div>
              ))}
            </div>

            <div className="mt-auto space-y-4">
              <button 
                onClick={() => onInquire({
                  id: vehicle.id, year: vehicle.year, make: vehicle.make, model: vehicle.model,
                  price: Number(vehicle.price), image: vehicle.image_main || 'placeholder.jpg'
                })}
                className="w-full py-5 bg-zinc-800 text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-zinc-700 transition-colors shadow-md active:scale-[0.99]"
              >
                Inquire About Vehicle
              </button>
            </div>
          </div>
        </div>

        {/* Narrative & Feature Set */}
        <div className="border-t border-zinc-200 pt-16 grid lg:grid-cols-12 gap-16">
          <div className="lg:col-span-7">
            <h2 className="text-xl font-bold text-zinc-800 uppercase tracking-wide mb-6 flex items-center gap-4">
              Vehicle Description
              <div className="h-px bg-zinc-200 flex-1"></div>
            </h2>
            <div className="bg-white p-8 rounded-2xl border border-zinc-200 shadow-sm">
              <p className="text-base text-zinc-600 leading-[1.8] font-normal whitespace-pre-wrap">
                {vehicle.description || `This ${vehicle.year} ${vehicle.make} ${vehicle.model} has been thoroughly vetted by our technical team. Featuring a ${vehicle.color} exterior and ${vehicle.engine} drivetrain, it stands as a prime example of its model year. Available for immediate acquisition.`}
              </p>
            </div>
          </div>

          <div className="lg:col-span-5">
            <h2 className="text-xl font-bold text-zinc-800 uppercase tracking-wide mb-6 flex items-center gap-4">
              Features & Specs
              <div className="h-px bg-zinc-200 flex-1"></div>
            </h2>
            <div className="flex flex-wrap gap-2 mb-10">
              {(specsData.features || ['Fully Inspected', 'Clean Title']).map((feature: string, idx: number) => (
                <div key={idx} className="px-4 py-2 bg-white rounded-lg border border-zinc-200 shadow-sm flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                  <span className="text-[11px] font-semibold text-zinc-600 uppercase tracking-wide">{feature}</span>
                </div>
              ))}
            </div>
            
            <div className="p-8 bg-zinc-800 rounded-2xl text-white shadow-lg">
              <h3 className="text-lg font-bold mb-2">Interested?</h3>
              <p className="text-xs text-zinc-300 mb-6 leading-relaxed">Connect with our specialists today to schedule a viewing or request more details.</p>
              <a href="tel:+12815202646" className="inline-flex items-center gap-3 px-6 py-3 bg-white text-zinc-800 text-[11px] font-bold uppercase tracking-wider rounded-lg hover:bg-zinc-100 transition-colors">
                <span>(281) 520-2646</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
