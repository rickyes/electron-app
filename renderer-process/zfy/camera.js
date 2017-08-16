const video = document.getElementById('video'),
        canvas = document.getElementById('canvas'),
        snap = document.getElementById('tack'),
        img = document.getElementById('img'),
        btn_submit = document.getElementById('btn-submit'),
        btn_idcard = document.getElementById('btn-idcard'),
        low = require('lowdb'),
        db = low('db.json'),
        btn_name = document.getElementById('btn-name'),
        base64Img = require('base64-img'),
        request = require('request'),
        fs = require('fs'),
        vendorUrl = window.URL || window.webkitURL;
        db.defaults({ zfy:{} }).write();

      //媒体对象
      navigator.getMedia = navigator.getUserMedia ||
                           navagator.webkitGetUserMedia ||
                           navigator.mozGetUserMedia ||
                           navigator.msGetUserMedia;
      navigator.getMedia({
          video: true, //使用摄像头对象
          audio: false  //不适用音频
      }, function(strem){
          video.src = vendorUrl.createObjectURL(strem);
          video.play();
      }, function(error) {
          //error.code
          alert('调用摄像头出错,请检查摄像头是否正常连接到计算机');
      });

    snap.addEventListener('click', function(){

        //绘制canvas图形
        canvas.getContext('2d').drawImage(video, 0, 0, 400, 300);

        //把canvas图像转为img图片
        img.src = canvas.toDataURL("image/png");
    });

    btn_submit.addEventListener('click',()=>{
      const notification = {
        title: '数据上传',
        body: ''
      }
      request.post({
        url:'http://192.168.1.113:3000/medical',
        form:{
          idcard: document.getElementById('input-idcard').value,
          name: document.getElementById('input-name').value,
          img: img.src
        }},function(err,res,body){
          if(err){
            notification.body = '请检查网络连接'
            alert(notification.body);
            const myNotification = new window.Notification(notification.title, notification)
          }else{
            body = JSON.parse(body);
            notification.body = body.result;
            alert(notification.body);
            const myNotification2 = new window.Notification(notification.title, notification)
            if(body.code==401){

            }else if(body.code==200){
              document.getElementById('input-idcard').value = '';
              document.getElementById('input-name').value = '';
              img.src = '';
              canvas.height = canvas.height;
              let parent = document.getElementById('idcard-demo-toggle').parentElement;
              document.getElementById('camera-demo-toggle').parentElement.classList.toggle('is-open');
              parent.classList.toggle('is-open');
            }
          }
        });
    });

    btn_idcard.addEventListener('click',()=>{
        let input_idcard = document.getElementById('input-idcard');
        let value = input_idcard.value;
        try{
          db.get('zfy')
            .set('idcard',value)
            .write();
            alert('添加体检人员身份证成功');
            let parent = document.getElementById('name-demo-toggle').parentElement;
            document.getElementById('idcard-demo-toggle').parentElement.classList.toggle('is-open');
            parent.classList.toggle('is-open');
        }catch(err){
          alert('添加体检人员身份证出错');
        }
        // let v = db.get('zfy')
        //   .find({idcard: value})
        //   .value();
    });

    btn_name.addEventListener('click',()=>{
      let input_name = document.getElementById('input-name');
      let value = input_name.value;
      try{
        db.get('zfy')
          .set('name',value)
          .write();
          alert('添加体检人员姓名成功');
          let parent = document.getElementById('camera-demo-toggle').parentElement;
          document.getElementById('name-demo-toggle').parentElement.classList.toggle('is-open');
          parent.classList.toggle('is-open');
      }catch(err){
        alert('添加体检人员姓名出错');
      }
    });
