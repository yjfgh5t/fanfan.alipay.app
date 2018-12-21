import {tools} from '/common/js/common.js'
Page({
    data:{
        btnEdit:'/img/icon_btn_edit.png',
        choise:false,
        addrArry:[
            //{id:1001,name:'江洋',canChoise:true,tel:'15821243531',sex:'女士',district:'上海市松江区城鸿路222号',street:'',detail:'鸿路222号4号楼1103室',lng:145568.123,lat:123123,deliveryRange:200},
        ],
        //超出配送范围
        overRangeArray:[]
    },
    onLoad:function(e){
        //是否选择地址
        this.data.choise =!(e.choise==undefined);
    },
    onShow:function(e){
        this.loadAddr();
    },
    //选择地址
    bindChoise:function(e){ 
        //是否可以选择
        if(!this.data.choise){
            return;
        } 

        let choiseItem = this.data.addrArry[e.currentTarget.dataset.index];
        let  choiseModel={
            tel:choiseItem.tel,
            addr:choiseItem.district,
            addrDetail:choiseItem.street+choiseItem.detail,
            lng:choiseItem.lng,
            lat:choiseItem.lat,
            sex:choiseItem.sex,
            name:choiseItem.name,
            deliveryRange:choiseItem.deliveryRange
        };

        //设置参数 
        tools.setParams("choiseAddr",choiseModel);
  
        my.navigateBack({data:1});
    },
    bindEdit:function(e){ 
        let addrModel= this.data.addrArry[e.currentTarget.dataset.index];
        //设置参数 
        tools.setParams("editAddrModel",addrModel);
         my.navigateTo({
          url: '/pages/me/me-addr-edit/me-addr-edit', // 需要跳转的应用内非 tabBar 的页面的路径，路径后可以带参数。参数与路径之间使用
        });
    },
    loadAddr:function(){

        let choise=this.data.choise;

        let _this= this;

        tools.getUserInfo((userInfo)=>{

            tools.ajax("api/address/",{userId:userInfo.id,choise:choise},"GET",(resp)=>{
                
                if(resp.code==0 && resp.data!=null)
                {
                    let  data=[],overRange=[];
                    resp.data.forEach((item)=>{
                        var tempItem = {
                            id:item.id,
                            name:item.name,
                            tel:item.tel,
                            sex:item.sex,
                            district:item.district,
                            street:item.street,
                            detail:item.detail,
                            lat:item.lat,
                            lng:item.lng,
                            deliveryRange:item.deliveryRange
                        };

                        //超出范围地址
                        if(_this.data.choise && item.overRange){
                          overRange.push(tempItem)
                        }else{
                        //可选地址
                        data.push(tempItem);
                        }
                    });
                  _this.setData({addrArry:data,overRangeArray:overRange});
                }


            });

        })
        

    }
});