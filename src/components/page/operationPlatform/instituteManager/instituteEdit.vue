<template lang="html">
  <div class="instituteEdit">
    <div class="topbar">
      <span class="shortline"></span>
      <span class="title">机构列表-编辑机构</span>
      <el-button type='primary'  @click='backList()' class="addsort">返回机构列表</el-button>
    </div>
    <div class="allInfoBox clrfix">
      <div class="baseInfo fl">
         <p class="title">机构基本信息</p>
         <div class="baseFormBox">
           <el-form :model="baseForm" :rules="baseRules" ref="baseForm" label-width="100px">
               <el-form-item label="机构类型" prop="typeSelect">
                 <el-select v-model="baseForm.typeSelect" placeholder="请选择机构所属的类型" class="controlWidth">
                   <el-option
                     v-for="item in typeOption"
                     :key="item.typeId"
                     :label="item.typeName"
                     :value="item.typeId">
                   </el-option>
                 </el-select>
               </el-form-item>
               <el-form-item label="机构名称" prop="name">
                 <el-input v-model='baseForm.name' class="controlWidth"></el-input>
               </el-form-item>
               <el-form-item label="机构Logo" prop="logoImg">
                 <el-upload
                   class="logoUpload"
                   drag
                   list-type="picture-card"
                   :data='otherParams'
                   :action="uploadImgUrl"
                   name="picture"
                   :on-success='logoImgSuccess'
                   :on-remove='logoImgRemove'
                   multiple>
                   <i class="el-icon-upload"></i>
                   <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                 </el-upload>
               </el-form-item>
               <el-form-item label="推荐星级" prop="starLevel" class="starItem">
                 <div class="starBox">
                   <el-rate v-model="baseForm.starLevel"></el-rate>
                 </div>
               </el-form-item>
               <el-form-item label="机构简介" prop="brief" class="starItem">
                 <el-input type='textarea' class="controlWidth" v-model='baseForm.brief' :rows='3'></el-input>
               </el-form-item>
           </el-form>
         </div>
      </div>
      <div class="brandInfo fl">
        <p class="title">机构品牌信息</p>
        <div class="tabBox">
          <el-tabs v-model="brandActive" type="card" @tab-click="brandHandleClick">
           <el-tab-pane label="入驻信息" name="first">
             <el-form :model="enterForm" :rules="enterRules" ref="enterForm" label-width="100px">
               <el-form-item label="联系人" prop="connectPerson">
                 <el-input class="controlWidth" v-model='enterForm.connectPerson'></el-input>
               </el-form-item>
               <el-form-item label="联系人电话" prop="connectTel">
                 <el-input class="controlWidth" v-model='enterForm.connectTel' ></el-input>
               </el-form-item>
               <el-form-item label="签约时间" prop="signtime">
                 <el-date-picker
                   v-model="enterForm.signtime"
                   type="daterange"
                   placeholder="选择日期范围" class="datarangeWidth">
                 </el-date-picker>
                 <span class='signLog'>签约记录</span>
               </el-form-item>
              <el-form-item label="备注" prop="remark">
                <el-input type='textarea' class="controlWidth"  v-model='enterForm.remark' :rows='3'></el-input>
              </el-form-item>
             </el-form>
           </el-tab-pane>
           <el-tab-pane label="宣传视频" name="second">
             <el-form :model="videoForm" :rules="videoRules" ref="videoForm" label-width="100px" >
               <el-form-item label='宣传视频' prop="onOff">
                 <el-switch
                    v-model="videoForm.onOff"
                    on-text=""
                    off-text="">
                  </el-switch>
               </el-form-item>
               <el-form-item label='视频标题' prop="title">
                <el-input v-model='videoForm.title' class='controlWidth'></el-input>
               </el-form-item>
               <el-form-item label='视频封面' prop="cover">
                 <el-upload
                  class="videoUploadBox upload-demo"
                   drag
                   list-type="picture-card"
                   :data='uploadPoster'
                   :action="uploadImgUrl"
                   name="picture"
                   :on-success='videoPosterSuccess'
                   :on-remove='videoPosterRemove'
                   multiple>
                   <i class="el-icon-upload"></i>
                 <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                 <div class="el-upload__tip" slot="tip">上传 jpg/png 图片文件，且不超过500kb，规格建议690*388</div>
                 </el-upload>
               </el-form-item>
               <el-form-item label='视频地址' prop="videoUrl">
                <el-input v-model='videoForm.videoUrl' class='controlWidth' placeholder='请填写视频地址，格式：http://***'></el-input>
               </el-form-item>
               <el-form-item label='机构轮播' prop="instituteSwiper" class="videoSwiper">
                 <el-upload
                  class="upload-demo"
                  drag
                  list-type="picture-card"
                  :data='videoPoster'
                   name="picture"
                  :action="uploadImgUrl"
                  multiple>
                  <i class="el-icon-upload"></i>
                  <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                  <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
                </el-upload>
               </el-form-item>
             </el-form>
           </el-tab-pane>
           <el-tab-pane label="机构位置" name="third">
             <el-form :model="locationForm" :rules="locationRules" ref="locationForm" label-width="100px">
               <el-form-item label='所在地区' prop='myLocation'>
                 <el-cascader class='controlWidth locationStyle'
                 :options="cityOptions"
                 change-on-select></el-cascader>
                </el-form-item>
              <el-form-item label='地图定位'>
                <div class="clrfix mapsearchBox">
                  <el-input class="mapInp" ></el-input>
                  <div class="searchbtn">
                    <i class="el-icon-search"></i>
                  </div>
                </div>
                <div class="mapArea">
                  <div id="container" tabindex="0">
                  </div>
                  <div id="panel" tabindex="0">
                  </div>
                </div>
              </el-form-item>
              <el-form-item label='服务热线' prop='hotTel'>
                <el-input v-model='locationForm.hotTel' placeholder='请填写服务热线' class='controlWidth'></el-input>
              </el-form-item>
              <el-form-item label='详细地址' prop='detailAddress'>
                <el-input v-model='locationForm.detailAddress' placeholder='请填写详细地址' class='controlWidth'></el-input>
              </el-form-item>
              <el-form-item label='地理坐标' prop='coordinate'>
                <el-input v-model='locationForm.coordinate' placeholder='请填写地理坐标' class='controlWidth'></el-input>
              </el-form-item>
             </el-form>
           </el-tab-pane>
           <el-tab-pane label="优质师资" name="fourth">
             <el-button type='primary' @click='addTeacher'>添加教师</el-button>
             <el-table  :data="teacherData" style="width: 100%" class="teacherTableBox" max-height='400'>
               <el-table-column
                label="序号"
                type='index'
                width="80">
              </el-table-column>
              <el-table-column
                prop="headImg"
                label="头像">
                <template scope='scope'>
                  <img :src="scope.row.headImg" alt="" class='headImgBox'>
                </template>
              </el-table-column>
                <el-table-column
                prop="rank"
                label="职称"  >
              </el-table-column>
              <el-table-column
              prop="name"
              label="名字">
            </el-table-column>
            <el-table-column
            prop="brief"
            label="简介"
            width='367'>
          </el-table-column>
          <el-table-column
             prop="operation"
             width="120"
             label="操作">
             <template scope='scope'>
               <p class='blue fl' @click='editTeacher(scope.row, scope.$index)'>编辑</p>
               <p class='red fl'>删除</p>
             </template>
           </el-table-column>
             </el-table>
             <el-dialog class="teacherDialog"
              title="添加教师"
              :visible.sync="teacherDialogVisible"
              size="tiny"
            >
            <el-form :model="teacherForm" :rules="teacherRules" ref="teacherForm" label-width="80px">
              <el-form-item label='教师名称' prop='name'>
                <el-input placeholder='请填写教师名称' v-model='teacherForm.name'></el-input>
              </el-form-item>
              <el-form-item label='教师头像' prop='headImg'>
                <el-upload id='teachUpload'
                  class="teacherHeadUpload"
                  drag
                  list-type="picture-card"
                  :data='otherParams'
                  :action="uploadImgUrl"
                  name="picture"
                  :file-list="teacherfileList"
                  :on-success='teacherImgSuccess'
                  :on-remove='teacherImgRemove'
                  multiple>
                  <i class="el-icon-upload"></i>
                  <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                  <div class="el-upload__tip" slot="tip">上传 jpg/png 图片文件，且不超过500kb，规格建议200*200</div>
                </el-upload>
              </el-form-item>
              <el-form-item label='教师职称' prop='rank'>
                <el-input placeholder='请填写教师职称' v-model='teacherForm.rank'></el-input>
              </el-form-item>
              <el-form-item label='教师简介' prop='brief'>
                <el-input placeholder='请填写教师简介'  type='textarea' v-model='teacherForm.brief' :row='3'></el-input>
              </el-form-item>
            </el-form>
              <span slot="footer" class="dialog-footer">
                <el-button  @click="teacherDialogVisible = false">取 消</el-button>
                <el-button type="primary"  @click='addTeacherConfirm'>添 加</el-button>
              </span>
            </el-dialog>
           </el-tab-pane>
           <el-tab-pane label="自定义" name="fifth">
             <el-form :model="selfForm" :rules="selfRules" ref="selfForm" label-width="100px">
               <el-form-item label='标题名称' prop='titlename'>
                 <el-input placeholder='请填写标题名称'  v-model='selfForm.titlename' class='controlWidth'></el-input>
               </el-form-item>
               <el-form-item label='图片展示' prop='picshow' >
                 <el-upload
                  class="selfDefineUpload"
                  list-type="picture-card"
                  drag
                  :data='otherParams'
                  :action="uploadImgUrl"
                  name="picture"
                  multiple>
                  <i class="el-icon-upload"></i>
                  <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                  <div class="el-upload__tip" slot="tip">上传 jpg/png 图片文件，且不超过500kb，规格建议300*200</div>
                </el-upload>
               </el-form-item>
             </el-form>
           </el-tab-pane>
         </el-tabs>
        </div>
      </div>
    </div>
    <div class="bottomSaveBlock">
      <el-button class='fr allsaveBtn' type='primary' @click='saveAll'>全部保存</el-button>
    </div>
  </div>
