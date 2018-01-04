<template lang="html">
  <div class="addarticle">
    <div class="topbar">
      <span class="shortline"></span>
      <span class="title">文章维护-{{articleTitle}}</span>
      <el-button @click="backlist" class="addsort">返回列表</el-button>
    </div>
    <div class="addarticlecontent">
      <el-form :model="articleForm" :rules="articlerules" ref="articleForm" label-width="100px" class="clrfix">
        <div class="formitems-left">
          <el-form-item label="文章标题" prop="title" class="formitem">
            <el-input v-model="articleForm.title"></el-input>
          </el-form-item>
          <el-form-item label="作者" prop="author" class="formitem">
            <el-input v-model="articleForm.author" placeholder='UserID'></el-input>
          </el-form-item>
          <el-form-item label="创建日期" prop="createtime" class="formitem">
            <el-date-picker
             v-model="curCreatetime"
             type="datetime"
             placeholder="选择日期时间"
            >
           </el-date-picker>
         </el-form-item>
          <el-form-item label="专业度" prop="professional" class="formitem">
            <el-checkbox-group v-model="articleForm.professional">
              <el-checkbox label="儿童"></el-checkbox>
              <el-checkbox label="艺考生"></el-checkbox>
              <el-checkbox label="艺术家"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="文章类型" prop="articletype" class="formitem">
            <el-radio-group v-model="choosetype" @change='getType'>
              <el-radio class="choosetype" :label="0">图文类型</el-radio>
              <el-radio class="choosetype" :label="1">视频类型</el-radio>
            </el-radio-group>
          </el-form-item>
        <el-form-item v-if="currenttype" label='视频地址' prop='mediaUrl' >
          <div class="vidoeUrlBox" >
             <el-input class="inpbox" type="text" name="" value="" v-model='articleForm.mediaUrl' ></el-input>
          </div>
        </el-form-item>
          <el-form-item label="文章主图" prop="mainpicture" class="formitem">
            <div class="uploadbox">
              <el-upload
              class="upload-demo"
              :action="posterUrl"
              :data='otherParams'
              name="picture"
              :on-success='getMainPic'
              :on-remove="removeMainPic"
              :on-change="handleChange"
              :file-list='mainfilelist'
              drag>
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
              <div class="el-upload__tip" slot="tip">上传 jpg/png 图片文件，且不超过500kb，规格建议700*394</div>
            </el-upload>
          </div>
        </el-form-item>
        </div>
        <div class="formitems-right">
          <el-form-item label="文章简介" prop="brief" class="formitem">
              <el-input
              type="textarea"
              :rows="3"
              placeholder="请输入描述"
              v-model="articleForm.brief">
            </el-input>
          </el-form-item>
        <el-form-item label="文章详情" prop="details" class="formitem" >
          <div class="editorbox">
            <!-- this.$refs.detailsEditor.setHtml('<p>123</p>') -->
            <v-editor ref="detailsEditor" v-model='editorContent' :mycontent='myContent' :curType='myType'></v-editor>
          </div>
        </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="bottombtnblock">
      <el-button  type="primary" class="savebtn" @click="saveCommit('articleForm')">提交保存</el-button>
    </div>
  </div>
</template>

