const express = require('express');
const { list, getOne, create, update, remove } = require('../controllers/postController');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/', list);
router.get('/:id', getOne);
router.post('/', requireAuth, create);
router.put('/:id', requireAuth, update);
router.delete('/:id', requireAuth, remove);

module.exports = router;
