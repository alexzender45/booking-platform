const transactionRoute = require("../core/routerConfig");
const transactionController = require("../controller/transactionController");
const { authenticate, permit } = require("../core/userAuth");
const { ADMIN_ROLES } = require("../utils/constants");

transactionRoute
  .route("/transactions")
  .get(authenticate, transactionController.getAllUserTransactions);

transactionRoute
  .route("/transactions/user/:id")
  .get(authenticate, transactionController.getUserTransaction);

transactionRoute
  .route("/transactions/reference/:reference")
  .get(
    authenticate,
    permit(Object.keys(ADMIN_ROLES)),
    transactionController.getTransactionByReference
  );

transactionRoute
  .route("/transactions/:id")
  .get(authenticate, transactionController.getTransaction);

module.exports = transactionRoute;
