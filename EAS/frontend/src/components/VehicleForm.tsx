import React, { useState, useEffect, useRef } from 'react';
import { API_BASE_URL, UPLOADS_BASE_URL } from '../config';
import { getVehicleImageUrl } from '../utils/image-utils';
import type { Vehicle } from '../types';

interface VehicleFormProps {
  vehicle?: Vehicle | null;
  onSave: (data: Vehicle) => void;
  onCancel: () => void;
  token: string;
}

export default function VehicleForm({ vehicle, onSave, onCancel, token }: VehicleFormProps) {
  const mainFileInputRef = useRef<HTMLInputElement>(null);
  const galleryFileInputRef = useRef<HTMLInputElement>(null);
  
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
    images: [] as string[],
    featured: false,
    specs: {
      condition: 'Excellent',
      warranty: '12 Months',
      features: ['Fully Inspected', 'Clean Title']
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Image states
  const [mainPreviewUrl, setMainPreviewUrl] = useState<string | null>(null);
  const [selectedMainFile, setSelectedFile] = useState<File | null>(null);
  const [galleryPreviews, setGalleryPreviews] = useState<{url: string, file?: File, name: string}[]>([]);
  const [newFeature, setNewFeature] = useState('');

  useEffect(() => {
    if (vehicle) {
      const vehicleSpecs = (vehicle.specs as any) || {
        condition: 'Excellent',
        warranty: '12 Months',
        features: ['Fully Inspected', 'Clean Title']
      };

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
        images: Array.isArray(vehicle.images) ? vehicle.images : [],
        featured: vehicle.featured || false,
        specs: vehicleSpecs
      });

      if (vehicle.image_main) {
        setMainPreviewUrl(getVehicleImageUrl(vehicle.image_main));
      }

      if (Array.isArray(vehicle.images)) {
        setGalleryPreviews(vehicle.images.map(img => ({
          url: getVehicleImageUrl(img),
          name: img
        })));
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

  const handleMainFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setMainPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGalleryFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const newPreviews = files.map(file => ({
        url: URL.createObjectURL(file),
        file: file,
        name: file.name
      }));
      setGalleryPreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeGalleryImage = (index: number) => {
    setGalleryPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        specs: {
          ...prev.specs,
          features: [...prev.specs.features, newFeature.trim()]
        }
      }));
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      specs: {
        ...prev.specs,
        features: prev.specs.features.filter((_, i) => i !== index)
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      let image_main = formData.image_main;
      let gallery_images = galleryPreviews.filter(p => !p.file).map(p => p.name);

      // 1. Upload main file if selected
      if (selectedMainFile) {
        const uploadFormData = new FormData();
        uploadFormData.append('file', selectedMainFile);
        const res = await fetch(`${API_BASE_URL}/vehicles/upload`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: uploadFormData,
        });
        if (!res.ok) throw new Error('Failed to upload main image');
        const data = await res.json();
        image_main = data.filename;
      }

      // 2. Upload new gallery files
      const filesToUpload = galleryPreviews.filter(p => p.file).map(p => p.file!);
      if (filesToUpload.length > 0) {
        const uploadFormData = new FormData();
        filesToUpload.forEach(file => uploadFormData.append('files', file));
        const res = await fetch(`${API_BASE_URL}/vehicles/upload-multiple`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: uploadFormData,
        });
        if (!res.ok) throw new Error('Failed to upload gallery images');
        const data = await res.json();
        const uploadedFilenames = data.map((f: any) => f.filename);
        gallery_images = [...gallery_images, ...uploadedFilenames];
      }

      // 3. Save vehicle
      const url = vehicle ? `${API_BASE_URL}/vehicles/${vehicle.id}` : `${API_BASE_URL}/vehicles`;
      const method = vehicle ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          ...formData, 
          image_main, 
          images: gallery_images 
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to save vehicle');
      onSave(data);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 md:p-10 rounded-[2.5rem] shadow-2xl shadow-black/5 border border-gray-100 animate-in zoom-in-95 duration-500 max-h-[90vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase">
            {vehicle ? 'Edit Asset' : 'New Inventory'}
          </h2>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mt-1">Advanced Vehicle Management</p>
        </div>
        <button onClick={onCancel} className="p-3 hover:bg-gray-50 rounded-full transition-colors group">
          <svg className="w-6 h-6 text-gray-300 group-hover:text-black transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-xl text-sm font-bold">
            {error}
          </div>
        )}

        {/* Section 1: Images */}
        <div className="space-y-6">
          <h3 className="text-xs font-black uppercase tracking-widest text-black border-b-2 border-black pb-2">Media Assets</h3>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <label className="block text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] mb-4">Main Cover</label>
              <div 
                onClick={() => mainFileInputRef.current?.click()}
                className="relative aspect-[4/3] rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 flex flex-col items-center justify-center cursor-pointer group overflow-hidden transition-all hover:border-black"
              >
                {mainPreviewUrl ? (
                  <img src={mainPreviewUrl} alt="Main" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center p-4">
                    <svg className="w-8 h-8 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Main Image</p>
                  </div>
                )}
                <input type="file" ref={mainFileInputRef} onChange={handleMainFileChange} className="hidden" accept="image/*" />
              </div>
            </div>

            <div className="lg:col-span-3">
              <label className="block text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] mb-4">Gallery Showcase ({galleryPreviews.length})</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {galleryPreviews.map((prev, idx) => (
                  <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-gray-100 group">
                    <img src={prev.url} alt="" className="w-full h-full object-cover" />
                    <button 
                      type="button"
                      onClick={() => removeGalleryImage(idx)}
                      className="absolute top-1 right-1 bg-black/70 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                ))}
                <button 
                  type="button"
                  onClick={() => galleryFileInputRef.current?.click()}
                  className="aspect-square rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 flex flex-col items-center justify-center hover:border-black transition-all"
                >
                  <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-tighter mt-1">Add More</span>
                  <input type="file" ref={galleryFileInputRef} onChange={handleGalleryFilesChange} className="hidden" accept="image/*" multiple />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Core Details */}
        <div className="space-y-6">
          <h3 className="text-xs font-black uppercase tracking-widest text-black border-b-2 border-black pb-2">Identification & Pricing</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] ml-1">VIN Number</label>
              <input type="text" name="vin" required maxLength={17} value={formData.vin} onChange={handleChange} className="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl px-4 py-3 text-sm font-bold focus:bg-white focus:border-black transition-all outline-none uppercase" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] ml-1">Price (USD)</label>
              <input type="number" name="price" required value={formData.price} onChange={handleChange} className="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl px-4 py-3 text-sm font-black focus:bg-white focus:border-black transition-all outline-none" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] ml-1">Year</label>
              <input type="number" name="year" required value={formData.year} onChange={handleChange} className="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl px-4 py-3 text-sm font-bold focus:bg-white focus:border-black transition-all outline-none" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] ml-1">Color</label>
              <input type="text" name="color" required value={formData.color} onChange={handleChange} className="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl px-4 py-3 text-sm font-bold focus:bg-white focus:border-black transition-all outline-none" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] ml-1">Make</label>
              <input type="text" name="make" required value={formData.make} onChange={handleChange} className="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl px-4 py-3 text-sm font-bold focus:bg-white focus:border-black transition-all outline-none" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] ml-1">Model</label>
              <input type="text" name="model" required value={formData.model} onChange={handleChange} className="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl px-4 py-3 text-sm font-bold focus:bg-white focus:border-black transition-all outline-none" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] ml-1">Mileage</label>
              <input type="number" name="mileage" required value={formData.mileage} onChange={handleChange} className="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl px-4 py-3 text-sm font-bold focus:bg-white focus:border-black transition-all outline-none" />
            </div>
          </div>
        </div>

        {/* Section 3: Technical Specs & Features */}
        <div className="space-y-6">
          <h3 className="text-xs font-black uppercase tracking-widest text-black border-b-2 border-black pb-2">Technical specs & features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] mb-2 block">Vehicle Description</label>
                <textarea 
                  name="description" 
                  rows={6} 
                  value={formData.description} 
                  onChange={handleChange} 
                  placeholder="Describe the vehicle's condition, performance, and history..."
                  className="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl px-4 py-3 text-sm focus:bg-white focus:border-black transition-all outline-none resize-none"
                ></textarea>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] ml-1">Transmission</label>
                  <input type="text" name="transmission" value={formData.transmission} onChange={handleChange} className="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl px-4 py-3 text-sm font-bold focus:bg-white focus:border-black transition-all outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] ml-1">Engine</label>
                  <input type="text" name="engine" value={formData.engine} onChange={handleChange} className="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl px-4 py-3 text-sm font-bold focus:bg-white focus:border-black transition-all outline-none" />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] mb-4 block">Key Features List</label>
                <div className="flex gap-2 mb-4">
                  <input 
                    type="text" 
                    value={newFeature} 
                    onChange={(e) => setNewFeature(e.target.value)} 
                    placeholder="Add a feature (e.g. Leather Seats)"
                    className="flex-1 bg-gray-50 border-2 border-gray-50 rounded-xl px-4 py-2 text-sm focus:bg-white focus:border-black transition-all outline-none"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                  />
                  <button type="button" onClick={addFeature} className="bg-black text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">Add</button>
                </div>
                <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-1">
                  {formData.specs.features.map((feature, idx) => (
                    <div key={idx} className="bg-gray-100 px-3 py-1.5 rounded-lg flex items-center gap-2 border border-gray-200">
                      <span className="text-xs font-bold text-gray-700">{feature}</span>
                      <button type="button" onClick={() => removeFeature(idx)} className="text-gray-400 hover:text-red-500">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] ml-1">Condition</label>
                  <input 
                    type="text" 
                    value={formData.specs.condition} 
                    onChange={(e) => setFormData(prev => ({ ...prev, specs: { ...prev.specs, condition: e.target.value } }))}
                    className="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl px-4 py-3 text-sm font-bold focus:bg-white focus:border-black transition-all outline-none" 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] ml-1">Warranty</label>
                  <input 
                    type="text" 
                    value={formData.specs.warranty} 
                    onChange={(e) => setFormData(prev => ({ ...prev, specs: { ...prev.specs, warranty: e.target.value } }))}
                    className="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl px-4 py-3 text-sm font-bold focus:bg-white focus:border-black transition-all outline-none" 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Row */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 pt-6 border-t border-gray-100">
          <div className="flex items-center p-4 bg-gray-50 rounded-2xl border-2 border-gray-50 hover:border-gray-200 transition-all cursor-pointer group">
            <input type="checkbox" name="featured" id="featured" checked={formData.featured} onChange={handleChange} className="h-5 w-5 text-black border-2 border-gray-300 rounded-lg focus:ring-0 transition-all" />
            <label htmlFor="featured" className="ml-4 block text-[11px] font-black text-gray-500 uppercase tracking-widest cursor-pointer group-hover:text-black">Highlight in Featured Inventory</label>
          </div>

          <div className="flex items-center gap-6">
            <button type="button" onClick={onCancel} className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-400 hover:text-black transition-colors">Discard Changes</button>
            <button type="submit" disabled={isLoading} className="px-10 py-4 bg-black text-white text-[11px] font-black uppercase tracking-[0.25em] rounded-2xl hover:bg-gray-800 transition-all shadow-xl shadow-black/10 active:scale-95 flex items-center gap-3 disabled:opacity-50">
              {isLoading ? 'Processing...' : 'Commit Asset'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
