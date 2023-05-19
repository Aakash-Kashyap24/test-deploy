const mongoose = require('mongoose');
const Document = require('./Document');
const dotenv = require('dotenv');

dotenv.config({
  path:'config/config.env'
})
// const DB_URL = 'mongodb+srv://akashuiuxd:XdRrxARhe4bKheFG@cluster0.w4s6kia.mongodb.net/?retryWrites=true&w=majority';


mongoose
  .connect(process.env.DB_URL, { useNewUrlParser: true })
  .then((data) => {
    console.log(`MongoDB connected with server ${data.connection.host}`);
  })
  .catch((error) => {
    console.error(error);
  });

const port = process.env.PORT || 3000;

const io = require("socket.io")(port, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.on("get-document", async (documentId) => {
    const document = await findOrCreateDocument(documentId);
    socket.join(documentId);
    socket.emit("load-document", document.data);

    socket.on("send-changes", (delta) => {
      socket.broadcast.to(documentId).emit("recieve-changes", delta);
    });
    socket.on("save-document", async (data) => {
      await Document.findByIdAndUpdate(documentId, { data });
    });
  });
});

async function findOrCreateDocument(id) {
  if (id == null) return;

  const document = await Document.findById(id);
  if (document) return document;
  return await Document.create({ _id: id, data: defaultValue });
}

