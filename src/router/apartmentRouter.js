const apartmentRoute = require("../core/routerConfig");
const apartmentController = require("../controller/apartmentController");
const { authenticate, permit } = require("../core/userAuth");
const { ADMIN_ROLES, USER_TYPE } = require("../utils/constants");

apartmentRoute
  .route("/apartments")
  .post(
    authenticate,
    permit([USER_TYPE.BUSINESS, USER_TYPE.INDIVIDUAL]),
    apartmentController.createApartment
  );

// get user apartment
apartmentRoute
  .route("/apartments/user")
  .get(
    authenticate,
    permit([USER_TYPE.BUSINESS, USER_TYPE.INDIVIDUAL]),
    apartmentController.getUserApartment
  );

// get apartment by id
apartmentRoute
  .route("/apartments/:id")
  .get(
    authenticate,
    permit([USER_TYPE.BUSINESS, USER_TYPE.INDIVIDUAL]),
    apartmentController.getApartmentById
  );

// delete apartment by id
apartmentRoute
  .route("/apartments/:id")
  .delete(
    authenticate,
    permit([USER_TYPE.BUSINESS, USER_TYPE.INDIVIDUAL]),
    apartmentController.deleteApartment
  );

// update apartment by id
apartmentRoute
  .route("/apartments/:id")
  .put(
    authenticate,
    permit([USER_TYPE.BUSINESS, USER_TYPE.INDIVIDUAL]),
    apartmentController.updateApartment
  );

// user can make apartment not available
apartmentRoute
  .route("/apartments/available/status")
  .put(
    authenticate,
    permit([USER_TYPE.BUSINESS, USER_TYPE.INDIVIDUAL]),
    apartmentController.makeApartmentNotAvailable
  );

// get all apartments
apartmentRoute
  .route("/apartments")
  .get(authenticate, apartmentController.searchApartments);

// get all apartments near you
apartmentRoute
  .route("/apartments/near/you")
  .get(authenticate, apartmentController.getApartmentsNearYou);

module.exports = apartmentRoute;
