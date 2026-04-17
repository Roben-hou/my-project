const express = require('express');
const cors = require('cors');
const assetsRouter = require('./routes/assets');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件配置
app.use(cors()); // 允许跨域请求（因为前端 Vue 在 5173 端口运行）
app.use(express.json()); // 解析 JSON 格式的请求体

// 路由挂载
app.use('/api/assets', assetsRouter);

// 全局测试路由
app.get('/', (req, res) => {
  res.send('理财系统 Node.js (Express) 后端服务已成功启动！');
});

// 统一错误处理
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: '服务器内部出现错误，请检查日志。' });
});

app.listen(PORT, () => {
  console.log(`\n==========================================`);
  console.log(`🚀 后端服务运行中: http://localhost:${PORT}`);
  console.log(`==========================================\n`);
  console.log(`您可以测试访问 API: http://localhost:${PORT}/api/assets\n`);
});
