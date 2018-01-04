<template lang="html">
  <div class="subsidebar">
    <el-menu class="el-menu-vertical-demo" theme="dark" unique-opened router :default-active="defaultLightHeight">
      <p class='maintitle'>{{maintitle}}</p>
      <template v-for="item in sidebardata">
        <template v-if="item.subs">
          <el-submenu :index="item.index">
            <template slot="title"><i class="el-submenu__icon-arrow el-icon-caret-bottom arrow-left"></i>{{ item.title }}</template>
            <el-menu-item v-for="(subItem,i) in item.subs" :key="i" :index="subItem.index" class="active" >{{ subItem.title }}
            </el-menu-item>
          </el-submenu>
      </template>
      <!-- 没有子集 -->
      <template v-else>
          <el-menu-item :index="item.index" class="getClass">
              <i :class="item.icon"></i>{{ item.title }}
          </el-menu-item>
      </template>
      </template>
    </el-menu>
  </div>
</template>

<script>
export default {
  props: ['sidebardata', 'maintitle', 'defaultLightHeight'],
  data () {
    return {}
  },
  mounted () {
  }
}
</script>
<style lang="scss">
.subsidebar {
    width: 12%;
    height: 100%;
    float: left;
    background: #eff2f7;
    .maintitle {
        height: 77px;
        line-height: 77px;
        padding-left: 37px;
        color: #1f2d3d;
        background: rgba(26,32,45,0.08);
    }
    .el-menu-item {
        color: #475568;
        padding-left: 37px !important;
        &.is-active {
            background: #fff;
        }
    }
    .el-menu--dark {
        height: 100%;
        background: #eff2f7;
        .el-submenu {
            .el-menu {
                background: #eff2f7;
                .el-menu-item {
                    color: #475568;
                    &:hover {
                        background: #fff;
                    }
                }
            }
        }
        .el-submenu__title {
            .el-submenu__icon-arrow {
                color: #99a9bf;
                right: 85%;
            }
            &:hover {
                background: #fff;
                color: red;
            }
            .arrow-left {
            }
        }
    }
    .el-menu {
        width: 100%;
        .el-menu-item:hover {
            background: #fff;
        }
        .el-submenu {
            background: #eff2f7;
            .el-submenu__title {
                color: #1f2d3d;
            }
        }
    }
}
</style>
