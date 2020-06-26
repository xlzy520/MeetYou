// miniprogram/pages/add/add.js
const app = getApp();
Page({
  
  /**
   * 页面的初始数据
   */
  data: {
    listID: null,
    // 主题
    title: "",
    // 日期
    // 说明
    des: "",
    date: new Date().getFullYear() + "-" + (new Date().getMonth() + 1) + "-" + new Date().getDate(),
    fromPage: "",
    // 是否是初始创建者
    isStartCreater: ''
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.id) {
      this.getDetail(options.id)
    }
  },
  /**
   * 主题
   */
  bindTitle: function (e) {
    this.setData({
      title: e.detail.value
    });
  },
  
  /**
   * 日期改变事件
   */
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    });
  },
  
  
  saveDays: function () {
    if (!this.data.title) {
      wx.showToast({
        icon: "none",
        title: "主题不能为空",
      });
      return;
    }
    wx.showLoading({
      mask: true
    });
    const data = {
      title: this.data.title,
      date: this.data.date,
    }
    if (!this.data.listID) {
      wx.cloud.callFunction({
        name: "add",
        data
      }).then((res) => {
        if (res.errMsg === "cloud.callFunction:ok") {
          wx.hideLoading();
          wx.showToast({
            icon: "success",
            title: "添加成功",
            success: () => {
              if (this.data.fromPage === "share") {
                wx.reLaunch({
                  url: "../meetYou/meetYou"
                });
              } else {
                // 1秒后返回
                wx.setStorage({
                  key: 'back',
                  data: 'addPage'
                });
                wx.navigateBack({
                  delta: 1
                });
              }
            }
          });
        }
      }).catch((err) => {
        console.log(err);
        wx.showToast({
          icon: "none",
          title: "添加失败"
        });
      }).finally(()=>{
        wx.hideLoading()
      });
    } else {
      data._id = this.data.listID
      this.update(data)
    }
  },
  /**
   * 更新数据
   */
  update: function (data) {
    wx.cloud.init()
    wx.showLoading()
    wx.cloud.callFunction({
      name: "update",
      data
    }).then((res) => {
      console.log(res);
      if (res.errMsg === "cloud.callFunction:ok") {
        wx.showToast({
          icon: "success",
          title: "更新成功"
        });
        setTimeout(()=>{
          wx.navigateBack()
        }, 300)
      }
    }).catch((err) => {
      console.log(err);
    }).finally(() => {
      wx.hideLoading()
    });
  },
  /**
   * 删除
   */
  deleteTap: function () {
    wx.showModal({
      title: "确认删除?",
      cancelColor: "#ee5e7b",
      confirmColor: "#999",
      success: (res) => {
        if (res.confirm) {
          this.confirmDelete();
        }
      }
    });
  },
  
  /**
   * 确认删除
   */
  confirmDelete: function () {
    wx.showLoading({
      title: '删除中...'
    })
    wx.cloud.callFunction({
      name: "delete",
      data: {
        id: this.data.listID,
      }
    }).then((res) => {
      if (res.result.errMsg === "collection.remove:ok" || res.result.errMsg === "doc.update:ok") {
        wx.showToast({
          icon: "success",
          title: "删除成功",
        });
        setTimeout(()=>{
          wx.navigateBack()
        }, 300)
      }
    }).catch((err) => {
      console.log(err);
      wx.showToast({
        icon: "error",
        title: "删除失败"
      });
    }).finally(() => {
      wx.hideLoading()
    });
  },
  
  getDetail(id) {
    wx.cloud.callFunction({
      name: "getDetail",
      data: {
        id: id,
      }
    }).then((res) => {
      const data = res.result.data
      this.setData({
        listID: data._id,
        title: data.title,
        date: data.date
      })
    })
  }
})
