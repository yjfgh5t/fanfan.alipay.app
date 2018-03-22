Page({
    data:{
        btnEdit:'/img/icon_btn_edit.png',
        btnAdd:'/img/icon_btn_add_white.png',
        choise:false,
        addrArry:[
            {id:1001,name:'江洋',canChoise:true,tel:'15821243531',sex:'女士',addr:'上海市松江区城鸿路222号',addrDetail:'鸿路222号4号楼1103室',lon:145568.123,lat:123123},
            {id:1002,name:'江洋',canChoise:true,tel:'15821243531',sex:'先生',addr:'上海市松江区城鸿路222号',addrDetail:'鸿路222号4号楼1103室',lon:145568.123,lat:123123},
            {id:1003,name:'江洋',canChoise:false,tel:'15821243531',sex:'女士',addr:'上海市松江区城鸿路222号',addrDetail:'鸿路222号4号楼1103室',lon:145568.123,lat:123123},
            {id:1004,name:'江洋',canChoise:false,tel:'15821243531',sex:'先生',addr:'上海市松江区城鸿路222号',addrDetail:'鸿路222号4号楼1103室',lon:145568.123,lat:123123},
        ]
    },
    onLoad:function(e){
        //是否选择地址
        this.data.choise = !(e.choise==undefined);
    },
    //选择地址
    bindChoise:function(e){ 
        //是否可以选择
        if(!this.data.choise){
            return;
        }
  
        let choiseItem;
        this.data.addrArry.forEach(function(item) { 
            if(item.id==parseInt(e.currentTarget.dataset.id)){
              choiseItem=item;   
            }
        });

        if(!choiseItem.canChoise){
            my.alert({
              title: '提示', // alert 框的标题
              content:"您选择的地址距离太远、请重新选择",
            });
            return;
        }

        getApp().globalData.choiseAddr={
            tel:choiseItem.tel,
            addrDetail:choiseItem.addr+choiseItem.addrDetail,
            lon:choiseItem.lon,
            lat:choiseItem.lat,
            sex:choiseItem.sex,
            name:choiseItem.name
        };

        my.navigateBack({
          data:1
        });
    },
    bindEdit:function(e){ 
         my.navigateTo({
          url: '/pages/me/me-addr-edit/me-addr-edit?id='+e.currentTarget.dataset.id, // 需要跳转的应用内非 tabBar 的页面的路径，路径后可以带参数。参数与路径之间使用
        });
    }
});