<template lang="html">
  <div class="brands_maintenance">
  <div class="topbar">
    <span class="shortline"></span>
    <span class="title">品牌维护</span>
    <el-button type="primary" class="addbrand" @click="addbrand">添加品牌</el-button>
  </div>
  <div class="searchbox">
    <el-select v-model="value" placeholder="全部国家">
     <el-option
       v-for="countryItem in countryItems"
       :key="countryItem.name"
       :label="countryItem.name"
       :value="countryItem.name">
     </el-option>
   </el-select>
   <el-input v-model="searchinput" placeholder="搜品牌名称" class="searchinput"></el-input>
   <el-button type="primary" icon="search">搜索</el-button>
   <el-button type="primary" icon="more" class="morebtn"></el-button>
  </div>
  <!-- 添加品牌弹框start -->
  <el-dialog title="添加品牌" :visible.sync="dialogVisible" size="tiny">
        <div class="dialog_eachbox">
          <p class="dialog_eachtitle">中文名称</p>
          <el-input v-model="Chinese" placeholder="请填写品牌中文名称" class="dialog_input"></el-input>
        </div>
        <div class="dialog_eachbox">
          <p class="dialog_eachtitle">英文名称</p>
          <el-input v-model="English" placeholder="请填写品牌英文名称" class="dialog_input"></el-input>
        </div>
        <div class="dialog_eachbox">
          <p class="dialog_eachtitle">所属国家</p>
          <el-select v-model="belongto" placeholder="全部国家" class="dialog_input">
           <el-option
             v-for="countryItem in countryItems"
             :key="countryItem.id"
             :label="countryItem.name"
             :value="countryItem.id">
           </el-option>
         </el-select>
        </div>
        <div class="dialog_eachbox">
          <p class="dialog_eachtitle">创建年月</p>
          <div class="block">
          <el-date-picker
            v-model="makedate"
            type="date"
            placeholder="选择品牌创建的年月"
            @change="dateChange"
            :picker-options="pickerOptions0"class="dialog_input" >
          </el-date-picker>
        </div>
        </div>
        <div class="dialog_eachbox clrfix" >
          <p class="dialog_eachtitle">Logo</p>
          <div class="logoClassBox">
            <el-upload
            enctype="multipart/form-data"
            class="upload-demo logoclass"
            :action="uploadUrl"
            :on-success="logoSuccess"
            :file-list="uplogoImg"
            :data='otherParams'
            name="picture">
            <span class="logo_pload">+横版 - 200x100</span>
          </el-upload>
          <el-upload
          enctype="multipart/form-data"
          class="upload-demo logoclass"
          :action="uploadUrl"
          :on-success="logoSuccessCopy"
          :file-list="uplogoImgCopy"
          :data='otherParams'
          name="picture">
          <span class="logo_pload">+矩版 - 192x192</span>
        </el-upload>
          </div>
        </div>
        <div class="dialog_eachbox">
          <p class="dialog_eachtitle">平台推荐</p>
          <el-switch
            v-model="platformrecommend"
            on-text=""
            off-text="">
          </el-switch>
        </div>
        <div class="dialog_eachbox">
          <p class="dialog_eachtitle">独家合作</p>
          <el-switch
            v-model="cooperate"
            on-text=""
            off-text="">
          </el-switch>
        </div>
        <div class="dialog_eachbox" v-if='cooperate'>
          <p class="dialog_eachtitle">授权证书</p>
          <el-upload
          class="upload-demo"
          :action="uploadUrl"
          :file-list="upCertificate"
          :data='otherParams'
          name="picture"
          :on-success='cooperateSuccess'>
          <span class="logo_pload">+上传图片</span>
        </el-upload>
        </div>
        <div class="dialog_eachbox">
          <p class="dialog_eachtitle">品牌简介</p>
          <el-input
            type="textarea"
            :autosize="{ minRows: 3, maxRows:6 }"
            v-model="brandintroduce" class="dialog_input">
          </el-input>
        </div>
        <div class="dialog_eachbox clrfix">
          <p class="dialog_eachtitle">封面海报</p>
          <div class="posterbox">
            <el-upload
            class="upload-demo"
            :action="uploadUrl"
            :file-list="posters"
            :data='otherParams'
            :on-success='posterSuccess'
            :on-remove='posterRemove'
            list-type="picture"
            name="picture">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传 jpg/png 文件,且不超过 100kb,建议规格750x400</div>
          </el-upload>
          </div>
        </div>

    <span slot="footer" class="dialog-footer">
      <el-button @click="uploadCancel">取 消</el-button>
      <el-button type="primary" class='' @click="addConfirm">确 定</el-button>
    </span>
  </el-dialog>
  <!-- tablebox开始 -->
  <div class="tablebox">
    <el-table border :data="brandTableData" style="width: 100%" >
      <el-table-column label="品牌Logo" width='100'>
        <template scope="scope">
          <div class="posterbox">
            <img :src="scope.row.logo" alt="" >
          </div>
      </template>
      </el-table-column>
      <el-table-column prop="chineseName" label="品牌中文名" width='160'>
      </el-table-column>
      <el-table-column prop="englishName" label="品牌英文名" width='160' >
      </el-table-column>
      <el-table-column prop="recommend" label="平台推荐"  width='100'>
      </el-table-column>
      <el-table-column prop="only" label="独家合作"  width='92'>
      </el-table-column>
      <el-table-column prop="certificate" label="授权证书"  width='92'>
        <template scope="scope">
          <div class="certificate" @click='lookCertificate(scope.$index, scope.row)'>
            查看
          </div>
      </template>
      </el-table-column>
      <el-table-column prop="intro" label="品牌介绍"  min-width="200">
        <template scope="scope" >
          <p class="brandIntro"  v-popover:introComplete>{{scope.row.intro}}
          <el-popover
            ref="introComplete"
            placement="bottom"
            width="380"
            trigger="hover"
            :content="scope.row.intro">
          </el-popover>
          </p>
        </template>
      </el-table-column>
      <el-table-column prop="posterpic" label="封面海报" width='96'>
        <template scope="scope" >
          <ul class="posterPicArr clrfix">
            <li class="posterItem" v-for='(item, index) in scope.row.covers'>
            <el-popover
              placement="right"
              trigger="hover"
              >
              <img :src='item.conver' alt="" class="posterItemImg">
              <span slot="reference" class="numItem" >{{index + 1}}</span>
            </el-popover>
            </li>
          </ul>
        </template>
      </el-table-column>
      <el-table-column prop="country.name" label="所在国家">
      </el-table-column>
      <el-table-column prop="shortEstablishTime" label="创建日期">
      </el-table-column>
      <el-table-column prop="operation" label="操作" >
        <template scope="scope">
        <p class='edit' @click='handleEdit(scope.$index, scope.row)'>编辑</p>
        <p class="delete" @click='handleDelete(scope.$index, scope.row)'>删除</p>
      </template>
      </el-table-column>
    </el-table>
    <!-- 分页部分start -->
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
  <!-- 分页部分end -->
  </div>
  </div>
