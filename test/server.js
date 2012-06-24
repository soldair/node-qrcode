var QRCode = require(__dirname+'/../qrcode')
	, connect = require('express');
	
function testQRCode(req, res) {
	res.writeHead(200, { 'Content-Type': 'text/html' });

	var jungleBook = "The moonlight was blocked out of the mouth of the cave, for Shere Khan's\n"
	+"great square head and shoulders were thrust into the entrance. Tabaqui,\n"
	+"behind him, was squeaking: \"My lord, my lord, it went in here!\"\n"
	+"\n"
	+"\"Shere Khan does us great honor,\" said Father Wolf, but his eyes were\n"
	+"very angry. \"What does Shere Khan need?\"\n"
	+"\n"
	+"\"My quarry. A man's cub went this way,\" said Shere Khan. \"Its parents\n"
	+"have run off. Give it to me.\"\n"
	+"\n"
	+"Shere Khan had jumped at a woodcutter's campfire, as Father Wolf had\n"
	+"said, and was furious from the pain of his burned feet. But Father Wolf\n"
	+"knew that the mouth of the cave was too narrow for a tiger to come in\n"
	+"by. Even where he was, Shere Khan's shoulders and forepaws were cramped\n"
	+"for want of room, as a man's would be if he tried to fight in a barrel.\n"
	+"\n"
	+"\"The Wolves are a free people,\" said Father Wolf. \"They take orders from\n"
	+"the Head of the Pack, and not from any striped cattle-killer. The man's\n"
	+"cub is ours--to kill if we choose.\"";
	
	//QRCode.QRCodeDraw.color.dark = '#d4d4d4';
	QRCode.toDataURL(jungleBook,function(err,url){
		if(err) console.log('error: '+err);
		res.end("<!DOCTYPE html/><html><head><title>node-qrcode</title></head><body><img src='"+url+"'/></body></html>");
	});
}

connect.createServer(testQRCode).listen(3030);
console.log('test server started on port 3030');
