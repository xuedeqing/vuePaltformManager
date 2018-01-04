<template>
<div class="wrapper">
  <v-sidebar></v-sidebar>
  <div class="mainpage">
    <v-header></v-header>
    <div class="content">
      <transition name="move" mode="out-in">
        <router-view></router-view>
      </transition>
    </div>
  </div>
  </div>
</div>
</template>

<script>
import vHeader from './Header.vue'
import vSidebar from './Sidebar.vue'
export default {
  components: {
    vHeader,
    vSidebar
  },
  mounted () {
    // axios.delete('http://192.168.0.195:8080/brand?id=10001')
    //   .then(function (res) {
    //     console.log(res)
    //   })
    //   .catch(function (err) {
    //     console.log(err)
    //   })
  }
}
</script>

<style>
.wrapper,.mainpage{
  height: 100%;
  box-sizing: border-box;
}
.wrapper{
  width: 100%;
}
.mainpage{
  width: auto;
  overflow: hidden;
  /*margin-left: -220px;*/
}
.content {
  top: 60px;
  height: 100%;
  margin-top: -60px;
  padding-top: 60px;
  width: 100%;
}
</style>
