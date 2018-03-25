Page({
    data:{
        model:{
            icon:'/img/icon_head_a.png',
            nick:'',
        }
    },
    bindCoupon:function(e){
        my.navigateTo({url:"/pages/me/me-coupon/me-coupon"});
    },
    bindAddr:function(e){
         my.navigateTo({url:"/pages/me/me-addr/me-addr"});
    },
    bindExit:function(){
        
    }    
});