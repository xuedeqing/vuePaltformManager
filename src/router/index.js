import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [{
    path: '/',
    component: resolve => require(['../components/common/Home.vue'], resolve),
    children: [{
      path: '/goodsmanager',
      component: resolve => require(['../components/page/shopapp/GoodsManager.vue'], resolve),
      children: [{
        path: '/store',
        component: resolve => require(['../components/page/shopapp/GoodsManager/store.vue'], resolve)
      }, {
        path: '/addGood',
        component: resolve => require(['../components/page/shopapp/GoodsManager/addGood.vue'], resolve)
      }, {
        path: '/editGood',
        component: resolve => require(['../components/page/shopapp/GoodsManager/editGood.vue'], resolve)
      }, {
        path: '/sort',
        component: resolve => require(['../components/page/shopapp/GoodsManager/sort.vue'], resolve)
      }, {
        path: '/standard',
        component: resolve => require(['../components/page/shopapp/GoodsManager/standard.vue'], resolve)
      }, {
        path: '/brand',
        component: resolve => require(['../components/page/shopapp/GoodsManager/brand.vue'], resolve)
      }, {
        path: '/maintenance',
        component: resolve => require(['../components/page/shopapp/GoodsManager/maintenance.vue'], resolve)
      }, {
        path: '/birth',
        component: resolve => require(['../components/page/shopapp/GoodsManager/birth.vue'], resolve)
      }, {
        path: '/platform01',
        component: resolve => require(['../components/page/shopapp/GoodsManager/platform01.vue'], resolve)
      }, {
        path: '/platform02',
        component: resolve => require(['../components/page/shopapp/GoodsManager/platform02.vue'], resolve)
      }, {
        path: '/platform03',
        component: resolve => require(['../components/page/shopapp/GoodsManager/platform03.vue'], resolve)
      }, {
        path: '/platform04',
        component: resolve => require(['../components/page/shopapp/GoodsManager/platform04.vue'], resolve)
      }]
    },
    {
      path: '/brandsmanager',
      component: resolve => require(['../components/page/shopapp/brandsmanager.vue'], resolve),
      children: [{
        path: '/brands_maintenance',
        component: resolve => require(['../components/page/shopapp/BrandsManager/brands_maintenance.vue'], resolve)
      }, {
        path: '/country_maintenance',
        component: resolve => require(['../components/page/shopapp/BrandsManager/country_maintenance.vue'], resolve)
      }]
    },
    {
      path: '/shophome',
      component: resolve => require(['../components/page/shopapp/ShopHome.vue'], resolve)
    },
    {
      path: '/advertisement',
      component: resolve => require(['../components/page/shopapp/advertisement.vue'], resolve),
      children: [{
        path: '/swiper_maintenance',
        component: resolve => require(['../components/page/shopapp/Advertisement/swiper_maintenance.vue'], resolve)
      }, {
        path: '/brand_direct',
        component: resolve => require(['../components/page/shopapp/Advertisement/brand_direct.vue'], resolve)
      }]
    },
    {
      path: '/earnmanager',
      component: resolve => require(['../components/page/shopapp/EarnManager.vue'], resolve),
      children: [{
        path: '/earntype_manager',
        component: resolve => require(['../components/page/shopapp/EarnManager/earntype_manager.vue'], resolve)
      }, {
        path: '/earnarticle_manager',
        component: resolve => require(['../components/page/shopapp/EarnManager/earnarticle_manager.vue'], resolve)
      }, {
        path: '/addessay',
        component: resolve => require(['../components/page/shopapp/EarnManager/addEssay.vue'], resolve)
      }]
    }, {
      path: '/sellmanagement',
      component: resolve => require(['../components/page/operationPlatform/sellmanager.vue'], resolve),
      children: [{
        path: '/aftersell',
        component: resolve => require(['../components/page/operationPlatform/sellmanager/afterSell.vue'], resolve)
      }, {
        path: '/sellorder',
        component: resolve => require(['../components/page/operationPlatform/sellmanager/sellOrders.vue'], resolve)
      }, {
        path: '/sellsetting',
        component: resolve => require(['../components/page/operationPlatform/sellmanager/sellSetting.vue'], resolve)
      }]
    }, {
      path: '/helpcenter',
      component: resolve => require(['../components/page/operationPlatform/helpcenter.vue'], resolve),
      children: [{
        path: '/contentmanager',
        component: resolve => require(['../components/page/operationPlatform/helpCenter/contentManager.vue'], resolve)
      }, {
        path: '/addquestioncontent',
        component: resolve => require(['../components/page/operationPlatform/helpCenter/addQuestionContent.vue'], resolve)
      }, {
        path: '/sortmanager',
        component: resolve => require(['../components/page/operationPlatform/helpCenter/sortManager.vue'], resolve)
      }, {
        path: '/objcontent',
        component: resolve => require(['../components/page/operationPlatform/helpCenter/objContent.vue'], resolve)
      }]
    }, {
      path: '/insititutemanager',
      component: resolve => require(['../components/page/operationPlatform/instituteManager.vue'], resolve),
      children: [{
        path: '/instituteList',
        component: resolve => require(['../components/page/operationPlatform/instituteManager/instituteList.vue'], resolve)
      }, {
        path: '/instituteType',
        component: resolve => require(['../components/page/operationPlatform/instituteManager/instituteType.vue'], resolve)
      }, {
        path: '/instituteEdit',
        component: resolve => require(['../components/page/operationPlatform/instituteManager/instituteEdit.vue'], resolve)
      }]
    }, {
      path: '/clientmanagement',
      component: resolve => require(['../components/page/operationPlatform/clientmanager.vue'], resolve),
      children: [{
        path: '/clientList',
        component: resolve => require(['../components/page/operationPlatform/clientManager/clientList.vue'], resolve)
      }, {
        path: '/addClient',
        component: resolve => require(['../components/page/operationPlatform/clientManager/addClient.vue'], resolve)
      }]
    }, {
      path: '/deliverymanager',
      component: resolve => require(['../components/page/operationPlatform/deliverymanager.vue'], resolve),
      children: [{
        path: '/deliveryModel',
        component: resolve => require(['../components/page/operationPlatform/deliverymanager/deliverymodel.vue'], resolve)
      }, {
        path: '/addModel',
        component: resolve => require(['../components/page/operationPlatform/deliverymanager/addModel.vue'], resolve)
      }]
    }, {
      path: '/articlemanagement',
      component: resolve => require(['../components/page/shareApp/articlemanager.vue'], resolve),
      children: [{
        path: '/article_maintenance',
        component: resolve => require(['../components/page/shareApp/articleManager/article_maintenance.vue'], resolve)
      }, {
        path: '/article_sort',
        component: resolve => require(['../components/page/shareApp/articleManager/article_sort.vue'], resolve)
      }, {
        path: '/article_comment',
        component: resolve => require(['../components/page/shareApp/articleManager/articlre_comment.vue'], resolve)
      }, {
        path: '/addArticle',
        component: resolve => require(['../components/page/shareApp/articleManager/addArticle.vue'], resolve)
      }]
    }]
  }, {
    path: '/login',
    component: resolve => require(['../components/page/Login.vue'], resolve)
  }, {
    path: '/certificate',
    component: resolve => require(['../components/page/shopapp/BrandsManager/certificate.vue'], resolve)
  }, {
    path: '/editor',
    component: resolve => require(['../components/editor.vue'], resolve)
  }, {
    path: '/editorshare',
    component: resolve => require(['../components/editorshare.vue'], resolve)
  }, {
    path: '/version',
    component: resolve => require(['../components/version.vue'], resolve)
  }, {
    path: '/testPage',
    component: resolve => require(['../components/testPage.vue'], resolve)
  }]
})
