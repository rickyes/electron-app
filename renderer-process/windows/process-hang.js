const BrowserWindow = require('electron').remote.BrowserWindow
const dialog = require('electron').remote.dialog

const path = require('path')
const request =  require('request');

const processHangBtn = document.getElementById('process-hang')
const input_barcode = document.getElementById('input-barcode')
const process_sugmit = document.getElementById('process-sugmit');
const base_url = require('../../config.js').url;
var procress_idcard;

document.onkeydown=function(){
    if (event.keyCode == 13){
        processHangBtn.click();
    }
}

processHangBtn.addEventListener('click', function (event) {
  let val = input_barcode.value;
  if(val === ''){
    alert('请输入体检号');
    return;
  }
  // val = val == '' ? '12345678' : val;
  let url = require('../../config.js').url+'/find?physical_number='+val;
  request(url,(err,res,body)=>{
    if(err){
      alert('请求错误');
    }else{
      body = JSON.parse(body);
      if(body.code==401){
        alert(body.result);
      }else{
        if(body.result.length==0){
          alert('没有该体检号');
          input_barcode.value = '';
          return;
        }
        let img_url = base_url+'/img/idcard/';
        var html = '<tr><th scope="col" abbr="Dual 1.0">姓名</th><th scope="col" abbr="Dual 1.8">身份证</th><th scope="col" abbr="Dual 1.0">性别</th><th scope="col" abbr="Dual 1.0">民族</th><th scope="col" abbr="Dual 1.0">出生</th><th scope="col" abbr="Dual 1.0">头像</th></tr>';
        for(var i=0;i<body.result.length;i++){
          html += '<tr><td>'+body.result[i].name+'</td><td>'+body.result[i].idcard+'</td><td>'+body.result[i].sex+'</td><td>'+body.result[i].nationality+'</td><td>'+body.result[i].birthtime+'</td><td><img src="'+img_url+body.result[i].idcardimg+'" style="width:60px;height:60px;border-radius:50px;"/></td></tr>';
        }
        procress_idcard = body.result[0].idcard;
        document.getElementById('crash-table').innerHTML=html;
        document.getElementById('process-docter-div').style.display = 'inline-block';
      }
    }
  });
});

process_sugmit.addEventListener('click',function(){
  let url = require('../../config.js').url+'/setmedical';
  request.post({
    url: url,
    form: {
      idcard: procress_idcard,
      result_info: document.getElementById('input-barcode-result-info').value
    }
  },function(err,res,body){
    if(err){
      alert('请检查网络');
    }else{
      body = JSON.parse(body);
      if(body.code==401){
        alert(body.result);
      }else if(body.code==200){
        alert(body.result);
        document.getElementById('input-barcode-result-info').value = '';
        document.getElementById('process-docter-div').style.display = 'none';
        document.getElementById('crash-table').innerHTML = '';
        input_barcode.value = '';
      }
    }
  });
});
