// import ApiList from  '../../config/api';
// import request from '../../utils/request.js';
//获取应用实例  
var app = getApp();
Page({
  data: {
    showNav: false,
    showHome: false,
    showBrand: false,
    // types: null,
    //typeTree: {}, // 数据缓存
    imgurl: app.globalData.imgUrl + 'goods/',
    currType: '',
    // 当前类型
    types: [
    ],
    currGoods:[],
    typeTree: {},
  },

  onLoad: function (option) {
    var that = this;
    wx.request({
      url: app.globalData.url+'GetCateGoryList',
      method: 'get',
   
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        //--init data 
       
        var currType = res.data.data.type[0];
        var typeTree = res.data.data.goods;
        console.log(typeTree[currType]);
          that.setData({
            types: res.data.data.type,
            currType:currType,
            typeTree:typeTree,
            currGoods:typeTree[currType]
          });
       console.log(that.data.goodsInfo);
      },
      error: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000,
        });
      },
    });
  },



  tapType: function (e) {
    var that = this;
    const currType = e.currentTarget.dataset.type;
    var typeTree=that.data.typeTree;
    that.setData({
      currType: currType,
      currGoods:typeTree[currType]
    });
    console.log(typeTree[currType]);


  },
 

})