import express from "express";
import ticketRoutes from "./routes/ticket.routes.js";

const app = express();

// middleware
app.use(express.json());

// routes
app.use("/api/tickets", ticketRoutes);

export default app;