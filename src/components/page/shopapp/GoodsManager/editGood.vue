<template lang="html">
  <div class="editGood">
    <div class="topbar">
      <span class="shortline"></span>
      <span class="title">商品库 - 编辑商品</span>
      <el-button @click="backStore" class="addsort">返回商品库</el-button>
    </div>
    <div class="editContent">
      <el-form :model="editForm" :rules="editrules" ref="editForm" label-width="100px">
      <el-form-item label="商品编码" prop="code">
        <el-input :disabled="true" placeholder="保存后系统自动生成" class="codeinput" v-model='goodID'></el-input>
      </el-form-item>
      <el-tabs v-model="activeName" type="card" @tab-click="editTabChange" class="editTags">
        <el-tab-pane label="商品属性" name="goodattr" class="tagAttr">
          <div class="inner-table-box goodAttr">
            <div class="inner-head">
              商品属性维护
                 <el-button class="inner-btn" @click="addStandard">添加属性</el-button>
            </div>
            <!-- 添加属性表格 -->
            <div class="attrtable">
              <!-- bug: 表格内容不居中 -->
              <el-table :data="attrdata" style="width: 100%" border height='300'>
                <el-table-column prop="name"  label="属性名称"  width="120">
                </el-table-column>
                <el-table-column prop="value"  label="属性内容">
                </el-table-column>
                <el-table-column prop="attroperation"  label="操作"  width="100">
                  <template scope="scope">
                  <p class='edit' @click='editAttrItem(scope.$index, scope.row)'>编辑</p>
                  <p class="delete" @click='deleteAttrItem(scope.$index, scope.row)'>删除</p>
                </template>
                </el-table-column>
              </el-table>
            </div>
            <!-- 添加属性弹框start-->
            <el-dialog :title="attrTitle" :visible.sync="addAttrDialog" size="tiny" class="addAttrdialog">
              <el-form :model="attrform" :rules='attrrules' ref="attrform">
               <el-form-item label="属性名称" prop='nameitem'>
                 <el-input  class="dialoginput" v-model="attrform.nameitem" placeholder="请填写属性名称"></el-input>
               </el-form-item>
               <el-form-item label="属性内容" prop='contentitem'>
                 <el-input  class="dialoginput" v-model="attrform.contentitem" placeholder="请填写属性内容"></el-input>
               </el-form-item>
             </el-form>
              <span slot="footer" class="dialog-footer">
                <el-button @click="addAttrDialog = false">取 消</el-button>
                <el-button type="primary" class='' @click="toAddAttr">确 定</el-button>
              </span>
            </el-dialog>
            <!-- 添加属性弹框end -->
           </div>
        </el-tab-pane>
        <el-tab-pane label="商品详情" name="gooddetail" class="detailOut">
          <div class="detailBox">
            <el-form :model="detailForm" :rules="detailrules" ref="detailForm" label-width="100px" class="demo-ruleForm">
              <el-form-item label="商品主图" prop="pictureitem" class="mainPicBox" id='mainPicDom'>
                <el-upload
                    class="upload-demo mainPicUpload"
                    drag
                    :action="uploadUrl"
                    name="picture"
                    :data='otherParams'
                    :file-list="mainPicList"
                    :on-success='mainImgSuccess'
                    :on-change='uploadMainPic'
                    :on-remove='mainPicRemove'
                    list-type="picture-card"
                    multiple>
                    <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
              </el-upload>
              </el-form-item>
              <el-form-item label="商品详情" prop="detailitem">
                <!-- <button @click="getUEContent()">获取内容</button> -->
                <!-- <div class="editorContainer">
                  <UE :defaultMsg=defaultMsg :config=config ref="ue"></UE>
                </div> -->
                <div class="editorbox">
                  <v-editor ref="detailsEditor" v-model='editorContent' :curType='myType'></v-editor>
                </div>
              </el-form-item>
              <el-form-item label="备注" prop="remarckitem">
                <el-input v-model='gooddetailremark'></el-input>
              </el-form-item>
              <el-form-item label="商品简介" prop="introitem">
                <el-input v-model='goodIntro'></el-input>
              </el-form-item>
            </el-form>
          </div>
        </el-tab-pane>
        <el-tab-pane label="分享设置" name="sharesetting">
          <div class="sharesetting">
            <el-form label-width="100px">
              <el-form-item label="分享封面">
                <el-radio-group v-model="sharecover" @change='chooseSharePoster'>
                  <el-radio class="radio" label="mainpicture">使用商品主图</el-radio>
                  <el-radio class="radio" label="selfpicture">自定义封面</el-radio>
                </el-radio-group>
                <div class="uploadIconBox" v-show='selfpictureShow'>
                  <el-upload id='selfPosterUploadDom'
                  class="upload-demo"
                  drag
                  list-type="picture"
                  name="picture"
                  :fileList='selfPosterList'
                  :on-success='selfPosterSuccess'
                  :on-remove="selfPosterRemove"
                  :data='otherParams'
                  :action="uploadUrl"
                >
                  <i class="el-icon-upload"></i>
                  <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                  <div class="el-upload__tip" slot="tip">上传 jpg/png 图片文件，且不超过100kb，规格建议100*100</div>
                </el-upload>
              </div>
            </el-form-item>
            <el-form-item label='分享标题'>
              <el-radio-group v-model="sharetitle" @change='chooseShareTitle'>
                <el-radio class="radio" label="maintitle">使用商品标题</el-radio>
                <el-radio class="radio" label="selftitle">自定义标题</el-radio>
              </el-radio-group>
              <div class="uploadIconBox" v-show='selftitleShow'>
                <el-input class="iconTitleInp" v-model='selfTitleInp'></el-input>
              </div>
            </el-form-item>
            <el-form-item label='分享描述' class='discription'>
              <div class="discription">
                <el-input class="discription-inp" v-model="sharediscription" placeholder="请填写分享描述"></el-input>
              </div>
            </el-form-item>
          </el-form>
          </div>
        </el-tab-pane>
        <el-tab-pane label="商品标签" name="goodtag">
          <el-tag
            :key="tag.tagName"
            v-for="tag in dynamicGoodsTags"
            class='newAddTag'
            :closable="true"
            :close-transition="false"
            @close="handleClose(tag)"
          >
          {{tag.tagName}}
          </el-tag>
          <el-input
            class="input-new-tag"
            v-if="inputVisible"
            v-model="inputValue"
            ref="saveTagInput"
            size="mini"
            @keyup.enter.native="handleInputConfirm"
            @blur="handleInputConfirm"
          >
          </el-input>
          <el-button v-else class="button-new-tag" size="small" @click="showInput">+新增标签</el-button></el-tab-pane>
      </el-tabs>
    </el-form>
    </div>
    <div class="bottomBox">
      <el-button type='primary' class="saveDetailBtn" @click='saveDetail()' v-show='saveBtnStatus'>{{saveBtnContent}}</el-button>
    </div>
  </div>
