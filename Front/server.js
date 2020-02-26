var express = require('express');
var app = express();
var morgan = require('morgan');
var bodyParser = require('body-parser');
var cors = require('cors');

var allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if('OPTIONS' == req.method)
      res.send(200);
  else
      next();
};

app.use(allowCrossDomain);

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());
app.use(cors({credentials: true, origin: 'http://localhost:8080'}));

app.use(express.static('./dist/sampleICO'));

app.all('/*', function(req, res, next) {
  res.sendFile('./dist/sampleICO/index.html', { root: __dirname });
});

app.set('port', process.env.PORT || 8080);

app.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});