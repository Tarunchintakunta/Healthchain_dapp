import React, { useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Web3Context } from '../../context/Web3Context';

const Navbar = () => {
  const { account, isConnected, connectWallet, disconnectWallet, isLoading, networkName } = useContext(Web3Context);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const truncateAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };
  
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Insurance Plans', path: '/insurance' },
    { name: 'Medications', path: '/medications' },
    { name: 'Dashboard', path: '/dashboard' },
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-gradient-to-r from-primary to-accent text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-2xl font-bold">HealthChain</Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex space-x-6">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`hover:text-gray-200 transition-colors ${
                    location.pathname === link.path ? 'font-semibold border-b-2 border-white' : ''
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
            
            <div className="flex items-center space-x-2">
              {isConnected && (
                <div className="text-sm bg-white bg-opacity-20 rounded-lg py-1 px-3">
                  {networkName}
                </div>
              )}
              
              <button
                onClick={isConnected ? disconnectWallet : connectWallet}
                disabled={isLoading}
                className={`btn px-4 py-2 rounded-lg font-medium transition-colors ${
                  isConnected
                    ? 'bg-white text-primary hover:bg-gray-100'
                    : 'bg-secondary hover:bg-green-600 text-white'
                }`}
              >
                {isLoading
                  ? 'Loading...'
                  : isConnected
                  ? `${truncateAddress(account)}`
                  : 'Connect Wallet'}
              </button>
              
              {isConnected && (
                <Link to="/cart" className="text-white hover:text-gray-200">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                  </svg>
                </Link>
              )}
            </div>
          </div>
          
          {/* Mobile Menu Button */}
          <button className="md:hidden focus:outline-none" onClick={toggleMenu}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5"} />
            </svg>
          </button>
        </div>
        
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-white border-opacity-20">
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`hover:text-gray-200 transition-colors ${
                    location.pathname === link.path ? 'font-semibold' : ''
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              
              {isConnected && (
                <Link to="/cart" className="flex items-center space-x-2" onClick={() => setIsMenuOpen(false)}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                  </svg>
                  <span>Cart</span>
                </Link>
              )}
              
              <div className="pt-2">
                {isConnected && (
                  <div className="text-sm bg-white bg-opacity-20 rounded-lg py-1 px-3 mb-2 inline-block">
                    {networkName}
                  </div>
                )}
                
                <button
                  onClick={isConnected ? disconnectWallet : connectWallet}
                  disabled={isLoading}
                  className={`w-full btn py-2 rounded-lg font-medium transition-colors ${
                    isConnected
                      ? 'bg-white text-primary hover:bg-gray-100'
                      : 'bg-secondary hover:bg-green-600 text-white'
                  }`}
                >
                  {isLoading
                    ? 'Loading...'
                    : isConnected
                    ? `${truncateAddress(account)}`
                    : 'Connect Wallet'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;