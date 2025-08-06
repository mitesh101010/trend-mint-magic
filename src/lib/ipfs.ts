interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes?: Array<{
    trait_type: string;
    value: string | number;
  }>;
}

export class IPFSService {
  private apiKey: string;
  private baseUrl = "https://api.nft.storage";

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async uploadImage(imageBlob: Blob): Promise<string> {
    try {
      const formData = new FormData();
      formData.append("file", imageBlob);

      const response = await fetch(`${this.baseUrl}/upload`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${this.apiKey}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`NFT.Storage API error: ${response.status}`);
      }

      const data = await response.json();
      return `https://ipfs.io/ipfs/${data.value.cid}`;

    } catch (error) {
      console.error("Error uploading image to IPFS:", error);
      throw new Error("Failed to upload image to IPFS");
    }
  }

  async uploadMetadata(metadata: NFTMetadata): Promise<string> {
    try {
      const metadataBlob = new Blob([JSON.stringify(metadata)], {
        type: "application/json",
      });

      const formData = new FormData();
      formData.append("file", metadataBlob);

      const response = await fetch(`${this.baseUrl}/upload`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${this.apiKey}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`NFT.Storage API error: ${response.status}`);
      }

      const data = await response.json();
      return `https://ipfs.io/ipfs/${data.value.cid}`;

    } catch (error) {
      console.error("Error uploading metadata to IPFS:", error);
      throw new Error("Failed to upload metadata to IPFS");
    }
  }

  async createAndUploadNFTMetadata(
    imageUrl: string,
    name: string,
    description: string,
    attributes: Array<{ trait_type: string; value: string | number }> = []
  ): Promise<string> {
    const metadata: NFTMetadata = {
      name,
      description,
      image: imageUrl,
      attributes,
    };

    return this.uploadMetadata(metadata);
  }
}

export const createIPFSService = (apiKey: string) => {
  return new IPFSService(apiKey);
};