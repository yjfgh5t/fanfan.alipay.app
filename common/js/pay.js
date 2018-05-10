
let pay={

    tradePay:function(orderStr){

         my.tradePay({
            orderStr: resp.data.alipayOrderStr,  // 即上述服务端已经加签的orderSr参数
            success: (res) => {
                    my.alert({
                        content: JSON.stringify(res),
                });
            },
            fail: (res) => {
                my.alert({
                    content: JSON.stringify(res),
                });
            } 
         }); 


    },

}



