var express = require('express')
	,app = express.createServer()
	,fs = require('fs');

app.get('/', function(req, res){
	fs.readFile(__dirname+'/clientside.html', function (err, data) {
		res.send(data?data.toString():err);
	});
});

app.use(express.staticProvider(__dirname + '/../lib'));
app.listen(3031);