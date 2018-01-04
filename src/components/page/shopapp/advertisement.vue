<template>
  <div class="advertisement">
    <v-subsidebar :sidebardata='sidebardatas' :maintitle='maintitle' defaultLightHeight='swiper_maintenance'></v-subsidebar>
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
        index: 'swiper_maintenance',
        title: '轮播维护'
      }, {
        index: 'brand_direct',
        title: '品牌直达'
      }]
    }
  },
  mounted () {
    this.maintitle = window.localStorage.getItem('maintitle')
  }
}
</script>

<style lang='scss'>
.advertisement{
  height: 100%;
  .innercontent{
    float: left;
    width: 88%;
    height: 100%;
    background: #fff;
  }
}
</style>
