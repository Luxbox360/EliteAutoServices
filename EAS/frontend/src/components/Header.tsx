import type { Page } from '../App';

interface HeaderProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  isLoggedIn: boolean;
  onLogout: () => void;
}

export default function Header({ 
  isMenuOpen, 
  setIsMenuOpen, 
  currentPage, 
  setCurrentPage,
  isLoggedIn,
  onLogout
}: HeaderProps) {
  
  const closeMenu = () => setIsMenuOpen(false);

  const navLinks: { id: Page; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'vehicles', label: 'Vehicles' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 sm:h-20 items-center justify-between">
          
          {/* Logo / Brand */}
          <button 
            onClick={() => {
              setCurrentPage('home');
              closeMenu();
            }}
            className="flex flex-col items-start group"
          >
            <span className="text-xl sm:text-2xl font-black text-black tracking-tighter leading-none group-hover:tracking-normal transition-all duration-300 uppercase font-sans">
              Elite Auto
            </span>
            <span className="text-[8px] sm:text-[10px] font-bold text-gray-500 tracking-[0.3em] uppercase leading-none mt-1">
              Services
            </span>
          </button>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden flex flex-col gap-1 p-2 rounded-lg hover:bg-gray-100 transition-colors" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <div className={`w-6 h-0.5 bg-black transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></div>
            <div className={`w-6 h-0.5 bg-black transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></div>
            <div className={`w-6 h-0.5 bg-black transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></div>
          </button>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  setCurrentPage(link.id);
                  window.location.hash = `#${link.id}`;
                  closeMenu();
                }}
                className={`px-4 py-2 text-[11px] font-bold uppercase tracking-wider transition-all duration-200 rounded-lg ${
                  currentPage === link.id 
                    ? 'text-black bg-gray-50' 
                    : 'text-gray-600 hover:text-black hover:bg-gray-50'
                }`}
              >
                {link.label}
              </button>
            ))}

            <div className="h-4 w-px bg-gray-200 mx-2 lg:mx-4"></div>

            <div className="flex items-center gap-2">
              <button 
                onClick={() => {
                  setCurrentPage('contact');
                  closeMenu();
                }}
                className={`px-5 py-2 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all border-2 ${
                  currentPage === 'contact'
                    ? 'bg-black text-white border-black'
                    : 'bg-transparent text-black border-black hover:bg-black hover:text-white'
                }`}
              >
                Contact
              </button>

              {isLoggedIn && (
                <>
                  <button 
                    onClick={() => {
                      setCurrentPage('admin-dashboard');
                      closeMenu();
                    }}
                    className={`px-5 py-2 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all border-2 flex items-center gap-2 ${
                      currentPage === 'admin-dashboard' 
                        ? 'bg-gray-100 text-black border-gray-200' 
                        : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    Dashboard
                  </button>
                  
                  <button 
                    onClick={() => {
                      onLogout();
                      closeMenu();
                    }}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50 group"
                    title="Logout Session"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </button>
                </>
              )}
            </div>

            {!isLoggedIn && (
              <button 
                onClick={() => {
                  setCurrentPage('login');
                  closeMenu();
                }}
                className="ml-4 px-3 py-2 text-[10px] font-bold text-gray-400 hover:text-black transition-colors uppercase tracking-widest"
              >
                Admin
              </button>
            )}
          </nav>

          {/* Mobile Navigation Dropdown */}
          <div className={`md:hidden absolute top-16 sm:top-20 left-0 w-full bg-white border-t border-gray-100 shadow-xl transition-all duration-300 origin-top ${
            isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
          }`}>
            <div className="flex flex-col p-6 gap-4">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => {
                    setCurrentPage(link.id);
                    closeMenu();
                  }}
                  className={`text-left px-4 py-3 text-sm font-bold uppercase tracking-widest rounded-xl transition-all ${
                    currentPage === link.id ? 'bg-gray-50 text-black' : 'text-gray-600'
                  }`}
                >
                  {link.label}
                </button>
              ))}
              
              <div className="h-px bg-gray-100 my-2"></div>

              <button 
                onClick={() => {
                  setCurrentPage('contact');
                  closeMenu();
                }}
                className={`w-full py-4 rounded-xl text-xs font-bold uppercase tracking-widest border-2 ${
                  currentPage === 'contact' ? 'bg-black text-white border-black' : 'border-black text-black'
                }`}
              >
                Contact
              </button>

              {isLoggedIn && (
                <div className="grid grid-cols-2 gap-3 mt-2">
                  <button 
                    onClick={() => {
                      setCurrentPage('admin-dashboard');
                      closeMenu();
                    }}
                    className="py-4 rounded-xl text-[10px] font-bold uppercase tracking-widest bg-gray-50 text-gray-900 border border-gray-200"
                  >
                    Dashboard
                  </button>
                  <button 
                    onClick={() => {
                      onLogout();
                      closeMenu();
                    }}
                    className="py-4 rounded-xl text-[10px] font-bold uppercase tracking-widest bg-red-50 text-red-600 border border-red-100"
                  >
                    Logout
                  </button>
                </div>
              )}

              {!isLoggedIn && (
                <button 
                  onClick={() => {
                    setCurrentPage('login');
                    closeMenu();
                  }}
                  className="w-full py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center"
                >
                  Admin Access
                </button>
              )}
            </div>
          </div>

        </div>
      </div>
    </header>
  );
}
