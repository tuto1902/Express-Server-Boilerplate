/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    env = process.env.NODE_ENV || 'development',
    config = require('../../config/config')[env],
    Schema = mongoose.Schema;

/**
 * RequestToken Schema
 */
var RequestTokenSchema = new Schema({
    code: String,
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    client: {
        type: Schema.ObjectId,
        ref: 'OAuthClient'
    }
});

mongoose.model('RequestToken', RequestTokenSchema);
