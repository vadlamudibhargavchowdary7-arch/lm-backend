let io;

function initSocket(server) {
  io = require("socket.io")(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join", (userId) => {
      socket.join(userId);
    });
  });
}

function notify(userId, message) {
  if (!io) return;
  io.to(userId.toString()).emit("notification", message);
}

module.exports = { initSocket, notify };
