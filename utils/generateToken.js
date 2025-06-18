const jwt = require('jsonwebtoken');
module.exports = (id, email) => {
    return jwt.sign({ _id: id, email }, process.env.JWT_SECRET);
};