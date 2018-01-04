<template>
<div class="goodsmanager">
  <v-subsidebar :sidebardata='sidebardatas' :maintitle='maintitle' defaultLightHeight='store'></v-subsidebar>
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
        index: 'store',
        title: '商品库'
      }, {
        index: 'sort',
        title: '商品类别'
      }, {
        index: 'standard',
        title: '商品规格'
      }, {
        icon: 'el-icon-setting',
        index: 'operationPlatform1',
        title: '系列管理1',
        subs: [{
          index: 'platform01',
          title: '运营平台01'
        }]
      }]
    }
  },
  mounted () {
    this.maintitle = window.localStorage.getItem('maintitle')
  }
}
</script>

<style lang="scss">
.goodsmanager {
  height: 100%;
  width: 100%;
  .innercontent{
    float: left;
    width: 88%;
    height: 100%;
  }
}
</style>
