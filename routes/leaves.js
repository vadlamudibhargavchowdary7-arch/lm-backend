const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');
const leaveController = require('../controllers/leaveController');

// APPLY FOR LEAVE (employee/manager)
router.post('/apply', auth, role(['employee', 'manager']), leaveController.applyLeave);

// MANAGER → VIEW PENDING LEAVES
router.get('/manager/pending', auth, role(['manager']), leaveController.managerPending);

// MANAGER → APPROVE / REJECT
router.post('/manager/:id/decision', auth, role(['manager']), leaveController.managerDecision);

// ADMIN → VIEW ALL LEAVES
router.get('/all', auth, role(['admin']), leaveController.listAll);

// ADMIN → FINAL APPROVAL
router.post('/:id/admin-decision', auth, role(['admin']), leaveController.adminDecision);

module.exports = router;
