<template>
    <div :class="{ editorBlock:true,fullscreen: this.fullState}">
        <el-button type='primary' class="screenBtn" @click='becomeFullscreen'>{{fullscreenBtnContent}}</el-button>
        <el-button type='primary' class="codeBtn" @click='codeModel'>切换模式</el-button>
        <div id="editor" style="text-align:left"></div>
        <textarea id="myTextArea"v-show='textStatus' v-model='htmlCode'></textarea>
        <!-- <el-button type='primary' class="getCode" @click='lookCode'>查看源码</el-button> -->
    </div>
</template>

<script>
    import E from 'wangeditor'

    export default {
      props: ['mycontent', 'curType'],
      name: 'editor',
      data () {
        return {
          editorContent: '',
          myGoodId: '',
          // 富文本是否全屏
          fullState: false,
          fullscreenBtnContent: '预览全屏',
          onOff: false,
          textStatus: false,
          htmlCode: ''
        }
      },
      methods: {
        codeModel () {
          this.textStatus = !this.textStatus
          if (this.textStatus) {
            this.htmlCode = this.editor.txt.html()
          } else {
            console.log('渲染过来', this.htmlCode)
            this.editor.txt.html(this.htmlCode)
            this.editorContent = this.htmlCode
            // 执行此语句，解决由代码模式时进行更改，传过去富文本不生效，任为文本模式的内退
            this.outputContent()
          }
        },
        outputContent () {
          this.$emit('input', this.editorContent)
          this.myGoodId = this.curGoodId
        },
        setHtml (html) {
          this.editor.txt.html(html)
        },
        // 全屏
        becomeFullscreen () {
          this.onOff = !this.onOff
          if (this.onOff) {
            this.fullState = true
            this.fullscreenBtnContent = '退出全屏'
          } else {
            this.fullState = false
            this.fullscreenBtnContent = '预览全屏'
          }
        }
      },
      mounted () {
        console.log(this.curGoodId, '富文本收到的id')
        this.editor = new E('#editor')
        // 自定义菜单配置
        this.editor.customConfig.menus = [
          'source',
          'head',  // 标题
          'bold',  // 粗体
          'italic',  // 斜体
          'underline',  // 下划线
          'strikeThrough',  // 删除线
          'foreColor',  // 文字颜色
          'backColor',  // 背景颜色
          'link',  // 插入链接
          'list',  // 列表
          'justify',  // 对齐方式
          'quote',  // 引用
          'emoticon',  // 表情
          'image',  // 插入图片
          'table',  // 表格
          'video',  // 插入视频
          'code',  // 插入代码
          'undo',  // 撤销
          'redo'  // 重复
        ]
        this.editor.customConfig.onchange = (html) => {
          this.editorContent = html
          this.outputContent()
        }
        this.editor.customConfig.uploadImgHeaders = {
          'Accept': 'text/x-json'
        }
        // 配置服务器端地址
        this.editor.customConfig.uploadImgServer = this.HOST + '/picture/updateDefault'
        // 通过 url 参数配置 debug 模式。url 中带有 wangeditor_debug_mode=1 才会开启 debug 模式
        this.editor.customConfig.uploadImgHooks = {
          success: function (xhr, editor, result) {
            console.log('成功', xhr, editor, result)
              // 图片上传并返回结果，图片插入成功之后触发
              // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
          },
          fail: function (xhr, editor, result) {
            console.log('xhr', xhr)
            console.log('editor', editor)
            console.log('result', result)
          },
          error: function (xhr, editor) {
            console.log('error')
            console.log('xhr', xhr)
            console.log('editor', editor)
          },
          timeout: function (xhr, editor) {
            console.log('超时')
          }
        }
        this.editor.customConfig.uploadFileName = 'picture'

        this.editor.customConfig.uploadImgParams = {
          typeName: this.curType  // 属性值会自动进行 encode ，此处无需 encode
        }
        this.editor.customConfig.debug = true
        this.editor.customConfig.pasteFilterStyle = false
        this.editor.create()
        this.editor.txt.html(this.mycontent)
      },
      watch: {

      }
    }
</script>

<style lang='scss'scoped>
#myTextArea{
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0%;
  left: 0%;
  z-index: 1000000;
}
.editorBlock{
  position: relative;
  height: 94%;
  .getCode{
    position: absolute;
    right:  100px;
    top: 6px;
  }
  .screenBtn{
    position: absolute;
    right: 5px;
    top: 6px;
  }
  .codeBtn{
    position: absolute;
    top: 6px;
    right: 95px;
    z-index: 10000000;
  }
}
.fullscreen{
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  z-index: 99;
  width: 100%;
  .w-e-text-container{
    height: 100%;
  }
}
#editor{
  height: 98%;

}
.editor-block{
  height: 100%;
}
.w-e-text-container{
  background: #fff;
  height: 90% !important;
}
</style>
<style media="screen">
.fullscreen .w-e-text-container{
    height: 100% !important;
  }
.fullscreen .w-e-text{
  background: #fff;
}
</style>
