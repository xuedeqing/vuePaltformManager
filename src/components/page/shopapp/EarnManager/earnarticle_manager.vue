<template lang="html">
  <div class="earnarticle_manager">
    <div class="topbar">
      <span class="shortline"></span>
      <span class="title">营销专题文章管理</span>
      <el-button type="primary" class="addarticle" @click="addspecial()">添加文章</el-button>
    </div>
    <!-- 条件搜索部分start -->
    <div class="searchbox">
      <el-select v-model="professional" placeholder="全部专业度" class="selectitem">
       <el-option
         v-for="item in professionalItems"
         :key="item.value"
         :label="item.label"
         :value="item.value"
         >
       </el-option>
     </el-select>
     <el-select v-model="specialname" placeholder="营销专题名称" class="selectitem">
      <el-option
        v-for="item in specialnameItems"
        :key="item.title"
        :label="item.title"
        :value="item.title"
        >
      </el-option>
    </el-select>
     <el-input placeholder="搜文章标题" class="searchinput" v-model='titlename'></el-input>
     <el-button type="primary" icon="search" @click='searchArticleList()'>搜索</el-button>
    </div>
    <!-- 条件搜索部分end -->
    <div class="tablebox">
      <el-table border :data="articleData" style="width: 100%" >
        <el-table-column label="序号" width='70' type='index'></el-table-column>
        <el-table-column prop="professionName" label="专业度" width='90' >
        </el-table-column>
        <el-table-column prop="subjectName" label="所属专题名称"  width='240'>
        </el-table-column>
        <el-table-column prop="poster" label="文章封面"  width='200'>
          <template scope="scope">
            <div class="picbox">
              <img :src="scope.row.articleImg" alt="">
            </div>
        </template>
        </el-table-column>
        <el-table-column prop="articleTitle" label="营销专题文章标题"  width='260'>
        </el-table-column>
        <el-table-column prop="about" label="关联商品"  width='100'>
          <template scope="scope">
          <span class="blue">{{scope.row.sum}}</span>
        </template>
        </el-table-column>
        <el-table-column prop="ifFirst" label="是否为专题首推"  width='100'>
          <template scope="scope">
          <span>{{scope.row.first}}</span>
        </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间"  width='200'>
        </el-table-column>
        <el-table-column prop="operation" label="操作" >
          <template scope="scope">
          <p class='blue operationbtn' @click='specialEdit(scope.$index, scope.row)'>编辑</p>
          <p class="red operationbtn" @click='specialDelete(scope.$index, scope.row)'>删除</p>
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
      currentPage: 1,
      curSize: 10,
      professional: '',
      specialname: '',
      titlename: '',
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
      specialnameItems: [{
        value: '1',
        label: '营销专题名称1'
      }, {
        value: '2',
        label: '营销专题名称2'
      }],
      articleData: [{
        profession: '儿童',
        name: '墨 U 编 辑 精 选',
        title: '如何绘画治愈小清新插画，让人一看难忘',
        about: 8,
        sort: 1,
        createdtime: '2017-10-19 17:55:20'
      }]
    }
  },
  methods: {
    addspecial () {
      window.sessionStorage.setItem('curArticleID', null)
      this.$router.push({
        path: './addessay'
      })
    },
    handleSizeChange (val) {
      this.curSize = val
      this.getSpecialArticleList()
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.getSpecialArticleList()
      console.log(`当前页: ${val}`)
    },
    // 表格部分
    getSpecialArticleList () {
      var specialArticleListUrl = this.HOST + '/subject/article/list'
      this.$http.post(specialArticleListUrl, qs.stringify({
        curentPage: this.currentPage,
        pageSize: '',
        professionId: '',
        subjectTitle: '',
        articleTitle: ''
      })).then(res => {
        if (res.data.code === '0000') {
          this.articleData = res.data.data
        }
        console.log('专题文章列表', res.data.data)
      })
    },
    // 下拉框
    getSpecialList () {
      var specialListUrl = this.HOST + '/subject/findAllSubject'
      this.$http(specialListUrl).then(res => {
        if (res.data.code === '0000') {
          this.specialnameItems = res.data.data
        }
        console.log('专题列表', res.data.data)
      })
    },
    // 搜索
    searchArticleList () {
      console.log(this.professional, this.specialname, this.titlename)
      var searchArticleUrl = this.HOST + '/subject/article/list'
      this.$http.post(searchArticleUrl, qs.stringify({
        curentPage: this.currentPage,
        pageSize: '',
        professionId: this.professional,
        subjectTitle: this.specialname,
        articleTitle: this.titlename
      })).then(res => {
        if (res.data.code === '0000') {
          console.log(res.data.data)
          this.articleData = res.data.data
        } else {
          this.$message({
            message: '网络忙，请稍后再试',
            type: 'warning'
          })
        }
      })
    },
    // 编辑
    specialEdit (index, row) {
      console.log(index, row)
      window.sessionStorage.setItem('curArticleID', row.id)
      this.$router.push({
        path: '/addEssay'
      })
    },
    specialDelete (index, row) {
      this.$confirm('确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var articleDeteleUrl = this.HOST + '/subject/articleDelete'
        this.$http.post(articleDeteleUrl, qs.stringify({
          id: row.id
        })).then(res => {
          if (res.data.code === '0000') {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getSpecialArticleList()
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
    }
  },
  mounted () {
    this.getSpecialArticleList()
    this.getSpecialList()
  }
}
</script>

<style lang="scss" scoped>
@import "../../../../assets/css/common.scss";
.earnarticle_manager{
  height: 100%;
  padding: 0 25px;
  .addarticle{
    float: right;
    margin-top: 22px;
  }
  .searchbox{
    .selectitem{
      margin-right: 5px;
    }
    .searchinput{
      width: 19%;
      margin-right: 7px;
    }
  }
  .tablebox{
    .operationbtn{
      float: left;
      margin-left: 10px;
      cursor: pointer;
    }
    .picbox{
      img{
        width: 100%;
        height: 77px;
        margin-top: 6px;
        background: #e0e6ed;
        display: inline-block;
      }
    }
  }
}
</style>