<script>
import vEditor from '../../../editor'
import qs from 'querystring'
export default {
  components: {
    vEditor
  },
  data () {
    return {
      myType: 'yixiang',
      curCreatetime: '',
      mainfilelist: [],
      editorContent: null,
      articleForm: {
        title: '',
        author: '',
        professional: [],
        mainpicture: [],
        brief: '',
        details: '',
        mediaUrl: ''
      },
      articlerules: {
        title: [
          { required: true, message: '请填写标题名字', trigger: 'blur' }
        ],
        author: [
          { required: true, message: '请填写UserID', trigger: 'blur' }
        ],
        professional: [
          { type: 'array', required: true, message: '请至少勾选一个专业度', trigger: 'change' }
        ],
        brief: [
          { required: true, message: '请填写文章简介', trigger: 'blur' }
        ],
        mediaUrl: [
          { required: true, message: '请填写视频地址', trigger: 'change' }
        ]
      },
      currenttype: 0,
      choosetype: 0,
      otherParams: {
        type: 0
      },
      posterUrl: '',
      curMainUrl: '',
      curArticleId: '',
      curArticle: '',
      articleTitle: '',
      myContent: ''
    }
  },
  methods: {
    backlist () {
      this.$router.push({
        path: 'article_maintenance'
      })
    },
    getType (value) {
      this.currenttype = value
    },
    handleChange (file, fileList) {
      this.mainfilelist = fileList.slice(-1)
    },
    // 上传主图
    getMainPic (response, file, fileList) {
      console.log(response, file, fileList)
      this.curMainUrl = response.data[0]
      this.articleForm.mainpicture = response.data
      this.$refs['articleForm'].validate((valid) => {
        if (valid) {
            //
        } else {

        }
      })
    },
    removeMainPic (file, fileList) {
      this.curMainUrl = ''
      this.articleForm.mainpicture = []
    },
    saveCommit (formName) {
      for (var i = 0; i < this.articleForm.professional.length; i++) {
        if (this.articleForm.professional[i] === '艺术家') {
          this.articleForm.professional[i] = '905496907288801280'
        } else if (this.articleForm.professional[i] === '儿童') {
          this.articleForm.professional[i] = '905496956341186560'
        } else if (this.articleForm.professional[i] === '艺考生') {
          this.articleForm.professional[i] = '905497000209412096'
        }
      }
      // 转时间戳
      console.log('时间1', Number(this.curCreatetime))
      console.log('时间2', this.curCreatetime)
      this.articleForm.details = this.editorContent
      console.log('userId', this.articleForm.author)
      console.log('富文本', this.editorContent)
      console.log('封面图', this.curMainUrl)
      console.log('标题', this.articleForm.title)
      console.log('类型', this.currenttype)
      console.log('描述', this.articleForm.brief)
      console.log('视频地址', this.articleForm.mediaUrl)
      console.log('专业度', this.articleForm.professional)
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 新增状态
          if (this.curArticleId === 'null') {
            console.log('新增')
            var addShareUrl = this.HOST + '/share/insert'
            this.$http.post(addShareUrl, qs.stringify(
              {
                userId: this.articleForm.author,
                details: this.editorContent,
                cover: this.curMainUrl,
                title: this.articleForm.title,
                type: this.currenttype,
                desc: this.articleForm.brief,
                mediaUrl: this.articleForm.mediaUrl,
                profession: this.articleForm.professional,
                date: Number(this.curCreatetime)
              }
            )).then(res => {
              console.log(typeof res.data.code)
              if (res.data.code === '0000') {
                this.$message({
                  message: '上传成功',
                  type: 'success'
                })
                // 上传成功后跳到列表页
                this.$router.push({
                  path: './article_maintenance'
                })
                // 成功后清除内容
                this.articleForm.title = ''
                this.articleForm.author = ''
                this.editorContent = ''
                this.articleForm.mainpicture = ''
                this.currenttype = 0
                this.articleForm.brief = ''
                this.articleForm.mediaUrl = ''
                this.articleForm.professional = []
                this.mainfilelist = []
                this.curCreatetime = ''
                this.$refs.detailsEditor.setHtml('')
              } else {
                this.$message({
                  message: '上传失败，原因是' + res.data.msg + ',请联系开发者',
                  type: 'warning'
                })
              }
            })
          } else {
            // 编辑
            var updateShareUrl = this.HOST + '/share/update'
            this.$http.post(updateShareUrl, qs.stringify(
              {
                id: this.curArticleId,
                userId: this.articleForm.author,
                details: this.editorContent,
                cover: this.curMainUrl,
                title: this.articleForm.title,
                type: this.currenttype,
                desc: this.articleForm.brief,
                mediaUrl: this.articleForm.mediaUrl,
                profession: this.articleForm.professional,
                date: Number(this.curCreatetime)
              }
            )).then(res => {
              console.log(typeof res.data.code)
              if (res.data.code === '0000') {
                this.$message({
                  message: '编辑成功',
                  type: 'success'
                })
                // 成功后清除内容
                // this.articleForm.title = ''
                // this.articleForm.author = ''
                // this.editorContent = ''
                // this.articleForm.mainpicture = ''
                // this.currenttype = 0
                // this.articleForm.brief = ''
                // this.articleForm.mediaUrl = ''
                // this.articleForm.professional = []
                // this.mainfilelist = []
                // this.curCreatetime = ''
                // this.$refs.detailsEditor.setHtml('')
              } else {
                this.$message({
                  message: '上传失败，原因是' + res.data.msg + ',请联系开发者',
                  type: 'warning'
                })
              }
            })
          }
        } else {
          this.$message({
            message: '请填写完整信息',
            type: 'warning'
          })
          return false
        }
      })
    }
  },
  mounted () {
    this.posterUrl = this.HOST + '/picture/update'
    // 判断是新增还是编辑
    this.curArticleId = window.sessionStorage.getItem('curArticleId')
    if (this.curArticleId === 'null') {
      this.articleTitle = '新增文章'
    } else {
      this.articleTitle = '编辑文章'
      console.log('当前id', this.curArticleId)
      var getCurInfoUrl = this.HOST + '/share/see/' + this.curArticleId
      this.$http.post(getCurInfoUrl, qs.stringify({
        id: this.curArticleId
      })).then(res => {
        console.log(res.data)
        this.editorContent = res.data.details
        if (res.data.code === '0000') {
          this.curArticle = res.data
          console.log('当前信息', this.curArticle)
          this.articleForm.title = this.curArticle.title
          this.articleForm.author = this.curArticle.userId
          this.curCreatetime = this.curArticle.createdtime
          this.professionArr = this.curArticle.profession.split(',')
          for (var i = 0; i < this.professionArr.length; i++) {
            if (this.professionArr[i] === '905496907288801280') {
              this.professionArr[i] = '艺术家'
            } else if (this.professionArr[i] === '905496956341186560') {
              this.professionArr[i] = '儿童'
            } else if (this.professionArr[i] === '905497000209412096') {
              this.professionArr[i] = '艺考生'
            }
          }
          this.articleForm.professional = this.professionArr
          this.choosetype = this.curArticle.type
          this.articleForm.mediaUrl = this.curArticle.mediaUrl
          this.curMainUrl = this.curArticle.cover
          this.mainfilelist = [{name: this.curArticle.cover.split('/')[this.curArticle.cover.split('/').length - 1], url: this.curArticle.cover}]
          this.articleForm.brief = this.curArticle.desc
          console.log(this.curArticle.details)
          this.$refs.detailsEditor.setHtml(this.curArticle.details)
          this.myContent = this.curArticle.details
          // this.myContent = '<p>用 JS a 设置的内容a</p>'
        }
      })
    }
  },
  watch: {
  }
}
</script>

