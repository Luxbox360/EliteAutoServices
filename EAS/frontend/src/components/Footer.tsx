import type { Page } from '../App';

interface FooterProps {
  setCurrentPage: (page: Page) => void;
}

export default function Footer({ setCurrentPage }: FooterProps) {
  const navigate = (page: Page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div>
            <h3 className="text-xl font-bold uppercase tracking-tighter mb-6">Elite Auto Services</h3>
            <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
              Providing expert automotive care and high-quality pre-owned vehicles for over 20 years. Quality you can trust, service you can depend on.
            </p>
          </div>
          
          <div>
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-500 mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <button 
                  onClick={() => navigate('home')} 
                  className="text-sm text-gray-400 hover:text-white transition-colors uppercase font-bold tracking-widest"
                >
                  Home
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('about')} 
                  className="text-sm text-gray-400 hover:text-white transition-colors uppercase font-bold tracking-widest"
                >
                  About
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('vehicles')} 
                  className="text-sm text-gray-400 hover:text-white transition-colors uppercase font-bold tracking-widest"
                >
                  Vehicles
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('contact')} 
                  className="text-sm text-gray-400 hover:text-white transition-colors uppercase font-bold tracking-widest"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-500 mb-6">Contact Info</h3>
            <ul className="space-y-4">
              <li>
                <a href="tel:2815202646" className="flex items-center gap-3 text-sm text-gray-400 hover:text-white transition-colors group">
                  <span className="bg-gray-800 p-2 rounded group-hover:bg-black transition-colors">📞</span>
                  (281) 520-2646
                </a>
              </li>
              <li>
                <a href="mailto:info@eliteautoservices.com" className="flex items-center gap-3 text-sm text-gray-400 hover:text-white transition-colors group">
                  <span className="bg-gray-800 p-2 rounded group-hover:bg-black transition-colors">✉️</span>
                  info@eliteautoservices.com
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-400">
                <span className="bg-gray-800 p-2 rounded">📍</span>
                123 Main St, Your City
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
            &copy; {new Date().getFullYear()} Elite Auto Services. All rights reserved.
          </p>
          <div className="flex gap-6">
            <button onClick={() => navigate('login')} className="text-[10px] font-bold text-gray-600 hover:text-gray-400 uppercase tracking-widest transition-colors">
              Admin Access
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
