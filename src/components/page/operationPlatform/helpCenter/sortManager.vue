<template lang="html">
  <div class="sortmanager">
    <div class="topbar">
      <span class="shortline"></span>
      <span class="title">分类管理</span>
      <el-button @click='addContent()'>添加内容</el-button>
      <el-button type="primary" class="addsort" @click='addSort()'>添加分类</el-button>
      <!-- 添加首级分类弹框 -->
      <el-dialog
        :title="parentTitle"
        :visible.sync="addSortDialogVisible"
        size="tiny"
      >
        <el-form ref="addsortform" :model="addsortform" label-width="80px" class="addSortForm">
          <el-form-item label="分类名称">
            <el-input v-model="addsortform.name" placeholder='请设置分类名称'></el-input>
          </el-form-item>
          <el-form-item label="分类排序">
            <el-input v-model="addsortform.sort" placeholder='请设置分类排序'></el-input>
          </el-form-item>
          <el-form-item label="所属端口">
            <el-checkbox-group v-model="addsortform.port">
              <el-checkbox label="墨呦艺术" name="type"></el-checkbox>
              <el-checkbox label="墨呦直播" name="type"></el-checkbox>
              <el-checkbox label="轻量互动" name="type"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="上传图片">
            <el-upload
              class="upload-demo"
              drag
              :data='otherParams'
              :action="uploadImgUrl"
              name="picture"
              :on-success='addsortImgSuccess'
              multiple>
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            </el-upload>
          </el-form-item>
          <el-form-item label="分类状态">
            <el-switch
              v-model="addsortform.status"
              on-text=""
              off-text="">
            </el-switch>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addSortDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="confirmAddSort">保 存</el-button>
        </span>
      </el-dialog>
      <!-- 添加副级分类 -->
      <el-dialog
        :title="sonTitle"
        :visible.sync="addSonSortDialogVisible"
        size="tiny"
        >
        <el-form ref="addsubsortform" :model="addsubsortform" label-width="80px" class="addSortForm">
          <el-form-item label="分类名称">
            <el-input v-model="addsubsortform.name" placeholder='请设置分类名称'></el-input>
          </el-form-item>
          <el-form-item label="分类排序">
            <el-input v-model="addsubsortform.sort" placeholder='请设置分类排序'></el-input>
          </el-form-item>
          <el-form-item label="分类状态">
            <el-switch
              v-model="addsubsortform.status"
              on-text=""
              off-text="">
            </el-switch>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addSonSortDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="confirmSubAddSort">保 存</el-button>
        </span>
      </el-dialog>
      <!-- 添加子类 -->
      <el-dialog
        :title="grandsonTitle"
        :visible.sync="addGrandsonSortDialogVisible"
        size="tiny"
        >
        <el-form ref="add_grandson_sortform" :model="add_grandson_sortform" label-width="80px" class="addSortForm">
          <el-form-item label="分类名称">
            <el-input v-model="add_grandson_sortform.name" placeholder='请设置分类名称'></el-input>
          </el-form-item>
          <el-form-item label="分类排序">
            <el-input v-model="add_grandson_sortform.sort" placeholder='请设置分类排序'></el-input>
          </el-form-item>
          <el-form-item label="上传图片">
            <el-upload
              class="upload-demo"
              drag
              :data='otherParams'
              :action="uploadImgUrl"
              name="picture"
              :on-success='addGrandsonImgSuccess'
              multiple>
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            </el-upload>
          </el-form-item>
          <el-form-item label="分类状态">
            <el-switch
              v-model="add_grandson_sortform.status"
              on-text=""
              off-text="">
            </el-switch>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addGrandsonSortDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="confirmGrandsonAddSort">保 存</el-button>
        </span>
      </el-dialog>
    </div>
    <div class="sortmain">
      <div class="keywordbox">
          <el-input v-model="keyinput" placeholder="请输入分类关键字"></el-input>
      </div>
      <!-- 树形下拉列表 -->
      <el-tree
        :data="qsSortdata"
        :props="defaultProps"
        node-key="id"
        ref="tree"
        :default-expand-all = 'false'
        :render-content="renderContent"
          :filter-node-method="filterNode"
          :expand-on-click-node='false'
        class="qsTree"
      >
      </el-tree>
    </div>
  </div>