<style lang="scss" scoped>
@import "../../../../assets/css/common.scss";
.addarticle {
    padding: 0 25px;
    height: 100%;
    position: relative;
    background: #fff;
    .addarticlecontent{
      margin-top: 20px;
      .formitems-left, .formitems-right{
        float: left;
      }
      .formitems-left{
        width: 30%;
        .el-date-editor.el-input{
          width: 100%;
        }
      }
      .formitems-right{
        width: 64%;
        margin-left: 1%;
        .editorbox{
          height: 150px;
          .screenBtn{
            position: absolute;
            right: 5px;
            top: 6px;
            z-index: 100;
          }
        }
        .fullscreen{
          position: fixed;
          top: 0;
          left: 00;
          height: 100%;
          z-index: 99;
          width: 100%;
        }
      }
    }
    // 底部提交部分
    .bottombtnblock{
      position: fixed;
      bottom: 0;
      height: 60px;
      width: 70%;
      border-top: 1px solid #e0e6ed;
      // width: 100%;
      .savebtn{
        margin-top: 10px;
        float: right;
      }
    }
  }
</style>
<style media="screen">
.upload-demo  .el-upload-dragger{
    background: #f9fafc !important;
}
.w-e-text-container{
  height: 63% !important;
}
.w-e-text{
  background: #fff;
}
</style>
