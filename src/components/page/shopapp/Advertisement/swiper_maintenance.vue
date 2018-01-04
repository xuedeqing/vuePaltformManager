<template lang="html">
  <div class="swiper_maintenance">
    <div class="topbar">
      <span class="shortline"></span>
      <span class="title">轮播维护</span>
      <el-button type="primary" class="addswiper" @click="showSwiperDialog">添加轮播</el-button>
    </div>
    <div class="choosebox">
      <el-select v-model="whichswiper" placeholder="请选择" @change='markTableData'>
        <el-option
        v-for="item in whichOption"
        :key="item.name"
        :label="item.name"
        :value="item.name">
        </el-option>
      </el-select>
    </div>
    <!-- 轮播表格部分 -->
    <div class="tabledatabox">
      <el-table :data="swiperData" style="width: 100%" border>
         <el-table-column label="序号" width='80' type='index'></el-table-column>
         <el-table-column prop="type" label="投放位置"></el-table-column>
         <el-table-column prop="name" label="轮播名称"></el-table-column>
         <el-table-column prop="pic" label="轮播图片" width='110' >
           <template scope='scope'>
              <img :src="scope.row.image" alt="" class="picbox">
           </template>
         </el-table-column>
         <el-table-column prop="url" label="跳转链接" width='200'></el-table-column>
         <el-table-column label="面向专业度"  width='180'>
           <template scope="scope">
             <el-tag class="professionalTag"
             v-for='professionalItem in scope.row.profession'
             :type="professionalItem === '艺考生' ? 'primary' : (professionalItem === '艺术家' ? 'danger' : 'gray')">{{professionalItem}}</el-tag>
           </template>
         </el-table-column>
         <el-table-column prop="platform" label="面向平台"></el-table-column>
         <el-table-column prop="color" label="海报背景色"></el-table-column>
         <el-table-column prop="remark" label="备注"></el-table-column>
         <el-table-column label="状态">
           <template scope="scope">
             <p class='start' v-show='!scope.row.status'>启用</p>
             <p class='nostart' v-show='scope.row.status'>禁用</p>
           </template>
         </el-table-column>
         <el-table-column prop="createdtime" label="创建日期" width='140' ></el-table-column>
         <el-table-column prop="operation" label="操作" width='150'>
           <template scope="scope">
             <p class='operationbtn' v-show='scope.row.status' @click='handleChange(scope.$index, scope.row)'>启用</p>
             <p class='operationbtn' v-show='!scope.row.status' @click='handleChange(scope.$index, scope.row)'>禁用</p>
             <p class='operationbtn' @click='handleEdit(scope.$index, scope.row)'>编辑</p>
             <p class="operationbtn" @click='handleDelete(scope.$index, scope.row)'>删除</p>
           </template>
         </el-table-column>
       </el-table>
    </div>
    <!-- 轮播弹框 -->
    <el-dialog :title="dialogTitle" :visible.sync="swiperVisible" size="tiny" class="swiperDialog">
      <el-form :model="swiperForm" :rules="swiperrules" ref="swiperForm" label-width="80px">
        <el-form-item label="投放位置" prop="location">
          <el-select v-model="swiperForm.location" placeholder="请选择投放位置" class="selectitem">
            <el-option
            v-for="item in locationOption"
            :key="item.value"
            :label="item.label"
            :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="轮播名称" prop="swipername">
          <el-input class='inputitem' placeholder="请选择轮播名称" v-model='swiperForm.swipername'></el-input>
        </el-form-item>
        <el-form-item label="轮播图片" prop="swiperimg">
          <el-upload
            class="upload-demo"
            drag
            :action="swiperUrl"
            name="picture"
            :data='otherParams'
            :on-change="swiperChange"
            :on-success='getSwiperFile'
             list-type="picture"
            :file-list='swiperForm.swiperimg'
            multiple>
            <!-- :file-list='swiperFileList' -->

            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="跳转链接" prop="linkUrl">
          <el-input class='inputitem' placeholder="请选择跳转链接" v-model='swiperForm.linkUrl'></el-input>
        </el-form-item>
        <el-form-item label="面向专业" prop="professional">
          <el-checkbox-group v-model="swiperForm.professional">
              <el-checkbox label="儿童"></el-checkbox>
              <el-checkbox label="艺考生"></el-checkbox>
              <el-checkbox label="艺术家"></el-checkbox>
            </el-checkbox-group>
        </el-form-item>
        <el-form-item label="面向平台" prop="platform">
          <el-select v-model="swiperForm.platform" placeholder="请选择面向平台" class="selectitem">
            <el-option
            v-for="item in platformOption"
            :key="item.value"
            :label="item.label"
            :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="背景色">
          <el-input class='inputitem' placeholder="选填，适用于PC网站类轮播" v-model='bgColor'></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input class='inputitem'  type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model='remarkItem'></el-input>
        </el-form-item>
        <el-form-item label="是否启用">
            <el-switch v-model="startStatus" on-text="" off-text=""></el-switch>
        </el-form-item>
        <el-form-item class="operationbox">
          <el-button type="primary" class="operationbtn" @click="createSwiper('swiperForm')">立即创建</el-button>
          <el-button class="operationbtn" @click='cancleCreate'>取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import qs from 'querystring'

