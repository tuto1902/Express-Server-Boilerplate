/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    env = process.env.NODE_ENV || 'development',
    config = require('../../config/config')[env],
    Schema = mongoose.Schema;

/**
 * OAuthClient Schema
 */
var OAuthClientSchema = new Schema({
    name: String,
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    clientKey: String,
    clientSecret: String
});

mongoose.model('OAuthClient', OAuthClientSchema);
