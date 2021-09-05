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
        <el-container id="mainConetent" style="height: 100%">
          <div id="cesiumContainer"></div>
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
import * as Cesium from 'cesium';
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
  mounted() {
    this.initCesium();
  },
  methods: {
    initCesium() {
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
        // terrainProvider: new Cesium.EllipsoidTerrainProvider(),
        // skyAtmosphere: true,
      });
      // viewer.imageryLayers.removeAll();
      viewer.scene.globe.baseColor = Cesium.Color.LIGHTSLATEGREY;
      // eslint-disable-next-line no-underscore-dangle
      viewer._cesiumWidget._creditContainer.style.display = 'none';
      // viewer.scene.requestRenderMode = true;
      // viewer.scene.maximumRenderTimeChange = Infinity;
      // viewer.scene.debugShowCommands = true;
      // viewer.scene.globe.maximumScreenSpaceError = 1;
      // viewer.scene.fxaa = true;
      // viewer.scene.mode = Cesium.SceneMode.SCENE2D;
      // 组件创建完成之后，自定义事件，向父组件传递数据
      // this.$emit('receive', [viewer, this.user]);

      /* 公司片区 */
      // viewer.camera.setView({
      //   destination: new Cesium.Cartesian3(-2108796.0220383317, 4805915.002069981, 3614304.859235633),
      //   orientation: {
      //     heading: 0.6091569770611214,
      //     pitch: -0.37831468993759243,
      //     roll: 0.0019361826038952756,
      //   },
      // });
    },
    rightAsideBarTabClose(tabIndex) {
      // eslint-disable-next-line no-console
      console.log(tabIndex);
    },
  },
};
</script>
