const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();
const CONFIG_PATH = path.join(__dirname, '../config/izdelie-data.json');

// ==================== GET запросы ====================

// GET /api/config/izdelie - получить всю конфигурацию
router.get('/', async (req, res) => {
  try {
    const data = await fs.readFile(CONFIG_PATH, 'utf8');
    res.json(JSON.parse(data));
  } catch (error) {
    res.status(500).json({ error: 'Failed to read config file' });
  }
});

// GET /api/config/izdelie/sections - получить все разделы
router.get('/sections', async (req, res) => {
  try {
    const data = await fs.readFile(CONFIG_PATH, 'utf8');
    const config = JSON.parse(data);
    res.json(config.sections);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read config file' });
  }
});

// GET /api/config/izdelie/sections/:id - получить раздел по ID
router.get('/sections/:id', async (req, res) => {
  try {
    const data = await fs.readFile(CONFIG_PATH, 'utf8');
    const config = JSON.parse(data);
    const section = config.sections.find(s => s.id === req.params.id);

    if (section) {
      res.json(section);
    } else {
      res.status(404).json({ error: 'Section not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to read config file' });
  }
});

// GET /api/config/izdelie/sections/:id/izdelies - получить изделия из раздела
router.get('/sections/:id/izdelies', async (req, res) => {
  try {
    const data = await fs.readFile(CONFIG_PATH, 'utf8');
    const config = JSON.parse(data);
    const section = config.sections.find(s => s.id === req.params.id);

    if (section) {
      res.json(section.izdelies);
    } else {
      res.status(404).json({ error: 'Section not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to read config file' });
  }
});

// GET /api/config/izdelie/izdelie/:id - получить изделие по ID
router.get('/izdelie/:id', async (req, res) => {
  try {
    const data = await fs.readFile(CONFIG_PATH, 'utf8');
    const config = JSON.parse(data);
    const izdelie = config.sections.flatMap(s => s.izdelies).find(i => i.id === req.params.id);

    if (izdelie) {
      res.json(izdelie);
    } else {
      res.status(404).json({ error: 'Izdelie not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to read config file' });
  }
});

// ==================== POST запросы ====================

// POST /api/config/izdelie/sections - добавить новый раздел
router.post('/sections', async (req, res) => {
  try {
    const { nameShort, nameFull, izdelies = [] } = req.body;

    if (!nameShort || !nameFull) {
      return res.status(400).json({ error: 'nameShort and nameFull are required' });
    }

    const data = await fs.readFile(CONFIG_PATH, 'utf8');
    const config = JSON.parse(data);

    const newSection = {
      id: `sec_${uuidv4().replace(/-/g, '').substring(0, 8)}`,
      nameShort,
      nameFull,
      izdelies
    };

    config.sections.push(newSection);
    await fs.writeFile(CONFIG_PATH, JSON.stringify(config, null, 2));

    res.status(201).json({ message: 'Section added successfully', section: newSection });
  } catch (error) {
    res.status(500).json({ error: 'Failed to write config file' });
  }
});

// POST /api/config/izdelie/sections/:sectionId/izdelies - добавить изделие в раздел
router.post('/sections/:sectionId/izdelies', async (req, res) => {
  try {
    const data = await fs.readFile(CONFIG_PATH, 'utf8');
    const config = JSON.parse(data);
    const section = config.sections.find(s => s.id === req.params.sectionId);

    if (section) {
      const newIzdelie = {
        ...req.body,
        id: `item_${uuidv4().replace(/-/g, '').substring(0, 8)}`
      };

      section.izdelies.push(newIzdelie);
      await fs.writeFile(CONFIG_PATH, JSON.stringify(config, null, 2));
      res.status(201).json({ message: 'Izdelie added successfully', izdelie: newIzdelie });
    } else {
      res.status(404).json({ error: 'Section not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to write config file' });
  }
});

// ==================== PUT запросы ====================

// PUT /api/config/izdelie/sections/:id - обновить раздел
router.put('/sections/:id', async (req, res) => {
  try {
    const data = await fs.readFile(CONFIG_PATH, 'utf8');
    const config = JSON.parse(data);
    const sectionIndex = config.sections.findIndex(s => s.id === req.params.id);

    if (sectionIndex !== -1) {
      config.sections[sectionIndex] = { ...config.sections[sectionIndex], ...req.body, id: req.params.id };
      await fs.writeFile(CONFIG_PATH, JSON.stringify(config, null, 2));
      res.json({ message: 'Section updated successfully', section: config.sections[sectionIndex] });
    } else {
      res.status(404).json({ error: 'Section not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to write config file' });
  }
});

// PUT /api/config/izdelie/sections/:sectionId/izdelies/:id - обновить изделие
router.put('/sections/:sectionId/izdelies/:id', async (req, res) => {
  try {
    const data = await fs.readFile(CONFIG_PATH, 'utf8');
    const config = JSON.parse(data);
    const section = config.sections.find(s => s.id === req.params.sectionId);

    if (section) {
      const izdelieIndex = section.izdelies.findIndex(i => i.id === req.params.id);

      if (izdelieIndex !== -1) {
        section.izdelies[izdelieIndex] = { ...section.izdelies[izdelieIndex], ...req.body, id: req.params.id };
        await fs.writeFile(CONFIG_PATH, JSON.stringify(config, null, 2));
        res.json({ message: 'Izdelie updated successfully', izdelie: section.izdelies[izdelieIndex] });
      } else {
        res.status(404).json({ error: 'Izdelie not found' });
      }
    } else {
      res.status(404).json({ error: 'Section not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to write config file' });
  }
});

// ==================== DELETE запросы ====================

// DELETE /api/config/izdelie/sections/:id - удалить раздел
router.delete('/sections/:id', async (req, res) => {
  try {
    const data = await fs.readFile(CONFIG_PATH, 'utf8');
    const config = JSON.parse(data);
    const sectionIndex = config.sections.findIndex(s => s.id === req.params.id);

    if (sectionIndex !== -1) {
      const deletedSection = config.sections.splice(sectionIndex, 1)[0];
      await fs.writeFile(CONFIG_PATH, JSON.stringify(config, null, 2));
      res.json({ message: 'Section deleted successfully', section: deletedSection });
    } else {
      res.status(404).json({ error: 'Section not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to write config file' });
  }
});

// DELETE /api/config/izdelie/sections/:sectionId/izdelies/:id - удалить изделие
router.delete('/sections/:sectionId/izdelies/:id', async (req, res) => {
  try {
    const data = await fs.readFile(CONFIG_PATH, 'utf8');
    const config = JSON.parse(data);
    const section = config.sections.find(s => s.id === req.params.sectionId);

    if (section) {
      const izdelieIndex = section.izdelies.findIndex(i => i.id === req.params.id);

      if (izdelieIndex !== -1) {
        const deletedIzdelie = section.izdelies.splice(izdelieIndex, 1)[0];
        await fs.writeFile(CONFIG_PATH, JSON.stringify(config, null, 2));
        res.json({ message: 'Izdelie deleted successfully', izdelie: deletedIzdelie });
      } else {
        res.status(404).json({ error: 'Izdelie not found' });
      }
    } else {
      res.status(404).json({ error: 'Section not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to write config file' });
  }
});

module.exports = router;
