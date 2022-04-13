const bankRoute = require("../core/routerConfig");
const bankController = require("../controller/bankController");
const { authenticate, permit } = require("../core/userAuth");
const { USER_TYPE } = require("../utils/constants");

bankRoute
  .route("/banks")
  .post(authenticate, permit(Object.keys(USER_TYPE)), bankController.addBank)
  .get(
    authenticate,
    permit(Object.keys(USER_TYPE)),
    bankController.getAllUserBank
  );

bankRoute
  .route("/banks/list")
  .get(
    authenticate,
    permit(Object.keys(USER_TYPE)),
    bankController.getBankList
  );

bankRoute
  .route("/banks/default")
  .get(
    authenticate,
    permit(Object.keys(USER_TYPE)),
    bankController.getDefaultBank
  );

bankRoute
  .route("/banks/:id")
  .get(authenticate, permit(Object.keys(USER_TYPE)), bankController.getBank)
  .put(
    authenticate,
    permit(Object.keys(USER_TYPE)),
    bankController.changeDefaultBank
  )
  .delete(
    authenticate,
    permit(Object.keys(USER_TYPE)),
    bankController.deleteBank
  );

module.exports = bankRoute;
