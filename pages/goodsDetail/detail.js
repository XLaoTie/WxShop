//detail.js
let app = getApp();
import S_request from '../../utils/requestService.js';
import * as utils from '../../utils/util.js';
let curPageRequsetNumber = 3; //设置当前页面请求数量
let okayapi = require('../../utils/okayapi.js')

Page({
  data: {


  showNav:true,
  showHome:false,
  showBrand:false,
    pageSetting: { //页面设置
      swiperHeight: 0 // 轮播图高度
    },
    addressInfo: null, //地址信息,
    loading: { //页面loading
      hidden: true,
      msg: "加载中...",
      isViewHidden: false
    },
    toast: { //页面消息提示
      hidden: true,
      icon: "clear",
      msg: "请求超时"
    },
    collect: {
      data: [],
      actionSheetHidden: true,
      createCollectName: ""
    },

    //轮播台数据
    indicatorDots: false,
    autoplay: true,
    interval: 5000,
    duration: 1000,

    swiperData: {}, //轮播台详情
    imgList: {},//照片列表
    goodsData: {}, //商品详情
    goodsNumberInput: 1, //购买数量
    //图片路径
    url:'',
    //输入备注内容
    content: '',
    contentlength: 0,
  },
  onLoad: function(e) {
    this.setData({
      url: app.globalData.imgUrl + 'goods/'
    })
    this.goodsDetailInit(e);
    this.setSwiperHeight();
    // this.getMatchGoods(e);
    // this.getSameGoods(e);
  },
  onShow: function() {

  },
  onReady: function(e) {
    console.log('渲染完成', e);
  },
  //初始化 商品详情
  goodsDetailInit: function(e) {

    //let swiperData = [];
    let imgList = [];
   
    wx.request({
      header: utils.requestHeader(),
      
      url: app.globalData.url+'GetGoodsDetail&id='+e.id,
     // data: okayapi.enryptData(params),
      success: (res) => {
        let data = res.data.data.detail;
       
        //循环拿出所有照片放进数组 没有图片地址或者等于最大位置时停止
        // for (let i = 1; data['goods_picture' + i] != "" && data['goods_picture' + i] != null; i++) {
          
        //   swiperData.push({
        //     imgUrl: data['goods_picture' + i],
        //   })
        // }
        
        // for (let i = 1; data['goods_presentation_img' + i] != "" && data['goods_presentation_img' + i] != null; i++) {
        //   imgList.push({
        //     imgUrl: data['goods_presentation_img' + i],
        //   })
        // }
    
        //console.log(swiperData);
        this.setData({
          goodsData: data,
          swiperData: data['goods_picture'].split(","),
          imgList: data['goods_presentation_img'].split(","),
          
        });
   
      },
      fail: (err) => {
        console.log('error', err);
        err.statusCode = CONFIG.CODE.REQUESTERROR;
      }
    })
  },
  //初始化 商品详情Swiper高度
  setSwiperHeight: function() {
    var systemInfo = app.getSystemInfo(),
      rpx = (750 / systemInfo.windowWidth);

    //设置swiper 高度
    this.setData({
      "pageSetting.swiperHeight": (systemInfo.windowHeight - (systemInfo.windowHeight * .57)) * rpx
    })
  },

  //选择商品数量
  change_goods_number: function(e) {
    let type = e.currentTarget.dataset.type;

    if (type == "add") {
      this.setData({
        goodsNumberInput: this.data.goodsNumberInput + 1
      })
    } else if (type == "minus" && this.data.goodsNumberInput > 1) {
      this.setData({
        goodsNumberInput: this.data.goodsNumberInput - 1
      });
    }
  },

  listenercontent: function(e) {
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

  //加入购物车
  joinCart: function(e) {
    console.log(e.currentTarget.dataset.id);

    //用户按了允许授权按钮
    var that = this;
    //插入登录的用户的相关信息到数据库
    wx.request({
      header: utils.requestHeader(),
      url: app.globalData.url +'AddToShopcar',
      method: "POST",
      data: {
        user_identify: getApp().globalData.userOpenId,
        goods_id: e.currentTarget.dataset.id,
        car_identify_new: getApp().globalData.openid + e.currentTarget.dataset.id,
        good_img: e.currentTarget.dataset.goods_titlepage,
        good_title: e.currentTarget.dataset.goods_name,
        good_price: e.currentTarget.dataset.goods_price,
      },
      success: function(res) {
        wx.showToast({
          title: "加入购物车成功！",
        });

//两秒后消失
        setTimeout(function() {
          wx.hideLoading()
        }, 2000)
      },
      fail: (err) => {
        console.log(e.detail);
      }
    })
  },






  openCartPage: function () {
    //打开选择属性页面
    this.openPageAnimate();
    this.hideModal();
  },

  //购买发送订单到那里
  details_bot_opts: function(e, id) {
    let goodsnumber = this.data.goodsNumberInput,
      orderPrice = this.data.goodsData.goods_price * goodsnumber;
    // var date = getDate();
    var timestamp = Date.parse(new Date());
    
    //订单地址判定
    if (this.data.addressInfo == null || this.data.addressInfo == {}) {
      wx.showToast({
        title: "地址不能为空哦亲",
      })
    } else {

      let params = {
        s: "App.PhalApi_MiniTea_Tea.CreateNewOrder", // 必须，待请求的接口服务名称
        //Jason格式传入的写法
 
      };
      //用户按了允许授权按钮
      var that = this;
      //插入登录的用户的相关信息到数据库
      wx.request({
        header: utils.requestHeader(),
        url: app.globalData.url +'CreateNewOrder',
        method:'POST',
        data:{
          order_buyer: this.data.addressInfo.userName,
          order_location: this.data.addressInfo.provinceName + this.data.addressInfo.cityName + this.data.addressInfo.countyName + this.data.addressInfo.detailInfo,
          order_price: orderPrice,
          order_goods: this.data.goodsData.goods_name,
          order_good_id: this.data.goodsData.id,
          order_img: this.data.goodsData.goods_titlepage,
          order_remark: this.data.content,
          order_mobile: this.data.addressInfo.telNumber,
          order_identify: getApp().globalData.userOpenId,
          order_goods_num: goodsnumber,


        },


        success: function(res) {
          wx.showToast({
            title: "下单成功！",
          });
          console.log(res)
          this.closePageAnimate();
          setTimeout(function() {
            wx.hideLoading()
          }, 2000)
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

  chooseAddress() {
    wx.chooseAddress({
      success: (res) => {
        this.setData({
          addressInfo: res
        })
      },
      fail: function(err) {
        console.log(err)
      }
    })
  },
  // 打开内页
  openPageAnimate: function() {
    app.globalPageAnimate('left', (animate) => {
      this.setData({
        animationData: animate.export()
      });
      setTimeout(() => {
        this.setData({
          "loading.isViewHidden": true
        })
      }, animate.option.transition.duration)
    });
  },
  //关闭内页
  closePageAnimate: function() {
    app.globalPageAnimate('right', (animate) => {
      this.setData({
        animationData: animate.export(),
        "loading.isViewHidden": false
      });

    });
  },

  //请求超时提醒
  toastChange: function() {
    this.setData({
      "toast.hidden": true
    });
  },

//弹出框
//点击我显示底部弹出框
clickme: function () {
    this.showModal();
  },

  //显示对话框
  showModal: function () {
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData1: animation.export(),
      showModalStatus: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData1: animation.export()
      })
    }.bind(this), 200)
  },
  //隐藏对话框
  hideModal: function () {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData1: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData1: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 200)
  }







});