/*
*copyright Ryan Day 2011
*
* Licensed under the MIT license:
*   http://www.opensource.org/licenses/mit-license.php
*
* this is the main server side application file for node-qrcode. 
* these exports use serverside canvas api methods for file IO and buffers
*
*/

var QRCodeDraw = require(__dirname+'/lib/qrcode-draw')
, Canvas = require('canvas')
, fs = require('fs')
, drawInstance = new QRCodeDraw();

//EXPORTS
/*
so i return an instance... this is a terrible api because it kinda blocks 
being able to do more than just extensions and the opperation of the qrcode
lib now alters the state of the object.. 
which is not an issue unless you need to read properties off of an object in a callback
*/
exports.QRCodeDraw = drawInstance;
/*
to make amends im adding the constriuctor to this object so extensions and instances can be made easily
this has to be done i dont like this name but backwards compat requires that the top object be an instance
*/
exports.QRCodeDrawConstructor = QRCodeDraw;

/*
* provide an api to return the max characters allowed for given dimensions, and miniumum error correction level
* the qr code library will always use the maximum error correction level for the given numbar of chars constrained by size
*/
exports.getMaxChars = function(minErrorCorrectionLevel,width,moduleWidth){
	//TODO THIS NEEDS TO WORK
};


// returns Canvas Object with qr code drawn on it
/*
* String text, optional Object options, Function callback
*/
var draw = exports.draw = function(text,options,cb){

	arguments = [].slice.call(arguments);
	cb = arguments.pop();
	if(typeof cb != 'function') {
		throw new TypeError('last arguement must be a function');
	}
	text = arguments.shift();
	options = arguments.shift()||{};
	
	//TODO add optional options argument before calback
	//TODO in order to be predictable i will provide an api that throws exceptions if the data cannot fit
	// in the specified width. from a design perspective qr codes with dynmic data cannot break layout
	//NOTE the width and height are determined from within the qr code lib and are not configurable from the outside yet
	drawInstance.draw(new Canvas(200,200),text,function(error,canvas){
		cb(error,canvas)
	});
};

//returns data uri for drawn qrcode png
exports.toDataURL = function(text,cb){
	draw(text,function(error,canvas){
		if(error) {
			cb(error,'');
		} else {
			canvas.toDataURL(cb);
		}
	});
}

//callback with bytes written to file 
exports.save = function(path,text,cb){
	draw(text,function(error,canvas){

		var fd,buf,fdAndBuf = function(){
			fs.write(fd, buf, 0, buf.length, 0, function(error,written){
				fs.close(fd);
				if(cb) cb(error,written);
			});
		};

		//run non dependent async calls at the same time ish
		canvas.toBuffer(function(error, _buf){
			if(error) return cb(error,0);
			
			buf = _buf
			if(fd) fdAndBuf();
		});

		fs.open(path, 'w', 0666, function(err,_fd){
			if(error) return cb(error,0);
			fd = _fd
			if(buf) fdAndBuf();
		});

	});
};


/*
this returns an array of points that have either a 0 or 1 value representing 0 for light and 1 for dark
these values include points in the white edge of the qrcode because that edge is actually part of the spec  
*/
exports.drawBits = function(text,cb){
	//TODO THIS NEEDS TO WORK
}