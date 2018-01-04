<template>
<div class="sellmanager">
  <v-subsidebar :sidebardata='sidebardatas' :maintitle='maintitle' defaultLightHeight='clientList'></v-subsidebar>
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
        index: 'clientList',
        title: '商家列表'
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
