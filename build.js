var spawn = require('child_process').spawn,
    fs = require('fs');


var q = [
  function(){
    var browserify = spawn('node',['node_modules/browserify/bin/cli.js','qrcodeclient.js','-o', 'build/qrcode.js']);
    browserify.stdin.end();
    browserify.stdout.pipe(process.stdout);
    browserify.on('exit',function(code){
      if(code){
        console.error('browserify failed!');
        process.exit(code);
      }
      done();
    });
  },
  function(){
    var uglify = spawn('node',['node_modules/uglify-js/bin/uglifyjs','build/qrcode.js']);
    var minStream = fs.createWriteStream('build/qrcode.min.js');
    uglify.stdout.pipe(minStream);
    uglify.stdin.end();
    uglify.on('exit',function(code){
      if(code){
        console.error('uglify failed!');
        fs.unlink('build/qrcode.min.js',function(){
          process.exit(code);  
        });
      }
      done();
    });
  }
],done = function(){
  var j = q.shift();
  if(j) j();
  else complete()
},
complete = function(){
  console.log('build complete =)');
};

done();
