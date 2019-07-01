const ConnectRoles = require('connect-roles');

module.exports = function (app) {
    const userAuthorisation = new ConnectRoles({
        failureHandler: function (req, res, action) {
            const accept = req.headers.accept || '';
            res.status(403);
            if (~accept.indexOf('html')) {
                res.render('access-denied', {action: action});
            } else {
                res.send('Access Denied - You don\'t have permission to: ' + action);
            }
        }
    });

    app.use(userAuthorisation.middleware());

    userAuthorisation.use('access_private', function (req) {
        console.log(req.payload.role);
        if (req.payload.role === 'admin')
            return true;
    });
    userAuthorisation.use('access_profile', function (req) {
        console.log(req.payload.role);
        if (req.payload.role === 'user')
            return true;
    });

    return userAuthorisation
};
