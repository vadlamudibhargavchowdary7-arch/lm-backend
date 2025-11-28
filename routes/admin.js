const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');
const adminController = require('../controllers/adminController');

// GET ALL PENDING USER SIGNUPS
router.get('/pending-users', auth, role(['admin']), adminController.getPendingUsers);

// APPROVE USER SIGNUP
router.post('/users/:id/approve', auth, role(['admin']), adminController.approveUser);

// REJECT USER SIGNUP
router.post('/users/:id/reject', auth, role(['admin']), adminController.rejectUser);

// GET ALL POLICIES
router.get('/policies', auth, role(['admin']), adminController.listPolicies);

// CREATE POLICY
router.post('/policies', auth, role(['admin']), adminController.createPolicy);

// UPDATE POLICY
router.put('/policies/:id', auth, role(['admin']), adminController.updatePolicy);

// DELETE POLICY
router.delete('/policies/:id', auth, role(['admin']), adminController.deletePolicy);

module.exports = router;
