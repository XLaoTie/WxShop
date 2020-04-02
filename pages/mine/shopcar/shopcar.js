import * as utils from '../../../utils/util.js';
var app = getApp()
Page({
  data: {
    showNav: true,
    showHome: false,
    showBrand: false,

    imgurl: app.globalData.imgUrl + 'goods/',
    carts: [],
    selectedNum: 0,
    minusStatuses: [],
    selectedAllStatus: true,
    total: '',
    startX: 0,
    itemLefts: []
  },
  
  bindMinus: function (e) {
    // loading提示
    // wx.showLoading({
    //   title: '操作中',
    //   mask: true
    // });
    var index = parseInt(e.currentTarget.dataset.index);
    var num = this.data.carts[index].quantity;
    // 如果只有1件了，就不允许再减了
    if (num > 1) {
      num--;
    }
    // 只有大于一件的时候，才能normal状态，否则disable状态
    var minusStatus = num <= 1 ? 'disabled' : 'normal';
    // 购物车数据
    var carts = this.data.carts;
    carts[index].quantity= num;
    // 按钮可用状态
    var minusStatuses = this.data.minusStatuses;
    minusStatuses[index] = minusStatus;
    // 将数值与状态写回
    this.setData({
      carts: carts,
      minusStatuses: minusStatuses
    });
    // update database
    // carts[index].save().then(function () {
    //   wx.hideLoading();
    // });
    this.sum();
    console.log(carts[index].objectId);
    wx.request({
      url: app.globalData.url + 'CartMinus&id=' + carts[index].objectId,
      method: 'get',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        //--init data 

        console.log(res.data.status);
      },
      error: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000,
        });
      },
    });

  },
  bindPlus: function (e) {
    // wx.showLoading({
    //   title: '操作中',
    //   mask: true
    // });
    var index = parseInt(e.currentTarget.dataset.index);
    var num = this.data.carts[index].quantity;
    // 自增
    num++;
    // 只有大于一件的时候，才能normal状态，否则disable状态
    var minusStatus = num <= 1 ? 'disabled' : 'normal';
    // 购物车数据
    var carts = this.data.carts;
    carts[index].quantity= num;
    // 按钮可用状态
    var minusStatuses = this.data.minusStatuses;
    minusStatuses[index] = minusStatus;
    // 将数值与状态写回
    this.setData({
      carts: carts,
      minusStatuses: minusStatuses
    });
    console.log(carts[index].objectId);
    wx.request({
      url: app.globalData.url + 'CartPlus&id=' + carts[index].objectId,
      method: 'get',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        //--init data 

        console.log(res.data.status);
      },
      error: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000,
        });
      },
    });
    this.sum();
  },
  bindManual: function (e) {
    // wx.showLoading({
    //   title: '操作中',
    //   mask: true
    // });
    var index = parseInt(e.currentTarget.dataset.index);
    var carts = this.data.carts;
    var num = parseInt(e.detail.value);
    carts[index].quantity= num;
    // 将数值与状态写回
    this.setData({
      carts: carts
    });
    // carts[index].save().then(function () {
    //   wx.hideLoading();
    // });
    this.sum();
    wx.request({
      url: app.globalData.url + 'CartManual&id=' + carts[index].objectId+"&num="+num,
      method: 'get',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        //--init data 

        console.log(res.data.status);
      },
      error: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000,
        });
      },
    });

  },
  bindManualTapped: function () {
    // 什么都不做，只为打断跳转
  },
  bindCheckbox: function (e) {
    // wx.showLoading({
    //   title: '操作中',
    //   mask: true
    // });
    /*绑定点击事件，将checkbox样式改变为选中与非选中*/
    //拿到下标值，以在carts作遍历指示用
    var index = parseInt(e.currentTarget.dataset.index);
    //原始的icon状态
    var selected = this.data.carts[index].selected;
    var carts = this.data.carts;
    // 对勾选状态取反
    carts[index].selected= !selected;
    // 写回经点击修改后的数组
    this.setData({
      carts: carts,
    });
    this.sum();
    var s = carts[index].selected ? '1' : '0';
    console.log(s);
    wx.request({
      url: app.globalData.url + 'Checkbox&id=' + carts[index].objectId + "&selected=" + s,
      method: 'get',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        //--init data 

        console.log(res.data.status);
      },
      error: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000,
        });
      },
    });
  },
  bindSelectAll: function () {

    // 环境中目前已选状态
    var selectedAllStatus = this.data.selectedAllStatus;
    // 取反操作
    selectedAllStatus = !selectedAllStatus;
    // 购物车数据，关键是处理selected值
    var carts = this.data.carts;
    // 遍历
    for (var i = 0; i < carts.length; i++) {
      carts[i].selected=selectedAllStatus;
      // update selected status to db
    }

    //处理全选数据
    this.setData({
      selectedAllStatus: selectedAllStatus,
      carts: carts,
    });
    this.sum();
    var s=selectedAllStatus ? '1':'0';
    wx.request({
      url: app.globalData.url + 'SelectAll&selected='+ s,
      method: 'get',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        //--init data 

        console.log(res.data.status);
      },
      error: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000,
        });
      },
    });
  },
  bindCheckout: function () {
    var passData = this.calcData();
    
    wx.navigateTo({
      url: '../checkout/checkout?passData=' + passData +"&selectedNum="+this.data.selectedNum+"&sumPrice="+this.data.total
    });
  },
  delete: function (e) {
    var that = this;
    // 购物车单个删除
    var objectId = e.currentTarget.dataset.objectId;
    console.log(objectId);
    wx.showModal({
      title: '提示',
      content: '确认要删除吗',
      success: function (res) {
        if (res.confirm) {
          // 从网络上将它删除
          wx.request({
            url: app.globalData.url + 'Delete&id=' + objectId,
            method: 'get',
            header: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
              //--init data 
              // 成功
              wx.showToast({
                title: '删除成功',
                icon: 'success',
                duration: 1000
              });
              that.reloadData();
              that.setData({
                itemLefts: []
              });
              console.log(res.data.status);
            },
            error: function (e) {
              wx.showToast({
                title: '网络异常！',
                duration: 2000,
              });
            },
          });

        }
      }
    })
  },
  calcData: function () {
    // 遍历取出已勾选的cid
    // var buys = [];
    var passData = [];
    var selectedNum=0;
    for (var i = 0; i < this.data.carts.length; i++) {
      if (this.data.carts[i].selected) {
        // 移动到Buy对象里去
        // cartIds += ',';
        selectedNum = parseInt(selectedNum) + parseInt(this.data.carts[i].quantity);
        passData.push({
          id: this.data.carts[i].objectId,
          title: this.data.carts[i].title,
          img: this.data.carts[i].avatar,
          price: this.data.carts[i].price,
          goods_id: this.data.carts[i].goods_id,
          quantity: this.data.carts[i].quantity,
          
        })
      }
    }
 
    this.setData({
      selectedNum:selectedNum
    })
    if (passData.length <= 0) {
      wx.showToast({
        title: '请勾选商品',
        icon: 'success',
        duration: 1000
      })
    }

    return JSON.stringify(passData);;
  },
  reloadData: function () {
    // auto login
    var that = this;

    var minusStatuses = [];

    wx.request({
      header: utils.requestHeader(),
      url: app.globalData.url + "QueryMyShopCar&user_identify='" + app.globalData.openid + "'",
      method: "Get",
      success: (res) => {
        let data = res.data.data.items;
        let carts = [];

        for (let i = 0; i < data.length; i++) {
          
          carts.push({
            objectId: data[i].id,
            title: data[i].good_title,
            avatar: data[i].good_img,
            price: data[i].good_price,
            quantity:data[i].good_num,
            goods_id:data[i].goods_id,
            selected:data[i].selected=='0'? false:true,
          })

        };
        var selectedAllStatus=true;
        //初始化按钮
        if (carts.length == 0)  selectedAllStatus = false;
        for (var i = 0; i < carts.length; i++) {
          minusStatuses[i] = carts[i].quantity <= 1 ? 'disabled' : 'normal';
          if(!carts[i].selected) selectedAllStatus=false;
        }
        that.setData({
          carts: carts,
          minusStatuses: minusStatuses,
          selectedAllStatus:selectedAllStatus
        })
        that.sum();
      },
      fail: (err) => {
        err.statusCode = CONFIG.CODE.REQUESTERROR;
        typeof cb == "function" && cb(err);
      }
    })

  },
  onShow: function () {
    this.reloadData();
  },
  sum: function () {
    var carts = this.data.carts;
    // 计算总金额
    var total = 0;
    for (var i = 0; i < carts.length; i++) {
      if (carts[i].selected) {
        total += carts[i].quantity * carts[i].price;
      }
    }
    total = total.toFixed(2);
    // 写回经点击修改后的数组
    this.setData({
      carts: carts,
      total: total
    });
  },
  showGoods: function (e) {
    // 点击购物车某件商品跳转到商品详情
    var objectId = e.currentTarget.dataset.objectId;
    wx.navigateTo({
      url: '/pages/goodsDetail/detail?id=' + objectId
    });
  },
  touchStart: function (e) {
    var startX = e.touches[0].clientX;
    this.setData({
      startX: startX,
      itemLefts: []
    });
  },
  touchMove: function (e) {
    var index = e.currentTarget.dataset.index;
    var movedX = e.touches[0].clientX;
    var distance = this.data.startX - movedX;
    var itemLefts = this.data.itemLefts;
    itemLefts[index] = -distance;
    this.setData({
      itemLefts: itemLefts
    });
  },
  touchEnd: function (e) {
    var index = e.currentTarget.dataset.index;
    var endX = e.changedTouches[0].clientX;
    var distance = this.data.startX - endX;
    // button width is 60
    var buttonWidth = 60;
    if (distance <= 0) {
      distance = 0;
    } else {
      if (distance >= buttonWidth) {
        distance = buttonWidth;
      } else if (distance >= buttonWidth / 2) {
        distance = buttonWidth;
      } else {
        distance = 0;
      }
    }
    var itemLefts = this.data.itemLefts;
    itemLefts[index] = -distance;
    this.setData({
      itemLefts: itemLefts
    });
  }
})