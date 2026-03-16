import React, { useState, useEffect, useRef } from 'react';
import type { Vehicle } from '../types';

interface VehicleFormProps {
  vehicle?: Vehicle | null;
  onSave: (data: Vehicle) => void;
  onCancel: () => void;
  token: string;
}

export default function VehicleForm({ vehicle, onSave, onCancel, token }: VehicleFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    vin: '',
    make: '',
    model: '',
    year: new Date().getFullYear(),
    type: 'SUV',
    color: '',
    mileage: 0,
    price: 0,
    title_status: 'Clean',
    transmission: 'Automatic',
    engine: '',
    description: '',
    image_main: '',
    featured: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    if (vehicle) {
      setFormData({
        vin: vehicle.vin || '',
        make: vehicle.make || '',
        model: vehicle.model || '',
        year: vehicle.year || new Date().getFullYear(),
        type: vehicle.type || 'SUV',
        color: vehicle.color || '',
        mileage: Number(vehicle.mileage) || 0,
        price: Number(vehicle.price) || 0,
        title_status: vehicle.title_status || 'Clean',
        transmission: vehicle.transmission || 'Automatic',
        engine: vehicle.engine || '',
        description: vehicle.description || '',
        image_main: vehicle.image_main || '',
        featured: vehicle.featured || false,
      });
      if (vehicle.image_main) {
        // If it starts with a timestamp-like pattern, it's from uploads
        const isUploaded = /^\d+-/.test(vehicle.image_main);
        setPreviewUrl(isUploaded ? `http://localhost:3000/uploads/${vehicle.image_main}` : `/assets/images/${vehicle.image_main}`);
      }
    }
  }, [vehicle]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
               (name === 'year' || name === 'mileage' || name === 'price') ? Number(value) : value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      let image_main = formData.image_main;

      // 1. Upload file first if selected
      if (selectedFile) {
        const uploadFormData = new FormData();
        uploadFormData.append('file', selectedFile);

        const uploadResponse = await fetch('http://localhost:3000/api/vehicles/upload', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: uploadFormData,
        });

        if (!uploadResponse.ok) {
          throw new Error('Failed to upload image');
        }

        const uploadData = await uploadResponse.json();
        image_main = uploadData.filename;
      }

      // 2. Save vehicle
      const url = vehicle ? `http://localhost:3000/api/vehicles/${vehicle.id}` : 'http://localhost:3000/api/vehicles';
      const method = vehicle ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ...formData, image_main }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to save vehicle');
      }

      onSave(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Something went wrong');
      } else {
        setError('Something went wrong');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-black/5 border border-gray-100 animate-in zoom-in-95 duration-500">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase">
            {vehicle ? 'Edit Asset' : 'New Inventory'}
          </h2>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mt-1">Vehicle Specification Entry</p>
        </div>
        <button onClick={onCancel} className="p-3 hover:bg-gray-50 rounded-full transition-colors group">
          <svg className="w-6 h-6 text-gray-300 group-hover:text-black transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-xl text-sm font-bold animate-in slide-in-from-top-4">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Image Upload Column */}
          <div className="lg:col-span-1">
            <label className="block text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] mb-4">Primary Identity</label>
            <div 
              onClick={triggerFileSelect}
              className="relative aspect-[4/3] rounded-[2rem] border-2 border-dashed border-gray-200 bg-gray-50 flex flex-col items-center justify-center cursor-pointer group overflow-hidden transition-all hover:border-black hover:bg-white"
            >
              {previewUrl ? (
                <>
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white text-[10px] font-black uppercase tracking-widest bg-black/50 px-4 py-2 rounded-full backdrop-blur-sm">Change Image</span>
                  </div>
                </>
              ) : (
                <div className="text-center p-6">
                  <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Select Image File</p>
                </div>
              )}
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept="image/*"
              />
            </div>
            <p className="text-[9px] text-gray-400 mt-4 font-medium uppercase tracking-widest text-center italic">Selected: {selectedFile?.name || formData.image_main || 'No file chosen'}</p>
          </div>

          {/* Form Fields Column */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] ml-1">VIN Identification</label>
              <input
                type="text"
                name="vin"
                required
                maxLength={17}
                minLength={17}
                value={formData.vin}
                onChange={handleChange}
                className="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl px-5 py-3 text-sm font-bold focus:bg-white focus:border-black transition-all outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] ml-1">Title Status</label>
              <select
                name="title_status"
                value={formData.title_status}
                onChange={handleChange}
                className="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl px-5 py-3 text-sm font-bold focus:bg-white focus:border-black transition-all outline-none appearance-none"
              >
                <option value="Clean">CLEAN TITLE</option>
                <option value="Salvage">SALVAGE</option>
                <option value="Rebuilt">REBUILT</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] ml-1">Manufacturer</label>
              <input
                type="text"
                name="make"
                required
                value={formData.make}
                onChange={handleChange}
                className="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl px-5 py-3 text-sm font-bold focus:bg-white focus:border-black transition-all outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] ml-1">Model Name</label>
              <input
                type="text"
                name="model"
                required
                value={formData.model}
                onChange={handleChange}
                className="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl px-5 py-3 text-sm font-bold focus:bg-white focus:border-black transition-all outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] ml-1">Production Year</label>
              <input
                type="number"
                name="year"
                required
                value={formData.year}
                onChange={handleChange}
                className="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl px-5 py-3 text-sm font-bold focus:bg-white focus:border-black transition-all outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] ml-1">Classification</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl px-5 py-3 text-sm font-bold focus:bg-white focus:border-black transition-all outline-none appearance-none"
              >
                <option value="SUV">SUV / CROSSOVER</option>
                <option value="Sedan">SEDAN</option>
                <option value="Truck">PICKUP TRUCK</option>
                <option value="Coupe">COUPE</option>
                <option value="Van">VAN / MINIVAN</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] ml-1">Listing Price (USD)</label>
              <input
                type="number"
                name="price"
                required
                value={formData.price}
                onChange={handleChange}
                className="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl px-5 py-3 text-sm font-black text-black focus:bg-white focus:border-black transition-all outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] ml-1">Recorded Odometer</label>
              <input
                type="number"
                name="mileage"
                required
                value={formData.mileage}
                onChange={handleChange}
                className="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl px-5 py-3 text-sm font-bold focus:bg-white focus:border-black transition-all outline-none"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
          <div className="space-y-4">
            <div className="flex items-center p-4 bg-gray-50 rounded-2xl border-2 border-gray-50 hover:border-gray-200 transition-all cursor-pointer group">
              <input
                type="checkbox"
                name="featured"
                id="featured"
                checked={formData.featured}
                onChange={handleChange}
                className="h-5 w-5 text-black border-2 border-gray-300 rounded-lg focus:ring-0 transition-all"
              />
              <label htmlFor="featured" className="ml-4 block text-[11px] font-black text-gray-500 uppercase tracking-widest cursor-pointer group-hover:text-black">
                Highlight in Featured Inventory
              </label>
            </div>
          </div>

          <div className="flex justify-end items-center gap-6">
            <button
              type="button"
              onClick={onCancel}
              className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-400 hover:text-black transition-colors"
            >
              Discard Changes
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`px-10 py-4 bg-black text-white text-[11px] font-black uppercase tracking-[0.25em] rounded-2xl hover:bg-gray-800 transition-all shadow-xl shadow-black/10 active:scale-95 flex items-center gap-3 ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? 'Processing...' : 'Commit Asset'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
