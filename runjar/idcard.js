const exec = require('child_process').exec;
var cmdStr = 'cd resources/app/runjar && ';
if(require('../config').debug) cmdStr = 'cd runjar && ';
exports.start = function(){
  exec(cmdStr+'startup.bat',function(error, stdout, stderr){
    if (error !== null) {
      console.log('error');
    }else{
      console.log('success');
    }
  });
}
exports.stop = function(){
  exec(cmdStr+'endup.bat',function(error, stdout, stderr){
    if (error !== null) {
      console.log('error');
    }else{
      console.log('success');
    }
  });
}
