<template lang="html">
  <div class="brand_direct">
    <div class="topbar">
      <span class="shortline"></span>
      <span class="title">品牌直达</span>
    </div>
    <div class="choosebox">
      <el-select v-model="chooseProfession" placeholder="所有专业度" >
        <el-option
          v-for="professionalItem in professionalItems"
          :key="professionalItem.value"
          :label="professionalItem.label"
          :value="professionalItem.value"
          >
        </el-option>
      </el-select>
    </div>
    <!-- 表格部分 -->
    <div class="tabledatabox">
      <el-table :data="brandData" style="width: 100%" border max-height='600'>
        <el-table-column label="序号" width='80' type='index'></el-table-column>
        <el-table-column prop="professionName" label="所属专业度"  width='110'></el-table-column>
        <el-table-column prop="name" label="品牌名称" width='100'>
        </el-table-column>
        <el-table-column prop="title" label="品牌标题" width='100'>
        </el-table-column>
        <el-table-column prop="type" label="投放图片" width='179'>
          <template scope='scope'>
            <img :src="scope.row.image" alt="" class="picbox">
          </template>
        </el-table-column>
        <el-table-column prop="taget_jumptype" label="跳转类型" width='110'></el-table-column>
        <el-table-column prop="jumpparam" label="跳转链接"></el-table-column>
        <el-table-column prop="createdtime" label="投放时间" width='120'></el-table-column>
        <el-table-column prop="remark" label="备注" width='360'></el-table-column>
        <el-table-column prop="operation" label="操作" width='90'>
          <template scope="scope">
            <p class='blue' @click='editDirectBrand(scope.row, scope.$index)'>编辑</p>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 编辑品牌直达弹框 -->
    <div class="editDialogBox">
      <el-dialog title="编辑" :visible.sync="brandDialogVisible" size="tiny">
        <div class="formbox">
          <el-form ref="brandform" :model="brandform" label-width="80px">
            <el-form-item label="专业度">
            <span class="dialogProfession">{{curProfession}}</span>
            </el-form-item>
            <el-form-item label='品牌名称'>
              <el-input v-model="brandform.name"></el-input>
            </el-form-item>
            <el-form-item label='品牌标题'>
              <el-input v-model="brandform.title"></el-input>
            </el-form-item>
            <el-form-item label='投放图片'>
              <el-upload
              class="upload-demo"
              drag
              name="picture"
              :data='otherParams'
              :on-success='brandUpload'
              :on-remove='brandRemove'
              :on-change="brandChange"
              :file-list='brandFileList'
              list-type="picture-card"
              :action="uploadImgUrl"
              multiple>
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
              <div class="el-upload__tip" slot="tip">只能上传 jpg/png 文件，且不超过500kb，规格 750*260</div>
            </el-upload>
          </el-form-item>
          <el-form-item label="跳转类型">
            <el-select v-model="brandform.jumptype" @change='jumptypeChange'>
              <el-option label="链接" value="0"></el-option>
              <el-option label="专题列表" value="1"></el-option>
              <el-option label="专题详情" value='2'></el-option>
              <el-option label="艺享详情" value='3'></el-option>
              <el-option label="分类商品列表" value='4'></el-option>
              <el-option label="品牌商品列表" value='5'></el-option>
              <el-option label="关键字商品列表" value='6'></el-option>
              <el-option label="商品详情" value='7'></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label='跳转目标'>
            <!-- 跳转目标模块根据跳转类型改变 -->
            <el-input v-model="brandform.jumptarget" v-show = 'inputItem'></el-input>
            <el-select v-model="brandform.jumptarget" v-show='selectItem_special'>
              <el-option :label="item.subject.title" :value="item.subject.id" v-for='item in tagetItem_special'></el-option>
            </el-select>
            <el-select v-model="brandform.jumptarget" v-show='selectItem_specialDetail'>
              <el-option :label="item.articleTitle" :value="item.id" v-for='item in tagetItem_specialDetail'></el-option>
            </el-select>
            <el-select v-model="brandform.jumptarget" v-show='selectItem_share'>
              <el-option :label="item.title" :value="item.id" v-for='item in tagetItem_share' class='shareSelectItem'></el-option>
            </el-select>
            <el-cascader
             v-show='cascaderItem'
             placeholder="搜分类名字 或 点击选择"
             :options="sortsList"
              :props="defaultProps"
              @change='getSortSelect'
              v-model='sortSelectArr'
              filterable>
            </el-cascader>
            <el-select v-model="brandform.jumptarget" v-show='selectItem_brand'>
              <el-option :label="item.chineseName" :value="item.id" v-for='item in tagetItem_brand'></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label='备注'>
            <el-input v-model="brandform.remark" type="textarea" ></el-input>
          </el-form-item>
        </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="brandDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="confirmEditBrand()">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <!-- 弹框 -->
    <div class="paginationblock">
       <el-pagination
         @size-change="handleSizeChange"
         @current-change="handleCurrentChange"
         :current-page="currentPage"
         :page-sizes="[10, 20]"
         :page-size="curSize"
         layout="total, sizes, prev, pager, next, jumper"
         :total="400">
       </el-pagination>
     </div>
  </div>
