<template>
<div class="sellmanager">
  <v-subsidebar :sidebardata='sidebardatas' :maintitle='maintitle' defaultLightHeight='sellsetting'></v-subsidebar>
  <div class="innercontent">
    <transition name="move" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</div>
</template>

<script>
import vSubsidebar from '../../common/Subsidebar.vue'

export default {
  components: {
    vSubsidebar
  },
  data () {
    return {
      maintitle: '',
      sidebardatas: [{
        index: 'sellsetting',
        title: '销售设置'
      }, {
        index: 'sellorder',
        title: '销售订单'
      }, {
        index: 'aftersell',
        title: '售后管理'
      }]
    }
  },
  mounted () {
    this.maintitle = window.localStorage.getItem('maintitle')
  }
}
</script>

<style lang="scss">
.sellmanager {
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
