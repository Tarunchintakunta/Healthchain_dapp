import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Web3Provider } from './context/Web3Context';

// Layout Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Pages
import LandingPage from './pages/LandingPage';
import InsurancePlans from './pages/InsurancePlans';
import InsuranceCheckout from './pages/InsuranceCheckout';
import MedicationCategories from './pages/MedicationCategories';
import MedicationList from './pages/MedicationList';
import Cart from './pages/Cart';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Web3Provider>
      <Router>
        <div className="flex flex-col min-h-screen bg-background">
          <Navbar />
          <main className="flex-grow container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/insurance" element={<InsurancePlans />} />
              <Route path="/insurance/checkout/:planId" element={<InsuranceCheckout />} />
              <Route path="/medications" element={<MedicationCategories />} />
              <Route path="/medications/:category" element={<MedicationList />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
        <Toaster position="top-right" />
      </Router>
    </Web3Provider>
  );
}

export default App;