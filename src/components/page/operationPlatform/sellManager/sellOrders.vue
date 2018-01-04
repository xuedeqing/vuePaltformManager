<template lang="html">
  <div class="sellorders">
    <div class="topbar">
      <span class="shortline"></span>
      <span class="title">销售订单</span>
    </div>
    <div class="settingbox">
      <div class="settingtop clrfix">
        <div class="choosestatus">
          <!-- 订单状态选择框 -->
          <el-select v-model="chooseOrderItem" placeholder="订单状态">
            <el-option
            v-for="item in orderOptions"
            :key="item.value"
            :label="item.name"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div class="ordersearchbox">
        <el-input v-model="ordernum" placeholder="搜订单编号" class="searchinp"></el-input>
        <el-button type="primary" icon="search" @click='getOrderList()'>搜索</el-button>
      </div>
    </div>
    <!-- 订单表格部分 -->
    <div class="ordedatabox">
      <el-table height='520'
         :data="ordertableData"
         border
         style="width: 100%">
         <el-table-column
           prop="tradeId"
           label="订单号"
           width="180">
         </el-table-column>
         <el-table-column
           prop="createdtime"
           label="成交时间"
           width="180">
         </el-table-column>
         <el-table-column
           prop="ordergood"
           label="订单商品">
           <template scope='scope'>
             共{{scope.row.goodsCount}}款, {{scope.row.goodsTypeCount}}件
           </template>
         </el-table-column>
         <el-table-column
           prop="userName"
           label="买家">
         </el-table-column>
         <el-table-column
           prop="status"
           label="交易状态">
         </el-table-column>
         <el-table-column
           prop="transport"
           label="物流信息">
         </el-table-column>
         <el-table-column
           prop="actualPrice"
           label="应收款">
         </el-table-column>
         <el-table-column
           prop="operation"
           label="操作">
           <template scope="scope">
             <span class="bluebtn">快捷发货</span>
             <span class="bluebtn">详情</span>
           </template>
         </el-table-column>
       </el-table>
    </div>
    <!-- 分页 -->
        <div class="paginationbox">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="curPage"
          :page-sizes="[10, 20]"
          :page-size="curCount"
          layout="total, sizes, prev, pager, next, jumper"
          :total="400">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import qs from 'querystring'
export default {
  data () {
    return {
      orderOptions: [{
        name: '待付款',
        value: 0
      }, {
        name: '待发货',
        value: 1
      }, {
        name: '待收货',
        value: 2
      }, {
        name: '待评价',
        value: 3
      }, {
        name: '已完成',
        value: 4
      }, {
        name: '交易关闭',
        value: 5
      }, {
        name: '退货中',
        value: 6
      }, {
        name: '退款中',
        value: 7
      }, {
        name: '退款成功',
        value: 8
      }],
      chooseOrderItem: '',
      chooseGoodItem: '',
      // 搜订单编号
      ordernum: '',
      curCount: 10,
      curPage: 1,
      // 表格数据
      ordertableData: [{
        number: 'GDa103219',
        time: '2014-12-08 16:07:06',
        ordergood: '共 3 款，12件',
        buyer: 'AKURA樱花',
        tradestatus: '待付款',
        goodinfo: '待发货',
        actualmoney: '¥28.00（含快递 ¥8.00)'
      }]
    }
  },
  methods: {
    handleSizeChange (val) {
      this.curCount = val
      this.getOrderList()
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange (val) {
      this.curPage = val
      this.getOrderList()
      console.log(`当前页: ${val}`)
    },
    getOrderList () {
      console.log('交易状态', this.chooseOrderItem)
      var orderListUrl = this.HOST + '/trade/list'
      this.$http.post(orderListUrl, qs.stringify({
        status: this.chooseOrderItem,
        tradeId: this.ordernum,
        count: this.curCount,
        page: this.curPage
      })).then(res => {
        console.log(res.data.list)
        this.ordertableData = res.data.list
        for (var i = 0; i < this.ordertableData.length; i++) {
          if (this.ordertableData[i].status < 2) {
            this.ordertableData[i].transport = '待发货'
          } else if (this.ordertableData[i].status >= 2 && this.ordertableData[i].status < 5) {
            this.ordertableData[i].transport = '已发货'
          } else if (this.ordertableData[i].status === 5) {
            this.ordertableData[i].transport = '交易关闭'
          } else if (this.ordertableData[i].status === 6) {
            this.ordertableData[i].transport = '退货中'
          } else if (this.ordertableData[i].status === 7) {
            this.ordertableData[i].transport = '退货中'
          } else if (this.ordertableData[i].status === 8) {
            this.ordertableData[i].transport = '退款成功'
          }
          switch (this.ordertableData[i].status) {
            case 0:
              this.ordertableData[i].status = '待付款'
              break
            case 1:
              this.ordertableData[i].status = '待发货'
              break
            case 2:
              this.ordertableData[i].status = '待收货'
              break
            case 3:
              this.ordertableData[i].status = '待评价'
              break
            case 4:
              this.ordertableData[i].status = '已完成'
              break
            case 5:
              this.ordertableData[i].status = '交易关闭'
              break
            case 6:
              this.ordertableData[i].status = '退货中'
              break
            case 7:
              this.ordertableData[i].status = '退款中'
              break
            case 8:
              this.ordertableData[i].status = '退款成功'
              break
          }
        }
      })
    }
  },
  mounted () {
    this.getOrderList()
  }
}
</script>

<style lang="scss" scoped>
@import "../../../../assets/css/common.scss";
.sellorders{
  padding: 0 25px;
  height: 100%;
  .settingtop{
    padding: 15px 0;
    .choosestatus{
      width: 148px;
      margin-right: 7px;
      float: left;
    }
    .ordersearchbox{
      float: left;
      width: 300px;
      .searchinp{
        width: 178px;
      }
    }
  }
  // 表格样式
  .bluebtn{
    color:#20a0ff;
  }
  // 分页
  .paginationbox{
    margin-top: 20px;
    float: right;
  }
}
</style>
