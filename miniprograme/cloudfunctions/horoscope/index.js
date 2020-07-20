// 云函数入口文件
const cloud = require('wx-server-sdk')
const axios = require('axios')

const { baseUrl } = require('./config')
cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const {
    key,
    dayconsName,
    type,
    date
  } = event

  const ret = await db.collection('horoscope').where({
     date: `${dayconsName}/${type}/${date}`
  }).get()

  if (ret.data.length > 0) {
    return ret.data[0].result
  }

  const resp = await axios({
    method: 'GET', url: baseUrl, headers: {
      'Content-Type': 'application/json;charset=utf-8',
      'Accept': 'application/json;charset=utf-8'
    }, params: {
      key,
      consName: dayconsName,
      type
    }
  }).then(res => {
    return res.data
  }, error => {
    return error
  })
  await db.collection('horoscope').add({
    data: {
      date: `${dayconsName}/${type}/${date}`,
      result: resp
    }
  })

  return resp
}