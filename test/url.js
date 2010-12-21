// simple test
var sys = require('sys');
var QRCode = require(__dirname+'/../qrcode');

var shouldBe = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIwAAACMCAYAAACuwEE+AAAABmJLR0QA/wD/AP+gvaeTAAAC+ElEQVR4nO3dSY7bQBBFQcvw/a8s77kw/VATpY7YdosSiI9kogbW6/1+v3/Bf/p9+gfwWQSGRGBIBIZEYEgEhkRgSASGRGBIBIZEYEgEhkRgSASGRGBIBIZEYEgEhkRgSP7MvuDr9Zp9yX+6Lkm+fv/okuV6vbv/P31/RqkwJAJDIjAk03uYq9nP0Nk9wN31as9SPf3+XKkwJAJDIjAky3uYq/qMrc/4Oi4z2qOc7kF2b41XYUgEhkRgSLb3MKvVuZy7HuDu87t7nNNUGBKBIREYkq/rYa5G51Zmr6/5dCoMicCQCAzJ9h7mdA8wuiZ3tdP3544KQyIwJAJDsryH2b0P52r2vqXZc1Wn70+lwpAIDInAkLx+2nlJs3uMH3b7VBgagSERGJLj62Fmv3+l/n/tUWav6R3dh7S7x1JhSASGRGBIlr/jbvY73mY/k0d/39N6nNVUGBKBIREYkuk9zOhe5avRcZKnzfU87fdUKgyJwJAIDMny9TCre5DT4zqr58KeRoUhERgSgSHZPpd0Z/Z6j9F9RKvf8zvb6h5JhSERGBKBITm+L2n2mtTZPcuo1Wtwrenl0QSGRGBIjo/DzH5mj/6eq91zTXefP02FIREYEoEh2b4eZvZczu71Nk9/Z95qKgyJwJAIDMnycZjRz8/uWer335k9F/X0nkaFIREYEoEhOb4eZrbZ4zKze6o7q9cwj1JhSASGRGBIHjcOU9V9QqPXv/t7fd/N7OuvpsKQCAyJwJAsP2tgdk8xe25o93lJq4e9Vl9fhSERGBKBIdl+XtLoepOqngUwe+5n9V7t3VQYEoEhERiS42c+zjb7DMfd5z2N/h7jMDyKwJAIDMnX9TCr3wtc7Z47sqaXRxEYEoEh2d7D7J4LOb3G+M6n9UwqDInAkAgMyfIe5vQ+mtE1u6vPoFx95qVxGI4SGBKBIfm698OwlgpDIjAkAkMiMCQCQyIwJAJDIjAkAkMiMCQCQyIwJAJDIjAkAkMiMCQCQyIwJAJD8hcDEI4hfsS5IwAAAABJRU5ErkJggg==";

QRCode.toDataURL('i am a pony!',function(err,url){
	sys.print(url == shouldBe?"PASS: url is what it should be !\n":"FAIL: oh no something broke the qr generation!\n");
});