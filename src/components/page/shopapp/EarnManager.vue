<template>
<div class="earnmanager">
  <v-subsidebar :sidebardata='sidebardatas' :maintitle='maintitle' defaultLightHeight='earntype_manager'></v-subsidebar>
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
        index: 'earntype_manager',
        title: '营销专题类型管理'
      }, {
        index: 'earnarticle_manager',
        title: '营销专题文章管理'
      }]
    }
  },
  mounted () {
    this.maintitle = window.localStorage.getItem('maintitle')
  }
}
</script>

<style lang="scss">
.earnmanager {
  height: 100%;
  width: 100%;
  .innercontent{
    float: left;
    width: 88%;
    height: 100%;
    background: #fff;
  }
}
</style>
