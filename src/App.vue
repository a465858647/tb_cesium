<template>
  <div id="app">
    <el-header>
      <el-menu default-active="1" mode="horizontal" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b" id="mainMenu">
        <el-submenu index="1">
          <template slot="title">视图管理</template>
          <el-menu-item index="1-1">
            <el-checkbox v-model="navMenuChecked.layerControlChecked" style="width:100%">图层管理</el-checkbox>
          </el-menu-item>
        </el-submenu>
        <el-submenu index="2">
          <template slot="title">工程应用</template>
          <el-menu-item index="2-1">
            <el-checkbox v-model="navMenuChecked.earthWorkChecked" style="width:100%">土方开挖</el-checkbox>
          </el-menu-item>
        </el-submenu>
      </el-menu>
    </el-header>
    <el-main>
      <el-container style="height:100%">
        <el-aside width="300px" id="leftAsideBar" v-if="navMenuChecked.layerControlChecked">
          <el-tabs v-model="leftAsideValue" tab-position="right" style="height: 100%;" @tab-remove="leftAsideBarTabClose">
            <el-tab-pane label="图层" closable name="layerControl" v-if="navMenuChecked.layerControlChecked">
              <el-tree :data="layerControl.layerControlData" ref="layerControlTree" :props="layerControl.layerControlProps" class="tabContent" show-checkbox node-key="id" :default-expanded-keys="['1','2']" :default-checked-keys="layerControlcheckedKeys" @check-change="layerControl.layerTreesCheckChanged"></el-tree>
            </el-tab-pane>
          </el-tabs>
        </el-aside>
        <div id="mainConetent">
          <div id="cesiumContainer"></div>
        </div>
        <el-aside width="350px" id="rightAsideBar" v-if="navMenuChecked.earthWorkChecked">
          <el-tabs v-model="rightAsideValue" tab-position="left" style="height: 100%;" @tab-remove="rightAsideBarTabClose">
            <el-tab-pane label="土方开挖" closable name="earthWork">土方开挖</el-tab-pane>
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
import * as Cesium from 'cesium';
import './assets/app.css';
import LayerControl from './js/layerControl';


export default {
  name: 'App',
  data() {
    const viewerId = `viewer${Date.parse(new Date())}`;
    return {
      viewerId,
      /* 头部导航栏 */
      navMenuChecked: { layerControlChecked: true, earthWorkChecked: false },
      /* 菜单控制 */
      layerControl: new LayerControl(viewerId, this),
      /* 左侧工具栏 */
      leftAsideValue: 'layerControl',
      layerControlcheckedKeys: [],
      /* 右侧工具栏 */
      rightAsideValue: 'earthWork',
    };
  },
  mounted() {
    this.initCesium().then((viewer) => {
      window[this.viewerId] = viewer;
      /* 初始化默认影像 */
      this.$refs.layerControlTree.setCheckedKeys(['1-1']);
    });
  },
  computed: {
    navMenuCheckedNew() {
      return JSON.parse(JSON.stringify(this.navMenuChecked));
    },
  },
  watch: {
    navMenuCheckedNew: {
      handler(newValue, oldValue) {
        if (newValue.layerControlChecked === true && oldValue.layerControlChecked === false) {
          this.leftAsideValue = 'layerControl';
        }
        if (newValue.earthWorkChecked === true && oldValue.earthWorkChecked === false) {
          this.rightAsideValue = 'earthWork';
        }
      },
      deep: true,
    },
  },
  methods: {
    /* 初始化地图 */
    initCesium() {
      return new Promise((resoleve) => {
        Cesium.Ion.defaultAccessToken =
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0NzIwNzRjYy0xZjdmLTQwOTItOTNkZi1iNzY4ZTJiMTdiNmIiLCJpZCI6Mjg2NjUsImlhdCI6MTYyNzYyODY1N30.J4GerqBI7XdoqNoa1y0p9NnY-aObsDKQBm-0nSMj558';
        // eslint-disable-next-line no-unused-vars
        const viewer = new Cesium.Viewer('cesiumContainer', {
          animation: false,
          baseLayerPicker: false,
          fullscreenButton: false,
          vrButton: false,
          geocoder: false,
          homeButton: false,
          infoBox: false,
          sceneModePicker: false,
          selectionIndicator: false,
          timeline: false,
          navigationHelpButton: false,
          shouldAnimate: true,

        });
        viewer.imageryLayers.removeAll();
        viewer.scene.globe.baseColor = Cesium.Color.LIGHTSLATEGREY;
        // eslint-disable-next-line no-underscore-dangle
        viewer._cesiumWidget._creditContainer.style.display = 'none';
        resoleve(viewer);
      });
    },
    rightAsideBarTabClose(tabIndex) {
      // eslint-disable-next-line no-console
      console.log(tabIndex);
    },
    leftAsideBarTabClose(tabIndex) {
      if (tabIndex === 'layerControl') {
        this.navMenuChecked.layerControlChecked = false;
      }
    },
  },
};
</script>
