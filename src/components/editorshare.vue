<template>
    <div class="editor-block" >
        <div id="editorshare" style="text-align:left"></div>
        <div class="eachbox">
          <span>输入userId:</span>
          <el-input class="inpbox" type="text" name="" value="" v-model='userId'></el-input>
        </div>
        <div class="eachbox">
          <span>输入标题:</span>
          <el-input class="inpbox" type="text" name="" value="" v-model='title' :maxlength='titlelength'></el-input>
        </div>
        <div class="eachbox">
          <span>选择专业度：</span>
            <el-checkbox-group v-model="professional">
            <el-checkbox label="儿童"></el-checkbox>
            <el-checkbox label="艺考生"></el-checkbox>
            <el-checkbox label="艺术家"></el-checkbox>
          </el-checkbox-group>
        </div>
        <div class="eachbox">
          <el-upload
            class="upload-demo"
            :action="posterUrl"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :file-list="fileList"
            :data='otherParams'
            :on-change='uploadPoster'
            name="picture">
            <el-button size="small" type="primary" >点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </div>
        <div class="eachbox">
          添加描述
              <el-input
            type="textarea"
            :rows="6"
            placeholder="请输入描述"
            v-model="description">
          </el-input>
        </div>
        <div class="eachbox">
          选择类型
          <el-radio-group v-model="choosetype" @change='getType'>
          <el-radio class="choosetype" :label="0">图片</el-radio>
          <el-radio class="choosetype" :label="1">视频</el-radio>
          </el-radio-group>
          <div class="vidoeUrlBox" v-if="currenttype">
            输入视频url:   <el-input class="inpbox" type="text" name="" value="" v-model='mediaUrl' ></el-input>
          </div>
        </div>
        <el-button @click="getContent" class="getContent">查看内容</el-button>
    </div>
</template>

<script>
    import E from 'wangeditor'
    import qs from 'querystring'
    export default {
      name: 'editor',
      data () {
        return {
          editorContent: '',
          userId: '',
          title: '',
          pictureword: '',
          posterfile: '',
          poster: '',
          allContent: [],
          fileList: [],
          posterUrl: '',
          posterRes: [],
          linkUrl: '',
          choosetype: 0,
          currenttype: 0,
          description: '',
          // 标题长度限制100
          titlelength: 100,
          mediaUrl: '',
          professional: [],
          // 上传图片其他参数
          otherParams: {
            type: 0
          }
        }
      },
      methods: {
        getType (value) {
          console.log(value)
          this.currenttype = value
        },
        handleRemove (file, fileList) {
          // console.log(file, fileList)
        },
        handlePreview (file) {
          // console.log(file)
        },
        // 上传封面图
        uploadPoster (file, fileList) {
          console.log(file)
          console.log(file['response'])
          this.posterRes = file['response']
          if (file['response'] !== undefined) {
            this.linkUrl = this.posterRes['data'][0]
          }
          // this.posterUrl = file.response.data
          // console.log('flie,fileList', file, fileList)
        },
        getContent () {
          this.allContent['userItem'] = this.userId
          this.allContent['editorItem'] = this.editorContent
          this.allContent['posterItem'] = this.linkUrl
          this.allContent['titleItem'] = this.title
          this.allContent['typeItem'] = this.currenttype
          // 专业度
          for (var i = 0; i < this.professional.length; i++) {
            if (this.professional[i] === '艺术家') {
              this.professional[i] = '905496907288801280'
            } else if (this.professional[i] === '儿童') {
              this.professional[i] = '905496956341186560'
            } else if (this.professional[i] === '艺考生') {
              this.professional[i] = '905497000209412096'
            }
          }
          console.log(this.professional)
          var addShareUrl = this.HOST + '/share/insert'
          if (this.userId !== '' && this.editorContent !== '' && this.linkUrl !== '' && this.title !== '' && this.professional !== []) {
            this.$http.post(addShareUrl, qs.stringify(
              {
                userId: this.userId,
                details: this.editorContent,
                cover: this.linkUrl,
                title: this.title,
                type: this.currenttype,
                desc: this.description,
                mediaUrl: this.mediaUrl,
                profession: this.professional
              }
            )).then(res => {
              console.log(typeof res.data.code)
              if (res.data.code === '0000') {
                alert('上传成功')
                // 成功后清除内容
                window.location.reload()
              } else {
                alert('上传失败，错误码是' + res.data.code + ',请联系开发者')
              }
              console.log(res.data.code)
            })
          } else {
            alert('请输入完整信息')
          }
          console.log(this.allContent)
          // alert(this.editorContent)
        }
      },
      mounted () {
        this.posterUrl = this.HOST + '/picture/update'
        var editor = new E('#editorshare')
        editor.customConfig.onchange = (html) => {
          this.editorContent = html
        }
        editor.customConfig.uploadImgHeaders = {
          'Accept': 'text/x-json'
        }
        // 配置服务器端地址
        editor.customConfig.uploadImgServer = this.HOST + '/picture/update'
        // 通过 url 参数配置 debug 模式。url 中带有 wangeditor_debug_mode=1 才会开启 debug 模式
        editor.customConfig.uploadImgParams = {
          type: 0   // 属性值会自动进行 encode ，此处无需 encode
        }
        editor.customConfig.uploadImgHooks = {
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
        editor.customConfig.uploadFileName = 'picture'
        editor.customConfig.debug = true
        editor.create()
      }
    }
</script>

<style scoped>
#editorshare{
  width: 80%;
}
.eachbox{
    border-bottom: 1px solid red;
    width: 80%;
    padding-bottom: 10px;
    margin-top: 20px;
}
.inpbox{
  width: 80%;
}
.getContent{
  margin-top: 10px;
}
</style>
