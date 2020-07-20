// miniprogram/pages/horoscope/horoscope.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    key: 'b45f6eab1240ba90b29a8a3e13cfb2f7',
    horoscopeData: {},
    radioArr: [
      {
        name: '今日',
        value: 'today'
      },{
        name: '明日',
        value: 'tomorrow'
      },{
        name: '本周',
        value: 'week'
      }, {
        name: '本月',
        value: 'month'
      }, {
        name: '全年',
        value: 'year'
      }
    ],
    checkBoxValue: 'today',
    inputValue: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  /***
   * 查询星座运势
   */
  queryHoroscope (param) {
    wx.cloud.callFunction({
      name: 'horoscope',
      data: {
        key: param.key,
        dayconsName: param.dayconsName,
        type: param.type,
        date: param.date
      }
    }).then(res => {
      console.log(res,'res')
      if (res.result.error_code === 0 && res.result || res.result ) {
         let result =  res.result;
         this.setData({
           horoscopeData: result
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
  writeCurrentDate() {
    var now = new Date();
    var year = now.getFullYear(); //得到年份
    var month = now.getMonth();//得到月份
    var date = now.getDate();//得到日期
    var day = now.getDay();//得到周几
    var hour = now.getHours();//得到小时
    var minu = now.getMinutes();//得到分钟
    var sec = now.getSeconds();//得到秒
　　     var MS = now.getMilliseconds();//获取毫秒
    var week;
    month = month + 1;
    if (month < 10) month = "0" + month;
    if (date < 10) date = "0" + date;
    if (hour < 10) hour = "0" + hour;
    if (minu < 10) minu = "0" + minu;
    if (sec < 10) sec = "0" + sec;
    if (MS < 100)MS = "0" + MS;
    var arr_week = new Array("星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六");
    week = arr_week[day];
    var time = "";
    time = year + "年" + month + "月" + date + "日";
    return time
  },
  radioChange (e) {
     this.setData({
      checkBoxValue: e.detail.value
    })
    this.search()
  },
  changeInput (e) {
     this.setData({
       inputValue: e.detail.value
     })
  },
  search () {
    const { key, inputValue, checkBoxValue } = this.data;
    const date = this.writeCurrentDate();
   
    if(!inputValue) {
      wx.showToast({
        title: '请先填写您的星座!',
        icon:'none'
      })
      return
    }
    const param = {
      key,
      dayconsName: inputValue,
      type: checkBoxValue,
      date
    }
    this.queryHoroscope(param)
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