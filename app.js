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
    apiHost: 'http://wxcard.com.cn/', //'http://localhost:8081/',
    networkAvailable:true,
    //店铺名称
    showName:"",
    //最低起送价
    minTakePrice:0.0,
    //店铺营业开始时间,
    startBusiTime:"09:00",
    //结束营业时间
    endBusiTime:"10:00",
    //店铺状态 1:营业 2:休息中
    shopState:1,
    //客桌Id
    deskId:-1,
    //商户Id 
    customerId:-1,
    //客户端类型
    clientType:'AlipayMiniprogram',
    //是否显示跳转提交联系人我们提示
    showContact:false,
    //版本
    version: "1.0.1"
  },
  //全局对象
  globalData:{},
  onError:function(){
    console.log('出错')
  },
  onLaunch:function(option){
     console.log(option)
   let _this =this;
   this.globalData.option = option;

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
  },
  onShow:function(){
    //加载数据
    if(this.globalData.option){
      this.privInitParams(this.globalData.option);
    }
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
    console.log(option)
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
        if(resp.data){
         //商户id
          _this.config.customerId=resp.data.customerId;
          //桌号
          if(resp.data.deskId){
            _this.config.deskId = resp.data.deskId;
          }
          //设置店铺信息
          if(resp.data.shop){
            _this.config.shopName=resp.data.shop.name;
            _this.config.minTakePrice=resp.data.shop.minOrderPrice;
            _this.config.startBusiTime=resp.data.shop.businessStart;
            _this.config.endBusiTime=resp.data.shop.businessEnd;
            _this.config.shopState = resp.data.shop.state;
            _this.config.showContact = (resp.data.showContact==="true");
            my.setNavigationBar({title:_this.config.shopName});
          }
           //添加至缓存
           my.setStorageSync({
             key: 'app.config', // 缓存数据的key
             data: _this.config, // 要缓存的数据
           });
        };

      }); 
  }
});
