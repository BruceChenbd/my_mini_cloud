// miniprogram/pages/todayInHistory/todayInHistory.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
     historyData: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const month  = new Date().getMonth()+1;
    const day = new Date().getDate();
    const key = 'cff782e36619f70d27851c7629626743';

    wx.cloud.callFunction({
      name: 'todayInHistory',
      data: {
        month,
        day,
        key
      }
    }).then(res => {
      console.log(res,'res')
      if (res.result.error_code === 0 && res.result.result.length >0 || res.result && res.result.length>0) {
         let list =  res.result.result || res.result;
         this.setData({
            historyData: list
         })
      }
    })
    .catch(console.error)
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

  }
})