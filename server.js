const express = require("express");
const multer = require("multer");
const fs = require("fs");

const app = express();
const port = process.env.PORT || 3000;

// 存视频的目录
const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// 配置上传
const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});
const upload = multer({ storage });

// 静态文件服务（返回视频）
app.use("/uploads", express.static(uploadDir));

// 上传接口
app.post("/upload", upload.single("video"), (req, res) => {
  res.json({ path: "/uploads/" + req.file.filename });
});

// 视频列表接口
app.get("/list", (req, res) => {
  fs.readdir(uploadDir, (err, files) => {
    if (err) return res.json([]);
    res.json(files.map(f => "/uploads/" + f));
  });
});

app.listen(port, () => console.log(`Server running on ${port}`));
