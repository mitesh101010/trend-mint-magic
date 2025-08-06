import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Coins, ExternalLink } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface MintCardProps {
  imageUrl: string | null;
  prompt: string;
  connected: boolean;
  wrongNetwork: boolean;
}

const MintCard = ({ imageUrl, prompt, connected, wrongNetwork }: MintCardProps) => {
  const [minting, setMinting] = useState(false);

  const mintNFT = async () => {
    if (!imageUrl || !connected || wrongNetwork) return;

    setMinting(true);
    
    try {
      // Simulate minting process
      await new Promise(resolve => setTimeout(resolve, 4000));
      
      const txHash = "0x" + Math.random().toString(16).substr(2, 64);
      const hashScanUrl = `https://hashscan.io/testnet/transaction/${txHash}`;
      
      toast({
        title: "NFT Minted! 🎉",
        description: (
          <div className="flex items-center gap-2">
            <span>Transaction successful</span>
            <a 
              href={hashScanUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-primary hover:underline"
            >
              View <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        ),
      });
    } catch (error) {
      console.error("Error minting NFT:", error);
      toast({
        title: "Minting Failed",
        description: "Failed to mint NFT. Please try again.",
        variant: "destructive",
      });
    } finally {
      setMinting(false);
    }
  };

  const getMintButtonText = () => {
    if (!connected) return "Connect Wallet to Mint";
    if (wrongNetwork) return "Switch to Hedera Testnet";
    if (!imageUrl) return "Generate Image First";
    if (minting) return "Minting...";
    return "Mint NFT (0.01 HBAR)";
  };

  const isMintDisabled = !imageUrl || !connected || wrongNetwork || minting;

  return (
    <Card className="glass-card animate-slide-up">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Coins className="h-5 w-5 text-primary" />
          Mint Your NFT
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {imageUrl && (
          <div className="space-y-3">
            <div className="relative rounded-lg overflow-hidden border border-border/30">
              <img
                src={imageUrl}
                alt="NFT Preview"
                className="w-full aspect-square object-cover"
              />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">NFT Description:</p>
              <p className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg">
                {prompt}
              </p>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between py-2">
          <span className="text-sm font-medium">Mint Price:</span>
          <Badge variant="secondary" className="bg-primary/20 text-primary">
            0.01 HBAR
          </Badge>
        </div>

        <Button
          onClick={mintNFT}
          disabled={isMintDisabled}
          className="w-full glow-button bg-primary hover:bg-primary/90"
          size="lg"
        >
          {minting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {getMintButtonText()}
            </>
          ) : (
            <>
              <Coins className="mr-2 h-4 w-4" />
              {getMintButtonText()}
            </>
          )}
        </Button>

        {imageUrl && (
          <p className="text-xs text-muted-foreground text-center">
            Your NFT will include 5% royalties on secondary sales
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default MintCard;