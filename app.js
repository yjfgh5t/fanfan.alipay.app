import {tools} from '/common/js/common.js'
App({
  //用户信息
  userInfo: {
    id: -1,
    userNick: '',
    userMobile: '',
    userIcon: '',
    userSex: 1,
    userState:1
  },
  //配置信息
  config:{
    apiHost:'http://localhost:8081/',   //'http://wxcard.com.cn/',
    networkAvailable:true,
    //店铺名称
    showName:"",
    //最低起送价 
    minTakePrice:0.0,
    //店铺营业开始时间,
    startBusiTime:"09:00",
    //结束营业时间
    endBusiTime:"10:00",
    //客桌Id
    deskId:-1,
    //商户Id
    customerId:-1,
    //客户端类型
    clientType:'AlipayMiniprogram',
  },
  //全局对象
  globalData:{},

  onLaunch:function(option){
   let _this =this;
    //监听网咯状态
    my.onNetworkStatusChange(function(res){
      _this.config.networkAvailable = res.isConnected;
    });

    //获取网咯状态 
    my.getNetworkType({success: (res) => { 
        _this.config.networkAvailable = res.networkAvailable;
      }
    });

    //设置用户信息
    my.getStorage({
      key: 'userInfo', // 缓存数据的 key
      success: (res) => {
        if(res!=null  &&  res.data!=null){
          _this.userInfo = res.data;
        }
      },
    });
 
    //加载数据
    _this.privInitParams(option);
  },
  onShow:function(option){
    //设置配置信息
     if(this.config.customerId==-1){
       let config =  my.getStorageSync({key:'app.config'});
       if(config!=null && config.customerId){
         debugger
          this.config = config;
       }
     } 
  },
  //获取基础信息 
  privInitParams:function(option){
    let qrcode='';
    if(option.query && option.query.qrCode){
       let temcode = option.query.qrCode;
       if(temcode.indexOf('qrcode=')>0){
         temcode = temcode.split('qrcode=')[1];
         if(temcode.length==32){
           qrcode = temcode;
         } 
       }
    }

    let _this = this;
      tools.ajax("api/info/",{qrcode:qrcode},"GET",(resp)=>{
        //设置值
        if(resp.data.dict){
          _this.config.shopName=resp.data.dict[1021];
          _this.config.minTakePrice=parseFloat(resp.data.dict[1022]);
          _this.config.startBusiTime=resp.data.dict[1011];
          _this.config.endBusiTime=resp.data.dict[1012];
          _this.config.customerId=resp.data.dict[9101];
          if(resp.data.dict[9102]){
            _this.config.deskId = resp.data.dict[9102];
          }
           my.setNavigationBar({title:_this.config.shopName});
           //添加至缓存
           my.setStorageSync({
             key: 'app.config', // 缓存数据的key
             data: _this.config, // 要缓存的数据
           });
        };

      }); 
  }
});
