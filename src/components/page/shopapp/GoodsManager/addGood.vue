<template lang="html">
  <div class="addgood">
    <!-- 类别头部start -->
    <div class="topbar">
      <span class="shortline"></span>
      <span class="title">商品库 - 新增商品</span>
      <el-button @click="backStore" class="addsort">返回商品库</el-button>
    </div>
    <!-- 类别头部end -->
    <!-- 内容部分start -->
    <div class="maincontent">
      <el-row :gutter="20">
        <el-col :span="8">
          <div class="left">
          <p class="title">商品基础信息</p>
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="商品编码" prop="code">
              <el-input :disabled="true" placeholder="保存后系统自动生成"></el-input>
            </el-form-item>
            <el-form-item label="商品标题" prop="title">
              <el-input v-model="ruleForm.title"></el-input>
            </el-form-item>
            <el-form-item label="所属分类" prop="sorts" class="sorts" >
              <el-cascader placeholder="搜分类名字 或 点击选择"
               :options="sortsList"
                :props="defaultProps"
                @change='getSortSelect'
                v-model='sortSelectArr'
                filterable></el-cascader>
            </el-form-item>
            <el-form-item label="所属品牌" prop="brand" class='brands'>
              <el-select v-model="valuebrand" placeholder="请选择" filterable  @change='getBrandSelect'>
                <el-option
                v-for="item in brandsList"
                :label="item.chineseName"
                :value="item.id"
                >
              </el-option>
            </el-select>
            </el-form-item>
            <el-form-item label="适用人群" prop="people">
              <el-checkbox-group v-model="ruleForm.professional">
                <el-checkbox label="儿童" name="type"></el-checkbox>
                <el-checkbox label="艺考生" name="type"></el-checkbox>
                <el-checkbox label="艺术家" name="type"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="库存管理" prop="titlebtn">
              <el-switch
              v-model="titlebtn"
              on-text=""
              off-text=""
              disabled>
            </el-switch>
            </el-form-item>
            <el-form-item label="是否上架" prop="titlebtn">
              <el-switch class="upswitch"
              v-model="grounding"
              on-text=""
              off-text="">
            </el-switch>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
        <el-col :span="16">
          <div class="right">
            <p class="title">商品高级设置</p>
            <el-tabs v-model="tabactive" type="card" @tab-click="tabClick">
              <el-tab-pane label="SKU" name="first">
                <el-form :model="SKUruleForm" :rules="SKUrules" ref="SKUruleForm" label-width="100px">
                  <el-form-item label="多规格" prop="multikind">
                    <el-switch
                    v-model="multikind"
                    on-text=""
                    off-text="">
                  </el-switch>
                  <span class='addmore' @click='addMore'>再加规格</span>
                  </el-form-item>
                  <div class="" v-if='multikind'>
                    <!-- 多规格控制部分start-->
                        <div class='inner-top'>
                          <el-form-item label="规格设置" prop="setting">
                            <ul class="selectlist">
                              <li class="selectlist-item" v-for='(selectline, index) in addmorearr' @click='chooseSelect(selectline, index)'>
                                <el-select v-model="selectline.defaultcontent" placeholder="请选择规格组" @change="markSubdata" >
                                  <el-option
                                    v-for="item in setting"
                                    :key="item.id"
                                    :label="item.groupName"
                                    :value="item.index">
                                  </el-option>
                                </el-select>
                                <el-select v-model="selectline.subdefault" multiple placeholder="请选择" class='moreselect' @change="getinner">
                                  <el-option
                                    v-for="item in substandardarr[index]"
                                    :key="item.id"
                                    :label="item.specificationName"
                                    :value="item.specificationName">
                                  </el-option>
                                </el-select>
                                <span class="delete" @click="deleteitem(selectline, index)">删除</span>
                                <!-- <span class="save" @click="saveitem(selectline, index)">保存规格</span> -->
                              </li>
                            </ul>
                          </el-form-item>
                        </div>
                        <!-- 添加规格控制部分end -->
                        <div class="inner-table-box">
                          <div class="inner-head">
                            SKU单品表
                               <el-button  type="primary" class="inner-btn" @click='addSingle'>添加单品</el-button>
                               <el-button class="inner-btn">批量改价</el-button>
                          </div>
                          <div class="SKUtable">
                            <el-table :data="SKUdata" style="width: 100%" border height='220'>
                              <el-table-column  type="selection" width="55">
                             </el-table-column>
                              <el-table-column prop="single" label="SKU单品">
                              </el-table-column>
                             <!-- 根据选择循环 -->
                              <el-table-column  class="newstandard-class"
                               v-for="(col, index) in cols" :prop="col.prop"
                               :label="col.label" :filters="tagChooseArr[index]"
                               :filter-method="filterTag"
                               filter-placement="bottom-end" >
                              </el-table-column>
                              <el-table-column prop="SKUcode"  label="SKU条码">
                              </el-table-column>
                              <el-table-column prop="market"  label="市场售价">
                              </el-table-column>
                              <el-table-column prop="platform"  label="平台售价">
                              </el-table-column>
                              <el-table-column prop="goodnum"  label="库存数量">
                              </el-table-column>
                              <el-table-column prop="operation"  label="操作"  width="100">
                                <template scope="scope">
                                <p class='edit' @click='editTableItem(scope.$index, scope.row)'>编辑</p>
                                <p class="delete" @click='deleteTableItem(scope.$index, scope.row)'>删除</p>
                              </template>
                              </el-table-column>
                            </el-table>
                          </div>
                          <!-- 添加单品弹框start -->
                          <el-dialog :title="singleTitle" :visible.sync="addSingleDialog" size="tiny" class="addsingledialog" >
                            <el-form :model="singleform" :rules='singlerules' ref="singleform">
                               <!-- item中的prop到时候要替换 -->
                             <el-form-item :label="chooseitem" prop='standards' v-for='(chooseitem, index) in standardarr' >
                               <div class="" @click='getGroupIndex(index)'>
                                 <el-select v-model="singleform.standards[index]" placeholder="请选择" @change='getindex' >
                                   <el-option
                                     v-for="(item, index) in chooseArr[index]"
                                     :key="index"
                                     :label="item"
                                     :value="item + ';' + index">
                                   </el-option>
                               </el-select>
                               </div>
                             </el-form-item>
                             <el-form-item label="市场售价" prop='marketitem'>
                               <el-input  class="dialoginput" v-model="singleform.marketitem" placeholder="请填写市场售价"></el-input>
                             </el-form-item>
                             <el-form-item label="平台售价" prop='platformitem'>
                               <el-input  class="dialoginput" v-model="singleform.platformitem" placeholder="请填写平台售价"></el-input>
                             </el-form-item>
                             <el-form-item label="SKU条码" prop='SKUitem'>
                               <el-input  class="dialoginput" v-model="singleform.SKUitem" placeholder="请填写平台售价"></el-input>
                             </el-form-item>
                             <el-form-item label="库存数量" prop='goodnumitem'>
                               <el-input  class="dialoginput" v-model="singleform.goodnumitem" placeholder="请填写库存数量"></el-input>
                             </el-form-item>

                           </el-form>
                            <span slot="footer" class="dialog-footer">
                              <el-button @click="addSingleDialog = false">取 消</el-button>
                              <el-button type="primary" class='' @click="confirmAdd('singleform')">确 定</el-button>
                            </span>
                          </el-dialog>
                          <!-- 添加单品弹框end -->
                        </div>
                      </div>
                    <!-- 单规格 -->
                  <div v-else='multikind'>
                    <el-form-item label="SKU条码" prop="SKUcode" >
                      <el-input class="leftInp" v-model="SKUruleForm.SKUcode"></el-input>
                    </el-form-item>
                    <el-form-item label="市场售价" prop="markesell">
                      <el-input class="leftInp" v-model="SKUruleForm.markesell"></el-input>
                    </el-form-item>
                    <el-form-item label="平台售价" prop="platformsell">
                      <el-input class="leftInp" v-model="SKUruleForm.platformsell"></el-input>
                    </el-form-item>
                    <el-form-item label="库存数量" prop="goodnum">
                      <el-input class="leftInp" v-model="SKUruleForm.goodnum"></el-input>
                    </el-form-item>
                  </div>
                </el-form>
              </el-tab-pane>
              <el-tab-pane label="商品属性" name="second">
                <div class="inner-table-box goodAttr">
                  <div class="inner-head">
                    商品属性维护
                       <el-button class="inner-btn" @click="addStandard">添加属性</el-button>
                  </div>
                  <!-- 添加属性表格 -->
                  <div class="attrtable">
                    <!-- bug: 表格内容不居中 -->
                    <el-table :data="attrdata" style="width: 100%" border>
                      <el-table-column prop="name"  label="属性名称"  width="150">
                      </el-table-column>
                      <el-table-column prop="value"  label="属性内容">
                      </el-table-column>
                      <el-table-column prop="attroperation"  label="操作"  width="100">
                        <template scope="scope">
                        <p class='edit' @click='editAttrItem(scope.$index)'>编辑</p>
                        <p class="delete" @click='deleteAttrItem(scope.$index)'>删除</p>
                      </template>
                      </el-table-column>
                    </el-table>
                  </div>
                  <!-- 添加属性弹框start-->
                  <el-dialog title="添加商品属性" :visible.sync="addAttrDialog" size="tiny" class="addAttrdialog">
                    <el-form :model="attrform" :rules='attrrules' ref="attrform">
                     <el-form-item label="属性名称" prop='nameitem'>
                       <el-input  class="dialoginput" v-model="attrform.nameitem" placeholder="请填写属性名称"></el-input>
                     </el-form-item>
                     <el-form-item label="属性内容" prop='contentitem'>
                       <el-input  class="dialoginput" v-model="attrform.contentitem" placeholder="请填写属性内容"></el-input>
                     </el-form-item>
                   </el-form>
                    <span slot="footer" class="dialog-footer">
                      <el-button @click="addAttrDialog = false">取 消</el-button>
                      <el-button type="primary" class='' @click="toAddAttr">确 定</el-button>
                    </span>
                  </el-dialog>
                  <!-- 添加属性弹框end -->
                 </div>
              </el-tab-pane>

              <el-tab-pane label="商品详情" name="third">
                <div class="detail-box">
                  <el-form :model="detailForm" :rules="detailrules" ref="detailForm" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="商品主图" prop="pictureitem" class="mainPicBox" id='mainPicDom'>
                      <el-upload class="upload-demo mainPicUpload"
                      :action="uploadUrl"
                      list-type="picture-card"
                      :file-list="mainPicList"
                      :on-change='uploadMainPic'
                      :on-remove='mainPicRemove'
                      :data='goodParams'
                      name="picture" drag multiple>
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                        <div class="el-upload__tip" slot="tip" style="margin-top: 34px;">上传 jpg/png 图片文件，且不超过500kb，规格建议800*800</div>
                      </el-upload>
                    </el-form-item>
                    <el-form-item label="商品详情" prop="detailitem">

                      <div class="editorbox">
                        <v-editor v-model='editorContent' :curType='myType'></v-editor>
                      </div>
                    </el-form-item>
                    <el-form-item label="备注" prop="remarckitem">
                      <el-input v-model='gooddetailremark'></el-input>
                    </el-form-item>
                    <el-form-item label="商品简介" prop="introitem">
                      <el-input v-model='goodIntro'></el-input>
                    </el-form-item>
                  </el-form>
                </div>
              </el-tab-pane>
              <el-tab-pane label="分享设置" name="fourth">
                <div class="sharesetting">
                  <el-form label-width="100px">
                    <el-form-item label="分享封面">
                      <el-radio-group v-model="sharecover" @change='chooseSharePoster'>
                        <el-radio class="radio" label="mainpicture">使用商品主图</el-radio>
                        <el-radio class="radio" label="selfpicture">自定义封面</el-radio>
                      </el-radio-group>
                      <div class="uploadIconBox" v-show='selfpictureShow'>
                        <el-upload id='selfPosterUploadDom'
                        class="upload-demo"
                        drag
                        list-type="picture"
                        name="picture"
                        :on-success='selfPosterSuccess'
                        :on-remove="selfPosterRemove"
                        :data='otherParams'
                        :action="uploadUrl"
                      >
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                        <div class="el-upload__tip" slot="tip">上传 jpg/png 图片文件，且不超过100kb，规格建议100*100</div>
                      </el-upload>
                    </div>
                  </el-form-item>
                  <el-form-item label='分享标题'>
                    <el-radio-group v-model="sharetitle" @change='chooseShareTitle'>
                      <el-radio class="radio" label="maintitle">使用商品标题</el-radio>
                      <el-radio class="radio" label="selftitle">自定义标题</el-radio>
                    </el-radio-group>
                    <div class="uploadIconBox" v-show='selftitleShow'>
                      <el-input class="iconTitleInp" v-model='selfTitleInp'></el-input>
                    </div>
                  </el-form-item>
                  <el-form-item label='分享描述' class='discription'>
                    <div class="discription">
                      <el-input class="discription-inp" v-model="sharediscription" placeholder="请填写分享描述"></el-input>
                    </div>
                  </el-form-item>
                </el-form>
                </div>
              </el-tab-pane>
              <el-tab-pane label="商品标签" name="fifth">
                <el-tag
                  :key="tag.tagName"
                  v-for="tag in dynamicGoodsTags"
                  class='newAddTag'
                  :closable="true"
                  :close-transition="false"
                  @close="handleClose(tag)"
                >
                {{tag.tagName}}
                </el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="inputVisible"
                  v-model="inputValue"
                  ref="saveTagInput"
                  size="mini"
                  @keyup.enter.native="handleInputConfirm"
                  @blur="handleInputConfirm"
                >
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput">+新增标签</el-button>

              </el-tab-pane>
            </el-tabs>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="bottompart">
      <el-button type="primary" class="createbtn" @click='createAtOnce' id='allsaveBtn'>保存{{currentBtnContent}}</el-button>
    </div>

    <!-- 内容部分end -->
  </div>
