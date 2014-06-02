exports.index = function (req, res) {
    res.render('index');
};
exports.form = function (req, res) {
    res.render('form');
};
exports.filter = function (req, res) {
    res.render('filter');
};
exports.csrf = function (req, res) {
    res.render('csrf');
};
exports.token = function (req, res) {
    if (req.header('X-Requested-With') !== 'XMLHTTPRequest') return;

    var json;
    if (req.session._csrf === req.header('X-XSRF-TOKEN')) {
        json = JSON.stringify({
            status: true,
            message: 'トークンが一致しました'
        });
    } else {
        json = JSON.stringify({
            status: false,
            message: 'トークンが一致しませんでした'
        });
    }
    res.send(")]}',\n"+json);
};