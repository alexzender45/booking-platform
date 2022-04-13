const eventRoute = require("../core/routerConfig");
const eventController = require("../controller/eventController");
const { authenticate, permit } = require("../core/userAuth");
const { ADMIN_ROLES } = require("../utils/constants");

// create event
eventRoute
  .route("/events/create-event")
  .post(authenticate, permit([ADMIN_ROLES.ADMIN]), eventController.createEvent);

// get event by id
eventRoute.route("/events/:id").get(authenticate, eventController.getEventById);

// get all events
eventRoute.route("/events").get(authenticate, eventController.getAllEvents);

// get event by location
eventRoute
  .route("/events/location/:location")
  .get(authenticate, eventController.getEventByLocation);

// update event by id
eventRoute
  .route("/events/:id")
  .put(
    authenticate,
    permit([ADMIN_ROLES.ADMIN]),
    eventController.updateEventById
  );

// delete event by id
eventRoute
  .route("/events/:eventId")
  .delete(
    authenticate,
    permit([ADMIN_ROLES.ADMIN]),
    eventController.deleteEventById
  );

module.exports = eventRoute;
