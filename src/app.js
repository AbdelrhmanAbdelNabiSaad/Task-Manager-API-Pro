const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const compression = require("compression");
const express = require("express");
const app = express();
const authRoutes = require("./routes/auth.route");

const taskRoutes = require("./routes/task.route");

const errorHandler = require("./middlewares/errorHandler.middleware");

app.use(
  helmet({
    contentSecurityPolicy: false,
  }),
);

app.use(
  cors({
    origin: "*",
  }),
);

app.use(compression());

app.use(morgan("dev"));

app.use(express.json());

app.use("/api/auth", authRoutes);

app.use("/api/tasks", taskRoutes);

app.get("/", (req, res) => {
  res.redirect("/api-docs");
});

const SWAGGER_UI_VERSION = "5.32.11";
const swaggerUiOptions = {
  customCssUrl: `https://cdn.jsdelivr.net/npm/swagger-ui-dist@${SWAGGER_UI_VERSION}/swagger-ui.min.css`,
  customJs: [
    `https://cdn.jsdelivr.net/npm/swagger-ui-dist@${SWAGGER_UI_VERSION}/swagger-ui-bundle.min.js`,
    `https://cdn.jsdelivr.net/npm/swagger-ui-dist@${SWAGGER_UI_VERSION}/swagger-ui-standalone-preset.min.js`,
  ],
};

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, swaggerUiOptions),
);

app.use(errorHandler);

module.exports = app;
