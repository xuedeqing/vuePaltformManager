<template lang="html">
  <div class="objcontent">
    <div class="topbar">
      <span class="shortline"></span>
      <span class="title">内容管理-{{title}}</span>
      <el-button  @click='addContent()' class="addcontentbtn">添加内容</el-button>
      <el-button class="addsort" @click='backSortManager()'>返回分类管理</el-button>
    </div>
    <div class="maincontent">
      <div class="selfHeaderBox">
        <el-input v-model='titlekey' placeholder='请输入内容标题关键字' class='titleInp'></el-input>
        <el-checkbox-group v-model="appPlatform" class="platformCheck">
          <el-checkbox label="墨呦艺术"></el-checkbox>
          <el-checkbox label="墨呦直播"></el-checkbox>
          <el-checkbox label="轻量互动"></el-checkbox>
        </el-checkbox-group>
      </div>
      <div class="innerTableBox">
        <el-table
         :data="newQsData"
         border
         style="width: 100%" max-height='400'>
         <el-table-column
           prop="time"
           label="发布时间"
           width="160">
         </el-table-column>
         <el-table-column
           prop="title"
           label="内容标题"
           width="400">
         </el-table-column>
         <el-table-column
           prop="belongto"
           label="所属分类"
           width="110">
         </el-table-column>
         <el-table-column
           prop="operation"
           label="操作">
           <template scope="scope">
           <p class='blue operationbtn' @click='qsDetail(scope.$index, scope.row)'>详情</p>
           <p class="red operationbtn" @click='qsDelete(scope.$index, scope.row)'>删除</p>
         </template>
         </el-table-column>
       </el-table>
      </div>
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
  </div>
</template>

<script>
import Bus from '../../../../assets/js/bus.js'
export default {
  watch: {
    titlekey (val, oldVal) {
      console.log(val, oldVal, '监测值')
      var tempQsArr = []
      this.qsData.filter(function (item) {
        console.log(item.title)
        console.log(item.title.indexOf(val), 'index')
        if (item.title.indexOf(val) !== -1) {
          tempQsArr.push(item)
        }
      })
      // 需要用一个新的数组接收
      this.newQsData = tempQsArr
      console.log('结果数组', this.newQsData)
    }
  },
  data () {
    return {
      title: '',
      titlekey: '',
      appPlatform: [],
      newQsData: [],
      qsData: [{
        time: '2017/09/23  12:30',
        title: '通用优惠券和指定优惠规则优惠券的区别',
        belongto: '营销活动'
      }, {
        time: '2017/09/23  12:30',
        title: '账号异常无法登录怎么办？',
        belongto: '退款退货'
      }, {
        time: '2017/09/23  12:30',
        title: '注册时看不到验证码怎么办？',
        belongto: '营销活动'
      }, {
        time: '2017/09/23  12:30',
        title: '供应商怎么入驻商城？',
        belongto: '退款退货'
      }, {
        time: '2017/09/23  12:30',
        title: '如何找回用户名？',
        belongto: '营销活动'
      }, {
        time: '2017/09/23  12:30',
        title: '如何修改企业邮箱？',
        belongto: '退款退货'
      }],
      // 分页
      currentPage: 1,
      curSize: 10
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
    addContent () {
      this.$router.push({
        path: './addquestioncontent'
      })
    },
    backSortManager () {
      this.$router.push({
        path: './sortmanager'
      })
      Bus.$emit('highIndexName', 'sortmanager')
    },
    qsDetail (index, row) {
      console.log(index, row, '详情')
    },
    qsDelete (index, row) {
      console.log(index, row, '删除')
    }
  },
  mounted () {
    this.title = window.sessionStorage.getItem('objTitle')
    this.newQsData = this.qsData
    Bus.$emit('highIndexName', 'contentmanager')
  }
}
</script>

<style lang="scss" scoped>
@import "../../../../assets/css/common.scss";
.objcontent{
  padding: 0 25px;
  height: 100%;
  .addcontentbtn{
    margin-left: 10px;
  }
  // 主体表格部分
  .maincontent{
    width: 60%;
    margin-top: 30px;
    .selfHeaderBox{
     height: 65px;
     width: 100%;
     border: 1px solid #d1dbe5;
     border-bottom: none;
     .titleInp{
       width: 55%;
       float:left;
       margin: 14px 0 0 16px;
     }
     .platformCheck{
       float: right;
       height: 65px;
       line-height: 65px;
       margin-right: 18px;
     }
    }
    .operationbtn{
      float: left;
      margin-right: 8px;
    }
  }
}
</style>
<style media="screen">
.innerTableBox .el-table .cell{
      text-align: left !important;
}
</style>
