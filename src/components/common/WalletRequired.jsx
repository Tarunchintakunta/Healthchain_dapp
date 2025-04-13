import React, { useContext } from 'react';
import { Web3Context } from '../../context/Web3Context';

const WalletRequired = ({ children }) => {
  const { isConnected, connectWallet, isLoading } = useContext(Web3Context);

  if (isConnected) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-16 w-16 text-primary mb-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
        />
      </svg>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Wallet Connection Required</h2>
      <p className="text-gray-600 mb-6 max-w-md">
        To access this section, you need to connect your MetaMask wallet to our application.
      </p>
      <button
        onClick={connectWallet}
        disabled={isLoading}
        className="btn-primary flex items-center"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Connecting...
          </>
        ) : (
          <>
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z" clipRule="evenodd" />
            </svg>
            Connect Wallet
          </>
        )}
      </button>
      <p className="text-xs text-gray-500 mt-6">
        Don't have MetaMask? <a href="https://metamask.io/" target="_blank" rel="noreferrer" className="text-primary hover:text-blue-600">Download here</a>
      </p>
    </div>
  );
};

export default WalletRequired;