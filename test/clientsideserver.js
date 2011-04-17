var express = require('express')
	,app = express.createServer()
	,fs = require('fs');

app.configure(function(){
	app.use(express.methodOverride());
	app.use(express.bodyParser());
	app.use(app.router);
	app.use(express.static(__dirname + '/../lib'));
});

app.get('/', function(req, res){
	fs.readFile(__dirname+'/clientside.html', function (err, data) {
		res.send(data?data.toString():err);
	});
});

app.listen(3031);
console.log('listening on 3031');