</template>

<script>
import AMap from 'AMap'

export default {
  data () {
    return {
      uploadImgUrl: '',
      otherParams: {
        typeName: 'instituteLogoImg'
      },
      // 上传图片视频封面参数
      uploadPoster: {
        typeName: ' videoPoster'
      },
      videoPoster: {
        typeName: ' posterSwiper'
      },
      // 机构类型可选
      typeOption: [{
        typeName: '类型1',
        typeId: '1'
      }, {
        typeName: '类型2',
        typeId: '2'
      }],
      // 基本信息表单
      baseForm: {
        typeSelect: '',
        name: '',
        logoImg: '',
        starLevel: null,
        brief: ''
      },
      baseRules: {
        typeSelect: [{required: true, message: '请选择机构所属的类型', trigger: 'change'}],
        name: [{required: true, message: '请填写机构名称', trigger: 'blur'}],
        logoImg: [{required: true, message: '请上传图片', trigger: 'blur'}]
      },
      // 品牌tab
      brandActive: 'first',
      // 入驻信息表单
      enterForm: {
        connectPerson: '',
        connectTel: '',
        signtime: '',
        remark: ''
      },
      enterRules: {
        connectPerson: [{required: true, message: '请填写联系人', trigger: 'blur'}],
        connectTel: [{required: true, message: '请填写联系人电话', trigger: 'blur'}],
        signtime: [{type: 'array', required: true, message: '请选择签约时间', trigger: 'change'}]
      },
      // 宣传视频
      videoForm: {
        onOff: true,
        title: '',
        cover: '',
        videoUrl: ''
      },
      videoRules: {
        onOff: [{required: true}],
        title: [{required: true, message: '请填写视频标题', trigger: 'blur'}],
        cover: [{required: true, message: '请上传图片', trigger: 'blur'}],
        videoUrl: [{required: true, message: '请填写视频地址', trigger: 'blur'}]
      },
      // 机构位置
      cityOptions: [{
        value: '1',
        label: '广东省',
        children: [{
          value: '11',
          label: '深圳市',
          children: [{
            value: '111',
            label: '罗湖区'
          }]
        }]
      }],
      locationForm: {
        myLocation: '',
        hotTel: '',
        detailAddress: '',
        coordinate: ''
      },
      locationRules: {
        myLocation: [{required: true, message: '请选择所在地区', trigger: 'change'}],
        hotTel: [{required: true, message: '请输入服务热线', trigger: 'blur'}],
        detailAddress: [{required: true, message: '请输入详细地址', trigger: 'blur'}],
        coordinate: [{required: true, message: '请输入地理坐标', trigger: 'blur'}]
      },
      // 添加教师弹框
      teacherDialogVisible: false,
      // 添加教师表单
      // 上传教师头像
      teacherfileList: [],
      teacherImg: '',
      teacherForm: {
        name: '',
        rank: '',
        brief: '',
        headImg: ''
      },
      teacherRules: {
        name: [{required: true, message: '请填写教师名称', trigger: 'blur'}],
        rank: [{required: true, message: '请填写教师职称', trigger: 'blur'}],
        brief: [{required: true, message: '请填写教师简介', trigger: 'blur'}],
        headImg: [{required: true, message: '请上传教师头像', trigger: 'blur'}]
      },
      teacherData: [{
        headImg: 'http://img.mouarts.com/instituteLogoImg/948100765275246592.png',
        rank: '幼儿园院长',
        name: '王翊菲',
        brief: '本科学历，小学高级教师。长沙市小学语文优秀教师。1995年参加湖南省小学语文教学比武，荣获一等奖的第一名，同年10月代表湖南省参加全国语文教学比武再获二等奖 。国家级观摩课的执教任务，并获得各级领导及专家们的一致好评'
      }, {
        headImg: 'http://img.mouarts.com/instituteLogoImg/948100765275246592.png',
        rank: '优秀教师',
        name: '凌云溪',
        brief: '本科学历，小学高级教师。长沙市小学语文优秀教师。1995年参加湖南省小学语文教学比武，荣获一等奖的第一名，同年10月代表湖南省参加全国语文教学比武再获二等奖 。国家级观摩课的执教任务，并获得各级领导及专家们的一致好评。'
      }],
      // 自定义
      selfForm: {
        titlename: '',
        picshow: ''
      },
      selfRules: {
        titlename: [{required: true, message: '请填写标题名称', trigger: 'blur'}],
        picshow: [{required: true, message: '请上传图片', trigger: 'blur'}]
      }
    }
  },
  methods: {
    backList () {
      this.$router.push({
        path: './instituteList'
      })
    },
    // 上传图片成功时使空间消失
    logoImgSuccess (response, file, fileList) {
      if (response.code === '0000') {
        document.getElementsByClassName('el-upload-dragger')[0].style = 'display:none'
      }
    },
    // logo移除
    logoImgRemove (file, fileList) {
      if (file.response.code === '0000') {
        document.getElementsByClassName('el-upload-dragger')[0].style = 'display:block'
      }
    },
    // 选项卡切换
    brandHandleClick (tab, event) {
      console.log(tab, event)
    },
    // 视频封面上传
    videoPosterSuccess (response, file, fileList) {
      console.log('视频封面上传', response, file, fileList)
      if (response.code === '0000') {
        document.getElementsByClassName('el-upload-dragger')[1].style = 'display:none'
      }
    },
    videoPosterRemove (file, fileList) {
      if (file.response.code === '0000') {
        document.getElementsByClassName('el-upload-dragger')[1].style = 'display:block'
      }
    },
    addTeacher () {
      this.teacherDialogVisible = true
      // 点击弹框清空数据
      this.teacherForm.name = ''
      this.teacherForm.rank = ''
      this.teacherForm.brief = ''
      this.teacherImg = ''
      this.teacherfileList = []
      setTimeout(function () {
        document.getElementById('teachUpload').style = 'height: 180px'
        document.getElementById('teachUpload').getElementsByClassName('el-upload-dragger')[0].style = 'display:block'
        document.getElementById('teachUpload').getElementsByClassName('el-upload__tip')[0].style = 'display:block'
      }, 100)
    },
    teacherImgSuccess (response, file, fileList) {
      console.log(response, file, fileList)
      this.teacherImg = response.data[0]
      if (response.code === '0000') {
        document.getElementById('teachUpload').style = 'height: 100px'
        document.getElementById('teachUpload').getElementsByClassName('el-upload-dragger')[0].style = 'display:none'
        document.getElementById('teachUpload').getElementsByClassName('el-upload__tip')[0].style = 'display:none'
      }
    },
    // 教师头像移除
    teacherImgRemove (file, fileList) {
      console.log('移除', file, fileList)
      if (file.status === 'success') {
        document.getElementById('teachUpload').style = 'height: 180px'
        document.getElementById('teachUpload').getElementsByClassName('el-upload-dragger')[0].style = 'display:block'
        document.getElementById('teachUpload').getElementsByClassName('el-upload__tip')[0].style = 'display:block'
      }
    },
    // 确认添加老师
    addTeacherConfirm () {
      this.teacherDialogVisible = false
      console.log('提交给后台数据查看')
      console.log('教师姓名', this.teacherForm.name)
      console.log('教师头像', this.teacherImg)
      console.log('教师职称', this.teacherForm.rank)
      console.log('教师简介', this.teacherForm.brief)
    },
    editTeacher (row, index) {
      console.log(row)
      this.teacherDialogVisible = true
      this.teacherForm.name = row.name
      this.teacherForm.rank = row.rank
      this.teacherForm.brief = row.brief
      if (row.img !== '') {
        this.teacherfileList = [{url: row.headImg}]
        setTimeout(function () {
          document.getElementById('teachUpload').style = 'height: 100px'
          document.getElementById('teachUpload').getElementsByClassName('el-upload-dragger')[0].style = 'display:none'
          document.getElementById('teachUpload').getElementsByClassName('el-upload__tip')[0].style = 'display:none'
        }, 100)
      }
    },
    saveAll () {
      console.log(123)
    }
  },
  mounted () {
    this.uploadImgUrl = this.HOST + '/picture/updateDefault'
    setTimeout(function () {
      var map = new AMap.Map('container', {
        resizeEnable: true
      })
      AMap.service(['AMap.PlaceSearch'], function () {
        var placeSearch = new AMap.PlaceSearch({ // 构造地点查询类
          pageSize: 4,
          pageIndex: 1,
          city: '010', // 城市
          map: map,
          panel: 'panel'
        })
        // 关键字查询
        placeSearch.search('武汉大学', function (status, result) {
          console.log(status, result, '搜索结果')
        })
      })
    }, 100)
  }
}
</script>

