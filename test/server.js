var QRCode = require(__dirname+'/../qrcode')
	, connect = require('connect');
	
function testQRCode(req, res) {
	res.writeHead(200, { 'Content-Type': 'text/html' });
	console.log(req);
	QRCode.toDataURL('test testing and stuff!',function(err,url){
		if(err) console.log('error: '+err);
		res.end("<!DOCTYPE html/><html><head><title>node-qrcode</title></head><body><img src='"+url+"'/></body></html>");
	});
}

connect.createServer(testQRCode).listen(3030);
console.log('test server started on port 3030');