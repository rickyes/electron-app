const video = document.getElementById('video'),
        canvas = document.getElementById('canvas'),
        snap = document.getElementById('tack'),
        img = document.getElementById('img'),
        btn_submit = document.getElementById('btn-submit'),
        // btn_idcard = document.getElementById('btn-idcard'),
        low = require('lowdb'),
        db = low('db.json'),
        // btn_name = document.getElementById('btn-name'),
        base64Img = require('base64-img'),
        request = require('request'),
        fs = require('fs'),
        btn_open_idcard = document.getElementById('btn-open-idcard'),
        camera_result_div = document.getElementById('camera-result-div'),
        btn_confirm_idcard = document.getElementById('btn-confirm-idcard'),
        idcard_name = document.getElementById('idcard-name'),
        idcard_sex = document.getElementById('idcard-sex'),
        idcard_nationality = document.getElementById('idcard-nationality'),
        idcard_year = document.getElementById('idcard-year'),
        idcard_month = document.getElementById('idcard-month'),
        idcard_day = document.getElementById('idcard-day'),
        idcard_address = document.getElementById('idcard-address'),
        idcard_img = document.getElementById('idcard-img'),
        idcard_number = document.getElementById('idcard-number'),
        idcard_time = document.getElementById('idcard-time'),
        vendorUrl = window.URL || window.webkitURL;

        db.defaults({ zfy:{} }).write();
        //通过ffi调用dll
        // const ffi = require('ffi');
        // const test = ffi.Library('Termb.dll',{
        //   'CVR_InitComm': ['int',['int']],
        //   'CVR_Authenticate': ['int',[]],
        //   'CVR_Read_Content': ['int',['int']],
        //   'CVR_CloseComm': ['int',[]],
        //   'CVR_GetState': ['int',[]]
        // });

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
      let url = require('../../config.js').url+'/medical';
      let birthtime = idcard_year.innerText+' - '+idcard_month.innerText+' - '+idcard_day.innerText;
      request.post({
        url: url,
        form:{
          idcard: idcard_number.innerText,
          name: idcard_name.innerText,
          sex: idcard_sex.innerText,
          nationality: idcard_nationality.innerText,
          birthtime: birthtime,
          address: idcard_address.innerText,
          idcardimg: idcard_img.src,
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
              alert('参数不全');
            }else if(body.code==200){
              idcard_name.innerText = '';
              idcard_sex.innerText = '';
              idcard_nationality.innerText = '';
              idcard_year.innerText = '';
              idcard_month.innerText = '';
              idcard_day.innerText = '';
              idcard_address.innerText = '';
              idcard_img.src = '';
              idcard_number.innerText = '';
              idcard_time.innerText = '';
              camera_result_div.style.display = 'none';
              img.src = '';
              canvas.height = canvas.height;
              let parent = document.getElementById('idcard-demo-toggle').parentElement;
              document.getElementById('camera-demo-toggle').parentElement.classList.toggle('is-open');
              parent.classList.toggle('is-open');
            }
          }
        });
    });

    // btn_idcard.addEventListener('click',()=>{
    //     let input_idcard = document.getElementById('input-idcard');
    //     let value = input_idcard.value;
    //     try{
    //       db.get('zfy')
    //         .set('idcard',value)
    //         .write();
    //         alert('添加体检人员身份证成功');
    //         let parent = document.getElementById('name-demo-toggle').parentElement;
    //         document.getElementById('idcard-demo-toggle').parentElement.classList.toggle('is-open');
    //         parent.classList.toggle('is-open');
    //     }catch(err){
    //       alert('添加体检人员身份证出错');
    //     }
    // });

    // btn_name.addEventListener('click',()=>{
    //   let input_name = document.getElementById('input-name');
    //   let value = input_name.value;
    //   try{
    //     db.get('zfy')
    //       .set('name',value)
    //       .write();
    //       alert('添加体检人员姓名成功');
    //       let parent = document.getElementById('camera-demo-toggle').parentElement;
    //       document.getElementById('name-demo-toggle').parentElement.classList.toggle('is-open');
    //       parent.classList.toggle('is-open');
    //   }catch(err){
    //     alert('添加体检人员姓名出错');
    //   }
    // });

    //接收扫描身份证结果
    btn_open_idcard.addEventListener('click',()=>{
      let url = 'http://localhost:9097/idcard_reader/info';
      request(url,(err,response,body)=>{
        if(err)
          alert('身份证扫描仪连接错误');
        else{
          body = JSON.parse(body);
          if(body.result === 'ok'){
            idcard_name.innerText = body.info[0];
            idcard_sex.innerText = body.info[1];
            idcard_nationality.innerText = body.info[2];
            idcard_year.innerText = body.info[3].substr(0,4);
            idcard_month.innerText = body.info[3].substr(4,2);
            idcard_day.innerText = body.info[3].substr(6,2);
            idcard_address.innerText = body.info[4];
            idcard_img.src = body.info[10];
            idcard_number.innerText = body.info[5];
            idcard_time.innerText = body.info[9];
            camera_result_div.style.display = 'inline';
          }else{
            alert(body.info);
          }
        }
      });


      //通过ffi调用dll
      // let con = test.CVR_InitComm(1001);
      // if(con!==1) return;
      // console.log('开启端口成功');
      // let con_state = test.CVR_GetState();
      // if(con_state!==144) return;
      // console.log('连接仪器成功');
      // let interval = setInterval(()=>{
      //   // let card_auth = test.CVR_Authenticate();
      //   // console.log(card_auth);
      //   let read_content = test.CVR_Read_Content(4);
      //   if(read_content!==1) return;
      //   console.log('读卡成功，身份证信息为：\n');
      //   fs.readFile('wz.txt','utf-8',(err,data)=>{
      //     if(err) return;
      //     console.log(data);
      //   });
      // },300);
      // clearInterval(interval);
    });

    //确认身份证信息
    btn_confirm_idcard.addEventListener('click',()=>{
      let parent = document.getElementById('camera-demo-toggle').parentElement;
      document.getElementById('idcard-demo-toggle').parentElement.classList.toggle('is-open');
      parent.classList.toggle('is-open');
    });

    document.getElementById('test-barcode-btn').addEventListener('click',function(){
      let url = 'http://localhost:9097/barcode_generate/12345678';
      request(url,(err,res,body)=>{
        if(err){
          alert('网络错误');
        }else{
          try{
            body = JSON.parse(body);
            if(body.result=='ok'){
              console.log(body.info);
              document.getElementById('test-barcode-img1').src = body.info;
              document.getElementById('test-barcode-img2').src = body.info;
              document.getElementById('test-barcode-img3').src = body.info;
              setTimeout(function(){
                var bodyHTML = window.document.body.innerHTML
                // window.document.body.style.width = '10cm';
                // window.document.body.style.height = '2.2cm';
                // window.document.body.style.background = '#35b998';
                window.document.body.innerHTML = document.getElementById('print-test').innerHTML
                var width = window.document.body.style.width;
                var height = window.document.body.style.height;
                // console.log(width+'---'+height);
                window.print()
                window.document.body.innerHTML = bodyHTML
                return;
              },2000);
            }else{
              alert('连接错误');
            }
          }catch(err){
            alert('参数错误');
          }
        }
      });
    });
