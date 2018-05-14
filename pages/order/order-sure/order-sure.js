import {tools} from '/common/js/common.js'
import {pay} from '/common/js/pay.js'
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
        dinnerIndex:0,
        order:{
            //菜单
            menuArry:[
                {id:1001,title:'黄焖鸡米饭',price:10.00,count:1},
            ],
            //优惠券
            activeArry:[
                {id:1002,atype:1,title:'满30立减10元',price:-10},
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
            //订单状态 [102:提交订单 103:待支付]
            orderState:102, 
            invoice:'商家不支持开发票',
            addr:{
                tel:'',
                addrDetail:'',
                lng:0,
                lat:0,
                sex:'',
                name:''
            }
        },
        //临时订单信息 
        temOrder:{}
    },
    onLoad:function(e){

        let temOrder = tools.getParams("temOrder");

        //加载订单信息
        if(temOrder!=null){ 
            this.privInitOrder(temOrder);
        }
    },
    onShow:function(){
        //获取参数 
        let  orderRemark  =tools.getParams("orderRemark",true); 
       if(orderRemark){
           this.data.orderRemark=orderRemark; 
           this.setData({"order.remark":orderRemark.text}); 
       }
       
       //获取参数 
       let choiseAddr = tools.getParams("choiseAddr",true);
       if(choiseAddr){
            this.data.order.addr=Object.assign(choiseAddr);
            this.setData({"order.addr":this.data.order.addr}); 
       }

    },
    //用餐人数
    bindDinner:function(e){
        let _index =parseInt(e.detail.value);
        this.data.order.dinner=this.data.dinner[_index].text;
        this.setData({
            dinnerIndex:_index,
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
    //提交订单
    bindSubmit:function(e){ 

        let dataOrder  = this.data.order;

        let reqOrder={
            //用餐人数
            orderMealsNum:this.data.dinner[this.data.dinnerIndex].text,
            //描述
            orderRemark:dataOrder.remark,
            //订单发票信息
            orderInvoice:dataOrder.invoice,
            //订单支付类型  1:支付宝  2：微信 3：现金
            orderPayType:1,
            //收货人信息
            receiver:dataOrder.addr,  
            //设置状态 请求支付 
            orderState:dataOrder.orderState, 
        };

        if(!this.privVerifyOrder(reqOrder)) return;

        //合并对象
        reqOrder = Object.assign(this.data.temOrder,reqOrder);
  
        tools.ajax("api/order/",JSON.stringify(reqOrder),"POST",(resp)=>{
             
            //状态为待支付
            if(resp.code==0 && resp.data.orderState==103){
                //设置请求状态
                dataOrder.orderState=resp.data.orderState;

                //支付
                pay.tradePay(resp.data.alipayOrderStr,resp.data.id,(succes)=>{
                    tools.setParams("orderId",resp.data.id);
                    my.redirectTo({url:"/pages/order/order-detail/order-detail?123"});
                });
            }

        },{headers: {"Content-Type":"application/json"}}); 
    },
    //加载订单信息
    privInitOrder:function(orderInfo){
        
        //保存订单数据
        this.data.temOrder= orderInfo;

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
    },
    //验证订单内容
    privVerifyOrder:function(orderInfo){

        if(orderInfo.receiver.addrDetail==''){
            my.alert({title:"提示",content:"请选择收货地址"});
            return false;
        }

        return true; 
    }
});