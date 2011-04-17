var QRCodeDraw = require(__dirname+'/lib/qrcode-draw')
	, Canvas = require('canvas')
	, fs = require('fs');

//EXPORTS
exports.QRCodeDraw = QRCodeDraw;

// returns Canvas Object with qr code drawn on it
var draw = exports.draw = function(text,cb){
	//NOTE the width and height are determined from within the qr code lib and are not configurable from the outside yet
	QRCodeDraw.draw(new Canvas(200,200),text,function(error,canvas){
		cb(error,canvas)
	});
}

//returns data uri for drawn qrcode png
var dataURL = exports.toDataURL = function(text,cb){
	draw(text,function(error,canvas){
		if(error) {
			cb(error,'');
		} else {
			canvas.toDataURL(cb);
		}
	});
}

//returns bytes written to file 
exports.save = function(path,text,cb){
	draw(text,function(error,canvas){

		var fd,buf,fdAndBuf = function(){
			fs.write(fd, buf, 0, buf.length, 0, function(err,written){
				fs.close(fd);
				cb(err,written);
			});
		};

		//run async calls at the same time ish so they can take advantage of the others idle time
		canvas.toBuffer(function(err, _buf){
			if(err) return cb(err,0);
			
			buf = _buf
			if(fd) fdAndBuf();
		});

		fs.open(path, 'w', 0666, function(err,_fd){
			if(err) return cb(err,0);
			fd = _fd
			if(buf) fdAndBuf();
		});

	});
}
