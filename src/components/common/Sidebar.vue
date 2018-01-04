<template>
<aside :class="collapsed?'menu-collapsed':'menu-expanded'">
  <!-- 展开时 -->
  <el-menu class="el-menu-vertical-demo" theme="dark" @open="handleOpen" @close="handleClose" v-show="!collapsed" unique-opened router>
    <template v-for="item in items">
          <template v-if="item.subs">
              <el-submenu :index="item.index">
                  <template slot="title">
                    <!-- <i :class="item.icon"></i> -->
                    <i class="el-submenu__icon-arrow el-icon-caret-bottom"></i>
                    {{ item.title }}</template>
    <el-menu-item v-for="(subItem,i) in item.subs" :key="i" :index="subItem.index" @click="getTitle(subItem)"><i :class="subItem.icon"></i>{{ subItem.title }}
    </el-menu-item>
    </el-submenu>
    </template>
    <template v-else>
          <el-menu-item :index="item.index">
              <i :class="item.icon"></i>{{ item.title }}
          </el-menu-item>
      </template>
    </template>
  </el-menu>
  <!-- 收起时 -->
  <div class="collapsed" v-show="collapsed">
    <el-menu class="el-menu-vertical-demo" theme="dark" @open="handleOpen" @close="handleClose" unique-opened router>
      <template v-for="item in items">
            <template v-if="item.subs">
                <el-submenu :index="item.index">
                    <template slot="title">
                      <!-- <i :class="item.icon"></i> -->
                      <i class="el-submenu__icon-arrow el-icon-caret-bottom"></i>
                      </template>
      <el-menu-item v-for="(subItem,i) in item.subs" :key="i" :index="subItem.index" ><i :class="subItem.icon"></i>
      </el-menu-item>
      </el-submenu>
      </template>
      <template v-else>
            <el-menu-item :index="item.index">
                <i :class="item.icon"></i>{{ item.title }}
            </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
  <div class="bottombox" :class="collapsed?'btn-collapsed':'btn-expanded'">
    <div class="userbox">
      <img class="userimg" src="../../assets/img/user.png" alt="">
      <span class="username">Adminstrator{{username}}</span>
    </div>
    <!-- 折叠面板开关  -->
    <div class="slidebar" @click.prevent="collapse">
      <i class="el-icon-arrow-left" v-show="!collapsed"></i>
      <i class="el-icon-arrow-right" v-show="collapsed"></i>
    </div>
  </div>
</aside>
</template>

<script>
export default {
  data () {
    return {
      name: 'zxq',
      collapsed: false,
      items: [{
        index: 'webApp',
        title: '网站应用',
        subs: [{
          index: 'webapp01',
          title: '网站应用01'
        }, {
          index: 'webapp02',
          title: '网站应用02'
        }]
      }, {
        index: 'operationPlatform',
        title: '运营平台',
        subs: [{
          index: 'clientList',
          title: '商家管理'
        }, {
          index: 'sellsetting',
          title: '销售管理'
        }, {
          index: 'sortmanager',
          title: '帮助中心'
        }, {
          index: 'deliverymodel',
          title: '物流管理'
        }, {
          index: 'instituteList',
          title: '机构管理'
        }]
      }, {
        index: 'shareApp',
        title: '艺享应用',
        subs: [{
          index: 'article_maintenance',
          title: '文章管理'
        }, {
          index: 'school02',
          title: '学院02'
        }]
      }, {
        index: 'ShopHome',
        title: '商城应用',
        subs: [{
          icon: 'el-icon-star-off',
          index: 'shophome',
          title: '首页'
        }, {
          icon: 'el-icon-menu',
          index: 'store',
          title: '商品管理',
          subs: [{
            index: 'goodsmanager',
            title: '商品管理',
            subs: [{
              index: 'goodsmanager',
              title: '商品类别'
            }, {
              index: 'goodsmanager',
              title: '商品规格'
            }]
          }, {
            index: 'goodsmanager',
            title: '系列管理大标题1'
          }, {
            index: 'goodsmanager',
            title: '系列管理大标题2'
          }]
        }, {
          icon: 'el-icon-menu',
          index: 'brands_maintenance',
          title: '品牌管理'
        }, {
          icon: 'el-icon-document',
          // 默认是第一个
          index: 'swiper_maintenance',
          title: '广告投放'
        }, {
          icon: 'el-icon-document',
          // 默认是第一个
          index: 'earntype_manager',
          title: '营销管理'
        }]
      }, {
        index: 'weixin',
        title: '微信公众号应用',
        subs: [{
          index: 'weixin01',
          title: '微信01'
        }, {
          index: 'weixin02',
          title: '微信02'
        }]
      }, {
        index: 'eachApp',
        title: '互动应用',
        subs: [{
          index: 'each01',
          title: '互动01'
        }, {
          index: 'each02',
          title: '互动02'
        }]
      }, {
        index: 'setting',
        title: '系统设置',
        subs: [{
          index: 'setting01',
          title: '系统设置1'
        }, {
          index: 'setting02',
          title: '系统设置02'
        }]
      }]
    }
  },
  methods: {
    getTitle (item) {
      window.localStorage.setItem('maintitle', item.title)
      console.log(item.title)
    },
    // 折叠面板
    collapse: function () {
      this.collapsed = !this.collapsed
    },
    handleOpen (key, keyPath) {
      console.log(123)
      console.log(key)
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath)
    }
  },
  computed: {
    username () {
      // let username = localStorage.getItem('ms_username')
      // return username ? username : this.name
    }
  }
}
</script>

<style lang="scss">
aside {
    height: 100%;
    padding-top: 137px;
    background: #1a202d;
    float: left;
    width: 220px;
    // 收起面板
    .collapsed {
        width: 50px !important;
    }
}
.menu-collapsed {
    flex: 0 0 50px;
    width: 50px;
    .el-submenu__icon-arrow {
        right: 20px;
    }
    .el-submenu__title {
        padding: 0;
    }
}
.menu-expanded {
    flex: 0 0 220px;
    width: 220px;
    .el-menu {
        width: 220px !important;
    }
    .el-submenu__icon-arrow {
        right: 190px;
    }
}
.el-menu--dark {
    background: #1a202d;
}

.el-menu--dark,
.el-submenu {
    .el-submenu {
        .el-menu {
            .el-menu-item:hover {
                background: #20a0ff;
                color: #bfcbd9;
            }
        }
    }
}
.el-submenu__title {
    padding-left: 37px !important;
}

.el-icon-arrow-down,
.el-icon-caret-bottom {
    transform: rotate(-90deg);
}
.el-submenu__title {
    transform: rotateZ(0deg);
}
.is-opened {
    background: #29303e;
    .el-submenu__title {
        .el-submenu__icon-arrow {
            transform: rotateZ(0deg) !important;
        }
    }
}

.bottombox {
    height: 88px;
    width: 220px;
    position: fixed;
    bottom: 0;
    .userbox {
        height: 48px;
        padding-left: 21px;
        .userimg {
            float: left;
            margin-right: 10px;
        }
        .username {
            line-height: 48px;
        }
    }
    .slidebar {
        width: 220px;
        background: #29303e;
        position: fixed;
        bottom: 0;
        height: 40px;
        text-align: center;
        line-height: 40px;
    }
}
.btn-collapsed {
    width: 50px;
    .userbox {
        display: none;
    }
    .slidebar {
        width: 50px;
    }
}
.btn-expanded {
    width: 220px;
    .userbox {
        display: block;
    }
    .slidebar {
        width: 220px;
    }
}
</style>