</template>

<script>
import qs from 'querystring'
export default {
  data () {
    return {
      brandFileList: [{
        url: ''
      }],
      currentPage: 1,
      curSize: 10,
      chooseProfession: '',
      professionalItems: [{
        value: '905496907288801280',
        label: '艺术家'
      }, {
        value: '905496956341186560',
        label: '儿童'
      }, {
        value: '905497000209412096',
        label: '艺考生'
      }],
      brandData: [],
      brandDialogVisible: false,
      brandform: {
        profession: '',
        name: '',
        jumptype: '',
        jumptarget: '',
        remark: ''
      },
      curProfession: '',
      uploadImgUrl: '',
      otherParams: {
        typeName: ''
      },
      // 弹框内跳转目标显示方式
      inputItem: false,
      selectItem_special: false,
      selectItem_specialDetail: false,
      selectItem_share: false,
      cascaderItem: false,
      selectItem_brand: false,
      defaultProps: {
        children: 'categoryList',
        label: 'name',
        value: 'id'
      },
      sortsList: [],
      // 多级选择框的绑定值
      sortSelectArr: [],
      tagetItem_special: [],
      tagetItem_specialDetail: [],
      tagetItem_share: [],
      tagetItem_brand: [],
      // 品牌直达id
      brandDirectID: '',
      curProfessionID: '',
      // 给个开关 根据跳转类型的变化影响默认值
      typeOnOff: true,
      // 第一次时是个特殊情况，加个判断
      firstOnOff: 0
    }
  },
  methods: {
    getBrandDirectList () {
      var getBrandDirectUrl = this.HOST + '/brandhrough/selAll'
      this.$http(getBrandDirectUrl).then(res => {
        if (res.data.code === '0000') {
          console.log('商品直达列表返回', res.data.list)
          this.brandData = res.data.list
          // 掉接口
          // 部分数据进行转换
          for (let i = 0; i < this.brandData.length; i++) {
            // 投放时间转格式
            this.brandData[i].createdtime = this.brandData[i].createdtime.split(' ')[0].split('-').join('/')
            switch (this.brandData[i].jumptype) {
              case 0: this.brandData[i].taget_jumptype = '链接'
                break
              case 1: this.brandData[i].taget_jumptype = '专题列表'
                break
              case 2: this.brandData[i].taget_jumptype = '专题详情'
                break
              case 3: this.brandData[i].taget_jumptype = '艺享详情'
                break
              case 4: this.brandData[i].taget_jumptype = '分类商品列表'
                break
              case 5: this.brandData[i].taget_jumptype = '品牌商品列表'
                break
              case 6: this.brandData[i].taget_jumptype = '关键字商品列表'
                break
              case 7: this.brandData[i].taget_jumptype = '商品详情'
                break
            }
            switch (this.brandData[i].professionId) {
              case '905496907288801280': this.brandData[i].professionName = '艺术家'
                break
              case '905496956341186560': this.brandData[i].professionName = '儿童'
                break
              case '905497000209412096': this.brandData[i].professionName = '艺考生'
                break
            }
          }
        }
      })
      console.log(this.brandData)
    },
    editDirectBrand (row, index) {
      // this.firstOnOff = this.firstOnOff + 1
      this.brandDirectID = row.id
      this.curProfessionID = row.professionId
      // 上传图片参数动态改变
      this.otherParams.typeName = 'brandthrough/' + this.brandDirectID
      // 点开进行编辑
      console.log(row, '当前row')
      this.brandDialogVisible = true
      this.curProfession = row.professionName
      this.brandform.name = row.name
      this.brandform.title = row.title
      this.brandFileList[0].url = row.image
      this.brandform.remark = row.remark
      // 是否有图片决定上传框是否显示
      if (row.image !== '') {
        setTimeout(function () {
          document.getElementsByClassName('el-upload')[0].style = 'display:none'
          document.getElementsByClassName('el-upload__tip')[0].style = 'display:none'
        }, 100)
      } else {
        document.getElementsByClassName('el-upload')[0].style = 'display:block'
        document.getElementsByClassName('el-upload__tip')[0].style = 'display:block'
      }
      // jumptype的类型如果是num的话要转成string才能匹配显示
      this.brandform.jumptype = row.jumptype.toString()
      if (this.brandform.jumptype === '0' || this.brandform.jumptype === '6' || this.brandform.jumptype === '7') {
        // 为input时绑定值
        this.brandform.jumptarget = row.jumpparam
        this.inputItem = true
        this.cascaderItem = false
        this.selectItem_special = false
        this.selectItem_specialDetail = false
        this.selectItem_share = false
        this.selectItem_brand = false
        this.typeOnOff = false
        this.firstOnOff = 1
      }
      // 根据类型掉下拉框的接口
      if (this.brandform.jumptype === '1') {
        this.brandform.jumptarget = row.jumpparam
        this.cascaderItem = false
        this.inputItem = false
        this.selectItem_special = true
        this.selectItem_specialDetail = false
        this.selectItem_share = false
        this.selectItem_brand = false
        this.getAllSelectData(row.professionId)
        this.typeOnOff = false
        this.firstOnOff = 1
      }
      if (this.brandform.jumptype === '2') {
        this.brandform.jumptarget = row.jumpparam
        this.cascaderItem = false
        this.inputItem = false
        this.selectItem_special = false
        this.selectItem_specialDetail = true
        this.selectItem_share = false
        this.selectItem_brand = false
        this.getSpecialArticleData(row.professionId)
        this.typeOnOff = false
        this.firstOnOff = 1
      }
      if (this.brandform.jumptype === '3') {
        this.brandform.jumptarget = row.jumpparam
        this.cascaderItem = false
        this.inputItem = false
        this.selectItem_special = false
        this.selectItem_specialDetail = false
        this.selectItem_share = true
        this.selectItem_brand = false
        this.getShareData(row.professionId)
        this.typeOnOff = false
        this.firstOnOff = this.firstOnOff + 1
      }
      if (this.brandform.jumptype === '4') {
        var threeArr = [row.jumpparam.slice(0, 5), row.jumpparam.slice(0, 10), row.jumpparam]
        console.log(threeArr, '三级拼凑数组')
        this.sortSelectArr = threeArr
        this.cascaderItem = true
        this.inputItem = false
        this.selectItem_special = false
        this.selectItem_specialDetail = false
        this.selectItem_share = false
        this.selectItem_brand = false
        this.getSortData()
        this.typeOnOff = false
        this.firstOnOff = 1
      }
      if (this.brandform.jumptype === '5') {
        this.brandform.jumptarget = row.jumpparam
        this.cascaderItem = false
        this.inputItem = false
        this.selectItem_special = false
        this.selectItem_specialDetail = false
        this.selectItem_share = false
        this.selectItem_brand = true
        this.getBrandData()
        this.typeOnOff = false
        this.firstOnOff = 1
      }
    },
    // 根据专业度获取弹框内下拉框的数据
    // 专题
    getAllSelectData (currentProfessionID) {
      this.tagetItem_special = []
      var subjectListUrl = this.HOST + '/subject/list'
      this.$http(subjectListUrl, {
        params: {
          curentPage: 1,
          pageSzie: 99999,
          professionId: currentProfessionID
        }
      }).then(res => {
        if (res.data.code === '0000') {
          this.tagetItem_special = res.data.data
          console.log('专题的回调', res.data.data)
        }
      })
    },
    // 专题文章
    getSpecialArticleData (currentProfessionID) {
      this.tagetItem = []
      var subjectArticleList = this.HOST + '/subject/article/list'
      this.$http(subjectArticleList, {
        params: {
          curentPage: 1,
          pageSize: 99999,
          professionId: currentProfessionID,
          subjectTitle: '',
          articleTitle: ''
        }
      }).then(res => {
        if (res.data.code === '0000') {
          this.tagetItem_specialDetail = res.data.data
          console.log(this.tagetItem_specialDetail, '专题文章回调')
        }
      })
    },
    // 艺享文章
    getShareData (currentProfessionID) {
      this.tagetItem = []
      var shareListUrl = this.HOST + '/share/professionList'
      this.$http.post(shareListUrl, qs.stringify({
        page: 1,
        count: 99999,
        profession: currentProfessionID
      })).then(res => {
        if (res.data.code === '0000') {
          this.tagetItem_share = res.data.list
          setTimeout(function () {
            for (var i = 0; i < res.data.list.length; i++) {
              document.getElementsByClassName('shareSelectItem')[i].setAttribute('title', res.data.list[i].title)
            }
          }, 1000)
          console.log('艺享的回调', this.tagetItem_share)
        }
      })
    },
    // 分类
    getSortData () {
      this.tagetItem = []
      var sortListUrl = this.HOST + '/productCategory/selectAll'
      this.$http(sortListUrl).then(res => {
        if (res.data.code === '0000') {
          console.log(res.data.list, '分类的回调')
          this.sortsList = res.data.list
        }
      })
    },
    getBrandData () {
      var brandListUrl = this.HOST + '/brand/inquire'
      this.$http(brandListUrl, {
        params: {
          page: 1,
          count: 99999
        }
      }).then(res => {
        if (res.data.code === '0000') {
          this.tagetItem_brand = res.data.list
          console.log('品牌成功返回', res.data.list)
        }
      })
    },
    // 获取商品所属分类所选项
    getSortSelect (val) {
      this.brandform.jumptarget = val[2]
      console.log(val, '分类所选值')
    },
    confirmEditBrand () {
      console.log('查看入参')
      console.log('品牌直达id', this.brandDirectID)
      console.log('品牌直达名称', this.brandform.name)
      console.log('品牌直达标题', this.brandform.title)
      console.log('图片链接', this.brandFileList[0].url)
      console.log('跳转类型', this.brandform.jumptype)
      console.log('跳转参数', this.brandform.jumptarget)
      console.log('备注', this.brandform.remark)
      // this.brandDialogVisible = false
      var updateBrandDirectUrl = this.HOST + '/brandhrough/update'
      this.$http.post(updateBrandDirectUrl, qs.stringify({
        id: this.brandDirectID,
        title: this.brandform.title,
        name: this.brandform.name,
        image: this.brandFileList[0].url,
        jumptype: this.brandform.jumptype,
        jumpparam: this.brandform.jumptarget,
        remark: this.brandform.remark
      })).then(res => {
        if (res.data.code === '0000') {
          this.$message({
            message: '品牌直达编辑成功',
            type: 'success'
          })
          this.getBrandDirectList()
        } else {
          this.$message({
            message: '品牌直达编辑失败，错误码是' + res.data.code,
            type: 'warning'
          })
        }
      })
      this.brandDialogVisible = false
    },
    // 分页
    handleSizeChange (val) {
      this.curSize = val
      console.log(val, '页数大小')
    },
    handleCurrentChange (val) {
      this.currentPage = val
      console.log(val, '当前页')
    },
    // 上传图片部分
    brandUpload (response, file, fileList) {
      console.log(response, file, fileList, '成功')
      if (response.code === '0000') {
        console.log('上传成功')
        this.brandFileList[0].url = this.brandFileList[0].response.data[0]
        document.getElementsByClassName('el-upload')[0].style = 'display:none'
        document.getElementsByClassName('el-upload__tip')[0].style = 'display:none'
      }
    },
    brandRemove (file, fileList) {
      console.log('移除', file, fileList)
      if (file.status === 'success') {
        document.getElementsByClassName('el-upload')[0].style = 'display:block'
        document.getElementsByClassName('el-upload__tip')[0].style = 'display:block'
      }
    },
    brandChange (file, fileList) {
      this.brandFileList = fileList.slice(-1)
    },
    jumptypeChange (val) {
      console.log(val, '跳转类型下拉框改变时', this.brandform.jumptype)
      // 根据跳转类型改变跳转目标框
      console.log('看开关状态', this.typeOnOff, this.firstOnOff)
      if (this.typeOnOff || this.firstOnOff === 1) {
        switch (val) {
          case '0':
          case '6':
          case '7':this.inputItem = true
            this.cascaderItem = false
            this.selectItem_special = false
            this.selectItem_specialDetail = false
            this.selectItem_share = false
            this.selectItem_brand = false
            this.brandform.jumptarget = ''
            break
          case '1':this.cascaderItem = false
            this.inputItem = false
            this.selectItem_special = true
            this.selectItem_specialDetail = false
            this.selectItem_share = false
            this.selectItem_brand = false
            this.brandform.jumptarget = ''
            console.log(this.curProfessionID, '专业度id')
            this.getAllSelectData(this.curProfessionID)
            break
          case '2':this.cascaderItem = false
            this.inputItem = false
            this.selectItem_special = false
            this.selectItem_specialDetail = true
            this.selectItem_share = false
            this.selectItem_brand = false
            this.brandform.jumptarget = ''
            this.getSpecialArticleData(this.curProfessionID)
            break
          case '3':this.cascaderItem = false
            this.inputItem = false
            this.selectItem_special = false
            this.selectItem_specialDetail = false
            this.selectItem_share = true
            this.selectItem_brand = false
            this.brandform.jumptarget = ''
            this.getShareData(this.curProfessionID)
            break
          case '4':this.cascaderItem = true
            this.inputItem = false
            this.selectItem_special = false
            this.selectItem_specialDetail = false
            this.selectItem_share = false
            this.selectItem_brand = false
            this.brandform.jumptarget = ''
            this.getSortData()
            break
          case '5':this.cascaderItem = false
            this.inputItem = false
            this.selectItem_special = false
            this.selectItem_specialDetail = false
            this.selectItem_share = false
            this.selectItem_brand = true
            this.brandform.jumptarget = ''
            this.getBrandData()
            break
        }
      }
      this.typeOnOff = true
      this.firstOnOff = this.firstOnOff + 1
    }
  },
  mounted () {
    this.uploadImgUrl = this.HOST + '/picture/updateDefault'
    this.getBrandDirectList()
  }
}
</script>

