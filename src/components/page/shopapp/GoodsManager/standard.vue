<template lang="html">
  <div class="standard">
    <div class="topbar">
      <span class="shortline"></span>
      <span class="title">商品规格</span>
      <el-button type="primary" class="addsort" @click='addStandardDialog'>添加规格组</el-button>
    </div>
    <div class="standardTableBox">
      <el-table
      :data="standardData"
      border
      style="width: 100%" height='680'>
      <el-table-column
      type="index"
      label="序号"
      width="80">
    </el-table-column>
      <el-table-column
        prop="id"
        label="规格组编码"
        width="200">
      </el-table-column>
      <el-table-column
        prop="groupName"
        label="规格组名称"
        width="180">
      </el-table-column>
      <el-table-column
        prop="specifications"
        label="规格明细" width="280" >
        <template scope="scope" >
            <span v-for="item in standardDetails[scope.$index]">
              {{item.specificationName}}
            </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="num"
        label="规格数量" width="140" >
        <template scope="scope" >
            <span>
              {{standardLength[scope.$index]}}
            </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="describe"
        label="规格组别名">
      </el-table-column>
      <el-table-column
        prop="operation"
        label="操作">
        <template scope="scope">
        <span  class='edit'@click="standardEdit(scope.$index, scope.row)">编辑</span>
        <span class="delete" @click="standardDelete(scope.$index, scope.row)">删除</span>
      </template>
      </el-table-column>
    </el-table>
    </div>
    <!-- 添加规格组弹框 -->
      <el-dialog
        :title="dialogTitle"
        :visible.sync="standardDialogStatus"
        size="tiny">
        <el-form ref="standardform" :model="standardform" label-width="100px">
          <el-form-item label="规格组编码">
            <el-input v-model="standardform.code" placeholder="新建后系统自动生成" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="规格组名称">
            <el-input v-model="standardform.name" placeholder="请填写规格组名称" ></el-input>
          </el-form-item>
          <el-form-item label="规格组别名">
            <el-input v-model="standardform.othername" placeholder="请填写规格组别名" ></el-input>
          </el-form-item>
        </el-form>
        <div class="innerOperationBox">
          <div class="innertop">
            <span class="standarddetail">规格明细</span>
            <el-button class="innerbtn" @click="delGroup">删除</el-button>
            <el-button class="innerbtn" @click='inneradd()'>添加规格</el-button>
          </div>
          <div class="innertable">
            <!-- 内部表格 -->
            <el-table :data="innerData" border style="width: 100%"
            @selection-change="handleSelectionChange" >
              <el-table-column
                  type="selection"
                  width="55">
                </el-table-column>
                <el-table-column
                prop="innername"
                label="规格名称"
                >
              </el-table-column>
              <el-table-column
                prop="inneroperation"
                label="操作"
                width="120">
                <template scope="scope">
                <span  class='edit'@click="innerEdit(scope.$index, scope.row)">编辑</span>
                <span class="delete" @click="innerDelete(scope.$index, scope.row)">删除</span>
              </template>
              </el-table-column>
            </el-table>

          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="standardDialogStatus = false">取 消</el-button>
          <el-button type="primary" @click="allcConfirm">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 内部弹框 -->
      <el-dialog
        :title="innertitle"
        :visible.sync="innerDialog"
        size="tiny">
        <span class="innertitle">规格名称</span>
          <el-input v-focus="true"  autofocus='autofocus'v-model="innerstandardname" placeholder="请输入规格名称"  @keyup.enter.native="innerConfirm"></el-input>
        <span slot="footer" class="dialog-footer">
          <el-button @click="innerDialog = false">取 消</el-button>
          <el-button type="primary" @click="innerConfirm">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 内部弹框结束 -->
  </div>
</template>

<script>
import qs from 'querystring'

