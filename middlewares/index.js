exports.errorHandler = function(err, req, res, next) {
    res.status(err.status || 500);
    res.send({errors: err});
};
