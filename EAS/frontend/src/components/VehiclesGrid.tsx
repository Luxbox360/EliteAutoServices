import { getVehicleImageUrl } from '../utils/image-utils';

interface Vehicle {
  id: number;
  title: string;
  make: string;
  type: string;
  color: string;
  mileage: string;
  price: string;
  image: string;
}

interface VehiclesGridProps {
  vehicles: Vehicle[];
  setSelectedVehicleId: (id: number) => void;
  setCurrentPage: (page: 'home' | 'about' | 'vehicles' | 'vehicle-detail') => void;  // ← NUEVO
}

export default function VehiclesGrid({ 
  vehicles, 
  setSelectedVehicleId, 
  setCurrentPage  // ← NUEVO
}: VehiclesGridProps) {
  return (
    <section className="py-20">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {vehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all"
            >
              <div className="h-64 bg-gray-200 overflow-hidden">
                <img
                  src={getVehicleImageUrl(vehicle.image)}
                  alt={vehicle.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-4">{vehicle.title}</h3>
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Type:</strong> {vehicle.type}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Color:</strong> {vehicle.color}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Mileage:</strong> {vehicle.mileage}
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  <strong>Price:</strong> {vehicle.price}
                </p>
                <button
                  onClick={() => {
                    setSelectedVehicleId(vehicle.id);     // ← MANTIENE
                    setCurrentPage('vehicle-detail');     // ← NUEVO: CAMBIA PÁGINA
                  }}
                  className="block w-full bg-black text-white font-semibold py-2 px-4 rounded text-center hover:bg-gray-800 transition-colors text-sm"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}