var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');
var requestify = require('requestify');

var PORT = process.env.PORT || 3000;

var router = express.Router();

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: false })); // for parsing application/x-www-form-urlencoded
app.use(router);

app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
  next();
});

app.use(express.static(path.join(__dirname, 'public')));


router.get('/', function(req, res) {
	res.sendFile(path.join(__dirname, 'public/index.html'))
});

router.post('/', function (req, res, next) {
	var url = req.body.url || req.query.url;

	requestify.get(url, {
		headers: {
			'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
			'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36'
		},
		redirect: true
	})
		.then(function(response) {
		    // Get the response body
			return res.send(response.getBody());
			next();
		})
		.catch(function(err){
			console.log('Requestify Error', err);
			next(err);
		}); 
});

app.listen(PORT, function(){
	console.log('Server running at: ' + PORT);
});