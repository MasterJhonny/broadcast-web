const address = require('address');

module.exports = {
    appConfig: {
        host: address.ip(),
        port: 8080
    }
}