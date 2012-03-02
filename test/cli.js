var QRCode = require(__dirname+'/../qrcode.js');

QRCode.drawAscii('yo yo yo',function(error,data){
    console.log(data);
});
