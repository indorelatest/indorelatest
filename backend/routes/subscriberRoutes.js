const express = require('express');
const router = express.Router();
const { subscribe, getAllSubscribers, unsubscribe } = require('../controllers/subscriberController');

router.post('/', subscribe);
router.get('/', getAllSubscribers);
router.delete('/:email', unsubscribe);

module.exports = router;
