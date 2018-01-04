<template lang="html">
  <div class="deliveryModel">
    <div class="topbar">
      <span class="shortline"></span>
      <span class="title">运费模板</span>
      <el-button type="primary" class="addsort" @click='addModel()'>新增运费模板</el-button>
    </div>
    <div class="modelListBox">
      <el-input placeholder='模板名称'></el-input>
      <ul class="modelList">
        <li class="modelItem" v-for='item in allModel'>
          <div class="modelHead">
            <span class="name">模版名称：{{item.name}}</span>
            <span class="blue right">删除</span>
            <span class="line right"></span>
            <span class="blue right">修改</span>
            <span class="line right"></span>
            <span class="blue right">复制模板</span>
            <span class="time right">最后编辑时间:{{item.time}}</span>
          </div>
          <div class="modelTableBox">
            <el-table
              :data="item.modelData"
              style="width: 100%">
              <el-table-column
                prop="way"
                label="运送方式"
                width="180">
              </el-table-column>
              <el-table-column
                prop="destination"
                label="运送到"
                >
              </el-table-column>
              <el-table-column
                prop="firstWeight"
                label="首重（kg）"
                width="180">
              </el-table-column>
              <el-table-column
                prop="firstPrice"
                label="运费（元）"
                width="180">
              </el-table-column>
              <el-table-column
                prop="laterWeight"
                label="续重（kg）"
                width="180">
              </el-table-column>
              <el-table-column
                prop="laterPrice"
                label="运费（元）"
                width="180">
              </el-table-column>
            </el-table>
          </div>
        </li>
      </ul>
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
  <p class="tip">备注：复制模版 - 点击之后，把当前模版进行复制，只有编辑时间为复制模版的时间。</p>
  </div>
</template>

<script>
export default {
  data () {
    return {
      currentPage: 1,
      curSize: 10,
      allModel: [{
        name: '默认1kg，10元，偏远地区15',
        time: '2017-12-18 14:56',
        modelData: [{
          way: '快递',
          destination: '默认地区（中国）',
          firstWeight: '2.0',
          firstPrice: '8.00',
          laterWeight: '1.0',
          laterPrice: '3.00'
        }, {
          way: '快递',
          destination: '北京,沈阳,抚顺,上海,山东,湖南,广东,重庆,四川',
          firstWeight: '2.0',
          firstPrice: '8.00',
          laterWeight: '1.0',
          laterPrice: '3.00'
        }]
      }, {
        name: '默认2kg ，15元',
        time: '2017-12-18 14:56',
        modelData: [{
          way: '快递',
          destination: '默认地区（中国）',
          firstWeight: '2.0',
          firstPrice: '8.00',
          laterWeight: '1.0',
          laterPrice: '3.00'
        }, {
          way: '快递',
          destination: '心有多大舞台就有多大',
          firstWeight: '2.0',
          firstPrice: '8.00',
          laterWeight: '1.0',
          laterPrice: '3.00'
        }]
      }]
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
    addModel () {
      this.$router.push({
        path: '/addModel'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../../../assets/css/common.scss";

.deliveryModel{
  padding: 0 25px;
  height: 100%;
  .modelListBox{
    margin-top: 14px;
    // 模板列表
    .modelList{
      max-height: 500px;
      overflow-y: auto;
      margin-top: 14px;
      .modelItem{
        margin-bottom: 10px;
        .modelHead{
          width: 100%;
          height: 45px;
          background:#e5e9f2;
          padding: 0 17px;
          .name{
            font-weight: bold;
            display: inline-block;
            height: 45px;
            line-height: 45px;
            font-size: 13px;
            color:#475669;
          }
          .right{
            font-size: 13px;
            display: inline-block;
            height: 45px;
            line-height: 45px;
            float: right;
            margin-left: 15px;
          }
          .line{
            background:#bfcbd9;
            width: 1px;
            height: 18px;
            margin-top: 13.5px;
            line-height: 45px;
          }
          .time{
            margin-right: 14px;
            color:#1f2d3d;
          }
        }
      }
    }
  }
  .paginationblock{
    float: right;
  }
  // 备注
  .tip{
    margin-top: 55px;
    font-size:14px;
    color:#475669;
  }
}
</style>
<style media="screen" lang='scss'>
.modelTableBox .el-table th{
  background: #fff;
    .cell{
    background: #fff;
  }
}
.modelTableBox .el-table .cell{
  text-align: left;
}
</style>
