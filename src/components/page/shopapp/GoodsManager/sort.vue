<template lang="html">
  <div class="sort">
    <div class="topbar">
      <span class="shortline"></span>
      <span class="title">商品类别</span>
      <el-button>新增商品</el-button>
      <el-button type="primary" @click="append(sortdatas)" class="addsort">添加类别</el-button>
      <el-button type="primary" @click='treeControl' class="addsort">{{btnContent}}</el-button>
      <!-- 添加类别弹框start -->
      <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" size="tiny">
        <span>{{dialogTip}}</span>
        <div class="keywordbox">
            <el-input v-focus autofocus='autofocus' v-model="sortinput" :placeholder="dialogPlaceHolder" @keyup.enter.native="uploadConfirm"></el-input>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="uploadCancel">取 消</el-button>
          <el-button type="primary" class='' @click="uploadConfirm">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 弹框end -->
      <el-dialog title="设置图标" :visible.sync="dialogIcon" size="tiny" class='settingIconBox'>
        <el-tabs v-model="sortTab" type="card" @tab-click="getTabName">
            <el-tab-pane  v-for='item in uploadIconsTabs' :label="item.label" :name="item.name">
              <p>图标默认效果</p>
              <el-upload
                list-type="picture"
                class="upload-demo iconDefaultDom"
                drag
                :data='otherParams'
                :file-list="iconDefaultList"
                :on-success='getDefaultIcon'
                :on-remove='removeDefaultIcon'
                name="picture"
                :action="uploadImgUrl"
                multiple>
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                <div class="el-upload__tip" slot="tip">只能png 文件，且不超过 200kb，建议规格100x100</div>
              </el-upload>
              <p>图标选中效果</p>
              <el-upload
                list-type="picture"
                class="upload-demo iconCheckDom"
                drag
                :data='otherParams'
                :file-list="iconCheckList"
                name="picture"
                :on-success='getCheckIcon'
                :on-remove='removeCheckIcon'
                :action="uploadImgUrl"
                multiple>
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                <div class="el-upload__tip" slot="tip">只能png 文件，且不超过 200kb，建议规格100x100</div>
              </el-upload>
            </el-tab-pane>
          </el-tabs>
        <span slot="footer" class="dialog-footer">
          <el-button @click="uploadCancel">取 消</el-button>
          <el-button type="primary" class='' @click="uploadConfirmIcon">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 弹框end -->
    </div>
    <div class="keywordbox">
        <el-input v-model="keyinput" placeholder="请输入分类关键字"></el-input>
    </div>
    <!-- 树形下拉列表 -->
    <div class="listbox">
    <el-tree id='sortTree'
      :data="sortdatas"
      :props="defaultProps"
      node-key="id"
      ref="tree"
      :default-expand-all = 'false'
      :render-content="renderContent"
      :filter-node-method="filterNode"
      @node-click="handleNodeClick">
    </el-tree>
    </div>
  </div>
</template>

<script>
import qs from 'querystring'

