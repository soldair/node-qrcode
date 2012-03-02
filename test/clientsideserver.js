var express = require('express')
	,app = express.createServer()
	,fs = require('fs')
	,QRCode = require(__dirname+'/../qrcode')
	,canvasutil = require(__dirname+'/../../node-canvasutil/app.js')
	,Canvas = require('canvas')
	,Image = Canvas.Image;

app.configure(function(){
	app.use(express.methodOverride());
	app.use(express.bodyParser());
	app.use(app.router);
	app.use(express.static(__dirname + '/../'));
});

app.get('/', function(req, res){
	fs.readFile(__dirname+'/clientside.html', function (err, data) {
		res.send(data?data.toString():err);
	});
});

var effectHandlers = {};

app.get('/generate', function(req, res){
	var q = req.query||{},imageSrc;
	
	QRCode.QRCodeDraw.color.light = q.lightColor||'#ffffff';
	QRCode.QRCodeDraw.color.dark = q.darkColor||'#000000';
	QRCode.QRCodeDraw.scale = +(q.scale);

	if(isNaN(QRCode.QRCodeDraw.scale)) QRCode.QRCodeDraw.scale = 4;
	//NOTE when i set scale to 500 something seg faulted
	if(QRCode.QRCodeDraw.scale > 50) QRCode.QRCodeDraw.scale = 50;

	var effect = q.effect||'plain';
	if(!effectHandlers[effect]){
		effect = 'plain';
	}
	
	effectHandlers[effect](q,function(error,canvas){
		if(!error){
			canvas.toBuffer(function(err, buf){
				res.header('Content-Type','image/png');
				res.send(buf);
			});
		} else {
			var msg = error.message+"\n"+error.stack;
			res.header('Content-Type','text/plain');
			res.send(msg);
			console.error(msg);
		}
	});
});

effectHandlers.node = function(args,cb){
	args.src = __dirname+'/fixtures/node_logo.png';
	this.image(args,cb);
};

effectHandlers.npm = function(args,cb){
	args.src = __dirname+'/fixtures/npm_logo.png';
	this.image(args,cb);
};

effectHandlers.bacon = function(args,cb){
	args.src = __dirname+'/fixtures/bacon-love.png';
	this.image(args,cb);
};

effectHandlers.baconBikini = function(args,cb){
	args.src = __dirname+'/fixtures/bacon-bikini.png';
	this.image(args,cb);
};

effectHandlers.rounded = function(args,cb){
	QRCode.draw(args.text||'',function(err,canvas){
		if(err) {
			cb(err,canvas);
			return;
		}

		var tpx = new canvasutil.PixelCore()
		,luma709Only = canvasutil.conversionLib.luma709Only
		,savedBuffer
		,up=[],down=[],left=[],right=[]
		,upPx,downPx,leftPx,rightPx,undefined,r,t,l,b,corner = 0;

		tpx.threshold = 100;
		
		tpx.iterate(canvas,function(px,i,len,pixels,w,h,pixelCore){
			corner = 0;

			//is dark
			if(luma709Only(px.r,px.g,px.b) < pixelCore.threshold) {

				if(i-w > 0){
					upPx = (i-w)*4;
					up[0] = pixels[upPx + 0];
					up[1] = pixels[upPx + 1];
					up[2] = pixels[upPx + 2];
					//console.log('up',up);
				}
				
				if(i+w <= len) {
					downPx = (i+w)*4;
					down[0] = pixels[downPx + 0];
					down[1] = pixels[downPx + 1];
					down[2] = pixels[downPx + 2];
					//console.log('down',down);
				}

				//have left pixel but no wrapping
				if(i%w != 0){
					leftPx = (i-1)*4;
					left[0] = pixels[leftPx + 0];
					left[1] = pixels[leftPx + 1];
					left[2] = pixels[leftPx + 2];
					//console.log('left',left);
				}
				
				if(i%w != w-1){
					rightPx = (i+1)*4;
					right[0] = pixels[rightPx + 0];
					right[1] = pixels[rightPx + 1];
					right[2] = pixels[rightPx + 2];
					//console.log('right',right);
				}

				r = rightPx?luma709Only(right[0],right[1],right[2]):0;
				t = upPx?luma709Only(up[0],up[1],up[2]):0;
				l = leftPx?luma709Only(left[0],left[1],left[2]):0;
				d = downPx?luma709Only(down[0],down[1],down[2]):0;

				if(l > pixelCore.threshold){//if left is light and i am dark
					if(t > pixelCore.threshold){//if top is light and i am dark
						corner = 1;
						pixels[rightPx + 4] = 100;
					} else if(d > pixelCore.threshold){//if bottom is light and i am dark
						pixels[rightPx + 4] = 100;
						corner = 1;
					}
				} else if(r > pixelCore.threshold){
					if(t > pixelCore.threshold){//if top is light and i am dark
						corner = 1;
					} else if(d > pixelCore.threshold){//if bottom is light and i am dark
						corner = 1;
					}
				}
				
				if(corner) {
					px.a = 50;
				}
			}
		});
		cb(false,canvas);
	});
};


