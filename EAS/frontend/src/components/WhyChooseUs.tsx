const reasons = [
  { number: '1', title: 'Experience', desc: 'Over 20 years of proven expertise in automotive repair and maintenance' },
  { number: '2', title: 'Quality Parts', desc: 'We use only high-quality OEM and certified aftermarket parts' },
  { number: '3', title: 'Transparent Pricing', desc: 'No hidden fees - you know exactly what you\'re paying for' },
  { number: '4', title: 'Expert Team', desc: 'ASE-certified technicians who genuinely care about your vehicle' },
];

export default function WhyChooseUs() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-4xl font-semibold tracking-tight mb-12 text-center">Why Choose Us?</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {reasons.map((reason, index) => (
            <div key={index} className="bg-white p-8 rounded-lg border border-gray-200 text-center">
              <div className="text-5xl font-bold text-black mb-4">{reason.number}</div>
              <h3 className="text-2xl font-semibold mb-3">{reason.title}</h3>
              <p className="text-gray-600">{reason.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}