import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Wallet, AlertTriangle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface WalletState {
  connected: boolean;
  address: string;
  network: string;
  wrongNetwork: boolean;
}

const HEDERA_TESTNET = {
  chainId: "0x128", // 296 in hex
  chainName: "Hedera Testnet",
  rpcUrls: ["https://testnet.hashio.io/api"],
};

const WalletConnect = () => {
  const [wallet, setWallet] = useState<WalletState>({
    connected: false,
    address: "",
    network: "",
    wrongNetwork: false,
  });

  const checkConnection = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({ method: "eth_accounts" });
        const chainId = await window.ethereum.request({ method: "eth_chainId" });
        
        if (accounts.length > 0) {
          setWallet({
            connected: true,
            address: accounts[0],
            network: chainId,
            wrongNetwork: chainId !== HEDERA_TESTNET.chainId,
          });
        }
      } catch (error) {
        console.error("Error checking wallet connection:", error);
      }
    }
  };

  useEffect(() => {
    checkConnection();
    
    if (typeof window.ethereum !== "undefined") {
      window.ethereum.on("accountsChanged", checkConnection);
      window.ethereum.on("chainChanged", checkConnection);
      
      return () => {
        window.ethereum.removeListener("accountsChanged", checkConnection);
        window.ethereum.removeListener("chainChanged", checkConnection);
      };
    }
  }, []);

  const connectWallet = async () => {
    if (typeof window.ethereum === "undefined") {
      toast({
        title: "MetaMask Not Found",
        description: "Please install MetaMask to continue",
        variant: "destructive",
      });
      return;
    }

    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      await checkConnection();
      toast({
        title: "Wallet Connected",
        description: "Successfully connected to MetaMask",
      });
    } catch (error) {
      console.error("Error connecting wallet:", error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect wallet",
        variant: "destructive",
      });
    }
  };

  const switchNetwork = async () => {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: HEDERA_TESTNET.chainId }],
      });
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [HEDERA_TESTNET],
          });
        } catch (addError) {
          console.error("Error adding network:", addError);
          toast({
            title: "Network Error",
            description: "Failed to add Hedera Testnet",
            variant: "destructive",
          });
        }
      }
    }
  };

  if (!wallet.connected) {
    return (
      <Button
        onClick={connectWallet}
        variant="outline"
        className="glass-card border-primary/30 hover:border-primary/50"
      >
        <Wallet className="mr-2 h-4 w-4" />
        Connect Wallet
      </Button>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-3">
        <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30">
          <div className="w-2 h-2 bg-primary rounded-full mr-2 animate-pulse" />
          Connected
        </Badge>
        <span className="text-sm text-muted-foreground font-mono">
          {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
        </span>
      </div>
      
      {wallet.wrongNetwork && (
        <Alert className="border-destructive/50 bg-destructive/10">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            Switch to Hedera Testnet
            <Button size="sm" onClick={switchNetwork} variant="destructive">
              Switch Network
            </Button>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default WalletConnect;