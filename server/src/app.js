import express from "express";
import ticketRoutes from "./routes/ticket.routes.js";
import categoriesRoutes from "./routes/categories.routes.js";
import departmentsRoutes from "./routes/departments.routes.js";
import staffRoutes from "./routes/staff.routes.js";
import authRoutes from "./routes/auth.routes.js";
import commentsRoutes from "./routes/comments.routes.js";
import analyticsRoutes from "./routes/analytics.routes.js";
import globalErrorHandler from "./middlewares/error.middleware.js";


const app = express();

// middleware
app.use(express.json());

// routes
app.use("/api/tickets", ticketRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/departments", departmentsRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/tickets", commentsRoutes);

app.use(globalErrorHandler);
export default app;
