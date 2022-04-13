const baseRoute = require("../core/routerConfig");
const { sendEmailVerificationToken } = require("../utils/sendgrid");

baseRoute.get("/", (req, res) =>
  res
    .status(200)
    .send(
      '<code>Booking Backend Running...<a target="_blank" href="https://documenter.getpostman.com/view/7021636/TzkyMzZu" style="text-decoration: none; cursor: pointer; color: black; font-weight: bold">&lt;Go To Docs/&gt;</a></code>'
    )
);

baseRoute.post("/api/send-token", (req, res) => {
  return sendEmailVerificationToken(req.body.email)
    .then((response) => res.status(response.status).json(response))
    .catch((error) => res.status(error.status).json(error));
});

module.exports = baseRoute;
