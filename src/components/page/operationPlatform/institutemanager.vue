<template lang="html">
  <div class="insititutemanager">
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

export default {
  components: {
    vSubsidebar
  },
  data () {
    return {
      maintitle: '',
      curLightHigh: 'instituteList',
      sidebardatas: [{
        index: 'instituteList',
        title: '机构列表'
      }, {
        index: 'instituteType',
        title: '机构类型'
      }]
    }
  },
  mounted () {
    this.maintitle = window.localStorage.getItem('maintitle')
  }
}
</script>

<style lang="scss" scoped>
.insititutemanager {
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