export default {
  data () {
    return {
      swiperCurImg: '',
      curplatform: '',
      curlocation: '',
      whichOption: [],
      locationOption: [{
        value: '艺享',
        label: '艺享'
      }, {
        value: '首页',
        label: '首页'
      }, {
        value: '机构',
        label: '机构'
      }],
      platformOption: [{
        value: '移动端',
        label: '移动端'
      }, {
        value: 'PC端',
        label: 'PC端'
      }],
      whichswiper: '艺享',
      swiperData: [],
      swiperVisible: false,
      swiperForm: {
        location: '',
        swipername: '',
        swiperimg: [],
        linkUrl: '',
        professional: [],
        platform: ''
      },
      swiperrules: {
        location: [{
          required: true,
          message: '请输入投放位置',
          trigger: 'change'
        }],
        swipername: [{
          required: true,
          message: '请输入轮播名称',
          trigger: 'blur'
        }],
        swiperimg: [{
          type: 'array',
          required: true,
          message: '请上传轮播图片',
          trigger: 'change'
        }],
        linkUrl: [{
          required: true,
          message: '请输入跳转链接',
          trigger: 'blur'
        }],
        professional: [{
          type: 'array',
          required: true,
          message: '请输入至少勾选一个专业度',
          trigger: 'change'
        }],
        platform: [{
          required: true,
          message: '请选择面向平台',
          trigger: 'change'
        }]
      },
      // 渲染到表格的数据
      chooselocation: '',
      chooseplatform: '',
      nameItem: '',
      swiperFileList: [],
      professionalCheckList: [],
      startStatus: true,
      swiperUrl: '',
      linkUrlItem: '',
      remarkItem: '',
      bgColor: '',
      // 接口
      swiperStatus: '',
      swiperPoster: '',
      swiperDeleteUrl: '',
      dialogTitle: '',
      // 轮播弹框状态，为0是新增轮播，1是编辑轮播
      dialogStatus: '',
      // 当前编辑的id
      editItemID: '',
      // 上传图片其他参数
      otherParams: {
        type: 0
      },
      // 传参 首页:0,艺享:1表格中列表数据
      chooseSwiperType: 1
    }
  },
  methods: {
    markTableData (value) {
      if (value === '艺享') {
        this.chooseSwiperType = 1
      } else if (value === '首页') {
        this.chooseSwiperType = 0
      } else if (value === '机构') {
        this.chooseSwiperType = 2
      }
      this.getTableData()
    },
    showSwiperDialog () {
      console.log('添加轮播')
      this.dialogTitle = '添加轮播'
      // 数据设置
      this.swiperForm.platform = ''
      this.swiperForm.location = ''
      this.swiperForm.swipername = ''
      this.swiperForm.swiperimg = []
      this.swiperForm.linkUrl = ''
      this.swiperForm.professional = []
      this.bgColor = ''
      this.remarkItem = ''
      this.startStatus = true
      // 状态设置
      this.swiperVisible = true
      this.dialogStatus = 0
    },
    // 启用禁用状态
    handleChange (index, row) {
      var that = this
      // row.status = !row.status
      if (row.status === 0) {
        row.status = 1
      } else if (row.status === 1) {
        row.status = 0
      }
      this.$http.post(that.swiperStatus, qs.stringify({
        id: row.id,
        status: row.status
      })).then(res => {
        console.log(res)
        if (res.data.code === '0000') {
          alert('状态修改成功')
        } else {
          alert('服务器繁忙，请稍后再试')
        }
      })
      console.log(index, row)
    },
    handleEdit (index, row) {
      this.swiperForm.swiperimg = []
      this.dialogTitle = '编辑轮播'
      this.dialogStatus = 1
      this.swiperVisible = true
      this.editItemID = row.id
      // 数据设置
      this.swiperForm.platform = row.platform
      this.swiperForm.location = row.type
      this.swiperForm.swipername = row.name
      // this.swiperForm.swiperimg = row.image
      this.swiperForm.linkUrl = row.url
      this.swiperForm.professional = row.profession
      this.bgColor = row.color
      this.remarkItem = row.remark
      this.startStatus = row.status
      // 图片列表做处理
      this.swiperForm.swiperimg.push({
        name: row.image.split('/').pop(),
        url: row.image
      })
      console.log('编辑项', row)
    },
    handleDelete (index, row) {
      var that = this
      this.$http.post(that.swiperDeleteUrl, qs.stringify({
        id: row.id
      })).then(res => {
        if (res.data.code === '0000') {
          alert('删除成功')
        } else {
          alert('服务器繁忙，请稍后再试')
        }
      }).then(res => {
        console.log('删除失败')
      })
      this.getTableData()
    },
    swiperChange (file, fileList) {
      this.swiperForm.swiperimg = fileList.slice(-1)
    },
    // 获取轮播图片的url
    getSwiperFile (response, file, fileList) {
      console.log('成功时', response, file, fileList)
      if (file.response !== undefined) {
        this.swiperForm.swiperimg = fileList
        console.log(fileList)
      }
    },
    // 取消
    cancleCreate () {
      this.swiperVisible = false
    },
    createSwiper (formName) {
      // 判断链接是否有http,没有则默认加上
      if (this.swiperForm.linkUrl.indexOf('http') >= 0) {
      } else {
        this.swiperForm.linkUrl = 'http://' + this.swiperForm.linkUrl
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$message({
            message: '上传成功',
            type: 'success'
          })
          var addSwiperUrl = this.HOST + '/carousel/add'
          var swiperUpdateUrl = this.HOST + '/carousel/update'
          // 图片列表清空
          // this.swiperForm.swiperimg = []
          if (this.swiperForm.platform === 'PC端') {
            this.curplatform = 1
          } else if (this.swiperForm.platform === '移动端') {
            this.curplatform = 2
          }
          if (this.swiperForm.location === '首页') {
            this.curlocation = 0
          } else if (this.swiperForm.location === '艺享') {
            this.curlocation = 1
          } else if (this.swiperForm.location === '机构') {
            this.curlocation = 2
          }
          for (var i = 0; i < this.swiperForm.professional.length; i++) {
            if (this.swiperForm.professional[i] === '艺术家') {
              this.swiperForm.professional[i] = '905496907288801280'
            } else if (this.swiperForm.professional[i] === '儿童') {
              this.swiperForm.professional[i] = '905496956341186560'
            } else if (this.swiperForm.professional[i] === '艺考生') {
              this.swiperForm.professional[i] = '905497000209412096'
            }
          }
          if (this.startStatus === true) {
            this.startStatus = 0
          } else if (this.startStatus === false) {
            this.startStatus = 1
          }
          if (this.swiperForm.swiperimg[0].response) {
            this.swiperCurImg = this.swiperForm.swiperimg[0].response.data[0]
          } else {
            this.swiperCurImg = this.swiperForm.swiperimg[0].url
          }

          // 弹框状态为0则是新增轮播，为1则是编辑轮播
          if (this.dialogStatus === 0) {
            console.log('新增状态')
            console.log('上传图片的数据', this.swiperForm.swiperimg)
            this.$http.post(addSwiperUrl, qs.stringify({
              platform: this.curplatform,
              type: this.curlocation,
              name: this.swiperForm.swipername,
              image: this.swiperCurImg,
              url: this.swiperForm.linkUrl,
              profession: this.swiperForm.professional,
              color: this.bgColor,
              remark: this.remarkItem,
              status: this.startStatus
            })).then(res => {
              this.getTableData()
              console.log('新增添加成功')
              console.log(res)
            })
          } else if (this.dialogStatus === 1) {
            this.$http.post(swiperUpdateUrl, qs.stringify({
              id: this.editItemID,
              platform: this.curplatform,
              type: this.curlocation,
              name: this.swiperForm.swipername,
              image: this.swiperCurImg,
              url: this.swiperForm.linkUrl,
              profession: this.swiperForm.professional,
              color: this.bgColor,
              remark: this.remarkItem,
              status: this.startStatus
            })).then(res => {
              console.log('更新', res)
              this.getTableData()
            })
          }
          this.swiperVisible = false
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getTableData () {
      console.log('刷')
      // 轮播类型
      var swiperType = this.HOST + '/carousel/type'
      // 修改轮播状态
      this.swiperStatus = this.HOST + '/carousel/status'
      this.$http(swiperType).then(res => {
        this.whichOption = res.data.list
        console.log('123', this.whichOption)
      }, res => {
        console.log('轮播类型返回失败')
      })
      // 轮播列表默认艺享
      var swiperList = this.HOST + '/carousel/all'
      this.$http(swiperList, {params: {
        type: this.chooseSwiperType
      }}).then(res => {
        this.swiperData = res.data.list
        // 时间格式处理
        for (var i = 0; i < this.swiperData.length; i++) {
          this.swiperData[i].createdtime = this.swiperData[i].createdtime.split(' ')[0].split('-').join('/')
          // 投放位置
          if (this.swiperData[i].type === 0) {
            this.swiperData[i].type = '首页'
          } else if (this.swiperData[i].type === 1) {
            this.swiperData[i].type = '艺享'
          } else if (this.swiperData[i].type === 2) {
            this.swiperData[i].type = '机构'
          }
          // 面向平台
          if (this.swiperData[i].platform === 1) {
            this.swiperData[i].platform = 'PC端'
          } else if (this.swiperData[i].platform === 2) {
            this.swiperData[i].platform = '移动端'
          }
          // 专业度匹配
          this.swiperData[i].profession = this.swiperData[i].profession.split(',')
          for (var j = 0; j < this.swiperData[i].profession.length; j++) {
            if (this.swiperData[i].profession[j] === '905496907288801280') {
              this.swiperData[i].profession[j] = '艺术家'
            } else if (this.swiperData[i].profession[j] === '905496956341186560') {
              this.swiperData[i].profession[j] = '儿童'
            } else if (this.swiperData[i].profession[j] === '905497000209412096') {
              this.swiperData[i].profession[j] = '艺考生'
            }
          }
        }
        console.log(this.swiperData)
        console.log('轮播列表', res.data)
      }, res => {
        console.log('轮播列表返回失败')
      })
    }
  },
  mounted () {
    this.swiperUrl = this.HOST + '/picture/update'
    this.swiperDeleteUrl = this.HOST + '/carousel/delete'
    this.getTableData()
  }
}
</script>

<style lang="scss">
@import "../../../../assets/css/common.scss";
.swiper_maintenance {
    padding: 0 25px;
    height: 100%;
    .addswiper {
        float: right;
        margin-top: 22px;
    }
    .choosebox{
      margin: 15px 0;
    }
    // 表格
    .tabledatabox{
      .start, .nostart, .operationbtn, .delete{
        cursor: pointer;
        float: left;
        margin-left: 7px;
      }
      .start{
        color: #13ce66;
      }
      .operationbtn{
        color: #20a0ff;
      }
      .nostart{
        color: #ff4949;
      }
      .professionalTag{
        margin-left: 4px;
      }
      .picbox{
        width:77px;
        height:50px;
        margin:5px 0;
        vertical-align: middle;
      }
    }
    // 弹框
    .swiperDialog{
      .selectitem, .inputitem, .el-upload{
        width: 99%;
      }
      .el-upload__tip{
        text-align: center;
        margin-top: -11px;
      }
      .el-upload-dragger{
        width: 100%;
        background:#f9fafc;
        border:1px solid #c0ccda;
      }
      .operationbox{
        .operationbtn{
          float: right;
          margin-left: 8px;
        }
      }
    }
  }
</style>
