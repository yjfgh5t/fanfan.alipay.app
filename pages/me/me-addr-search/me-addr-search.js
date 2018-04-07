import {tools} from '/common/js/common.js'
Page({
    data:{
       addrModel:{ 
            district:'',
            street:'',
            lat:'',
            lng:''
        },
        //多个addrModel
        nearAddr:[],
    },
    onLoad:function(){
        //获取 当前地址
        this.loadLocalAddr();
    },
    bindAddr:function(e){

        this.loadLocalAddr();

    },
    bindChange:function(e){
        console.log(e.detail.value);
        if(e.detail.value!=''){
            this.loadServerAddr(e.detail.value,this.data.addrModel.lat,this.data.addrModel.log);
        }
    },
    bindSelected:function(e){
        let index = e.currentTarget.dataset.index;
        let addrModel ={};
        if(index==-1){
            addrModel=this.data.addrModel;
        }else{
            addrModel=this.data.nearAddr[index];
        }
        
        //设置参数
        tools.setParams("choiseAddr",addrModel);

        //跳转返回 
        my.navigateBack({delta:1}); 
    },
    loadLocalAddr:function(){
         let _this=this;
 
        //获取当前地址
         my.getLocation({
            type:2,
            success(res) {
                my.hideLoading();
                
                let  street='';
                if(res.streetNumber){
                    if(res.streetNumber.street)
                        street+=res.streetNumber.street;
                    
                    if(res.streetNumber.number)
                        street+=res.streetNumber.number;
                }

                _this.setData({addrModel:{
                    district:res.city+res.district,
                    street:street,
                    lat:res.latitude,
                    lng:res.longitude
                }});

                //搜索附件地址
               _this.loadServerAddr(street,res.latitude,res.longitude);

            },
            fail() {
                my.hideLoading();
                my.alert({ title: '定位失败' });
            },
        })
    },
    //搜索服务地址
    loadServerAddr:function(keyWord,lat,log){
        let  _this =this;
        tools.ajax("api/address/search",{keyWord:keyWord,lat:lat,log:log},"GET",function(rep){
            if(rep.code==0 && rep.data!=null){
                let data=[];
                rep.data.forEach(function(item) {
                    let location =item.location.split(',');
                    data.push({
                        title:item.name,
                        district:item.district,
                        street:item.address=='[]'?'':item.address,
                        lat:location[0],
                        lng:location[1]
                    });
                });
                //设置数据
                _this.setData({nearAddr:data});
            }
        })

    }
})