</template>

<script>
import vEditor from '../../../editor'
import qs from 'querystring'

export default {
  components: {
    vEditor
  },
  data () {
    return {
      myType: 'good',
      goodID: '',
      ruleForm: {
        code: '',
        title: '',
        sort: '',
        brand: '',
        professional: []
      },
      rules: {
        code: [{
          required: true,
          message: '请输入商品编码',
          trigger: 'blur'
        },
        {
          min: 3,
          max: 5,
          message: '长度在 3 到 5 个字符',
          trigger: 'blur'
        }],
        title: [{
          required: true,
          message: '请输入商品标题',
          trigger: 'blur'
        }],
        sorts: [{
          required: true,
          message: '请输入所属分类',
          trigger: 'blur'
        }],
        brand: [{
          required: true,
          message: '请输入所属品牌',
          trigger: 'blur'
        }],
        professional: [
          { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }
        ]
      },
      defaultProps: {
        children: 'categoryList',
        label: 'name',
        value: 'id'
      },
      // 所属分类
      sortsList: [],
      brandsList: [],
      // 所属品牌
      valuebrand: '',
      // 商品标题btn
      titlebtn: true,
      grounding: true,
      // 选项卡
      tabactive: 'first',
      // SKUrules
      SKUruleForm: {
        setting: ''
      },
      SKUrules: {
        setting: [{
          required: true,
          message: '规格设置',
          trigger: 'blur'
        }]
      },
      multikind: false,
      // 规格设置
      valuesetting: '',
      valuemoresetting: '',
      // 规格设置
      standardList: [],
      setting: [{
        // 这个值后台传来必须是value
        value: '0',
        label: '颜色',
        subsetting: [
          {option: '红色'},
          {option: '黄色'},
          {option: '蓝色'},
          {option: '绿色'},
          {option: '紫色'}
        ]
      }, {
        value: '1',
        label: '硬度',
        subsetting: [
          {option: '硬度1'},
          {option: '硬度2'},
          {option: '硬度3'},
          {option: '硬度4'},
          {option: '硬度5'}
        ]
      }, {
        value: '2',
        label: '容量',
        subsetting: [
          {option: '容量1'},
          {option: '容量2'},
          {option: '容量3'},
          {option: '容量4'},
          {option: '容量5'}
        ]
      }],
      moresetting: '',
      addmorearr: [{
        index: 0,
        defaultcontent: '',
        subdefault: '',
        // 解决弹框填完后渲染到表格时规格统一
        prop: '',
        submark: [{
          // 这个值后台传来必须是value
          value: '0',
          label: '颜色',
          subsetting: [
            {option: '红色'},
            {option: '黄色'},
            {option: '蓝色'},
            {option: '绿色'},
            {option: '紫色'}
          ]
        }, {
          value: '1',
          label: '硬度',
          subsetting: [
            {option: '硬度1'},
            {option: '硬度2'},
            {option: '硬度3'},
            {option: '硬度4'},
            {option: '硬度5'}
          ]
        }, {
          value: '2',
          label: '容量',
          subsetting: [
            {option: '容量1'},
            {option: '容量2'},
            {option: '容量3'},
            {option: '容量4'},
            {option: '容量5'}
          ]
        }]
      }],
      // 规格删除btn数组
      selectinit: 1,
      // SKU表格
      SKUdata: [],
      // 商品属性表格
      attrdata: [],
      addSingleDialog: false,
      addAttrDialog: false,
      // 添加单品表单
      singleform: {
        standards: [],
        marketitem: '',
        platformitem: '',
        SKUitem: '',
        goodnumitem: ''
      },
      singlerules: {
        standards: [{
          type: 'array',
          required: true,
          message: '请输入规格',
          trigger: 'blur'
        }],
        marketitem: [{
          required: true,
          message: '请输入市场售价',
          trigger: 'blur'
        }],
        platformitem: [{
          required: true,
          message: '请输入平台售价',
          trigger: 'blur'
        }],
        SKUitem: [{
          required: true,
          message: '请输入SKU条码',
          trigger: 'blur'
        }],
        goodnumitem: [{
          required: true,
          message: '请输入库存数量',
          trigger: 'blur'
        }]
      },
      // 商品属性表单
      attrform: {
        nameitem: '',
        contentitem: ''
      },
      attrrules: {
        nameitem: [{
          required: true,
          message: '请输入属性名称',
          trigger: 'blur'
        }],
        contentitem: [{
          required: true,
          message: '请输入属性内容',
          trigger: 'blur'
        }]
      },
      // 商品详情表单
      detailForm: {
        pictureitem: '',
        detailitem: ''
      },
      detailrules: {
        pictureitem: [{
          required: true,
          message: '请上传图片',
          trigger: 'blur'
        }],
        detailitem: [{
          required: true,
          message: '请输入商品详情',
          trigger: 'blur'
        }]
      },
      // 弹框绑定数据
      selectcolor: '',
      selectmarcket: '',
      selectplatform: '',
      selectSKU: '',
      // 传递到弹框中的新增规格数组
      standardarr: [],
      // 对应二级
      substandardarr: [],
      // 根据索引改数组
      standardIndex: '',
      // 拿到所选的二级数据渲染到弹框
      getchooseItem: '',
      // 规格标签数组
      chooseArr: [],
      // 让添加的单品弹框中选择的每个规格保存在一个数组中
      chooseDoneArr: [],
      // 添加规格弹框提交的数据
      postArr: [],
      propsArr: [],
      targetJson: [],
      cols: [],
      dialogStatusEdit: false,
      editAttrStatus: false,
      // 表格编辑、删除的index
      editItemIndex: '',
      editAttrIndex: '',
      // 绑定tag数组
      tagChooseArr: [],
      sharecover: 'mainpicture',
      sharetitle: 'maintitle',
      sharediscription: '',
      // 上传图片地址
      uploadUrl: '',
      // 商品主图列表
      mainPicList: [],
      dialogImageUrl: '',
      // 展示的小图
      smallImgList: [],
      // 分享设置中自定义封面是否出现
      selfpictureShow: false,
      selftitleShow: false,
      selfTitleInp: '',
      // 动态添加商品标签
      dynamicGoodsTags: [],
      inputVisible: false,
      inputValue: '',
      // 商品详情备注
      gooddetailremark: '',
      // 商品简介
      goodIntro: '',
      //  上传图片其他参数
      otherParams: {
        goodsId: 0
      },
      // 获取分类数组及三级的ID
      sortSelectArr: [],
      getThirdId: '',
      getBrandId: '',
      // 商品信息数组
      goodsJson: [],
      // 当前按钮内容
      currentBtnContent: 'SKU',
      // 新生成的规格组信息
      newgroupArr: [],
      // groupArr: [],
      // 上传图片时候参数
      goodParams: {
        goodsId: ''
      },
      editorContent: null,
      selfImgUrl: '',
      singleTitle: '添加单品',
      onOff: true
      // lastGroupArr: []
    }
  },
  methods: {
    // 立即创建
    createAtOnce () {
      // 保存SKU
      if (this.currentBtnContent === 'SKU') {
        for (var i = 0; i < this.ruleForm.professional.length; i++) {
          if (this.ruleForm.professional[i] === '艺术家') {
            this.ruleForm.professional[i] = '905496907288801280'
          } else if (this.ruleForm.professional[i] === '儿童') {
            this.ruleForm.professional[i] = '905496956341186560'
          } else if (this.ruleForm.professional[i] === '艺考生') {
            this.ruleForm.professional[i] = '905497000209412096'
          }
        }
        this.goodsJson = []
        if (this.multikind === false) {
          // 单规格
          console.log('单规格')
          this.goodsJson.push({
            specificationDescribe: '',
            specificationId: '',
            marketPrice: this.SKUruleForm.markesell,
            price: this.SKUruleForm.platformsell,
            sku: this.SKUruleForm.SKUcode,
            stocks: this.SKUruleForm.goodnum
          })
        } else {
          console.log('多规格')
          // 多规格 将SKUdata数据做转换
          for (var j = 0; j < this.SKUdata.length; j++) {
            var standardString = ''
            for (var k = 0; k < this.addmorearr.length; k++) {
              standardString = standardString + this.SKUdata[j]['standard' + k] + ' '
            }
            // 去掉最后一个空格
            standardString = standardString.substring(0, standardString.length - 1)
            console.log('推之前查看', this.lastGroupArr, standardString)
            this.goodsJson.push({
              specificationDescribe: standardString,
              marketPrice: this.SKUdata[j].market,
              price: this.SKUdata[j].platform,
              sku: this.SKUdata[j].SKUcode,
              stocks: this.SKUdata[j].goodnum,
              specificationId: this.lastGroupArr[j]
            })
          }
        }
        console.log('商品id', this)
        console.log('商品id', this.goodID)
        console.log('商品标题', this.ruleForm.title)
        console.log('分类所选三级id', this.getThirdId)
        console.log('品牌所选id', this.getBrandId)
        console.log('所选专业度', this.ruleForm.professional)
        console.log('是否上架', this.grounding)
        console.log('商品json', this.goodsJson)
        console.log('SKU表数据', this.SKUdata)
        // 保存sku
        var skuSave = this.HOST + '/goods/add'
        this.$http.post(skuSave, qs.stringify({
          id: this.goodID,
          title: this.ruleForm.title,
          brandId: this.getBrandId,
          cateyoryId: this.getThirdId,
          professions: this.ruleForm.professional,
          status: this.grounding,
          dataJson: JSON.stringify(this.goodsJson)
        })).then(res => {
          console.log(res, '保存res')
          if (res.data.code === '0000') {
            this.$message({
              message: '保存SKU成功',
              type: 'success'
            })
          } else {
            this.$message({
              message: '保存SKU失败',
              type: 'warning'
            })
          }
          console.log('保存sku返回', res.data)
        })
      }
      // 保存商品属性
      if (this.currentBtnContent === '商品属性') {
        console.log(this.attrform.nameitem, '属性名称')
        console.log(this.attrform.contentitem, '属性内容')
        // var goodPropertyUrl = thi.HOST + '/goods/addProperty'
        // this.$http.post(goodPropertyUrl, qs.stringify({
        //   id: this.goodID
        // }))
      }
      if (this.currentBtnContent === '商品详情') {
        console.log('富文本内容', this.editorContent)
        var goodDetailUrl = this.HOST + '/goods/addDetails'
        this.$http.post(goodDetailUrl, qs.stringify({
          id: this.goodID,
          pictures: this.smallImgList,
          details: this.editorContent,
          remark: this.gooddetailremark,
          intro: this.goodIntro
        })).then(res => {
          if (res.data.code === '0000') {
            this.$message({
              message: '添加详情成功',
              type: 'success'
            })
          }
        })
      }
      if (this.currentBtnContent === '分享设置') {
        if (this.sharecover === 'mainpicture') {
          this.sharecover = false
        } else {
          this.sharecover = true
        }
        if (this.sharetitle === 'maintitle') {
          this.sharetitle = false
        } else {
          this.sharetitle = true
        }
        var sharesettingUrl = this.HOST + '/goods/addShare'
        this.$http.post(sharesettingUrl, qs.stringify({
          goodsBaseId: this.goodID,
          imgType: this.sharecover,
          titleType: this.sharetitle,
          describe: this.sharediscription,
          img: this.selfImgUrl,
          title: this.selfTitleInp
        })).then(res => {
          if (res.data.code === '0000') {
            this.$message({
              message: '分享设置保存成功',
              type: 'success'
            })
            // 保存时是当前状态
            if (this.sharecover === false) {
              this.sharecover = 'mainpicture'
            } else {
              this.sharecover = 'selfpicture'
            }
            if (this.sharetitle === false) {
              this.sharetitle = 'maintitle'
            } else {
              this.sharetitle = 'selftitle'
            }
          } else {
            this.$message({
              message: '分享设置保存失败',
              type: 'warning'
            })
          }
        })
      }
    },
    // 获取商品属性列表
    getPropertyList () {
      var getPropertyListUrl = this.HOST + '/goods/allProperty'
      this.$http.post(getPropertyListUrl, qs.stringify({
        id: this.goodID
      })).then(res => {
        this.attrdata = res.data.list
        console.log('属性列表', res.data.list)
      })
    },
    // 获取商品所属分类所选项
    getSortSelect (val) {
      this.getThirdId = val[2]
    },
    getBrandSelect (val) {
      this.getBrandId = val
    },
    chooseSelect (item, LineIndex) {
      console.log('当前是第几行' + LineIndex)
      this.standardIndex = LineIndex
      this.getchooseItem = item
      console.log(item.subdefault)
    },
    getinner () {
      console.log('当前条目信息', this.getchooseItem)
      // 弹框出现后选择二级 v-model没做完
      this.chooseArr[this.standardIndex] = this.getchooseItem.subdefault
      var tagArr = []
      // 初始length报错
      console.log(this.chooseArr[this.standardIndex])
      for (var i = 0; i < this.chooseArr[this.standardIndex].length; i++) {
        tagArr.push({
          text: this.chooseArr[this.standardIndex][i],
          value: this.chooseArr[this.standardIndex][i]
        })
      }
      // 可勾选的tag数组
      this.tagChooseArr[this.standardIndex] = tagArr
      console.log('tagArr', tagArr)
      console.log('tagChooseArr', this.tagChooseArr)
      console.log(this.chooseArr[this.standardIndex])
    },
    // 匹配子数据
    markSubdata (selectIndex) {
      // 未解决重选时之前数据清空
      this.addmorearr[this.standardIndex].subdefault = []
      console.log('已选规格数组' + this.chooseArr)
      console.log(selectIndex + 'selectIndex')
      // 取所选项目的数据赋值给对应行数
      // 默认数据
      // 替换
      this.substandardarr.splice(this.standardIndex, 1, this.setting[selectIndex].specifications)
      // 生成数组
      this.substandardarr[this.standardIndex] = this.setting[selectIndex].specifications
      // index是匹配子list standardIndex是匹配点击第几个规格
      if (this.standardarr.indexOf(this.setting[selectIndex].groupName) === -1) {
        this.standardarr[this.standardIndex] = this.setting[selectIndex].groupName
        console.log('1' + this.standardarr)
      } else {
        // 未解决有警告但是选择后还是会显示
        this.$notify.error({
          title: '错误',
          message: '请勿选择相同规格'
        })
        // 这句话操作过程中会报错
        this.addmorearr[this.standardIndex].defaultcontent = ''
      }
      console.log('渲染到弹框数据开始')
      console.log(this.standardarr)
      console.log(this.substandardarr)
      console.log('渲染到弹框数据结束')
    },
    // 返回商品库
    backStore () {
      this.$router.push({
        path: 'store'
      })
    },
    // 选项卡
    tabClick (tab, event) {
      this.currentBtnContent = tab.label
      // 位商品标签时去除保存按钮
      if (this.currentBtnContent === '商品标签') {
        document.getElementById('allsaveBtn').style = 'display:none'
      } else {
        document.getElementById('allsaveBtn').style = 'display:block'
      }
    },
    // 再加规格
    addMore () {
      if (this.multikind) {
        this.addmorearr.push({
          index: this.selectinit++,
          defaultcontent: '',
          subdefault: '',
          prop: ''
        })
      }
    },
    // 两个删除
    deleteitem (item, index) {
      console.log('删条目')
      console.log(index)
      console.log(item)
      this.addmorearr.splice(index, 1)
      this.standardarr.splice(index, 1)
      // 删除调接口
      console.log(this.newgroupArr[index].groupId)
      var deleteStandard = this.HOST + '/goods/deleteSpecification'
      this.$http.post(deleteStandard, qs.stringify({
        groupId: this.newgroupArr[index].groupId
      })).then(res => {
        if (res.data.code === '0000') {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
        }
        console.log('删了以后', this.addmorearr)
      })
    },
    getGroupIndex (index) {
      // 当前行index
      this.curGroupIndex = index
      console.log('die', index)
    },
    // 保存规格调用接口
    saveitem (item, index) {
      console.log('保存规格', this.setting[item.defaultcontent].groupName, item.subdefault, index)
      this.newgroupArr = []
      var saveStandard = this.HOST + '/goods/specification'
      // 调用接口获取新id
      this.$http.post(saveStandard, qs.stringify({
        groupName: this.setting[item.defaultcontent].groupName,
        specifications: item.subdefault,
        goodsId: this.goodID
      })).then(res => {
        if (res.data.code === '0000') {
          this.$message({
            message: '规格保存成功',
            type: 'success'
          })
          this.newgroupArr[index] = res.data
          for (var i = 0; i < this.newgroupArr.length; i++) {
            this.groupArr[i] = ''
          }
          // this.newgroupId = res.data.groupId
          console.log('重新生成的规格组', this.newgroupArr)
        } else {
          this.$message.error('规格保存失败')
        }
      })
    },
    getindex (val) {
      var choseIndex = val.split(';')[1]
      this.groupArr[this.curGroupIndex] = this.newgroupArr[this.curGroupIndex].specificationIds[choseIndex]
      console.log(this.newgroupArr[this.curGroupIndex])
      console.log(this.groupArr, '当前数组', this)
      // var testsave = window.sessionStorage.setItem('curItem', this.groupArr)
      // console.log(testsave)
    },
    // 添加单品弹框
    addSingle () {
      console.log('添加单品时', this.addmorearr)
      // saveitem只能触发一次
      if (this.onOff) {
        console.log('执行保存规格')
        for (var i = 0; i < this.addmorearr.length; i++) {
          this.saveitem(this.addmorearr[i], i)
        }
        this.onOff = false
      }
      this.addSingleDialog = true
      //  弹框是添加状态而不是编辑状态
      this.dialogStatusEdit = false

      // 弹框出现时数据清空
      this.singleform.marketitem = ''
      this.singleform.platformitem = ''
      this.singleform.SKUitem = ''
      this.singleform.goodnumitem = ''

      this.singleform.standards = []
    },
    // 确认是否上架
    confirmAdd (formName) {
      if (this.dialogStatusEdit === true) {
        // alert('编辑状态')
      }
      if (this.addSingleDialog === true) {
        // 匹配规格id的数组
        console.log('终极数组之前', this.lastGroupArr)
        // this.lastGroupArr.push(window.sessionStorage.getItem('curItem'))
        this.lastGroupArr.push(JSON.parse(JSON.stringify(this.groupArr)))
        console.log('终极数组之后', this.lastGroupArr)
        this.singleTitle = '添加单品'
        console.log('chooseDoneArr', this.chooseDoneArr)
        this.$refs[formName].validate((valid) => {
          if (valid) {
            console.log('还没加入SKUdata', this.SKUdata)
            console.log('还没加入targetJson', this.targetJson)
            for (var m in this.targetJson) {
              delete this.targetJson[m]
            }
            // 首次清空列数防止再添加时累积添加
            this.cols = []
            this.targetJson['single'] = ''
            console.log('表格', this.singleform)
            for (var i = 0; i < this.singleform.standards.length; i++) {
              // 规格的列数
              this.cols.push({prop: 'standard' + i, label: '规格'})
              this.targetJson['standard' + i] = this.singleform.standards[i].split(';')[0]
              this.targetJson['single'] += this.singleform.standards[i].split(';')[0] + ' '
            }
            console.log('cols', this.cols)
            console.log('singleform', this.singleform)
            this.targetJson['market'] = this.singleform.marketitem
            this.targetJson['platform'] = this.singleform.platformitem
            this.targetJson['SKUcode'] = this.singleform.SKUitem
            this.targetJson['goodnum'] = this.singleform.goodnumitem
            var newArr = []
            for (var p in this.targetJson) {
              newArr[p] = this.targetJson[p]
            }
            console.log('newArr', newArr)
            console.log('targetJson不变', this.targetJson)
            // 根据状态（添加/编辑）处理数据
            if (this.dialogStatusEdit) {
              this.SKUdata.splice(this.editItemIndex, 1, newArr)
            } else {
              // 编辑状态改变数据
              this.SKUdata.push(newArr)
            }
            console.log('加入成功SKUdata', this.SKUdata)
            this.addSingleDialog = false
          } else {
            console.log('有未填字段')
            return false
          }
        })
      }
    },
    // 编辑删除表格项
    editTableItem (index, row) {
      this.singleTitle = '编辑单品'
      this.editItemIndex = index
      console.log(index, row)
      this.dialogStatusEdit = true
      this.addSingleDialog = true
      this.singleform.marketitem = row.market
      this.singleform.platformitem = row.platform
      this.singleform.SKUitem = row.SKUcode
      this.singleform.goodnumitem = row.goodnum
      // 先只能写死 垃圾代码
      if (row.standard0) {
        this.singleform.standards[0] = row.standard0
      }
      if (row.standard1) {
        this.singleform.standards[1] = row.standard1
      }
      if (row.standard2) {
        this.singleform.standards[2] = row.standard2
      }
      if (row.standard3) {
        this.singleform.standards[3] = row.standard3
      }
      if (row.standard4) {
        this.singleform.standards[4] = row.standard4
      }
      if (row.standard5) {
        this.singleform.standards[5] = row.standard5
      }
      if (row.standard6) {
        this.singleform.standards[6] = row.standard6
      }
      if (row.standard7) {
        this.singleform.standards[7] = row.standard7
      }
      if (row.standard8) {
        this.singleform.standards[8] = row.standard8
      }
      if (row.standard9) {
        this.singleform.standards[9] = row.standard9
      }
      if (row.standard10) {
        this.singleform.standards[10] = row.standard10
      }
      if (row.standard11) {
        this.singleform.standards[11] = row.standar11
      }
      if (row.standard12) {
        this.singleform.standards[12] = row.standard12
      }
      if (row.standard13) {
        this.singleform.standards[13] = row.standard13
      }
      if (row.standard14) {
        this.singleform.standards[14] = row.standard14
      }
      if (row.standard15) {
        this.singleform.standards[15] = row.standard15
      }
      if (row.standard16) {
        this.singleform.standards[16] = row.standard16
      }
      if (row.standard17) {
        this.singleform.standards[17] = row.standard17
      }
      if (row.standard18) {
        this.singleform.standards[18] = row.standard18
      }
      if (row.standard19) {
        this.singleform.standards[19] = row.standard19
      }
      if (row.standard20) {
        this.singleform.standards[20] = row.standard20
      }
      if (row.standard21) {
        this.singleform.standards[21] = row.standard21
      }
      if (row.standard22) {
        this.singleform.standards[22] = row.standard22
      }
      if (row.standard23) {
        this.singleform.standards[23] = row.standard23
      }
      if (row.standard24) {
        this.singleform.standards[24] = row.standard24
      }
      if (row.standard25) {
        this.singleform.standards[25] = row.standard25
      }
      if (row.standard26) {
        this.singleform.standards[26] = row.standard26
      }
      if (row.standard27) {
        this.singleform.standards[27] = row.standard27
      }
      if (row.standard28) {
        this.singleform.standards[28] = row.standard28
      }
      if (row.standard29) {
        this.singleform.standards[29] = row.standard29
      }
      if (row.standard30) {
        this.singleform.standards[30] = row.standard30
      }
      // for (var i = 0; i < 20; i++) {
      //   var standardIndex = 'standard' + i
      //   if (row.standardIndex) {
      //     this.singleform.standards[i] = row.standardIndex
      //   }
      //   console.log(standardIndex)
      //   console.log(row.standardIndex)
      // }
      // this.singleform.standards[1] = row.standard1
    },
    deleteTableItem (index, row) {
      this.SKUdata.splice(index, 1)
    },
    testIndex (index) {
      console.log('第几纵列' + index)
    },
    filterTag (value, row) {
      console.log('筛选', value, row)
      // 数据不对应bug
      for (var i = 0; i <= this.standardIndex; i++) {
        console.log('i', i)
        console.log(this.cols[i].prop)
        if (row[this.cols[i].prop] === value) {
          return row[this.cols[i].prop] === value
        }
      }
    },
    // 商品属性添加规格
    addStandard () {
      this.addAttrDialog = true
      this.editAttrStatus = false
    },
    editAttrItem (index) {
      this.editAttrIndex = index
      this.editAttrStatus = true
      this.addAttrDialog = true
    },
    deleteAttrItem (index) {
      // 删除商品属性
      this.attrID = this.attrdata[index].id
      var deteleGoodProperty = this.HOST + '/goods/deleteProperty'
      this.$http.post(deteleGoodProperty, qs.stringify({
        id: this.attrID
      })).then(res => {
        if (res.data.code === '0000') {
          this.$message({
            message: '商品属性删除成功',
            type: 'success'
          })
          this.getPropertyList()
        } else {
          this.$message({
            message: '商品属性删除失败',
            type: 'warning'
          })
        }
      })
      // this.attrdata.splice(index, 1)
    },
    toAddAttr () {
      var addGoodPropertyUrl = this.HOST + '/goods/addProperty'
      var updateGoodPropertyUrl = this.HOST + '/goods/updateProperty'
      if (this.editAttrStatus) {
        // 编辑
        this.attrID = this.attrdata[this.editAttrIndex].id

        this.$http.post(updateGoodPropertyUrl, qs.stringify({
          id: this.attrID,
          name: this.attrform.nameitem,
          value: this.attrform.contentitem
        })).then(res => {
          if (res.data.code === '0000') {
            this.$message({
              message: '商品属性编辑成功',
              type: 'success'
            })
            this.getPropertyList()
          } else {
            this.$message({
              message: '商品属性编辑失败',
              type: 'warning'
            })
          }
        })
        // this.attrdata.splice(this.editAttrIndex, 1, {
        //   nameitem: this.attrform.nameitem,
        //   contentitem: this.attrform.contentitem
        // })
      } else {
        // 添加
        this.$http.post(addGoodPropertyUrl, qs.stringify({
          id: this.goodID,
          name: this.attrform.nameitem,
          value: this.attrform.contentitem
        })).then(res => {
          if (res.data.code === '0000') {
            this.$message({
              message: '商品属性添加成功',
              type: 'success'
            })
            this.getPropertyList()
          } else {
            this.$message({
              message: '商品属性添加失败',
              type: 'warning'
            })
          }
        })
        // this.attrdata.push({
        //   nameitem: this.attrform.nameitem,
        //   contentitem: this.attrform.contentitem
        // })
      }
      this.attrform.nameitem = ''
      this.attrform.contentitem = ''
      this.addAttrDialog = false
    },
    // 分享设置部分
    chooseSharePoster (value) {
      if (value === 'selfpicture') {
        this.selfpictureShow = true
      } else {
        this.selfpictureShow = false
      }
    },
    chooseShareTitle (value) {
      if (value === 'selftitle') {
        this.selftitleShow = true
      } else {
        this.selftitleShow = false
      }
      console.log(value)
    },
    uploadMainPic (file, fileList) {
      console.log('当前上传图地址', file.url)
      console.log('主图文件列表', fileList)
      document.getElementById('mainPicDom').style.height = '314px'

      this.dialogImageUrl = file.url
      // this.smallImgList = fileList
      for (var i = 0; i < fileList.length; i++) {
        if (fileList[i].response !== undefined) {
          console.log('数组元素', fileList[i].response)
          this.smallImgList[i] = fileList[i].response.data[0]
        }
      }
      console.log('路径数组', this.smallImgList)
    },
    mainPicRemove (file, fileList) {
      console.log('移除', file, fileList)
      if (fileList.length === 0) {
        document.getElementById('mainPicDom').style.height = '215px'
      }
    },
    // 分享设置自定义封面上传成功
    selfPosterSuccess (response, file, fileList) {
      if (response) {
        document.getElementById('selfPosterUploadDom').getElementsByTagName('div')[0].style.display = 'none'
      }
      console.log('自定义封面上传成功', response, file, fileList)
      this.selfImgUrl = response.data[0]
      console.log(this.selfImgUrl)
    },
    selfPosterRemove (file) {
      if (file) {
        document.getElementById('selfPosterUploadDom').getElementsByTagName('div')[0].style.display = 'block'
      }
      console.log('自定义封面移除', file)
    },
    // 动态新增标签
    goodTagClose (tag) {
      this.dynamicGoodsTags.splice(this.dynamicGoodsTags.indexOf(tag), 1)
    },
    showInput () {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleInputConfirm () {
      let inputValue = this.inputValue
      var addtagUrl = this.HOST + '/goods/addTage'
      if (inputValue) {
        this.$http.post(addtagUrl, qs.stringify({
          goodsId: this.goodID,
          name: inputValue
        })).then(res => {
          if (res.data.code === '0000') {
            this.$message({
              message: '新增标签成功',
              type: 'success'
            })
            this.dynamicGoodsTags.push({
              tagName: inputValue,
              id: res.data.value
            })
            this.inputVisible = false
            this.inputValue = ''
          } else {
            this.$message({
              message: '新增标签失败',
              type: 'waring'
            })
          }
        })
      }
      this.inputVisible = false
      this.inputValue = ''
    },
    handleClose (tag) {
      var deleteTagUrl = this.HOST + '/goods/tagDelete'
      this.$http.post(deleteTagUrl, qs.stringify({
        id: tag.id
      })).then(res => {
        if (res.data.code === '0000') {
          // 前台进行标签移除 标签列表不再请求接口
          this.$message({
            message: '删除标签成功',
            type: 'success'
          })
          this.dynamicGoodsTags.splice(this.dynamicGoodsTags.indexOf(tag), 1)
        } else {
          this.$message({
            message: '删除标签失败，请稍后再试',
            type: 'warning'
          })
        }
      })
    },
    // 弹窗内部的是否上架
    ifgrounding: true
  },
  mounted () {
    this.groupArr = []
    this.lastGroupArr = []
    this.uploadUrl = this.HOST + '/picture/update'
    // 获取分类
    var sortListUrl = this.HOST + '/productCategory/selectAll'
    // 品牌下拉
    var getBrandListUrl = this.HOST + '/brand/inquire'
    // 获取商品id
    var getGoodID = this.HOST + '/goods/getId'
    var getAllStandard = this.HOST + '/specification/all'
    this.$http(sortListUrl).then(res => {
      this.sortsList = res.data.list
      // console.log('分类列表', res.data.list)
    })
    this.$http(getBrandListUrl, {params: {
      page: 1,
      count: 99999
    }}).then(res => {
      this.brandsList = res.data.list
      console.log('品牌列表', res.data.list)
    })
    // 调获取商品id接口
    this.$http(getGoodID).then(res => {
      this.goodID = res.data.msg
      this.goodParams.goodsId = res.data.msg
      console.log('商品id', this.goodID)
      console.log('上传图片传参时带id', this.goodParams)
    })
    this.$http(getAllStandard).then(res => {
      this.setting = res.data.list
      // console.log('全部规格', this.setting)
    })
  }
}
</script>

<style lang="scss" scoped>
@import "../../../../assets/css/common.scss";
.el-table {
  .cell{
    text-align: left !important;
  }
}
.addgood {
   background: #fff;
    height: 100%;
    padding: 0 25px;
    position: relative;
    .maincontent {
        padding-top: 24px;
        .title {
            font-family: 'MicrosoftYaHei';
            font-size: 16px;
            color: #8492a6;
            letter-spacing: 0;
            text-align: left;
            margin-bottom: 20px;
        }
        .left {
            padding-right: 26px;
            .sorts{
              .el-cascader{
                display: block;
              }
              .el-input{
                width: 100%;
              }
            }
            .brands{
              .el-select{
                display: block;
              }
            }
        }
        .right {
          .leftInp{
            width: 40%;
          }
          .addmore{
            cursor: pointer;
            margin-right: 9px;
            font-size: 14px;
            color: #20a0ff;
            float: right;
            margin-right: 40px;
          }
          .moreselect{
            width: 61%;
            margin-right: 14px;
          }
          .inner-top{
            width: 98%;
            .delete{
              cursor: pointer;
              font-size: 14px;
              color: #ff4949;
            }
            .save{
              cursor: pointer;
            }
          }
          .inner-table-box{
            margin-left: 97px;
            .inner-head{
              background:#f9fafc;
              padding-left: 19px;
              height: 66px;
              line-height: 66px;
              font-size:14px;
              color:#5e6d82;
            }
            .SKUtable,.attrtable{
              border: 1px solid #dfe6ec;
              margin-top: 10px;
              // 编辑&删除
              .edit{
                font-size: 13px;
                color:#20a0ff;
                float: left;
                margin-right: 10px;
                cursor: pointer;
              }
              .delete{
                float: left;
                cursor: pointer;
                font-size: 13px;
                color:#ff4949;
              }
            }
            .inner-btn{
              margin-top: 15px;
                margin-right: 10px;
              float: right;
            }
          }
          // 商品属性
          .goodAttr{
            margin-left: 0;
            .attrtable{
              .el-table{
                .cell{
                  text-align: right !important;
                }
              }
            }
          }
          // 商品详情
          .detail-box{
            .el-upload__tip{
              margin-top: -5px;
            }
            .pic-show-list{
              .imglist{
                .imgitem{
                  float: left;
                  margin-right: 5px;
                  border:1px solid #c0ccda;
                  width:98px;
                  height:98px;
                  .imgbox{
                    width: 100%;
                    height: 100%;
                  }
                }
              }
            }
            .editorbox{
              height: 170px;
            }

          }
          // 分享设置
          .sharesetting{
            .el-upload__tip{
              margin-top: -5px;
            }
          }
            .uploadIconBox{
              margin: 14px 0;
              .iconTitleInp{
                width: 40.5%;
              }
            }
          .sharetitle{
            margin-right: 10px;
            float: left;
          }
            .discription{
              .discription-inp{
                width: 40.5%;
                margin-left: 5px;
              }
            }

          // 商品标签
          .newAddTag{
            margin-right: 8px;
          }
          .input-new-tag{
            width: 80px;
            height: 24px;
          }
          // 设置规格part
          .selectlist{
            width: 100%;
            .selectlist-item{
              margin-bottom: 10px;
            }
          }
          // 操作规格btn
          .operation-btn{
            float: left;
            height: 36px;
            line-height: 36px;
            .btn-item{
              margin-bottom: 10px;
                }
          }
        }
        // 弹框
        .addsingledialog, .addAttrdialog{
          .el-form-item__label{
            width: 15%;
            text-align: left;
          }
          .el-select{
            width: 80%;
            float: right;
          }
          .upswitch{
            margin-left: 108px;
          }
          .dialoginput{
            width: 79%;
            margin-left: 26px;
          }
        }
    }
    // 底部提交部分
   .bottompart{
     border-top: 1px solid #d1dbe5;
     padding-top: 14px;
     height: 80px;
     position: absolute;
     bottom: 0;
     width: 96%;
     .createbtn{
       float: right;
     }
   }
}
</style>
<style media="screen" lang="scss">
.is-opened{
  background: none;
}
.detail-box{
  .el-upload-dragger{
    background: #f9fafc;
  }
  .el-upload__text{
    position: absolute;
    left: 92px;
    top: 36px;
  }
}
.el-cascader{
  .el-icon-caret-bottom{
    transform: rotate(0deg);
  }
}
.el-table__column-filter-trigger{
  .el-icon-arrow-down{
    transform: rotate(0deg);
  }
}
.uploadIconBox{
  .el-upload{
    .el-upload-dragger{
      background:#f9fafc;
      border:1px solid #c0ccda;
    }
  }
}
.w-e-text-container{
  height: 84% !important;
  background: #fff;
}
// 商品主图
.mainPicBox{
   height: 215px;
  .mainPicUpload{
    position: relative;
    .el-upload-list, .el-upload-list--picture-card{
      position: absolute;
      top:218px;
    }
  }
}
.el-upload-list--picture-card .el-upload-list__item{
  width: 98px !important;
  height: 98px !important;
}
.el-upload-list{
  width: 100%;
  height: 100px;
  overflow-x: auto;
}
#selfPosterUploadDom{
  .el-upload-list{
    height: auto;
  }
}
.upload-demo .el-upload{
  width: 0;
}
</style>
