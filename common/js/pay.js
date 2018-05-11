let pay={ 
    tradePay:function(orderStr,callback){ 
         my.tradePay({
            orderStr: orderStr,  // 即上述服务端已经加签的orderSr参数
            success: (res) => { 
               callback(true);
            },
            fail: (res) => {
             callback(false);
            } 
         });  
    },
};
export {pay};



