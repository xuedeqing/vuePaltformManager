<template>
  <div>
    <script id="editor" type="text/plain"></script>
  </div>
</template>
<script>
  export default {
    name: 'UE',
    data () {
      return {
        editor: null
      }
    },
    props: {
      defaultMsg: {
        type: String
      },
      config: {
        type: Object
      }
    },
    mounted () {
      const _this = this
      this.editor = window.UE.getEditor('editor', this.config) // 初始化UE
      this.editor.addListener('ready', function () {
        _this.editor.setContent(_this.defaultMsg) // 确保UE加载完成后，放入内容。
      })
      // 上传图片复写
      window.UE.Editor.prototype._bkGetActionUrl = window.UE.Editor.prototype.getActionUrl
      window.UE.Editor.prototype.getActionUrl = function (action) {
        if (action === 'uploadimage' || action === 'uploadscrawl' || action === 'uploadimage') {
          return this.HOST + '/picture/update'
        } else if (action === 'uploadvideo') {
          return this.HOST + '/picture/update'
        } else {
          // return this._bkGetActionUrl.call(this, action)
        }
      }
    },
    methods: {
      getUEContent () { // 获取内容方法
        return this.editor.getContent()
      }
    },
    destroyed () {
      this.editor.destroy()
    }
  }
</script>
<style lang='scss' media="screen">
  #editor{
    height: 200px;
  }
  .edui-default,.edui-edito{
    height: 200px;
  }
  .edui-editor-iframeholder{
    height: 56% !important;
  }
</style>
