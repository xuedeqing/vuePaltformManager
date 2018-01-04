<template lang="html">
  <div class="store">
    <!-- 类别头部start -->
    <div class="topbar">
      <span class="shortline"></span>
      <span class="title">商品库</span>
      <el-button type="primary" @click="addgood" class="addsort">新增商品</el-button>
      <el-button class='inport'>批量导入</el-button>
      <el-button class="export">批量导出</el-button>
    </div>
    <!-- 类别头部end -->
    <!-- 条件搜索部分start -->
    <div class="searchbox">
      <el-select v-model="professional" placeholder="全部专业度" class="professional">
       <el-option
         v-for="professionalItem in professionalItems"
         :key="professionalItem.value"
         :label="professionalItem.label"
         :value="professionalItem.value"
         >
       </el-option>
     </el-select>
     <el-cascader placeholder="全部分类"
      :options="sortsList"
       :props="defaultProps"
       @change='getSortSelect'
       v-model='sortSelectArr'
       filterable
       change-on-select class="sortsbox"></el-cascader>

     <el-input placeholder="搜商品名称" class="searchinput" v-model='goodname'></el-input>
     <el-button type="primary" icon="search" @click='getGoodList()'>搜索</el-button>
    </div>
    <!-- 条件搜索部分end -->
    <!-- 表格部分start -->
    <div class="tablebox">
      <el-table border :data="storeData" style="width: 100%" >
        <el-table-column prop="id" label="商品编号" width='120'>
        </el-table-column>
        <el-table-column label="主图" width='100'>
          <template scope="scope">
            <div class="picbox">
              <img :src='scope.row.imgPath' alt="">
            </div>
        </template>
        </el-table-column>
        <el-table-column prop="goodsTitle" label="商品标题" width='200' >
        </el-table-column>
        <el-table-column prop="brandName" label="品牌"  width='150'>
        </el-table-column>
        <el-table-column prop="categoryName" label="分类"  width='100'>
        </el-table-column>
        <el-table-column prop="professionName" label="专业度"  width='180'>
        </el-table-column>
        <el-table-column prop="specification" label="规格"  width='200'>
        </el-table-column>
        <el-table-column prop="marketPrice" label="市场售价" width='100' >
        </el-table-column>
        <el-table-column prop="price" label="平台售价"width='100' >
        </el-table-column>
        <el-table-column prop="status" label="是否上架"  width='100'>
        </el-table-column>
        <el-table-column prop="operation" label="操作" >
          <template scope="scope">
          <p class='edit' @click='goodEdit(scope.$index, scope.row)'>编辑</p>
          <p class="stop" @click='handleDelete(scope.$index, scope.row)'>停用</p>
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
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="400">
      </el-pagination>
    </div>
    <!-- 分页部分end -->
    </div>
    <!-- 表格部分end -->
  </div>
</template>

<script>
import qs from 'querystring'
export default {
  data () {
    return {
      curpage: '1',
      // 专业度多选框
      professional: '',
      goodname: '',
      sortId: '',
      // 全部分裂多选
      allsort: '',
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
      sortsList: [],
      // 获取分类数组及三级的ID
      sortSelectArr: [],
      storeData: [],
      defaultProps: {
        children: 'categoryList',
        label: 'name',
        value: 'id'
      },
      currentPage: 1
    }
  },
  methods: {
    // 商品编辑
    goodEdit (index, row) {
      console.log(row)
      window.sessionStorage.setItem('editGoodId', row.id)
      this.$router.push({
        path: './editGood'
      })
    },
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange (val) {
      console.log('当前页:', val)
      this.curpage = val
      this.getGoodList()
    },
    lookCertificate () {
      window.open(window.location.origin + '/#/certificate')
    },
    // 新增商品
    addgood () {
      this.$router.push({
        path: 'addGood'
      })
    },
    // 获取商品所属分类所选项
    getSortSelect (val) {
      this.sortId = val[val.length - 1]
      console.log(this.sortId)
    },
    // 获取商品库列表
    getGoodList () {
      console.log('专业度', this.professional)
      console.log('分类id', this.sortId)
      console.log('商品名', this.goodname)
      var goodListUrl = this.HOST + '/goods/list'
      this.$http.post(goodListUrl, qs.stringify({
        currentPage: this.curpage,
        pageSize: '',
        professionId: this.professional,
        categoryId: this.sortId,
        title: this.goodname
      })).then(res => {
        console.log(res.data)
        this.storeData = res.data.data
        // 转上下架
        for (var i = 0; i < this.storeData.length; i++) {
          if (this.storeData[i].status === 0) {
            this.storeData[i].status = '上架'
          } else {
            this.storeData[i].status = '下架'
          }
        }
        console.log('商品列表', this.storeData)
      })
    }
  },
  mounted () {
    var sortListUrl = this.HOST + '/productCategory/selectAll'
    this.$http(sortListUrl).then(res => {
      this.sortsList = res.data.list
    })
    this.getGoodList()
  }
}
</script>

<style lang="scss">
@import "../../../../assets/css/common.scss";
table {
    text-align: left;
}
.store{
  height: 100%;
  padding: 0 25px;
  .inport,.export{
    margin-top: 22px;
    float: right;
  }
  .inport{
    margin-right: 15px;
  }
  .searchbox{
    .is-opened{
      background: none;
    }
    .professional,.allsort{
      width: 12%;
      margin-right: 7px;
    }
    .searchinput{
      width: 13%;
      margin-right: 7px;
    }
    .sortsbox{
      width: 20%;
      .el-icon-caret-bottom{
        transform: rotate(0deg);
      }
    }
  }
  // 表格部分
  .tablebox{
    .posterbox,.picbox{
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
    .certificate{
      cursor: pointer;
      color:#20a0ff;
    }
    .edit{
      float: left;
      color:#20a0ff;
      margin-right: 12px;
      cursor: pointer;
    }
    .stop{
      cursor: pointer;
      float: left;
      color:#ff4949;
    }
  }
}
</style>
