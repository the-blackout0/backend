module.exports = async (app) => {
  const nftController = require("../controllers/nftController.ts");

  const baseRoute = "/nfts";

  app.get(`${baseRoute}/:address`, nftController.getNFTsByOwner);
};
