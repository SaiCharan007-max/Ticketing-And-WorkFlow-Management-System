import "dotenv/config";
import app from "./app.js";
import pool from "./config/db.js";
import http from "http";
import jwt from "jsonwebtoken";
import { Server } from "socket.io";
import { setIO } from "./config/socket.js";

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);
const io = new Server(server);

io.on("connection", (socket) => {

    const token =
        socket.handshake.query.token;

    try {

        const decoded =
            jwt.verify(
                token,
                process.env.JWT_SECRET
            );

        socket.userId =
            decoded.userId;

        socket.join(
            `user:${decoded.userId}`
        );

        setTimeout(() => {

            io.to(`user:${decoded.userId}`)
                .emit(
                    "room-test",
                    {
                        message:
                            "Room working"
                    }
                );

        }, 0);
        console.log(`User ${decoded.userId} connected via WebSocket`);

    } catch {

        socket.disconnect();
    }

    socket.emit(
        "test",
        {
            message: "Hello from server"
        }
    );
});

const startServer = async () => {
    try {
        await pool.connect();
        console.log("Connected to the database");

        server.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to connect to the database:", error);
        process.exit(1);
    }
};

startServer();

setIO(io);
