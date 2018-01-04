<template lang="html">
  <div class="articlemanager">
    <v-subsidebar :sidebardata='sidebardatas' :maintitle='maintitle' defaultLightHeight='article_maintenance'></v-subsidebar>
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
        index: 'article_maintenance',
        title: '文章维护'
      }, {
        index: 'article_sort',
        title: '文章分类'
      }, {
        index: 'articlre_comment',
        title: '文章评论'
      }]
    }
  },
  mounted () {
    this.maintitle = window.localStorage.getItem('maintitle')
  }
}
</script>

<style lang="scss" scoped>
.articlemanager{
  height: 100%;
  .innercontent{
    float: left;
    width: 88%;
    height: 100%;
  }
}
</style>
