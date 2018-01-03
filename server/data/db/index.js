/**
 * Created by Martin on 2017/12/31.
 */

const userController = require('./user/controller_user');

const dbController = {
    user : userController,
};

module.exports = dbController;