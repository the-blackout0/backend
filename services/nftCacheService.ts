const { supabase } = require("../db/supabaseClient");

async function cacheNFTs(ownerAddress, nfts) {
  for (const nft of nfts) {
    // Check if the NFT already exists in the cache
    const { data, error } = await supabase
      .from("nft_cache")
      .select("*")
      .eq("token_id", nft.tokenId)
      .single();

    if (error) {
      throw new Error(`Error fetching NFT from cache: ${error.message}`);
    }

    if (!data) {
      // If the NFT doesn't exist in the cache, insert it
      const { error: insertError } = await supabase.from("nft_cache").insert([
        {
          owner_address: ownerAddress,
          token_id: nft.tokenId,
          token_uri: nft.tokenURI,
          metadata: nft.metadata,
        },
      ]);

      if (insertError) {
        throw new Error(
          `Error inserting NFT into cache: ${insertError.message}`
        );
      }
    }
  }
}

async function getNFTsFromCache(ownerAddress) {
  const { data, error } = await supabase
    .from("nft_cache")
    .select("*")
    .eq("owner_address", ownerAddress);

  if (error) {
    throw new Error(`Error fetching NFTs from cache: ${error.message}`);
  }

  return data;
}

async function removeNFTFromCache(ownerAddress, tokenId) {
  const { error } = await supabase
    .from("nft_cache")
    .delete()
    .eq("owner_address", ownerAddress)
    .eq("token_id", tokenId);

  if (error) {
    throw new Error(`Error removing NFT from cache: ${error.message}`);
  }
}

module.exports = { cacheNFTs, getNFTsFromCache, removeNFTFromCache };
