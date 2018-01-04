<template lang="html">
  <div class="brandsmanager">
    <v-subsidebar :sidebardata='sidebardatas' :maintitle='maintitle' defaultLightHeight='brands_maintenance'></v-subsidebar>
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
        index: 'brands_maintenance',
        title: '品牌维护'
      }, {
        index: 'country_maintenance',
        title: '国家维护'
      }]
    }
  },
  mounted () {
    this.maintitle = window.localStorage.getItem('maintitle')
  }
}
</script>

<style lang="scss">
.brandsmanager{
  height: 100%;
}
</style>
