import { ethers } from "ethers";

// ERC-721 ABI for NFT contract
export const NFT_ABI = [
  "function mint(address to, string memory tokenURI) public payable returns (uint256)",
  "function balanceOf(address owner) public view returns (uint256)",
  "function tokenOfOwnerByIndex(address owner, uint256 index) public view returns (uint256)",
  "function tokenURI(uint256 tokenId) public view returns (string memory)",
  "function royaltyInfo(uint256 tokenId, uint256 salePrice) public view returns (address, uint256)",
  "function ownerOf(uint256 tokenId) public view returns (address)",
  "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)"
];

export class Web3Service {
  private provider: ethers.BrowserProvider | null = null;
  private signer: ethers.JsonRpcSigner | null = null;
  private contract: ethers.Contract | null = null;

  constructor() {
    this.initializeProvider();
  }

  private async initializeProvider() {
    if (typeof window.ethereum !== "undefined") {
      this.provider = new ethers.BrowserProvider(window.ethereum);
    }
  }

  async connect() {
    if (!this.provider) {
      throw new Error("MetaMask not found");
    }

    await this.provider.send("eth_requestAccounts", []);
    this.signer = await this.provider.getSigner();
    
    const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
    if (contractAddress) {
      this.contract = new ethers.Contract(contractAddress, NFT_ABI, this.signer);
    }
    
    return this.signer.getAddress();
  }

  async mintNFT(metadataURI: string, mintPrice: string = "0.01") {
    if (!this.contract || !this.signer) {
      throw new Error("Contract or signer not initialized");
    }

    const address = await this.signer.getAddress();
    const priceInWei = ethers.parseEther(mintPrice);

    const tx = await this.contract.mint(address, metadataURI, {
      value: priceInWei,
    });

    return tx.wait();
  }

  async getUserNFTs(userAddress: string) {
    if (!this.contract) {
      throw new Error("Contract not initialized");
    }

    const balance = await this.contract.balanceOf(userAddress);
    const nfts = [];

    for (let i = 0; i < balance; i++) {
      const tokenId = await this.contract.tokenOfOwnerByIndex(userAddress, i);
      const tokenURI = await this.contract.tokenURI(tokenId);
      nfts.push({ tokenId: tokenId.toString(), tokenURI });
    }

    return nfts;
  }

  async getRoyaltyInfo(tokenId: string, salePrice: string) {
    if (!this.contract) {
      throw new Error("Contract not initialized");
    }

    const salePriceWei = ethers.parseEther(salePrice);
    const [recipient, royaltyAmount] = await this.contract.royaltyInfo(tokenId, salePriceWei);
    
    return {
      recipient,
      royaltyAmount: ethers.formatEther(royaltyAmount),
    };
  }

  async switchToHederaTestnet() {
    if (!this.provider) {
      throw new Error("Provider not found");
    }

    try {
      await this.provider.send("wallet_switchEthereumChain", [
        { chainId: "0x128" }, // 296 in hex
      ]);
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        await this.provider.send("wallet_addEthereumChain", [
          {
            chainId: "0x128",
            chainName: "Hedera Testnet",
            rpcUrls: ["https://testnet.hashio.io/api"],
            nativeCurrency: {
              name: "HBAR",
              symbol: "HBAR",
              decimals: 18,
            },
            blockExplorerUrls: ["https://hashscan.io/testnet"],
          },
        ]);
      }
    }
  }
}

export const web3Service = new Web3Service();