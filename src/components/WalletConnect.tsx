import React, { useState, useEffect } from 'react';
import { Wallet, WifiOff, Loader2, Copy, ExternalLink, AlertCircle } from 'lucide-react';

interface WalletState {
  connected: boolean;
  accountId?: string;
  network?: string;
}

interface WalletConnectProps {
  network?: 'testnet' | 'mainnet';
  onConnect?: (accountId: string) => void;
  onDisconnect?: () => void;
}

const WalletConnect: React.FC<WalletConnectProps> = ({
  network = 'testnet',
  onConnect,
  onDisconnect
}) => {
  const [wallet, setWallet] = useState<WalletState>({ connected: false });
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkWalletConnection();
  }, []);

  const checkWalletConnection = async () => {
    try {
      // Check if wallet is available
      if (typeof window !== 'undefined') {
        // Check for HashPack
        const hashpack = (window as any).hashpack;
        if (hashpack) {
          console.log('HashPack detected');
          return;
        }

        // Check for other Hedera wallets
        const hedera = (window as any).hedera;
        if (hedera) {
          console.log('Hedera wallet detected');
          return;
        }

        // Wait a bit for wallet to load
        setTimeout(() => {
          checkWalletConnection();
        }, 1000);
      }
    } catch (err) {
      console.error('Error checking wallet:', err);
    }
  };

  const connectWallet = async () => {
    setIsConnecting(true);
    setError(null);

    try {
      let provider = null;

      // Try HashPack first
      if ((window as any).hashpack) {
        provider = (window as any).hashpack;
        console.log('Using HashPack');
      }
      // Try generic Hedera provider
      else if ((window as any).hedera) {
        provider = (window as any).hedera;
        console.log('Using Hedera provider');
      }
      // Try window.ethereum (some wallets expose this)
      else if ((window as any).ethereum) {
        provider = (window as any).ethereum;
        console.log('Using Ethereum provider');
      }

      if (!provider) {
        throw new Error('No wallet found. Please install HashPack or another Hedera wallet.');
      }

      // Method 1: Try enable() method
      if (typeof provider.enable === 'function') {
        const accounts = await provider.enable();
        if (accounts && accounts.length > 0) {
          handleSuccessfulConnection(accounts[0]);
          return;
        }
      }

      // Method 2: Try request() method
      if (typeof provider.request === 'function') {
        const accounts = await provider.request({ 
          method: 'eth_requestAccounts' 
        });
        if (accounts && accounts.length > 0) {
          handleSuccessfulConnection(accounts[0]);
          return;
        }
      }

      // Method 3: Try connect() method
      if (typeof provider.connect === 'function') {
        const result = await provider.connect();
        if (result?.accounts && result.accounts.length > 0) {
          handleSuccessfulConnection(result.accounts[0]);
          return;
        }
        if (result?.account) {
          handleSuccessfulConnection(result.account);
          return;
        }
      }

      // Method 4: Try requestAccounts() method
      if (typeof provider.requestAccounts === 'function') {
        const accounts = await provider.requestAccounts();
        if (accounts && accounts.length > 0) {
          handleSuccessfulConnection(accounts[0]);
          return;
        }
      }

      // Method 5: Try getAccounts() method
      if (typeof provider.getAccounts === 'function') {
        const accounts = await provider.getAccounts();
        if (accounts && accounts.length > 0) {
          handleSuccessfulConnection(accounts[0]);
          return;
        }
      }

      // Method 6: Direct property access
      if (provider.selectedAddress) {
        handleSuccessfulConnection(provider.selectedAddress);
        return;
      }

      if (provider.account) {
        handleSuccessfulConnection(provider.account);
        return;
      }

      // If none of the methods work, try to trigger wallet popup
      if (provider.isHashPack || provider._isHashPack) {
        // Try to trigger HashPack connection
        const connectButton = document.createElement('button');
        connectButton.onclick = () => {
          console.log('Manual HashPack connection attempt');
        };
        
        // Simulate click to trigger wallet
        connectButton.click();
      }

      throw new Error('Could not connect to wallet. Please try again.');

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to connect wallet';
      setError(errorMessage);
      showToast('Connection Failed', errorMessage, 'error');
      console.error('Wallet connection error:', err);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleSuccessfulConnection = (accountId: string) => {
    if (!accountId) {
      throw new Error('No account ID received');
    }

    // Clean up account ID format
    const cleanAccountId = accountId.toString().trim();
    
    const walletState = {
      connected: true,
      accountId: cleanAccountId,
      network
    };

    setWallet(walletState);
    localStorage.setItem('wallet_account', cleanAccountId);
    localStorage.setItem('wallet_network', network);
    
    showToast('Wallet Connected!', `Connected to ${cleanAccountId}`, 'success');
    onConnect?.(cleanAccountId);
  };

  const disconnectWallet = async () => {
    try {
      // Clear stored data
      localStorage.removeItem('wallet_account');
      localStorage.removeItem('wallet_network');
      
      setWallet({ connected: false });
      setError(null);
      
      showToast('Disconnected', 'Wallet disconnected successfully', 'success');
      onDisconnect?.();
    } catch (err) {
      console.error('Disconnect error:', err);
    }
  };

  const copyAccountId = async () => {
    if (wallet.accountId) {
      try {
        await navigator.clipboard.writeText(wallet.accountId);
        showToast('Copied!', 'Account ID copied to clipboard', 'success');
      } catch (err) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = wallet.accountId;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showToast('Copied!', 'Account ID copied to clipboard', 'success');
      }
    }
  };

  const openInExplorer = () => {
    if (wallet.accountId) {
      const baseUrl = network === 'testnet' 
        ? 'https://hashscan.io/testnet/account/' 
        : 'https://hashscan.io/mainnet/account/';
      window.open(`${baseUrl}${wallet.accountId}`, '_blank');
    }
  };

  const showToast = (title: string, message: string, type: 'success' | 'error') => {
    const toast = document.createElement('div');
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 16px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 9999;
      max-width: 300px;
      ${type === 'success' 
        ? 'background: #10B981; color: white;' 
        : 'background: #EF4444; color: white;'
      }
    `;
    
    toast.innerHTML = `
      <div style="font-weight: bold; margin-bottom: 4px;">${title}</div>
      <div style="font-size: 14px;">${message}</div>
    `;
    
    document.body.appendChild(toast);
    setTimeout(() => {
      if (document.body.contains(toast)) {
        document.body.removeChild(toast);
      }
    }, 4000);
  };

  const formatAccountId = (accountId: string) => {
    if (accountId.length <= 12) return accountId;
    return `${accountId.slice(0, 6)}...${accountId.slice(-6)}`;
  };

  const openHashPackStore = () => {
    window.open('https://chrome.google.com/webstore/detail/hashpack/gjagmgiddbbciopjhllkdnddhcglnemk', '_blank');
  };

  if (!wallet.connected) {
    return (
      <div className="max-w-md mx-auto space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-3">
            <Wallet className="w-6 h-6 text-blue-600" />
            <div>
              <h3 className="font-medium text-blue-900">Connect Your Wallet</h3>
              <p className="text-sm text-blue-700">Connect to Hedera {network}</p>
            </div>
          </div>
          
          <button
            onClick={connectWallet}
            disabled={isConnecting}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isConnecting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <Wallet className="w-5 h-5" />
                Connect Wallet
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-medium text-red-900">Connection Error</h4>
                <p className="text-sm text-red-700 mt-1">{error}</p>
                <button
                  onClick={openHashPackStore}
                  className="mt-3 text-sm text-red-600 hover:text-red-800 underline"
                >
                  Install HashPack Extension
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="text-center text-sm text-gray-500">
          Make sure your HashPack wallet is unlocked
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-green-900">
              {formatAccountId(wallet.accountId || '')}
            </p>
            <p className="text-xs text-green-600">
              Connected to {network}
            </p>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={copyAccountId}
              className="p-2 text-green-600 hover:text-green-800 hover:bg-green-100 rounded-full"
              title="Copy Account ID"
            >
              <Copy className="w-4 h-4" />
            </button>
            
            <button
              onClick={openInExplorer}
              className="p-2 text-green-600 hover:text-green-800 hover:bg-green-100 rounded-full"
              title="View in Explorer"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
            
            <button
              onClick={disconnectWallet}
              className="p-2 text-green-600 hover:text-red-600 hover:bg-red-100 rounded-full"
              title="Disconnect"
            >
              <WifiOff className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletConnect;