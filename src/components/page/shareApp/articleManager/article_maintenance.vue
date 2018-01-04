<template lang="html">
  <div class="article_maintenance">
    <div class="topbar">
      <span class="shortline"></span>
      <span class="title">文章维护</span>
      <el-button type="primary" @click="addarticle" class="addsort">添加文章</el-button>
    </div>
    <div class="articlebox">
      <div class="articletop">
        <el-select v-model="curProfessionID" placeholder="全部专业度" class="selectbox" :change='getProfessionID(curProfessionID)'>
          <el-option
            v-for="item in allpresfession"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-input class="searchinput" v-model="searchtitleInp" placeholder="搜文章标题"></el-input>
        <el-button class="searchibtn" type="primary" icon="search" @click='getArticleList()'>搜索</el-button>
      </div>
      <div class="articletablebox">
        <el-table
          :data="articleData"
          style="width: 100%"
          height='520'
          border>
          <el-table-column label="序号" width='80' type='index'></el-table-column>
          <el-table-column prop="poster" label="文章封面" width="180">
            <template scope='scope'>
                <img class="coverimg":src="scope.row.cover" alt="">
            </template>
          </el-table-column>
          <el-table-column prop="title" label="文章标题"  width="280">  </el-table-column>
          <el-table-column  prop="author.nickName"  label="作者"></el-table-column>
          <el-table-column prop="profession" label="专业度"></el-table-column>
          <el-table-column  prop="desc" label="文章描述" width="240"></el-table-column>
          <el-table-column  prop="createdtime" label="发布时间" width="200"></el-table-column>
          <el-table-column  prop="type" label="文章类型" width="100"></el-table-column>
          <el-table-column  prop="status" label="文章状态" width="100">
          </el-table-column>
          <el-table-column  prop="operation" label="操作">
            <template scope='scope'>
              <span class='operationbtn' @click='editarticle(scope.$index, scope.row)'>编辑</span>
              <span class='operationbtn' @click='showOrHideArticle(scope.$index, scope.row)'>{{scope.row.unstatus}}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 分页 -->
    <div class="block">
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
      // 隐藏或者显示
      hideOrShowStatus: false,
      curSize: 10,
      currentPage: 1,
      allpresfession: [{
        value: '905496956341186560',
        label: '儿童'
      }, {
        value: '905496907288801280',
        label: '艺术家'
      }, {
        value: '905497000209412096',
        label: '艺考生'
      }],
      curProfessionID: '',
      searchtitleInp: '',
      // 表格数据
      articleData: [{
        title: '标题',
        author: '张三',
        profession: '艺术家 儿童',
        description: '这是一段描述',
        articletype: '视频'
      }]
    }
  },
  methods: {
    addarticle () {
      this.$router.push({
        path: 'addArticle'
      })
      window.sessionStorage.setItem('curArticleId', null)
    },
    editarticle (index, row) {
      this.$router.push({
        path: 'addArticle'
      })
      window.sessionStorage.setItem('curArticleId', row.id)
      console.log('编辑item', index, row)
      console.log('curArticleId')
    },
    // 控制文章在app端是否显示
    showOrHideArticle (index, row) {
      console.log(row, '隐藏显示状态')
      if (row.status === '隐藏') {
        this.hideOrShowStatus = false
      }
      if (row.status === '显示') {
        this.hideOrShowStatus = true
      }
      var shareHideUrl = this.HOST + '/share/hide'
      this.$http.post(shareHideUrl, qs.stringify({
        id: row.id,
        hide: this.hideOrShowStatus
      })).then(res => {
        if (res.data.code === '0000') {
          this.$message({
            message: '编辑状态成功',
            type: 'success'
          })
          if (row.status === '隐藏') {
            row.status = '显示'
          } else {
            row.status = '隐藏'
          }
          if (row.unstatus === '隐藏') {
            row.unstatus = '显示'
          } else {
            row.unstatus = '隐藏'
          }
        } else {
          this.$message({
            message: '编辑状态失败,请稍后再试',
            type: 'warning'
          })
        }
      })
    },
    getProfessionID (id) {
      this.curProfessionID = id
    },
    handleSizeChange (val) {
      this.curSize = val
      this.getArticleList()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.getArticleList()
    },
    getArticleList () {
      var artclelistUrl = this.HOST + '/share/professionList'
      this.$http.post(artclelistUrl, qs.stringify({
        page: this.currentPage,
        count: this.curSize,
        profession: this.curProfessionID
      })).then(res => {
        this.articleData = res.data.list
        console.log('文章列表', this.articleData)
        for (var i = 0; i < this.articleData.length; i++) {
          if (this.articleData[i].type === 0) {
            this.articleData[i].type = '图片'
          } else {
            this.articleData[i].type = '视频'
          }
          this.articleData[i].createdtime = this.transformTime(this.articleData[i].createdtime)
          // 匹配专业度
          this.articleData[i].profession = this.articleData[i].profession.split(',')
          for (var j = 0; j < this.articleData[i].profession.length; j++) {
            if (this.articleData[i].profession[j] === '905496907288801280') {
              this.articleData[i].profession[j] = '艺术家'
            } else if (this.articleData[i].profession[j] === '905496956341186560') {
              this.articleData[i].profession[j] = '儿童'
            } else if (this.articleData[i].profession[j] === '905497000209412096') {
              this.articleData[i].profession[j] = '艺考生'
            }
          }
          // 是否显示隐藏
          if (this.articleData[i].status === 0) {
            this.articleData[i].status = '显示'
            this.articleData[i].unstatus = '隐藏'
          } else {
            this.articleData[i].status = '隐藏'
            this.articleData[i].unstatus = '显示'
          }
        }
      })
    }
  },
  mounted () {
    this.getArticleList()
  }
}
</script>

<style lang="scss" scoped>
@import "../../../../assets/css/common.scss";
.article_maintenance {
    padding: 0 25px;
    height: 100%;
  .articlebox{
    padding:  15px 0 ;
    .articletop{
      .selectbox, .searchinput, .searchinput{
        float: left;
        margin-right:  15px;
      }
      .searchinput{
        width: 298px;
      }
    }
    .articletablebox{
      margin-top: 15px;
      .coverimg{
        width: 112px;
        height: 62px;
        margin-top: 8px;
      }
      .operationbtn{
        cursor: pointer;
      }
    }
  }
}
</style>
