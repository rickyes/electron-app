const exec = require('child_process').exec;
const cmdStr = 'cd resources/app/runjar && ';
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
