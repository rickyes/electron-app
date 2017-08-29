var nurse;
const base_url = require('../../config.js').url;
(function(){
  const request = require('request')
      , list_url = base_url+'/medicals'
      , fresh_btn = document.getElementById('cordslist-fresh')
      , table_main = document.getElementById('cordslist-table');
  const remote = require('electron').remote;
  var loadData = function(){
    request(list_url, function (error, response, body) {
      if (!error) {
        body = JSON.parse(body);
        var data = {
          list:body
        };
        let img_url = base_url+'/img/idcard/';
        var html = '<tr><th scope="col" abbr="Dual 1.0">姓名</th><th scope="col" abbr="Dual 1.8">身份证</th><th scope="col" abbr="Dual 1.0">性别</th><th scope="col" abbr="Dual 1.0">体检号</th><th scope="col" abbr="Dual 1.0">出生</th><th scope="col" abbr="Dual 1.0">头像</th></tr>';
        for(var i=0;i<body.length;i++){
          html += '<tr><td>'+body[i].name+'</td><td>'+body[i].idcard+'</td><td>'+body[i].sex+'</td><td>'+(body[i].physical_number ? body[i].physical_number : '')+'</td><td>'+body[i].birthtime+'</td><td><img src="'+img_url+body[i].idcardimg+'" style="width:60px;height:60px;border-radius:50px;"/></td></tr>';
        }
        // var html = template('tr-temp', data);
        table_main.innerHTML=html;
      }
    });
  }

  loadData();

  fresh_btn.addEventListener('click',function(){
    table_main.innerHTML = '';
    loadData();
  });

  // let curr = remote.getCurrentWindow();
  // console.log(curr);
})();
