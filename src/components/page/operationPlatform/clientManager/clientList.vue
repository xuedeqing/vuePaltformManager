<template lang="html">
  <div class="clientlist">
    <div class="topbar">
      <span class="shortline"></span>
      <span class="title">商家管理</span>
      <el-button type="primary" class="addsort" @click='addClient()'>添加商家</el-button>
    </div>
    <div class="clientTableBox">
      <el-table
        :data="clientData"
        border
        style="width: 100%" max-height='600'>
        <el-table-column
          align="left"
          prop="code"
          label="商家编号"
          width="190">
        </el-table-column>
        <el-table-column
        align="left"
          prop="name"
          label="商家简称"
          width="180">
        </el-table-column>
        <el-table-column
          align="left"
          prop="power"
          label="角色权限">
        </el-table-column>
        <el-table-column
          align="left"
          prop="transportmodel"
          label="运费模板">
        </el-table-column>
        <el-table-column
          align="left"
          prop="subgood"
          label="旗下商品">
        </el-table-column>
        <el-table-column
          align="left"
          prop="recentlogin"
          label="最近一次登录"
          width='200'>
        </el-table-column>
        <el-table-column
          align="left"
          label="签约期限"
          width='220'>
          <template scope='scope'>
            <p>{{scope.row.contractTime}} ~ {{scope.row.expirationTime}}</p>
          </template>
        </el-table-column>
        <el-table-column
        align="left"
        prop="status"
        label="账户状态">
        <template scope="scope">
        <p class='green' @click='startUse(scope.$index, scope.row)' v-if='scope.row.accoutStatus'>启用</p>
        <p class="red" @click='stopUse(scope.$index, scope.row)' v-else='scope.row.accoutStatus'>停用</p>
      </template>
      </el-table-column>
      <el-table-column
      align="left"
      prop="operation"
      label="操作">
      <template scope="scope">
      <p class='blue' @click='clientDetail(scope.$index, scope.row)'>详情</p>
    </template>
    </el-table-column>
      </el-table>
      <!-- 添加商户弹框 -->
        <div class="clientDialog">
          <el-dialog :visible.sync="clientDialogFormVisible" size="tiny" top='8%' title="添加商家">
            <div class="infoBlock">
              <el-form label-width="100px" :model="clientform" :rules="clientrules" ref="clientform" class="infoForm">
                <p class="infoTitle">企业信息</p>
                 <el-form-item label="商家简称" prop="brief">
                   <el-input v-model='clientform.brief'></el-input>
                 </el-form-item>
                 <el-form-item label="公司名称" prop="name">
                   <el-input v-model='clientform.name'></el-input>
                 </el-form-item>
                 <el-form-item label="通讯地址" prop="address">
                   <el-input v-model='clientform.address'></el-input>
                 </el-form-item>
                 <p class="infoTitle">负责人信息</p>
                 <el-form-item label="负责人姓名" prop="chargename">
                   <el-input v-model="clientform.chargename"></el-input>
                 </el-form-item>
                 <el-form-item label="手机号码" prop="tel">
                   <el-input v-model="clientform.tel" ></el-input>
                 </el-form-item>
                 <p class="infoTitle">账户信息</p>
                 <el-form-item label="登录账号" prop="account">
                   <el-input v-model='clientform.account'></el-input>
                 </el-form-item>
                 <el-form-item label="登录密码" prop="password">
                   <el-input v-model='clientform.password' type='password' ></el-input>
                 </el-form-item>
                 <el-form-item label="签约时间" prop="cooperatetime">
                    <el-date-picker type="date" placeholder="请选择签约时间" v-model="clientform.cooperatetime" style="width: 100%;"></el-date-picker>
                 </el-form-item>
                 <el-form-item label="到期时间" prop="deadline">
                   <el-date-picker type="date" placeholder="请选择到期时间" v-model="clientform.deadline" style="width: 100%;"></el-date-picker>
                 </el-form-item>
                 <el-form-item label="角色权限" prop="power">
                   <el-select  v-model="clientform.power" placeholder="请选择角色权限" style="width: 100%;">
                    <el-option v-for='item in powerList' :label="item.label" :value="item.value"></el-option>
                  </el-select>
                 </el-form-item>
                 <el-form-item label="账户状态" prop="status">
                   <el-switch
                     v-model="clientform.status"
                     on-text=""
                     off-text="">
                   </el-switch>
                   <span v-if='clientform.status'>禁用</span>
                   <span v-else='clientform.status'>启用</span>
                 </el-form-item>
               </el-form>
            </div>
            <div slot="footer" class="dialog-footer">
              <el-button @click="clientDialogFormVisible = false">取 消</el-button>
              <el-button type="primary" @click="confirmAddClient('clientform')">确 定</el-button>
            </div>
        </el-dialog>
        </div>
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
</template>

