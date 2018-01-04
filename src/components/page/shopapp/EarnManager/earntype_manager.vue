<template lang="html">
  <div class="earntype_manager">
    <div class="topbar">
      <span class="shortline"></span>
      <span class="title">营销专题类型管理</span>
      <el-button type="primary" class="addspecial" @click="addspecial()">添加专题</el-button>
    </div>
    <div class="searchbox">
      <el-select v-model="professional" placeholder="所有专业度" class="professional" @change='changePression'>
       <el-option
         v-for="professionalItem in professionalItems"
         :key="professionalItem.value"
         :label="professionalItem.label"
         :value="professionalItem.value"
         >
       </el-option>
     </el-select>
    </div>
    <div class="tablebox">
      <el-table border :data="typeManagerData" style="width: 100%" >
        <el-table-column label="序号" width='80' type='index'></el-table-column>
        <el-table-column prop="subject.professionId" label="专业度" width='120' >
        </el-table-column>
        <el-table-column prop="subject.title" label="营销专题名称"  width='380'>
        </el-table-column>
        <el-table-column prop="iconimg" label="专题图标"  width='200'>
          <template scope="scope">
            <div class="picbox">
              <img :src="scope.row.subject.imgPath" alt="">
            </div>
        </template>
        </el-table-column>
        <el-table-column prop="totalnum" label="文章总数"  width='100'>
          <template scope="scope">
          <span class="blue">{{scope.row.sum}}</span>
        </template>
        </el-table-column>
        <el-table-column prop="subject.sort" label="排序"  width='100'>
        </el-table-column>
        <el-table-column prop="subject.createTime" label="创建时间"  width='200'>
        </el-table-column>
        <el-table-column prop="operation" label="操作" >
          <template scope="scope">
            <p class='blue operationbtn' @click='specialAddArticle(scope.$index, scope.row)'>添加文章</p>
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
    <!-- 添加专题弹框 -->
    <div class="addspecialdialog">
      <el-dialog :title="dialogTitle" :visible.sync="specialDialog" width="30%" size="tiny">
          <el-form ref="specialform" :model="specialform" :rules='specialrules' label-width="80px">
            <el-form-item label="专题名称" prop="name">
              <el-input v-model="specialform.name" plcaeholder='请填写专题名称'></el-input>
            </el-form-item>
            <el-form-item label="专业度" prop='profession'>
              <el-select v-model="specialform.profession" placeholder="请选择所属专业度" class="innerselect">
                <el-option
                  v-for="professionalItem in professionalItems"
                  :key="professionalItem.value"
                  :label="professionalItem.label"
                  :value="professionalItem.value">
                </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="专题排序">
              <el-input v-model="specialform.sort" plcaeholder='不填写表示系统默认'></el-input>
            </el-form-item>
            <el-form-item label="专题图标" prop='iconimg'>
              <el-upload
                class="upload-demo"
                drag
                :action="specialUrl"
                name="picture"
                :data='otherParams'
                 list-type="picture"
                 :on-success='getSpecialIcon'
                 :file-list='specialIconList'
                multiple>
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                <div class="el-upload__tip" slot="tip">只能png 文件，且不超过 200kb，建议规格100x100</div>
              </el-upload>
            </el-form-item>
          </el-form>
          <div class="btnblock">
            <el-button class="innerbtn" type="primary" @click="createNow">立即创建</el-button>
            <el-button class="innerbtn" @click="specialDialog = false">取 消</el-button>
          </div>
      </el-dialog>

    </div>
  </div>
</template>

