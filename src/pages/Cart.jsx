import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Web3Context } from '../context/Web3Context';
import { CartContext } from '../context/CartContext';
import WalletRequired from '../components/common/WalletRequired';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';

const Cart = () => {
  const navigate = useNavigate();
  const { 
    isConnected, 
    purchaseMedication, 
    addUserMedication,
    isLoading: walletLoading,
    account,
    isCorrectNetwork 
  } = useContext(Web3Context);
  const { cartItems, totalPrice, removeFromCart, updateQuantity, clearCart } = useContext(CartContext);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [error, setError] = useState(null);
  const [purchaseComplete, setPurchaseComplete] = useState(false);
  
  // Recipient address displayed on the page
  const recipientAddress = '0x078D8Db473Ab8Fe3036390A3B37C81AdA6c1E5A9';
  
  const handleCheckout = async () => {
    if (cartItems.length === 0) return;
    
    if (!isCorrectNetwork) {
      setError('Please connect to Sepolia testnet');
      return;
    }
    
    setIsProcessing(true);
    setError(null);
    setCurrentItemIndex(0);
    
    try {
      // Process each item in the cart sequentially
      for (let i = 0; i < cartItems.length; i++) {
        setCurrentItemIndex(i);
        const item = cartItems[i];
        
        // Call the purchase function to send funds directly to the recipient address
        const success = await purchaseMedication(
          item.medicationId,
          item.packageSize,
          item.quantity,
          item.totalPrice
        );
        
        if (!success) {
          throw new Error(`Failed to purchase ${item.name}`);
        }
        
        // Record the purchase in local storage
        addUserMedication({
          userAddress: account.toLowerCase(),
          medicationId: item.medicationId,
          packageSize: item.packageSize,
          quantity: item.quantity,
          totalPrice: item.totalPrice,
          purchaseDate: new Date().getTime(),
          name: item.name,
          category: item.category
        });
      }
      
      // All items purchased successfully
      setPurchaseComplete(true);
      clearCart();
    } catch (error) {
      console.error('Error during checkout:', error);
      setError(`Transaction failed at item ${currentItemIndex + 1}. Please try again.`);
    } finally {
      setIsProcessing(false);
    }
  };
  
  if (!isConnected) {
    return <WalletRequired />;
  }
  
  if (walletLoading) {
    return <Loading text="Loading cart..." />;
  }
  
  if (purchaseComplete) {
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
          Your medication order has been successfully processed and recorded on the blockchain.
        </p>
        <div className="flex flex-col space-y-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="btn-primary mx-auto"
          >
            View Purchase History
          </button>
          <button
            onClick={() => navigate('/medications')}
            className="text-primary hover:text-blue-700"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Cart Items */}
      <div className="md:col-span-2">
        <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
        
        {cartItems.length === 0 ? (
          <div className="card text-center py-12">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h2 className="text-xl font-medium text-gray-600 mb-2">Your Cart is Empty</h2>
            <p className="text-gray-500 mb-6">Add some medications to your cart to get started.</p>
            <Link to="/medications" className="btn-primary">
              Browse Medications
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {cartItems.map((item, index) => (
              <div key={item.id} className="card p-4 flex flex-col md:flex-row">
                <div className="flex-grow md:pr-4">
                  <h3 className="text-lg font-semibold mb-1">{item.name}</h3>
                  <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                  <div className="flex flex-wrap text-sm text-gray-500 gap-2 mb-4">
                    <span className="bg-gray-100 rounded-full px-3 py-1">
                      {item.category}
                    </span>
                    <span className="bg-gray-100 rounded-full px-3 py-1">
                      {item.packageSize} Tablets
                    </span>
                  </div>
                </div>
                
                <div className="flex flex-col md:items-end mt-4 md:mt-0">
                  <div className="flex items-center mb-3">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1 || isProcessing}
                      className="border border-gray-300 rounded-l-lg px-3 py-1 bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
                    >
                      -
                    </button>
                    <div className="w-10 text-center border-t border-b border-gray-300 py-1">
                      {item.quantity}
                    </div>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={item.quantity >= 5 || isProcessing}
                      className="border border-gray-300 rounded-r-lg px-3 py-1 bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
                    >
                      +
                    </button>
                  </div>
                  
                  <div className="flex justify-between w-full md:justify-end md:flex-col md:items-end">
                    <p className="font-medium">
                      {item.totalPrice.toFixed(5)} ETH
                    </p>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      disabled={isProcessing}
                      className="text-red-500 hover:text-red-700 text-sm disabled:opacity-50"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            {error && (
              <ErrorMessage message={error} />
            )}
          </div>
        )}
      </div>
      
      {/* Order Summary */}
      <div className="md:col-span-1">
        <div className="card sticky top-4">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          
          <div className="space-y-3 mb-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Items ({cartItems.length})</span>
              <span>{totalPrice.toFixed(5)} ETH</span>
            </div>
          </div>
          
          <div className="border-t pt-3 mb-6">
            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>{totalPrice.toFixed(5)} ETH</span>
            </div>
          </div>
          
          <div className="mb-6">
            <p className="text-gray-700 mb-2">Payment Recipient:</p>
            <p className="text-sm bg-gray-100 p-2 rounded break-words">
              {recipientAddress}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              All payments are sent directly to this address on the Sepolia testnet
            </p>
          </div>
          
          <button
            onClick={handleCheckout}
            disabled={isProcessing || cartItems.length === 0 || !isCorrectNetwork}
            className="btn-primary w-full mb-3 flex justify-center items-center"
          >
            {isProcessing ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing ({currentItemIndex + 1}/{cartItems.length})...
              </>
            ) : !isCorrectNetwork ? (
              'Connect to Sepolia Testnet'
            ) : (
              'Checkout'
            )}
          </button>
          
          <button
            onClick={() => navigate('/medications')}
            className="w-full text-primary hover:text-blue-700 text-center"
          >
            Continue Shopping
          </button>
          
          {cartItems.length > 0 && !isProcessing && (
            <button
              onClick={clearCart}
              className="w-full text-red-500 hover:text-red-700 text-center mt-8 text-sm"
            >
              Clear Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;