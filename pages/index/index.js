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
        showMark:false,
        itemArry:[
            //{id:'1001',title:'招聘黄焖鸡米饭-A',active:[{atype:1,text:'前场九折起'}],price:18.1,salePrice:12, icon:'/img/img_item_default.png',desc:'黄焖鸡米饭 、红烧排骨粉黄焖鸡米饭黄黄'},
        ],
        carData:{
            show:false,
            //{id:'',title:'',type:1/5}
            itemArry:[],
            //{id:count }
            itemIdArry:{},
            //总数量
            count:0,
            //总金额
            price:0,
            //起送价格
            minPrice:0.0
      },
      norms:{
          show: false,
          selected:{},
          commodity:{},
          items:[]
      }
    },
    onReady:function(){
        //my.showLoading();
        this.lazyLoad(this);
    },
    onShow:function(){
         //清空购物车
         this.privClearCar();  
    },
    lazyLoad:function(that){
        if(getApp().config.customerId==-1){
           console.log(1);
           setTimeout(()=>{that.lazyLoad(that)},1000);
       }else{
           console.log(2);
           that.loadData(); 
       }
    },
    //加载数据
    loadData:function(){
        let _this = this;  
        let _app = getApp();
        tools.ajax('api/commodity/',{},'GET',function(res){
            console.log(res.data);
            if(res.code==0){ 
                _this.setData({"itemArry":res.data,"carData.minPrice":_app.config.minTakePrice});   
                my.setNavigationBar({title:_app.config.shopName});
                //设置商品数据
                _this.setData({
                    "itemArry": _this.convertComodity(res.data),
                    "carData.minPrice":_app.config.minTakePrice,
                    "isBusiness": _app.config.shopState==1
                    });
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
    itemAddMinus: function(e){
        const option = e.target.dataset.option;
        const commodity ={id:e.target.dataset.id};

        //购物车中的commodityid
        if( e.target.dataset.commodityId){
            commodity.commodityId = e.target.dataset.commodityId;
        }

        let model=null;
   
        for(let i=0;i<this.data.itemArry.length;i++){
            if(this.data.itemArry[i].id==commodity.id){
                model = this.data.itemArry[i];
                break;
            }
        }
        
        //判断规格
        if(model !=null && model.norms.length>0){
            if(option==='add'){
                //显示规格
                    let norms = {
                        commodity:model,
                        selected: model.norms[0],
                        show:true,
                        items:model.norms
                    }
                this.setData({norms:norms,showMark:true});
                return;
            }else{
                return my.showToast({content:'多规格商品需在购物车中删除'});
            }
        }
        //包装数据
        if(model !=null){
            commodity.id = model.id;
            commodity.title = model.title;
            commodity.salePrice = model.salePrice;
            commodity.commodityId = model.id;
        }

        //类型 1:商品 5:商品规格
        commodity.type = (commodity.id == commodity.commodityId?1:5);

        //执行添加或减去
        this.addMinus(option,commodity);
    },
    //添加减去商品
    addMinus:function(option,commodity){
       //选种的商品数据
       let carItemData=this.data.carData.itemArry;
       //商品Id数据
       let carItemIds=this.data.carData.itemIdArry;

       //设置数据
       if(carItemIds[commodity.id]==undefined)
        {
            //设置默认数据
            carItemIds[commodity.id]=0;
            carItemData.push({id:commodity.id,title:commodity.title,salePrice:commodity.salePrice,commodityId:commodity.commodityId,type:commodity.type});
        }

        //添加数量
        let addCount= option=='add'?1:-1; 

        if((carItemIds[commodity.id]+addCount)<=0){
            //删除数据 
            delete carItemIds[commodity.id];
            //删除数组
            for(let i in carItemData){
                if(carItemData[i].id==commodity.id){
                    carItemData.splice(i,1);
                }
            }
            //删除规格-商品的数据
            if(commodity.id !== commodity.commodityId){
                //删除数据 
                if((carItemIds[commodity.commodityId]+addCount)<=0){
                    delete carItemIds[commodity.commodityId];
                }else{
                      carItemIds[commodity.commodityId]=carItemIds[commodity.commodityId]+addCount;
                }
            }
        }else{
           carItemIds[commodity.id]=carItemIds[commodity.id]+addCount;
           //如果id未规格id
           if(commodity.id !== commodity.commodityId){
               if(carItemIds[commodity.commodityId]==undefined){
                   carItemIds[commodity.commodityId]=0;
               }
              carItemIds[commodity.commodityId]=carItemIds[commodity.commodityId]+addCount;
           }
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
    //选择规格
    bindSelNorms:function(e){
        const id =  e.target.dataset.id;
        let _this = this;
        this.data.norms.items.forEach(function(item){
            if(item.id===id){
                _this.setData({"norms.selected":item});
                return false;
            }
        });
    },
    bindChoiseNorms:function(e){
        let sure = e.target.dataset.sure;
        if(sure=='true'){
            let norms = this.data.norms;
            let commodity ={
                id: norms.selected.id,
                title: norms.commodity.title+"-"+norms.selected.title,
                salePrice: norms.selected.price,
                commodityId: norms.commodity.id,
                type:5
            };
            this.addMinus('add',commodity);
        }
        this.setData({"norms.show":false,"showMark":false});
    },
    //提交按钮
    bindSubmit:function(e){
    
        //选择的菜单
       let idArry = this.data.carData.itemIdArry;

       let itemArry = this.data.carData.itemArry;

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
            itemArry.forEach(function(item){
                orderReq.detailList.push({
                    outId:item.id,
                    outSize:idArry[item.id],
                    outType:item.type,
                    commodityId:item.commodityId
                });
            })

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
    },
    //转换商品数据
    convertComodity:function(commoditys){
        let tempCommodity=[];
        commoditys.forEach(function(item){

            let norms = [];
            if(item.extendList!=null && item.extendList.length>0){
               norms = item.extendList.map(function(item){
                    return {
                        id:item.id,
                        price:item.commodityPrice,
                        title:item.title
                    }
                });
            }

            tempCommodity.push({
                id: item.id,
                title: item.title,
                price: item.price,
                salePrice: item.salePrice,
                icon: item.icon,
                desc: item.desc,
                active: item.active,
                norms: norms
            })
        })

        return tempCommodity;
    }
});