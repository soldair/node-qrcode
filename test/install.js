var QRCode = require('qrcode')
	, sys = require('sys');
	
sys.print(typeof QRCode.draw == 'function'?"PASS: qrcode is accessible in node path\n":"FAIL: qr code failed to include\n");
