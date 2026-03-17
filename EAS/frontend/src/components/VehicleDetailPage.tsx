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
      <div className="min-h-screen flex items-center justify-center bg-gray-50/50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 italic">Syncing inventory...</p>
        </div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400 uppercase font-black tracking-tighter text-xl">
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
    <div className="bg-white min-h-screen pb-24">
      {/* Refined Navigation */}
      <nav className="bg-white border-b border-gray-100 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
            <button onClick={() => setCurrentPage('home')} className="hover:text-black transition-colors">Elite Auto</button>
            <span className="opacity-20">/</span>
            <button onClick={handleBackToVehicles} className="hover:text-black transition-colors">Vehicles</button>
            <span className="opacity-20">/</span>
            <span className="text-gray-900">{vehicle.year} {vehicle.make}</span>
          </div>
        </div>
      </nav>

      <section className="pt-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 mb-20">
          
          {/* Gallery Module */}
          <div className="lg:col-span-7 space-y-6">
            <div className="relative aspect-[16/10] bg-gray-100 rounded-3xl overflow-hidden border border-gray-100 shadow-xl shadow-black/5 group">
              <img
                src={currentImageSrc}
                alt=""
                className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
              />
              
              {allImages.length > 1 && (
                <div className="absolute inset-0 flex items-center justify-between p-6 opacity-0 group-hover:opacity-100 transition-all">
                  <button 
                    onClick={() => setCurrentImageIndex(prev => (prev === 0 ? allImages.length - 1 : prev - 1))}
                    className="w-12 h-12 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg hover:bg-black hover:text-white transition-all"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
                  </button>
                  <button 
                    onClick={() => setCurrentImageIndex(prev => (prev === allImages.length - 1 ? 0 : prev + 1))}
                    className="w-12 h-12 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg hover:bg-black hover:text-white transition-all"
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
                  className={`flex-shrink-0 w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all ${
                    currentImageIndex === index ? 'border-black shadow-md' : 'border-transparent opacity-50 hover:opacity-100'
                  }`}
                >
                  <img src={getVehicleImageUrl(img)} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Asset Details Sidebar */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-gray-100 text-gray-600 text-[9px] font-black uppercase tracking-widest rounded-md">
                  {vehicle.status}
                </span>
                <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">ID / {vehicle.vin}</span>
              </div>
              <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase leading-tight mb-1">
                {vehicle.year} {vehicle.make}
              </h1>
              <p className="text-xl font-bold text-gray-400 uppercase tracking-widest mb-8">{vehicle.model}</p>
              
              <div className="flex items-center gap-3">
                <span className="text-sm font-black text-gray-300">$</span>
                <span className="text-5xl font-black text-black tracking-tighter">
                  {Number(vehicle.price).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-px bg-gray-100 rounded-3xl overflow-hidden border border-gray-100 shadow-sm mb-10">
              {[
                { label: 'Mileage', value: Number(vehicle.mileage).toLocaleString() + ' MI' },
                { label: 'Finish', value: vehicle.color || 'N/A' },
                { label: 'Engine', value: vehicle.engine || 'STND' },
                { label: 'Trans', value: vehicle.transmission || 'AUTO' }
              ].map((stat, i) => (
                <div key={i} className="p-6 bg-white hover:bg-gray-50 transition-colors">
                  <span className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</span>
                  <span className="text-lg font-black text-gray-900 tracking-tight uppercase">{stat.value}</span>
                </div>
              ))}
            </div>

            <div className="mt-auto space-y-4">
              <button 
                onClick={() => onInquire({
                  id: vehicle.id, year: vehicle.year, make: vehicle.make, model: vehicle.model,
                  price: Number(vehicle.price), image: vehicle.image_main || 'placeholder.jpg'
                })}
                className="w-full py-6 bg-black text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-2xl hover:bg-gray-800 transition-all shadow-xl shadow-black/10 active:scale-[0.98]"
              >
                Inquire Selection
              </button>
              <div className="flex gap-3">
                <div className="flex-1 p-4 bg-gray-50 rounded-2xl text-center border border-gray-100">
                  <span className="block text-[8px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Title</span>
                  <span className="text-[10px] font-black text-gray-900 uppercase">{vehicle.title_status}</span>
                </div>
                <div className="flex-1 p-4 bg-gray-50 rounded-2xl text-center border border-gray-100">
                  <span className="block text-[8px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Certification</span>
                  <span className="text-[10px] font-black text-green-600 uppercase">Verified</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Narrative & Feature Set */}
        <div className="border-t border-gray-50 pt-20 grid lg:grid-cols-12 gap-16">
          <div className="lg:col-span-7">
            <h2 className="text-2xl font-black text-gray-900 tracking-tighter uppercase mb-8 flex items-center gap-4">
              Asset Narrative
              <div className="h-px bg-gray-100 flex-1"></div>
            </h2>
            <p className="text-base text-gray-500 leading-relaxed font-medium whitespace-pre-wrap">
              {vehicle.description || `This ${vehicle.year} ${vehicle.make} ${vehicle.model} has been thoroughly vetted by our technical team. Featuring a ${vehicle.color} exterior and ${vehicle.engine} drivetrain, it stands as a prime example of its model year. Available for immediate acquisition.`}
            </p>
          </div>

          <div className="lg:col-span-5">
            <h2 className="text-2xl font-black text-gray-900 tracking-tighter uppercase mb-8 flex items-center gap-4">
              Feature Stack
              <div className="h-px bg-gray-100 flex-1"></div>
            </h2>
            <div className="flex flex-wrap gap-2">
              {(specsData.features || ['Fully Inspected', 'Clean Title']).map((feature: string, idx: number) => (
                <div key={idx} className="px-4 py-2 bg-gray-50 rounded-xl border border-gray-100 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                  <span className="text-[10px] font-black text-gray-700 uppercase tracking-tight">{feature}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-12 p-8 bg-gray-900 rounded-[2.5rem] text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
              <h3 className="text-xl font-black uppercase tracking-tighter mb-2">Interested?</h3>
              <p className="text-[10px] font-bold text-gray-400 mb-6 uppercase tracking-widest">Connect with a specialist today.</p>
              <a href="tel:+12815202646" className="inline-flex items-center gap-3 px-8 py-3 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-gray-200 transition-all">
                <span>(281) 520-2646</span>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
