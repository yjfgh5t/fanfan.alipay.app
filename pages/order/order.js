import {tools} from '/common/js/common.js'
Page({
    data:{
        orders:[
            //{id:1001,title:"套餐鸡蛋+油条+面包 丰盛的早餐 哇哈哈哈",orderStateText:"订单已完成",orderTime:"2018-04-12 08:30:22",ortherRemark:"油条等2件商品",pay:"20",pic:"/img/img_item_default.png"},
        ],
        pageIndex:1,
        //显示加载更多
        showLoadMore:false,
    },
    onShow:function(){
        this.privLoadData();
    },
    privLoadData:function(){
 
        let _this=this;

        let index= (_this.data.pageIndex-1)*10;
 
        tools.getUserInfo((user)=>{ 

            let _orders ={};
0
            //获取订单列表 
            tools.ajax("api/order/",{userId:user.id,pageIndex:_this.data.pageIndex},"GET",function(resp){
                if(resp.code!=0){
                    my.alert({title: '获取数据失败'});
                    return;
                }

                //是否显示下一页
                _this.setData({showLoadMore:!(resp.data==null || resp.data.length<10)});

                if(resp.data==null || resp.data.length==0){
                    return;
                }
               
                resp.data.forEach((item,i)=>{
                    //设置key
                    let _parmKey="orders["+index+i+"]"; 
                    _orders[_parmKey]={
                            id:item.orderNum,
                            title:item.title,
                            orderStateText:item.orderStateText,
                            orderTime:item.createTime,
                            ortherRemark:"共"+item.commodityTotal+"件商品",
                            pay:item.orderPay,
                            pic:item.commoditImg,
                    }; 
                });
 
                _this.setData(_orders); 

                _this.data.pageIndex++;
            });
        });

    },
    bindDetail:function(e){ 
        tools.setParams("orderNum",e.currentTarget.dataset.num);
        //跳转
        my.navigateTo({url:'/pages/order/order-detail/order-detail'});
    }
});