</template>

<script>
export default {
  watch: {
    keyinput (val) {
      this.$refs.tree.filter(val)
    }
  },
  data () {
    return {
      uploadImgUrl: '',
      otherParams: {
        typeName: 'questionsort'
      },
      // 添加首类
      addSortDialogVisible: false,
      parentTitle: '',
      // 添加副类
      addSonSortDialogVisible: false,
      sonTitle: '',
      // 添加子类
      addGrandsonSortDialogVisible: false,
      grandsonTitle: '',
      // 添加分类弹框
      addsortform: {
        name: '',
        sort: '',
        sortImg: '',
        port: [],
        status: true
      },
      // 第二级
      addsubsortform: {
        name: '',
        sort: '',
        status: true
      },
      // 第三级
      add_grandson_sortform: {
        name: '',
        sort: '',
        sortImg: '',
        status: true
      },
      keyinput: '',
      qsSortdata: [],
      defaultProps: {
        children: 'categoryList',
        label: 'name'
      }
    }
  },
  methods: {
    // 搜索关键字
    filterNode (value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    // 添加内容
    addContent () {
      window.sessionStorage.setItem('curNodeId', '')
      this.$router.push({
        path: './addquestioncontent'
      })
    },
    // 首级添加分类弹框
    addSort () {
      this.addSortDialogVisible = true
      this.parentTitle = '添加分类'
    },
    // 副级添加弹框
    addSubSort (store, data) {
      console.log(data.id, '根据状态判断')
      if (data.level === 'parent') {
        this.addSonSortDialogVisible = true
        this.sonTitle = '添加副类'
      }
      if (data.level === 'son') {
        this.addGrandsonSortDialogVisible = true
        this.grandsonTitle = '添加子类'
      }
      if (data.level === 'grandson') {
        console.log('添加内容', data)
        window.sessionStorage.setItem('curNodeId', JSON.stringify(data.threeLevelArr))
        this.$router.push({
          path: './addquestioncontent'
        })
      }
    },
    edit (data) {
      console.log(data, '编辑')
      if (data.level === 'parent') {
        this.addSortDialogVisible = true
        this.parentTitle = '编辑分类'
      }
      if (data.level === 'son') {
        this.addSonSortDialogVisible = true
        this.sonTitle = '编辑副类'
        // this.addGrandsonSortDialogVisible = true
      }
      if (data.level === 'grandson') {
        this.addGrandsonSortDialogVisible = true
        this.grandsonTitle = '编辑子类'
      }
    },
    remove (store, data) {
      console.log(data, '删除')
    },
    // 添加分类上传图片成功回调
    addsortImgSuccess (response, file, fileList) {
      if (response.code === '0000') {
        this.addsortform.sortImg = response.data[0]
      }
    },
    // 第三级添加图片
    addGrandsonImgSuccess (response, file, fileList) {
      if (response.code === '0000') {
        this.add_grandson_sortform.sortImg = response.data[0]
      }
    },
    // 确认添加首级分类
    confirmAddSort () {
      this.addSortDialogVisible = false
      // 预留接口
      console.log('分类名称', this.addsortform.name)
      console.log('分类排序', this.addsortform.sort)
      console.log('图片', this.addsortform.sortImg)
      console.log('分类名称', this.addsortform.port)
      console.log('分类状态', this.addsortform.status)
    },
    // 确认添加副级
    confirmSubAddSort () {
      this.addSonSortDialogVisible = false
      // 预留接口
      console.log('分类名称', this.addsubsortform.name)
      console.log('分类排序', this.addsubsortform.sort)
      console.log('分类状态', this.addsubsortform.status)
    },
    // 确认添加第三级
    confirmGrandsonAddSort () {
      this.addGrandsonSortDialogVisible = false
      // 预留接口
      console.log('分类名称', this.add_grandson_sortform.name)
      console.log('分类排序', this.add_grandson_sortform.sort)
      console.log('图片', this.add_grandson_sortform.sortImg)
      console.log('分类状态', this.add_grandson_sortform.status)
    },
    // 点击气泡
    toObjContent (store, data) {
      console.log(store, data, '气泡')
      window.sessionStorage.setItem('objTitle', data.name)
      this.$router.push({
        path: './objcontent'
      })
    },
    renderContent (h, {node, data, store}) {
      return (
        <span>
          <span>
            <span>{node.label} </span>
            <span class={{ 'bubbleClass': data.bubbleShow }} style = "" on-click = {() => this.toObjContent(store, data)}>{data.num}</span>
          </span>
          <span style = "float: right; margin-right: 20px" >
            <el-button size = "mini" on-click = {() => this.addSubSort(store, data)} > {data.btnContent} < /el-button>
            <el-button size = "mini" on-click = {() => this.edit(data)} >编辑</el-button>
            <el-button size = "mini" on-click = { () => this.remove(store, data)} > 删除 < /el-button>
          </span>
        </span>)
    },
    // 获取分类列表
    getSortList () {
      var sortListUrl = this.HOST + '/productCategory/selectAll'
      this.$http(sortListUrl).then(res => {
        this.qsSortdata = res.data.list
        for (var i = 0; i < this.qsSortdata.length; i++) {
          this.qsSortdata[i].level = 'parent'
          this.qsSortdata[i].btnContent = '添加副级'
          this.qsSortdata[i].bubbleShow = false
          if (this.qsSortdata[i].categoryList) {
            for (var j = 0; j < this.qsSortdata[i].categoryList.length; j++) {
              this.qsSortdata[i].categoryList[j].level = 'son'
              this.qsSortdata[i].categoryList[j].btnContent = '添加子集'
              this.qsSortdata[i].categoryList[j].bubbleShow = false
              if (this.qsSortdata[i].categoryList[j].categoryList) {
                for (var k = 0; k < this.qsSortdata[i].categoryList[j].categoryList.length; k++) {
                  this.qsSortdata[i].categoryList[j].categoryList[k].level = 'grandson'
                  this.qsSortdata[i].categoryList[j].categoryList[k].btnContent = '添加内容'
                  // 控制是偶有样式
                  this.qsSortdata[i].categoryList[j].categoryList[k].bubbleShow = true
                  // 先模拟数字
                  this.qsSortdata[i].categoryList[j].categoryList[k].num = '12'
                  // 设置传到问题内容的id
                  this.qsSortdata[i].categoryList[j].categoryList[k].threeLevelArr = [this.qsSortdata[i].id, this.qsSortdata[i].categoryList[j].id, this.qsSortdata[i].categoryList[j].categoryList[k].id]
                }
              }
            }
          }
        }
        console.log('后来的数据', this.qsSortdata)
      })
    }
  },
  mounted () {
    this.getSortList()
    this.uploadImgUrl = this.HOST + '/picture/updateDefault'
  }
}
</script>

<style lang="scss" scoped>
@import "../../../../assets/css/common.scss";
.sortmanager{
  padding: 0 25px;
  height: 100%;
  .topbar{
    .el-dialog__body{
      border-bottom: 1px solid red;
    }
  }
  .addSortForm{

  }
  // 搜索和tree部分
  .sortmain{
    .keywordbox{
      margin: 14px 0 15px;
    }
    .qsTree{
      max-height: 550px;
      overflow-y: scroll;
      .bluebubble{

      }
    }
  }
}
</style>
<style media="screen">
.bubbleClass{
  background:#20a0ff;
  color:#fff;
  border-radius: 10px;
  display:inline-block;
  height:18px;
  line-height:18px;
  font-size:12px;
  padding: 0 6px;
}
.addSortForm .el-upload{
    width: 100%;
}
.addSortForm .el-upload .el-upload-dragger{
  width: 100%;
}
.topbar .el-dialog__body{
    border-bottom: 1px solid #e0e6ed;
    padding-bottom: 0;
}
</style>
