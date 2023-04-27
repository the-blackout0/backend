const nftService = require("../services/nftService");

exports.getNFTsByOwner = async (req, res) => {
  try {
    const address = req.params.address;
    const nfts = await nftService.getNFTsByOwner(address);
    res.status(200).json(nfts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
