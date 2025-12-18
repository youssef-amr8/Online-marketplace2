const express = require('express');
const router = express.Router();
const Category = require('../models/category');

router.get('/', async (req, res) => {
  const cats = await Category.find().sort({ name: 1 });
  res.json({ success: true, data: cats });
});

router.post('/', async (req, res) => {
  // you can protect this route for admin
  const cat = await Category.create(req.body);
  res.status(201).json({ success: true, data: cat });
});

module.exports = router;
