interface VehicleCTAProps {
  onViewAvailable: () => void;
}

export default function VehicleCTA({ onViewAvailable }: VehicleCTAProps) {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-gray-50 rounded-2xl p-12 md:p-20 text-center border border-gray-100 shadow-sm">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight uppercase">Looking for a reliable vehicle?</h2>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Browse our selection of quality pre-owned vehicles, thoroughly inspected and ready for the road.
          </p>
          <button 
            onClick={onViewAvailable}
            className="inline-block bg-black text-white font-bold py-4 px-10 rounded uppercase tracking-widest hover:bg-gray-800 transition-all transform hover:scale-105"
          >
            View Available Vehicles →
          </button>
        </div>
      </div>
    </section>
  );
}
