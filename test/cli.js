var QRCode = require('../qrcode.js');

QRCode.drawText('yo yo yo',function(error,data){
    console.log(data);
});
