import React, { useContext, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Web3Context } from '../context/Web3Context';
import Loading from '../components/common/Loading';
import WalletRequired from '../components/common/WalletRequired';
import ErrorMessage from '../components/common/ErrorMessage';

const InsuranceCheckout = () => {
  const { planId } = useParams();
  const navigate = useNavigate();
  const { 
    isConnected, 
    getInsurancePlans, 
    purchaseInsurance,
    addUserPolicy,
    isLoading: walletLoading,
    networkName,
    account,
    isCorrectNetwork
  } = useContext(Web3Context);
  
  const [plan, setPlan] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [peopleCount, setPeopleCount] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transactionSuccess, setTransactionSuccess] = useState(false);
  
  // Recipient address displayed on the page
  const recipientAddress = '0x078D8Db473Ab8Fe3036390A3B37C81AdA6c1E5A9';
  
  useEffect(() => {
    const fetchPlan = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const fetchedPlans = await getInsurancePlans();
        const selectedPlan = fetchedPlans[planId];
        
        if (!selectedPlan) {
          throw new Error('Insurance plan not found');
        }
        
        // Format the plan data
        const formattedPlan = {
          id: parseInt(planId),
          name: selectedPlan.name,
          description: selectedPlan.description,
          basePriceWei: selectedPlan.basePriceWei.toString(),
          basePriceEth: selectedPlan.basePriceWei / 1e18,
        };
        
        setPlan(formattedPlan);
        calculatePrice(formattedPlan.basePriceEth, peopleCount);
      } catch (error) {
        console.error('Error fetching insurance plan:', error);
        setError('Failed to load insurance plan. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    if (isConnected) {
      fetchPlan();
    } else {
      setIsLoading(false);
    }
  }, [isConnected, getInsurancePlans, planId]);
  
  const calculatePrice = (basePrice, people) => {
    let price;
    if (people === 1) {
      price = basePrice;
    } else {
      // Apply a 5% discount for multiple people
      price = basePrice * people * 0.95;
    }
    setTotalPrice(price);
  };
  
  const handlePeopleCountChange = (e) => {
    const count = parseInt(e.target.value);
    setPeopleCount(count);
    if (plan) {
      calculatePrice(plan.basePriceEth, count);
    }
  };
  
  const handlePurchase = async () => {
    if (!isCorrectNetwork) {
      setError('Please connect to Sepolia testnet');
      return;
    }
    
    try {
      setIsProcessing(true);
      setError(null);
      
      const success = await purchaseInsurance(plan.id, peopleCount, totalPrice);
      
      if (success) {
        // Add the policy to local storage since we're not using the contract storage
        const now = new Date();
        const expiryDate = new Date(now);
        expiryDate.setFullYear(expiryDate.getFullYear() + 1); // 1 year expiry
        
        addUserPolicy({
          userAddress: account.toLowerCase(),
          planId: plan.id,
          coverageAmount: totalPrice,
          purchaseDate: now.getTime(),
          expiryDate: expiryDate.getTime(),
          peopleCount: peopleCount,
        });
        
        setTransactionSuccess(true);
      } else {
        throw new Error('Transaction failed');
      }
    } catch (error) {
      console.error('Error purchasing insurance:', error);
      setError('Failed to purchase insurance. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };
  
  if (!isConnected) {
    return <WalletRequired />;
  }
  
  if (isLoading || walletLoading) {
    return <Loading text="Loading insurance plan details..." />;
  }
  
  if (error) {
    return <ErrorMessage message={error} retry={() => window.location.reload()} />;
  }
  
  if (transactionSuccess) {
    return (
      <div className="card text-center py-10">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        <h2 className="text-2xl font-bold mb-4">Purchase Successful!</h2>
        <p className="text-gray-600 mb-6">
          Your insurance plan has been successfully purchased and is now active.
          The transaction has been recorded on the {networkName} blockchain.
        </p>
        <div className="flex flex-col space-y-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="btn-primary mx-auto"
          >
            View My Policies
          </button>
          <button
            onClick={() => navigate('/medications')}
            className="text-primary hover:text-blue-700"
          >
            Browse Medications
          </button>
        </div>
      </div>
    );
  }
  
  if (!plan) {
    return <ErrorMessage message="Insurance plan not found" />;
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Checkout Form */}
      <div className="md:col-span-2">
        <h1 className="text-3xl font-bold mb-6">Complete Your Purchase</h1>
        
        <div className="card mb-6">
          <h2 className="text-xl font-semibold mb-4">Insurance Plan Details</h2>
          <div className="mb-4">
            <p className="text-gray-600 mb-1">Plan Name</p>
            <p className="font-medium">{plan.name}</p>
          </div>
          <div className="mb-4">
            <p className="text-gray-600 mb-1">Description</p>
            <p>{plan.description}</p>
          </div>
          <div>
            <p className="text-gray-600 mb-1">Base Price</p>
            <p className="font-medium">{plan.basePriceEth.toFixed(4)} ETH per person / month</p>
          </div>
        </div>
        
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Purchase Options</h2>
          
          <div className="mb-4">
            <label htmlFor="peopleCount" className="block text-gray-700 mb-2">
              Number of People to Cover
            </label>
            <select
              id="peopleCount"
              value={peopleCount}
              onChange={handlePeopleCountChange}
              className="select"
              disabled={isProcessing}
            >
              <option value={1}>1 Person</option>
              <option value={2}>2 People</option>
              <option value={3}>3 People</option>
              <option value={4}>4 People</option>
              <option value={5}>5 People</option>
            </select>
            {peopleCount > 1 && (
              <p className="text-sm text-green-600 mt-1">
                Multiple people discount: 5% off
              </p>
            )}
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">
              Coverage Period
            </label>
            <p className="font-medium">12 months (paid monthly)</p>
            <p className="text-sm text-gray-600">
              Coverage begins immediately after purchase
            </p>
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">
              Payment Recipient
            </label>
            <p className="font-medium text-sm bg-gray-100 p-2 rounded break-words">
              {recipientAddress}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              All payments are sent directly to this address on the Sepolia testnet
            </p>
          </div>
          
          <div className="border-t pt-4">
            <button
              onClick={handlePurchase}
              disabled={isProcessing || !isCorrectNetwork}
              className="btn-primary w-full flex justify-center items-center"
            >
              {isProcessing ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : !isCorrectNetwork ? (
                'Please Connect to Sepolia Testnet'
              ) : (
                `Pay ${totalPrice.toFixed(4)} ETH to Purchase`
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Order Summary */}
      <div className="md:col-span-1">
        <div className="card sticky top-4">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          
          <div className="space-y-3 mb-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Plan</span>
              <span>{plan.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">People Covered</span>
              <span>{peopleCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Base Price</span>
              <span>{plan.basePriceEth.toFixed(4)} ETH</span>
            </div>
            {peopleCount > 1 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>5%</span>
              </div>
            )}
          </div>
          
          <div className="border-t pt-3 mb-4">
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>{totalPrice.toFixed(4)} ETH</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Paid monthly for 12 months
            </p>
          </div>
          
          <div className="border-t pt-4 text-sm text-gray-600">
            <p className="mb-2">Transaction Details:</p>
            <p className="mb-1">
              <span className="font-medium">Network:</span> {networkName}
            </p>
            {account && (
              <p className="mb-1">
                <span className="font-medium">Your Wallet:</span> {account.slice(0, 6)}...{account.slice(-4)}
              </p>
            )}
            <p className="text-xs mt-3">
              Your transaction will be processed on the Ethereum Sepolia testnet and will require confirmation through your connected wallet.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsuranceCheckout;