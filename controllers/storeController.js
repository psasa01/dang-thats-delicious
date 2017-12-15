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
