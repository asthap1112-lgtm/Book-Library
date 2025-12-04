const express = require('express');
const router = express.Router();
const auth = require('./auth');
const Resource =require('./resource1');
const { route } = require('./book');
const { populate } = require('./book1');


router.get('/', async (req, res) => {
    try{
        const{ title,descrpition,category,status,amount} = req.body;
        if(!title) return res.status(400).json({message: "Title is required"});
        const resources = new Resource({
            title,
            descrpition,
            category,
            status,
            amount,
            createdBy: req.user._id,
        });
        await resources.save();
        res.status(201).json({ resources});
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
router.get('/', auth, async (req, res) => {
    try {
        const {category,status,mine ,page = 1,limit = 20} = req.query;
        const filter = {};
        if(category) filter.category = category;
        if(status) filter.status = status;
        if(mine === 'true') filter.createdBy = req.user._id;
        const resources = await Resource.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        limit(Number(limit))
        populate('createdBy', 'username email');
        res.json(resources);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
router.get('/:id', auth, async (req, res) => {
    try {
        const resource = await Resource.findById(req.params.id).populate('createdBy', 'username email');
        if (!resource) return res.status(404).json({ message: 'Resource not found' });
        res.json(resource);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
router.put('/:id', auth, async (req, res) => {
    try {
        const resource = await Resource.findById(req.params.id);
        if (!resource) return res.status(404).json({ message: 'Resource not found' });

        if (!resource.createdBy.equals(req.user._id)) {
            return res.status(403).json({ message: 'Unauthorized' });
        }
        const updates = ['title','description','category','status','amount'];
    updates.forEach(field => {
      if (req.body[field] !== undefined) resource[field] = req.body[field];
    });

    await resource.save();
    res.json(resource);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});
router.delete('/:id', auth, async (req, res) => {
    try {
        const resource = await Resource.findById(req.params.id);
        if (!resource) return res.status(404).json({ message: 'Resource not found' });      
        if (!resource.createdBy.equals(req.user._id)) {
            return res.status(403).json({ message: 'Unauthorized' });
        }
        await resource.remove();
        res.json({ message: 'Resource deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
module.exports = router;

