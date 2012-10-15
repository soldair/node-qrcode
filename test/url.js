var test = require('tap').test;

// simple tdest
var QRCode = require(__dirname+'/../qrcode.js');

var shouldBe = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIwAAACMCAIAAAAhotZpAAAABmJLR0QA/wD/AP+gvaeTAAAC0UlEQVR4nO2dQW7EIAwAm6r//3J6qLSiB1Qj24TpzhxXCdlo5FiAgeu+7w85m8+n/4D8jZIAKAmAkgAoCYCSACgJgJIAKAmAkgAoCYCSACgJgJIAKAmAkgAoCYCSACgJwFfm5uu6qv7Hi7HmYmx/tRYjcu/smu73WsVIAqAkAEoCkMpJI5lvbiYHzO6N5KEIT73XiJEEQEkAlASgLCeNRL7FkW99pM+0mnu6c0xHbb2RBEBJAJQEoCUnVREZW5vlgNn1HbmqGyMJgJIAKAnA0TlpZHUcLDMXdRpGEgAlAVASgJac1J0DVmsWup/bjZEEQEkAlASgLCd11KqNZOrxMmOA3e8VwUgCoCQASgJwEce1MrmE+L5GEgAlAVASgPaclFknFLkmknsy9XKr93bkQiMJgJIAKAlA2ZrZzJrTzPc6k3sy9Xg7x/SMJABKAqAkAKmctFqHPbLav9k55nba+J6RBEBJAJQEoGzsrirHdPexqsYSd2IkAVASACUBSOWkqv3oRjLzSVW1eZH/E6EqtxlJAJQEQEkAttY4jHTUcGfmeKrqFKxxeFOUBEBJAFpqHEYy3/HVZ60+N9O+NQ7yCyUBUBKAlvmkzNhax7zUU+ttqzCSACgJgJIAbD0/qXuNUdVaokj7O/OTkQRASQCUBODofRwyfaZM/sv8n9n1zif9c5QEQEkAjj5ntmot7ez3yNqpTDtVGEkAlARASQAw58xW7bPQUR/R3Y6RBEBJAJQE4OhzZmfXz/YEyoy/VdWRd2AkAVASACUBOPpMv9X5pO7991afZT/pjVASACUBODonrY6zndDX6chPRhIAJQFQEgDMObPd9RQdz7Wf9EYoCYCSAJTtd1dF1b55kTYz65l2niVoJAFQEgAlATh6fZL8YCQBUBIAJQFQEgAlAVASACUBUBIAJQFQEgAlAVASACUBUBIAJQFQEgAlAVASACUB+AZ8GY0T5C7RkwAAAABJRU5ErkJggg==";

var lShouldBe = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHwAAAB8CAIAAAAkfEPpAAAABmJLR0QA/wD/AP+gvaeTAAACMklEQVR4nO3dwW4CMQwA0W7F///yckO5RIpleyeBeceKFjSK3G0I2+u+7z89659+Ab/I6ACjA4wOMDrA6ACjA4wOMDrA6ACjA4wOMDrA6ACjA4wOMDrA6ACjA16Zb76uq+p1fKy8Zzs+7/j4la9Xyby37EoHGB1gdEBqpo8yMy46czPP9eTrnHGlA4wOMDqgbKaPVmZfx/V4dF5Xvc4oVzrA6ACjA1pmepXZPJ19fTbrd+NKBxgdYHTA1jN99OReeTdXOsDoAKMDWmZ69zXybI5Hn5e6lnelA4wOMDqgbKZ3XC9nzres7M9QXOkAowOMDkjN9N32rKP77xRXOsDoAKMD2s+nP7n33X3epoorHWB0gNEBZdfpVfsk0bnfsQ+z8nr8zNFhjA4wOuDRcy9V8zc6czN/T3T8neFKBxgdYHTAVbW3EJ2tmc8HZa6jdzjD7koHGB1gdAB2lrHjd0D0MdR8d6UDjA4wOqDsOr1D1X1gMj/H/fQvYXSA0QHH3Jex6tp/5fHd53Nc6QCjA4wOOOa+jCvzuuNzpB37M650gNEBRgdsfV/G6PdG56/76T/E6ACjA7a+h9dsXztzhr3j8VGudIDRAUYHbD3Tq/bHV97z7D6LOXKlA4wOMDrgmPsydvxPjKr7gkW50gFGBxgdsPV9GWcye+WZee11+sGMDjA6YOvz6d/KlQ4wOsDoAKMDjA4wOsDoAKMDjA4wOsDoAKMDjA4wOsDoAKMDjA4wOsDogDcjgAwAvM5/aQAAAABJRU5ErkJggg==";

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
