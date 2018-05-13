let pay={ 
    tradePay:function(orderStr,callback){ 
         my.tradePay({
            orderStr: orderStr,  // 即上述服务端已经加签的orderSr参数
            success: (res) => { 
                if(res.resultCode!=9000){
                    my.alert({title:"支付失败!支付宝返回"+res.resultCode});
                } 
               callback(true);
            },
            fail: (res) => {
             my.alert({title:"支付失败!支付宝返回"+res.resultCode}); 
             callback(false);
            } 
         });  
    },
};
export {pay};



