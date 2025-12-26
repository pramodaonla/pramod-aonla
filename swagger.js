import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";

export const swaggerDocs = (app) => {
  const swaggerDocument = YAML.load("./swagger.yaml");

  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument)
  );

  console.log("📄 Swagger Docs available at /api-docs");
};
