// src/pages/Dashboard.jsx - Updated to handle error cases better

import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Web3Context } from '../context/Web3Context';
import Loading from '../components/common/Loading';
import WalletRequired from '../components/common/WalletRequired';
import ErrorMessage from '../components/common/ErrorMessage';

const Dashboard = () => {
  const { 
    isConnected, 
    account
  } = useContext(Web3Context);
  
  const [activeTab, setActiveTab] = useState('insurance');
  const [policies, setPolicies] = useState([]);
  const [medications, setMedications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Mock data for plans and medications
  const planMap = {
    0: { name: "Dental Care", description: "Basic dental coverage including cleanings and fillings", basePriceEth: 0.01 },
    1: { name: "General Health", description: "Comprehensive health coverage", basePriceEth: 0.02 },
    2: { name: "Vision Care", description: "Eye exams and prescription glasses", basePriceEth: 0.008 },
    3: { name: "Preventative Care", description: "Wellness visits and screenings", basePriceEth: 0.015 }
  };
  
  const medicationMap = {
    0: { name: "Ibuprofen", description: "Pain reliever", category: "Pain Relief", priceEth: 0.001 },
    1: { name: "Acetaminophen", description: "Pain reliever", category: "Pain Relief", priceEth: 0.0008 },
    2: { name: "Amoxicillin", description: "Antibiotic", category: "Antibiotics", priceEth: 0.003 }
  };
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch data from localStorage
        let userPolicies = [];
        let userMedications = [];
        
        try {
          // Get policies from localStorage
          const storedPolicies = localStorage.getItem('userPolicies');
          if (storedPolicies) {
            userPolicies = JSON.parse(storedPolicies);
            // Filter for current account
            if (account) {
              userPolicies = userPolicies.filter(p => 
                p.userAddress && p.userAddress.toLowerCase() === account.toLowerCase()
              );
            }
          }
          
          // Get medications from localStorage
          const storedMedications = localStorage.getItem('userMedications');
          if (storedMedications) {
            userMedications = JSON.parse(storedMedications);
            // Filter for current account
            if (account) {
              userMedications = userMedications.filter(m => 
                m.userAddress && m.userAddress.toLowerCase() === account.toLowerCase()
              );
            }
          }
          
          // If no data found, create sample data for demo
          if (userPolicies.length === 0 && userMedications.length === 0) {
            // Create sample policy
            const now = new Date();
            const expiryDate = new Date(now);
            expiryDate.setFullYear(expiryDate.getFullYear() + 1);
            
            userPolicies = [{
              planId: 0,
              coverageAmount: 0.01,
              purchaseDate: now.getTime(),
              expiryDate: expiryDate.getTime(),
              peopleCount: 1
            }];
            
            // Create sample medication purchase
            userMedications = [{
              medicationId: 0,
              packageSize: 30,
              quantity: 1,
              totalPrice: 0.001,
              purchaseDate: now.getTime(),
              name: "Ibuprofen",
              category: "Pain Relief"
            }];
          }
        } catch (e) {
          console.error("Error parsing localStorage data:", e);
          // Provide sample data if there's an error
          const now = new Date();
          const expiryDate = new Date(now);
          expiryDate.setFullYear(expiryDate.getFullYear() + 1);
          
          userPolicies = [{
            planId: 0,
            coverageAmount: 0.01,
            purchaseDate: now.getTime(),
            expiryDate: expiryDate.getTime(),
            peopleCount: 1
          }];
          
          userMedications = [{
            medicationId: 0,
            packageSize: 30,
            quantity: 1,
            totalPrice: 0.001,
            purchaseDate: now.getTime(),
            name: "Ibuprofen",
            category: "Pain Relief"
          }];
        }
        
        setPolicies(userPolicies);
        setMedications(userMedications);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Failed to load your transaction history. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    if (isConnected) {
      fetchData();
    } else {
      setIsLoading(false);
    }
  }, [isConnected, account]);
  
  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    try {
      const date = new Date(timestamp);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch (e) {
      return "Invalid Date";
    }
  };
  
  if (!isConnected) {
    return <WalletRequired />;
  }
  
  if (isLoading) {
    return <Loading text="Loading your transaction history..." />;
  }
  
  if (error) {
    return (
      <div className="py-6">
        <ErrorMessage message={error} retry={() => window.location.reload()} />
        <div className="mt-8 card">
          <h2 className="text-xl font-semibold mb-4">Sample Data</h2>
          <p className="text-gray-600">
            We're showing sample data since we couldn't load your actual transaction history.
          </p>
          <div className="mt-4">
            <button onClick={() => setActiveTab('insurance')} className="btn-primary mr-4">View Insurance Samples</button>
            <button onClick={() => setActiveTab('medications')} className="btn-secondary">View Medication Samples</button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">My Dashboard</h1>
        <p className="text-gray-600">
          View and manage your insurance policies and medication purchases.
        </p>
      </div>
      
      {/* Tabs */}
      <div className="flex border-b mb-6">
        <button
          onClick={() => setActiveTab('insurance')}
          className={`py-3 px-6 font-medium ${
            activeTab === 'insurance'
              ? 'text-primary border-b-2 border-primary'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Insurance Policies
        </button>
        <button
          onClick={() => setActiveTab('medications')}
          className={`py-3 px-6 font-medium ${
            activeTab === 'medications'
              ? 'text-primary border-b-2 border-primary'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Medication Purchases
        </button>
      </div>
      
      {/* Insurance Policies Tab */}
      {activeTab === 'insurance' && (
        <div>
          {policies.length === 0 ? (
            <div className="card text-center py-12">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <h2 className="text-xl font-medium text-gray-600 mb-2">No Insurance Policies</h2>
              <p className="text-gray-500 mb-6">You haven't purchased any insurance plans yet.</p>
              <Link to="/insurance" className="btn-primary">
                Browse Insurance Plans
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {policies.map((policy, index) => (
                <div key={index} className="card">
                  <div className="flex flex-col md:flex-row justify-between">
                    <div>
                      <h2 className="text-xl font-bold mb-2">
                        {planMap[policy.planId]?.name || `Plan #${policy.planId}`}
                      </h2>
                      <p className="text-gray-600 mb-4">
                        {planMap[policy.planId]?.description || 'Insurance plan'}
                      </p>
                      
                      <div className="grid grid-cols-2 gap-x-8 gap-y-3 mb-4">
                        <div>
                          <p className="text-sm text-gray-500">Purchase Date</p>
                          <p className="font-medium">{formatDate(policy.purchaseDate)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Expiry Date</p>
                          <p className="font-medium">{formatDate(policy.expiryDate)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">People Covered</p>
                          <p className="font-medium">{policy.peopleCount}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Coverage Amount</p>
                          <p className="font-medium">{policy.coverageAmount?.toFixed(5) || '0.00000'} ETH</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 md:mt-0 md:text-right">
                      <div className="inline-block bg-green-100 text-green-800 rounded-full px-3 py-1 text-sm font-medium mb-3">
                        Active
                      </div>
                      <p className="text-sm text-gray-500">
                        {policy.expiryDate && new Date() < new Date(policy.expiryDate) ? 
                          `${Math.ceil((new Date(policy.expiryDate) - new Date()) / (1000 * 60 * 60 * 24))} days remaining` :
                          'Expired'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      
      {/* Medication Purchases Tab */}
      {activeTab === 'medications' && (
        <div>
          {medications.length === 0 ? (
            <div className="card text-center py-12">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
              <h2 className="text-xl font-medium text-gray-600 mb-2">No Medication Purchases</h2>
              <p className="text-gray-500 mb-6">You haven't purchased any medications yet.</p>
              <Link to="/medications" className="btn-primary">
                Browse Medications
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {medications.map((med, index) => (
                <div key={index} className="card p-4 flex flex-col md:flex-row justify-between">
                  <div>
                    <h3 className="text-lg font-semibold mb-1">
                      {med.name || medicationMap[med.medicationId]?.name || `Medication #${med.medicationId}`}
                    </h3>
                    <p className="text-gray-600 text-sm mb-2">
                      {medicationMap[med.medicationId]?.description || 'Medication'}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-2">
                      {(med.category || medicationMap[med.medicationId]?.category) && (
                        <span className="bg-gray-100 rounded-full px-3 py-1 text-sm">
                          {med.category || medicationMap[med.medicationId]?.category}
                        </span>
                      )}
                      <span className="bg-gray-100 rounded-full px-3 py-1 text-sm">
                        {med.packageSize} Tablets
                      </span>
                      <span className="bg-gray-100 rounded-full px-3 py-1 text-sm">
                        Qty: {med.quantity}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-4 md:mt-0 md:text-right">
                    <p className="font-medium">{med.totalPrice?.toFixed(5) || '0.00000'} ETH</p>
                    <p className="text-sm text-gray-500">{formatDate(med.purchaseDate)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;