<script>
import qs from 'querystring'
export default {
  data () {
    return {
      specialUrl: '',
      otherParams: {
        typeName: 'special'
      },
      curSpecialIcon: '',
      currentPage: 1,
      curSize: 10,
      professional: '',
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
      // 类型管理表格数据
      typeManagerData: [],
      specialDialog: false,
      dialogTitle: '',
      dialogStatus: 'add',
      specialform: {
        name: '',
        profession: '',
        sort: '',
        iconimg: []
      },
      specialrules: {
        name: [{
          required: true,
          message: '请输入专题名称',
          trigger: 'blur'
        }],
        profession: [{
          required: true,
          message: '请选择专业度',
          trigger: 'change'
        }]
      },
      curItemId: '',
      specialIconList: []
    }
  },
  methods: {
    changePression (curId) {
      this.professionId = curId
      console.log(this.professionId)
      this.getSpecialList()
      // 加上上面那一句就进入无线循环
    },
    handleSizeChange (val) {
      this.curSize = val
      this.getSpecialList()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.getSpecialList()
    },
    addspecial () {
      this.specialDialog = true
      this.dialogStatus = 'add'
      this.dialogTitle = '添加专题'
      // 清空
      this.specialform.name = ''
      this.specialform.profession = ''
      this.specialform.sort = ''
      this.specialIconList = []
    },
    specialAddArticle (index, row) {
      window.sessionStorage.setItem('curArticleID', null)
      // window.sessionStorage.setItem('specialName', row.subject.title)
      this.$router.push({
        path: './addEssay'
      })
      console.log('添加文章 ', index, row)
    },
    specialEdit (index, row) {
      this.dialogStatus = 'edit'
      this.specialDialog = true
      this.dialogTitle = '编辑专题'
      this.curItemId = row.subject.id
      this.specialform.name = row.subject.title
      if (row.subject.professionId === '儿童') {
        this.specialform.profession = '905496956341186560'
      }
      if (row.subject.professionId === '艺术家') {
        this.specialform.profession = '905496907288801280'
      }
      if (row.subject.professionId === '艺考生') {
        this.specialform.profession = '905497000209412096'
      }
      this.curSpecialIcon = row.subject.imgPath
      this.specialform.sort = row.subject.sort
      this.specialIconList = [{name: row.subject.imgPath.split('/')[row.subject.imgPath.split('/').length - 1], url: row.subject.imgPath}]
      console.log(index, row, '编辑专题')
    },
    specialDelete (index, row) {
      this.curItemId = row.subject.id
      var deleteUrl = this.HOST + '/subject/delete'
      this.$confirm('确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.post(deleteUrl, qs.stringify({
          id: this.curItemId
        })).then(res => {
          if (res.data.code === '0000') {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.getSpecialList()
          } else {
            this.$message({
              message: '删除失败，请稍后再试',
              type: 'warning'
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    getSpecialIcon (response, file, fileList) {
      console.log(response, file, fileList)
      this.curSpecialIcon = response.data[0]
      this.specialform.iconimg = response.data
      this.$refs['specialform'].validate((valid) => {
        if (valid) {
            //
        } else {

        }
      })
    },
    // 专题列表
    getSpecialList () {
      var getListUrl = this.HOST + '/subject/list'
      this.$http.post(getListUrl, qs.stringify({
        curentPage: this.currentPage,
        pageSzie: '',
        professionId: this.professionId
      })).then(res => {
        console.log('专题列表', res.data.data)
        if (res.data.code === '0000') {
          this.typeManagerData = res.data.data
          for (var i = 0; i < this.typeManagerData.length; i++) {
            if (this.typeManagerData[i].subject.professionId === '905496907288801280') {
              this.typeManagerData[i].subject.professionId = '艺术家'
            }
            if (this.typeManagerData[i].subject.professionId === '905496956341186560') {
              this.typeManagerData[i].subject.professionId = '儿童'
            }
            if (this.typeManagerData[i].subject.professionId === '905497000209412096') {
              this.typeManagerData[i].subject.professionId = '艺考生'
            }
          }
        }
      })
    },
    // 立即创建
    createNow () {
      console.log('专业度id', this.specialform.profession)
      console.log('图片列表', this.specialIconList)
      this.$refs['specialform'].validate((valid) => {
        if (valid) {
          // 判断编辑还是添加状态
          if (this.dialogStatus === 'add') {
            var specialUrl = this.HOST + '/subject/add'
            this.$http.post(specialUrl, qs.stringify({
              title: this.specialform.name,
              professionId: this.specialform.profession,
              imgPath: this.curSpecialIcon,
              sort: this.specialform.sort
            })).then(res => {
              if (res.data.code === '0000') {
                this.$message({
                  message: '添加专题成功',
                  type: 'success'
                })
                // 更新列表
                this.getSpecialList()
              } else {
                this.$message({
                  message: '添加专题失败',
                  type: 'warning'
                })
              }
            })
          } else if (this.dialogStatus === 'edit') {
            var updateUrl = this.HOST + '/subject/update'
            this.$http.post(updateUrl, qs.stringify({
              id: this.curItemId,
              title: this.specialform.name,
              professionId: this.specialform.profession,
              imgPath: this.curSpecialIcon,
              sort: this.specialform.sort
            })).then(res => {
              if (res.data.code === '0000') {
                this.$message({
                  message: '编辑专题成功',
                  type: 'success'
                })
                // 更新列表
                this.getSpecialList()
              } else {
                this.$message({
                  message: '添加专题失败',
                  type: 'warning'
                })
              }
            })
          }
          this.specialDialog = false
        }
      })
    }
  },
  mounted () {
    this.specialUrl = this.HOST + 'picture/updateDefault'
    this.getSpecialList()
  }
}
</script>

<style lang="scss" scoped>
@import "../../../../assets/css/common.scss";

.earntype_manager{
  height: 100%;
  padding: 0 25px;
  .addspecial {
      float: right;
      margin-top: 22px;
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
  .addspecialdialog{
    .innerselect{
      width: 100%;
    }
    .el-upload__tip{
      text-align: center;
    }
    .btnblock{
      border-top: 1px solid #d3dce6;
      padding: 16px 0 20px 0;
      .innerbtn{
        float: right;
        margin-left: 10px;
      }
    }
  }
}
</style>
<style media="screen" lang="scss">
.upload-demo{
  width: 100%;
  .el-upload{
    width: 100%;
    .el-upload-dragger{
      width: 100%;
      background:#f9fafc;
    }
  }
}
</style>
