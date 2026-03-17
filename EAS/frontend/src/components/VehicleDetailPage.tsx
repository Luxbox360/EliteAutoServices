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

  // Combine main image with gallery for the slideshow
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
    <div className="bg-white min-h-screen pb-20">
      {/* Dynamic Breadcrumb */}
      <nav className="bg-gray-50 border-b border-gray-100 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-gray-400">
            <button onClick={() => setCurrentPage('home')} className="hover:text-black transition-colors">Home</button>
            <span>/</span>
            <button onClick={handleBackToVehicles} className="hover:text-black transition-colors">Inventory</button>
            <span>/</span>
            <span className="text-black">{vehicle.year} {vehicle.make} {vehicle.model}</span>
          </div>
        </div>
      </nav>

      <section className="pt-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 mb-20">
          
          {/* Left: Image Gallery (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="relative aspect-[16/10] bg-gray-50 rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-2xl shadow-black/5 group">
              <img
                src={currentImageSrc}
                alt=""
                className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
              />
              
              {allImages.length > 1 && (
                <div className="absolute inset-0 flex items-center justify-between p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => setCurrentImageIndex(prev => (prev === 0 ? allImages.length - 1 : prev - 1))}
                    className="w-12 h-12 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg hover:bg-black hover:text-white transition-all"
                  >
                    ←
                  </button>
                  <button 
                    onClick={() => setCurrentImageIndex(prev => (prev === allImages.length - 1 ? 0 : prev + 1))}
                    className="w-12 h-12 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg hover:bg-black hover:text-white transition-all"
                  >
                    →
                  </button>
                </div>
              )}
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-5 sm:grid-cols-6 gap-3">
              {allImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`aspect-square rounded-2xl overflow-hidden border-2 transition-all ${
                    currentImageIndex === index ? 'border-black scale-95 shadow-inner' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={getVehicleImageUrl(img)} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Info (5 cols) */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-black text-white text-[9px] font-black uppercase tracking-widest rounded-full">
                  {vehicle.status}
                </span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em]">VIN: {vehicle.vin}</span>
              </div>
              <h1 className="text-5xl font-black text-gray-900 tracking-tighter uppercase leading-none mb-2">
                {vehicle.year} {vehicle.make}
              </h1>
              <p className="text-2xl font-bold text-gray-400 uppercase tracking-widest mb-6">{vehicle.model}</p>
              
              <div className="flex items-end gap-2 mb-10">
                <span className="text-sm font-black text-gray-400 mb-1">$</span>
                <span className="text-6xl font-black text-black tracking-tighter">
                  {Number(vehicle.price).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-10">
              <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
                <span className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Recorded Mileage</span>
                <span className="text-xl font-black text-gray-900">{Number(vehicle.mileage).toLocaleString()} MILES</span>
              </div>
              <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
                <span className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Exterior Finish</span>
                <span className="text-xl font-black text-gray-900 uppercase">{vehicle.color || 'Not Specified'}</span>
              </div>
              <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
                <span className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Power Plant</span>
                <span className="text-xl font-black text-gray-900 uppercase">{vehicle.engine || 'Standard'}</span>
              </div>
              <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
                <span className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Transmission</span>
                <span className="text-xl font-black text-gray-900 uppercase">{vehicle.transmission || 'Automatic'}</span>
              </div>
            </div>

            {/* Main CTA */}
            <div className="mt-auto space-y-4">
              <button 
                onClick={() => onInquire({
                  id: vehicle.id,
                  year: vehicle.year,
                  make: vehicle.make,
                  model: vehicle.model,
                  price: Number(vehicle.price),
                  image: vehicle.image_main || 'placeholder.jpg'
                })}
                className="w-full py-6 bg-black text-white text-xs font-black uppercase tracking-[0.3em] rounded-[2rem] hover:bg-gray-800 transition-all shadow-2xl shadow-black/10 active:scale-95"
              >
                Inquire Information
              </button>
              <div className="flex gap-4">
                <div className="flex-1 p-4 bg-white border-2 border-gray-100 rounded-2xl text-center">
                  <span className="block text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Title Status</span>
                  <span className="text-xs font-black text-green-600 uppercase">{vehicle.title_status}</span>
                </div>
                <div className="flex-1 p-4 bg-white border-2 border-gray-100 rounded-2xl text-center">
                  <span className="block text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Availability</span>
                  <span className="text-xs font-black text-blue-600 uppercase">Immediate</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Details & Features */}
        <div className="grid lg:grid-cols-12 gap-16">
          <div className="lg:col-span-7">
            <h2 className="text-2xl font-black text-gray-900 tracking-tighter uppercase mb-8 flex items-center gap-4">
              Detailed Description
              <div className="h-px bg-gray-100 flex-1"></div>
            </h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-500 leading-relaxed font-medium whitespace-pre-wrap">
                {vehicle.description || `This premium ${vehicle.make} ${vehicle.model} has been meticulously maintained and represents the pinnacle of its class. Featuring a ${vehicle.color} exterior and a robust ${vehicle.engine} engine, it offers both style and performance. Every vehicle in our selection undergoes a comprehensive inspection process to ensure it meets our strict standards for quality and reliability.`}
              </p>
            </div>
          </div>

          <div className="lg:col-span-5">
            <h2 className="text-2xl font-black text-gray-900 tracking-tighter uppercase mb-8 flex items-center gap-4">
              Premium Features
              <div className="h-px bg-gray-100 flex-1"></div>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
              {(specsData.features || ['Fully Inspected', 'Clean Title']).map((feature: string, idx: number) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <span className="text-sm font-bold text-gray-700 uppercase tracking-tight">{feature}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-12 p-8 bg-black rounded-[2.5rem] text-white">
              <h3 className="text-lg font-black uppercase tracking-tighter mb-4">Interested?</h3>
              <p className="text-xs font-medium text-gray-400 mb-6 leading-relaxed">Schedule a private viewing or test drive at our facility today.</p>
              <a href="tel:+12815202646" className="inline-block px-8 py-3 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-full hover:scale-105 transition-transform">
                Call (281) 520-2646
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
