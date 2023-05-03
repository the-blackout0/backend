import { abi } from "../abi";
import { CANTO_API, NFT_CONTRACT_ADDRESS } from "../config";
import { ethers } from "ethers";

const {
  getNFTsFromCache,
  cacheNFTs,
  removeNFTFromCache,
} = require("./nftCacheService");

// @ts-ignore
const provider = new ethers.JsonRpcProvider(CANTO_API);

// Replace with your NFT contract's ABI and address
const nftContractAbi = abi;

const nftContract = new ethers.Contract(
  NFT_CONTRACT_ADDRESS,
  nftContractAbi,
  provider
);

async function getNFTsByOwner(address) {
  // First, try to fetch NFTs from the cache
  const cachedNfts = await getNFTsFromCache(address);

  if (cachedNfts && cachedNfts.length > 0) {
    return cachedNfts;
  }

  try {
    // If the cache is empty, fetch the NFTs from the blockchain
    const balanceOf = await nftContract.balanceOf(address);
    const nfts = [];

    for (let i = 0; i < balanceOf; i++) {
      const tokenId = await nftContract.tokenOfOwnerByIndex(address, i);
      const tokenURI = await nftContract.tokenURI(tokenId);

      // Fetch metadata from the token URI (optional)
      const response = await fetch(tokenURI);
      const metadata = await response.json();

      nfts.push({ tokenId: tokenId.toString(), tokenURI, metadata });
    }

    // Cache the fetched NFTs
    await cacheNFTs(address, nfts);

    return nfts;
  } catch (error) {
    throw new Error(`Error fetching NFTs: ${error.message}`);
  }
}

function setupEventListener() {
  nftContract.on("Transfer", async (from, to, tokenId) => {
    try {
      // Remove the NFT from the previous owner's cache
      await removeNFTFromCache(from, tokenId);

      // Fetch the token URI for the transferred NFT
      const tokenURI = await nftContract.tokenURI(tokenId);

      // Fetch metadata from the token URI (optional)
      const response = await fetch(tokenURI);
      const metadata = await response.json();

      // Cache the NFT for the new owner
      await cacheNFTs(to, tokenId, tokenURI, metadata);
    } catch (error) {
      console.error(`Error handling NFT transfer: ${error.message}`);
    }
  });
}

// Call setupEventListener() when initializing the nftService
setupEventListener();

module.exports = { getNFTsByOwner };