effectHandlers.remoteImage = function(args,cb){
	
	var src = args.src,domain,uri;
	
	if(!src) {
		cb(new Error('src required'),null);
	} else {
		if(src.indexof('://') != -1){
			src = src.split('://').unshift();
			var parts = src.split('/');

			domain = parts.shift();
			uri = parts.join('/');
		}
	}

	if(!domain || !uri) {
		cb(new Error('missing domain or uri '+args.src));
		return;
	}

	var options = {
		host: domain,
		port: 80,
		path: uri,
		method: 'GET'
	}
	,req = http.request(options, function(res) {
		if(res.statusCode < 200 || res.statusCode > 299){
			cb(new Error('http '+res.statusCode+' response code'),null);
			return;
		}

		res.setEncoding('utf8');
		
		var data = '';
		res.on('data', function (chunk) {
			data += chunk;
			console.log('BODY: ' + chunk);
		});
		
		res.on('complete',function(){
			cb(false,data);
		});
		
		res.on('error',function(error){
			cb(error,null);
			cb = function(){};
		});
	});
	
	req.end();
};

effectHandlers.image = function(args,cb){
	src = args.src||'';
	
	var img = new Image(),convert = canvasutil.conversionLib;
	img.onload = function(){
		QRCode.draw(args.text||'',function(err,canvas){
			if(err) {
				cb(err,false);
				return;
			}
			
			var codeCtx = canvas.getContext('2d')
			, frame = codeCtx.getImageData(0,0,canvas.width,canvas.width)
			, tpx = new canvasutil.PixelCore()
			, baconCanvas = new Canvas(canvas.width,canvas.width)
			, ctx = baconCanvas.getContext('2d')
			,topThreshold = args.darkThreshold||25
			,bottomThreshold = args.lightThreshold||75;
			
			tpx.threshold = 50;
			
			//scale image
			var w = canvas.width;
			var h = canvas.height;
			
			if(img.width>img.height) {
				w = w*(canvas.height/h)
				h = canvas.height;
			} else {
				h = h*(canvas.height/w)
				w = canvas.width;
			}
			ctx.drawImage(img,0,0,w,h);
			
			try{
			tpx.iterate(baconCanvas,function(px,i,l,pixels,w,h,pixelCore){
				var luma = (0.2125*px.r + 0.7154*px.g + 0.0721*px.b)
				, codeLuma = convert.luma709Only(frame.data[i*4],frame.data[i*4+1],frame.data[i*4+2]);
				
				if(codeLuma > pixelCore.threshold){
					if(luma < bottomThreshold) {
						var yuv = convert.rgbToYuv(px.r,px.g,px.b),rgb;
						
						rgb = convert.yuvToRgb(bottomThreshold,yuv[1],yuv[2]);
						
						px.r = rgb[0];
						px.g = rgb[1];
						px.b = rgb[2];
						px.a = 255;
					}
				} else {
					if(luma > topThreshold) {
						var yuv = convert.rgbToYuv(px.r,px.g,px.b),rgb;
						
						rgb = convert.yuvToRgb(topThreshold,yuv[1],yuv[2]);
						
						px.r = rgb[0];
						px.g = rgb[1];
						px.b = rgb[2];
					}
				}
			});
			} catch(e){
				cb(err,false);
			}

			cb(false,baconCanvas);
		});
	};
	
	img.onerror = function(error){
		error.message += ' ('+src+')';
		cb(error,null);
	}
	
	img.src = src;
};

effectHandlers.plain = function(args,cb){
	var text = args.text||'';
	QRCode.draw(text||'',function(err,canvas){
		cb(err,canvas);
	});
};

app.listen(3031);
console.log('listening on 3031');