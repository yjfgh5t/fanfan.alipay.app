import {tools} from '/common/js/common.js'
Page({
    data:{
       addrModel:{ 
            district:'',
            street:'',
            detail:'',
            lat:'',
            lng:'',
            adcode:''
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
          console.log(this.data.addrModel);
            this.loadServerAddr(e.detail.value,this.data.addrModel.lat,this.data.addrModel.lng,this.data.addrModel.adcode);
        }
    },
    bindSelected:function(e){
      console.log(e);
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
                //城市名称
                let city= res.city==''?res.province:res.city;
                _this.setData({addrModel:{
                    district:res.city+' '+res.district,
                    street:street,
                    detail:'',
                    lat:res.latitude,
                    lng:res.longitude,
                    adcode: res.districtAdcode
                }});

                //搜索附件地址
               _this.loadServerAddr(street,res.latitude,res.longitude,res.districtAdcode);
            },
            fail() {
                my.hideLoading();
                my.alert({ title: '定位失败' });
            },
        })
    },
    //搜索服务地址
    loadServerAddr:function(keyWord,lat,lng,adcode){
        let  _this =this;
        tools.ajax("api/address/search",{keyWord:keyWord,lat:lat,lng:lng,adcode:adcode},"GET",function(rep){
            if(rep.code==0 && rep.data!=null){
                let data=[];
                rep.data.forEach(function(item) {
                  if(item.district!='[]'){
                      let location =item.location.split(',');
                      data.push({
                          district:item.district,
                          street:item.address=='[]'?'':item.address,
                          detail:item.name,
                          lat:location[1],
                          lng:location[0],
                          adcode:item.adcode
                      });
                  }
                });
                //设置数据
                _this.setData({nearAddr:data});
            }
        })

    }
})