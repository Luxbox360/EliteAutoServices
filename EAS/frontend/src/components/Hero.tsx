interface HeroProps {
  onBrowseVehicles: () => void;
}

export default function Hero({ onBrowseVehicles }: HeroProps) {
  return (
    <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/assets/images/professional-auto-mechanic-shop-interior.jpg" 
          alt="Luxury car in shop" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center text-white">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight uppercase">
          Expert automotive care you can trust
        </h1>
        <p className="text-xl md:text-2xl mb-10 text-gray-300 max-w-2xl mx-auto leading-relaxed">
          With over 20 years of experience, we provide professional repair services and quality used vehicles to keep you on the road.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button 
            onClick={onBrowseVehicles}
            className="w-full sm:w-auto bg-white text-black font-bold py-4 px-10 rounded uppercase tracking-widest hover:bg-gray-200 transition-all transform hover:scale-105"
          >
            Browse Vehicles →
          </button>
        </div>
      </div>
    </section>
  );
}
