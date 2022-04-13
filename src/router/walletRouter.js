const walletRoute = require("../core/routerConfig");
const walletController = require("../controller/walletController");
const { authenticate, permit } = require("../core/userAuth");
const { USER_TYPE } = require("../utils/constants");

walletRoute
  .route("/wallet")
  .get(
    authenticate,
    permit(Object.keys(USER_TYPE)),
    walletController.getUserWallet
  );

walletRoute
  .route("/wallet/fund-wallet")
  .put(
    authenticate,
    permit(Object.keys(USER_TYPE)),
    walletController.fundWallet
  );

walletRoute
  .route("/wallet/withdrawal")
  .put(
    authenticate,
    permit(Object.keys(USER_TYPE)),
    walletController.withdrawFund
  );

// verify fund wallet
walletRoute
  .route("/wallet/verify-fund-wallet/:reference")
  .get(
    authenticate,
    permit(Object.keys(USER_TYPE)),
    walletController.verifyFundTransfer
  );

module.exports = walletRoute;
