// pages/mine/checkout/checkout.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showNav: true,
    showHome: false,
    showBrand: false,
        checkoutData:[],
        imgurl:'',
        goodsnum:0,
        sumPrice:0,
    //输入备注内容
    content: '',
    contentlength: 0,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var list = JSON.parse(options.passData)
  
    this.setData({
      imgurl: app.globalData.imgUrl + 'goods/',
      checkoutData:list,
      goodsnum: options.selectedNum,
      sumPrice:options.sumPrice
    })
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  chooseAddress() {
    wx.chooseAddress({
      success: (res) => {
        this.setData({
          addressInfo: res
        })
      },
      fail: function (err) {
        console.log(err)
      }
    })
  },
  //购买发送订单到那里
  details_bot_opts: function (e, id) {
   
    // var date = getDate();
    var timestamp = Date.parse(new Date());

    //订单地址判定
    if (this.data.addressInfo == null || this.data.addressInfo == {}) {
      wx.showToast({
        title: "地址不能为空哦亲",
      })
    } else {

  
      //用户按了允许授权按钮
      var that = this;
      //插入登录的用户的相关信息到数据库
      wx.request({
        header: {},
        url: app.globalData.url + 'CreateNewOrders',
        method: 'POST',
        data: {
          order_buyer: this.data.addressInfo.userName,
          order_location: this.data.addressInfo.provinceName + this.data.addressInfo.cityName +       this.data.addressInfo.countyName + this.data.addressInfo.detailInfo,       
          order_remark: this.data.content,
          order_mobile: this.data.addressInfo.telNumber,
          order_identify: getApp().globalData.userOpenId,
          order_goodsinfo:that.data.checkoutData,
        },


        success: function (res) {
          wx.showToast({
            title: "下单成功！",
          });

          setTimeout(function () {
            wx.hideLoading()
          }, 2000)
          console.log(res)
          wx.reLaunch({
            url: '/pages/index/index'
          });
        },
        fail: (err) => {
          console.log(e.detail);
        }
      })
    };

    //支付函数等发布后才能发布
    // wx.requestPayment({
    //   timeStamp: '',
    //   nonceStr: '',
    //   package: '',
    //   signType: 'MD5',
    //   paySign: '',
    //   success(res) { },
    //   fail(res) { }
    // })
  },

  listenercontent: function (e) {
    var tempc = e.detail.value;
    var tempcvalue = e.detail.value.length;
    this.setData({
      contentlength: parseInt(tempcvalue)
    });

    //超过三百字截取前面三百字
    if (tempc.length > 300) {
      tempc = tempc.substring(0, 300)
    }
    this.setData({
      content: tempc,
    })

  },

})