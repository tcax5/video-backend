const express = require("express");
const multer = require("multer");
const { MongoClient } = require("mongodb");

const app = express();
const port = process.env.PORT || 3000;

// MongoDB 连接
const client = new MongoClient(process.env.MONGO_URI);
let videosCollection;

client.connect().then(() => {
  const db = client.db("myvideo"); // 数据库名字
  videosCollection = db.collection("videos"); // 表
  console.log("✅ MongoDB connected!");
});

// 上传配置
const upload = multer({ dest: "uploads/" });

// 根路由
app.get("/", (req, res) => {
  res.send("✅ Video backend is running with MongoDB!");
});

// 上传接口
app.post("/upload", upload.single("video"), async (req, res) => {
  const videoInfo = {
    filename: req.file.filename,
    originalName: req.file.originalname,
    uploadDate: new Date(),
  };

  await videosCollection.insertOne(videoInfo);

  res.json({ message: "Upload successful", video: videoInfo });
});

// 视频列表
app.get("/list", async (req, res) => {
  const videos = await videosCollection.find().toArray();
  res.json(videos);
});

// 启动服务
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
