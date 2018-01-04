<template lang="html">
  <div class="addModel">
    <div class="topbar">
      <span class="shortline"></span>
      <span class="title">运费模板 - 新增模板</span>
      <el-button type="primary" class="addsort" @click='backModelList()'>返回</el-button>
    </div>
    <div class="addModelBox">
      <p class='title'>填写运费模板信息</p>
      <div class="formBox">
        <el-form ref="formModel" :model="formModel" label-width="80px" :rules='modelrules'>
          <el-form-item label="模板名称" prop='name'>
           <el-input v-model="formModel.name" placeholder='请填写运费模版的名称' class="nameInp"></el-input>
         </el-form-item>
         <el-form-item label="计价方式" prop='pricetype'>
           <el-radio class="radio" v-model="formModel.pricetype" label="asWeight">按重量</el-radio>
         </el-form-item>
         <el-form-item label="运送方式" prop="deliverytype">
           <el-checkbox-group v-model="formModel.deliverytype">
             <el-checkbox label="快递" name="type"></el-checkbox>
           </el-checkbox-group>
         </el-form-item>
        </el-form>
        <div class="setDelivery">
          <div class="topSet">
            <span class="topSpan">默认运费</span>
            <el-input class="setModelInp" v-model='defaultWeight' @blur='defaultWeightBlur'></el-input>
            <span class="topSpan">kg内，</span>
            <el-input class="setModelInp" v-model='defaultPrice' @blur='defaultPriceBlur'></el-input><span class="topSpan">元，每增加</span>
            <el-input class="setModelInp" v-model='addWeight' @blur='addWeightBlur' ></el-input><span class="topSpan">kg，运费增加</span>
            <el-input class="setModelInp" v-model='addPrice' @blur='addPriceBlur' @focus='addPriceFocus'></el-input><span class="topSpan">元</span>
            <div class="tag" v-show='tipStatus'>
              应输入0.00至999.99的数字,续费须小于首费,小数保留两位
            </div>
            <el-button  @click='setForSpecial()' class='setSpecial'>为指定地区城市设置运费</el-button>
          </div>
          <div class="cityModelTableBox" v-show='cityTableStatus'>
            <el-table
              :data="cityTableData"
              style="width: 100%" max-height='300'>
              <el-table-column
                 prop="destination"
                 label="运送到"
              >
               </el-table-column>
               <el-table-column
                  prop="firstWeight"
                  label="首重量（kg）"
                  width="140">
                  <template scope='scope'>
                  <el-input v-model='scope.row.innerFirstWeight' @blur='innerFirstWeightBlur(scope.row)'></el-input>
                  </template>
                </el-table-column>
                <el-table-column
                   prop="firstPrice"
                   label="首费（元）"
                   width="140">
                   <template scope='scope'>
                   <el-input v-model='scope.row.innerFirstPrice' @blur='innerFirstPriceBlur(scope.row)'></el-input>
                   </template>
                 </el-table-column>
                 <el-table-column
                    prop="laterWeight"
                    label="续重量（kg）"
                    width="140">
                    <template scope='scope'>
                    <el-input v-model='scope.row.innerLaterWeight' @blur='innerLaterWeightBlur(scope.row)'></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column
                     prop="laterPrice"
                     label="续费（元）"
                     width="140">
                     <template scope='scope'>
                     <el-input v-model='scope.row.innerLaterPrice' @blur='innerLaterPriceBlur(scope.row)'></el-input>
                     </template>
                   </el-table-column>
                  <el-table-column
                     prop="operation"
                     label="操作"
                     width="150">
                     <template scope='scope'>
                       <p class='blue fl' @click='editArea(scope.row, scope.$index)'>编辑地区</p>
                       <p class='red fl'>删除</p>
                     </template>
                   </el-table-column>
            </el-table>
          </div>
          <div class="saveBox fr">
            <el-button>取消</el-button>
            <el-button type='primary' @click='saveAndBack()'>保存并返回</el-button>
          </div>
         <!-- 选择区域弹框 -->
         <el-dialog
         title="选择区域"
           :visible.sync="chooseCityDialog"
           size='tiny'
           >
           <el-input
             placeholder="请输入需要筛选的关键字"
             v-model="cityFilterText" class='searchCityKey'>
           </el-input>
           <el-tree
           :data="citydata"
           show-checkbox
           node-key="id"
           :filter-node-method="cityFilterNode"
           :props="cityDefaultProps"
           ref='citydataRef'
           class='cityTreeClass' @check-change='getCheckedKeys'>
           </el-tree>
           <div class="cityBtnBox clrfix">
             <el-button class="savebtn fr" type='primary' @click='saveCity()'>保存</el-button>
             <el-button class="savebtn fr" @click='cancleSaveCity()'>取消</el-button>
           </div>
         </el-dialog>
        </div>
      </div>
    </div>

  </div>
  </div>
