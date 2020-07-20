// miniprogram/pages/weather/weather.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
     cityInfo: '正在定位...',
     weatherInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getUserLocation()
  },
  //定位方法

  getUserLocation: function () {

    var _this = this;

    wx.getSetting({

      success: (res) => {

        // res.authSetting['scope.userLocation'] == undefined    表示 初始化进入该页面

        // res.authSetting['scope.userLocation'] == false    表示 非初始化进入该页面,且未授权

        // res.authSetting['scope.userLocation'] == true    表示 地理位置授权

        if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {

          //未授权

          wx.showModal({

            title: '请求授权当前位置',

            content: '需要获取您的地理位置，请确认授权',

            success: function (res) {

              if (res.cancel) {

                //取消授权

                wx.showToast({

                  title: '拒绝授权',

                  icon: 'none',

                  duration: 1000

                })

              } else if (res.confirm) {

                //确定授权，通过wx.openSetting发起授权请求

                wx.openSetting({

                  success: function (res) {

                    if (res.authSetting["scope.userLocation"] == true) {

                      wx.showToast({

                        title: '授权成功',

                        icon: 'success',

                        duration: 1000

                      })

                      //再次授权，调用wx.getLocation的API

                      _this.geo();

                    } else {

                      wx.showToast({

                        title: '授权失败',

                        icon: 'none',

                        duration: 1000

                      })

                    }

                  }

                })

              }

            }

          })

        } else if (res.authSetting['scope.userLocation'] == undefined) {

          //用户首次进入页面,调用wx.getLocation的API

          _this.geo();

        }

        else {

          console.log('授权成功')

          //调用wx.getLocation的API

          _this.geo();

        }

      }

    })



  },
  // 获取定位城市

  geo: function () {

    var _this = this;

    wx.getLocation({

      type: 'wgs84',

      success: function (res) {

        var latitude = res.latitude

        var longitude = res.longitude

        var speed = res.speed

        var accuracy = res.accuracy

        wx.request({

          url: 'https://api.map.baidu.com/reverse_geocoding/v3/?ak=O2QmVvLZloxWVwyjnogywcugQni7BB04&location=' + res.latitude + ',' + res.longitude + '&output=json',

          data: {},

          header: { 'Content-Type': 'application/json' },

          success: function (ops) {
            if (ops.data.status === 0) {
              const area = ops.data.result.addressComponent.country + '' + ops.data.result.addressComponent.province+''+ops.data.result.addressComponent.city + '' + ops.data.result.addressComponent.district;
              _this.setData({
                cityInfo: area
              })
              const key = '57326bea286c1c30bd44efed597c8840';
              let city = ops.data.result.addressComponent.district;
              const date = _this.writeCurrentDate()
              if (city.includes('区')) {
                city = city.replace('区','')
              }
              if (city.includes('县')) {
                city = city.replace('县','')
              }
              wx.cloud.callFunction({
                name: 'weather',
                data: {
                  city: city,
                  key,
                  date 
                }
              }).then(res => {
                if (res.result.error_code === 0 && res.result.result || res.result) {
                   let result =  res.result.result || res.result;
                   _this.setData({
                     weatherInfo: result
                   })
                }
              })
              .catch(console.error)
            }

          },

          fail: function (resq) {

            wx.showModal({

              title: '信息提示',

              content: '请求失败',

              showCancel: false,

              confirmColor: '#f37938'

            });

          },

          complete: function () {

          }

        })

      }

    })

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