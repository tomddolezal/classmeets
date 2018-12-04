'use strict';

const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://tom:123@cluster0-shard-00-00-xp7uj.mongodb.net:27017,cluster0-shard-00-01-xp7uj.mongodb.net:27017,cluster0-shard-00-02-xp7uj.mongodb.net:27017/classmeets?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true', { useNewUrlParser: true, useCreateIndex: true});

module.exports = {
	mongoose
}