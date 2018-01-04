<template lang="html">
  <div class="instituteList">
    <div class="topbar">
      <span class="shortline"></span>
      <span class="title">机构列表</span>
      <el-button type='primary'  @click='addInstitute()' class="addsort">添加机构</el-button>
    </div>
    <div class="selectBox">
      <el-select v-model="areaSelect" placeholder="全部地区">
        <el-option
          v-for="item in areaOption"
          :key="item.areaId"
          :label="item.areaName"
          :value="item.areaId">
        </el-option>
      </el-select>
      <el-select v-model="typeSelect" placeholder="全部类型">
        <el-option
          v-for="item in typeOption"
          :key="item.typeId"
          :label="item.typeName"
          :value="item.typeId">
        </el-option>
      </el-select>
      <el-input placeholder='搜机构名称'  v-model='searchInstituteName' class='searchInp'></el-input>
      <el-button type="primary" icon="search" >搜索</el-button>
    </div>
    <div class="instituteTable">
      <el-table
        :data="instituteData"
        style="width: 100%"
        max-height='500'>
          <el-table-column
             prop="id"
             label="机构ID"
             width="200">
           </el-table-column>
           <el-table-column
              prop="logo"
              label="Logo"
              width="120">
              <template scope='scope'>
                <img :src="scope.row.logImg" alt="" class="logoimg">
              </template>
            </el-table-column>
            <el-table-column
               prop="name"
               label="机构名称"
            >
             </el-table-column>
             <el-table-column
                prop="type"
                label="机构类型"
                width="150">
              </el-table-column>
              <el-table-column
                 prop="area"
                 label="所在地区"
                 width="220">
               </el-table-column>
           <el-table-column
              prop="enterTime"
              label="入驻时间"
              width="150">
            </el-table-column>
            <el-table-column
               prop="deadline"
               label="到期时间"
               width="150">
             </el-table-column>
             <el-table-column
                prop="location"
                width="150"
                label="地理位置（坐标）">
              </el-table-column>
              <el-table-column
                 prop="operation"
                 width="120"
                 label="操作">
                 <template scope='scope'>
                   <p class='blue fl' @click='editInstitute(scope.row, scope.$index)'>编辑</p>
                   <p class='red fl'>删除</p>
                 </template>
               </el-table-column>
            </el-table>
          </div>
        <div class="paginationblock fr">
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
    <div class="dialogBox">
      <el-dialog
        title="添加机构"
        :visible.sync="instituteDialog"
        size="small"
        >
        <el-form :model="instituteForm" :rules="instituteRules" ref="instituteForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="机构类型" prop="typeSelect">
            <el-select v-model="instituteForm.typeSelect" placeholder="请选择机构所属的类型" class="dialogInnergWidth">
              <el-option
                v-for="item in typeOption"
                :key="item.typeId"
                :label="item.typeName"
                :value="item.typeId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所在地区" prop="area">
            <el-select v-model="instituteForm.area" placeholder="请选择机构所在地区" class="dialogInnergWidth">
              <el-option
                v-for="item in areaOption"
                :key="item.areaId"
                :label="item.areaName"
                :value="item.areaId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="地图定位" prop="mapLocation">
            <div class="clrfix mapsearchBox">
              <el-input class="mapInp" placeholder='请输入机构名称或详细地址' v-model='dialogSearch'></el-input>
              <div class="searchbtn" @click='searchInstitute()' >
                <i class="el-icon-search"></i>
              </div>
            </div>
            <div class="mapBox">
              <div class="mapArea" id="container" tabindex="0">
              </div>
              <div id="panel" tabindex="0">
              </div>
            </div>
          </el-form-item>
          <el-form-item label="机构名称" prop="name">
              <el-input v-model='instituteForm.name' placeholder='请填写机构的完整名称' class="dialogInnergWidth"></el-input>
          </el-form-item>
          <el-form-item label="服务热线" prop="serviceTel">
              <el-input v-model='instituteForm.serviceTel' placeholder='请填写机构对外服务热线' class="dialogInnergWidth"></el-input>
          </el-form-item>
          <el-form-item label="详细地址" prop="detailAddress">
              <el-input v-model='instituteForm.detailAddress' placeholder='请填写机构的详细地址' class="dialogInnergWidth"></el-input>
          </el-form-item>
          <el-form-item label="地理坐标" prop="coordinate">
              <el-input v-model='instituteForm.coordinate' placeholder='请填写机构的准确坐标（经纬度）' class="dialogInnergWidth"></el-input>
          </el-form-item>
          <el-form-item label="机构Logo" prop="instituteLogo">
              <el-upload
                class="logoUpload"
                drag
                list-type="picture-card"
                :data='otherParams'
                :action="uploadImgUrl"
                name="picture"
                :on-success='logoImgSuccess'
                :on-remove='logoImgRemove'
                multiple>
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
              </el-upload>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="instituteDialog = false">取 消</el-button>
          <el-button type="primary" @click="instituteDialog = false">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import AMap from 'AMap'
