import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Web3Context } from '../context/Web3Context';

const LandingPage = () => {
  const { isConnected, connectWallet, isLoading } = useContext(Web3Context);

  return (
    <div>
      {/* Hero Section */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Decentralized Health Insurance & Medication
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Your health, secured on the blockchain. Access affordable insurance plans and purchase
                medications directly using cryptocurrency on the Ethereum network.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                {!isConnected ? (
                  <button
                    onClick={connectWallet}
                    disabled={isLoading}
                    className="btn-primary"
                  >
                    {isLoading ? 'Connecting...' : 'Connect Wallet'}
                  </button>
                ) : (
                  <>
                    <Link to="/insurance" className="btn-primary">
                      Browse Insurance Plans
                    </Link>
                    <Link to="/medications" className="btn-secondary">
                      Browse Medications
                    </Link>
                  </>
                )}
              </div>
            </div>
            <div className="md:w-1/2 md:pl-10">
              <div className="bg-gradient-to-br from-primary to-accent p-1 rounded-xl shadow-xl">
                <div className="bg-white rounded-lg p-6">
                  <img 
                    src="/api/placeholder/600/400" 
                    alt="Health Insurance Blockchain Concept" 
                    className="rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose HealthChain?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="card hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-center w-12 h-12 bg-primary rounded-lg mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure & Transparent</h3>
              <p className="text-gray-600">
                All transactions are secured by blockchain technology, ensuring transparent policy management and medication purchases.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="card hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-center w-12 h-12 bg-secondary rounded-lg mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Cost-Effective</h3>
              <p className="text-gray-600">
                Eliminating traditional intermediaries means lower premiums for insurance and competitive pricing for medications.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="card hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-center w-12 h-12 bg-accent rounded-lg mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Fast & Efficient</h3>
              <p className="text-gray-600">
                Instant policy activation and quick medication purchases without paperwork or approval delays.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="w-full md:w-1/3 mb-8 md:mb-0 md:pr-8">
              <div className="relative">
                <div className="absolute left-0 top-0 w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center text-xl font-bold">1</div>
                <div className="pl-16">
                  <h3 className="text-xl font-semibold mb-2">Connect Your Wallet</h3>
                  <p className="text-gray-600">
                    Link your MetaMask wallet to access our decentralized health ecosystem on Sepolia testnet.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="w-full md:w-1/3 mb-8 md:mb-0 md:px-4">
              <div className="relative">
                <div className="absolute left-0 top-0 w-12 h-12 rounded-full bg-secondary text-white flex items-center justify-center text-xl font-bold">2</div>
                <div className="pl-16">
                  <h3 className="text-xl font-semibold mb-2">Choose Your Plan</h3>
                  <p className="text-gray-600">
                    Select from our range of insurance plans or browse medications by category.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="w-full md:w-1/3 md:pl-8">
              <div className="relative">
                <div className="absolute left-0 top-0 w-12 h-12 rounded-full bg-accent text-white flex items-center justify-center text-xl font-bold">3</div>
                <div className="pl-16">
                  <h3 className="text-xl font-semibold mb-2">Purchase with Crypto</h3>
                  <p className="text-gray-600">
                    Pay using ETH on Sepolia testnet. All transactions are recorded on the blockchain.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Link to={isConnected ? "/insurance" : "#"} 
              onClick={!isConnected ? connectWallet : undefined}
              className="btn-primary">
              {isConnected ? "Get Started" : "Connect Wallet to Begin"}
            </Link>
          </div>
        </div>
      </section>
      
      {/* Insurance Plans Preview */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-10">
            <h2 className="text-3xl font-bold mb-4 md:mb-0">Available Insurance Plans</h2>
            <Link to="/insurance" className="text-primary hover:text-blue-700 font-medium flex items-center">
              View All Plans
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Plan 1 */}
            <div className="card hover:shadow-lg transition-shadow border-t-4 border-primary">
              <h3 className="text-xl font-semibold mb-2">Dental Care</h3>
              <p className="text-gray-500 text-sm mb-4">Basic dental coverage</p>
              <p className="text-3xl font-bold mb-4">0.01 ETH <span className="text-sm text-gray-500 font-normal">/ month</span></p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Regular checkups</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Basic fillings</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Teeth cleaning</span>
                </li>
              </ul>
              <Link to="/insurance" className="btn-primary w-full text-center block">Select Plan</Link>
            </div>
            
            {/* Plan 2 */}
            <div className="card hover:shadow-lg transition-shadow border-t-4 border-secondary">
              <h3 className="text-xl font-semibold mb-2">General Health</h3>
              <p className="text-gray-500 text-sm mb-4">Comprehensive coverage</p>
              <p className="text-3xl font-bold mb-4">0.02 ETH <span className="text-sm text-gray-500 font-normal">/ month</span></p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Regular checkups</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Emergency care</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Specialist visits</span>
                </li>
              </ul>
              <Link to="/insurance" className="btn-primary w-full text-center block">Select Plan</Link>
            </div>
            
            {/* Plan 3 */}
            <div className="card hover:shadow-lg transition-shadow border-t-4 border-accent">
              <h3 className="text-xl font-semibold mb-2">Vision Care</h3>
              <p className="text-gray-500 text-sm mb-4">Eye care coverage</p>
              <p className="text-3xl font-bold mb-4">0.008 ETH <span className="text-sm text-gray-500 font-normal">/ month</span></p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Eye exams</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Prescription glasses</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Contact lenses</span>
                </li>
              </ul>
              <Link to="/insurance" className="btn-primary w-full text-center block">Select Plan</Link>
            </div>
            
            {/* Plan 4 */}
            <div className="card hover:shadow-lg transition-shadow border-t-4 border-blue-400">
              <h3 className="text-xl font-semibold mb-2">Preventative Care</h3>
              <p className="text-gray-500 text-sm mb-4">Stay healthy coverage</p>
              <p className="text-3xl font-bold mb-4">0.015 ETH <span className="text-sm text-gray-500 font-normal">/ month</span></p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Wellness visits</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Vaccinations</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Health screenings</span>
                </li>
              </ul>
              <Link to="/insurance" className="btn-primary w-full text-center block">Select Plan</Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-accent text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Secure Your Health on the Blockchain?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of users who trust HealthChain for their health insurance and medication needs.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            {!isConnected ? (
              <button
                onClick={connectWallet}
                disabled={isLoading}
                className="btn bg-white text-primary hover:bg-gray-100 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary"
              >
                {isLoading ? 'Connecting...' : 'Connect Wallet'}
              </button>
            ) : (
              <>
                <Link 
                  to="/insurance" 
                  className="btn bg-white text-primary hover:bg-gray-100 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary"
                >
                  Browse Insurance Plans
                </Link>
                <Link 
                  to="/medications" 
                  className="btn bg-transparent border-2 border-white hover:bg-white hover:text-primary focus:ring-white"
                >
                  Browse Medications
                </Link>
              </>
            )}
          </div>
        </div>
      </section>
      
      {/* Blockchain Information Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="card">
            <h2 className="text-2xl font-bold mb-6">Blockchain Technology</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-3">Secured by Ethereum</h3>
                <p className="text-gray-600 mb-4">
                  Our platform operates on the Ethereum Sepolia testnet, providing a secure and 
                  transparent environment for all your health insurance and medication needs.
                </p>
                <p className="text-gray-600">
                  All transactions are processed through smart contracts, ensuring that your 
                  payments are handled securely and transparently on the blockchain.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3">How to Get Started</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center mr-2 mt-0.5 text-sm">1</span>
                    <span>Install MetaMask wallet extension in your browser</span>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center mr-2 mt-0.5 text-sm">2</span>
                    <span>Configure MetaMask to connect to Sepolia testnet</span>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center mr-2 mt-0.5 text-sm">3</span>
                    <span>Get some Sepolia ETH from a faucet</span>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center mr-2 mt-0.5 text-sm">4</span>
                    <span>Click "Connect Wallet" to begin</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;