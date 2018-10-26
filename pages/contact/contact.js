import {tools} from '/common/js/common.js'
Page({
    data:{},
    onShow:function(){
        console.log(12312313131)
    },
    bindSubmit:function(e){

     

        my.downloadFile({
          url: 'http://static.wxcard.com.cn/fanfan.apk', // 下载文件地址
          success: function (res){
             
            my.alert({content:res.apFilePath})
          },
          fail: function(res){
            my.alert({ content: res.errorMessage || res.error });
          }
        });

    my.showToast({content:'开始下载文件'})
        return;
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
    }
})