</template>

<script>
import vEditor from '../../../editor'
import UE from '../../../ueditor'
import qs from 'querystring'
export default {
  components: {
    vEditor,
    UE
  },
  data () {
    return {
      // 分享主图或者自定义状态
      sharecoverStatus: true,
      shareTitleStatus: true,
      // 编辑主图传给后台数组
      editMainImgArr: [],
      saveBtnStatus: false,
      saveBtnContent: '',
      defaultMsg: '',
      config: {
        initialFrameWidth: null,
        initialFrameHeight: 350
      },
      goodID: '',
      // 大id
      bigID: '',
      attrTitle: '添加商品属性',
      curEditAttrId: '',
      dynamicGoodsTags: [],
      uploadUrl: '',
      // 商品详情备注
      gooddetailremark: '',
      // 商品简介
      goodIntro: '',
      editorContent: null,
      myType: 'good',
      editForm: {
        code: '1232'
      },
      editrules: {},
      activeName: 'goodattr',
      addAttrDialog: false,
      editAttrStatus: false,
      // 商品属性表格
      attrdata: [],
      // 商品属性表单
      attrform: {
        nameitem: '',
        contentitem: ''
      },
      attrrules: {
        nameitem: [{
          required: true,
          message: '请输入属性名称',
          trigger: 'blur'
        }],
        contentitem: [{
          required: true,
          message: '请输入属性内容',
          trigger: 'blur'
        }]
      },
      // 商品主图数组
      mainPicList: [],
      // 商品详情表单
      detailForm: {
        pictureitem: '',
        detailitem: ''
      },
      detailrules: {
        pictureitem: [{
          required: true,
          message: '请上传图片',
          trigger: 'blur'
        }],
        detailitem: [{
          required: true,
          message: '请输入商品详情',
          trigger: 'blur'
        }]
      },
      // 上传图片参数
      goodParams: {
        goodsId: ''
      },
      otherParams: {
        goodsId: ''
      },
      // 分享设置
      // 分享封面自定义封面
      shareID: '',
      selfShareImg: '',
      selfPosterList: [],
      selfpictureShow: false,
      selftitleShow: false,
      selfTitleInp: '',
      // 分享设置中自定义封面是否出现
      sharecover: 'mainpicture',
      sharetitle: 'maintitle',
      sharediscription: '',
      // 标签
      inputVisible: false,
      inputValue: '',
      smallImgList: []
    }
  },
  methods: {
    // getUEContent () {
    //   let content = this.$refs.ue.getUEContent()
    //   console.log('新编辑器', content)
    // },
    // 返回商品库
    backStore () {
      this.$router.push({
        path: 'store'
      })
    },
    // 获取属性列表
    getAttrList () {
      var getAttrListUrl = this.HOST + '/goods/properts'
      this.$http.post(getAttrListUrl, qs.stringify({
        goodsBaseId: this.bigID
      })).then(res => {
        if (res.data.code === '0000') {
          this.attrdata = res.data.list
        } else {
          this.$message({
            message: '属性列表获取失败',
            type: 'warning'
          })
        }
      })
    },
    editTabChange (tab, event) {
      console.log(tab.label, event)
      if (tab.label === '商品详情') {
        this.saveBtnStatus = true
        this.saveBtnContent = '保存商品详情'
      } else if (tab.label === '分享设置') {
        this.saveBtnStatus = true
        this.saveBtnContent = '保存分享设置'
      } else {
        this.saveBtnStatus = false
      }
    },
    addStandard () {
      this.addAttrDialog = true
      this.editAttrStatus = false
      this.attrTitle = '新增商品属性'
      this.attrform.nameitem = ''
      this.attrform.contentitem = ''
    },
    toAddAttr () {
      if (this.editAttrStatus) {
        var editAttrUrl = this.HOST + '/goods/updateProperty'
        this.$http.post(editAttrUrl, qs.stringify({
          id: this.curEditAttrId,
          name: this.attrform.nameitem,
          value: this.attrform.contentitem
        })).then(res => {
          if (res.data.code === '0000') {
            this.$message({
              message: '编辑属性成功',
              type: 'success'
            })
            this.getAttrList()
          } else {
            this.$message({
              message: '编辑属性失败, 请稍后再试',
              type: 'warning'
            })
          }
        })
        console.log('编辑')
      } else {
        // 这里还没测
        var addAttrUrl = this.HOST + '/goods/addProperty'
        this.$http.post(addAttrUrl, qs.stringify({
          id: this.bigID,
          name: this.attrform.nameitem,
          value: this.attrform.contentitem
        })).then(res => {
          if (res.data.code === '0000') {
            this.$message({
              message: '添加属性成功',
              type: 'success'
            })
            this.getAttrList()
          } else {
            this.$message({
              message: '添加属性失败, 请稍后再试',
              type: 'warning'
            })
          }
        })
        console.log('新增')
      }
      this.addAttrDialog = false
    },
    editAttrItem (index, row) {
      console.log(row, '编辑')
      this.curEditAttrId = row.id
      this.attrform.nameitem = row.name
      this.attrform.contentitem = row.value
      this.editAttrIndex = index
      this.editAttrStatus = true
      this.attrTitle = '编辑商品属性'
      this.addAttrDialog = true
    },
    deleteAttrItem (index, row) {
      // 删除商品属性
      this.curEditAttrId = row.id
      this.$confirm('确定删除该属性吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var deleteAttrUrl = this.HOST + '/goods/deleteProperty'
        this.$http.post(deleteAttrUrl, qs.stringify({
          id: row.id
        })).then(res => {
          if (res.data.code === '0000') {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getAttrList()
          } else {
            this.$message({
              type: 'warning',
              message: '删除失败!'
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
      console.log('删除时属性id', this.curEditAttrId)
    },
    // 分享设置部分
    chooseSharePoster (value) {
      if (value === 'selfpicture') {
        this.selfpictureShow = true
      } else {
        this.selfpictureShow = false
      }
    },
    chooseShareTitle (value) {
      if (value === 'selftitle') {
        this.selftitleShow = true
      } else {
        this.selftitleShow = false
      }
    },
    // 分享设置自定义封面上传成功
    selfPosterSuccess (response, file, fileList) {
      this.selfShareImg = response.data[0]
      console.log(response, file, fileList, '分享')
    },
    selfPosterRemove (file) {
    },
    showInput () {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleInputConfirm () {
      let inputValue = this.inputValue
      var addtagUrl = this.HOST + '/goods/addTage'
      if (inputValue) {
        this.$http.post(addtagUrl, qs.stringify({
          goodsId: this.bigID,
          name: inputValue
        })).then(res => {
          if (res.data.code === '0000') {
            this.$message({
              message: '新增标签成功',
              type: 'success'
            })
            this.dynamicGoodsTags.push({
              tagName: inputValue,
              id: res.data.value
            })
            this.inputVisible = false
            this.inputValue = ''
            // this.dynamicGoodsTags.push(inputValue)
          } else {
            this.$message({
              message: '新增标签失败',
              type: 'warning'
            })
          }
        })
      }
      this.inputVisible = false
      this.inputValue = ''
    },
    // 主图上传成功
    mainImgSuccess (response, file, fileList) {
      document.getElementById('mainPicDom').style.height = '314px'
      this.smallImgList = []
      for (var j = 0; j < fileList.length; j++) {
        this.smallImgList.push('')
      }
      for (var i = 0; i < fileList.length; i++) {
        if (fileList[i].response !== undefined) {
          this.smallImgList[i] = fileList[i].response.data[0]
        } else {
          this.smallImgList[i] = fileList[i].url
        }
      }
      console.log('路径数组', this.smallImgList)
    },
    uploadMainPic (file, fileList) {
    },
    // 移除商品主图
    mainPicRemove (file, fileList) {
      if (fileList.length === 0) {
        document.getElementById('mainPicDom').style.height = '215px'
      }
      this.smallImgList = []
      for (var j = 0; j < fileList.length; j++) {
        this.smallImgList.push('')
      }
      for (var i = 0; i < fileList.length; i++) {
        this.smallImgList[i] = fileList[i].url
      }
    },
    handleClose (tag) {
      console.log('当前tagID', tag.id)
      var deleteTagUrl = this.HOST + '/goods/tagDelete'
      this.$http.post(deleteTagUrl, qs.stringify({
        id: tag.id
      })).then(res => {
        if (res.data.code === '0000') {
          // 前台进行标签移除 标签列表不再请求接口
          this.$message({
            message: '删除标签成功',
            type: 'success'
          })
          this.dynamicGoodsTags.splice(this.dynamicGoodsTags.indexOf(tag), 1)
        } else {
          this.$message({
            message: '删除标签失败，请稍后再试',
            type: 'warning'
          })
        }
      })
    },
    // 保存详情和分享
    saveDetail () {
      // 保存详情
      if (this.saveBtnContent === '保存商品详情') {
        for (var i = 0; i < this.mainPicList.length; i++) {
          this.editMainImgArr[i] = this.mainPicList[i].url
        }
        var goodDetailEditUrl = this.HOST + '/goods/updateDetails'
        this.$http.post(goodDetailEditUrl, qs.stringify({
          goodsBaseId: this.bigID,
          pictures: this.smallImgList,
          details: this.editorContent,
          remark: this.gooddetailremark,
          intro: this.goodIntro
        })).then(res => {
          if (res.data.code === '0000') {
            this.$message({
              message: '商品详情编辑成功',
              type: 'success'
            })
          } else {
            this.$message({
              message: '商品详情编辑失败,请稍后再试',
              type: 'warning'
            })
          }
        })
      }
      // 保存分享
      if (this.saveBtnContent === '保存分享设置') {
        if (this.sharecover === 'selfpicture') {
          this.sharecoverStatus = true
        } else {
          this.sharecoverStatus = false
        }
        if (this.sharetitle === 'selftitle') {
          this.shareTitleStatus = true
        } else {
          this.shareTitleStatus = false
        }
        var shareEditUrl = this.HOST + '/goods/updateShare'
        console.log(this.selfPosterList[0])
        this.$http.post(shareEditUrl, qs.stringify({
          goodsBaseId: this.bigID,
          imgType: this.sharecoverStatus,
          titleType: this.shareTitleStatus,
          describe: this.sharediscription,
          img: this.selfShareImg,
          title: this.selfTitleInp
        })).then(res => {
          if (res.data.code === '0000') {
            this.$message({
              message: '分享设置编辑成功',
              type: 'success'
            })
          } else {
            this.$message({
              message: '分享设置编辑失败,请稍后再试',
              type: 'warning'
            })
          }
        })
      }
    }
  },
  mounted () {
    this.uploadUrl = this.HOST + '/picture/update'
    // 预留获取图片id接口
    this.goodID = window.sessionStorage.getItem('editGoodId')
    console.log('当前编辑商品Id', this.goodID)
    var getGoodInfoUrl = this.HOST + '/goods/goodsUpdateInfo'
    this.$http.post(getGoodInfoUrl, qs.stringify({
      goodsId: this.goodID
    })).then(res => {
      if (res.data.code === '0000') {
        this.attrdata = res.data.properties
        // 上传图片时的大id
        this.bigID = res.data.baseInfo.id
        this.otherParams.goodsId = res.data.baseInfo.id
        // 主图渲染
        this.mainPicList = []
        for (var i = 0; i < res.data.pictures.length; i++) {
          document.getElementById('mainPicDom').style.height = '314px'
          this.mainPicList.push({
            url: res.data.pictures[i].pictureUrl
          })
          this.smallImgList.push(res.data.pictures[i].pictureUrl)
        }
        // 富文本
        // this.defaultMsg = res.data.baseInfo.details
        this.$refs.detailsEditor.setHtml(res.data.baseInfo.details)
        this.editorContent = res.data.baseInfo.details
        this.gooddetailremark = res.data.baseInfo.remark
        this.goodIntro = res.data.baseInfo.intro
        // 分享设置
        // 分享封面
        if (res.data.share.imgType === 1) {
          this.sharecover = 'selfpicture'
          this.selfPosterList.push({
            url: res.data.share.img,
            name: res.data.share.img.split('/')[res.data.share.img.split('/').length - 1]
          })
        } else {
          this.sharecover = 'mainpicture'
        }
        this.selfShareImg = res.data.share.img
        // 分享标题
        this.shareID = res.data.share.id
        if (res.data.share.titleType === 1) {
          this.sharetitle = 'selftitle'
          this.selftitleShow = true
          this.selfTitleInp = res.data.share.title
        } else {
          this.sharetitle = 'maintitle'
          this.selftitleShow = false
        }
        this.sharediscription = res.data.share.describe
        // tag部分
        for (var j = 0; j < res.data.tags.length; j++) {
          this.dynamicGoodsTags[j] = res.data.tags[j]
        }
        console.log('商品详情返回', res.data)
      } else {
        this.$message({
          message: '获取商品数据失败，请稍后再试',
          type: 'warning'
        })
      }
    })
  }
}
</script>

<style lang="scss" scoped>
@import "../../../../assets/css/common.scss";
.editGood {
   background: #fff;
  height: 100%;
  padding: 0 25px;
  .editContent{
    margin-top: 15px;
    .codeinput{
      width: 30%;
    }
    .editTags{
      width: 100%;
      padding-left: 21px;
      .tagAttr{
        width: 50%;
        .inner-head{
          margin: 10px 0;
          height: 30px;
          .inner-btn{
            margin-top:-10px;
            float: right;
          }
        }
        // 编辑&删除
        .edit{
          font-size: 13px;
          color:#20a0ff;
          float: left;
          margin-right: 10px;
          cursor: pointer;
        }
        .delete{
          float: left;
          cursor: pointer;
          font-size: 13px;
          color:#ff4949;
        }
        .addAttrdialog{
          .el-input{
            width: 83%;
          }
        }
      }
      // 商品详情
      .detailBox{
        position: relative;
        .el-upload__text{
          position: absolute;
          left: 92px;
          top: 36px;
        }
      }

      .editorbox{
        height: 170px;
        width: 60%;
      }
      .newAddTag{
        margin-right: 8px;
      }
      .uploadIconBox{
        .el-upload__tip{
          margin-top: 0px;
        }
        .el-upload-list{
          overflow-x: hidden !important;
        }
      }
    }
  }
  .bottomBox{
    width: 75%;
    position: absolute;
    bottom: 20px;
    .saveDetailBtn{
      float: right;
      margin-left: 53px;
    }
  }
}
// 富文本
.editorContainer{
  height: 200px;
}

</style>
<style media="screen" lang="scss">
.w-e-text-container{
  height: 85% !important;
  background: #fff;
}
.el-input{
  width: 60%;
}
// 商品主图
.mainPicBox{
   height: 215px;
  .mainPicUpload{
    position: relative;
    .el-upload-list, .el-upload-list--picture-card{
      position: absolute;
      top:218px;
      width: 100%;
      height: 100px;
      overflow-x: auto;
    }
  }
}
.el-upload-list--picture-card .el-upload-list__item{
  width: 98px !important;
  height: 98px !important;
}
.el-upload-list{

  // overflow-x: auto;
}
.el-upload-dragger{
  background: #f9fafc !important;
}
.el-table__body-wrapper{
  border-bottom: 1px solid #eef1f6;
  overflow-x: hidden;
}
.el-upload__tip{
  margin-top: 30px;
}
.el-upload--picture-card{
  border: none;
}
</style>
