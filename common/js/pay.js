import {tools} from '/common/js/common.js'


let pay={ 
    tradePay:function(orderStr,orderId,callback){ 
         my.tradePay({
            //tradeNO:orderStr,  //即上述服务端已经加签的orderSr参数
            orderStr:orderStr,
            success: (res) => {  
                console.log(res.result);
                let responData=JSON.parse(res.result); 
                //提交数据
                let reqModel={
                    appId:responData.app_id,
                    appId:responData.out_trade_no,
                    tradeNo:responData.trade_no,
                    totalAmount:responData.total_amount,
                    sellerId:responData.seller_id,
                    notifyTime:responData.timestamp, 
                };
                //验证支付
                tools.ajax("api/order/checkPay/"+orderId,JSON.stringify(reqModel),"POST",function(httpRes){
                    if(httpRes){
                        callback(true);
                    }else{
                        callback(false);
                    }
                },{headers: {"Content-Type":"application/json"}});
            },
            fail: (res) => { 
                callback(false);
            } 
         });  
    },
};
export {pay};



