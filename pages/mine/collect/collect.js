//lists.js

import * as utils from '../../../utils/util.js';
let okayapi = require('../../../utils/okayapi.js')
//获取应用实例
var app = getApp()
Page({
  data: {
    url1: app.globalData.imgUrl + 'goods/',
    tabs: ["全部", "待付款", "待发货", "已发货"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    newsList: [],
    orders: [],
    ordersPay: [],
    ordersWaitToSend: [],
    ordersSend: [],

    lastid: 0,
    toastHidden: true,
    confirmHidden: true,
    isfrist: 1,
    loadHidden: true,
    moreHidden: 'none',
    msg: '没有更多订单了',
    url: 'url',
    
    img: '',
  },

  loadData: function(lastid) {
    //显示出加载中的提示
    this.setData({
      loadHidden: false,
     
    })

    var limit = 5
    var that = this

    let params = {
      s: "App.PhalApi_MiniTea_Tea.QueryMyOrderList", // 必须，待请求的接口服务名称
      order_identify: getApp().globalData.openid,
    };
    
    //全部
    wx.request({
      header: utils.requestHeader(),
      url: app.globalData.url + "QueryMyOrderList&order_identify= '" +getApp().globalData.openid+"'",
      //data: okayapi.enryptData(params),
      method:'GET',
      success: (res) => {
        let data = res.data.data.orders;
        let orders = [];

        for (let i = 0; i < data.length; i++) {

          orders.push({
            imgurl: app.globalData.imgUrl + 'goods/',
            order_num: i + 1,
            order_goods_num: data[i].order_goods_num,
            order_status: data[i].order_status,
            order_time: data[i].order_time,
            order_goods: data[i].order_goods,
            order_location: data[i].order_location,
            order_mobile: data[i].order_mobile,
            order_price: data[i].order_price,
            order_img: data[i].order_img,
            id: data[i].id,
          })
          
        };
        
        that.setData({
          orders: orders,
        
        })
      console.log(this.data.imgurl)
      },
      fail: (err) => {
        err.statusCode = CONFIG.CODE.REQUESTERROR;
        typeof cb == "function" && cb(err);
      }
    })

  //待支付
    let paramsPay = {
      s: "App.PhalApi_MiniTea_Tea.QueryMyOrderList", // 必须，待请求的接口服务名称
      order_identify:getApp().globalData.openid,
      order_status: 3,
    };

    wx.request({
      header: utils.requestHeader(),
      url: app.globalData.url + "QueryMyOrderList&order_identify='" + getApp().globalData.openid +"'&order_status=3",
      //data: okayapi.enryptData(paramsPay),
    method:'GET',
      success: (res) => {
        let data = res.data.data.orders;
        let ordersPay = [];

        for (let i = 0; i < data.length; i++) {

          ordersPay.push({
            imgurl: app.globalData.imgUrl + 'goods/',
            order_num: i + 1,
            order_goods_num: data[i].order_goods_num,
            order_status: data[i].order_status,
            order_time: data[i].order_time,
            order_goods: data[i].order_goods,
            order_location: data[i].order_location,
            order_mobile: data[i].order_mobile,
            order_price: data[i].order_price,
            order_img: data[i].order_img,
            id: data[i].id,
          })
        };
        that.setData({
          ordersPay: ordersPay,
        })

      },
      fail: (err) => {
        err.statusCode = CONFIG.CODE.REQUESTERROR;
        typeof cb == "function" && cb(err);
      }
    })

    let paramsWaitToSend = {
      s: "App.PhalApi_MiniTea_Tea.QueryMyOrderList", // 必须，待请求的接口服务名称
      order_identify: getApp().globalData.openid,
      order_status: 1,
    };
  //待发货
    wx.request({
      header: utils.requestHeader(),
      url: app.globalData.url + "QueryMyOrderList&order_identify='" + getApp().globalData.openid + "'&order_status=1",
      
      method: 'GET',

      success: (res) => {
        let data = res.data.data.orders;
        let ordersWaitToSend = [];

        for (let i = 0; i < data.length; i++) {

          ordersWaitToSend.push({
            imgurl: app.globalData.imgUrl + 'goods/',
            order_num: i + 1,
            order_goods_num: data[i].order_goods_num,
            order_status: data[i].order_status,
            order_time: data[i].order_time,
            order_goods: data[i].order_goods,
            order_location: data[i].order_location,
            order_mobile: data[i].order_mobile,
            order_price: data[i].order_price,
            order_img: data[i].order_img,
            id: data[i].id,
          })
        };
        that.setData({
          ordersWaitToSend: ordersWaitToSend,
        })

      },
      fail: (err) => {
        err.statusCode = CONFIG.CODE.REQUESTERROR;
        typeof cb == "function" && cb(err);
      }
    })
    //已发货
    let paramsSend = {
      s: "App.PhalApi_MiniTea_Tea.QueryMyOrderList", // 必须，待请求的接口服务名称
      order_identify: getApp().globalData.openid,
      order_status: 2,
    };

    wx.request({
      header: utils.requestHeader(),
      url: app.globalData.url + "QueryMyOrderList&order_identify='" + getApp().globalData.openid + "'&order_status=2",
      //data: okayapi.enryptData(paramsPay),
      method: 'GET',

      success: (res) => {
        let data = res.data.data.orders;
        let ordersSend = [];

        for (let i = 0; i < data.length; i++) {

          ordersSend.push({
            imgurl: app.globalData.imgUrl + 'goods/',
            order_num: i + 1,
            order_goods_num: data[i].order_goods_num,
            order_status: data[i].order_status,
            order_time: data[i].order_time,
            order_goods: data[i].order_goods,
            order_location: data[i].order_location,
            order_mobile: data[i].order_mobile,
            order_price: data[i].order_price,
            order_img: data[i].order_img,
            id: data[i].id,
          })
        };
        that.setData({
          ordersSend: ordersSend,
        })

      },
      fail: (err) => {
        err.statusCode = CONFIG.CODE.REQUESTERROR;
        typeof cb == "function" && cb(err);
      }
    })

  },

  //跳转商品详情页
  showOrderDetailPage: function (e) {

    let data = e.currentTarget.dataset;

    wx.navigateTo({
      url: "../collect/collectDetail/collectDetail?id=" + data.id
    })

  },

  loadMore: function(event) {

    wx.getNetworkType({
      success(res) {
        const networkType = res.networkType
      }
    })

    this.setData({
      isfrist: 0
    })
    this.loadData(id = id + 5);
  },
  onLoad: function() {
    var that = this

    this.loadData(0);

  },

  toastChange: function() {
    this.setData({
      toastHidden: false
    })
  },
  modalChange: function() {
    this.setData({
      confirmHidden: false
    })
  },
  tabClick: function(e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  }
})