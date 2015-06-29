module.exports = REST;

function REST(core, express) {
  express.get('/api/dashboard', function (req, res) {
    res.send('Hello World!');
  });
}

REST.prototype = {};