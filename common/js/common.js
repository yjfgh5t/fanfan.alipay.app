let tools={
    //异步请求
    ajax:function(pathname,data,method,success,option){
        //进度条 
        my.showLoading(); 
        //配置信息
        let app =  getApp();
        //请求信息
        let request = {
          url: app.config.apiHost + pathname,
          method: method,
          data: data,
          headers: {}
        };

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

        if (request.method == "JSON") {
          request.method = "POST";
          request.headers = { "Content-Type": "application/json" }
        } else {
          request.headers = { "Content-Type": "application/x-www-form-urlencoded" }
        }

        //设置令牌
        request.headers['x-auth-token'] = app.config.authToken;

        //固定信息
        let base = {
          clientType: app.config.clientType,
          userId: app.userInfo.id,
          customerId: app.config.customerId,
          version: app.config.version,
          time: new Date().getTime()
        };
        //设置header 固定数据
        request.headers.base = JSON.stringify(base);
 
        let hidenLoading=false;

        //请求
        my.httpRequest({
            url: request.url,
            method: request.method,
            headers: request.headers,
            data: request.data,
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
                 //需要登录
                if (res.status == 401) {
                  tools.autoLogin(function(hasSuccess) {
                    //再次执行
                    if (hasSuccess) {
                      tools.ajax(pathname, data, method, success, option)
                    }
                  });
                  return;
                }
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
    getUserInfo:function(callback){
         let app =  getApp();
         //判断是否已经获取到用户信息
        if(app.userInfo.id!=-1)
        {
            callback(app.userInfo);
            return;
        }

         my.getAuthCode({
            scopes: 'auth_user',
            success: (res) => {
                //获取用户信息
              tools.ajax("api/user/alipaySave",{code:res.authCode},"POST",function(resp){
                    console.log(resp);
                    if(resp.code==0){
                        tools.autoLogin(function(hasSuccess, info) {
                          callback(info)
                        });
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
                    tools.getUserInfo(callback);
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
  //自动登录
  autoLogin: function(callback) {
    my.getAuthCode({
      scopes: 'auth_base',
      success(lres) {
        tools.ajax('api/user/userAutoLogin', { code: lres.authCode }, 'POST', function(res) {
          if (res.code == 0 && res.data != null) {
            const userInfo = {
              id: res.data.userInfo.userId,
              userNick: res.data.userInfo.tpNick,
              userIcon: res.data.userInfo.tpIcon,
              userSex: res.data.userInfo.tpSex,
              userTpId: res.data.userInfo.tpId
            }
            //设置用户信息
            getApp().userInfo = userInfo;
             //添加至缓存
            my.setStorageSync({
              key: 'userInfo', // 缓存数据的key
              data: userInfo, // 要缓存的数据
            });
            //设置登录令牌
            getApp().config.authToken = res.data.token;
            if(callback){
              callback(true, userInfo);
            }
          } else {
            if(callback){
              callback(false, null)
            }
          }
        })
      }
    });
  }
};
export {tools};
