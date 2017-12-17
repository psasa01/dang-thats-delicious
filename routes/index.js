const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');
const {
  catchErrors
} = require('../handlers/errorHandlers');

// Do work here
router.get('/', catchErrors(storeController.getStores));
router.get('/stores', catchErrors(storeController.getStores));
router.get('/add', storeController.addStore);

router.post('/add',
  storeController.upload,
  catchErrors(storeController.resize),
  catchErrors(storeController.createStore)
);

router.post('/add/:id',
  storeController.upload,
  catchErrors(storeController.resize),
  catchErrors(storeController.updateStore)
);

router.get('/store/:slug', catchErrors(storeController.getStoreBySlug));

router.get('/store/:id/edit', catchErrors(storeController.editStore));
router.get('/store/:id/remove', catchErrors(storeController.deleteStore));
router.get('/store/:id/delete', catchErrors(storeController.removeStore));
router.get('/tags', storeController.getTags);
module.exports = router;
