import {tools} from '/common/js/common.js'
Page({
    data:{
        order:{
            name:"",
            commoditys:[{id:1001,title:'',price:10,size:10}],
            pay:15.00,
            orderNum:'',
            payType:'',
            createTime:'',
            invoice:'',
            orderState:'',
            receiver:{
                name:'',
                sex:'',
                tel:'',
                addrDetail:''
            }
        }
    },
    onLoad:function(){
        let orderNum = tools.getParams("orderNum",true); 
        console.log(orderNum);
        //加载数据
        this.privLoadData(orderNum);
    },
    privLoadData:function(orderNum){

        let _this =  this;

        //读取数据
        tools.ajax("api/order/"+orderNum,null,"GET",function(resp){
            if(resp.code!=0){
                return;
            }

           let tmpOrder={
               pay:resp.data.orderPay,
               orderNum:orderNum,
               createTime:resp.data.createTime,
               invoice:resp.data.invoice,
               orderState:resp.data.orderStateText,
               commoditys:[],
               receiver:{
                name:resp.data.receiver.name,
                sex:resp.data.receiver.sex,
                tel:resp.data.receiver.tel,
                addrDetail:resp.data.receiver.addrDetail,
               }
               };

            resp.data.detailList.forEach((item)=>{
                tmpOrder.commoditys.push({title:item.outTitle,price:item.outPrice,size:item.outSize});
            });

           //设置标题
           tmpOrder.name=tmpOrder.commoditys[0].title;

            _this.setData({order:tmpOrder});
        });

    }
})