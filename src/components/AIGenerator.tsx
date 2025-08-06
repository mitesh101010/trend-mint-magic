import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Sparkles, Image as ImageIcon } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface AIGeneratorProps {
  onImageGenerated: (imageUrl: string, prompt: string) => void;
}

const AIGenerator = ({ onImageGenerated }: AIGeneratorProps) => {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const generateImage = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Prompt Required",
        description: "Please enter a description for your NFT",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      // Simulate API call for now - replace with actual OpenRouter integration
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // For demo purposes, using a placeholder image
      const imageUrl = `https://picsum.photos/512/512?random=${Date.now()}`;
      setGeneratedImage(imageUrl);
      onImageGenerated(imageUrl, prompt);
      
      toast({
        title: "Image Generated! ✨",
        description: "Your NFT image is ready for minting",
      });
    } catch (error) {
      console.error("Error generating image:", error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="glass-card animate-slide-up">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          AI NFT Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Textarea
            placeholder="Describe your NFT... (e.g., 'A futuristic cyberpunk cat with neon eyes in a digital cityscape')"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-[100px] bg-input/50 border-border/30 focus:border-primary/50"
            disabled={loading}
          />
        </div>
        
        <Button
          onClick={generateImage}
          disabled={loading || !prompt.trim()}
          className="w-full glow-button bg-primary hover:bg-primary/90"
          size="lg"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Generate NFT
            </>
          )}
        </Button>

        {generatedImage && (
          <div className="space-y-4 animate-fade-in">
            <div className="relative rounded-lg overflow-hidden border border-border/30">
              <img
                src={generatedImage}
                alt="Generated NFT"
                className="w-full aspect-square object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {prompt}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIGenerator;