import {tools} from '/common/js/common.js'


let pay={ 
    tradePay:function(orderStr,orderId,callback){ 
         my.tradePay({
            //tradeNO:orderStr,  //即上述服务端已经加签的orderSr参数
            orderStr:orderStr,
            success: (res) => {  
                console.log(res.result);
                pay.checkPay(orderId,callback,1000);
            },
            fail: (res) => { 
                pay.checkPay(orderId,callback,1000);
            }
         });  
    },
    //验证是否已经支付
    checkPay:function(orderId,callback,time){
        my.showLoading();
        //进度条
        window.setInterval(function(){
            my.hideLoading();
            //验证支付
            tools.ajax("api/order/checkPay/"+orderId,{},"POST",function(res){
                if(res.code==0 && res.data==true){
                    callback(true);
                }else{
                    callback(false);
                }
            },{
            network:function(fail){
                //提示重试
                my.confirm({
                title:"网络提示",
                content:"无法连接到网络！",
                confirmButtonText:"重试",
                success: (res) => {
                    pay.checkPay(orderId,callback,1000);
                  },
                });
            }});
        },time)
    }
};

export {pay};



