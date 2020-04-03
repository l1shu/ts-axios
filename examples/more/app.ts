import axios from '../../src/index'

// document.cookie = 'a=b; samesite=none;'

// axios.post('http://b.com/more/server2', { }, {
//   withCredentials: true
// }).then(res => {
//   console.log(res)
// })
const instance = axios.create({
  xsrfCookieName: 'XSRF-TOKEN-D',
  // xsrfHeaderName: 'X-XSRF-TOKEN-D'
})

instance.request({}).then(res => {
  console.log(res)
})