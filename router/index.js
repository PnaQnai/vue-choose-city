import Vue from 'vue'
import Router from 'vue-router'
import City from '@/pages/City/City'
Vue.use(Router)

export default new Router({
  // 3.1 配置一级路由
  routes: [
    {
      // 城市
      path: '/City',
      meta: {
        title: "城市选择"
      },
      component: City
    }
  ]

})
