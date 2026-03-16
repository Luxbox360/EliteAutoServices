interface VehiclesCTAProps {
  onContact?: () => void;
}

export default function VehiclesCTA({ onContact }: VehiclesCTAProps) {
  return (
    <section className="py-16 bg-black text-white text-center">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">
          Interested in any of these vehicles?
        </h2>
        <p className="text-lg mb-8 opacity-90">
          Contact us for a test drive or more information
        </p>
        <button 
          onClick={onContact}
          className="inline-block bg-white text-black font-semibold py-3 px-8 rounded hover:bg-gray-200 transition-colors"
        >
          Get in Touch
        </button>
      </div>
    </section>
  );
}