<style lang="scss" scoped>
@import "../../../../assets/css/common.scss";
.instituteEdit{
  padding: 0 25px;
  height: 100%;
  position: relative;
  // 所有信息
  .allInfoBox{
    .title{
      height: 76px;
      line-height: 76px;
      font-size:16px;
      color:#8492a6;
    }
    // 基本信息
    .baseInfo{
      width: 35%;
      .controlWidth{
        width: 358px;
      }
      .starBox{
        height: 36px;
      }
      .logoUpload{
        height: auto;
      }
    }
    // 品牌信息
    .brandInfo{
      width: 65%;
      .controlWidth{
        width: 358px;
      }
    }
    // tab部分
   .tabBox{
     .datarangeWidth{
       width: 288px;
     }
     .signLog{
       margin-left: 10px;
     }
     // 上传视频封面
     .videoUploadBox{
       height: 178px;
     }
     // 所在地区
     .mapsearchBox{
       position: relative;
     }
     .mapInp{
       width: 100%;
       float: left;
     }
     .searchbtn{
       position: absolute;
       right: 0;
       background:#f9fafc;
       color:#99a9bf;
       font-size: 18px;
       line-height: 36px;
       text-align: center;
       width: 36px;
       height: 36px;
       border:1px solid #c0ccda;
       background:#f9fafc;
       border-radius:4px 0 0 4px ;
     }
     .mapArea{
       height: 300px;
       width: 100%;
       margin-top:19px;
       position: relative;
       #container{
         height: 300px;
         width: 100%;
       }
       #panel{
         position: absolute;
         width: 298px;
         height: 300px;
         top: 0;
         right: 0;
         overflow-y:auto;
       }
     }
     // 教师表格
     .teacherTableBox{
       margin-top: 10px;
       .headImgBox{
         width: 62px;
         height: 62px;
       }
       .blue{
         margin-right: 8px;
       }
     }
   }
  }
  // 底部保存
  .bottomSaveBlock{
  background:#f9fafc;
width:100%;
height:56px;
position: absolute;
bottom: 0;
 left: 0;
 .allsaveBtn{
   margin-right:  25px;
   margin-top: 10px;
 }
  }
}
</style>
<style media="screen" lang="scss">
.el-table .cell{
  text-align: left;
  margin: 8px 0;
}
.el-rate__icon{
  vertical-align: middle !important;
  line-height: 36px;
}
.el-upload--picture-card{
  border: none;
}
.el-upload-dragger .el-upload__text{
  position: absolute;
  width: 100%;
  bottom: -39px;
}
.videoUploadBox .el-upload{
  height: 150px;
}
.videoUploadBox .el-upload-list--picture-card .el-upload-list__item{
  width: 358px;
  height: 178px;
}
.videoSwiper .el-form-item__content{
  height: 250px !important;
}
.videoSwiper .el-upload-list--picture-card .el-upload-list__item{
  width: 78px;
  height:43px;
}
.teacherHeadUpload{
  height: auto;
  .el-upload-dragger{
    width: 448px;
  }
}
.teacherHeadUpload .el-upload-list--picture-card .el-upload-list__item{
  width: 98px;
  height: 98px;
}
.videoSwiper .el-upload-list--picture-card{
   position: absolute;
   bottom: -9px;
   overflow: auto;
}
.el-upload-dragger{
  height: 100%;
}
.selfDefineUpload{
  height: 260px;
}
.selfDefineUpload .el-upload-list--picture-card{
  position: absolute;
  bottom: 0;
  overflow: auto;
}
.selfDefineUpload .el-upload-list--picture-card .el-upload-list__item{
  width: 78px;
  height:43px;
}
.teacherDialog{
  .el-dialog__body{
   border-bottom: 1px solid #e0e6ed;
  }
}
.el-cascader{
  .el-icon-caret-bottom{
    transform: rotate(0deg);
  }
}
.is-opened{
  background: none;
}
</style>
