import { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import VehicleCTA from './components/VehicleCTA';
import Footer from './components/Footer';
import AboutPage from './components/AboutPage';
import VehiclesPage from './components/VehiclesPage';
import VehicleDetailPage from './components/VehicleDetailPage';
import ContactPage from './components/ContactPage';
import LoginPage from './components/LoginPage';
import AdminDashboard from './components/AdminDashboard';
import type { User } from './types';

import './index.css';

export type Page = 'home' | 'about' | 'vehicles' | 'vehicle-detail' | 'contact' | 'login' | 'admin-dashboard';

export interface ContactVehicleInfo {
  id: number;
  year: number;
  make: string;
  model: string;
  price: number;
  image: string;
}

interface AuthData {
  token: string;
  user: User;
}

function App() {
  // Initial state from Hash
  const getInitialPage = (): Page => {
    const hash = window.location.hash.replace('#', '');
    if (hash.startsWith('vehicle-detail/')) return 'vehicle-detail';
    const validPages: Page[] = ['home', 'about', 'vehicles', 'contact', 'login', 'admin-dashboard'];
    return validPages.includes(hash as Page) ? (hash as Page) : 'home';
  };

  const getInitialVehicleId = (): number | null => {
    const hash = window.location.hash.replace('#', '');
    if (hash.startsWith('vehicle-detail/')) {
      const id = parseInt(hash.split('/')[1]);
      return isNaN(id) ? null : id;
    }
    return null;
  };

  const [currentPage, setCurrentPage] = useState<Page>(getInitialPage());
  const [selectedVehicleId, setSelectedVehicleId] = useState<number | null>(getInitialVehicleId());
  const [contactVehicleInfo, setContactVehicleInfo] = useState<ContactVehicleInfo | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [auth, setAuth] = useState<AuthData | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Sync Hash with State
  useEffect(() => {
    let hash = `#${currentPage}`;
    if (currentPage === 'vehicle-detail' && selectedVehicleId) {
      hash = `#vehicle-detail/${selectedVehicleId}`;
    }
    window.location.hash = hash;
  }, [currentPage, selectedVehicleId]);

  // Handle Browser Back/Forward
  useEffect(() => {
    const handleHashChange = () => {
      const newPage = getInitialPage();
      const newId = getInitialVehicleId();
      setCurrentPage(newPage);
      setSelectedVehicleId(newId);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Check for existing session
  useEffect(() => {
    const savedAuth = localStorage.getItem('eas_auth');
    if (savedAuth) {
      try {
        setAuth(JSON.parse(savedAuth));
      } catch (e) {
        console.error('Failed to parse auth data', e);
      }
    }
    setIsInitialized(true);
  }, []);

  // Route Protection
  useEffect(() => {
    if (isInitialized && !auth && currentPage === 'admin-dashboard') {
      setCurrentPage('login');
    }
  }, [isInitialized, auth, currentPage]);

  const handleLogin = (token: string, user: User) => {
    const authData = { token, user };
    setAuth(authData);
    localStorage.setItem('eas_auth', JSON.stringify(authData));
    setCurrentPage('admin-dashboard');
  };

  const handleLogout = () => {
    setAuth(null);
    localStorage.removeItem('eas_auth');
    setCurrentPage('home');
  };

  const navigateToContact = useCallback((vehicleInfo?: ContactVehicleInfo) => {
    if (vehicleInfo && vehicleInfo.id) {
      setContactVehicleInfo(vehicleInfo);
    } else {
      setContactVehicleInfo(null);
    }
    setCurrentPage('contact');
    window.scrollTo(0, 0);
  }, []);

  const navigateToVehicles = () => {
    setCurrentPage('vehicles');
    window.scrollTo(0, 0);
  };

  const isLoginPage = currentPage === 'login';

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-black uppercase tracking-widest italic">Initializing Platform...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans antialiased">
      {!isLoginPage && (
        <Header 
          isMenuOpen={isMenuOpen} 
          setIsMenuOpen={setIsMenuOpen}
          currentPage={currentPage}
          setCurrentPage={(page) => {
            if (page === 'contact') navigateToContact();
            else {
              setCurrentPage(page as Page);
              window.scrollTo(0, 0);
            }
          }}
          isLoggedIn={!!auth}
          onLogout={handleLogout}
        />
      )}
      
      {currentPage === 'home' ? (
        <>
          <main>
            <Hero onBrowseVehicles={navigateToVehicles} />
            <Services />
            <VehicleCTA onViewAvailable={navigateToVehicles} />
          </main>
          <Footer setCurrentPage={setCurrentPage} />
        </>
      ) : currentPage === 'about' ? (
        <>
          <AboutPage onContact={navigateToContact} />
          <Footer setCurrentPage={setCurrentPage} />
        </>
      ) : currentPage === 'vehicles' ? (
        <>
          <VehiclesPage 
            setSelectedVehicleId={setSelectedVehicleId}
            setCurrentPage={setCurrentPage}
            onContact={navigateToContact}
          />
          <Footer setCurrentPage={setCurrentPage} />
        </>
      ) : currentPage === 'vehicle-detail' && selectedVehicleId ? (
        <>
          <VehicleDetailPage 
            vehicleId={selectedVehicleId} 
            setCurrentPage={setCurrentPage}
            setSelectedVehicleId={setSelectedVehicleId}
            onInquire={navigateToContact}
          />
          <Footer setCurrentPage={setCurrentPage} />
        </>
      ) : currentPage === 'contact' ? (
        <>
          <ContactPage vehicleInfo={contactVehicleInfo} />
          <Footer setCurrentPage={setCurrentPage} />
        </>
      ) : currentPage === 'login' ? (
        <LoginPage onLogin={handleLogin} setCurrentPage={setCurrentPage} />
      ) : currentPage === 'admin-dashboard' ? (
        <AdminDashboard user={auth?.user} token={auth?.token || ''} onLogout={handleLogout} />
      ) : (
        <div className="flex items-center justify-center min-h-screen text-gray-500">
           <p>Page not found</p>
        </div>
      )}
    </div>
  );
}

export default App;
