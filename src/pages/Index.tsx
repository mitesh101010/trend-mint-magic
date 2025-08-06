import { useState, useEffect } from "react";
import Hero from "@/components/Hero";
import WalletConnect from "@/components/WalletConnect";
import AIGenerator from "@/components/AIGenerator";
import MintCard from "@/components/MintCard";
import Dashboard from "@/components/Dashboard";
import { Button } from "@/components/ui/button";
import { ArrowDown, Home } from "lucide-react";

const Index = () => {
  const [showApp, setShowApp] = useState(false);
  const [walletState, setWalletState] = useState({
    connected: false,
    wrongNetwork: false,
  });
  const [generatedImage, setGeneratedImage] = useState<{
    url: string;
    prompt: string;
  } | null>(null);

  useEffect(() => {
    const checkWallet = async () => {
      if (typeof window.ethereum !== "undefined") {
        try {
          const accounts = await window.ethereum.request({ method: "eth_accounts" });
          const chainId = await window.ethereum.request({ method: "eth_chainId" });
          
          setWalletState({
            connected: accounts.length > 0,
            wrongNetwork: chainId !== "0x128", // Hedera Testnet
          });
        } catch (error) {
          console.error("Error checking wallet:", error);
        }
      }
    };

    checkWallet();
    
    if (typeof window.ethereum !== "undefined") {
      window.ethereum.on("accountsChanged", checkWallet);
      window.ethereum.on("chainChanged", checkWallet);
      
      return () => {
        window.ethereum.removeListener("accountsChanged", checkWallet);
        window.ethereum.removeListener("chainChanged", checkWallet);
      };
    }
  }, []);

  const handleLaunchApp = () => {
    setShowApp(true);
    // Smooth scroll to app section
    setTimeout(() => {
      const appSection = document.getElementById("app-section");
      appSection?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleImageGenerated = (imageUrl: string, prompt: string) => {
    setGeneratedImage({ url: imageUrl, prompt });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-card border-0 border-b border-border/30">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/70 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">T</span>
            </div>
            <span className="text-xl font-bold hero-text">TrendMint</span>
          </div>
          
          <div className="flex items-center gap-4">
            {showApp && (
              <Button
                variant="ghost"
                size="sm"
                onClick={scrollToTop}
                className="hover:bg-muted/30"
              >
                <Home className="h-4 w-4 mr-2" />
                Home
              </Button>
            )}
            <WalletConnect />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-20">
        <Hero onLaunchApp={handleLaunchApp} />
        
        {showApp && (
          <div className="flex justify-center mt-8">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const appSection = document.getElementById("app-section");
                appSection?.scrollIntoView({ behavior: "smooth" });
              }}
              className="animate-bounce"
            >
              <ArrowDown className="h-4 w-4 mr-2" />
              Start Creating
            </Button>
          </div>
        )}
      </section>

      {/* App Section */}
      {showApp && (
        <section id="app-section" className="py-20 px-4">
          <div className="container mx-auto max-w-4xl space-y-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Create Your NFT</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Generate unique artwork with AI and mint it as an NFT on the Hedera network with built-in royalties
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <AIGenerator onImageGenerated={handleImageGenerated} />
              <MintCard
                imageUrl={generatedImage?.url || null}
                prompt={generatedImage?.prompt || ""}
                connected={walletState.connected}
                wrongNetwork={walletState.wrongNetwork}
              />
            </div>
          </div>
        </section>
      )}

      {/* Dashboard Section */}
      {showApp && (
        <section className="py-20 px-4 bg-muted/10">
          <div className="container mx-auto max-w-6xl">
            <Dashboard connected={walletState.connected} />
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-background/80 backdrop-blur-xl border-t border-border/30 py-8 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-6 h-6 bg-gradient-to-br from-primary to-primary/70 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">T</span>
            </div>
            <span className="font-bold hero-text">TrendMint</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Turn trends into NFTs • Powered by AI and Hedera
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;