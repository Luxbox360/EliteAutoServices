import { useState, useEffect } from 'react';
import { getVehicleImageUrl } from '../utils/image-utils';
import type { Page, ContactVehicleInfo } from '../App';
import type { Vehicle } from '../types';

interface VehicleImages {
  main: string;
  gallery: string[];
}

interface VehicleDetail extends Vehicle {
  images_formatted: VehicleImages;
}

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
  const [vehicle, setVehicle] = useState<VehicleDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    fetch(`http://localhost:3000/api/vehicles/${vehicleId}`)
      .then(res => res.json())
      .then((data: Vehicle) => {
        const vehicleData: VehicleDetail = {
          ...data,
          images_formatted: (data.images as unknown as VehicleImages) || {
            main: data.image_main || 'placeholder.jpg',
            gallery: [data.image_main || 'placeholder.jpg', data.image_main || 'placeholder.jpg']
          }
        };
        setVehicle(vehicleData);
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
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading vehicle...
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Vehicle not found
      </div>
    );
  }

  const currentImageSrc = getVehicleImageUrl(vehicle.images_formatted.main);
  const thumbnails = vehicle.images_formatted.gallery.map(img => getVehicleImageUrl(img));

  const handleBackToVehicles = () => {
    setSelectedVehicleId(null);
    setCurrentPage('vehicles');
  };

  const specsData = (vehicle.specs as Record<string, any>) || {
    condition: 'Excellent',
    warranty: '12 Months',
    features: ['Fully Inspected', 'Clean Title']
  };

  const getVehicleDescription = () => {
    if (vehicle.description && vehicle.description.trim() !== '') {
      return vehicle.description;
    }
    return `This ${vehicle.make} ${vehicle.model} has been carefully selected and thoroughly inspected by our expert team. It represents excellent value and reliability. Every vehicle in our inventory meets our strict quality standards.`;
  };

  return (
    <>
      {/* Breadcrumb */}
      <nav className="bg-gray-100 border-b border-gray-200 py-3">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-2 flex-wrap text-sm">
            <button onClick={() => setCurrentPage('home')} className="text-black hover:font-semibold transition-all">
              Home
            </button>
            <span className="text-gray-400">/</span>
            <button onClick={handleBackToVehicles} className="text-black hover:font-semibold transition-all">
              Vehicles
            </button>
            <span className="text-gray-400">/</span>
            <span className="text-gray-600">{`${vehicle.year} ${vehicle.make} ${vehicle.model}`}</span>
          </div>
        </div>
      </nav>

      {/* Main Detail Section */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 mb-20">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="bg-gray-100 rounded-lg overflow-hidden border border-gray-300">
                <img
                  src={currentImageSrc}
                  alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                  className="w-full h-96 object-cover transition-opacity duration-300"
                />
              </div>
              <div className="grid grid-cols-5 gap-2">
                {thumbnails.map((src, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setCurrentImageIndex(index)}
                    className={`h-20 bg-gray-100 border-2 rounded overflow-hidden transition-all ${
                      currentImageIndex === index ? 'border-black' : 'border-gray-300'
                    }`}
                  >
                    <img
                      src={src}
                      alt={`${vehicle.make} ${vehicle.model} view ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Vehicle Information */}
            <div>
              <h1 className="text-4xl font-bold mb-6">{`${vehicle.year} ${vehicle.make} ${vehicle.model}`}</h1>

              <div className="mb-8 pb-6 border-b-2 border-black">
                <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider block mb-2">Price</span>
                <h2 className="text-4xl font-bold text-black">${Number(vehicle.price).toLocaleString()}</h2>
              </div>

              {/* Quick Facts */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs font-semibold text-gray-600 uppercase block mb-1">Year</span>
                    <span className="text-lg font-semibold text-black">{vehicle.year}</span>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-gray-600 uppercase block mb-1">Type</span>
                    <span className="text-lg font-semibold text-black">{vehicle.type}</span>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-gray-600 uppercase block mb-1">Color</span>
                    <span className="text-lg font-semibold text-black">{vehicle.color}</span>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-gray-600 uppercase block mb-1">Mileage</span>
                    <span className="text-lg font-semibold text-black">{Number(vehicle.mileage).toLocaleString()} miles</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 mb-8">
                <button 
                  onClick={() => onInquire({
                    id: vehicle.id,
                    year: vehicle.year,
                    make: vehicle.make,
                    model: vehicle.model,
                    price: Number(vehicle.price),
                    image: vehicle.image_main || 'placeholder.jpg'
                  })}
                  className="bg-black text-white font-semibold py-3 px-6 rounded hover:bg-gray-800 transition-colors text-center"
                >
                  Schedule Test Drive
                </button>
                <button 
                  onClick={() => onInquire({
                    id: vehicle.id,
                    year: vehicle.year,
                    make: vehicle.make,
                    model: vehicle.model,
                    price: Number(vehicle.price),
                    image: vehicle.image_main || 'placeholder.jpg'
                  })}
                  className="border-2 border-black text-black font-semibold py-3 px-6 rounded hover:bg-gray-100 transition-colors text-center"
                >
                  Get More Info
                </button>
              </div>

              {/* Specifications */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 border-b-2 border-black pb-2">Specifications</h3>
                <table className="w-full text-sm">
                  <tbody>
                    <tr className="border-b border-gray-200">
                      <td className="font-semibold text-gray-600 py-2">VIN</td>
                      <td className="py-2 font-mono">{vehicle.vin}</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="font-semibold text-gray-600 py-2">Title Status</td>
                      <td className="py-2">
                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                          (vehicle.title_status || 'Clean').toLowerCase() === 'clean' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {vehicle.title_status || 'Clean'}
                        </span>
                      </td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="font-semibold text-gray-600 py-2">Make & Model</td>
                      <td className="py-2">{`${vehicle.make} ${vehicle.model}`}</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="font-semibold text-gray-600 py-2">Vehicle Type</td>
                      <td className="py-2">{vehicle.type}</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="font-semibold text-gray-600 py-2">Exterior Color</td>
                      <td className="py-2">{vehicle.color}</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="font-semibold text-gray-600 py-2">Mileage</td>
                      <td className="py-2">{Number(vehicle.mileage).toLocaleString()} miles</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="font-semibold text-gray-600 py-2">Condition</td>
                      <td className="py-2">{specsData.condition || 'Excellent - Fully Inspected'}</td>
                    </tr>
                    <tr>
                      <td className="font-semibold text-gray-600 py-2">Warranty</td>
                      <td className="py-2">{specsData.warranty || '12 Months Coverage'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="border-t-2 border-b-2 border-gray-200 py-16 mb-16">
            <h2 className="text-3xl font-semibold text-center mb-12">Vehicle Features</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {(specsData.features || [
                'Fully Inspected', 'Clean Title', 'Regular Maintenance',
                'No Accidents', 'Service Records', 'Warranty Included'
              ]).map((feature: string) => (
                <div key={feature} className="text-center">
                  <span className="text-3xl font-bold text-black block mb-2">✓</span>
                  <span className="font-semibold">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 mb-16">
            <h2 className="text-2xl font-semibold mb-4 border-b-2 border-black pb-3">About This Vehicle</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              {getVehicleDescription()}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
