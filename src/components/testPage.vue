<template lang="html">
  <div class="outbox">
    <el-button @click="test()">呵呵</el-button>
    <!-- <el-dialog
      title="添加机构"
      :visible.sync="instituteDialog"
      size="small"
      > -->
      <!-- <el-form :model="instituteForm" :rules="instituteRules" ref="instituteForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="机构类型" prop="typeSelect"> -->
          <div id='container'>

          </div>
          <div id="panel" tabindex="0">
          </div>
          <el-button @click='search()'>查询</el-button>
        <!-- </el-form-item>
      </el-form> -->
    <!-- </el-dialog> -->
  </div>
</template>

<script>
import AMap from 'AMap'

export default {
  data () {
    return {
      instituteDialog: false,
      instituteForm: {},
      instituteRules: {}
    }
  },
  methods: {
    test () {
      this.instituteDialog = true
      setTimeout(function () {
        var map = new AMap.Map('container', {
          resizeEnable: true
        })
        console.log(map)
      }, 100)
    },
    search () {
      var map = new AMap.Map('container', {
        resizeEnable: true
      })
      AMap.service(['AMap.PlaceSearch'], function () {
        var placeSearch = new AMap.PlaceSearch({ // 构造地点查询类
          pageSize: 5,
          pageIndex: 1,
          city: '010', // 城市
          map: map,
          panel: 'panel'
        })
        // 关键字查询
        console.log('看看', placeSearch.search())
        placeSearch.search('武汉工程大学', function (status, result) {
          keywordSearchCallBack(result)
        })
        // 回调函数
        function keywordSearchCallBack (data) {
          // console.log(data)
          // var resultStr = ''
          // var poiArr = data.poiList.pois
          // var resultCount = poiArr.length
          // for (var i = 0; i < resultCount; i++) {
          //     // resultStr += "<div id='divid" + (i + 1) + "' onmouseover='openMarkerTipById1(" + i + ",this)' onmouseout='onmouseout_MarkerStyle(" + (i + 1) + ",this)' style=\"font-size: 12px;cursor:pointer;padding:0px 0 4px 2px; border-bottom:1px solid #C1FFC1;\"><table><tr><td><img src=\"https://webapi.amap.com/images/" + (i + 1) + ".png\"></td>" + "<td><h3><font color=\"#00a6ac\">名称: " + poiArr[i].name + "</font></h3>"
          //     resultStr += createContent(poiArr[i].name, poiArr[i].address, poiArr[i].entr_location.lng) + '</td></tr></table></div>'
          //     addmarker(i, poiArr[i])
          // }
          // map.setFitView()
        }
        // function createContent (name, address, coordinate) {
        //   // name = parseStr(name)
        //   // address = parseStr(address)
        //   // coordinate = parseStr(coordinate)
        //   // var s = []
        //   // s.push('名字：' + name)
        //   // s.push('地址：' + address)
        //   // s.push('经纬度之一：' + coordinate)
        //   // return '<div>' + s.join('<br>') + '</div>'
        // }
      })
    }
  },
  mounted () {

  }
}
</script>

<style lang="css" scoped>
#container{
  width: 500px;
  height: 200px;
}
#panel{
  width: 600px;
  height: 300px;
}
</style>
