const app = getApp();
import dayjs from "dayjs";
Page({
  
  /**
   * 页面的初始数据
   */
  data: {
    loading: false,
    listData: null,
    backgroundColorArr: ['rgb(240, 95, 141)', 'rgb(249, 127, 121)', 'rgb(252, 190, 66)', 'rgb(177, 141, 220)', 'rgb(61, 201, 135)', 'rgb(67, 193, 201)', 'rgb(78, 177, 243)', 'rgb(130, 169, 218)', 'rgb(148, 127, 120)'],
  },
  
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getLists()
  },
  
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getLists()
  },
  
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    // this.update();
    this.getLists();
  },
  
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },
  
  /**
   * 到新增页面
   */
  toAdd: function (event) {
    console.log(event);
    const id = event.currentTarget.dataset.id || ''
    wx.navigateTo({
      url: '../add/add?id='+id
    });
  },
  /**
   * 获取列表数据
   */
  getLists: function () {
    wx.showLoading({
      title: '获取数据中...'
    })
    this.setData({
      loading: true
    })
    wx.cloud.init()
    wx.cloud.callFunction({
      name: "getLists",
      data: {}
    }).then((res) => {
      if (res.errMsg === "cloud.callFunction:ok") {
        const listData = res.result.data.map(value => {
          let diff = dayjs(value.date).diff(dayjs(), 'day')
          let isHour = false
          if (diff === 0) {
            diff = dayjs(value.date).diff(dayjs(), 'hour')
            isHour = true
          }
          return {
            ...value,
            diff: Math.abs(diff),
            isLast: diff>=0,
            isHour
          }
        })
        wx.stopPullDownRefresh();
        this.setData({
          listData,
        });
      }
    }).catch((err) => {
      wx.showToast({
        icon: "loading",
        title: "加载中..."
      });
    }).finally(() => {
      wx.hideLoading()
      this.setData({
        loading: false
      })
    });
  },
})
