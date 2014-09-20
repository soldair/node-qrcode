var test = require('tap').test;

// simple tdest
var QRCode = require(__dirname+'/../qrcode.js');

var shouldBe = 
"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIwAAACMCAYAAACuwEE+AAAABmJLR0QA/wD/AP+gvaeTAAAC+ElEQVR4nO3dSY7bQBBFQcvw/a8s77kw/VATpY7YdosSiI9kogbW6/1+v3/Bf/p9+gfwWQSGRGBIBIZEYEgEhkRgSASGRGBIBIZEYEgEhkRgSASGRGBIBIZEYEgEhkRgSP7MvuDr9Zp9yX+6Lkm+fv/okuV6vbv/P31/RqkwJAJDIjAk03uYq9nP0Nk9wN31as9SPf3+XKkwJAJDIjAky3uYq/qMrc/4Oi4z2qOc7kF2b41XYUgEhkRgSLb3MKvVuZy7HuDu87t7nNNUGBKBIREYkq/rYa5G51Zmr6/5dCoMicCQCAzJ9h7mdA8wuiZ3tdP3544KQyIwJAJDsryH2b0P52r2vqXZc1Wn70+lwpAIDInAkLx+2nlJs3uMH3b7VBgagSERGJLj62Fmv3+l/n/tUWav6R3dh7S7x1JhSASGRGBIlr/jbvY73mY/k0d/39N6nNVUGBKBIREYkuk9zOhe5avRcZKnzfU87fdUKgyJwJAIDMny9TCre5DT4zqr58KeRoUhERgSgSHZPpd0Z/Z6j9F9RKvf8zvb6h5JhSERGBKBITm+L2n2mtTZPcuo1Wtwrenl0QSGRGBIjo/DzH5mj/6eq91zTXefP02FIREYEoEh2b4eZvZczu71Nk9/Z95qKgyJwJAIDMnycZjRz8/uWer335k9F/X0nkaFIREYEoEhOb4eZrbZ4zKze6o7q9cwj1JhSASGRGBIHjcOU9V9QqPXv/t7fd/N7OuvpsKQCAyJwJAsP2tgdk8xe25o93lJq4e9Vl9fhSERGBKBIdl+XtLoepOqngUwe+5n9V7t3VQYEoEhERiS42c+zjb7DMfd5z2N/h7jMDyKwJAIDMnX9TCr3wtc7Z47sqaXRxEYEoEh2d7D7J4LOb3G+M6n9UwqDInAkAgMyfIe5vQ+mtE1u6vPoFx95qVxGI4SGBKBIfm698OwlgpDIjAkAkMiMCQCQyIwJAJDIjAkAkMiMCQCQyIwJAJDIjAkAkMiMCQCQyIwJAJD8hcDEI4hfsS5IwAAAABJRU5ErkJggg=="


var lShouldBe = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHwAAAB8CAYAAACrHtS+AAAABmJLR0QA/wD/AP+gvaeTAAACVUlEQVR4nO3dy27rMAwA0bro//+yu/cihEBSVDxztr15YSDw2rKT677v+0cYv9NvQHsZHMbgMAaHMTiMwWEMDmNwGIPDGBzG4DAGhzE4jMFhDA5jcBiDwxgcxuAwf9VPeF1X9VN+tHpJ3vP9PR+/+vdu1ZccusJhDA5jcJjyGf5UPYOyM7T6/Zz2+SKucBiDwxgcpn2GP63OqN3H2dmZ3P35slzhMAaHMTjM9hneLZqJ0d+jGf/tXOEwBocxOMzrZvjTafvb01zhMAaHMTjM9hk+fVwbzezs+5v+fBFXOIzBYQwO0z7Ddx/nVl93vnru/XSucBiDwxgcpnyGn34cGsnup5/OFQ5jcBiDw4zfH37a/vT0dfPdXOEwBocxOEz7cXj3ue3szN99bn31/fsdL0oxOIzBYY67Lr17pmZnaPV5ht3nIVzhMAaHMTjM+He8TB+XPq1+B8zq/ymm99td4TAGhzE4zPH3lmWPk1dfL/vvp/e7I65wGIPDGBzmuk8bMknd36de/fzuh6uVwWEMDjN+XXpW9bnp7EyNHj993b0rHMbgMAaHef3vlq3O5N3f07b73LsrHMbgMAaHGb+mLbL7t0KzM9X9cB3F4DAGhznu3rKsaL+5+n7y3Y/PcoXDGBzG4DCvm+Hd+9mr16Ttvq4+4gqHMTiMwWGOv7es+vVW7//ufj33w9XK4DAGh3nd75ZFqve3q2eyx+EqZXAYg8O87v5wfeYKhzE4jMFhDA5jcBiDwxgcxuAwBocxOIzBYQwOY3AYg8MYHMbgMAaHMTiMwWH+AWVFEfpSXe+vAAAAAElFTkSuQmCC"


test('qrcode to data uri should be correct.',function(t){
  QRCode.toDataURL('i am a pony!',function(err,url){
    if(err) console.log(err);
    t.ok(!err,'there should be no error '+err);
    t.equals(url,shouldBe,"url generated should match expected value");
    t.end();
  });

});

test('qrcode generated with changed error correction should be expected value',function(t){
  QRCode.toDataURL('i am a pony!',{errorCorrectLevel:'minimum'},function(err,url){
    t.ok(!err,'there should be no error '+err);
    t.equals(url,lShouldBe,"url should match expected value for error correction L");
    t.end();
  }); 
});
