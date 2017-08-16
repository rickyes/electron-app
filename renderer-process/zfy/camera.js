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

        img.onload =function() {
          var data = base64Img.base64Sync(img.src);
          console.log(data);
        }
    });

    btn_submit.addEventListener('click',()=>{
      alert('Hello Electron!');
    });

    btn_idcard.addEventListener('click',()=>{
        let input_idcard = document.getElementById('input-idcard');
        let value = input_idcard.value;
        try{
          db.get('zfy')
            .set('zfy.idcard',value)
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
          .set('zfy.name',value)
          .write();
          alert('添加体检人员姓名成功');
          let parent = document.getElementById('camera-demo-toggle').parentElement;
          document.getElementById('name-demo-toggle').parentElement.classList.toggle('is-open');
          parent.classList.toggle('is-open');
      }catch(err){
        alert('添加体检人员姓名出错');
      }
    });