export default {
  data () {
    return {
      standardDialogStatus: false,
      innerDialog: false,
      standardData: [{
        code: 1
      }],
      innerData: [],
      innerstandardname: '',
      isAutoFocus: true,
      // 新增状态和编辑状态
      addStatus: false,
      editStatus: false,
      dialogTitle: '',
      standardform: {
        code: '',
        name: '',
        othername: ''
      },
      innerStatus: 'add',
      innerIndex: '',
      innertitle: '',
      sels: [],
      groupArr: [],
      idIndex: -1,
      standardDetails: [],
      standardLength: []
    }
  },
  methods: {
    // 批量删
    delGroup () {
      var ids = this.sels.map(item => item.id).join(',').split(',').reverse()
      console.log(ids, 'ids', this.innerData)
      if (this.sels.length !== 0) {
        for (var i = 0; i < ids.length; i++) {
          console.log(ids[i])
          this.innerData.splice(ids[i], 1)
          console.log('之后的数组', this.innerData)
        }
      }
      // 调删除接口
    },
    // inner全选操作
    handleSelectionChange (sels) {
      console.log('全选', sels)
      this.sels = sels
    },
    standardEdit (index, row) {
      this.addStatus = false
      this.standardDialogStatus = true
      this.dialogTitle = '编辑规格组'
      console.log(index, row)
      this.standardform.code = row.id
      this.standardform.name = row.groupName
      this.standardform.othername = row.describe
      this.innerData = []
      for (var i = 0; i < row.specifications.length; i++) {
        this.innerData.push({
          innername: row.specifications[i].specificationName,
          id: i
        })
      }
    },
    standardDelete (index, row) {
      var deleteStandardUrl = this.HOST + '/specification/delete'
      this.$http.post(deleteStandardUrl, qs.stringify({
        id: row.id
      })).then(res => {
        if (res.data.code === '0000') {
          this.$message({
            message: '删除规格组成功',
            type: 'success'
          })
          this.getStandardList()
        } else {
          this.$message({
            message: '删除规格组失败',
            type: 'warning'
          })
        }
      })
    },
    innerEdit (index, row) {
      this.innerIndex = index
      this.innerDialog = true
      this.innerStatus = 'edit'
      this.innertitle = '编辑规格'
      this.innerstandardname = row.innername
    },
    innerDelete (index, row) {
      this.innerData.splice(index, 1)
      console.log(index, row)
    },
    // 出现添加规格组弹框
    addStandardDialog () {
      this.addStatus = true
      this.standardDialogStatus = true
      this.dialogTitle = '添加规格组'
      this.standardform.code = '新建后系统自动生成'
      this.standardform.name = ''
      this.standardform.othername = ''
      this.innerData = []
    },
    // 规格明细中添加规格
    inneradd () {
      this.isAutoFocus = true
      this.innerDialog = true
      this.innerStatus = 'add'
      this.innerstandardname = ''
      this.innertitle = '添加规格'
    },
    innerConfirm () {
      this.innerDialog = false
      if (this.innerStatus === 'add') {
        this.idIndex = this.idIndex + 1
        this.innerData.push({
          innername: this.innerstandardname,
          id: this.idIndex
        })
      } else {
        this.innerData[this.innerIndex].innername = this.innerstandardname
      }
    },
    // 获取规格列表
    getStandardList () {
      var standardListUrl = this.HOST + '/specification/all'
      this.$http(standardListUrl).then(res => {
        this.standardData = res.data.list
        for (var i = 0; i < this.standardData.length; i++) {
          this.standardDetails[i] = this.standardData[i].specifications
          this.standardLength[i] = this.standardData[i].specifications.length
        }
      })
    },
    // 提交
    allcConfirm () {
      this.groupArr = []
      for (var i = 0; i < this.innerData.length; i++) {
        console.log('入参前', this.innerData)
        this.groupArr[i] = this.innerData[i].innername
        console.log('入参', this.groupArr)
      }
      if (this.addStatus === true) {
        // 新增状态
        var addStandardUrl = this.HOST + '/specification/specification'
        this.$http.post(addStandardUrl, qs.stringify({
          groupName: this.standardform.name,
          specifications: this.groupArr,
          describe: this.standardform.othername
        })).then(res => {
          if (res.data.code === '0000') {
            console.log('新增成功')
            this.$message({
              message: '添加规格组成功',
              type: 'success'
            })
            this.getStandardList()
          } else {
            this.$message({
              message: '添加规格组失败',
              type: 'warning'
            })
          }
        })
      } else {
        // 编辑状态
        console.log('bianji', this.groupArr)
        var updateStandardUrl = this.HOST + 'specification/updateSpecification'
        this.$http.post(updateStandardUrl, qs.stringify({
          id: this.standardform.code,
          groupName: this.standardform.name,
          specifications: this.groupArr,
          describe: this.standardform.othername
        })).then(res => {
          if (res.data.code === '0000') {
            this.$message({
              message: '编辑规格组成功',
              type: 'success'
            })
            this.getStandardList()
          } else {
            this.$message({
              message: '编辑规格组失败',
              type: 'warning'
            })
          }
        })
      }
      this.standardDialogStatus = false
    }
  },
  mounted () {
    this.getStandardList()
  }
}
</script>

<style lang="scss" scoped>
@import "../../../../assets/css/common.scss";
.standard {
  height: 100%;
  padding: 0 25px;
  .edit{
    float: left;
    color:#20a0ff;
    margin-right: 12px;
    cursor: pointer;
  }
  .delete{
    cursor: pointer;
    float: left;
    color:#ff4949;
  }
  .standardTableBox{
    margin-top: 20px;
  }
  // 谈框中的弹框
  .innerOperationBox{
    .innertop{
      background:#f9fafc;
      width:100%;
      height:66px;
      padding: 0  20px;
      .standarddetail{
        line-height: 66px;
      }
      .innerbtn{
        float: right;
        margin-top: 14px;
        margin-left: 8px;
      }
    }
  }
  .innertitle{
    display: inline-block;
    margin-bottom: 12px;
  }
}

</style>
