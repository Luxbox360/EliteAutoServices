export default function AboutContent() {
  return (
    <section className="py-20">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-semibold tracking-tight mb-6">Who We Are</h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Elite Auto Services has been serving the community for over 20 years with dedication to quality and customer satisfaction. 
              Our team of experienced mechanics is committed to keeping your vehicle running smoothly and safely.
            </p>
            <p className="text-gray-600 leading-relaxed">
              We pride ourselves on transparent pricing, honest assessments, and expert workmanship on every job, no matter how big or small.
            </p>
          </div>
          <div className="rounded-lg overflow-hidden">
            <img 
              src="/assets/images/professional-auto-mechanic-shop-interior.jpg" 
              alt="Professional auto mechanic shop" 
              className="w-full h-auto" 
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}