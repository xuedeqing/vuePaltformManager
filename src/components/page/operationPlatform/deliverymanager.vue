<template>
<div class="deliverymanager">
  <v-subsidebar :sidebardata='sidebardatas' :maintitle='maintitle' defaultLightHeight='deliveryModel'></v-subsidebar>
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
        index: 'deliveryModel',
        title: '运费模板'
      }]
    }
  },
  mounted () {
    this.maintitle = window.localStorage.getItem('maintitle')
  }
}
</script>

<style lang="scss">
.deliverymanager {
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