<script>
import qs from 'querystring'
export default {
  data () {
    return {
      curSize: 10,
      currentPage: 1,
      clientData: [{
        code: 'MUPM001',
        name: '多金',
        power: '代发',
        transportmodel: '已配置',
        subgood: '78',
        recentlogin: '2017-12-21  12:21:33',
        deadline: '2017-12-21～2018-12-21',
        accoutStatus: 1
      }, {
        code: 'MUPM002',
        name: '多金',
        power: '直营',
        transportmodel: '未配置',
        subgood: '32',
        recentlogin: '2017-12-21  12:21:33',
        deadline: '2017-12-21～2018-12-21',
        accoutStatus: 0
      }],
      // 角色权限
      powerList: [{
        label: '代发商家',
        value: '0'
      }, {
        label: '自营商家',
        value: '1'
      }],
      // 添加商户弹框
      clientDialogFormVisible: false,
      clientform: {
        brief: '',
        name: '',
        address: '',
        account: '',
        password: '',
        cooperatetime: '',
        deadline: '',
        power: '',
        status: false,
        chargename: '',
        tel: ''
      },
      clientrules: {
        brief: [
          { required: true, message: '请输入商家简称', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入公司名称', trigger: 'blur' }
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
          { required: true }
        ]
      }
    }
  },
  methods: {
    addClient () {
      this.clientDialogFormVisible = true
      // 清空表单数据
      this.clientform.name = ''
      this.clientform.brief = ''
      this.clientform.address = ''
      this.clientform.chargename = ''
      this.clientform.tel = ''
      this.clientform.account = ''
      this.clientform.password = ''
      this.clientform.cooperatetime = ''
      this.clientform.deadline = ''
      this.clientform.power = ''
      this.clientform.status = false
    },
    clientDetail (index, row) {
      window.sessionStorage.setItem('curClientId', row.code)
      this.$router.push({
        path: './addClient'
      })
    },
    // 添加商家
    confirmAddClient (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.clientDialogFormVisible = false
          // 调用新增商户接口
          var addClientUrl = this.HOST + '/merchant/add'
          this.$http.post(addClientUrl, qs.stringify({
            name: this.clientform.name,
            nameShort: this.clientform.brief,
            address: this.clientform.address,
            responsiblePerson: this.clientform.chargename,
            phone: this.clientform.tel,
            adminName: this.clientform.account,
            password: this.clientform.password,
            contractTime: Number(this.clientform.cooperatetime),
            expirationTime: Number(this.clientform.deadline),
            permissions: this.clientform.power,
            status: this.clientform.status
          })).then(res => {
            if (res.data.code === '0000') {
              this.$message({
                message: '添加商家成功',
                type: 'success'
              })
              this.getClientList()
            } else {
              this.$message({
                message: '添加商家失败,错误码是' + res.data.code,
                type: 'warning'
              })
            }
          })
          console.log('查看入参情况：')
          console.log('商家简称', this.clientform.brief)
          console.log('公司名称', this.clientform.name)
          console.log('通讯地址', this.clientform.address)
          console.log('负责人姓名', this.clientform.chargename)
          console.log('手机号码', this.clientform.tel)
          console.log('登录账号', this.clientform.account)
          console.log('登录密码', this.clientform.password)
          console.log('签约时间', Number(this.clientform.cooperatetime))
          console.log('到期时间', Number(this.clientform.deadline))
          console.log('角色权限', this.clientform.power)
          console.log('账号状态', this.clientform.status)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleSizeChange (val) {
      this.curSize = val
      this.getClientList()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.getClientList()
    },
    getClientList () {
      var clientListUrl = this.HOST + '/merchant/list/' + this.currentPage + '/' + this.curSize
      this.$http(clientListUrl).then(res => {
        console.log('列表返回', res.data.list)
        this.clientData = res.data.list
        // 签约时间数据做处理
        for (var i = 0; i < this.clientData.length; i++) {
          this.clientData[i].recentlogin = this.transformTime(this.clientData[i].recentlogin)
          this.clientData[i].contractTime = this.transformTime(this.clientData[i].contractTime).split(' ')[0]
          this.clientData[i].expirationTime = this.transformTime(this.clientData[i].expirationTime).split(' ')[0]
        }
      })
    }
  },
  mounted () {
    this.getClientList()
  }
}
</script>

<style lang="scss" scoped>
@import "../../../../assets/css/common.scss";
.el-table{
  border-bottom: none;
}
.clientlist{
  padding: 0 25px;
  height: 100%;
  .clientTableBox{
    margin-top: 14px;
    .infoBlock{
      .infoTitle{
        font-size: 16px;
        line-height: 32px;
      }
    }
  }
  .paginationblock{
    margin-top: 18px;
  }
}
</style>
<style media="screen">
.el-dialog__body{
  padding: 2px 20px !important;
  border:1px solid #e0e6ed;
  margin-top: 12px;
}
.el-form-item {
    margin-bottom: 20px;
}
</style>
