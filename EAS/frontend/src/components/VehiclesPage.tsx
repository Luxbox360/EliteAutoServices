import { useEffect, useState, useMemo } from 'react';
import { API_BASE_URL } from '../config';
import VehiclesHero from './VehiclesHero';
import VehiclesGrid from './VehiclesGrid';
import VehiclesCTA from './VehiclesCTA';
import { getVehicleImageUrl } from '../utils/image-utils';
import type { Page, ContactVehicleInfo } from '../App';
import type { Vehicle } from '../types';

export interface VehicleGridItem {
  id: number;
  title: string;
  make: string;
  type: string;
  color: string;
  mileage: string;
  price: string;
  rawPrice: number;
  image: string;
}

interface VehiclesPageProps {
  setSelectedVehicleId: (id: number) => void;
  setCurrentPage: (page: Page) => void;
  onContact: (vehicleInfo?: ContactVehicleInfo) => void;
}

export default function VehiclesPage({ 
  setSelectedVehicleId, 
  setCurrentPage,
  onContact
}: VehiclesPageProps) {

  const [vehicles, setVehicles] = useState<VehicleGridItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [filterMake, setFilterMake] = useState('All');
  const [filterType, setFilterType] = useState('All');
  const [sortBy, setSortBy] = useState('Newest');

  useEffect(() => {
    fetch(`${API_BASE_URL}/vehicles`)
      .then(res => res.json())
      .then((data: Vehicle[]) => {
        const formatted: VehicleGridItem[] = data.map((v) => ({
          id: v.id,
          title: `${v.year} ${v.make} ${v.model}`,
          make: v.make,
          type: v.type,
          color: v.color,
          mileage: `${Number(v.mileage).toLocaleString()} miles`,
          price: `$${Number(v.price).toLocaleString()}`,
          rawPrice: Number(v.price),
          image: getVehicleImageUrl(v.image_main)
        }));

        setVehicles(formatted);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching vehicles:', err);
        setLoading(false);
      });
  }, []);

  const makes = useMemo(() => ['All', ...new Set(vehicles.map(v => v.make))], [vehicles]);
  const types = useMemo(() => ['All', ...new Set(vehicles.map(v => v.type))], [vehicles]);

  const filteredVehicles = useMemo(() => {
    const result = vehicles.filter(v => {
      const matchMake = filterMake === 'All' || v.make === filterMake;
      const matchType = filterType === 'All' || v.type === filterType;
      return matchMake && matchType;
    });

    if (sortBy === 'Price: Low to High') {
      result.sort((a, b) => a.rawPrice - b.rawPrice);
    } else if (sortBy === 'Price: High to Low') {
      result.sort((a, b) => b.rawPrice - a.rawPrice);
    }
    
    return result;
  }, [vehicles, filterMake, filterType, sortBy]);

  if (loading) {
    return (
      <div className="py-20 text-center text-gray-600">
        Loading vehicles...
      </div>
    );
  }

  return (
    <>
      <VehiclesHero />
      
      {/* Filters Bar */}
      <section className="bg-gray-50 border-b border-gray-200 py-6">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="w-full md:w-auto">
              <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Make</label>
              <select 
                value={filterMake}
                onChange={(e) => setFilterMake(e.target.value)}
                className="w-full md:w-48 bg-white border border-gray-300 rounded px-3 py-2 text-sm focus:ring-black focus:border-black"
              >
                {makes.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            
            <div className="w-full md:w-auto">
              <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Type</label>
              <select 
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full md:w-48 bg-white border border-gray-300 rounded px-3 py-2 text-sm focus:ring-black focus:border-black"
              >
                {types.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <div className="w-full md:w-auto md:ml-auto">
              <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Sort By</label>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full md:w-48 bg-white border border-gray-300 rounded px-3 py-2 text-sm focus:ring-black focus:border-black"
              >
                <option>Newest</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
              </select>
            </div>
          </div>
          
          <div className="mt-4 text-sm text-gray-500">
            Showing {filteredVehicles.length} vehicles
          </div>
        </div>
      </section>

      <VehiclesGrid 
        vehicles={filteredVehicles}
        setSelectedVehicleId={setSelectedVehicleId}
        setCurrentPage={setCurrentPage}
      />
      <VehiclesCTA onContact={onContact} />
    </>
  );
}
