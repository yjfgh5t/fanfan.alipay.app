import {tools} from '/common/js/common.js'


let pay={ 
    tradePay:function(orderStr,orderId,callback){ 
         my.tradePay({
            //tradeNO:orderStr,  // 即上述服务端已经加签的orderSr参数
            orderStr:orderStr,
            success: (res) => {  
                console.log(res.result);
                let responData=JSON.parse(res.result); 
                //验证支付
                tools.ajax("api/alipay/"+orderId,{orderNum:responData.alipay_trade_app_pay_response.trade_no},"GET",function(httpRes){
                    if(httpRes){
                        callback(true);
                    }else{
                        callback(true);
                    }
                });
            },
            fail: (res) => { 
             callback(false);
            } 
         });  
    },
};
export {pay};



