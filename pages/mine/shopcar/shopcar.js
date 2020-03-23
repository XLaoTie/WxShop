//lists.js

import * as utils from '../../../utils/util.js';
let okayapi = require('../../../utils/okayapi.js')
//获取应用实例
var app = getApp()
Page({
  data: {
    newsList: [],
    orders: [],
    shopcar: [],

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

  //跳转商品详情页
  showGoodsDetailPage: function (e) {

    let data = e.currentTarget.dataset;

    wx.navigateTo({
      url: "../../goodsDetail/detail?id=" + data.id
    })

  },

  loadData: function (lastid) {
    //显示出加载中的提示
    this.setData({
      loadHidden: false
    })

    var limit = 5
    var that = this

    let params = {
      s: "App.PhalApi_MiniTea_Tea.QueryMyShopCar", // 必须，待请求的接口服务名称
      user_identify: getApp().globalData.openid,
    };

    wx.request({
      header: utils.requestHeader(),
      url: getApp().globalData.okayapiHost,
      data: okayapi.enryptData(params),

      success: (res) => {
        let data = res.data.data.items;
        let shopcar = [];

        for (let i = 0; i < data.length; i++) {

          shopcar.push({
            tea_id: data[i].tea_id,
            good_title: data[i].good_title,
            good_img: data[i].good_img,
            good_price: data[i].good_price
          })
        };
        that.setData({
          shopcar: shopcar,
        })

      },
      fail: (err) => {
        err.statusCode = CONFIG.CODE.REQUESTERROR;
        typeof cb == "function" && cb(err);
      }
    })

  },

  loadMore: function (event) {
  },
  onLoad: function () {
    var that = this
    this.loadData(0);

  },

  toastChange: function () {
    this.setData({
      toastHidden: true
    })
  },
  modalChange: function () {
    this.setData({
      confirmHidden: true
    })
  }
})