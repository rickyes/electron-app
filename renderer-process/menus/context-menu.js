var menu;
const base_url = require('../../config.js').url;
var load = function(){
  const request = require('request')
      , list_url = base_url+'/medicals'
      , fresh_btn = document.getElementById('menus-fresh')
      , table_main = document.getElementById('menus-table');
  const BrowserWindow = require('electron').remote.BrowserWindow;
  const path = require('path');
  const remote = require('electron').remote;

  var loadData = function(){
    request(list_url, function (error, response, body) {
      if (!error) {
        body = JSON.parse(body);
        var data = {
          list:body
        };
        let img_url = base_url+'/img/idcard/';
        var html = '<tr><th scope="col" abbr="Dual 1.0">姓名</th><th scope="col" abbr="Dual 1.8">身份证</th><th scope="col" abbr="Dual 1.0">性别</th><th scope="col" abbr="Dual 1.0">医生总结</th><th scope="col" abbr="Dual 1.0">出生</th><th scope="col" abbr="Dual 1.0">头像</th></tr>';
        for(var i=0;i<body.length;i++){
          html += '<tr><td><a href="javascript:void(0);" data-id="'+body[i].idcard+'">'+body[i].name+'</a></td><td>'+body[i].idcard+'</td><td>'+body[i].sex+'</td><td>'+body[i].result_info+'</td><td>'+body[i].birthtime+'</td><td><img src="'+img_url+body[i].idcardimg+'" style="width:60px;height:60px;border-radius:50px;"/></td></tr>';
        }
        table_main.innerHTML=html;
        $('#menus-table a').on('click',function(){
          let idcard = $(this).attr('data-id');
          let name = $(this).text();
          var low = require('lowdb');
          low('db.json').get('zfy').set('id','1').write();
          low('db.json').get('zfy').set('idcard',idcard).write();
          low('db.json').get('zfy').set('name',name).write();
          contextWindows();
        });
      }
    });
  }

  var contextWindows = function(event){
    // const focusModalBtn = document.getElementById('focus-on-modal-window')
      let win;
      const modalPath = path.join('file://', __dirname, '../../sections/windows/modal-toggle-visibility.html')
      win = new BrowserWindow({ width: 600, height: 400 })
      // win.on('focus', hideFocusBtn)
      // win.on('blur', showFocusBtn)
      win.on('close', function () {
        win = null
        table_main.innerHTML = '';
        loadData();
      })
      win.loadURL(modalPath)
      win.show()
      // function showFocusBtn (btn) {
      //   if (!win) return
      //   focusModalBtn.classList.add('smooth-appear')
      //   focusModalBtn.classList.remove('disappear')
      //   focusModalBtn.addEventListener('click', clickHandler)
      // }
      // function hideFocusBtn () {
      //   focusModalBtn.classList.add('disappear')
      //   focusModalBtn.classList.remove('smooth-appear')
      //   focusModalBtn.removeEventListener('click', clickHandler)
      // }
      // function clickHandler () {
      //   win.focus()
      // }
  };


  loadData();

  fresh_btn.addEventListener('click',function(){
    table_main.innerHTML = '';
    loadData();
  });

};

load();
