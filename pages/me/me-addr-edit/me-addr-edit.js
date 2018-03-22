Page({
    data:{
        model:{
            id:1001,
            name:"",
            sex:0,
            tel:"",
            addr:"地址",
            addrDetail:"",
        },
        id:0,
        isAddrPage:true
    },
    onLoad:function(e){
        this.data.model.id=e.id;
        this.data.isAddrPage = e.isAddrPage=="true";
        console.log(this.data.isAddrPage);
    },
    bindSex:function(e){  
        this.setData({"model.sex": parseInt(e.currentTarget.dataset.sex)});
    },
    bindSubmit:function(e){
        console.log(e);
        let model= e.detail.value;

        if(model.name==""){
            my.alert({title:"提示",content:"请输入联系人姓名"});
            return;
        }

        if(this.data.model.sex==0){
            my.alert({title:"提示",content:"请选择先生或女士"});
            return;
        }

        if(model.tel==""  || model.tel.length!=11){
            my.alert({title:"提示",content:"请输入正确的电话"});
            return;
        }

        if(model.addr==""){
              my.alert({title:"提示",content:"请输入地址"});
              return;
         }
            
        if(model.addrDetail==""){
              my.alert({title:"提示",content:"请输入详细地址"});
              return;
        }

        my.navigateBack({delta:1}); 
    }

});