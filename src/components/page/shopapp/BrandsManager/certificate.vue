<template lang="">
  <div class="certificate">
    授权证书详情页
    <img :src="certificateUrl" alt="">
  </div>
</template>

<script>
export default {
  data () {
    return {
      certificateUrl: ''
    }
  },
  mounted () {
    this.certificateUrl = window.sessionStorage.getItem('certificateUrl')
    console.log(this.certificateUrl)
  }
}
</script>

<style lang="css" scoped>
.certificate{
  font-size: 50px;
  text-align: center;
  vertical-align: middle;
}
</style>
