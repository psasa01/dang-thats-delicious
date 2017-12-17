const mongoose = require('mongoose');
const Store = mongoose.model('Store');
const multer = require('multer');
const jimp = require('jimp');
const uuid = require('uuid');

const multerOptions = {
  storage: multer.memoryStorage(),
  fileFilter(req, file, next) {
    const isPhoto = file.mimetype.startsWith('image/');
    if (isPhoto) {
      next(null, true);
    } else {
      next({
        message: 'That filetype is not allowed!'
      }, false);
    }
  }
};

exports.homePage = (req, res) => {
  res.render('index', {
    title: 'Index'
  });
};

exports.addStore = (req, res) => {
  res.render('editStore', {
    title: 'Add Store'
  });
};

exports.upload = multer(multerOptions).single('photo');

exports.resize = async(req, res, next) => {
  // if there is no new file to resize
  if (!req.file) {
    next();
    return;
  }
  const extension = req.file.mimetype.split('/')[1];
  req.body.photo = `${uuid.v4()}.${extension}`;
  // now resize
  const photo = await jimp.read(req.file.buffer);
  await photo.resize(800, jimp.AUTO);
  await photo.write(`./public/uploads/${req.body.photo}`);
  // after writing to filesystem, keep going!
  next();
};

exports.createStore = async(req, res) => {
  const store = await (new Store(req.body)).save();
  req.flash('success', `You succesfully saved the ${store.name} store!`);
  res.redirect(`/store/${store.slug}`);
};

exports.getStores = async(req, res) => {
  const stores = await Store.find();
  res.render('stores', {
    title: 'Stores',
    stores
  });
};

exports.getStoreBySlug = async(req, res, next) => {
  const store = await Store.findOne({
    slug: req.params.slug
  });
  if (!store) return next();

  res.render('store', {
    store,
    title: store.name

  });
}

exports.editStore = async(req, res) => {
  const store = await Store.findOne({
    _id: req.params.id
  });

  res.render('editStore', {
    title: 'Edit Store',
    store
  });
};

exports.updateStore = async(req, res) => {
  const store = await Store.findOneAndUpdate({
    _id: req.params.id
  }, req.body, {
    new: true,
    runValidators: true
  }).exec();
  req.flash('success', `Successfully updated the store. <a href="/store/${store.slug}">View <strong>${store.name}</strong> store</a>`);
  res.redirect(`/store/${store._id}/edit`);
};

exports.getTags = (req, res) => {
  res.render('index', {
    title: 'get Tags'
  });
};

exports.deleteStore = async(req, res) => {
  const store = await Store.findOneAndRemove({
    _id: req.params.id
  });

  req.flash('error', 'SUCCESSSSS!')
  res.redirect('/');
};
