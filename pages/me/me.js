import {tools} from '/common/js/common.js'
Page({
    data:{
        model:{
            icon:'/img/icon_head_a.png',
            nick:'',
        }
    },
    onLoad:function(e){

        let _this =this ;

        tools.getUserInfo((user)=>{ 
            _this.setData({model:{icon:user.userIcon,nick:user.userNick}}); 
        });

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