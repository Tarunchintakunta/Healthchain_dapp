import React, { createContext, useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import HealthInsuranceABI from '../artifacts/contracts/HealthInsurance.sol/HealthInsurance.json';
import toast from 'react-hot-toast';

export const Web3Context = createContext();

// Fixed recipient address for all payments
const RECIPIENT_ADDRESS = '0x078D8Db473Ab8Fe3036390A3B37C81AdA6c1E5A9';

// Sepolia Chain ID
const SEPOLIA_CHAIN_ID = '0xaa36a7'; // Chain ID for Sepolia testnet

export const Web3Provider = ({ children }) => {
  const [account, setAccount] = useState('');
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [networkName, setNetworkName] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(false);

  const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;

  // Initialize ethers provider
  const initProvider = useCallback(async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(provider);
        
        const network = await provider.getNetwork();
        const chainIdHex = `0x${network.chainId.toString(16)}`;
        setNetworkName(network.name === 'unknown' ? 'sepolia' : network.name);
        setIsCorrectNetwork(chainIdHex === SEPOLIA_CHAIN_ID);
        
        return provider;
      } catch (error) {
        console.error('Error initializing provider:', error);
        toast.error('Failed to initialize Web3 provider');
      }
    } else {
      toast.error('Please install MetaMask to use this application');
    }
    return null;
  }, []);

  // Switch to Sepolia network
  const switchToSepolia = useCallback(async () => {
    if (!window.ethereum) return false;
    
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: SEPOLIA_CHAIN_ID }],
      });
      return true;
    } catch (switchError) {
      // If the chain hasn't been added to MetaMask
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: SEPOLIA_CHAIN_ID,
                chainName: 'Sepolia Testnet',
                nativeCurrency: {
                  name: 'Sepolia ETH',
                  symbol: 'ETH',
                  decimals: 18,
                },
                rpcUrls: ['https://sepolia.infura.io/v3/'],
                blockExplorerUrls: ['https://sepolia.etherscan.io'],
              },
            ],
          });
          return true;
        } catch (addError) {
          console.error('Error adding Sepolia network to MetaMask:', addError);
          toast.error('Failed to add Sepolia network');
          return false;
        }
      }
      console.error('Error switching to Sepolia network:', switchError);
      toast.error('Failed to switch to Sepolia network');
      return false;
    }
  }, []);

  // Connect wallet
  const connectWallet = useCallback(async () => {
    if (!window.ethereum) {
      toast.error('Please install MetaMask to use this application');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const newProvider = await initProvider();
      if (!newProvider) {
        setIsLoading(false);
        return;
      }
      
      // Check if we're on Sepolia, and if not, prompt to switch
      const network = await newProvider.getNetwork();
      const chainIdHex = `0x${network.chainId.toString(16)}`;
      
      if (chainIdHex !== SEPOLIA_CHAIN_ID) {
        toast.loading('Please switch to Sepolia testnet...', { id: 'network' });
        const success = await switchToSepolia();
        toast.dismiss('network');
        
        if (!success) {
          setIsLoading(false);
          toast.error('Please connect to Sepolia testnet to use this application');
          return;
        }
      }
      
      // Request account access
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const account = accounts[0];
      setAccount(account);
      
      // Get updated provider and signer after network switch
      const updatedProvider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(updatedProvider);
      
      const signer = updatedProvider.getSigner();
      setSigner(signer);
      
      // Initialize contract
      const healthInsuranceContract = new ethers.Contract(
        contractAddress,
        HealthInsuranceABI.abi,
        signer
      );
      setContract(healthInsuranceContract);
      
      setIsConnected(true);
      setIsCorrectNetwork(true);
      toast.success('Wallet connected to Sepolia testnet!');
    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast.error('Failed to connect wallet');
    } finally {
      setIsLoading(false);
    }
  }, [initProvider, contractAddress, switchToSepolia]);

  // Disconnect wallet
  const disconnectWallet = useCallback(() => {
    setAccount('');
    setSigner(null);
    setContract(null);
    setIsConnected(false);
    toast.success('Wallet disconnected');
  }, []);

  // Listen for account and chain changes
  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = (accounts) => {
        if (accounts.length === 0) {
          // User disconnected their wallet
          disconnectWallet();
        } else if (accounts[0] !== account) {
          // User switched accounts
          setAccount(accounts[0]);
          if (provider) {
            const signer = provider.getSigner();
            setSigner(signer);
            
            const healthInsuranceContract = new ethers.Contract(
              contractAddress,
              HealthInsuranceABI.abi,
              signer
            );
            setContract(healthInsuranceContract);
          }
        }
      };

      const handleChainChanged = (chainId) => {
        // Check if the new chain is Sepolia
        setIsCorrectNetwork(chainId === SEPOLIA_CHAIN_ID);
        
        // Reload the page when the chain changes
        window.location.reload();
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      // Clean up event listeners
      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, [account, provider, contractAddress, disconnectWallet]);

  // Initialize provider on mount
  useEffect(() => {
    initProvider();
  }, [initProvider]);

  // Function to purchase insurance plan - direct payment to specified address
  const purchaseInsurance = async (planId, peopleCount, costInEth) => {
    if (!signer) {
      toast.error('Please connect your wallet first');
      return false;
    }

    if (!isCorrectNetwork) {
      toast.error('Please connect to Sepolia testnet');
      const success = await switchToSepolia();
      if (!success) return false;
    }

    setIsLoading(true);
    try {
      const costInWei = ethers.utils.parseEther(costInEth.toString());
      
      // Instead of calling the contract, we send ETH directly to the recipient address
      const tx = await signer.sendTransaction({
        to: RECIPIENT_ADDRESS,
        value: costInWei,
        // Add data field to identify the transaction type
        data: ethers.utils.hexlify(
          ethers.utils.toUtf8Bytes(`Insurance Plan: ${planId}, People: ${peopleCount}`)
        ),
      });
      
      toast.loading('Processing transaction...', { id: 'txn' });
      await tx.wait();
      
      toast.success('Insurance purchased successfully!', { id: 'txn' });
      return true;
    } catch (error) {
      console.error('Error purchasing insurance:', error);
      toast.error('Failed to purchase insurance', { id: 'txn' });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Function to purchase medication - direct payment to specified address
  const purchaseMedication = async (medicationId, packageSize, quantity, costInEth) => {
    if (!signer) {
      toast.error('Please connect your wallet first');
      return false;
    }

    if (!isCorrectNetwork) {
      toast.error('Please connect to Sepolia testnet');
      const success = await switchToSepolia();
      if (!success) return false;
    }

    setIsLoading(true);
    try {
      const costInWei = ethers.utils.parseEther(costInEth.toString());
      
      // Instead of calling the contract, we send ETH directly to the recipient address
      const tx = await signer.sendTransaction({
        to: RECIPIENT_ADDRESS,
        value: costInWei,
        // Add data field to identify the transaction type
        data: ethers.utils.hexlify(
          ethers.utils.toUtf8Bytes(`Medication: ${medicationId}, Package: ${packageSize}, Qty: ${quantity}`)
        ),
      });
      
      toast.loading('Processing transaction...', { id: 'txn' });
      await tx.wait();
      
      toast.success('Medication purchased successfully!', { id: 'txn' });
      return true;
    } catch (error) {
      console.error('Error purchasing medication:', error);
      toast.error('Failed to purchase medication', { id: 'txn' });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // We'll need to maintain a local record of purchases since we're not using the contract storage
  const [userPolicies, setUserPolicies] = useState([]);
  const [userMedications, setUserMedications] = useState([]);

  // Function to add a policy to the local storage
  const addUserPolicy = useCallback((policy) => {
    setUserPolicies(prev => [...prev, policy]);
    // Also save to localStorage for persistence
    try {
      const existingPolicies = JSON.parse(localStorage.getItem('userPolicies') || '[]');
      localStorage.setItem('userPolicies', JSON.stringify([...existingPolicies, policy]));
    } catch (error) {
      console.error('Error saving policy to localStorage:', error);
    }
  }, []);

  // Function to add a medication purchase to the local storage
  const addUserMedication = useCallback((medication) => {
    setUserMedications(prev => [...prev, medication]);
    // Also save to localStorage for persistence
    try {
      const existingMedications = JSON.parse(localStorage.getItem('userMedications') || '[]');
      localStorage.setItem('userMedications', JSON.stringify([...existingMedications, medication]));
    } catch (error) {
      console.error('Error saving medication to localStorage:', error);
    }
  }, []);

  // Load user data from localStorage on initial load
  useEffect(() => {
    try {
      const savedPolicies = JSON.parse(localStorage.getItem('userPolicies') || '[]');
      const savedMedications = JSON.parse(localStorage.getItem('userMedications') || '[]');
      setUserPolicies(savedPolicies);
      setUserMedications(savedMedications);
    } catch (error) {
      console.error('Error loading user data from localStorage:', error);
    }
  }, []);

  // Function to get user's insurance policies - using local storage instead of contract
  const getUserPolicies = async () => {
    // In a real app, you'd fetch from the blockchain
    // Here we're using the locally stored policies
    return userPolicies.filter(policy => policy.userAddress === account.toLowerCase());
  };

  // Function to get user's medication purchases - using local storage instead of contract
  const getUserMedicationPurchases = async () => {
    // In a real app, you'd fetch from the blockchain
    // Here we're using the locally stored medications
    return userMedications.filter(med => med.userAddress === account.toLowerCase());
  };

  // Function to get all insurance plans - simulating contract call
  const getInsurancePlans = async () => {
    // In a real app, you'd fetch from the contract
    // Here we're returning mock data
    return [
      {
        name: "Dental Care",
        description: "Basic dental coverage including cleanings and fillings",
        basePriceWei: ethers.utils.parseEther("0.01"),
      },
      {
        name: "General Health",
        description: "Comprehensive health coverage for regular checkups and emergency care",
        basePriceWei: ethers.utils.parseEther("0.02"),
      },
      {
        name: "Vision Care",
        description: "Eye exams and prescription glasses/contacts coverage",
        basePriceWei: ethers.utils.parseEther("0.008"),
      },
      {
        name: "Preventative Care",
        description: "Wellness visits, vaccinations, and preventative screenings",
        basePriceWei: ethers.utils.parseEther("0.015"),
      },
    ];
  };

  // Function to get all medications - simulating contract call
  const getMedications = async () => {
    // In a real app, you'd fetch from the contract
    // Here we're returning mock data
    return [
      {
        name: "Ibuprofen",
        description: "Pain reliever and fever reducer",
        category: "Pain Relief",
        priceWei: ethers.utils.parseEther("0.001"),
      },
      {
        name: "Acetaminophen",
        description: "Pain reliever and fever reducer",
        category: "Pain Relief",
        priceWei: ethers.utils.parseEther("0.0008"),
      },
      {
        name: "Amoxicillin",
        description: "Antibiotic for bacterial infections",
        category: "Antibiotics",
        priceWei: ethers.utils.parseEther("0.003"),
      },
      {
        name: "Loratadine",
        description: "Antihistamine for allergy relief",
        category: "Allergy",
        priceWei: ethers.utils.parseEther("0.0015"),
      },
      {
        name: "Pseudoephedrine",
        description: "Decongestant for cold and sinus",
        category: "Cold & Flu",
        priceWei: ethers.utils.parseEther("0.002"),
      },
      {
        name: "Multivitamin",
        description: "Daily nutritional supplement",
        category: "Vitamins",
        priceWei: ethers.utils.parseEther("0.001"),
      },
    ];
  };

  return (
    <Web3Context.Provider
      value={{
        account,
        provider,
        signer,
        contract,
        isLoading,
        networkName,
        isConnected,
        isCorrectNetwork,
        connectWallet,
        disconnectWallet,
        purchaseInsurance,
        purchaseMedication,
        getUserPolicies,
        getUserMedicationPurchases,
        getInsurancePlans,
        getMedications,
        addUserPolicy,
        addUserMedication,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};

export default Web3Provider;