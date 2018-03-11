Page({
    data:{
        name:'hellow',
        headImg:'/img/img_index_head.jpeg',
        defaultImg:'/img/img_item_default.png',
        btnMinus:'/img/icon_btn_minus.png',
        btnAdd:'/img/icon_btn_add.png',
        btnCar:'/img/icon_btn_car.png',
        showMark:false,
        itemArry:[
            {id:'1001',title:'招聘黄焖鸡米饭',active:[{atype:1,text:'前场九折起'}],price:'25',icon:'/img/img_item_default.png',desc:'黄焖鸡米饭 、红烧排骨粉黄焖鸡米饭黄黄'},
            {id:'1001',title:'招聘黄焖鸡米饭',active:[{atype:2,text:'满30减20'}],price:'25',icon:'/img/img_item_default.png',desc:'黄焖鸡米饭 、红烧排骨粉黄焖鸡米饭黄黄焖鸡米饭 、红烧排骨粉黄焖鸡米饭黄'},
            {id:'1001',title:'招聘黄焖鸡米饭',active:[{atype:2,text:'满30减20'}],price:'25',icon:'/img/img_item_default.png',desc:'黄焖鸡米饭 、红烧排骨粉黄焖鸡米饭黄黄焖鸡米饭 、红烧排骨粉黄焖鸡米饭黄'},
            {id:'1001',title:'招聘黄焖鸡米饭',active:[],price:'25',icon:'/img/img_item_default.png',desc:'黄焖鸡米饭 、红烧排骨粉黄焖鸡米饭黄黄焖鸡米饭 、红烧排骨粉黄焖鸡米饭黄'},
            {id:'1001',title:'招聘黄焖鸡米饭',price:'25',icon:'/img/img_item_default.png',desc:'黄焖鸡米饭 、红烧排骨粉黄焖鸡米饭黄黄'},
            {id:'1001',title:'招聘黄焖鸡米饭',price:'25',icon:'/img/img_item_default.png',desc:'黄焖鸡米饭 、红烧排骨粉黄焖鸡米饭黄黄焖鸡米饭 、红烧排骨粉黄焖鸡米饭黄'},
            {id:'1001',title:'招聘黄焖鸡米饭',price:'25',icon:'/img/img_item_default.png',desc:'黄焖鸡米饭 、红烧排骨粉黄焖鸡米饭黄黄焖鸡米饭 、红烧排骨粉黄焖鸡米饭黄'},
            {id:'1001',title:'招聘黄焖鸡米饭',price:'25',icon:'/img/img_item_default.png',desc:'黄焖鸡米饭 、红烧排骨粉黄焖鸡米饭黄黄焖鸡米饭 、红烧排骨粉黄焖鸡米饭黄'},
        ],
        carData:{
            show:false,
            itemArry:[]
      }
    },
    //显示购物车
    showCar:function(e){
        
        if(this.data.carData.itemArry.length==0){
            my.showToast({content:'购物车还是空的哦'});
            return;
        }
        this.setData({
            showMark:true,
            carData:{show:true},
        }
        );
    },
    //关闭购物车
    closeCar:function(e){  
        this.setData({
            showMark:false,
            carData:{show:false},
        });
    }
});