import {tools} from '/common/js/common.js'
Page({
    data:{
        name:'hellow',
        defaultImg:'/img/img_item_default.png',
        dinner: [
            {id:1,text:'1人'},
            {id:2,text:'2人'},
            {id:3,text:'3人'},
            {id:4,text:'4人'},
            {id:5,text:'5人'},
            {id:6,text:'6人'},
            {id:7,text:'7人'},
            {id:8,text:'8人'},
            {id:9,text:'9人'},
            {id:10,text:'10人以上'},
        ],
        dinnerIndex:-1,
        order:{
            //菜单
            menuArry:[
                {id:1001,title:'黄焖鸡米饭',price:10.00,count:1},
                {id:1002,title:'黄焖排骨饭',price:15.00,count:1},
                {id:1003,title:'黄焖鸭腿饭',price:10,count:1},
                {id:1004,title:'黄焖鸡米饭-小份',price:10,count:1},
                {id:1005,title:'黄焖鸡米饭-大份',price:10,count:1},
            ],
            //优惠券
            activeArry:[
                {id:1002,atype:1,title:'满30立减10元',price:-10},
                {id:1003,atype:2,title:'满20立减5元',price:-10}
            ],
            //其它
            otherArry:[
                {id:1001,title:'餐盒',count:0,price:2.0},
                {id:1001,title:'配送费',count:0,price:2.0},
            ],
            total:82.00,
            discount:23.00,
            pay:69.00,
            //用餐人数
            dinner:'',
            //订单描述
            remark:'',
            addr:{
                tel:'',
                addrDetail:'',
                lon:0,
                lat:0,
                sex:'',
                name:''
            }
        },
    },
    onLoad:function(e){

        let globalData = getApp().globalData;

        //加载订单信息
        if(globalData.temOrder){ 
            this.privInitOrder(globalData.temOrder);
        }
    },
    onShow:function(){
       var globalData = getApp().globalData;
       if(globalData.orderRemark)
       {
           this.data.orderRemark=globalData.orderRemark; 
           this.setData({
               "order.remark":globalData.orderRemark.text
            });
            globalData.orderRemark=undefined;
       }
       
       if(globalData.choiseAddr)
       {
            this.data.order.addr=Object.assign(globalData.choiseAddr);
            this.setData({
               "order.addr":this.data.order.addr
            });
            globalData.choiseAddr=undefined;
       }

    },
    //用餐人数
    bindDinner:function(e){
        this.setData({
            dinnerIndex:parseInt(e.detail.value),
        });
    },
    //输入描述
    bindRemark:function(e){
        //设置数据
        if(this.data.orderRemark){
            getApp().globalData.orderRemark=this.data.orderRemark;
        }
        my.navigateTo({
          url: '/pages/order/order-remark/order-remark', // 需要跳转的应用内非 tabBar 的页面的路径，路径后可以带参数。参数与路径之间使用
        });
    },
    //选择地址
    bindChoiseAddr:function(e){
        my.navigateTo({
          url: '/pages/me/me-addr/me-addr?choise=true', // 需要跳转的应用内非 tabBar 的页面的路径，路径后可以带参数。参数与路径之间使用
        });
    },
    //加载订单信息
    privInitOrder:function(orderInfo){
        
        let dataOrder ={menuArry:[],activeArry:[],otherArry:[]};

        //菜单
        dataOrder.menuArry = orderInfo.detailList
        .filter(function(item){ return item.outType==1; })
        .map(function(item){  return  {id:item.id,title:item.outTitle,price:item.outPrice,count:item.outSize} });

        //优惠券 todo

        //其它 todo

        //金额
        dataOrder.total=orderInfo.orderTotal;
        //优惠金额
        dataOrder.discount = orderInfo.orderDiscountTotal;
        //支付金额 
        dataOrder.pay = orderInfo.orderPay; 

        this.setData({
            "order.menuArry":dataOrder.menuArry,
            "order.activeArry":dataOrder.activeArry,
            "order.otherArry":dataOrder.otherArry,
            "order.total":dataOrder.total,
            "order.discount":dataOrder.discount,
            "order.pay":dataOrder.pay,
        });
    }
});