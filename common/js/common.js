import md5 from '/common/js/md5.js'
let tools={
    //异步请求
    ajax:function(pathname,data,method,success,option){

        //进度条 
        my.showLoading(); 

        let app =  getApp();
        if(!app.config.networkAvailable)
        {
            my.hideLoading();
            if(option!=undefined && option.network){
                option.network(false);
            }else{
                my.showToast({content:"无法连接到网络，请重试"});
            }
            return;
        }

        if(option==undefined) option={};

        if(option.headers==undefined)option.headers={}; 

        //固定信息
        let base={
            clientType:app.config.clientType,
            userId:app.userInfo.id,
            customerId:app.config.customerId,
            version: app.config.version,
            time: new Date().getTime()
            };
        //设置签名
        base.sign = md5(base.clientType+''+base.userId+''+base.customerId+''+base.version+''+ base.time+'miniprogram');

        //设置header 固定数据
        option.headers.base= JSON.stringify(base);
 
        let hidenLoading=false;

        //请求
        my.httpRequest({
            url: getApp().config.apiHost+pathname,
            method: method,
            headers:option.headers,
            data: data,
            dataType: 'json',
            timeout: 60000,
            success: function(res) {
                hidenLoading=true;
                //隐藏加载条
                my.hideLoading();
                if(res.data.code!=0){
                    my.showToast({content: res.data.msg});
                }
                if(success){
                    success(res.data);
                }
            },
            fail: function(res) {
                if(option!=undefined && option.network){
                    option.network(false);
                }else{
                    my.showToast({content:"无法连接到网络，请重试"});
                }
            },
            complete: function(res) {
                if(!hidenLoading)
                    my.hideLoading();
            }
        }); 

    },
    //获取授权Code
    getUserInfo:function(success){

         let app =  getApp();

         //判断是否已经获取到用户信息
        if(app.userInfo.id!=-1)
        {
            success(app.userInfo);
            return;
        }

         my.getAuthCode({
            scopes: 'auth_user',
            success: (res) => {
                //获取用户信息
                tools.ajax("api/user/",{code:res.authCode,type:1},"POST",function(resp){
                    console.log(resp);
                    if(resp.code==0){
                        my.setStorage({
                          key: 'userInfo', // 缓存数据的 key
                          data: resp.data, // 要缓存的数据
                          success: (res) => {
                            //设置用户信息至app
                            app.userInfo=resp.data;
                          },
                        });
                        //回调函数
                        success(resp.data);
                        return;
                    }
                    my.showToast({content:"获取用户信息失败，请稍后重试"});
                });
            },
            fail:(res)=>{
                my.confirm({
                  content: '授权后才能继续执行哦！', // alert 框的标题
                  confirmButtonText:'继续授权',
                  cancelButtonText:'取消',
                  success: (res) => {
                    tools.getAuthCode(success);
                  },
                });
            }
        });
    },
    //设置全局变量
    setParams:function(objKey,objVal){
        //设置本地值
        let globalData  = getApp().globalData;

        globalData[objKey]  = objVal;

    },
    //获取全局变量
    getParams:function(objKey,del){
        let globalData = getApp().globalData;

        let val=globalData[objKey];

        if(val==undefined)
            return null;

        if(del==true){
            delete globalData[objKey];
        } 
        return val;
    },
    getSign:function(params){

    }
};
export {tools};
