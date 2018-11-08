import {tools} from '/common/js/common.js'
Page({
    data:{
      showAboutLayer: true,
    },
    onShow:function(){
       
    },
    bindSubmit:function(e){
        let name = e.detail.value.name;
        let tel = e.detail.value.tel;

        if(name==""){
            my.showToast({content:"请输入联系人姓名"});
            return;
        }

        if(tel.length<11){
            my.showToast({content:"请输入联系人电话"});
            return;
        }

        tools.ajax('api/concat/',JSON.stringify({contact:name,telephone:tel}),'POST',function(res){
           if(res.code==0){
               my.alert({
                 title: '提交成功',
                content: '我们已收到信息，将尽快联系您',
                buttonText: '好的',
                success:function(){
                  my.navigateBack({url:"/pages/home/home"});
                }
               });
           }
       },{headers: {"Content-Type":"application/json"}}); 
    },
  bindKeyInput:function(e){
   
  },
  bindConfirmAbout: function() {
    this.setData({ "showAboutLayer": false });
    my.setClipboard({
      text: 'http://t.cn/Ew2ra6G',
      success: function() {
        my.showToast({ duration: 3000, content: '已复制饭饭商户版APK下载地址，可在浏览器中打开下载' });
      }
    });
  },
  bindNotifyClick: function() {
    this.setData({ "showAboutLayer": true });
  }
})