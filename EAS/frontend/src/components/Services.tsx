const services = [
  { icon: '🔧', title: 'General Repairs', desc: 'Comprehensive diagnostic and repair services for all vehicle makes and models' },
  { icon: '🚗', title: 'Preventive Maintenance', desc: 'Regular maintenance to keep your vehicle running smoothly and efficiently' },
  { icon: '✓', title: 'Quality Parts', desc: 'We use only high-quality OEM and aftermarket parts for all repairs' },
  { icon: '⏱', title: 'Fast Service', desc: 'Most repairs completed same-day with our efficient service process' }
];

export default function Services() {
  return (
    <section className="py-20 bg-gray-50" id="services">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">Our Services</h2>
        <p className="text-lg text-gray-600 max-w-2xl mb-12">
          From routine maintenance to complex repairs, we handle it all with expertise and care.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service, index) => (
            <div key={index} className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all">
              <div className="text-4xl mb-4">{service.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{service.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}