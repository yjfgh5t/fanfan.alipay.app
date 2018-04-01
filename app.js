App({
  todos: [
    { text: 'Learning Javascript', completed: true },
    { text: 'Learning ES2016', completed: true },
    { text: 'Learning 支付宝小程序', completed: false },
  ],
  userInfo: null,
  config:{
    apiHost:'http://m.wxcard.com.cn/',
    networkAvailable:true,
  },

  globalData:{},
  onLaunch:function(){
   
    //监听网咯状态
    my.onNetworkStatusChange(function(res){
      this.config.networkAvailable = res.networkAvailable;
    });

    //获取网咯状态 
    my.getNetworkType({success: (res) => { 
        this.config.networkAvailable = res.networkAvailable;
      }
    });

    //设置用户信息
    my.getStorage({
      key: 'userInfo', // 缓存数据的 key
      success: (res) => {
        if(res!=null  &&  res.data!=null){
          this.userInfo = res.data;
        }
      },
    });

  },
  getUserInfo() {
    return new Promise((resolve, reject) => {
      if (this.userInfo) resolve(this.userInfo);

      my.getAuthCode({
        scopes: ['auth_user'],
        success: (authcode) => {
          console.info(authcode);

          my.getAuthUserInfo({
            success: (res) => {
              this.userInfo = res;
              resolve(this.userInfo);
            },
            fail: () => {
              reject({});
            },
          });
        },
        fail: () => {
          reject({});
        },
      });
    });
  },
  onShow:function(){
     
  },
});
