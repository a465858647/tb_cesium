<template>
  <div id="app">
    <el-header>
      <el-menu default-active="1" mode="horizontal" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b" id="mainMenu">
        <el-submenu index="1">
          <template slot="title">视图管理</template>
          <el-menu-item index="1-1">
            <el-checkbox v-model="mainMenuChecked.layerControlChecked" style="width:100%">图层</el-checkbox>
          </el-menu-item>
        </el-submenu>
      </el-menu>
    </el-header>
    <el-main>
      <el-container style="height:100%">
        <el-aside width="300px" id="leftAsideBar" v-if="mainMenuChecked.layerControlChecked">
          <el-tabs v-model="rightAsideBarTabValue" tab-position="right" style="height: 100%;">
            <el-tab-pane label="图层" closable name="1" v-if="mainMenuChecked.layerControlChecked">
              <el-tree :data="layerControlData" :props="layerControlProps" class="tabContent" show-checkbox node-key="id" :default-expanded-keys="['1-1']" :default-checked-keys="[]"></el-tree>
            </el-tab-pane>
          </el-tabs>
        </el-aside>
        <el-container id="mainConetent">
          <div id="viewer" style="width:100%;height:100%"></div>
        </el-container>
        <el-aside width="350px" v-if="rightAsideShow" id="rightAsideBar">
          <el-tabs v-model="rightAsideBarTabValue" tab-position="left" style="height: 100%;" @tab-remove="rightAsideBarTabClose">
            <el-tab-pane label="用户管理" closable name="1">用户管理</el-tab-pane>
            <el-tab-pane label="配置管理" closable name="2">配置管理</el-tab-pane>
          </el-tabs>
        </el-aside>
      </el-container>
    </el-main>
    <el-footer style="padding:0px 10px;">
      <i class="el-icon-coordinate  footerIcon">
        <div style="display:inline-block;padding-left:20px">经度:</div>
        <div style="display:inline-block">114.454544</div>
        <el-divider direction="vertical"></el-divider>
        <div style="display:inline-block">纬度:</div>
        <div style="display:inline-block">35.454544</div>
        <el-divider direction="vertical"></el-divider>
        <div style="display:inline-block">高程:</div>
        <div style="display:inline-block">35.454544</div>
      </i>
      <i class="el-icon-camera   footerIcon">
        <div style="display:inline-block;padding-left:20px">x:</div>
        <div style="display:inline-block">114.454544</div>
        <el-divider direction="vertical"></el-divider>
        <div style="display:inline-block">y:</div>
        <div style="display:inline-block">35.454544</div>
        <el-divider direction="vertical"></el-divider>
        <div style="display:inline-block">z:</div>
        <div style="display:inline-block">35.454544</div>
        <el-divider direction="vertical"></el-divider>
        <div style="display:inline-block">heading:</div>
        <div style="display:inline-block">35.454544</div>
        <el-divider direction="vertical"></el-divider>
        <div style="display:inline-block">pitch:</div>
        <div style="display:inline-block">35.454544</div>
        <el-divider direction="vertical"></el-divider>
        <div style="display:inline-block">roll:</div>
        <div style="display:inline-block">35.454544</div>
        <el-divider direction="vertical"></el-divider>
      </i>
    </el-footer>
  </div>
</template>

<script>
import './assets/app.css';

export default {
  name: 'App',
  data() {
    return {
      mainMenuChecked: { layerControlChecked: true },
      layerControlData: [{
        id: '1',
        label: '影像',
        children: [{
          id: '1-1',
          label: 'Cesium',
        }, {
          id: '1-2',
          label: '天地图',
        }],
      }],
      layerControlProps: {
        children: 'children',
        label: 'label',
      },
      rightAsideBarTabValue: '1',
      rightAsideShow: true,
      tabShow: true,
      tabNoShow: false,
    };
  },
  methods: {
    rightAsideBarTabClose(tabIndex) {
      // eslint-disable-next-line no-console
      console.log(tabIndex);

      // console.log(a);
      // let tabs = this.editableTabs;
      // let activeName = this.editableTabsValue;
      // if (activeName === targetName) {
      //   tabs.forEach((tab, index) => {
      //     if (tab.name === targetName) {
      //       let nextTab = tabs[index + 1] || tabs[index - 1];
      //       if (nextTab) {
      //         activeName = nextTab.name;
      //       }
      //     }
      //   });
      // }

      // this.editableTabsValue = activeName;
      // this.editableTabs = tabs.filter(tab => tab.name !== targetName);
      // }
    },
  },
};
</script>
