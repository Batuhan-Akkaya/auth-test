const uid = require('uid2');
const mongoose = require('mongoose');
const {Schema} = mongoose;

const ApplicationSchema = new Schema({
    title: { type: String, required: true },
    oauth_id: { type: String, unique: true, default: () => uid(25) },
    oauth_secret: { type: String, unique: true, default: () => uid(42)},
    scope: [ { type: String } ]
});

const GrantCodeSchema = new Schema({
    code: { type: String, unique: true, default: () => uid(24)},
    application: { type: Schema.Types.ObjectId, ref: 'Application' },
    active: { type: Boolean, default: true }
});

const AccessTokenSchema = new Schema({
    token: { type: String, unique: true, default: () => uid(124)},
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    application: { type: Schema.Types.ObjectId, ref: 'Application' },
    grant: { type: Schema.Types.ObjectId, ref: 'GrantCode' },
    scope: [ { type: String }],
    expires: { type: Date, default: function(){
            const today = new Date();
            const length = 60; // Length (in minutes) of our access token
            return new Date(today.getTime() + length*60000);
        } },
    active: { type: Boolean, get: function(value) {
            if (expires < new Date() || !value) {
                return false;
            } else {
                return value;
            }
        }, default: true }
});

const Application = mongoose.model('Application', ApplicationSchema);
const GrantCode = mongoose.model('GrantCode', GrantCodeSchema);
const AccessToken = mongoose.model('AccessToken', AccessTokenSchema);

module.exports = {
    Application, GrantCode, AccessToken
};
