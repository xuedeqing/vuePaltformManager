<template lang="html">
  <div class="helpcenter">
    <v-subsidebar :sidebardata='sidebardatas' :maintitle='maintitle' :defaultLightHeight='curLightHigh'></v-subsidebar>
    <div class="innercontent" >
      <transition name="move" mode="out-in">
        <router-view></router-view>
      </transition>
    </div>
  </div>
</template>

<script>
import vSubsidebar from '../../common/Subsidebar.vue'
import Bus from '../../../assets/js/bus.js'

export default {
  components: {
    vSubsidebar
  },
  data () {
    return {
      maintitle: '',
      curLightHigh: 'sortmanager',
      sidebardatas: [{
        index: 'sortmanager',
        title: '分类管理'
      }, {
        index: 'contentmanager',
        title: '内容管理'
      }]
    }
  },
  methods: {
  },
  created () {
    Bus.$on('highIndexName', (e) => {
      this.curLightHigh = e
    })
  },
  mounted () {
    this.maintitle = window.localStorage.getItem('maintitle')
    // 通过其他按钮进入路由改变来改变subsidebar的高亮
    var curRouterName = window.location.href.split('/').pop()
    console.log('高亮help', curRouterName)
  }
}
</script>

<style lang="scss">
.helpcenter {
  height: 100%;
  width: 100%;
  .innercontent{
    background: #fff;
    float: left;
    width: 88%;
    height: 100%;
  }
}
</style>
