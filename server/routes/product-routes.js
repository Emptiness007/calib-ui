const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();
const CONFIG_PATH = path.join(__dirname, '../config/product-data.json');

// ==================== POST запросы ====================

// POST /api/config/products - добавить новый продукт
router.post('/products', async (req, res) => {
  try {
    const { nameFull, parts = [] } = req.body;

    if (!nameFull) {
      return res.status(400).json({ error: 'nameFull is required' });
    }

    const data = await fs.readFile(CONFIG_PATH, 'utf8');
    const config = JSON.parse(data);

    const newProduct = {
      id: `sec_${uuidv4().replace(/-/g, '').substring(0, 8)}`,
      nameFull,
      parts
    };

    config.product.push(newProduct);
    await fs.writeFile(CONFIG_PATH, JSON.stringify(config, null, 2));

    res.status(201).json({ message: 'Product added successfully', product: newProduct });
  } catch (error) {
    res.status(500).json({ error: 'Failed to write config file' });
  }
});

// POST /api/config/products/:productId/parts - добавить часть в продукт
router.post('/products/:productId/parts', async (req, res) => {
  try {
    const data = await fs.readFile(CONFIG_PATH, 'utf8');
    const config = JSON.parse(data);
    const product = config.product.find(p => p.id === req.params.productId);

    if (product) {
      const newPart = {
        ...req.body,
        id: `item_${uuidv4().replace(/-/g, '').substring(0, 8)}`
      };

      product.parts.push(newPart);
      await fs.writeFile(CONFIG_PATH, JSON.stringify(config, null, 2));
      res.status(201).json({ message: 'Part added successfully', part: newPart });
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to write config file' });
  }
});

// ==================== PUT запросы ====================

// PUT /api/config/products/:id - обновить продукт
router.put('/products/:id', async (req, res) => {
  try {
    const data = await fs.readFile(CONFIG_PATH, 'utf8');
    const config = JSON.parse(data);
    const productIndex = config.product.findIndex(p => p.id === req.params.id);

    if (productIndex !== -1) {
      config.product[productIndex] = { ...config.product[productIndex], ...req.body, id: req.params.id };
      await fs.writeFile(CONFIG_PATH, JSON.stringify(config, null, 2));
      res.json({ message: 'Product updated successfully', product: config.product[productIndex] });
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to write config file' });
  }
});

// PUT /api/config/products/:productId/parts/:id - обновить часть
router.put('/products/:productId/parts/:id', async (req, res) => {
  try {
    const data = await fs.readFile(CONFIG_PATH, 'utf8');
    const config = JSON.parse(data);
    const product = config.product.find(p => p.id === req.params.productId);

    if (product) {
      const partIndex = product.parts.findIndex(p => p.id === req.params.id);

      if (partIndex !== -1) {
        product.parts[partIndex] = { ...product.parts[partIndex], ...req.body, id: req.params.id };
        await fs.writeFile(CONFIG_PATH, JSON.stringify(config, null, 2));
        res.json({ message: 'Part updated successfully', part: product.parts[partIndex] });
      } else {
        res.status(404).json({ error: 'Part not found' });
      }
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to write config file' });
  }
});

// ==================== DELETE запросы ====================

// DELETE /api/config/products/:id - удалить продукт
router.delete('/products/:id', async (req, res) => {
  try {
    const data = await fs.readFile(CONFIG_PATH, 'utf8');
    const config = JSON.parse(data);
    const productIndex = config.product.findIndex(p => p.id === req.params.id);

    if (productIndex !== -1) {
      const deletedProduct = config.product.splice(productIndex, 1)[0];
      await fs.writeFile(CONFIG_PATH, JSON.stringify(config, null, 2));
      res.json({ message: 'Product deleted successfully', product: deletedProduct });
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to write config file' });
  }
});

// DELETE /api/config/products/:productId/parts/:id - удалить часть
router.delete('/products/:productId/parts/:id', async (req, res) => {
  try {
    const data = await fs.readFile(CONFIG_PATH, 'utf8');
    const config = JSON.parse(data);
    const product = config.product.find(p => p.id === req.params.productId);

    if (product) {
      const partIndex = product.parts.findIndex(p => p.id === req.params.id);

      if (partIndex !== -1) {
        const deletedPart = product.parts.splice(partIndex, 1)[0];
        await fs.writeFile(CONFIG_PATH, JSON.stringify(config, null, 2));
        res.json({ message: 'Part deleted successfully', part: deletedPart });
      } else {
        res.status(404).json({ error: 'Part not found' });
      }
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to write config file' });
  }
});

module.exports = router;