</template>

<script>
import qs from 'querystring'

export default {
  data () {
    return {
      imgUrl: 'http://192.168.0.194:8088/picture/update',
      // 上传海报
      posters: [],
      // 平台推荐
      platformrecommend: false,
      // 独家合作
      cooperate: false,
      // 创建日期
      createddate: '',
      fileList: [],
      // 选择日期，后期改名字，先用默认的
      value1: '',
      //  弹框状态，add或者 edit
      dialogState: '',
      curIndex: '',
      Chinese: '',
      English: '',
      // 品牌简介
      brandintroduce: '',
      dialogVisible: false,
      searchinput: '',
      countryItems: [],
      // 所属国家
      belongto: '',
      value: '',
      // 创建日期
      makedate: '',
      brandTableData: [],
      imageUrl: '',
      currentPage: 1,
      curSize: 10,
      // 上传图片接口
      uploadUrl: '',
      posterUrlArr: [],
      // 上传logo
      uplogoImg: [],
      uplogoImgCopy: [],
      logoUrl: '',
      cooperateUrl: '',
      upCertificate: [],
      otherParams: {
        type: 0
      },
      // 被编辑或删除项的id
      chooseItemID: '',
      // 当前页
      curPage: 1
    }
  },
  methods: {
    handleSizeChange (val) {
      this.curSize = val
      this.getBrandList()
    },
    handleCurrentChange (val) {
      this.curPage = val
      this.getBrandList()
    },
    // 查看授权证书
    lookCertificate (index, row) {
      console.log('授权证书', index, row)
      window.sessionStorage.setItem('certificateUrl', row.certificate)
      window.open(window.location.origin + '/#/certificate')
    },
    // 日期选择控件
    pickerOptions0: {
      disabledDate (time) {
        return time.getTime() < Date.now() - 8.64e7
      }
    },
    // 添加品牌弹框
    addbrand () {
      this.dialogVisible = true
      this.dialogState = 'add'
      // 添加品牌时条目为空
      this.Chinese = ''
      this.English = ''
      this.belongto = ''
      this.makedate = ''
      this.introduce = ''
      this.location = ''
      this.createddate = ''
      this.platformrecommend = false
      this.cooperate = false
      this.brandintroduce = ''
      this.logoUrl = ''
      this.uplogoImg = []
      this.uplogoImgCopy = []
      this.posters = []
    },
    // 日期格式转换
    dateFormat (standard) {
      if (standard) {
        return standard.getFullYear() + '-' + (standard.getMonth() < 9 ? '0' + (standard.getMonth() + 1) : standard.getMonth() + 1)
      }
    },
    dateChange (val) {
      this.makedate = val
      console.log('日期', val)
    },
    logoSuccess (response, file, fileList) {
      if (response.code === '0000') {
        this.logoUrl = response.data[0]
      }
    },
    logoSuccessCopy (response, file, fileList) {
      // this.imageUrl = URL.createObjectURL(file.raw)
      console.log('上传logo', response, file, fileList)
      if (response.code === '0000') {
        this.logoUrlCopy = response.data[0]
      }
    },
    cooperateSuccess (response, file, fileList) {
      if (response.code === '0000') {
        this.cooperateUrl = response.data[0]
      }
    },
    posterRemove (file, fileList) {
      this.posterUrlArr = []
      for (var i = 0; i < fileList.length; i++) {
        this.posterUrlArr[i] = fileList[i].url
      }
      console.log('移除后当前路径', this.posterUrlArr)
    },
    posterSuccess (response, file, fileList) {
      console.log('海报list', fileList)
      for (var i = 0; i < fileList.length; i++) {
        if (fileList[i].response) {
          this.posterUrlArr[i] = fileList[i].response.data[0]
        } else {
          this.posterUrlArr[i] = fileList[i].url
        }
      }
      console.log('当前路径', this.posterUrlArr)
    },
    // 布尔转字和字转布尔
    toBoolean (val) {
      if (val === '是') {
        return true
      } else if (val === '否') {
        return false
      }
    },
    toWord (val) {
      if (val === true) {
        return '是'
      } else if (val === false) {
        return '否'
      }
    },
    // input为空时提示
    noEmpty (val, content) {
      if (val === '') {
        this.$message({
          message: content + '不能为空',
          type: 'warning'
        })
      }
    },
    // 确认添加
    addConfirm () {
      console.log('传参开始')
      console.log(this.Chinese)
      console.log(this.English)
      console.log(this.belongto)
      console.log(this.brandintroduce)
      console.log('平台合作', this.cooperateUrl)
      console.log('logo', this.logoUrl)
      console.log('logo复制', this.logoUrlCopy)
      console.log('封面数组', this.posterUrlArr)
      console.log(this.platformrecommend)
      console.log(this.cooperate)
      console.log('创建日期', this.makedate)
      this.noEmpty(this.brandintroduce, '品牌简介')
      this.noEmpty(this.makedate, '创建年月')
      this.noEmpty(this.belongto, '所属国家')
      this.noEmpty(this.English, '英文名称')
      this.noEmpty(this.Chinese, '中文名称')
      if (this.brandintroduce !== '' && this.makedate !== '' && this.belongto !== '' && this.English !== '' && this.Chinese !== '') {
        if (this.dialogState === 'add') {
          var addbrandUrl = this.HOST + '/brand/add'
          this.$http.post(addbrandUrl, qs.stringify({
            chineseName: this.Chinese,
            englishName: this.English,
            countryId: this.belongto,
            intro: this.brandintroduce,
            certificate: this.cooperateUrl,
            logo: this.logoUrl,
            logoRectangle: this.logoUrlCopy,
            covers: this.posterUrlArr,
            isRecommend: this.platformrecommend,
            isOnly: this.cooperate,
            establishTime: this.makedate
          })).then(res => {
            if (res.data.code === '0000') {
              this.$message({
                message: '品牌添加成功',
                type: 'success'
              })
              this.getBrandList()
            } else {
              this.$message({
                message: '品牌添加失败，请稍后重试',
                type: 'warning'
              })
            }
          })
        } else if (this.dialogState === 'edit') {
          var updatebrandUrl = this.HOST + '/brand/update'
          this.$http.post(updatebrandUrl, qs.stringify({
            id: this.chooseItemID,
            chineseName: this.Chinese,
            englishName: this.English,
            countryId: this.belongto,
            intro: this.brandintroduce,
            certificate: this.cooperateUrl,
            logo: this.logoUrl,
            logoRectangle: this.logoUrlCopy,
            covers: this.posterUrlArr,
            isRecommend: this.platformrecommend,
            isOnly: this.cooperate,
            establishTime: this.makedate
          })).then(res => {
            this.getBrandList()
            console.log('编辑成功', res.date)
          })
        }
        this.brandname = ''
        this.brandintroduce = ''
        this.dialogVisible = false
      }
    },
    uploadCancel () {
      this.dialogVisible = false
    },
    handleEdit (index, row) {
      // logo列表显示
      this.uplogoImg = []
      this.uplogoImgCopy = []
      this.posters = []
      this.uplogoImg.push({
        name: row.logo.split('/')[row.logo.split('/').length - 1],
        url: row.logo
      })
      // 还未匹配
      this.uplogoImgCopy.push({
        name: row.logoRectangle.split('/')[row.logo.split('/').length - 1],
        url: row.logoRectangle
      })
      // 列表展示
      for (var i = 0; i < row.covers.length; i++) {
        console.log(row.covers[i].conver)
        this.posters.push({
          name: row.covers[i].conver.split('/')[row.covers[i].conver.split('/').length - 1],
          url: row.covers[i].conver
        })
      }
      console.log(row, '编辑品牌')
      this.dialogVisible = true
      this.dialogState = 'edit'
      this.chooseItemID = row.id
      this.Chinese = row.chineseName
      this.English = row.englishName
      this.belongto = row.country.id
      this.brandintroduce = row.intro
      this.logoUrl = row.logo
      this.logoUrlCopy = row.logoRectangle
      // this.posterUrlArr = row.covers
      this.posterUrlArr = []
      for (var j = 0; j < row.covers.length; j++) {
        this.posterUrlArr[j] = row.covers[j].conver
      }
      if (row.recommend === '是') {
        this.platformrecommend = true
      } else {
        this.platformrecommend = false
      }
      if (row.only === '是') {
        this.cooperate = true
      } else {
        this.cooperate = false
      }
      this.makedate = new Date(row.establishTime).toLocaleString().split(' ')[0].split('/').join('-')
    },
    handleDelete (index, row) {
      this.chooseItemID = row.id
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 调用删除接口
        var branddeleteUrl = this.HOST + '/brand/delete'
        this.$http.post(branddeleteUrl, qs.stringify({
          id: this.chooseItemID
        })).then(res => {
          if (res.data.code === '0000') {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getBrandList()
          } else {
            this.$message({
              type: 'warning',
              message: '删除失败，请稍后再试！'
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
      console.log(index, row)
    },
    // 品牌列表页
    getBrandList () {
      var getBrandListUrl = this.HOST + '/brand/inquire'
      this.$http(getBrandListUrl, {params: {
        page: this.curPage,
        count: this.curSize
      }}).then(res => {
        this.brandTableData = res.data.list
        for (var i = 0; i < this.brandTableData.length; i++) {
          if (this.brandTableData[i].recommend === 0) {
            this.brandTableData[i].recommend = '否'
          } else {
            this.brandTableData[i].recommend = '是'
          }
          if (this.brandTableData[i].only === 0) {
            this.brandTableData[i].only = '否'
          } else {
            this.brandTableData[i].only = '是'
          }
          this.brandTableData[i].shortEstablishTime = new Date(this.brandTableData[i].establishTime).toLocaleString().split(' ')[0].split('/').slice(0, 2).join('-')
        }
        console.log('列表', res.data.list)
      })
    }
  },
  mounted () {
    this.uploadUrl = this.HOST + '/picture/update'
    var countryUrl = this.HOST + '/country/all'
    // 请求国家
    this.$http(countryUrl).then(res => {
      this.countryItems = res.data.list
    })
    // 请求品牌列表
    this.getBrandList()
  }
}
</script>

<style lang="scss">
@import "../../../../assets/css/common.scss";
table {
    text-align: left;
}
.brands_maintenance {
    padding: 0 25px;
    height: 100%;
    .addbrand {
        float: right;
        margin-top: 22px;
    }
        .el-input__inner,
        .el-select {
        }
        .searchinput {
            margin: 0 8px;
            width: 178px;
            .el-input__inner {
                width: 100%;
            }
        }
        .morebtn {
            padding: 10px;
            float: right;
        }
    // 表格部分
    .tablebox {
      .el-table{
         .cell{
           font-size: 13px !important;
         }
      }
        .picbox {
            background: #f2f2f2;
            border: 1px solid #cccccc;
            width: 62px;
            height: 62px;
            margin: 15px 0;
            cursor: pointer;
        }
        .posterbox{
          background: #f2f2f2;
          width: 62px;
          height: 62px;
          margin: 15px 0;
          cursor: pointer;
          img{
            width: 100%;
            height: 100%;
          }
        }
        // 品牌介绍
        .brandIntro{
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
          cursor: pointer;
        }
        // 封面海报数组
        .posterPicArr{
          .posterItem{
            .numItem{
              color:#20a0ff;
              margin-left: 5px;
              float: left;
              cursor: pointer;
            }
          }
        }
        .edit{
          float: left;
          color:#20a0ff;
          margin-right: 12px;
          cursor: pointer;
        }
        .delete{
          cursor: pointer;
          float: left;
          color:#ff4949;
        }
        .certificate{
          cursor: pointer;
          color:#20a0ff;
        }
    }
}
// 添加品牌弹框
.el-dialog--tiny {
    width: 28%;
    .dialog_eachbox{
      margin-bottom: 14px;
      .logoClassBox{
        float: left;

      }
      .logoclass{
        float: left;
        margin-right: 35px;
      }
      .dialog_eachtitle{
        width: 62px;
        float: left;
        margin-right: 16px;
        line-height: 36px;
      }
      .dialog_input{
        width: 80%;
      }
      .logo_pload{
        color: #20a0ff;
        line-height: 36px;
      }
      // 开关
      .el-switch{
        margin-top: 7px;
      }
      // 上传海报框
      .posterbox{
        float: left;
        padding-top: 5px;
        width: 80%;
      }
    }
}
.posterItemImg{
  width: auto;
  height: 120px;
  display: inline-block;
}
</style>