<style lang="scss" scoped>
@import "../../../../assets/css/common.scss";
.brand_direct {
    padding: 0 25px;
    height: 100%;
    .choosebox{
      margin: 15px 0;
    }
    .tabledatabox{
      border-bottom: none;
      .picbox{
        width: 143px;
        height: 48px;
        margin-top: 8px;
      }
    }
    // 弹框
    .editDialogBox {
      .el-select{
        width: 100%;
      }
      .dialogProfession{
        color:#1f2d3d;
      }
    }
  }
</style>
<style media="screen" lang='scss'>
.el-dialog__body{
  padding: 2px 20px !important;
  border-bottom:1px solid #e0e6ed;
  margin-top: 12px;
}
.el-table .cell{
  text-align: left;
}
.el-upload__tip{
  text-align: center;
}
.el-upload{
  width: 100%;
}
.el-upload .el-upload-dragger{
  width: 100%;
}
.el-textarea{
  height: 120px;
}
.el-textarea__inner{
  height: 100%;
}
.el-form-item__label{
   color:#5e6d82;
}
.el-upload__tip{
  margin-top: 46px;
  line-height: 12px;
}
.el-dialog--tiny{
  width:480px;
}
.el-upload--picture-card{
  border:none;
}
.el-upload-dragger .el-upload__text{
  width:100%;
  position: absolute;
  top:44px;
  margin: auto;
}
.el-upload-list--picture-card .el-upload-list__item{
  width: 360px;
  height: 125px;
}
.el-cascader{
  width: 100%;
}
.is-opened{
  background: none;
}
.el-cascader{
  .el-icon-caret-bottom{
    transform: rotate(0deg);
  }
}
.el-select-dropdown{
  max-width: 360px;
}
</style>
