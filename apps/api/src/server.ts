import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import Fastify from "fastify";
import { config } from "./config.js";
import { registerRoutes } from "./routes/index.js";

const app = Fastify({ logger: true });

await app.register(helmet);
await app.register(cors, {
  origin(origin, cb) {
    if (!origin || config.corsOrigins.includes(origin) || config.corsOrigins.includes("*")) {
      cb(null, true);
      return;
    }
    cb(new Error(`CORS blocked origin: ${origin}`), false);
  }
});

await registerRoutes(app);

app.listen({ port: config.port, host: "0.0.0.0" }).catch((error) => {
  app.log.error(error);
  process.exit(1);
});
