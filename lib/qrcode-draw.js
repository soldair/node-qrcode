/*
 * copyright 2010 Ryan Day
 * http://github.com/soldair/node-qrcode
 *
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * canvas example and fallback support example provided by Joshua Koo
 *	http://jabtunes.com/labs/qrcode.html
 *	"Instant QRCode Mashup by Joshua Koo!"
 *	as far as i can tell the page and the code on the page are public domain - Ryan
 *	
 * original table example and library provided by Kazuhiko Arase
 *	http://d-project.googlecode.com/svn/trunk/misc/qrcode/js/
 */

var QRCodeLib = require(__dirname+'/qrcode.js')
,QRVersionCapacityTable = require(__dirname+'/qrcapacitytable.js');

//client side compat. set global assignment to local expected values.
if(typeof exports == 'undefined') exports = {};
if(typeof QRCode != 'undefined') {
	QRCodeLib.QRCode = QRCode;
	QRCodeLib.QRErrorCorrectLevel = QRErrorCorrectLevel;
	QRVersionCapacityTable = _QRVersionCapacityTable
}
	
//export QRCodeDraw
var QRCodeDraw = module.exports = exports = {
	scale:4,
	defaultMargin:20,
	marginScaleFactor:5,
	// you may configure the error behavior for input string too long
	errorBehavior:{
		length:'trim'
	},
	color:{
		dark:'black',
		light:'white'
	},
	defaultErrorCorrectLevel:QRCodeLib.QRErrorCorrectLevel.H,
	QRErrorCorrectLevel:QRCodeLib.QRErrorCorrectLevel,
	draw:function(canvas,text/*,errorCorrectLevel,cb*/) {
		var cb,errorCorrectLevel
		,level,error;

		//argument processing
		if(arguments.length == 2 || typeof arguments[arguments.length-1] != 'function') {
			//enforce callback api just in case the processing can be made async in the future
			// or support proc open to libqrencode
			throw new Error('callback required as last argument');
		}
		
		cb = arguments[arguments.length-1]; 
		
		if(arguments.length > 3){
			errorCorrectLevel = arguments[2];
		}
		
		//this interface kinda sucks - there is very small likelyhood of this ever being async
		this.QRLevel(text,errorCorrectLevel,function(e,t,l,ec){
			text = t,level = l,error = e,errorCorrectLevel = ec;
		});

		if(!level) {
			//if we are unable to find an appropriate qr level error out
			cb(error,canvas);
			return;
		}

		//create qrcode!
		try{
			
			var qr = new QRCodeLib.QRCode(level, errorCorrectLevel)
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
			this.resetCanvas(canvas,ctx,width);
			
			for (var r = 0; r < qr.getModuleCount(); r++) {
				var currentx = margin;
				for (var c = 0; c < qr.getModuleCount(); c++) {
					if (qr.isDark(r, c) ) {
						ctx.fillStyle = this.color.dark;
						ctx.fillRect (currentx, currenty, 1*scale, 1*scale);
					} else if(this.color.light){
						//if falsy configured color
						ctx.fillStyle = this.color.light;
						ctx.fillRect (currentx, currenty, 1*scale, 1*scale);
					}
					currentx += scale *1;
				}
				currenty += scale*1;
			}
		} catch (e) {
			error = e;
		}
		
		cb(error,canvas,width);
	},
	//changed the interface here
	QRLevel:function(text,errorCorrectLevel,cb){
		var c = text.length
		, error
		, level = 0
		,errorCorrectLevel = this.QRErrorCorrectLevel[errorCorrectLevel]||this.defaultErrorCorrectLevel
		,errorCorrectIndex = [1,0,3,2]//fix odd mapping to order in table
		,keys = ['L','M','Q','H'];


		//TODO ADD THROW FOR INVALID errorCorrectLevel?
		
		for(var i=0,j=QRVersionCapacityTable.length;i<j;i++) {
			if(c < QRVersionCapacityTable[i][errorCorrectIndex[errorCorrectLevel]]){
				level = i+1;
				break;
			}
		}

		//console.log('error correct level: '+keys[errorCorrectIndex[errorCorrectLevel]]);
		//console.log('qr code level: '+level);

		if(!level){
			if(this.errorBehavior.length == 'trim'){
				text = text.substr(0,QRVersionCapacityTable[QRVersionCapacityTable.length-1][errorCorrectIndex[errorCorrectLevel]]);
				level = QRVersionCapacityTable.length; 
			} else {
				error = new Error('input string too long for error correction '
					+keys[errorCorrectIndex[errorCorrectLevel]]
					+' max length '
					+QRVersionCapacityTable[QRVersionCapacityTable.length-1][errorCorrectIndex[errorCorrectLevel]]
					+' for qrcode version '+(QRVersionCapacityTable.length-1)
				);
			}
		}
	
		if(cb) {
			cb(error,text,level,errorCorrectLevel);
		}
		return level;
	},
	resetCanvas:function(canvas,ctx,width){
		ctx.clearRect(0,0,canvas.width,canvas.height);
		if(!canvas.style) canvas.style = {};
		canvas.style.height = canvas.height = width;//square!
		canvas.style.width = canvas.width = width;
		
		if(this.color.light){
			ctx.fillStyle = this.color.light; 
			ctx.fillRect(0,0,canvas.width,canvas.height);
		} else {
			//support transparent backgrounds?
			//not exactly to spec but i really would like someone to be able to add a background with heavily reduced luminosity for simple branding
			//i could just ditch this because you could also just set #******00 as the color =P
			ctx.clearRect(0,0,canvas.width,canvas.height);
		}

	}
};