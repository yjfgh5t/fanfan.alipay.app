import {tools} from '/common/js/common.js'
Page({
    data:{
        name:'hellow',
        headImg:'/img/img_index_head.jpeg',
        defaultImg:'/img/img_item_default.png',
        btnMinus:'/img/icon_btn_minus.png',
        btnAdd:'/img/icon_btn_add.png',
        btnCar:'/img/icon_btn_car.png',
        btnClose:'/img/icon_btn_add_white.png',
        btnUser:'/img/icon_head.png',
        showMark:false,
        itemArry:[
            //{id:'1001',title:'招聘黄焖鸡米饭-A',active:[{atype:1,text:'前场九折起'}],price:18.1,salePrice:12, icon:'/img/img_item_default.png',desc:'黄焖鸡米饭 、红烧排骨粉黄焖鸡米饭黄黄'},
        ],
        carData:{
            show:false,
            //{id:'',title:'',}
            itemArry:[],
            //{id:count }
            itemIdArry:{},
            //总数量
            count:0,
            //总金额
            price:0,
            //起送价格
            minPrice:0.0,
      }
    },
    onLoad:function(){
        let _this = this;
       if(getApp().config.customerId==-1){ 
            my.showLoading();
           let interval =  setInterval(function(){
                    my.hideLoading();
                    _this.loadData();
                    clearInterval(interval);
           },2000);
       }else{
           this.loadData(); 
       }
    },
    onShow:function(){
         //清空购物车
         this.privClearCar();  
    },
    //加载数据
    loadData:function(){
        let _this = this;  
        let _app = getApp();
        tools.ajax('api/commodity/',{},'GET',function(res){
            console.log(res.data);
            if(res.code==0){ 
                _this.setData({"itemArry":res.data,"carData.minPrice":_app.config.minTakePrice});
            }
        });
    },
    //显示购物车
    showCar:function(e){
        this.setData({
            'showMark':true,
            'carData.show':true,
        }
        );
    },
    //关闭购物车
    closeCar:function(e){  
        this.setData({
            'showMark':false,
            'carData.show':false,
        });
    },
    minusClick:function(e){
     console.log(e.target.id);
    },
    addClick:function(e){
        console.log(e.target.id);
    },
    //添加减去商品
    itemAddMinus:function(e){
       const target = e.target.dataset;
       let  model={};
       //选种的商品数据
       let carItemData=this.data.carData.itemArry;
       //商品Id数据
       let carItemIds=this.data.carData.itemIdArry;
       //设置数据
       if(carItemIds[target.id]==undefined)
        {
            //添加数据
            this.data.itemArry.forEach(function(item) {
                if(item.id==target.id){
                 model=item;
                 //设置默认数据
                 carItemIds[target.id]=0;
                 carItemData.push({id:item.id,title:item.title,salePrice:item.salePrice});
                }
            });
        }

        //添加数量
        let addCount= target.option=='add'?1:-1; 

        if(carItemIds[target.id]+addCount<=0){
            //删除数据 
            delete carItemIds[target.id];
            //删除数组
            for(let i in carItemData){
                if(carItemData[i].id==target.id){
                    carItemData.splice(i,1);
                }
            }
        }else{
           carItemIds[target.id]=carItemIds[target.id]+addCount;
        }

        //计算总数量
        let count=0,price=0;
        carItemData.forEach(function(item){
            count +=carItemIds[item.id];
            price +=carItemIds[item.id]*item.salePrice;
        });

        //设置数据
        this.setData({
            'carData.itemArry':carItemData,
            'carData.itemIdArry':carItemIds,
            'carData.count':count,
            'carData.price':price.toFixed(2), 
        });
    },
    //提交按钮
    bindSubmit:function(e){ 
        //选择的菜单
       let idArry = this.data.carData.itemIdArry;

       //全局变量
       let globalData = getApp().globalData;

       tools.getUserInfo(function(userInfo){
        
        //订单提交对象
        let orderReq={
            userId:userInfo.id,
            detailList:[],
            receiver:{},
        };
        
        //商品添加到集合
        for(let key in idArry){
            orderReq.detailList.push({
                outId:key,
                outSize:idArry[key],
                outType:1
            });
        } 
        //创建临时订单
        tools.ajax("api/order/",JSON.stringify(orderReq),"POST",function(resp){

            if(resp.code==0){
                //订单信息存入全局变量
                 tools.setParams("temOrder",resp.data);

                //跳转
                my.navigateTo({
                    url:'/pages/order/order-sure/order-sure'
                });
            }

        },{headers: {"Content-Type":"application/json"}}); 

       });
    },
    //form提交事件
    formSubmit:function(e){
        if(e.detail.formId){
           tools.ajax('api/formId/',{formId:e.detail.formId},'POST',function(res){
            console.log(res.code)
           })
        }
    },
    //清空购物车
    privClearCar:function(){

        //是否清空购物车
        let clearCar = tools.getParams("clearCar",true); 

        if(clearCar!=null){ 
            this.setData({
                'showMark':false,
                'carData.show':false,
                'carData.itemArry':[],
                'carData.itemIdArry':{},
                'carData.count':0,
                'carData.price':0,
            });
        }
    },
    userClick:function(){
        my.navigateTo({
                    url:'/pages/me/me'
                })
    }
});