// socket-test.js

import { io } from "socket.io-client";

const socket = io("http://localhost:5000", {
    query: {
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJSb2xlIjoiYWRtaW4iLCJpYXQiOjE3ODEwOTQ1NTYsImV4cCI6MTc4MTA5NTQ1Nn0.nYer8nKxl-hDWJPglX60BzR5Yfacxm9thEUrSnzMW4M"
    }
});

socket.on("connect", () => {
    console.log("Connected:", socket.id);
});

socket.onAny(
    (event, data) => {

        console.log(
            "EVENT:",
            event
        );

        console.log(data);
    }
);

