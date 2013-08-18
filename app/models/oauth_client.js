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
    clientKey: String,
    clientSecret: String
});

/**
 * Statics
 */
OAuthClientSchema.statics = {
    load: function(id, cb) {
        this.findOne({
            _id: id
        }).exec(cb);
    }
};

OAuthClientSchema.methods = {
    /**
     * Return a unique identifier with the given `len`.
     *
     *     uid(10);
     *     // => "FDaS435D2z"
     *
     * @param {Number} len
     * @return {String}
     * @api private
     */
    uid: function(len) {
        var buf = [],
        chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
        charlen = chars.length;

        for (var i = 0; i < len; ++i) {
            buf.push(chars[this.getRandomInt(0, charlen - 1)]);
        }

        return buf.join('');
    },

    /**
     * Retrun a random int, used by `uid()`
     *
     * @param {Number} min
     * @param {Number} max
     * @return {Number}
     * @api private
     */
    getRandomInt: function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
};

/**
 * Pre-save hook
 */
OAuthClientSchema.pre('save', function(next) {
    if (!this.isNew) return next();
    this.clientKey = this.uid(16);
    this.clientSecret = this.uid(32);
    next();
});

mongoose.model('OAuthClient', OAuthClientSchema);
