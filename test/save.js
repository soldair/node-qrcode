var QRCode = require(__dirname+'/../qrcode')
	, fs = require('fs')
	, util = require('util');

var path = './tmp.png';
	
QRCode.save(path,'life of the party bros',function(error,written){
	if(error) {
		console.log(error);
	} else {
		util.print(written == (fs.statSync(path)||{}).size?"PASS: written should be to the correct file\n":"FAIL: file should be written size\n");
		fs.unlinkSync(path);
	}
});
