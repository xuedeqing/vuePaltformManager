<template>
  <div id="app" class="bb-bx">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>
<style scope lang="sass">
  @import "./assets/css/base"
</style>
<style>
html,body{
  height: 100%;
  overflow-x: hidden;

}
#app {
  height: 100%;
}
</style>
