import {tools} from '/common/js/common.js';
import {pay} from '/common/js/pay.js';
Page({
    data:{
        order:{
            name:"",
            commoditys:[{id:1001,title:'',price:10,size:10}],
            pay:15.00,
            orderId:0,
            orderNum:'', 
            payType:'',
            createTime:'',
            lastPayTime:0,
            invoice:'',
            orderState:'',
            mainImg:'',
            alipayOrderStr:'',
            receiver:{
                name:'',
                sex:'',
                tel:'',
                addrDetail:''
            }
        },
        endPayText:'',
    },
    onShow:function(){
        let orderId =this.data.order.orderId==0?tools.getParams("orderId",true):this.data.order.orderId;  
        //加载数据
        this.privLoadData(orderId);
    },
    //取消订单
    bindChanel:function(){
        
        let _this = this;

        my.confirm({
            title: '提示',
            content: '确认取消改订单吗',
            success:(result)=>{
                if(result.confirm){ 
                    tools.ajax("api/order/cancel/"+_this.data.order.orderId,null,"POST",function(resp){
                        if(resp.code==0){
                            my.redirectTo({url:"/pages/index/index"}); 
                        }
                    }); 
                }
            }
        });

    },
    //支付
    binPay:function(){ 
        let _this= this;
        //支付
        pay.tradePay(_this.data.order.alipayOrderStr,_this.data.order.orderId,(succes)=>{
            if(succes){
                tools.setParams("orderId",_this.data.order.orderId);
                _this.onShow();
            }
        }); 
    },
    privLoadData:function(orderId){

        let _this =  this;

        //读取数据
        tools.ajax("api/order/"+orderId,null,"GET",function(resp){
            if(resp.code!=0){
                return;
            }

           let tmpOrder={
               pay:resp.data.orderPay,
               orderId:orderId,
               orderNum:resp.data.orderNum,
               createTime:resp.data.createTime,
               lastPayTime:resp.data.lastPayTime,
               invoice:resp.data.invoice,
               orderState:resp.data.orderState,
               orderStateText:resp.data.orderStateText,
               mainImg:resp.data.mainImg,
               alipayOrderStr:resp.data.alipayOrderStr,
               commoditys:[],
               receiver:{
                name:resp.data.receiver.name,
                sex:resp.data.receiver.sex,
                tel:resp.data.receiver.tel,
                addrDetail:resp.data.receiver.addrDetail,
               }
               };

            resp.data.detailList.forEach((item)=>{
                tmpOrder.commoditys.push({title:item.outTitle,price:item.outPrice,size:item.outSize});
            });

           //设置标题
           tmpOrder.name=tmpOrder.commoditys[0].title;

           //倒计时
           if(tmpOrder.orderState==103) _this.privEndPayTime(tmpOrder.lastPayTime);

           _this.setData({order:tmpOrder});
        });

    }, 
    //显示支付倒计时
    privEndPayTime:function(endTiemSecond){
 
        let _this =this;

        //刷新文本函数
        let _refshText = function(){

            //刷新当前订单
            if(endTiemSecond<0) {
                clearInterval(interval);
                //设置参数
                //tools.setParams("orderNum",_this.data.order.orderNum);
                //跳转值首页
                my.redirectTo("/pages/index/index");
            };

            let second=endTiemSecond%60,minute=parseInt(endTiemSecond/60);

            let endPayText="还剩";
            //拼接分
            if(minute>0) endPayText+= minute+"分";
            //拼接秒
            endPayText+= second+"秒";

            _this.setData({"endPayText":endPayText});

            endTiemSecond--;

        }

        let interval = setInterval(_refshText,1000);

        //初始执行一次
        _refshText();
    }
})