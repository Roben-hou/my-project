const express = require('express');
const router = express.Router();

// 模拟数据库（后续您可以换成 MySQL 连接）
let mockAssets = [
  { id: 1, name: '华夏成长混合', type: '基金', amount: 10000, value: 15500 },
  { id: 2, name: '招商银行储蓄卡', type: '活期', amount: 1, value: 60000 }
];

// 初始化假数据id
let nextId = 3;

// 1. 获取所有资产记录 (Read)
router.get('/', (req, res) => {
  // 未来可用 mysql2 驱动查询: connection.query('SELECT * FROM assets', ...)
  res.json({
    success: true,
    data: mockAssets
  });
});

// 2. 添加资产 (Create)
router.post('/', (req, res) => {
  const { name, type, amount, value } = req.body;
  if (!name || value === undefined) {
    return res.status(400).json({ success: false, message: '资产名称和市值不能为空' });
  }

  const newAsset = { id: nextId++, name, type, amount, value };
  mockAssets.push(newAsset);

  res.status(201).json({ success: true, data: newAsset });
});

// 3. 删除资产 (Delete)
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const initialLength = mockAssets.length;
  mockAssets = mockAssets.filter(item => item.id !== parseInt(id));

  if (mockAssets.length < initialLength) {
    res.json({ success: true, message: '删除成功' });
  } else {
    res.status(404).json({ success: false, message: '找不到该资产' });
  }
});

module.exports = router;
