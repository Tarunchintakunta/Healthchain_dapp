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
                    src="data:image/jpeg;base64,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" 
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