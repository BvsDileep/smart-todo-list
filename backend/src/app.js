import express from "express";
import cors from "cors";
import taskRoutes from "./routes/taskRoutes.js";
import { RESPONSE_MESSAGES, ROUTES } from "./utils/globalConstants.js";

const app = express();

app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.send(RESPONSE_MESSAGES.HEALTH_CHECK_SUCCESS);
});

// Routes
app.use(ROUTES.BASE_ENDPOINT, taskRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: RESPONSE_MESSAGES.REQUEST_FAIL });
});

export default app;
