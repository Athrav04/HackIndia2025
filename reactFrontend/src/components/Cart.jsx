import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { ethers } from "ethers";
import "./Cart.css";

// Escrow contract ABI - just the functions we need
const ESCROW_ABI = [
  "function createEscrow(address payable _seller, string memory _productId) external payable returns (uint256)",
  "event EscrowCreated(uint256 indexed escrowId, address buyer, address seller, uint256 amount, string productId)"
];

const ESCROW_CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const SELLER_ADDRESS = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"; 

function Cart() {
  const {
    cartItems,
    isCartOpen,
    totalPrice,
    totalItems,
    toggleCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  } = useCart();

  const [isProcessing, setIsProcessing] = useState(false);
  const [transactionError, setTransactionError] = useState(null);
  const [transactionSuccess, setTransactionSuccess] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState(null);

  // Check wallet connection status
  useEffect(() => {
    const checkWalletConnection = async () => {
      if (window.ethereum) {
        try {
          // Check if already connected
          const accounts = await window.ethereum.request({
            method: 'eth_accounts'
          });
          
          if (accounts.length > 0) {
            setIsWalletConnected(true);
            setWalletAddress(accounts[0]);
          }
        } catch (error) {
          console.error("Failed to check wallet connection:", error);
        }
      }
    };

    checkWalletConnection();
  }, []);

  // Connect wallet function
  const connectWallet = async () => {
    if (!window.ethereum) {
      setTransactionError("MetaMask or another Web3 wallet is required");
      return false;
    }

    try {
      setIsProcessing(true);
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });
      
      if (accounts.length > 0) {
        setIsWalletConnected(true);
        setWalletAddress(accounts[0]);
        setTransactionError(null);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      setTransactionError("Failed to connect wallet. Please try again.");
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  // Format price as Indian Rupees
  const formatPrice = (price) => {
    return `₹${price.toLocaleString("en-IN")}`;
  };

  // Handle checkout with blockchain transaction
  const handleCheckout = async () => {
    setTransactionError(null);
    
    // First ensure wallet is connected
    if (!isWalletConnected) {
      const connected = await connectWallet();
      if (!connected) return;
    }

    try {
      setIsProcessing(true);
      
      // Connect to provider
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      
      // Check balance
      const balance = await provider.getBalance(walletAddress || await signer.getAddress());
      if (balance.isZero()) {
        setTransactionError("Your wallet has 0 ETH. Please add funds to continue.");
        setIsProcessing(false);
        return;
      }
      
      // Connect to the Escrow contract
      const escrowContract = new ethers.Contract(
        ESCROW_CONTRACT_ADDRESS,
        ESCROW_ABI,
        signer
      );
      
      // Use a minimal amount for testing
      const amountInEth = ethers.utils.parseEther("0.0001");
      
      // Create batch product ID string
      const productIdsJson = JSON.stringify(cartItems.map(item => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity
      })));
      
      // Send transaction with low gas settings for Anvil
      const tx = await escrowContract.createEscrow(
        SELLER_ADDRESS,
        productIdsJson,
        { 
          value: amountInEth,
          gasLimit: 3000000,
          gasPrice: ethers.utils.parseUnits("1", "gwei")
        }
      );
      
      // Wait for transaction to be mined
      await tx.wait();
      
      // Transaction successful
      setTransactionSuccess(true);
      clearCart(); // Clear the cart after successful payment
      
      setTimeout(() => {
        setTransactionSuccess(false);
        toggleCart(); // Close cart after a delay
      }, 3000);
      
    } catch (error) {
      console.error("Transaction error:", error);
      
      // Format a more user-friendly error message
      let errorMessage = "Transaction failed. Please try again.";
      
      if (error.code === 'INSUFFICIENT_FUNDS' || 
          (error.message && error.message.includes("insufficient funds"))) {
        errorMessage = "Not enough ETH in your wallet to complete this transaction.";
      } else if (error.message && error.message.includes("user rejected")) {
        errorMessage = "Transaction was rejected. Please try again.";
      } else if (error.message && error.message.includes("network")) {
        errorMessage = "Network error. Please check your connection to the Ethereum network.";
      }
      
      setTransactionError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isCartOpen) return null;

  return (
    <div className={`cart-overlay ${isCartOpen ? "open" : ""}`}>
      <div className="cart-drawer">
        <div className="cart-header">
          <h3>Your Cart ({totalItems})</h3>
          <button className="close-cart" onClick={toggleCart}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {transactionSuccess && (
          <div className="success-message">
            <p>Payment successful! Your order has been placed.</p>
          </div>
        )}

        {transactionError && (
          <div className="error-message">
            <p>{transactionError}</p>
          </div>
        )}

        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <svg
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            <p>Your cart is empty</p>
            <button className="continue-shopping" onClick={toggleCart}>
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item">
                  <div className="item-image">
                    <img src={item.image} alt={item.name} />
                  </div>
                  <div className="item-details">
                    <h4>{item.name}</h4>
                    <div className="item-price">{formatPrice(item.price)}</div>
                    <div className="item-actions">
                      <div className="item-quantity">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          disabled={item.quantity === 1}
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                        >
                          +
                        </button>
                      </div>
                      <button
                        className="remove-item"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M3 6h18"></path>
                          <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6"></path>
                          <path d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <div className="cart-total">
                <span>Total:</span>
                <span className="total-price">{formatPrice(totalPrice)}</span>
              </div>
              <div className="cart-actions">
                <button 
                  className="checkout-btn" 
                  onClick={isWalletConnected ? handleCheckout : connectWallet}
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Processing...' : isWalletConnected ? 'Proceed to Checkout' : 'Connect Wallet to Checkout'}
                </button>
                <button className="clear-cart" onClick={clearCart}>
                  Clear Cart
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Cart;