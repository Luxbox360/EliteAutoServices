import React, { useState, useEffect, useRef } from 'react';
import { API_BASE_URL } from '../config';
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
    transmission: 'Automatic (AT)',
    engine: '',
    description: '',
    image_main: '',
    images: [] as string[],
    specs: {
      condition: 'Excellent',
      warranty: '12 Months',
      features: ['Fully Inspected', 'Clean Title']
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
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
        transmission: vehicle.transmission || 'Automatic (AT)',
        engine: vehicle.engine || '',
        description: vehicle.description || '',
        image_main: vehicle.image_main || '',
        images: Array.isArray(vehicle.images) ? vehicle.images : [],
        specs: vehicleSpecs
      });

      if (vehicle.image_main) setMainPreviewUrl(getVehicleImageUrl(vehicle.image_main));
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
      reader.onloadend = () => setMainPreviewUrl(reader.result as string);
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
        specs: { ...prev.specs, features: [...prev.specs.features, newFeature.trim()] }
      }));
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      specs: { ...prev.specs, features: prev.specs.features.filter((_, i) => i !== index) }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      let image_main = formData.image_main;
      let gallery_images = galleryPreviews.filter(p => !p.file).map(p => p.name);

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

      const url = vehicle ? `${API_BASE_URL}/vehicles/${vehicle.id}` : `${API_BASE_URL}/vehicles`;
      const response = await fetch(url, {
        method: vehicle ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ ...formData, image_main, images: gallery_images }),
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
    <div className="bg-white p-6 md:p-12 rounded-[3rem] shadow-2xl shadow-black/10 border border-gray-100 animate-in zoom-in-95 duration-500 max-h-[95vh] overflow-y-auto custom-scrollbar">
      <div className="flex justify-between items-start mb-12">
        <div>
          <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.4em] mb-2 block">System Module / Inventory</span>
          <h2 className="text-4xl font-black text-gray-900 tracking-tighter uppercase leading-none">
            {vehicle ? 'Edit Asset' : 'New Intake'}
          </h2>
        </div>
        <button onClick={onCancel} className="p-4 hover:bg-gray-50 rounded-full transition-all group border border-transparent hover:border-gray-100">
          <svg className="w-6 h-6 text-gray-400 group-hover:text-black group-hover:rotate-90 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-16">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-8 py-5 rounded-2xl text-sm font-bold animate-in slide-in-from-left-4">
            {error}
          </div>
        )}

        {/* Section 1: Media */}
        <section className="space-y-8">
          <div className="flex items-center gap-4">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-black">Media Assets</h3>
            <div className="h-px bg-gray-100 flex-1"></div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
            <div className="lg:col-span-1">
              <label className="block text-[9px] font-black uppercase text-gray-400 tracking-widest mb-4">Primary Cover</label>
              <div 
                onClick={() => mainFileInputRef.current?.click()}
                className="relative aspect-square rounded-[2rem] border-2 border-dashed border-gray-200 bg-gray-50 flex flex-col items-center justify-center cursor-pointer group overflow-hidden transition-all hover:border-black hover:bg-white"
              >
                {mainPreviewUrl ? (
                  <>
                    <img src={mainPreviewUrl} alt="Main" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest">Update</span>
                    </div>
                  </>
                ) : (
                  <div className="text-center p-6 group-hover:scale-110 transition-transform">
                    <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center mx-auto mb-4">
                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                    </div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Select Image</p>
                  </div>
                )}
                <input type="file" ref={mainFileInputRef} onChange={handleMainFileChange} className="hidden" accept="image/*" />
              </div>
            </div>

            <div className="lg:col-span-3">
              <label className="block text-[9px] font-black uppercase text-gray-400 tracking-widest mb-4">Gallery Showcase ({galleryPreviews.length})</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
                {galleryPreviews.map((prev, idx) => (
                  <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border border-gray-100 group shadow-sm hover:shadow-xl transition-all duration-300">
                    <img src={prev.url} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-end p-2">
                      <button type="button" onClick={() => removeGalleryImage(idx)} className="bg-white/90 p-1.5 rounded-lg hover:bg-red-500 hover:text-white transition-colors">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                  </div>
                ))}
                <button 
                  type="button"
                  onClick={() => galleryFileInputRef.current?.click()}
                  className="aspect-square rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 flex flex-col items-center justify-center hover:border-black hover:bg-white transition-all group"
                >
                  <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                  </div>
                  <input type="file" ref={galleryFileInputRef} onChange={handleGalleryFilesChange} className="hidden" accept="image/*" multiple />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Core */}
        <section className="space-y-8">
          <div className="flex items-center gap-4">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-black">Core Specifications</h3>
            <div className="h-px bg-gray-100 flex-1"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10">
            <div className="relative">
              <label className="text-[9px] font-black uppercase text-gray-400 tracking-widest absolute -top-2 left-4 bg-white px-2 z-10">VIN Identification</label>
              <input
                type="text"
                name="vin"
                required
                maxLength={17}
                value={formData.vin}
                onChange={handleChange}
                placeholder="17 Characters"
                className="w-full bg-white border-2 border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold focus:border-black transition-all outline-none placeholder-gray-300"
              />
            </div>
            
            <div className="relative">
              <label className="text-[9px] font-black uppercase text-gray-400 tracking-widest absolute -top-2 left-4 bg-white px-2 z-10">Listing Price (USD)</label>
              <input
                type="number"
                name="price"
                required
                max="99999999"
                value={formData.price}
                onChange={(e) => {
                  if (e.target.value.length <= 8) handleChange(e);
                }}
                placeholder="0.00"
                className="w-full bg-white border-2 border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold focus:border-black transition-all outline-none placeholder-gray-300"
              />
            </div>

            {[
              { label: 'Production Year', name: 'year', type: 'number', placeholder: '2024' },
              { label: 'Exterior Finish', name: 'color', type: 'text', placeholder: 'e.g. Alpine White' },
              { label: 'Manufacturer', name: 'make', type: 'text', placeholder: 'e.g. BMW' },
              { label: 'Model Designation', name: 'model', type: 'text', placeholder: 'e.g. M3 Competition' },
              { label: 'Recorded Odometer', name: 'mileage', type: 'number', placeholder: 'Miles' },
            ].map((field) => (
              <div key={field.name} className="relative">
                <label className="text-[9px] font-black uppercase text-gray-400 tracking-widest absolute -top-2 left-4 bg-white px-2 z-10">{field.label}</label>
                <input
                  type={field.type}
                  name={field.name}
                  required
                  value={(formData as any)[field.name]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  className="w-full bg-white border-2 border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold focus:border-black transition-all outline-none placeholder-gray-300"
                />
              </div>
            ))}
            
            <div className="relative">
              <label className="text-[9px] font-black uppercase text-gray-400 tracking-widest absolute -top-2 left-4 bg-white px-2 z-10">Asset Type</label>
              <select name="type" value={formData.type} onChange={handleChange} className="w-full bg-white border-2 border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold focus:border-black transition-all outline-none appearance-none">
                {['SUV', 'Sedan', 'Truck', 'Coupe', 'Van'].map(t => <option key={t} value={t}>{t.toUpperCase()}</option>)}
              </select>
            </div>
          </div>
        </section>

        {/* Section 3: Technical */}
        <section className="grid lg:grid-cols-2 gap-16">
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-black">Detailed Profile</h3>
              <div className="h-px bg-gray-100 flex-1"></div>
            </div>
            <textarea 
              name="description" 
              rows={8} 
              value={formData.description} 
              onChange={handleChange} 
              placeholder="Provide a comprehensive overview of the vehicle's provenance, technical condition, and unique selling points..."
              className="w-full bg-gray-50 border-2 border-gray-50 rounded-[2rem] px-6 py-5 text-sm font-medium focus:bg-white focus:border-black transition-all outline-none resize-none leading-relaxed"
            ></textarea>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="relative">
                <label className="text-[9px] font-black uppercase text-gray-400 tracking-widest absolute -top-2 left-4 bg-white px-2 z-10">Power Plant</label>
                <input type="text" name="engine" value={formData.engine} onChange={handleChange} placeholder="e.g. 4.4L V8 Bi-Turbo" className="w-full bg-white border-2 border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold focus:border-black transition-all outline-none" />
              </div>
              <div className="relative">
                <label className="text-[9px] font-black uppercase text-gray-400 tracking-widest absolute -top-2 left-4 bg-white px-2 z-10">Transmission</label>
                <select name="transmission" value={formData.transmission} onChange={handleChange} className="w-full bg-white border-2 border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold focus:border-black transition-all outline-none cursor-pointer appearance-none">
                  <option value="Automatic (AT)">Automatic (AT)</option>
                  <option value="Manual (MT)">Manual (MT)</option>
                  <option value="Sequential manual (SMT)">Sequential manual (SMT)</option>
                </select>
                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-black">Feature Stack</h3>
              <div className="h-px bg-gray-100 flex-1"></div>
            </div>
            <div className="flex gap-3">
              <input 
                type="text" 
                value={newFeature} 
                onChange={(e) => setNewFeature(e.target.value)} 
                placeholder="Add signature feature..."
                className="flex-1 bg-white border-2 border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold focus:border-black transition-all outline-none"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
              />
              <button type="button" onClick={addFeature} className="bg-black text-white px-8 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-colors">Add</button>
            </div>
            
            <div className="flex flex-wrap gap-2 min-h-[120px] p-6 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-100">
              {formData.specs.features.length === 0 ? (
                <p className="text-[10px] font-bold text-gray-300 uppercase m-auto tracking-widest italic">No features listed yet</p>
              ) : (
                formData.specs.features.map((feature, idx) => (
                  <div key={idx} className="bg-white px-4 py-2 rounded-xl flex items-center gap-3 border border-gray-200 shadow-sm animate-in fade-in zoom-in-95 duration-300">
                    <span className="text-[10px] font-black text-gray-700 uppercase tracking-tight">{feature}</span>
                    <button type="button" onClick={() => removeFeature(idx)} className="text-gray-300 hover:text-red-500 transition-colors">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="relative">
                <label className="text-[9px] font-black uppercase text-gray-400 tracking-widest absolute -top-2 left-4 bg-white px-2 z-10">Unit Condition</label>
                <input type="text" value={formData.specs.condition} onChange={(e) => setFormData(prev => ({ ...prev, specs: { ...prev.specs, condition: e.target.value } }))} className="w-full bg-white border-2 border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold focus:border-black transition-all outline-none" />
              </div>
              <div className="relative">
                <label className="text-[9px] font-black uppercase text-gray-400 tracking-widest absolute -top-2 left-4 bg-white px-2 z-10">Warranty Scope</label>
                <input type="text" value={formData.specs.warranty} onChange={(e) => setFormData(prev => ({ ...prev, specs: { ...prev.specs, warranty: e.target.value } }))} className="w-full bg-white border-2 border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold focus:border-black transition-all outline-none" />
              </div>
            </div>
          </div>
        </section>

        {/* Submit */}
        <div className="flex flex-col md:flex-row justify-end items-center gap-8 pt-12 border-t border-gray-100">
          <div className="flex items-center gap-8">
            <button type="button" onClick={onCancel} className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 hover:text-red-500 transition-all">Discard</button>
            <button 
              type="submit" 
              disabled={isLoading} 
              className="relative px-12 py-5 bg-black text-white text-[11px] font-black uppercase tracking-[0.4em] rounded-2xl hover:bg-blue-600 transition-all shadow-xl shadow-black/10 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group overflow-hidden"
            >
              <span className={isLoading ? 'opacity-0' : 'relative z-10'}>{vehicle ? 'Update Asset' : 'Commit Asset'}</span>
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                </div>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
