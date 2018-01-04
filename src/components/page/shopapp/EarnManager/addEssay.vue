<template lang="html">
  <div class="addessay">
    <div class="topbar">
      <span class="shortline"></span>
      <span class="title">营销专题文章管理 - {{curTitle}}</span>
      <el-button class="backlist" @click="backlist()">返回列表</el-button>
    </div>
    <div class="addessaybox">
      <el-form :model="essayForm" :rules="essayrules" ref="essayForm" label-width="100px" class="clrfix formbox">
        <div class="formitems-left">
          <el-form-item label="所属专题" prop="specialSelect" class="formitem">
            <el-select v-model="essayForm.specialSelect" placeholder="请选择所属专题" class="specialselect">
               <el-option
                 v-for="item in specialItems"
                 :key="item.id"
                 :label="item.title"
                 :value="item.id">
               </el-option>
           </el-select>
          </el-form-item>
          <el-form-item label="标题" prop="title" class="formitem">
            <el-input v-model="essayForm.title" placeholder='请填写文章标题'></el-input>
          </el-form-item>
          <el-form-item label="专题首推" prop="firstpush">
            <el-switch  v-model="essayForm.firstpush"  on-text=""  off-text=""></el-switch>
          </el-form-item>
          <el-form-item label="文章封面" prop="poster" class="formitem">
            <div class="uploadbox">
              <el-upload
              class="upload-demo"
              :action="posterUrl"
              :data='otherParams'
              name="picture"
              :on-success='getPoster'
              :file-list = 'specilaImgList'
              drag>
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
              <div class="el-upload__tip" slot="tip">上传 jpg/png 图片文件，且不超过500kb，规格建议700*394</div>
            </el-upload>
          </div>
        </el-form-item>
        </div>
        <div class="formitems-right">
        <el-form-item label="文章详情" prop="details" class="formitem editorItem"  >
            <div :class="{ editorbox:true,fullscreen: this.fullState}">
              <v-editor ref="detailsEditor" v-model='editorContent'></v-editor>
              <el-button type='primary' class="screenBtn" @click='becomeFullscreen'>{{fullscreenBtnContent}}</el-button>
            </div>
        </el-form-item>
        <div class="recommedBox">
          <div class="recommendtop">
              推荐商品
              <el-button class="recommedbtn" @click='delGroup'>移除推荐</el-button>
              <el-button type='primary' class="recommedbtn" @click='putInRecommend()'>加入推荐</el-button>
              <el-select v-model="nameOrId" placeholder="商品名称／ID" class="specialselect">
                <el-option
                v-for="item in idNameItems"
                :key="item.id"
                :label="item.GoodsName"
                :value="item.id">
              </el-option>
              </el-select>
              <el-button type='primary' class="recommedbtn" @click='idNameSearch()'>搜索</el-button>
              <el-input v-model='nameIdSearch' placeholder='根据商品ID或名称进行搜索' class='nameidInp'></el-input>
          </div>
          <div class="recommedTable">
            <el-table :data="recommedData" style="width: 100%" border height='185' @selection-change="handleSelectionChange">
              <el-table-column  type="selection" width="55"></el-table-column>
               <el-table-column label="编号" prop='id' ></el-table-column>
               <el-table-column label="主图"  prop='mainpic'>
                <template scope='scope'>
                  <div class="recommedMainPic">
                    <img :src="scope.row.picture" alt="">
                  </div>
                </template>
                </el-table-column>
               <el-table-column label="商品标题"  prop='goods_name' width='100'></el-table-column>
               <el-table-column label="品牌"  prop='brandName' ></el-table-column>
               <el-table-column label="平台售价"  prop='price' width='100'>
                 <template scope='scope'>
                  <span>{{scope.row.min_price}}-{{scope.row.max_price}}</span>
                 </template>
               </el-table-column>
               <el-table-column label="市场售价"  prop='marketPrice'width='100'>
                 <template scope='scope'>
                  <span>{{scope.row.min_market}}-{{scope.row.max_market}}</span>
                 </template>
               </el-table-column>
               <el-table-column label="是否上架" prop='grounding' width='100'>
                  <template scope='scope'>
                       <div class="">
                         上架
                       </div>
                 </template>
                </el-table-column>
             </el-table>
            </div>
          </div>
        </div>
      </el-form>
      <div class="bottomblock">
        <el-button type='primary'class="savebtn" @click='addArticle'>提交保存</el-button>
      </div>
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
      sels: [],
      curTitle: '添加文章',
      idNameItems: '',
      curIdOrName: '',
      subjectId: '',
      // 推荐商品数组
      goodsIdArr: [],
      otherParams: {
        type: 0
      },
      editorContent: '',
      posterUrl: '',
      essayForm: {
        specialSelect: '',
        title: '',
        firstpush: false,
        poster: '',
        details: ''
      },
      essayrules: {
        specialSelect: [
          { required: true, message: '请选择所属专题', trigger: 'change' }
        ],
        title: [
          { required: true, message: '请填写文章标题', trigger: 'blur' }
        ],
        firstpush: [
          { required: true, message: '请填写文章标题', trigger: 'change' }
        ],
        poster: [
          { required: true, message: '请填写文章标题', trigger: 'change' }
        ],
        details: [
          { required: true, message: '请填写文章标题', trigger: 'change' }
        ]
      },
      specialSelect: '',
      specialItems: [],
      nameOrId: '',
      nameIdItems: [{
        value: 'id1',
        label: '商品1'
      }, {
        value: 'id1',
        label: '商品2'
      }],
      nameIdSearch: '',
      // 推荐商品表格数据
      recommedData: [],
      posterurl: '',
      specilaImgList: [],
      // 富文本是否全屏
      fullState: false,
      fullscreenBtnContent: '预览全屏',
      onOff: false
    }
  },
  methods: {
    becomeFullscreen () {
      this.onOff = !this.onOff
      if (this.onOff) {
        this.fullState = true
        this.fullscreenBtnContent = '退出全屏'
      } else {
        this.fullState = false
        this.fullscreenBtnContent = '预览全屏'
      }
    },
    // 批量删
    delGroup () {
      var ids = this.sels.map(item => item.index).join(',').split(',').reverse()
      console.log(ids, 'ids', this.recommedData)
      for (var i = 0; i < ids.length; i++) {
        this.recommedData.splice(ids[i], 1)
        console.log('之后的数组', this.recommedData)
      }
    },
    // inner全选操作
    handleSelectionChange (sels) {
      console.log('全选', sels)
      this.sels = sels
      for (var i = 0; i < sels.length; i++) {
        this.sels[i].index = i
      }
      console.log('全选', this.sels)
    },
    backlist () {
      this.$router.push({
        path: './earnarticle_manager'
      })
    },
    getPoster (res, file, fileList) {
      this.posterurl = res.data[0]
      console.log(res, file, fileList)
    },
    // 文章提交
    addArticle () {
      console.log('本次富文本', this.editorContent)
      if (this.articleId === 'null') {
        // 添加
        var addArticleUrl = this.HOST + 'subject/article/add'
        if (this.essayForm.firstpush === false) {
          this.essayForm.firstpush = 0
        } else {
          this.essayForm.firstpush = 1
        }
        this.$http.post(addArticleUrl, qs.stringify({
          subjectId: this.essayForm.specialSelect,
          title: this.essayForm.title,
          first: this.essayForm.firstpush,
          imgPath: this.posterurl,
          description: this.editorContent,
          goodsIds: this.goodsIdArr
        })).then(res => {
          if (res.data.code === '0000') {
            this.$message({
              message: '保存成功',
              type: 'success'
            })
            // 提交完后清空
            this.essayForm.specialSelect = ''
            this.essayForm.title = ''
            this.essayForm.firstpush = false
            this.specilaImgList = []
            this.$refs.detailsEditor.setHtml('')
            this.recommedData = []
          } else {
            this.$message({
              message: '保存失败',
              type: 'warning'
            })
          }
        })
        console.log('添加')
      } else {
        console.log('编辑状态富文本', this.editorContent)
        console.log('商品id', this.goodsIdArr)
        if (this.essayForm.firstpush === true) {
          this.essayForm.firstpush = 1
        } else {
          this.essayForm.firstpush = 0
        }
        var updateArticleUrl = this.HOST + '/subject/article/update'
        this.$http.post(updateArticleUrl, qs.stringify({
          id: this.articleId,
          subjectId: this.essayForm.specialSelect,
          title: this.essayForm.title,
          first: this.essayForm.firstpush,
          imgPath: this.posterurl,
          description: this.editorContent,
          goodsIds: this.goodsIdArr
        })).then(res => {
          if (res.data.code === '0000') {
            this.$message({
              message: '保存成功',
              type: 'success'
            })
          } else {
            this.$message({
              message: '保存失败',
              type: 'warning'
            })
          }
        })
      }
    },
    getSpecialList () {
      var specialListUrl = this.HOST + '/subject/findAllSubject'
      this.$http(specialListUrl).then(res => {
        if (res.data.code === '0000') {
          this.specialItems = res.data.data
        }
        console.log('专题列表666', res.data.data)
      })
    },
    // 根据id或者名字搜索
    idNameSearch () {
      console.log(this.nameIdSearch)
      var relativeGoodUrl = this.HOST + '/goods/inquireNameOrId'
      this.$http.post(relativeGoodUrl, qs.stringify({
        nameOrId: this.nameIdSearch
      })).then(res => {
        this.idNameItems = res.data.list
        console.log('关联商品', res.data.list)
      })
    },
    // 加入推荐
    putInRecommend () {
      console.log('当前加入推荐', this.nameOrId)
      var relativeGoodUrl = this.HOST + '/goods/goodsInfo'
      this.$http.post(relativeGoodUrl, qs.stringify({
        goodsId: this.nameOrId
      })).then(res => {
        console.log('加入推荐', res)
        if (res.data.code === '0000') {
          this.recommedData.push(res.data)
          this.goodsIdArr.push(this.nameOrId)
        } else {
          this.$message({
            message: '请选择一个商品',
            type: 'warning'
          })
        }
        console.log('加入关联商品', this.recommedData)
      })
    },
    // 根据id获取数据
    getCurArticleInfo () {
      var curArticleInfoUrl = this.HOST + '/subject/findArticleById'
      this.$http.post(curArticleInfoUrl, qs.stringify({
        id: this.articleId
      })).then(res => {
        this.essayForm.title = res.data.title
        if (res.data.first === 1) {
          this.essayForm.firstpush = true
        } else {
          this.essayForm.firstpush = false
        }
        this.essayForm.specialSelect = res.data.subjectId
        this.specilaImgList = [{name: res.data.imgPath.split('/')[res.data.imgPath.split('/').length - 1], url: res.data.imgPath}]
        this.$refs.detailsEditor.setHtml(res.data.detail.description)
        this.recommedData = res.data.goodsList
        for (var i = 0; i < this.recommedData.length; i++) {
          this.goodsIdArr[i] = this.recommedData[i].id
        }
        this.posterurl = res.data.imgPath
        this.editorContent = res.data.detail.description
        console.log('当前数据', res.data)
      })
    }
  },
  mounted () {
    this.posterUrl = this.HOST + '/picture/update'
    this.articleId = window.sessionStorage.getItem('curArticleID')
    // this.essayForm.specialSelect = window.sessionStorage.getItem('specialName')
    console.log('当前文章id', this.articleId)
    this.getSpecialList()
    // 获取关联商品
    this.idNameSearch()
    if (this.articleId === 'null') {
      this.curTitle = '添加文章'
    } else {
      this.curTitle = '编辑文章'
      console.log('编辑')
      this.getCurArticleInfo()
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../../../assets/css/common.scss";
.addessay{
  height: 100%;
  padding: 0 25px;
  .backlist{
    float: right;
    margin-top: 22px;
  }
  .addessaybox{
    margin-top: 20px;
    height: 100%;
    .formbox{
      height: 100%;
    }
    .formitems-left, .formitems-right{
      float: left;
    }
    .formitems-left{
      width: 30%;
      .specialselect{
        width: 100%;
      }
    }
    .formitems-right{
      width: 64%;
      margin-left: 1%;
      height: 100%;
      .editorItem{
        height: 366px;
      }
      .editorbox{
        height: 360px;

        .screenBtn{
          position: absolute;
          right: 5px;
          top: 6px;
        }
      }
      .fullscreen{
        position: fixed;
        top: 60px;
        left: 10%;
        height: 80%;
        z-index: 10;
        width: 80%;
      }
      // 推荐商品部分
      .recommedBox{
        margin-left: 140px;
        .recommendtop{
          background:#f9fafc;
          height:66px;
          line-height: 66px;
          padding: 0 15px;
          .specialselect{
            float: right;
            margin-right: 5px;
          }
          .nameidInp{
            width: 26%;
            float: right;
            margin-right: 5px;

          }
          .recommedbtn{
            margin-right: 5px;
            float: right;
            margin-top: 14px;
          }
        }
        .recommedTable{
          margin-top: 5px;
          .recommedMainPic{
            img{
              background:#f2f2f2;
              border:1px solid #cccccc;
              width:100%;
              height:69px;
              margin-top: 5px;
              display: inline-block;
            }
          }
        }
      }
    }
  }
  .bottomblock{
    height: 80px;
    position: absolute;
    bottom: 0;
    width: 72%;
    border-top: 1px solid #e0e6ed;
    .savebtn{
      margin-top: 20px;
      float: right;
    }
  }
}

</style>
<style media="screen">
.el-upload{
  width: 100%;
}
.upload-demo  .el-upload-dragger{
    width: 100%;
    background: #f9fafc !important;
}
.w-e-text-container{
height: 90% !important;
}
.w-e-text{
  background: #fff;
}
</style>