</template>

<script>
export default {
  watch: {
    cityFilterText (val) {
      this.$refs.citydataRef.filter(val)
    }
  },
  data () {
    return {
      editCityIndex: '',
      targetCityArr: [],
      targetCityId: [],
      targetCityString: '',
      cityFilterText: '',
      chooseCityDialog: false,
      formModel: {
        name: '',
        pricetype: 'asWeight',
        deliverytype: []
      },
      modelrules: {
        name: {required: true, message: '请填写运费模版的名称', trigger: 'blur'},
        pricetype: {required: true, message: '请输入活动名称', trigger: 'blur'},
        deliverytype: {type: 'array', required: true, message: '请选择运送方式', trigger: 'blur'}
      },
      // 默认模板绑定input框
      defaultWeight: '',
      defaultPrice: '',
      addWeight: '',
      addPrice: '',
      // 提示框是否显示
      tipStatus: false,
      // 地区城市运费模板是够显示
      cityTableStatus: false,
      cityTableData: [],
      citydata: [{
        cityName: '华东',
        id: '100',
        children: [{
          cityName: '上海',
          id: '100100'
        }, {
          cityName: '江苏省',
          id: '100101',
          children: [{
            cityName: '南京市',
            id: '100101100'
          }, {
            cityName: '无锡市',
            id: '100101101'
          }, {
            cityName: '徐州市',
            id: '100101102'
          }]
        }, {
          cityName: '浙江省',
          id: '100102',
          children: [{
            cityName: '杭州市',
            id: '100102100'
          }, {
            cityName: '宁波市',
            id: '100102101'
          }, {
            cityName: '温州市',
            id: '100102102'
          }, {
            cityName: '绍兴市',
            id: '100102103'
          }]
        }]
      }, {
        cityName: '东北',
        id: '101',
        children: [{
          cityName: '黑龙江省',
          id: '101100',
          children: [{
            cityName: '哈尔滨市',
            id: '101100100'
          }]
        }, {
          cityName: '吉林省',
          id: '101101',
          children: [{
            cityName: '长春市',
            id: '101101100'
          }]
        }, {
          cityName: '辽宁省',
          id: '101102',
          children: [{
            cityName: '哈哈市',
            id: '101102100'
          }]
        }]
      }, {
        cityName: '华北',
        id: '102',
        children: [{
          cityName: '北京',
          id: '102100'
        }, {
          cityName: '天津',
          id: '102101'
        }, {
          cityName: '河北省',
          id: '102102',
          children: [{
            cityName: '石家庄市',
            id: '102102100'
          }, {
            cityName: '唐山市',
            id: '102102101'
          }, {
            cityName: '秦皇岛市',
            id: '102102102'
          }, {
            cityName: '邯郸市',
            id: '102102103'
          }]
        }]
      }, {
        cityName: '华中',
        id: '103',
        children: [{
          cityName: '湖南省',
          id: '103100',
          children: [{
            cityName: '长沙市',
            id: '103100100'
          }, {
            cityName: '岳阳市',
            id: '103100101'
          }, {
            cityName: '怀化市',
            id: '103100102'
          }]
        }, {
          cityName: '湖北省',
          id: '103101',
          children: [{
            cityName: '武汉市',
            id: '103101100'
          }, {
            cityName: '咸宁市',
            id: '103101101'
          }, {
            cityName: '宜昌市',
            id: '103101102'
          }]
        }, {
          cityName: '河南省',
          id: '103102',
          children: [{
            cityName: '郑州市',
            id: '103102100'
          }, {
            cityName: '巩义市',
            id: '103102101'
          }]
        }]
      }, {
        cityName: '华南',
        id: '104',
        children: [{
          cityName: '广东省',
          id: '104100',
          children: [{
            cityName: '广州市',
            id: '104100100'
          }, {
            cityName: '深圳市',
            id: '104100101'
          }, {
            cityName: '潮州市',
            id: '104100102'
          }]
        }, {
          cityName: '广西省',
          id: '104101',
          children: [{
            cityName: '南宁市',
            id: '104101100'
          }]
        }]
      }],
      cityDefaultProps: {
        children: 'children',
        label: 'cityName'
      },
      // 所选节点
      selectCityArr: [],
      // 传给后台的json
      targetJson: []
    }
  },
  methods: {
    backModelList () {
      this.$router.push({
        path: './deliverymodel'
      })
    },
    // 为指定地区设置模板
    setForSpecial () {
      this.cityTableStatus = true
      this.cityTableData.push({
        destination: '未添加地区',
        targetInfo: [],
        innerFirstWeight: '',
        innerFirstPrice: '',
        innerLaterWeight: '',
        innerLaterPrice: ''
      })
      console.log('添加地区', this.cityTableData)
    },
    // 补0
    defaultWeightBlur () {
      if (this.defaultWeight.indexOf('.') === -1 && this.defaultWeight !== '') {
        this.defaultWeight = this.defaultWeight.toString() + '.0'
      }
    },
    defaultPriceBlur () {
      if (this.defaultPrice.indexOf('.') === -1 && this.defaultPrice !== '') {
        this.defaultPrice = this.defaultPrice.toString() + '.00'
      } else if (this.defaultPrice.split('.')[1].length === 1) {
        this.defaultPrice = this.defaultPrice.toString() + '0'
      }
    },
    addWeightBlur () {
      if (this.addWeight.indexOf('.') === -1 && this.addWeight !== '') {
        this.addWeight = this.addWeight.toString() + '.0'
      }
    },
    addPriceFocus () {
      this.tipStatus = false
      this.addPrice = ''
    },
    addPriceBlur () {
      if (this.addPrice - this.defaultPrice > 0) {
        this.tipStatus = true
      } else if (this.addPrice.indexOf('.') === -1) {
        this.addPrice = this.addPrice.toString() + '.00'
      }
    },
    // 表格内input失去焦点
    innerFirstWeightBlur (row) {
      if (row.innerFirstWeight.indexOf('.') === -1 && row.innerFirstWeight !== '') {
        row.innerFirstWeight = row.innerFirstWeight.toString() + '.0'
      }
    },
    innerFirstPriceBlur (row) {
      if (row.innerFirstPrice.indexOf('.') === -1 && row.innerFirstPrice !== '') {
        row.innerFirstPrice = row.innerFirstPrice.toString() + '.00'
      } else if (row.innerFirstPrice.split('.')[1].length === 1) {
        row.innerFirstPrice = row.innerFirstPrice.toString() + '0'
      }
    },
    innerLaterWeightBlur (row) {
      if (row.innerLaterWeight.indexOf('.') === -1 && row.innerLaterWeight !== '') {
        row.innerLaterWeight = row.innerLaterWeight.toString() + '.0'
      }
    },
    innerLaterPriceBlur (row) {
      if (row.innerLaterPrice - row.innerFirstPrice > 0) {
        this.tipStatus = true
      } else if (row.innerLaterPrice.indexOf('.') === -1) {
        row.innerLaterPrice = row.innerLaterPrice.toString() + '.00'
      }
    },
    // 编辑地区
    editArea (row, index) {
      this.chooseCityDialog = true
      this.editCityIndex = index
    },
    // 城市筛选
    cityFilterNode (value, data) {
      if (!value) return true
      return data.cityName.indexOf(value) !== -1
    },
    getCheckedKeys () {
      this.selectCityArr = this.$refs.citydataRef.getCheckedNodes()
      var targetArr = []
      for (var i = 0; i < this.selectCityArr.length; i++) {
        var item = this.selectCityArr[i]
        if (item['children'] && item['id'].length === 3) {
          var innerArr = []
          var itemArr = item['children']
          for (var j = 0; j < itemArr.length; j++) {
            var sub = itemArr[j]
            if (sub['children']) {
              i += sub['children'].length
            }
            sub = {'id': sub['id'], 'cityName': sub['cityName']}
            innerArr.push(sub)
          }
          targetArr = targetArr.concat(innerArr)
          i += item['children'].length + 1
          continue
        } else if (item['children'] && item['id'].length === 6) {
          i += item['children'].length
        }
        item = {'id': item['id'], 'cityName': item['cityName']}
        targetArr.push(item)
      }
      console.log('未处理的数据', this.selectCityArr)
      console.log('处理的数据', targetArr)
      // 处理的数据只拿汉字
      this.targetCityArr = []
      this.targetCityId = []
      for (let k = 0; k < targetArr.length; k++) {
        this.targetCityArr.push(targetArr[k].cityName)
        this.targetCityId.push(targetArr[k].id)
      }
      this.targetCityString = this.targetCityArr.join('、')
      console.log('渲染加顿号', this.targetCityString)
    },
    saveCity () {
      console.log('索引', this.editCityIndex)
      this.cityTableData[this.editCityIndex]['destination'] = this.targetCityString
      this.cityTableData[this.editCityIndex]['targetInfo'] = this.targetCityId
      this.chooseCityDialog = false
    },
    // 新增模板掉
    saveAndBack () {
      console.log('查看入参', '模板名称', this.formModel.name)
      console.log('计价方式和运送方式先传0写死')
      console.log('首重', this.defaultWeight)
      console.log('首费', this.defaultPrice)
      console.log('续重', this.addWeight)
      console.log('续费', this.addPrice)
      // 处理匹配传给后台的json
      this.targetJson = []
      console.log('为处理的数组', this.cityTableData)
      for (let i = 0; i < this.cityTableData.length; i++) {
        this.targetJson.push({
          'areaIdList': this.cityTableData[i].targetInfo,
          'firstWeight': this.cityTableData[i].innerFirstWeight,
          'firstCost': this.cityTableData[i].innerFirstPrice,
          'continuousWeight': this.cityTableData[i].innerLaterWeight,
          'renewals': this.cityTableData[i].innerLaterWeight
        })
      }
      console.log('json', this.targetJson)
      // var addDeliveryModelUrl = this.HOST + '/shippingCosts/insert'
      // this.$http.post(addDeliveryModelUrl, qs.stringify({
      //   name: this.formModel.name,
      //   shippingMethods: 0,
      //   valuationMethods: 0,
      //   firstWeight: ,
      //   firstCost: ,
      //   continuousWeight: ,
      //   renewals: '',
      //   areaShippingCostJson: [ ]
      // }))
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../../../assets/css/common.scss";

.addModel{
  padding: 0 25px;
  height: 100%;
  .addModelBox{
    .title{
      height:66px;
      line-height: 66px;
      font-size:16px;
      color:#8492a6;
    }
    // 表单部分
    .formBox{
      .nameInp {
        width: 30%;
      }
    }
    // 设置运费
    .setDelivery{
      margin-top: 24px;
      .topSet{
        padding: 0 20px;
        background:#e5e9f2;
        border:1px solid #e0e6ed;
        width:92%;
        margin-left: 80px;
        height:68px;
        position: relative;
        .setModelInp{
          width: 86px;
          margin:  0 5px;
        }
        .topSpan{
          display: inline-block;
          line-height: 68px;
          height: 68px;
          font-size:14px;
          color:#1f2d3d;
        }
        // 气泡
        .tag{
            position: absolute;
            right: 46%;
            top: -75px;
            padding: 9px;
            width:178px;
            height:80px;
            border:1px solid #d3dce6;
            background-color:#FFF;
            box-shadow:0 2px 4px 0 rgba(0,0,0,0.12), 0 0 6px 0 rgba(0,0,0,0.04);
            border-radius:2px;
        }
        .tag:before,.tag:after{
          content: "";
          display: block;
          border-width: 7px;
          position: absolute;
          bottom: -14px;
          left: 80px;
          border-style: solid dashed dashed;
          border-color: #fff transparent transparent;
          font-size: 0;
          line-height: 0
        }
        .tag:after{
            bottom:-33px;
            border-color:#FFF transparent transparent;
        }
      }
      // 为城市设置模板表格
      .cityModelTableBox{
        width:92%;
        margin-left: 80px;
        margin-top: 5px;
        .blue{
          margin-right: 15px;
        }
      }
      .setSpecial{
        float: right;
        margin-top: 14px;
      }
      // 选择城市弹框
      .searchCityKey{
        margin-bottom: 10px;
      }
      .cityBtnBox{
        margin: 10px 0;
        .savebtn{
          margin-left: 10px;
        }
      }
      // 掉接口保存按钮
      .saveBox{
        margin-right: 35px;
        margin-top: 15px;
      }
    }
  }
}
</style>
<style media="screen" lang="scss">
.cityModelTableBox .el-table{
  border-bottom:  none;
}
.cityModelTableBox .el-table .cell{
  text-align: left;
  margin: 8px 0;
}
.cityModelTableBox .el-table td{
  border-right: 1px solid #dfe6ec;
}
</style>
