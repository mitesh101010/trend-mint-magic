import { Button } from "@/components/ui/button";

const Hero = ({ onLaunchApp }: { onLaunchApp: () => void }) => {
  return (
    <div className="relative min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <div className="animate-fade-in">
        <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
          Turn <span className="hero-text">Trends</span> into{" "}
          <span className="hero-text">NFTs</span>
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl">
          Generate unique NFTs from AI prompts and mint them on Hedera with instant royalties
        </p>
        <Button
          onClick={onLaunchApp}
          size="lg"
          className="glow-button text-lg px-8 py-4 h-auto bg-primary hover:bg-primary/90"
        >
          Launch App
        </Button>
      </div>
    </div>
  );
};

export default Hero;