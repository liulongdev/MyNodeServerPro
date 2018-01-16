/**
 * Created by Martin on 2017/12/31.
 */

const userController = require('./user/controller_user');
const wyNewController = require('./wy-new/controller_wy_new');
const dbController = {
    user : userController,
    wyNew : wyNewController,
};

module.exports = dbController;