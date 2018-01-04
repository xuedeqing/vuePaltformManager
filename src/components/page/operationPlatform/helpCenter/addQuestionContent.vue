<template lang="html">
  <div class="addcontent">
    <div class="topbar">
      <span class="shortline"></span>
      <span class="title">内容管理</span>
      <el-button  class="addsort" @click='backSortManager()'>返回分类管理</el-button>
    </div>
    <div class="maincontent">
      <p class="title">内容详情</p>
      <div class="formbox">
        <el-form ref="contentform" :model="contentform" label-width="80px">
          <el-form-item label="标题名称">
            <el-input v-model="contentform.name" placeholder='请设置分类名称'></el-input>
          </el-form-item>
          <el-form-item label="内容排序">
            <el-input v-model="contentform.sort" placeholder='请设置分类排序'></el-input>
          </el-form-item>
          <el-form-item label="选择分类" class="sorts">
            <el-cascader placeholder="搜分类名字 或 点击选择"
             :options="sortsList"
              :props="defaultProps"
              @change='getSortSelect'
              v-model='sortSelectArr'
             :disabled="threeLevelStatus"
              filterable>
            </el-cascader>
          </el-form-item>
          <el-form-item label="常见问题">
            <el-switch
              v-model="contentform.oftenQS"
              on-text=""
              off-text="">
            </el-switch>
          </el-form-item>
          <el-form-item label="内容开关">
            <el-switch
              v-model="contentform.contentOnOff"
              on-text=""
              off-text="">
            </el-switch>
          </el-form-item>
        </el-form>
      </div>
      <div class="leftblock">
        <el-form ref="contentform" :model="contentform">
          <el-form-item label="文章详情">
            <!-- <div :class="{ editorbox:true,fullscreen: this.fullState}">
              <v-editor ref="detailsEditor" v-model='editorContent'></v-editor>
              <el-button type='primary' class="screenBtn" @click='becomeFullscreen'>{{fullscreenBtnContent}}</el-button>
            </div> -->
            <div class="editorbox">
              <v-editor ref="detailsEditor" v-model='editorContent'></v-editor>
            </div>
          </el-form-item>
        </el-form>
        <span slot="footer" class="contentbtnbox">
          <el-button @click="addSortDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="confirmAddContent">保 存</el-button>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import vEditor from '../../../editor'
import Bus from '../../../../assets/js/bus.js'

// import Bus from '../../../../assets/js/bus.js'

export default {
  components: {
    vEditor
  },
  data () {
    return {
      // 分类接口参数
      defaultProps: {
        children: 'categoryList',
        label: 'name',
        value: 'id'
      },
      contentform: {
        name: '',
        sort: '',
        choosekind: '',
        oftenQS: true,
        contentOnOff: true
      },
      sortsList: [],
      // 获取分类数组及三级的ID
      sortSelectArr: [],
      editorContent: '',
      threeLevelStatus: false
    }
  },
  methods: {
    backSortManager () {
      this.$router.push({
        path: './sortManager'
      })
      Bus.$emit('highIndexName', 'sortmanager')
    },
    // 获取商品所属分类所选项
    getSortSelect (val) {
      this.getThirdId = val[2]
      console.log(this.getThirdId, '获取三级id')
    },
    confirmAddContent () {
      // 预留接口
      console.log('标题名称', this.contentform.name)
      console.log('内容排序', this.contentform.sort)
      console.log('选择分类，三级id', this.sortSelectArr)
      console.log('富文本', this.editorContent)
    }
  },
  created () {
    // console.log('1')
    // Bus.$on('msg', (e) => {
    //   console.log('亿人我饮酒醉', e)
    // })
  },
  mounted () {
    // 暂用商品分类接口代替问题分类接口
    var sortListUrl = this.HOST + '/productCategory/selectAll'
    this.$http(sortListUrl).then(res => {
      this.sortsList = res.data.list
    })
    // 拿到列表进入时分类id
    console.log('三级id', window.sessionStorage.getItem('curNodeId'))
    if (window.sessionStorage.getItem('curNodeId') === '') {
      this.threeLevelStatus = false
    } else {
      this.threeLevelStatus = true
      this.sortSelectArr = JSON.parse(window.sessionStorage.getItem('curNodeId'))
    }
    Bus.$emit('highIndexName', 'contentmanager')
  }
}
</script>

<style lang="scss" scoped>
@import "../../../../assets/css/common.scss";
.is-opened{
  background: none;
}
.el-cascader{
  .el-icon-caret-bottom{
    transform: rotate(0deg);
  }
}
.addcontent{
  padding: 0 25px;
  height: 100%;
  .maincontent{
    .title{
      line-height: 78px;
      font-size: 16px;
      color: #8492a6;
    }
    .formbox{
      width: 30%;
      float: left;
      .sorts{
        .el-cascader{
          display: block;
        }
        .el-input{
          width: 100%;
        }
      }
    }
    // 富文本
    .leftblock{
      float: left;
      width: 60%;
      margin-left: 4%;
      .editorbox{
        float: left;
        width: 92%;
      }
      .contentbtnbox{
        float: right;
        margin-top: 20px;
      }
    }
  }
}
</style>
<style media="screen">
/*.el-icon-caret-bottom{
  transform: rotate(0);
}*/
</style>
