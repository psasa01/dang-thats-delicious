const mongoose = require('mongoose');
const Store = mongoose.model('Store');

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

exports.createStore = async(req, res) => {
  const store = await (new Store(req.body)).save();
  req.flash('success', `You succesfully saved the ${store.name} store!`);
  res.redirect(`/store/${store.slug}`);
}

exports.getStores = async(req, res) => {
  const stores = await Store.find();
  res.render('stores', {
    title: 'Stores',
    stores
  });
}

exports.editStore = async(req, res) => {
  const store = await Store.findOne({
    _id: req.params.id
  });

  res.render('editStore', {
    title: 'Edit Store',
    store
  })
}

exports.updateStore = async(req, res) => {
  const store = await Store.findOneAndUpdate({
    _id: req.params.id
  }, req.body, {
    new: true,
    runValidators: true
  }).exec();
  req.flash('success', `Successfully updated the store. <a href="/store/${store.slug}">View <strong>${store.name}</strong> store</a>`);
  res.redirect(`/store/${store._id}/edit`);
}
