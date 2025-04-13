import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Web3Context } from '../context/Web3Context';
import Loading from '../components/common/Loading';
import WalletRequired from '../components/common/WalletRequired';
import ErrorMessage from '../components/common/ErrorMessage';

const MedicationCategories = () => {
  const { isConnected, getMedications, isLoading: walletLoading } = useContext(Web3Context);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const medications = await getMedications();
        
        // Extract unique categories
        const uniqueCategories = [...new Set(medications.map(med => med.category))];
        
        // Create category objects with medication counts
        const categoryObjects = uniqueCategories.map(category => {
          const medicationsInCategory = medications.filter(med => med.category === category);
          return {
            name: category,
            count: medicationsInCategory.length,
            image: getCategoryImage(category),
            description: getCategoryDescription(category),
          };
        });
        
        setCategories(categoryObjects);
      } catch (error) {
        console.error('Error fetching medication categories:', error);
        setError('Failed to load medication categories. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    if (isConnected) {
      fetchCategories();
    } else {
      setIsLoading(false);
    }
  }, [isConnected, getMedications]);
  
  const getCategoryImage = (category) => {
    // In a real app, these would be actual image paths
    const imageMap = {
      'Pain Relief': '/api/placeholder/600/400',
      'Antibiotics': '/api/placeholder/600/400',
      'Allergy': '/api/placeholder/600/400',
      'Cold & Flu': '/api/placeholder/600/400',
      'Vitamins': '/api/placeholder/600/400',
    };
    
    return imageMap[category] || '/api/placeholder/600/400';
  };
  
  const getCategoryDescription = (category) => {
    const descriptionMap = {
      'Pain Relief': 'Medications to relieve pain, reduce inflammation, and manage fever.',
      'Antibiotics': 'Medications to fight bacterial infections and promote healing.',
      'Allergy': 'Treatments for seasonal allergies, skin reactions, and other allergy symptoms.',
      'Cold & Flu': 'Remedies for cold symptoms, congestion, cough, and flu-related discomfort.',
      'Vitamins': 'Nutritional supplements to support overall health and wellness.',
    };
    
    return descriptionMap[category] || 'Pharmaceutical products for health and wellness.';
  };

  const getCategoryColor = (category) => {
    const colorMap = {
      'Pain Relief': 'from-red-500 to-red-400',
      'Antibiotics': 'from-blue-500 to-blue-400',
      'Allergy': 'from-green-500 to-green-400',
      'Cold & Flu': 'from-blue-400 to-indigo-400',
      'Vitamins': 'from-yellow-500 to-yellow-400',
    };
    
    return colorMap[category] || 'from-primary to-blue-400';
  };
  
  if (!isConnected) {
    return <WalletRequired />;
  }
  
  if (isLoading || walletLoading) {
    return <Loading text="Loading medication categories..." />;
  }
  
  if (error) {
    return <ErrorMessage message={error} retry={() => window.location.reload()} />;
  }
  
  return (
    <div>
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-4">Medication Categories</h1>
        <p className="text-gray-600">
          Browse our selection of medications by category. All medications can be purchased using
          cryptocurrency and are securely recorded on the blockchain.
        </p>
      </div>
      
      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((category) => (
          <Link 
            key={category.name}
            to={`/medications/${category.name.toLowerCase().replace(/\s+/g, '-')}`}
            className="card overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className={`h-40 bg-gradient-to-r ${getCategoryColor(category.name)} relative`}>
              <div className="absolute inset-0 flex items-center justify-center">
                <h2 className="text-2xl font-bold text-white">{category.name}</h2>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-4">{category.description}</p>
              <div className="flex justify-between items-center">
                <span className="bg-primary bg-opacity-10 text-primary px-3 py-1 rounded-full text-sm">
                  {category.count} {category.count === 1 ? 'Product' : 'Products'}
                </span>
                <span className="text-primary font-medium flex items-center">
                  View Products
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      {/* Info Section */}
      <div className="mt-12 p-6 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">About Our Medications</h2>
        <p className="text-gray-700 mb-4">
          All medications are available for purchase using cryptocurrency on the Ethereum blockchain. 
          Transactions are secure, transparent, and recorded for your safety.
        </p>
        <h3 className="font-semibold mb-2">Important Notes:</h3>
        <ul className="list-disc pl-5 space-y-1 text-gray-700">
          <li>Medications are available in different package sizes (10, 30, or 60 tablets)</li>
          <li>Purchases are recorded on the blockchain for verification</li>
          <li>Prices are displayed in ETH and may vary based on package size</li>
          <li>All purchases can be viewed in your transaction history</li>
        </ul>
      </div>
    </div>
  );
};

export default MedicationCategories;