// import AMapUI from 'AMapUI'
export default {
  data () {
    return {
      // 地图搜索框
      dialogSearch: '',
      uploadImgUrl: '',
      otherParams: {
        typeName: 'instituteLogoImg'
      },
      curSize: 10,
      currentPage: 1,
      areaSelect: '',
      typeSelect: '',
      areaOption: [{
        areaName: '罗湖区',
        areaId: '1'
      }, {
        areaName: '南山区',
        areaId: '2'
      }],
      typeOption: [{
        typeName: '类型1',
        typeId: '1'
      }, {
        typeName: '类型2',
        typeId: '2'
      }],
      searchInstituteName: '',
      // 表格data
      instituteData: [{
        id: 'GD803219DG87612389',
        logImg: 'http://img.mouarts.com/share/940145368434319360.png',
        name: '小红星幼儿园',
        type: '幼儿园',
        area: '广东省 深圳市 罗湖区',
        enterTime: '2017-12-18',
        deadline: '2017-12-18',
        location: '经度:114.175772 纬度：22.570543'
      }, {
        id: 'GD803219DG87612389',
        logImg: 'http://img.mouarts.com/share/940145368434319360.png',
        name: '鹿茵幼儿园',
        type: '幼儿园',
        area: '广东省 深圳市 罗湖区',
        enterTime: '2017-12-18',
        deadline: '2017-12-18',
        location: '经度:114.175772 纬度：22.570543'
      }],
      instituteDialog: false,
      // 添加机构
      instituteForm: {
        typeSelect: '',
        area: '',
        name: '',
        serviceTel: '',
        detailAddress: '',
        coordinate: '',
        instituteLogo: ''
      },
      instituteRules: {
        typeSelect: [{required: true, message: '请选择机构所属的类型', trigger: 'change'}],
        area: [{required: true, message: '请选择机构所属的类型', trigger: 'change'}],
        name: { required: true, message: '请输入机构名称', trigger: 'blur' },
        serviceTel: { required: true, message: '请输入机构对外服务热线', trigger: 'blur' },
        detailAddress: { required: true, message: '请输入机构的详细地址', trigger: 'blur' },
        coordinate: { required: true, message: '请输入机构的详细地址', trigger: 'blur' },
        instituteLogo: { required: true, message: '请上传图片', trigger: 'blur' }
      }
    }
  },
  methods: {
    // 分页
    handleSizeChange (val) {
      this.curSize = val
    },
    handleCurrentChange (val) {
      this.curPage = val
    },
    // 添加机构
    addInstitute () {
      this.instituteDialog = true
      // 清空
      this.instituteForm.typeSelect = ''
      this.instituteForm.area = ''
      this.dialogSearch = ''
      this.instituteForm.name = ''
      this.instituteForm.serviceTel = ''
      this.instituteForm.detailAddress = ''
      this.instituteForm.coordinate = ''
      // 图片的还未进行处理
      // 渲染组件滞后 需要延时才能出来
      setTimeout(function () {
        var map = new AMap.Map('container', {
          resizeEnable: true,
          zoom: 10,
          center: [116.39, 39.9]
        })
        console.log(map)
      }, 100)
    },
    // 搜地址
    searchInstitute () {
      console.log(this.dialogSearch)
      var searchContent = this.dialogSearch
      var map = new AMap.Map('container', {
        resizeEnable: true
      })
      AMap.service(['AMap.PlaceSearch'], function () {
        var placeSearch = new AMap.PlaceSearch({ // 构造地点查询类
          pageSize: 4,
          pageIndex: 1,
          city: '010', // 城市
          map: map,
          panel: 'panel'
        })
        // 关键字查询
        placeSearch.search(searchContent, function (status, result) {
          console.log(status, result, '搜索结果')
        })
      })
    },
    // logo上传成功
    logoImgSuccess (response, file, fileList) {
      if (response.code === '0000') {
        document.getElementsByClassName('el-upload-dragger')[0].style = 'display:none'
      }
    },
    // 移除
    logoImgRemove (file, fileList) {
      if (file.response.code === '0000') {
        document.getElementsByClassName('el-upload-dragger')[0].style = 'display:block'
      }
    },
    // 编辑机构
    editInstitute (row, index) {
      this.$router.push({
        path: './instituteEdit'
      })
    }
  },
  mounted () {
    this.uploadImgUrl = this.HOST + '/picture/updateDefault'
  }
}
</script>

<style lang="scss" scoped>
@import "../../../../assets/css/common.scss";
.instituteList{
  padding: 0 25px;
  height: 100%;
  .selectBox{
    margin-top: 14px;
    margin-bottom: 14px;
    .searchInp{
      width: 178px;
    }
  }
  // 表格
  .instituteTable{
    .logoimg{
      width: 62px;
      height: 62px;
    }
    .blue{
      margin-right: 10px;
    }
  }
  // 弹框
  .dialogBox{
    .dialogInnergWidth{
      width: 360px;
    }
    .mapsearchBox{
      position: relative;
    }
    .mapInp{
      width: 100%;
      float: left;
    }
    .searchbtn{
      cursor: pointer;
      position: absolute;
      right: 0;
      background:#f9fafc;
      color:#99a9bf;
      font-size: 18px;
      line-height: 36px;
      text-align: center;
      width: 36px;
      height: 36px;
      border:1px solid #c0ccda;
      background:#f9fafc;
      border-radius:4px 0 0 4px ;
    }
    .mapBox{
      height: 300px;
      width: 100%;
      margin-top:19px;
      position: relative;
      #container{
        height: 300px;
        width: 100%;
      }
      #panel{
        position: absolute;
        right: 0;
        top: 0;
        width: 298px;
        height: 298px;
        overflow-y: auto;
      }
    }
  }
}
</style>
<style media="screen">
.el-table td {
  border-left: 1px solid #dfe6ec;
}
.el-table .cell{
  text-align: left;
  margin: 8px 0;
}
.el-dialog__footer{
  border-top: 1px solid #e0e6ed;;
}
.el-upload-dragger .el-upload__text{
  position: absolute !important;
  bottom: 0 !important;
  width: 100% !important;
  text-align: center !important;
}
.el-upload--picture-card{
  border: none;
}
</style>
