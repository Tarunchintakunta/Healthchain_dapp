import React, { useContext, useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Web3Context } from '../context/Web3Context';
import { CartContext } from '../context/CartContext';
import Loading from '../components/common/Loading';
import WalletRequired from '../components/common/WalletRequired';
import ErrorMessage from '../components/common/ErrorMessage';

const MedicationList = () => {
  const { category } = useParams();
  const { isConnected, getMedications, isLoading: walletLoading } = useContext(Web3Context);
  const { addToCart } = useContext(CartContext);
  
  const [medications, setMedications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeModal, setActiveModal] = useState(null);
  const [selectedMedication, setSelectedMedication] = useState(null);
  const [packageSize, setPackageSize] = useState(10);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  
  // Format category name for display and comparison
  const formattedCategory = category.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
  
  useEffect(() => {
    const fetchMedications = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const allMedications = await getMedications();
        
        // Filter medications by category and format data
        const filteredMedications = allMedications
          .filter(med => med.category === formattedCategory)
          .map((med, index) => ({
            id: index,
            name: med.name,
            description: med.description,
            category: med.category,
            priceWei: med.priceWei.toString(),
            priceEth: med.priceWei / 1e18,
          }));
        
        setMedications(filteredMedications);
      } catch (error) {
        console.error('Error fetching medications:', error);
        setError('Failed to load medications. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    if (isConnected) {
      fetchMedications();
    } else {
      setIsLoading(false);
    }
  }, [isConnected, getMedications, formattedCategory]);
  
  const openModal = (medication) => {
    setSelectedMedication(medication);
    setPackageSize(10);
    setQuantity(1);
    setAddedToCart(false);
    setActiveModal('purchase');
  };
  
  const closeModal = () => {
    setActiveModal(null);
  };
  
  const calculatePrice = () => {
    if (!selectedMedication) return 0;
    
    let packageFactor;
    if (packageSize === 10) {
      packageFactor = 1;
    } else if (packageSize === 30) {
      packageFactor = 2.8; // 30 tablets at a slight discount
    } else { // 60 tablets
      packageFactor = 5.5; // 60 tablets at a larger discount
    }
    
    return selectedMedication.priceEth * packageFactor * quantity;
  };
  
  const handleAddToCart = () => {
    if (selectedMedication) {
      addToCart(selectedMedication, packageSize, quantity);
      setAddedToCart(true);
      
      // Auto-close modal after a short delay
      setTimeout(() => {
        closeModal();
      }, 1500);
    }
  };
  
  if (!isConnected) {
    return <WalletRequired />;
  }
  
  if (isLoading || walletLoading) {
    return <Loading text="Loading medications..." />;
  }
  
  if (error) {
    return <ErrorMessage message={error} retry={() => window.location.reload()} />;
  }
  
  return (
    <div>
      {/* Header */}
      <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <div className="flex items-center mb-2">
            <Link to="/medications" className="text-primary hover:text-blue-700 mr-2">
              Categories
            </Link>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 mx-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span>{formattedCategory}</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">{formattedCategory} Medications</h1>
          <p className="text-gray-600">
            Browse our selection of {formattedCategory.toLowerCase()} medications.
          </p>
        </div>
        <Link to="/cart" className="btn-primary mt-4 md:mt-0 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
          </svg>
          View Cart
        </Link>
      </div>
      
      {/* Medications Grid */}
      {medications.length === 0 ? (
        <div className="text-center py-12">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <h2 className="text-xl font-medium text-gray-600 mb-2">No Medications Found</h2>
          <p className="text-gray-500">There are no medications available in this category.</p>
          <Link to="/medications" className="btn-primary mt-6 inline-block">
            Browse All Categories
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {medications.map((medication) => (
            <div key={medication.id} className="card hover:shadow-lg transition-shadow">
              <div className="mb-4">
                <h2 className="text-xl font-bold mb-2">{medication.name}</h2>
                <p className="text-gray-600">{medication.description}</p>
              </div>
              
              <div className="flex justify-between items-center mt-4">
                <div>
                  <p className="text-sm text-gray-500">Starting from</p>
                  <p className="text-lg font-semibold">{medication.priceEth.toFixed(5)} ETH</p>
                </div>
                <button
                  onClick={() => openModal(medication)}
                  className="btn-primary"
                >
                  Purchase
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Purchase Modal */}
      {activeModal === 'purchase' && selectedMedication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold">{selectedMedication.name}</h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {addedToCart ? (
              <div className="text-center py-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-lg font-medium text-gray-800 mb-1">Added to Cart!</p>
              </div>
            ) : (
              <>
                <p className="text-gray-600 mb-6">{selectedMedication.description}</p>
                
                <div className="mb-4">
                  <label htmlFor="packageSize" className="block text-gray-700 font-medium mb-2">
                    Package Size
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setPackageSize(10)}
                      className={`py-2 px-4 rounded-lg border ${
                        packageSize === 10
                          ? 'bg-primary text-white border-primary'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      10 Tablets
                    </button>
                    <button
                      type="button"
                      onClick={() => setPackageSize(30)}
                      className={`py-2 px-4 rounded-lg border ${
                        packageSize === 30
                          ? 'bg-primary text-white border-primary'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      30 Tablets
                    </button>
                    <button
                      type="button"
                      onClick={() => setPackageSize(60)}
                      className={`py-2 px-4 rounded-lg border ${
                        packageSize === 60
                          ? 'bg-primary text-white border-primary'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      60 Tablets
                    </button>
                  </div>
                  {packageSize > 10 && (
                    <p className="text-sm text-green-600 mt-1">
                      {packageSize === 30 ? 'Save ~7%' : 'Save ~8%'} with larger package
                    </p>
                  )}
                </div>
                
                <div className="mb-6">
                  <label htmlFor="quantity" className="block text-gray-700 font-medium mb-2">
                    Quantity
                  </label>
                  <div className="flex items-center">
                    <button
                      type="button"
                      onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                      className="border border-gray-300 rounded-l-lg px-3 py-2 bg-gray-100 hover:bg-gray-200"
                    >
                      -
                    </button>
                    <div className="flex-1 text-center border-t border-b border-gray-300 py-2">
                      {quantity}
                    </div>
                    <button
                      type="button"
                      onClick={() => quantity < 5 && setQuantity(quantity + 1)}
                      className="border border-gray-300 rounded-r-lg px-3 py-2 bg-gray-100 hover:bg-gray-200"
                    >
                      +
                    </button>
                  </div>
                </div>
                
                <div className="border-t pt-4 mb-6">
                  <div className="flex justify-between font-medium mb-2">
                    <span>Price per package:</span>
                    <span>{calculatePrice() / quantity} ETH</span>
                  </div>
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total:</span>
                    <span>{calculatePrice().toFixed(5)} ETH</span>
                  </div>
                </div>
                
                <button
                  onClick={handleAddToCart}
                  className="btn-primary w-full py-3"
                >
                  Add to Cart
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicationList;