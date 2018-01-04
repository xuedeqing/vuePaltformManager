<template lang="html">
  <div class="addClient">
    <div class="topbar">
      <span class="shortline"></span>
      <span class="title">商家管理</span>
      <el-button class="addsort" @click='backClient()'>返回商家管理</el-button>
    </div>
    <div class="clientInfoBox">
      <p class="title">商家详情</p>
      <el-tabs v-model="activeName" type="card" @tab-click="tabChange">
       <el-tab-pane label="商家信息" name="clientInfo">
         <div class="infoleft">
           <div class="infoBlock">
             <p class="infoTitle">企业信息</p>
             <el-form label-width="100px" :model="inforuleForm" :rules="inforules" ref="inforuleForm" class="infoForm">
                <el-form-item label="商家简称" prop="brief">
                  <el-input v-model='inforuleForm.brief'></el-input>
                </el-form-item>
                <el-form-item label="公司名称" prop="name">
                  <el-input v-model='inforuleForm.name'></el-input>
                </el-form-item>
                <el-form-item label="通讯地址" prop="address">
                  <el-input v-model='inforuleForm.address'></el-input>
                </el-form-item>
              </el-form>
           </div>
           <div class="infoBlock">
             <p class="infoTitle">账户信息</p>
             <el-form label-width="100px" :model="inforuleForm" :rules="inforules" ref="inforuleForm" class="infoForm">
                <el-form-item label="登录账号" prop="account">
                  <el-input v-model='inforuleForm.account'></el-input>
                </el-form-item>
                <el-form-item label="登录密码" prop="password">
                  <el-input v-model='clientPassword' type='password' ></el-input>
                </el-form-item>
                <el-form-item label="签约时间" prop="cooperatetime">
                   <el-date-picker type="date" placeholder="请选择签约时间" v-model="inforuleForm.cooperatetime" style="width: 100%;"></el-date-picker>
                </el-form-item>
                <el-form-item label="到期时间" prop="deadline">
                  <el-date-picker type="date" placeholder="请选择到期时间" v-model="inforuleForm.deadline" style="width: 100%;"></el-date-picker>
                </el-form-item>
                <el-form-item label="角色权限" prop="power">
                  <el-select  v-model="inforuleForm.power" placeholder="请选择角色权限" style="width: 100%;">
                   <el-option v-for='item in powerList' :label="item.label" :value="item.value"></el-option>
                 </el-select>
                </el-form-item>
                <el-form-item label="账户状态" prop="status">
                  <el-switch
                    v-model="inforuleForm.status"
                    on-text=""
                    off-text="">
                  </el-switch>
                  <span v-if='inforuleForm.status'>启用</span>
                  <span v-else='inforuleForm.status'>禁用</span>
                </el-form-item>
              </el-form>
              <el-button class="savebtn" type='primary' @click='saveClientInfo()'>保存</el-button>
              <el-button class="savebtn">取消</el-button>
           </div>
         </div>
         <div class="inforight">
           <div class="infoBlock">
             <p class="infoTitle">负责人信息</p>
             <el-form label-width="100px" :model="inforuleForm" :rules="inforules" ref="inforuleForm" class="infoForm">
               <el-form-item label="负责人姓名" prop="chargename">
                 <el-input v-model="inforuleForm.chargename"></el-input>
               </el-form-item>
               <el-form-item label="手机号码" prop="tel">
                 <el-input v-model="inforuleForm.tel" ></el-input>
               </el-form-item>
             </el-form>
           </div>
         </div>
       </el-tab-pane>
       <el-tab-pane label="运费模板" name="transportModel">
         <div class="transportBox">
           <el-form ref="transportform" :model="transportform" label-width="80px">
             <el-form-item label="应用模板">
               <el-select  v-model="applicationModel" placeholder="数据来源于平台管理后台制定的模版" style="width: 100%;" @change='modelChange' @visible-change='applicationModelGetOldVal'>
                <el-option v-for='item in powerList' :label="item.label" :value="item.value"></el-option>
              </el-select>
             </el-form-item>
             <el-form-item label="包邮条件">
               <el-switch
                 v-model="deliveryOnoff"
                 on-text=""
                 off-text="" @change='deliveryChange'>
               </el-switch>
               <span v-if='transportform.freeDelivery'>启用</span>
               <span v-else='transportform.freeDelivery'>停用</span>
             </el-form-item>
           </el-form>
         </div>
         <span class="blue lookmodel">查看模板</span>
         <el-table
         :data="deliveryData"
         style="width: 100%" class='deliveryTable' max-height='380'>
         <el-table-column
         prop="city"
         label="选择地区"
         width="480">
       </el-table-column>
       <el-table-column
       prop="way"
       label="选择运送方式"
       width="120">
       <template scope='scope'>
         <el-select v-model="deliveryWaySelect">
           <el-option
              label="快递"
              value="express">
            </el-option>
         </el-select>
       </template>
     </el-table-column>
     <el-table-column
     prop="setCondition"
     label="设置包邮条件">
     <template scope='scope'>
       <div class="" @click='getConditionStatus(scope.row)' >
         <el-select v-model="scope.row.setDeliveryCondition" class='conditonSelect' @change='changeDeliveryCondition()' >
           <el-option label="重量" value="weight">
           </el-option>
           <el-option label="金额" value="price">
           </el-option>
           <el-option label="重量 + 金额" value="weightAndPrice">
           </el-option>
         </el-select>
         <div class="conditionBox">
           <div class="conditionItem" v-show='scope.row.weightStatus'>
             在<el-input class="conditionInput"  ></el-input>kg内包邮
           </div>
           <div class="conditionItem" v-show='scope.row.priceStatus'>
             满<el-input class="conditionInput" ></el-input>元包邮
           </div>
           <div class="conditionItem" v-show='scope.row.weightAndPriceStatus'>
             在<el-input class="conditionInput" ></el-input>kg内,<el-input class="conditionInput"></el-input>元以上包邮
           </div>
         </div>
       </div>
     </template>
   </el-table-column>
       <el-table-column
       prop="operation"
       label="操作"
       width="150">
       <template scope='scope'>
         <p class='blue' @click='editArea(scope.row, scope.$index)'>编辑地区</p>
         <p class='red'>删除</p>
       </template>
     </el-table-column>
    </el-table>
    <el-button  @click='adddModelItem()' class="mt15">+添加包邮规则</el-button>
      <el-button class="savebtn mt15" type='primary' @click='saveTransportModel()'>保存</el-button>
      <el-button class="savebtn mt15">取消</el-button>
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
          <el-button class="savebtn" type='primary' @click='saveCity()'>保存</el-button>
          <el-button class="savebtn" @click='cancleSaveCity()'>取消</el-button>
        </div>
      </el-dialog>
       </el-tab-pane>
       <el-tab-pane label="旗下商品" name="subGood">
         <div class="subgoodBox">
           <div class="subgoodTop">
             <el-input placeholder="请输入商品名称" class="subgoodinp" v-model='choosenGoodName'>
             </el-input>
             <div class="tip">共 {{curClientBrandNum}} 品牌 {{curClientGoodNum}} 件商品</div>
             <el-button type="primary" class="addgood" @click='addGood'>添加商品</el-button>
           </div>
           <div class="professionBox">
             <el-checkbox-group v-model="checkList" @change='allGoodGetPressionArr'>
               <el-checkbox label="905496956341186560" >儿童</el-checkbox>
               <el-checkbox label="905496907288801280" >艺术家</el-checkbox>
               <el-checkbox label="905497000209412096" >艺考生</el-checkbox>
              </el-checkbox-group>
           </div>
           <ul class="goodListBox">
             <li class="eachList" v-for='item in newChoosenGoodList'>
              <p class="sortTitle" >{{item.allsortName}}
             <span class="numColor">{{item.num}}</span></p>
              <ul class="subList">
                <li class="subItem" v-for='subitem in item.subsortList'>{{subitem.goodName}}</li>
              </ul>
             </li>
           </ul>
         </div>
         <div class="addGoodDialogBox">
           <el-dialog title="添加商品" :visible.sync="addGoodDialogVisible" >
             <div class="dialogLeft">
               <div class="left_left">
                 <div class="searchbox">
                   <el-input class="searchinp" placeholder='请输入品牌名称' v-model='brandInp'></el-input>
                 </div>
                 <div class="brandlist">
                   <el-tree
                   class="filter-tree"
                   :data="brandList"
                   :props="brandDefaultProps"
                   default-expand-all
                   @node-click='nodeHighLight'
                   :filter-node-method="brandFilterNode"
                   ref="brandTree">
                 </el-tree>
                 </div>
               </div>
               <div class="left_right">
                 <div class="searchbox">
                   <el-input class="searchinp" placeholder='请输入商品名称'  v-model='goodNameInp'></el-input>
                 </div>
                 <div class="innerprofessionBox">
                   <el-checkbox-group v-model="innercheckList" @change='getPressionArr'>
                     <el-checkbox label="905496956341186560" >儿童</el-checkbox>
                     <el-checkbox label="905496907288801280" >艺术家</el-checkbox>
                     <el-checkbox label="905497000209412096" >艺考生</el-checkbox>
                   </el-checkbox-group>
                 </div>
                 <div class="goodList">
                   <el-checkbox-group v-model="allCheckGood" @change="handleCheckedGoodsChange" class="goodcheckBox">
                    <el-checkbox v-for="item in newAllGoodItems" :label="item" :key="item.goodID" class="eachgoodcheck">{{item.goodName}}</el-checkbox>
                  </el-checkbox-group>
                 </div>
                 <el-checkbox v-model="chooseCheckAll" @change="handleCheckGoodsAllChange" class='goodAllSelect'>全选</el-checkbox>
               </div>
             </div>
             <div class="dialogMiddle">
               <div class="btnBox">
                 <el-button type='primary' class="dialogbtn" @click='dialogAddGood()'>添加</el-button>
                 <el-button class="dialogbtn" @click='dialogRemoveGood()'>移除</el-button>
               </div>
             </div>
             <div class="dialogRight">
               <div class="subgoodBox goodBoxRight">
                 <div class="subgoodTop">
                   <el-input placeholder="请输入商品名称" class="subgoodinp" v-model='choosenGoodName'>
                   </el-input>
                   <div class="tip">共 {{curClientBrandNum}} 品牌 {{curClientGoodNum}} 件商品</div>
                 </div>
                 <div class="professionBox">
                   <el-checkbox-group v-model="checkList" @change='allGoodGetPressionArr'>
                     <el-checkbox label="905496956341186560" >儿童</el-checkbox>
                     <el-checkbox label="905496907288801280" >艺术家</el-checkbox>
                     <el-checkbox label="905497000209412096" >艺考生</el-checkbox>
                    </el-checkbox-group>
                 </div>
                 <ul class="goodListBox">
                   <li class="eachList" v-for='(item, index) in newChoosenGoodList'>
                     <div class="sortTitle" @click='getCurItem(item, index)'>
                       <!-- <el-checkbox class="sortTitle" @change='itemAllCheck' v-model='item.status'> -->
                         {{item.allsortName}}
                         <span class="numColor">{{item.num}}</span>
                       <!-- </el-checkbox> -->
                     </div>
                    <el-checkbox-group class="subList" @change='removeCheckItem' v-model='removeCheckArr'>
                      <el-checkbox class="subItem" v-for='subitem in item.subsortList' :label='subitem' :key="subitem.goodName">{{subitem.goodName}}</el-checkbox>
                    </el-checkbox-group>
                   </li>
                 </ul>
               </div>
             </div>
           </el-dialog>
         </div>
       </el-tab-pane>
       <el-tab-pane label="交易订单" name="tradeOrder">交易订单</el-tab-pane>
       <el-tab-pane label="登录日志" name="loginLog">登录日志</el-tab-pane>
     </el-tabs>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import qs from 'querystring'
export default {
  watch: {
    // 弹框内的搜索
    brandInp (val) {
      this.$refs.brandTree.filter(val)
    },
    // 未选商品搜索
    goodNameInp (val, oldVal) {
      console.log(val, oldVal, '监测值')
      var tempGoodArr = []
      this.allGoodItems.filter(item => {
        console.log(item, 'test')
        if (item.goodName.indexOf(val) !== -1) {
          tempGoodArr.push({
            goodID: item.goodID,
            goodName: item.goodName
          })
          console.log(item.goodName.indexOf(val), '返回')
        }
      })
      this.newAllGoodItems = tempGoodArr
      console.log('结果数组', this.newAllGoodItems)
    },
    // 已选择的商品搜索
    choosenGoodName (val) {
      var tempChoosenGoodArr = []
      this.choosenGoodList.filter(item => {
        item.newChoosenSubList = []
        item.newChoosenNum = 0
        var num = 0
        var shownum = 0
        for (var i = 0; i < item.subsortList.length; i++) {
          if (item.subsortList[i].goodName.indexOf(val) !== -1) {
            item.newChoosenSubList.push({
              goodID: item.subsortList[i].goodID,
              goodName: item.subsortList[i].goodName
            })
            item.newChoosenNum = shownum
            if (num === 0) {
              tempChoosenGoodArr.push({
                allsortName: item.allsortName,
                subsortList: item.newChoosenSubList,
                num: ''
              })
            }
            num++
            shownum++
          }
        }
        for (var j = 0; j < tempChoosenGoodArr.length; j++) {
          tempChoosenGoodArr[j].num = tempChoosenGoodArr[j].subsortList.length
        }
      })
      this.newChoosenGoodList = tempChoosenGoodArr
    },
    applicationModel (val, oldVal) {
      console.log('运费模板顺序', val, oldVal)
      if (this.applicationModelOnOff) {
        this.$confirm('请确认是否要进行运费模版的更换？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '更换成功!'
          })
        }).catch(() => {
          this.applicationModel = oldVal
          this.applicationModelOnOff = false
          this.$message({
            type: 'info',
            message: '已取消更换'
          })
        })
      }
    },
    deliveryOnoff (val, oldVal) {
      if (this.preventCircleAlert) {
        if (this.applicationModel === '') {
          this.$confirm('您需要至少选择一个运费模版才能启用包邮条件。', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          }).then(() => {
            this.deliveryOnoff = false
            this.preventCircleAlert = false
          }).catch(() => {
            this.deliveryOnoff = false
            this.preventCircleAlert = false
          })
        } else {
          alert(123)
          this.deliveryTableShow = true
        }
      }
    },
    cityFilterText (val) {
      this.$refs.citydataRef.filter(val)
    },
    clientPassword (val, oldVal) {
      // 判断密码是否更改
      if (oldVal !== '') {
        this.passwordChange = false
      }
    }
  },
  data () {
    return {
      passwordChange: true,
      // 用户密码要监听值 单独写
      passClientPassword: '',
      clientPassword: '',
      // 商户信息
      curClientInfo: [],
      // 商户账户信息
      curClientUser: [],
      // 当前点击表格item的index
      curEditAreaIndex: '',
      // 给一个编辑地区的状态
      editAreaNum: 0,
      curRow: [],
      removeOnoff: false,
      tempValue: [],
      lastValue: [],
      brandList: [],
      targetValue: [],
      brandDefaultProps: {
        label: 'allsortName'
      },
      brandInp: '',
      goodList: [],
      goodNameInp: '',
      goodDefaultProps: {
        label: 'goodName'
      },
      // 当前选项卡
      activeName: 'clientInfo',
      // 角色权限
      powerList: [{
        label: '代发商家',
        value: '0'
      }, {
        label: '自营商家',
        value: '1'
      }],
      // 商家信息
      inforuleForm: {
        brief: '',
        name: '',
        address: '',
        account: '',
        password: '',
        cooperatetime: '',
        deadline: '',
        power: '',
        status: 0,
        chargename: '',
        tel: ''
      },
      inforules: {
        brief: [
          { required: true, message: '请输入商家简称', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入公司名称', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请输入通讯地址', trigger: 'blur' }
        ],
        account: [
          { required: true, message: '请输入登录账号', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' }
        ],
        cooperatetime: [
          { type: 'date', required: true, message: '请输入签约时间', trigger: 'blur' }
        ],
        deadline: [
          { type: 'date', required: true, message: '请输入到期时间', trigger: 'blur' }
        ],
        power: [
          { required: true, message: '请选择角色权限', trigger: 'change' }
        ],
        status: [
          { required: true, message: '请输入活动名称', trigger: 'blur' }
        ],
        chargename: [
          { required: true, message: '请输入负责人姓名', trigger: 'blur' }
        ],
        tel: [
          { required: true, message: '请输入手机号发', trigger: 'blur' }
        ]
      },
      // 运费模板
      transportform: {
        choosemodel: '',
        freeDelivery: 0
      },
      checkList: ['905496956341186560', '905496907288801280', '905497000209412096'],
      innercheckList: ['905496956341186560', '905496907288801280', '905497000209412096'],
      // 总商品列表
      goodListData: [],
      // 总商品列表接受数组
      newGoodList: [],
      // 已选商品列表
      choosenGoodName: '',
      choosenGoodList: [],
      newChoosenGoodList: [],
      // 添加商品弹框
      addGoodDialogVisible: false,
      // 添加商品弹框多选
      chooseCheckAll: false,
      allCheckGood: [],
      newAllGoodItems: [],
      allGoodItems: [],
      // 商户旗下品牌数和商品数
      curClientBrandNum: 0,
      curClientGoodNum: 0,
      // 弹框左侧（相减之后数组）
      afterSubstractArr: [],
      allgoodListData: [],
      // 传给后台的商品id数组
      targetIdArr: [],
      // 移除时前端使用的暂存数组
      passCheckGoodId: [],
      // 当前商户id
      curclientId: '',
      // 绑定弹框要移除的数组
      removeCheckArr: [],
      // 移除时传给后台的id数组
      removeIdArr: [],
      removeIdString: '',
      // 弹框左边条目全选
      itemAllArr: false,
      clickItem: [],
      storeCheckArr: [],
      afterCheckArr: [],
      // 运费模板
      applicationModel: '',
      applicationModelOnOff: true,
      // 包邮条件开关
      deliveryOnoff: false,
      preventCircleAlert: true,
      deliveryTableShow: false,
      deliveryData: [{
        city: '未添加地区',
        setDeliveryCondition: 'weight',
        weightStatus: true,
        priceStatus: false,
        weightAndPriceStatus: false
      }],
      deliveryWaySelect: 'express',
      setDeliveryCondition: 'weight',
      weightStatus: true,
      priceStatus: false,
      weightAndPriceStatus: false,
      chooseCityDialog: false,
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
      cityFilterText: '',
      // 选中城市
      regArr: [],
      selectCityArr: [],
      targetCityArr: [],
      fliterCityArr: [],
      targetCityString: ''
    }
  },
  methods: {
    // 品牌筛选
    brandFilterNode (value, data) {
      if (!value) return true
      return data.allsortName.indexOf(value) !== -1
    },
    // 商品名筛选
    goodFilterNode (value, data) {
      if (!value) return true
      return data.goodName.indexOf(value) !== -1
    },
    // 添加弹框内部多选
    handleCheckGoodsAllChange (event) {
      this.allCheckGood = event.target.checked ? this.allGoodItems : []
      console.log(this.allCheckGood, '多选后')
    },
    handleCheckedGoodsChange (value) {
      let checkedCount = value.length
      this.chooseCheckAll = checkedCount === this.allGoodItems.length
      console.log(this.allCheckGood, '选择商品')
    },
    dialogAddGood () {
      this.passCheckGoodId = []
      this.targetIdArr = []
      for (let i = 0; i < this.newAllGoodItems.length; i++) {
        this.newAllGoodItems[i].id = i
      }
      for (let i = 0; i < this.allCheckGood.length; i++) {
        this.passCheckGoodId.push({
          id: this.allCheckGood[i].id,
          goodID: this.allCheckGood[i].goodID
        })
      }
      var ids = []
      ids = this.passCheckGoodId.map(item => item.id).join(',').split(',').reverse()
      console.log(ids, '前端静态移除的index数组')
      // 调用接口要移除的id数组
      for (let i = 0; i < this.passCheckGoodId.length; i++) {
        this.targetIdArr[i] = this.passCheckGoodId[i].goodID
      }
      console.log('调用接口时id数组传参', this.targetIdArr)
      // 调用接口
      var dialogAddGoodUrl = this.HOST + '/merchant/' + this.curclientId + '/goods'
      this.$http.post(dialogAddGoodUrl, qs.stringify({
        goodsBaseIds: this.targetIdArr
      })).then(res => {
        if (res.data.code === '0000') {
          // 前端左边移除商品，不调接口
          this.$message({
            message: '添加成功',
            type: 'success'
          })
          if (this.allGoodItems.length !== 0) {
            for (var i = 0; i < ids.length; i++) {
              console.log(ids[i])
              this.newAllGoodItems.splice(ids[i], 1)
              this.allCheckGood = []
              console.log('之后的数组', this.newAllGoodItems)
            }
          }
          // 调列表
          this.getShowData()
        } else {
          this.$message({
            message: '添加失败，请稍后再试',
            type: 'warning'
          })
        }
      })
    },
    // 弹框内移除
    dialogRemoveGood () {
      // 调用移除接口
      this.removeIdArr = []
      this.removeIdString = ''
      this.removeOnoff = true
      this.targetValue = this.lastValue.splice(this.tempValue.length, this.lastValue.length - this.tempValue.length)
      for (let i = 0; i < this.targetValue.length; i++) {
        this.removeIdArr[i] = this.targetValue[i].goodID
      }
      this.removeIdString = this.removeIdArr.join(',')
      console.log('目标idString', this.removeIdString)
      var removeIdArrUrl = this.HOST + '/merchant/' + this.curclientId + '/goods'
      this.$http.delete(removeIdArrUrl, {
        params: {
          goodsBaseIds: this.removeIdString
        }
      }).then(res => {
        if (res.data.code === '0000') {
          this.$message({
            message: '移除成功',
            type: 'success'
          })
          this.getShowData()
        } else {
          this.$message({
            message: '移除失败,请稍后再试',
            type: 'warning'
          })
        }
      })
    },
    getCurItem (item, index) {
      this.clickItem = item
    },
    removeCheckItem (value) {
      console.log(value, '要移除的数组')
      if (this.removeOnoff) {
        this.tempValue = this.lastValue
        this.removeOnoff = false
        console.log('临时', this.tempValue)
      }
      this.lastValue = value
    },
    backClient () {
      this.$router.push({
        path: './clientlist'
      })
    },
    tabChange (tab, event) {
      // console.log(tab, event)
    },
    // 更新商家详情
    saveClientInfo () {
      console.log(this.passwordChange, '布尔值')
      if (this.passwordChange) {
        this.passClientPassword = ''
      } else {
        this.passClientPassword = this.clientPassword
      }
      // 签约方式匹配0和1
      var updateClientUrl = this.HOST + '/merchant/update'
      this.$http.post(updateClientUrl, qs.stringify({
        id: this.curclientId,
        name: this.inforuleForm.name,
        nameShort: this.inforuleForm.brief,
        address: this.inforuleForm.address,
        responsiblePerson: this.inforuleForm.chargename,
        phone: this.inforuleForm.tel,
        adminName: this.inforuleForm.account,
        password: this.passClientPassword,
        contractTime: Number(this.inforuleForm.cooperatetime),
        expirationTime: Number(this.inforuleForm.deadline),
        permissions: this.inforuleForm.power,
        status: this.inforuleForm.status
      })).then(res => {
        if (res.data.code === '0000') {
          this.$message({
            message: '保存成功',
            type: 'success'
          })
        } else {
          this.$message({
            message: '保存失败，错误码是' + res.data.code,
            type: 'warning'
          })
        }
      })
      console.log('入参情况')
      console.log('商家简称', this.inforuleForm.brief)
      console.log('公司名称', this.inforuleForm.name)
      console.log('通讯地址', this.inforuleForm.address)
      console.log('登录账号', this.inforuleForm.account)
      console.log('登录密码', this.passClientPassword)
      console.log('签约时间', Number(this.inforuleForm.cooperatetime))
      console.log('到期时间', Number(this.inforuleForm.deadline))
      console.log('角色权限', this.inforuleForm.power)
      console.log('账号状态', this.inforuleForm.status)
      console.log('负责人姓名', this.inforuleForm.chargename)
      console.log('手机号码', this.inforuleForm.tel)
    },
    // 保存运费模板
    saveTransportModel () {
      console.log('应用模板', this.transportform.choosemodel)
      console.log('包邮条件', this.transportform.freeDelivery)
    },
    // 添加商品
    addGood () {
      // 弹框后让右边部分数据不为外部搜索的一致
      this.choosenGoodName = ''
      this.addGoodDialogVisible = true
    },
    // 弹框左侧筛选
    getPressionArr (value) {
      console.log(this.innercheckList, '专业度数组')
      this.newAllGoodItems = []
      this.allGoodItems.filter(item => {
        if (item.professionId.indexOf(this.innercheckList[0]) !== -1 || item.professionId.indexOf(this.innercheckList[1]) !== -1 || item.professionId.indexOf(this.innercheckList[2]) !== -1) {
          this.newAllGoodItems.push(item)
        }
      })
      console.log(this.newAllGoodItems, '筛选后')
    },
    allGoodGetPressionArr (value) {
      console.log(this.checkList, '旗下商品筛选专业度')
      this.afterCheckArr = []
      for (let i = 0; i < this.choosenGoodList.length; i++) {
        this.afterCheckArr.push({
          allsortName: this.choosenGoodList[i].allsortName,
          brandID: this.choosenGoodList[i].brandID,
          status: this.choosenGoodList[i].status,
          num: '',
          subsortList: []
        })
      }
      this.choosenGoodList.filter((item, index) => {
        this.afterCheckArr[index].subsortList = []
        for (let i = 0; i < item.subsortList.length; i++) {
          if (item.subsortList[i].professionId.indexOf(this.checkList[0]) !== -1 || item.subsortList[i].professionId.indexOf(this.checkList[1]) !== -1 || item.subsortList[i].professionId.indexOf(this.checkList[2]) !== -1) {
            this.afterCheckArr[index].subsortList.push(item.subsortList[i])
          }
        }
        // 数字重新计算
        for (let j = 0; j < this.afterCheckArr.length; j++) {
          this.afterCheckArr[j].num = this.afterCheckArr[j].subsortList.length
        }
        this.newChoosenGoodList = this.afterCheckArr
        console.log(this.afterCheckArr, '符合条件')
      })
    },
    nodeHighLight (data) {
      console.log(data, '点击品牌高亮')
      // 切换时候专业度冲洗你填充满
      this.innercheckList = ['905496956341186560', '905496907288801280', '905497000209412096']
      this.allGoodItems = this.afterSubstractArr[data.index].subsortList
      this.newAllGoodItems = this.allGoodItems
      console.log(this.newAllGoodItems, '看看')
    },
    // 集合相减函数
    arrSubstract (bigarr, smallarr) {
      var newArr = []
      var onOff
      for (var i = 0; i < bigarr.length; i++) {
        onOff = true
        for (var j = 0; j < smallarr.length; j++) {
          if (bigarr[i].goodID === smallarr[j].goodID) {
            onOff = false
            break
          }
        }
        if (onOff) {
          newArr.push(bigarr[i])
        }
      }
      return newArr
    },
    // 获取当前，全部和相减后
    getShowData () {
      var getAllBrandAndGoodList = this.HOST + '/merchant/goods'
      var getCurBrandGoodListUrl = this.HOST + 'merchant/' + this.curclientId + '/goods/list'
      axios.all([
        this.$http(getAllBrandAndGoodList),
        this.$http(getCurBrandGoodListUrl)
      ]).then(axios.spread((allRes, objRes) => {
        // 全部
        this.allgoodListData = allRes.data.list
        // 对应
        this.choosenGoodList = objRes.data.list
        this.newChoosenGoodList = this.choosenGoodList
        // 已选商品根据长度增加数字
        this.curClientGoodNum = 0
        for (let i = 0; i < this.choosenGoodList.length; i++) {
          this.choosenGoodList[i].num = this.choosenGoodList[i].subsortList.length
          this.choosenGoodList[i].status = false
          this.curClientGoodNum = this.curClientGoodNum + this.choosenGoodList[i].num
        }
        // 商户旗下品牌数
        this.curClientBrandNum = this.newChoosenGoodList.length
        console.log(this.allgoodListData, '全部')
        console.log(this.newChoosenGoodList, '对应')
        this.afterSubstractArr = []
        for (let i = 0; i < this.allgoodListData.length; i++) {
          this.afterSubstractArr.push({
            allsortName: this.allgoodListData[i].allsortName,
            brandID: this.allgoodListData[i].brandID,
            subsortList: this.allgoodListData[i].subsortList
          })
          for (let j = 0; j < this.newChoosenGoodList.length; j++) {
            if (this.allgoodListData[i].brandID === this.newChoosenGoodList[j].brandID) {
              this.afterSubstractArr[this.afterSubstractArr.length - 1].subsortList = []
              this.afterSubstractArr[this.afterSubstractArr.length - 1].subsortList = this.arrSubstract(this.allgoodListData[i].subsortList, this.newChoosenGoodList[j].subsortList)
              break
            }
          }
        }
        console.log(this.afterSubstractArr, '相减后')
        // 弹框左边品牌
        this.brandList = []
        for (let i = 0; i < this.afterSubstractArr.length; i++) {
          this.brandList.push({
            brandID: this.afterSubstractArr[i].brandID,
            allsortName: this.afterSubstractArr[i].allsortName,
            index: i
          })
        }
      }))
      // 获取相减之后的数组
      // 赋值操作
      this.newGoodList = this.goodListData
      this.newChoosenGoodList = this.choosenGoodList
    },
    // 运费模板模块
    // 下拉框选中值改变
    applicationModelGetOldVal (status) {
      // 给个开关控制无线循环弹框
      this.applicationModelOnOff = true
    },
    modelChange (val) {
    },
    deliveryChange (val) {
      this.preventCircleAlert = true
    },
    // 获取设置包邮条件的状态
    getConditionStatus (row) {
      console.log('希望有', row)
      this.curRow = row
      row.weightStatus = this.curRow.weightStatus
      row.priceStatus = this.curRow.priceStatus
      row.weightAndPriceStatus = this.curRow.weightAndPriceStatus
      console.log(row, '变化的row')
    },
    // 设置包邮条件
    changeDeliveryCondition (val) {
      console.log(this.curRow, '看看当前row')
      // 重量时
      if (this.curRow.setDeliveryCondition === 'weight') {
        this.curRow.weightStatus = true
        this.curRow.priceStatus = false
        this.curRow.weightAndPriceStatus = false
      }
      if (this.curRow.setDeliveryCondition === 'price') {
        this.curRow.weightStatus = false
        this.curRow.priceStatus = true
        this.curRow.weightAndPriceStatus = false
      }
      if (this.curRow.setDeliveryCondition === 'weightAndPrice') {
        this.curRow.weightStatus = false
        this.curRow.priceStatus = false
        this.curRow.weightAndPriceStatus = true
      }
      this.getConditionStatus(this.curRow)
    },
    editArea (row, index) {
      console.log(row, index)
      this.chooseCityDialog = true
      this.curEditAreaIndex = index
      if (this.editAreaNum !== 0) {
        console.log('清空')
        this.$refs.citydataRef.setCheckedKeys([])
      }
      this.editAreaNum++
    },
    // 城市筛选
    cityFilterNode (value, data) {
      if (!value) return true
      return data.cityName.indexOf(value) !== -1
    },
    cancleSaveCity () {
      this.chooseCityDialog = false
      this.$refs.citydataRef.setCheckedKeys([])
    },
    saveCity () {
      console.log(this.$refs, '什么鬼')
      console.log('保存城市index', this.curEditAreaIndex)
      this.chooseCityDialog = false
      this.deliveryData[this.curEditAreaIndex].city = this.targetCityString
    },
    // 获取所选城市信息
    getCheckedKeys () {
      // 存在时进行操作 否则报错
      if (this.$refs.citydataRef.getCheckedKeys().length !== 0) {
        // this.selectCityArr = this.$refs.citydataRef.getCheckedKeys()
        this.selectCityArr = this.$refs.citydataRef.getCheckedNodes()
        this.targetCityArr = []
        this.regArr = []
        for (var i = 0; i < this.selectCityArr.length; i++) {
          var item = this.selectCityArr[i]
          if (item['children']) {
            i += item['children'].length
            delete item['children']
          }
          this.targetCityArr.push(item)
        }
        console.log('测试目标数组', this.targetCityArr)
        // 选大区
        // console.log(this.selectCityArr, '拿到的全部数据')
        // for (var i = 0; i < this.selectCityArr.length; i++) {
        //   if (this.selectCityArr[i].length === 3) {
        //     this.regArr.push(this.selectCityArr[i])
        //   }
        // }
        // console.log('所选大区id', this.regArr)
        // // 如果选了大区，就删除其中的省和市的id
        // for (let j = 0; j < this.regArr.length; j++) {
        //   // 先不写 放一下
        // }
        // for (var i = 0; i < this.selectCityArr.length; i++) {
        //   // 直接选择大区
        //   if (this.selectCityArr[i].length === 3) {
        //     this.regArr.push(this.selectCityArr[i])
        //     for (var j = 0; j < this.citydata.length; j++) {
        //       if (this.selectCityArr[i] === this.citydata[j].id) {
        //         for (var k = 0; k < this.citydata[j].children.length; k++) {
        //           this.targetCityArr.push(this.citydata[j].children[k].cityName)
        //         }
        //       }
        //     }
        //   }
        //   var filterArr = this.selectCityArr
        //   for (let n = 0; n < this.regArr.length; n++) {
        //     for (let m = this.selectCityArr.length - 1; m >= 0; m--) {
        //       if (this.selectCityArr[m].indexOf(this.regArr[n]) === 0 && this.selectCityArr[m].length > 3) {
        //         filterArr.splice(m, 1)
        //       }
        //     }
        //   }
        //   console.log('直接选择大区时，过滤掉6位和9位的', filterArr)
        // }
        // // 选择省
        // for (let p = 0; p < filterArr.length; p++) {
        //   if (filterArr[p].length === 6) {
        //     for (let t = 0; t < this.citydata.length; t++) {
        //       for (let c = 0; c < this.citydata[t].children.length; c++) {
        //         if (filterArr[p] === this.citydata[t].children[c].id) {
        //           this.targetCityArr.push(this.citydata[t].children[c].cityName)
        //         }
        //       }
        //     }
        //   }
        // }
        // this.targetCityString = this.targetCityArr.join('、')
        // console.log('所选城市目标数组', JSON.stringify(this.targetCityArr))
      }
    },
    // 添加表格行
    adddModelItem () {
      this.deliveryData.push({
        city: '未添加地区',
        setDeliveryCondition: 'weight',
        weightStatus: true,
        priceStatus: false,
        weightAndPriceStatus: false
      })
    }
  },
  mounted () {
    this.curclientId = window.sessionStorage.getItem('curClientId')
    this.getShowData()
    console.log(this.curclientId, '当前id')
    // 根据id获取当前商户详情
    var getClientInfoUrl = this.HOST + '/merchant/' + this.curclientId
    this.$http(getClientInfoUrl).then(res => {
      if (res.data.code === '0000') {
        this.curClientInfo = res.data.info
        this.curClientUser = res.data.user
        // 渲染数据
        // 商家简称
        this.inforuleForm.brief = this.curClientInfo.nameShort
        // 公司名称
        this.inforuleForm.name = this.curClientInfo.name
        this.inforuleForm.address = this.curClientInfo.address
        // 负责人姓名
        this.inforuleForm.chargename = this.curClientInfo.responsiblePerson
        this.inforuleForm.tel = this.curClientInfo.phone
        // 账户信息
        this.inforuleForm.account = this.curClientUser.name
        this.clientPassword = this.curClientUser.password

        this.inforuleForm.cooperatetime = this.curClientUser.contractTime
        this.inforuleForm.deadline = this.curClientUser.expirationTime
        this.inforuleForm.status = !this.curClientUser.status
        // 角色权限匹配
        this.curClientUser.permissions = this.curClientUser.permissions.toString()
        this.inforuleForm.power = this.curClientUser.permissions
        console.log(this.curClientUser, '账户信息')
        console.log(this.curClientInfo, '商户信息详情')
      }
    })
  }
}
</script>

<style lang="scss" scoped>
@import "../../../../assets/css/common.scss";

.addClient{
  padding: 0 25px;
  height: 100%;
  .clientInfoBox{
    .title{
      font-size: 16px;
      line-height: 72px;
    }
    // 商家信息模块
    .infoleft{
      float: left;
      width: 32%;
    }
    .inforight{
      float: left;
      width: 32%;
      margin-left: 60px;
    }
    .infoBlock{
      .infoTitle{
        font-size: 16px;
        color: #1f2d3d;
        line-height: 50px;
      }
      .infoForm{
      }
    }
  }
  // 运费模板
  .transportBox{
    margin-top: 10px;
    float:left;
    width: 32%;
  }
  .deliveryTable{
    .conditonSelect{
      width: 108px;
      float: left;
      margin-right:  18px;
    }
    .conditionBox{
      float: left;
      .conditionItem{
        .conditionInput{
          width: 86px;
          margin: 0 14px;
        }
      }
    }
  }
  .searchCityKey{
    margin-bottom:14px ;
  }
  .cityBtnBox{
    margin-top: 18px ;
  }
  // 旗下商品
  .subgoodBox{
    width: 34%;
    height: 500px;
    border: 1px solid #e0e6ed;
    .subgoodTop{
      width: 100%;
      height: 66px;
      padding: 15px 17px 12px 17px;
      border-bottom: 1px solid #e0e6ed;
      .subgoodinp{
        width: 38%;
        height: 38px;
        float: left;
        border-radius: 0;
      }

      .tip{
        width: 38%;
        height: 36px;
        float: left;
        border-radius:0 4px 4px 0;
        background: #fff;
        border:1px solid #d1dbe5;
        line-height: 36px;
        text-indent: 6px;
      }
      .addgood{
        width: 20%;
        margin-left: 1.5%;
        float: left;
      }
    }
    .professionBox{
      padding: 0 17px;
      height: 44px;
      line-height: 44px;
      border-bottom: 1px solid #d1dbe5;
    }
    .goodListBox{
      height: 388px;
      overflow-y: scroll;
      .eachList{
        .sortTitle{
          padding:  0 17px;
          background:#f9fafc;
          width:100%;
          height:44px;
          line-height: 44px;
          font-size:14px;
          color:#99A9BF;
          .numColor{
            height: 18px;
            border-radius: 9px;
            background:#20a0ff;
            color: #fff;
            font-size: 13px;
            line-height: 18px;
            float: right;
            margin-top: 13px;
            padding:  0 5px;
          }
        }
        .subList{
          padding:  0 17px;
          .subItem{
            font-size:14px;
            color:#475669;
            background: #fff;
            height: 44px;
            line-height: 44px;
            width: 100%;
            margin: 0;
          }
        }
      }
    }
  }
  // 旗下商品新增商品弹框
  .addGoodDialogBox{
    .dialogLeft{
      height: 373px;
      width: 45%;
      float: left;
      border:  1px solid #e0e6ed;
      margin-bottom: 80px;
      .left_left{
        width: 47%;
        float:left;
        height: 100%;
        border-right: 1px solid #e0e6ed;
        .brandlist{
          overflow-y: scroll;
          height: 307px;
          border-bottom: 1px solid #e0e6ed;
          .el-tree{
            border: none;
          }
          .branditem{
            height: 38px;
            line-height: 38px;
            text-indent: 18px;
          }
        }
      }
      .left_right{
        width: 53%;
        float: left;
        height: 100%;
        .innerprofessionBox{
          padding: 0 17px 0 18px;
          border-bottom:  1px solid #e0e6ed;
          height: 44px;
          line-height: 44px;
        }
        .goodList{
          overflow-y: scroll;
          overflow-x: hidden;
          border-bottom:  1px solid #e0e6ed;
          height: 219px;
            .el-tree-node__content, .eachgoodcheck{
              padding-left: 15px;
              margin-left: 0;
              width: 100%;
              height: 44px;
              line-height: 44px;
              .el-tree-node__label{
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
              }
            }
        }
        .goodAllSelect{
          padding-left: 17px;
          line-height: 44px;
        }
      }
      .searchbox{
        border-bottom:  1px solid #e0e6ed;
        padding: 16px 17px 13px 18px;
        .searchinp{
          width: 100%;
        }
      }
    }
    .dialogMiddle{
      position: relative;
      height: 373px;
      margin-top: 40%;
      width: 10%;
      margin: auto;
      float: left;
      margin-bottom: 80px;
      .btnBox{
        position: absolute;
        left: 0;
        right:0;
        top: 0;
        bottom: 0;
        margin: auto;
        height: 100px;
        padding:  0 22%;
        .dialogbtn{
          width: 100%;
          margin: auto;
          margin-top: 10px;
        }
      }
    }
    .dialogRight{
      height: 373px;
      width: 45%;
      float: left;
      margin-bottom: 80px;
      .subgoodBox{
        height: auto;
        .subgoodinp{
          width: 50%;
        }
        .tip{
          width: 50%;
        }
      }
      .goodBoxRight{
        width: 100%;
        .goodListBox{
          height: 259px;
        }
      }
    }
  }
  .lookmodel{
    margin-top: 18px;
    margin-left: 10px;
    display:inline-block;
  }
  .savebtn{
    float: right;
    margin-left: 8px;
  }
}
.blue, .red{
  float: left;
}
.red{
  margin-left: 10px;
}
</style>
<style media="screen">
.el-form-item__label{
  color: #5E6D82 !important;
}
.subgoodinp .el-input__inner{
  border-radius: 4px 0 0 4px;
}
.addGoodDialogBox .el-dialog--small{
  width: 64%;
}
.eachgoodcheck .el-checkbox__input{
  float: left;
  line-height: 44px;
  margin-top: 4px;
}
.eachgoodcheck .el-checkbox__label{
  float: left;
  width: 90%;
  display: inline-block;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
.brandlist .el-tree .is-current{
  background: #e4e8f1;
}
.brandlist .el-tree-node__content:hover{
  background: none;
}
.el-table .cell{
  text-align: left;
  margin: 8px 0;
}
.el-dialog__body{
  padding-top: 20px;
}
</style>
