var colors = require('colors');

module.exports.renderBits = renderBits;



function renderBits(bits,width,inverse){
  var bottom = '▄';
  var both = '█';
  var top = '▀';

  var bit = 0,nextRow,_b,_t,out = ' ',_debug = [],row = 0,i,j;
  //add one row to out for top framing
  for(i=0;i<width;++i) {
    out += " ";
  }
  out += " \n";
  for(i = 0;i<(width/2);i++){
    //console.error('row ',i);
    //_debug[row] = [];
    //_debug[row+1] = [];
    out +=  " ";

    for(j = 0;j<width;j++){
      //console.log('column ',j);
      nextRow = bit+width;
      c = ' ';
      _t = 0;
      _b = 0;

      if(bits[bit]) {
        _t = 1;
        c = '\033[53m'+top;
      }

      if(bits[nextRow]){
        _b = 1;
        c = bottom.underline;
      }
      

      if(_b && _t) {
        c = '\033[53m'+(both.underline);
      }
      //_debug[row].push(_t+'');
      //_debug[row+1].push(_b+'');


      out += c;
      bit++;
    }
    bit += width;
    //console.log('advancing bit to ',bit);
    row += 2;
    out += " \n";
  }

  //defaults tp inverse. this makes sense for people with dark terminals.
  return inverse?out:out.inverse;
}