export default {
  watch: {
    keyinput (val) {
      this.$refs.tree.filter(val)
    }
  },
  data () {
    return {
      uploadImgUrl: '',
      // 添加类别弹框状态 先写成两个
      dialogVisible: false,
      dialogVisibleSub: false,
      dialogIcon: false,
      dialogTitle: '',
      dialogTip: '',
      dialogPlaceHolder: '',
      // 关键字搜索框input
      keyinput: '',
      sortinput: '',
      parentId: '',
      parentData: '',
      myStore: '',
      // 分裂列表数据
      sortdatas: [],
      defaultProps: {
        children: 'categoryList',
        label: 'name'
      },
      sortTab: 'children',
      // 上传图标选项卡循环
      uploadIconsTabs: [{
        label: '儿童',
        name: 'children'
      }, {
        label: '艺考生',
        name: 'artExaminee'
      }, {
        label: '艺术家',
        name: 'artist'
      }],
      iconDefaultList: [],
      iconCheckList: [],
      // 添加分类接口
      addsortUrl: '',
      // 添加类别状态，0位添加类别，1为添加子类
      dialogStatus: 0,
      // 上传图片接口为分类
      otherParams: {
        type: 1
      },
      // 上传图标传参默认是儿童
      currentProfessionID: '905496956341186560',
      iconDefaultUrl: '',
      iconCheckUrl: '',
      iconTabIndex: 0,
      btnContent: '全部展开',
      treeStatus: false
    }
  },
  methods: {
    // 列表展开收起控制
    treeControl () {
      if (this.btnContent === '全部展开') {
        this.btnContent = '全部收起'
        this.treeStatus = true
        for (var i = 0; i < document.getElementById('sortTree').getElementsByClassName('el-tree-node__children').length; i++) {
          document.getElementById('sortTree').getElementsByClassName('el-tree-node__children')[i].style = 'display:block'
        }
      } else if (this.btnContent === '全部收起') {
        this.btnContent = '全部展开'
        this.treeStatus = false
        for (var j = 0; j < document.getElementById('sortTree').getElementsByClassName('el-tree-node__children').length; j++) {
          document.getElementById('sortTree').getElementsByClassName('el-tree-node__children')[j].style = 'display:none'
        }
      }
      console.log(document.getElementById('sortTree').getElementsByClassName('el-tree-node'))
      console.log(this.btnContent)
    },
    // 搜索关键字
    filterNode (value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    // 上传图片的两个方法
    handleRemove (file, fileList) {
      console.log(file, fileList)
    },
    handlePreview (file) {
      console.log(file)
    },
    // 添加时取消和确认
    uploadCancel () {
      this.dialogIcon = false
      this.dialogVisible = false
      this.dialogVisibleSub = false
    },
    uploadConfirm () {
      console.log('确认')
      // 发送确认请求
      if (this.sortinput === '') {
        this.$message({
          message: '输入内容不能为空',
          type: 'warning'
        })
        // 增加类别
      } else {
        if (this.dialogStatus === 0) {
          this.parentId = ''
        }
        this.addsort()
        this.sortinput = ''
        this.dialogVisible = false
        this.dialogVisibleSub = false
        // 增加子类
      }
    },
    append (store, data) {
      console.log(store.append)
      // const h = this.$createElement
      if (data === undefined) {
        this.dialogStatus = 0
        this.dialogTitle = '添加类别'
        this.dialogTip = '请输入类别的名称（一级）'
        this.dialogPlaceHolder = '请输入类别名称'
        // this.dialogVisible = true
        this.sortinput = ''
      } else {
        this.dialogStatus = 1
        this.dialogTitle = '添加子类'
        this.dialogTip = '请输入子类的名称'
        this.dialogPlcaceHolder = '请输入子类的名称'
        // this.dialogVisibleSub = true
        this.parentData = data
        this.myStore = store
      }
      this.dialogVisible = true

      console.log(this.datas)
    },
    // 数组添加指定位置
    insertitem (index, item, arr) {
      arr.splice(index, 0, item)
    },
    remove (store, data) {
      var sortDeleteUrl = this.HOST + '/productCategory/delete'
      console.log(data)
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.post(sortDeleteUrl, qs.stringify({
          id: this.parentId
        })).then(res => {
          console.log('编辑返回', res)
          if (res.data.code === '0000') {
            this.getSortList()
          } else {
            alert('删除失败')
          }
        })
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    edit (e) {
      console.log('编辑')
      var sortUpdateUrl = this.HOST + '/productCategory/update'
      this.$prompt('请输入编辑的内容', '提示', {
        onfirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({value}) => {
        console.log(value)
        // 请求编辑接口
        this.$http.post(sortUpdateUrl, qs.stringify({
          id: this.parentId,
          name: value
        })).then(res => {
          console.log('编辑返回', res)
          if (res.data.code === '0000') {
            this.getSortList()
          } else {
            alert('编辑失败')
          }
        })
      })
    },
   // 设置图标
    setIcon (e) {
      this.iconList = []
      this.dialogIcon = true
      this.iconDefaultList = []
      this.iconCheckList = []
    },
    uploadConfirmIcon () {
      // 上传图标
      console.log('图标参数', this.parentId, this.currentProfessionID, this.iconDefaultUrl, this.iconCheckUrl)
      var uploadIconUrl = this.HOST + '/productCategory/icon'
      this.$http.post(uploadIconUrl, qs.stringify({
        id: this.parentId,
        profession: this.currentProfessionID,
        selected: this.iconCheckUrl,
        unselected: this.iconDefaultUrl
      })).then(res => {
        if (res.data.code === '0000') {
          this.$message({
            message: '设置图标成功',
            type: 'success'
          })
          document.getElementsByClassName('iconDefaultDom')[this.iconTabIndex].getElementsByTagName('div')[0].style.display = 'block'
          document.getElementsByClassName('iconDefaultDom')[this.iconTabIndex].getElementsByTagName('div')[3].style.display = 'block'
          document.getElementsByClassName('iconCheckDom')[this.iconTabIndex].getElementsByTagName('div')[0].style.display = 'block'
          document.getElementsByClassName('iconCheckDom')[this.iconTabIndex].getElementsByTagName('div')[3].style.display = 'block'
        } else {
          this.$message.error('上传失败，请稍后再试')
        }
      })
      // console.log(document.getElementById('iconCheckDom').getElementsByTagName('div')[0])
      console.log(document.getElementsByClassName('iconDefaultDom'))

      this.dialogIcon = false
    },
    getTabName (tab, event) {
      console.log(tab.label)
      if (tab.label === '艺术家') {
        this.currentProfessionID = '905496907288801280'
        this.iconTabIndex = 2
      } else if (tab.label === '儿童') {
        this.currentProfessionID = '905496956341186560'
        this.iconTabIndex = 0
      } else if (tab.label === '艺考生') {
        this.currentProfessionID = '905497000209412096'
        this.iconTabIndex = 1
      }
    },
    getDefaultIcon (response, file, fileList) {
      console.log(document.getElementsByClassName('iconDefaultDom')[this.iconTabIndex])
      if (response) {
        document.getElementsByClassName('iconDefaultDom')[this.iconTabIndex].getElementsByTagName('div')[0].style.display = 'none'
        document.getElementsByClassName('iconDefaultDom')[this.iconTabIndex].getElementsByTagName('div')[3].style.display = 'none'
      }
      console.log('上传图标', response, file, fileList)
      this.iconDefaultUrl = response.data[0]
    },
    getCheckIcon (response, file, fileList) {
      if (response) {
        document.getElementsByClassName('iconCheckDom')[this.iconTabIndex].getElementsByTagName('div')[0].style.display = 'none'
        document.getElementsByClassName('iconCheckDom')[this.iconTabIndex].getElementsByTagName('div')[3].style.display = 'none'
      }
      this.iconCheckUrl = response.data[0]
    },
    removeDefaultIcon (file, fileList) {
      if (file) {
        document.getElementsByClassName('iconDefaultDom')[this.iconTabIndex].getElementsByTagName('div')[0].style.display = 'block'
        document.getElementsByClassName('iconDefaultDom')[this.iconTabIndex].getElementsByTagName('div')[3].style.display = 'block'
      }
      this.iconDefaultUrl = ''
      console.log('移除', file, fileList)
    },
    removeCheckIcon (file, fileList) {
      if (file) {
        document.getElementsByClassName('iconCheckDom')[this.iconTabIndex].getElementsByTagName('div')[0].style.display = 'block'
        document.getElementsByClassName('iconCheckDom')[this.iconTabIndex].getElementsByTagName('div')[3].style.display = 'block'
      }
      this.iconCheckUrl = ''
    },
    handleNodeClick (data) {
      this.parentId = data.id
    },
    renderContent (h, {node, data, store}) {
      return (
        <span>
          <span>
            <span >{node.label}</span>
          </span>
          <span style = "float: right; margin-right: 20px" >
            <el-button size = "mini" on-click = {() => this.setIcon(data)} > 设置图标 < /el-button>
            <el-button size = "mini" on-click = {() => this.append(store, data)} > 添加子类 < /el-button>
            <el-button size = "mini" on-click = {() => this.edit(data)} >编辑</el-button>
            <el-button size = "mini" on-click = { () => this.remove(store, data)} > 删除 < /el-button>
          </span>
        </span>)
    },
    // 添加分类
    addsort () {
      var that = this
      this.$http.post(that.addsortUrl, qs.stringify({
        name: this.sortinput,
        parentId: this.parentId
      })).then(res => {
        console.log('添加分类')
        console.log(res)
        this.getSortList()
      })
    },
    // 获取分类列表
    getSortList () {
      var sortListUrl = this.HOST + '/productCategory/selectAll'
      this.$http(sortListUrl).then(res => {
        this.sortdatas = res.data.list
        console.log('分类列表', res.data.list)
      })
    }
  },
  created: function () {
  },
  mounted () {
    this.uploadImgUrl = this.HOST + '/picture/update'
    this.addsortUrl = this.HOST + '/productCategory/add'
    // 请求分类列表
    this.getSortList()
  }
}
</script>

<style lang="scss">
 @import "../../../../assets/css/common.scss";
.sort {
  height: 100%;
    padding: 0 25px;
    .keywordbox {
        height: 66px;
        padding-top: 15px;
    }
    // 设置图标弹框
    .settingIconBox{
      .el-upload{
        width: 100%;
        .el-upload-dragger{
          width: 100%;
          background:#f9fafc;
          border:1px solid #c0ccda;
        }
      }
      .el-upload__tip{
        text-align: center;
      }
    }
    .listbox{
      height: 80%;
      .el-tree{
        // max-height: 400px;
        max-height: 90%;
        overflow-y: scroll;
      }
    }
}
// 弹框相关样式
.el-message-box{
  .el-message-box__message{
    p{
      color:#475669;
    }
  }
  .el-input__inner{
      color:#99a9bf;
  }
}
// dialog样式
.el-dialog__body{
  padding:14px 20px;
  .upload-demo{
    margin-top:18px;
    margin-bottom: 10px;
  }
  .dialog-footer{
    .el-button--primary{
      margin-top: 0 !important;
    }
  }
}
</style>
