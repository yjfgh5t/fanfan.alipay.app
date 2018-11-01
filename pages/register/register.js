import { tools } from '/common/js/common.js'
Page({
  data: {
    codeModel: { text: '发送验证码', disabled: false, showImgCode: false, code: '', imgCodeSrc: '' },
    showImgCodeLayer: false,
    model: { mobile: '', pwd: '', confirmPwd: '', name: '', mobileCode: '' }
  },
  onShow: function() {

  },
  bindSubmit: function(e) {
   
  },
  // 绑定发送二维码
  bindMobileCode: function() {
    if (this.data.model.mobile.length !== 11) {
      return my.showToast({ content: '请输入有效的手机号'});
    }
    // 显示图片二维码
    if (this.data.codeModel.showImgCode) {
      this.setData({"codeModel.showImgCode":true});
      // 刷新图片二维码
      this.refreshCodeImg()
    } else {
      this.sendMobileCode()
      // 设置下次发送需显输入图片验证码
      this.setData({ "codeModel.showImgCode": true });
    }
  },
  // 绑定弹出层事件
  bindImgCodeLayer: function(confirm) {
    if (confirm) {
      if (this.data.codeModel.code === '') {
        return my.showToast({ content: '请输入图形验证码' });
      }
      // 发送验证码
      this.sendMobileCode()
    } else {
      this.setData({ "showImgCodeLayer": true });
    }
  },
  // 发送短信验证码
  sendMobileCode: function() {
    let _that = this
    let params = {
      mobile: this.data.model.mobile,
      imgCode: this.data.codeModel.code
    }
    tools.ajax('api/user/sendCode', params, 'POST', function(res) {
      if (res.code === 0) {
        my.showToast({ content: '验证码已发送请注意查收' });
        _that.setData({ "codeModel.disabled": true,"showImgCodeLayer":false});
        // 设置计数器
        let start = 60
        let interval = window.setInterval(function() {
          if (--start === 0) {
            window.clearInterval(interval)
            // 设置验证码
            _that.setData({ "codeModel.text": "发送验证码", "codeModel.disabled": false });
          } else {
            _that.setData({ "codeModel.text": start + 's' });
          }
        }, 1000)
      }
    })
  },
  // 刷新图片验证码
  refreshCodeImg: function() {
    this.setData({"codeModel.imgCodeSrc": getApp().config.apiHost + 'api/info/imgcode/' + this.data.model.mobile + '?v=' + parseInt(Math.random() * 100)});
  },
  register: function() {
    let _this = this
    if (_this.model.name === '') {
      return my.showToast({ content: '请输入商户姓名' });
    }
    if (_this.model.mobile === '') {
      return my.showToast({ content: '请输入手机号' });
    }
    if (_this.model.mobile === '' || _this.model.mobile.length !== 11 || isNaN(_this.model.mobile)) {
      return my.showToast({ content: '您输入的手机号格式不正确' });
    }
    if (_this.model.mobileCode === '') {
      return my.showToast({ content: '请输入手机验证码' });
    }
    if (_this.model.pwd === '') {
      return my.showToast({ content: '请输入密码' });
    }
    if (_this.model.pwd.length < 6) {
      return my.showToast({ content: '密码长度不能小于6个字符' });
    }
    if (_this.model.confirmPwd === '') {
      return my.showToast({ content: '请输入确认密码' });
    }
    if (_this.model.confirmPwd.length < 6) {
      return my.showToast({ content: '确认密码长度不能小于6个字符' });
    }
    if (_this.model.pwd !== _this.model.confirmPwd) {
      return my.showToast({ content: '密码和确认密码不匹配' });
    }

    let subData = {
      code: _this.model.mobileCode,
      userId: 0,
      name: _this.model.name,
      mobile: _this.model.mobile,
      password: _this.model.pwd
    }
    // 执行注册
    tools.ajax('user/customer/register', subData,'POST', function(res) {
      if (res.code === 0 && res.data !== '') {
        my.alert('商户注册成功')
      }
    })
  },
  //失去焦点事件
  onItemBlur: function(e) {
    this.setData({[e.target.dataset.field]: e.detail.value});
  }
})