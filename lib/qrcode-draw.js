/*
 * copyright 2010 Ryan Day
 * http://github.com/soldair/node-qrcode
 *
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * canvas example and fallback support example provided by Joshua Koo
 *	http://jabtunes.com/labs/qrcode.html
 *	Instant QRCode Mashup by Joshua Koo!
 *	as far as i can tell the page and the code on the page are public domain
 *	
 * original table example and library provided by Kazuhiko Arase
 *	http://d-project.googlecode.com/svn/trunk/misc/qrcode/js/
 */
if(typeof exports == 'undefined') exports = {};

var QRCodeLib = require(__dirname+'/qrcode.js')
	, util = {};

//client side compat
if(typeof QRCode != 'undefined') {
	QRCodeLib.QRCode = QRCode;
	QRCodeLib.QRErrorCorrectLevel = QRErrorCorrectLevel;
}
	
//export QRCodeDraw
var QRCodeDraw = module.exports = exports = {
	scale:4,
	defaultMargin:20,
	marginScaleFactor:5,
	draw:function(canvas,text,cb) {
		var level,error;
		
		this.QRLevel(text,function(t,l,e){
			text = t,level = l,error = e;
		});

		if(!level) {
			//if we are unable to find an appropriate qr level error out
			cb(error,canvas);
			return;
		}

		//create qr code!
		try{
			//NOTE i dont really know the effects of changing this error correct value 
			var qr = new QRCodeLib.QRCode(level, QRCodeLib.QRErrorCorrectLevel.H)
				, scale = this.scale||4
				, ctx = canvas.getContext('2d')
				, width = 0;

			qr.addData(text);
			qr.make();

			var margin = this.defaultMargin
			//elegant white space next to 
			if (scale * this.marginScaleFactor > margin) {
				margin = scale * this.marginScaleFactor;
			}
			var currenty = margin
			
			width = qr.getModuleCount()*scale + margin*2;

			util.resetCanvas(canvas,ctx,width);

			for (var r = 0; r < qr.getModuleCount(); r++) {
				var currentx = margin;
				for (var c = 0; c < qr.getModuleCount(); c++) {
					
					if (qr.isDark(r, c) ) {
						ctx.fillStyle = 'black';  
					} else {
						ctx.fillStyle = 'white';
					}
					ctx.fillRect (currentx, currenty, 1*scale, 1*scale);
					currentx += scale *1;
				}
				currenty += scale*1;
			}
		} catch (e) {
			error = e;
		}
		cb(error,canvas,width);
	},
	QRLevel:function(text,cb){
		var c = text.length, error, level = 0;
		
		if (c > 119) {
			if(this.errorBehavior.length == 'trim'){
				text = text.substr(0,119);
				level = 10; 
			} else {
				error = 'input string too long. max 119 length.';
			}
		} else if (c > 98) {
			level = 10;
		} else if (c > 84) {
			level = 9;
		} else if (c > 64) {
			level = 8;
		} else if (c > 58) {
			level = 7;
		} else if (c > 44) {
			level = 6;
		} else if (c > 34) {
			level = 5;
		} else if (c > 24) {
			level = 4;
		} else if (c > 14) {
			level = 3;
		} else if (c > 7) {
			level = 2;
		} else {
			level = 1;
		}
		
		if(cb) {
			cb(text,level,error);
		}
		return level;
	},
	// you may configure the error behavior for input string too long
	errorBehavior:{
		length:'trim'
	}
};



util.resetCanvas = function(canvas,ctx,width){
	ctx.clearRect(0,0,canvas.width,canvas.height);
	
	if(!canvas.style) canvas.style = {};
	canvas.style.height = canvas.height = width;//square!
	canvas.style.width = canvas.width = width;
	
	ctx.fillStyle = 'white'; 
	ctx.fillRect(0,0,canvas.width,canvas.height);
}

/*
//html version un-implemented

function draw_qrcode(text) {

	var qr = new QRCode(4, QRErrorCorrectLevel.H);
	
	qr.addData(text);
	qr.make();
	
	var qrhtml = $('#qrhtml');
	
	qrhtml.html("<table style='border-width: 0px; border-style: none; border-color: #0000ff; border-collapse: collapse;'>");
	
	for (var r = 0; r < qr.getModuleCount(); r++) {
	
	    qrhtml.append("<tr>");
	
	    for (var c = 0; c < qr.getModuleCount(); c++) {
	
	        if (qr.isDark(r, c) ) {
	            qrhtml.append("<td style='border-width: 0px; border-style: none; border-color: #0000ff; border-collapse: collapse; padding: 0; margin: 0; width: 2px; height: 2px; background-color: #000000;'/>");
	        } else {
	            qrhtml.append("<td style='border-width: 0px; border-style: none; border-color: #0000ff; border-collapse: collapse; padding: 0; margin: 0; width: 2px; height: 2px; background-color: #ffffff;'/>");
	        }
	
	    }
	
	    qrhtml.append("</tr>");
	
	}
	
	qrhtml.append("</table>");
}
*/
