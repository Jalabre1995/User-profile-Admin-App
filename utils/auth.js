const crypto = require('crypto') ///Great module for hashing passwords///

const hashPassword = (plaintext) => {
    return crypto.createHmac('sha245', 'secret key')
    .update(plaintext)
    .digest('hex');
}

module.exports = {hashPassword}