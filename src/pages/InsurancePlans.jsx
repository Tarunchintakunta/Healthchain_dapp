import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Web3Context } from '../context/Web3Context';
import Loading from '../components/common/Loading';
import WalletRequired from '../components/common/WalletRequired';
import ErrorMessage from '../components/common/ErrorMessage';

const InsurancePlans = () => {
  const { isConnected, getInsurancePlans, isLoading: walletLoading } = useContext(Web3Context);
  const [plans, setPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const fetchedPlans = await getInsurancePlans();
        
        // Format the plans data
        const formattedPlans = fetchedPlans.map((plan, index) => ({
          id: index,
          name: plan.name,
          description: plan.description,
          basePriceWei: plan.basePriceWei.toString(),
          basePriceEth: plan.basePriceWei / 1e18,
        }));
        
        setPlans(formattedPlans);
      } catch (error) {
        console.error('Error fetching insurance plans:', error);
        setError('Failed to load insurance plans. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    if (isConnected) {
      fetchPlans();
    } else {
      setIsLoading(false);
    }
  }, [isConnected, getInsurancePlans]);

  const handleSelectPlan = (planId) => {
    navigate(`/insurance/checkout/${planId}`);
  };

  const getPlanBenefits = (planName) => {
    const benefitsMap = {
      'Dental Care': [
        'Regular dental checkups',
        'Basic fillings and repairs',
        'Teeth cleaning and maintenance',
        'X-rays and diagnostics',
        'Emergency dental care',
      ],
      'General Health': [
        'Primary care physician visits',
        'Specialist consultations',
        'Emergency room services',
        'Hospital stays and treatments',
        'Prescription medication coverage',
        'Preventive care services',
      ],
      'Vision Care': [
        'Annual eye examinations',
        'Prescription glasses coverage',
        'Contact lenses allowance',
        'Vision correction procedures',
        'Specialized eye treatments',
      ],
      'Preventative Care': [
        'Annual wellness check-ups',
        'Vaccinations and immunizations',
        'Health screenings and tests',
        'Nutrition and dietary guidance',
        'Fitness and wellness programs',
      ],
    };
    
    return benefitsMap[planName] || [];
  };

  if (!isConnected) {
    return <WalletRequired />;
  }

  if (isLoading || walletLoading) {
    return <Loading text="Loading insurance plans..." />;
  }

  if (error) {
    return <ErrorMessage message={error} retry={() => window.location.reload()} />;
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-4">Insurance Plans</h1>
        <p className="text-gray-600">
          Choose from our range of blockchain-secured health insurance plans. All plans are paid monthly in ETH and 
          provide coverage for different health care needs.
        </p>
      </div>
      
      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {plans.map((plan) => (
          <div 
            key={plan.id} 
            className="card hover:shadow-lg transition-shadow border-t-4 border-primary overflow-hidden flex flex-col"
          >
            <div className="flex-grow">
              <h2 className="text-xl font-bold mb-2">{plan.name}</h2>
              <p className="text-gray-600 text-sm mb-4">{plan.description}</p>
              
              <div className="mb-4">
                <p className="text-3xl font-bold">{plan.basePriceEth.toFixed(4)} ETH</p>
                <p className="text-sm text-gray-500">per person / month</p>
              </div>
              
              <h3 className="font-semibold mb-2">Coverage Includes:</h3>
              <ul className="space-y-2 mb-6">
                {getPlanBenefits(plan.name).map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <button
              onClick={() => handleSelectPlan(plan.id)}
              className="btn-primary w-full mt-4"
            >
              Select Plan
            </button>
          </div>
        ))}
      </div>
      
      {/* Policy Info */}
      <div className="mt-12 p-6 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">About Our Insurance Policies</h2>
        <p className="text-gray-700 mb-4">
          All insurance plans are secured by smart contracts on the Ethereum blockchain. Premiums are paid in ETH 
          and all transactions are transparent and verifiable.
        </p>
        <h3 className="font-semibold mb-2">Important Notes:</h3>
        <ul className="list-disc pl-5 space-y-1 text-gray-700">
          <li>Insurance coverage begins immediately after purchase and lasts for one year</li>
          <li>Family plans provide discounts when covering multiple people</li>
          <li>All plans can be verified on the blockchain using your wallet address</li>
          <li>Claims and coverage details are managed through smart contracts</li>
        </ul>
      </div>
    </div>
  );
};

export default InsurancePlans;