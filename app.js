import {tools} from '/common/js/common.js'
App({
  //用户信息
  userInfo: {}, //{id:0,userNick:'',userMobile:'',userIcon:'',userSex:1,userState:1}
  //客户端类型
  clientType:'AlipayMiniprogram',
  //应用顾客id
  appCustomerId:132,
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
    _this.privInitParams();
  },
  onShow:function(option){
     
     if(option.query){
       if(option.query.customerId){
         this.appCustomerId=option.query.customerId;
       }
     }
  },
  //获取基础信息 
  privInitParams:function(){
 
    let _this = this;

      tools.ajax("api/info/",{},"GET",(resp)=>{

        //设置值
        if(resp.data.dict){
          _this.config.shopName=resp.data.dict[1021];
          _this.config.minTakePrice=parseFloat(resp.data.dict[1022]);
          _this.config.startBusiTime=resp.data.dict[1011];
          _this.config.endBusiTime=resp.data.dict[1012];
        };

      }); 
  }
});
