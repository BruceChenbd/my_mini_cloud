// 云函数入口文件
const cloud = require('wx-server-sdk')
const axios = require('axios')

cloud.init()
const db = cloud.database()

// 聚合数据
const { baseUrl, v } = require('./config')

// 云函数入口函数
exports.main = async (event, context) => {
  const {
    month,
    day,
    key
  } = event

  const ret = await db.collection('todayHistory').where({
    date: `${month}/${day}`
  }).get()

  if (ret.data.length > 0) {
    return ret.data[0].result
  }

  const resp = await axios({
    method: 'GET', url: baseUrl, headers: {
      'Content-Type': 'application/json;charset=utf-8',
      'Accept': 'application/json;charset=utf-8'
    }, params: {
      month,
      key,
      day,
      v
    }
  }).then(res => {
    return res.data
  }, error => {
    return error
  })
  await db.collection('todayHistory').add({
    data: {
      date: `${month}/${day}`,
      result: resp.result
    }
  })

  return resp
}