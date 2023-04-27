import { abi } from "../abi";
import { CANTO_API, NFT_CONTRACT_ADDRESS } from "../config";
import { ethers } from "ethers";

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
  try {
    // Replace this logic based on your NFT contract's implementation
    const balanceOf = await nftContract.balanceOf(address);
    const nfts = [];

    for (let i = 0; i < balanceOf; i++) {
      const tokenId = await nftContract.tokenOfOwnerByIndex(address, i);
      const tokenURI = await nftContract.tokenURI(tokenId);
      nfts.push({ tokenId: tokenId.toString(), tokenURI });
    }

    return nfts;
  } catch (error) {
    console.log("error", error);
    throw new Error(`Error fetching NFTs: ${error.message}`);
  }
}

module.exports = { getNFTsByOwner };
