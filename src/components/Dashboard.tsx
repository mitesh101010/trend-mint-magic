import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Image, TrendingUp, Wallet } from "lucide-react";

interface NFT {
  id: string;
  name: string;
  image: string;
  lastSale: string;
  royalties: string;
}

const Dashboard = ({ connected }: { connected: boolean }) => {
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (connected) {
      // Simulate loading NFTs
      setLoading(true);
      setTimeout(() => {
        // Mock NFT data - replace with actual contract calls
        setNfts([
          {
            id: "1",
            name: "Cyberpunk Cat #001",
            image: "https://picsum.photos/300/300?random=1",
            lastSale: "0.5 HBAR",
            royalties: "0.025 HBAR"
          },
          {
            id: "2", 
            name: "Digital Landscape #001",
            image: "https://picsum.photos/300/300?random=2",
            lastSale: "1.2 HBAR",
            royalties: "0.06 HBAR"
          }
        ]);
        setLoading(false);
      }, 1500);
    }
  }, [connected]);

  const EmptyState = () => (
    <div className="text-center py-12">
      <Image className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
      <h3 className="text-lg font-semibold mb-2">No NFTs Found</h3>
      <p className="text-muted-foreground mb-4">
        Create and mint your first NFT to see it here
      </p>
    </div>
  );

  if (!connected) {
    return (
      <Card className="glass-card">
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <Wallet className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Wallet Not Connected</h3>
            <p className="text-muted-foreground">
              Connect your wallet to view your NFT collection
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Image className="h-5 w-5 text-primary" />
          My NFTs & Royalties
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="collection" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="collection">Collection</TabsTrigger>
            <TabsTrigger value="earnings">Earnings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="collection" className="mt-6">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-muted rounded-lg aspect-square mb-3" />
                    <div className="h-4 bg-muted rounded mb-2" />
                    <div className="h-3 bg-muted rounded w-2/3" />
                  </div>
                ))}
              </div>
            ) : nfts.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {nfts.map((nft) => (
                  <div key={nft.id} className="group">
                    <div className="relative rounded-lg overflow-hidden border border-border/30 mb-3">
                      <img
                        src={nft.image}
                        alt={nft.name}
                        className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <h4 className="font-semibold text-sm mb-2">{nft.name}</h4>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Last Sale:</span>
                        <span>{nft.lastSale}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Royalties:</span>
                        <Badge variant="secondary" className="text-xs h-5">
                          {nft.royalties}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="earnings" className="mt-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-muted/30">
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">Total Royalties</span>
                    </div>
                    <p className="text-2xl font-bold">0.085 HBAR</p>
                  </CardContent>
                </Card>
                <Card className="bg-muted/30">
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Image className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">NFTs Sold</span>
                    </div>
                    <p className="text-2xl font-bold">2</p>
                  </CardContent>
                </Card>
                <Card className="bg-muted/30">
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">Avg. Sale</span>
                    </div>
                    <p className="text-2xl font-bold">0.85 HBAR</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default Dashboard;