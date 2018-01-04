// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import axios from 'axios'
// 富文本
import '../static/UE/ueditor.config.js'
import '../static/UE/ueditor.all.min.js'
import '../static/UE/lang/zh-cn/zh-cn.js'
import '../static/UE/ueditor.parse.min.js'
// 创建axios配置挂载到vue原型下
Vue.prototype.$http = axios.create({})

Vue.config.productionTip = false
Vue.prototype.HOST = '/api'
// Vue.prototype.HOST = ''
// 时间戳日期相互装换
Vue.prototype.transformTime = function (timestamp) {
  var time = new Date(timestamp)
  var y = time.getFullYear()
  var m = time.getMonth() + 1
  var d = time.getDate()
  var h = time.getHours()
  var mm = time.getMinutes()
  var s = time.getSeconds()
  return y + '-' + this.addZero(m) + '-' + this.addZero(d) + ' ' + this.addZero(h) + ':' + this.addZero(mm) + ':' + this.addZero(s)
}
Vue.prototype.addZero = function (m) {
  return m < 10 ? '0' + m : m
}
// 克隆函数
// Vue.prototype.deepCopy = function (p, target) {
//   target = target || []
//   for (var i in p) {
//     if (!p.hasOwnProperty(i)) {
//       continue
//     }
//     if (typeof p[i] === 'object') {
//       target[i] = (p[i].constructor === Array) ? [] : {}
//       this.deepCopy(p[i], target[i])
//     }
//   }
//   return target
// }
// 解决自动获取焦点
Vue.directive('focus', function (el, option) {
  var defClass = 'el-input'
  var defTag = 'input'
  var value = option.value || true
  if (typeof value === 'boolean') {
    value = {
      cls: defClass,
      tag: defTag,
      foc: value
    }
  } else {
    value = {
      cls: value.cls || defClass,
      tag: value.tag || defTag,
      foc: value.foc || false
    }
  }
  if (el.classList.contains(value.cls) && value.foc) {
    el.getElementsByTagName(value.tag)[0].focus()
  }
})
/* eslint-disable no-new */
Vue.use(ElementUI)
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: {
    App
  }
})
