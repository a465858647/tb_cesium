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
              <el-tree :data="layerControl.layerControlData" ref="layerControlTree" :props="layerControl.layerControlProps" class="tabContent" show-checkbox node-key="id" :default-expanded-keys="['1','2','3']" :default-checked-keys="layerControlcheckedKeys" @check-change="layerControl.layerTreesCheckChanged"></el-tree>
            </el-tab-pane>
          </el-tabs>
        </el-aside>
        <div id="mainConetent">
          <div id="cesiumContainer"></div>
        </div>
        <el-aside width="350px" id="rightAsideBar" v-if="navMenuChecked.earthWorkChecked">
          <el-tabs v-model="rightAsideValue" tab-position="left" style="height: 100%;" @tab-remove="rightAsideBarTabClose">
            <el-tab-pane label="土方开挖" closable name="earthWork">
              <el-container direction="vertical" style="border:1px solid #7a7e86">
                <el-row :gutter="20" style="padding:auto;margin:5px 0px;left:0;right:0;top:0;bottom:0;width:100%;">
                  <el-col :span="12" style="padding:auto;margin:auto;left:0;right:0;top:0;bottom:0;width:50%">
                    <el-button style="width:100%" icon="el-icon-edit" size="mini" type="info" @click="earthWorkControl.drawExcavateRange">绘制工程范围</el-button>
                  </el-col>
                  <el-col :span="12" style="padding:auto;margin:auto;left:0;right:0;top:0;bottom:0;width:50%;height:28px">
                    <div style="height:28px;line-height:28px ;color:#fff;font-style: italic;">面积 {{earthWorkControl.earthWordArea}} 平方米</div>
                  </el-col>
                </el-row>
                <el-row :gutter="20" style="padding:auto;margin:5px 0;left:0,right:0;top:0;bottom:0;width:100%">
                  <el-col :span="12" style="padding:auto;margin:auto;left:0,right:0;top:0;bottom:0;width:50%;">
                    <div style="padding: 4.5px 0;color:white;text-align: center;font:14px Arial;display:inline-block;width:100%;font-weight:bold;">三角网精度(米)</div>
                  </el-col>
                  <el-col :span="12" style="padding:auto;margin:auto;left:0,right:0;top:0;bottom:0;width:50%">
                    <el-input size="mini" v-model="earthWorkControl.riangleSideLength"></el-input>
                  </el-col>
                </el-row>
                <el-row :gutter="20" style="padding:auto;margin:5px 0;left:0,right:0;top:0;bottom:0;width:100%">
                  <el-col :span="12" style="padding:auto;margin:auto;left:0,right:0;top:0;bottom:0;width:50%;">
                    <div style="padding: 4.5px 0;color:white;text-align: center;font:14px Arial;display:inline-block;width:100%;font-weight:bold;">超平高程(米)</div>
                  </el-col>
                  <el-col :span="12" style="padding:auto;margin:auto;left:0,right:0;top:0;bottom:0;width:50%">
                    <el-input size="mini" v-model="earthWorkControl.earthWordHeight"></el-input>
                  </el-col>
                </el-row>
                <el-row :gutter="20" style="padding:auto;margin:5px 0;left:0,right:0;top:0;bottom:0;width:100%">
                  <el-col :span="12" style="padding:auto;margin:auto;left:0,right:0;top:0;bottom:0;width:50%;">
                    <div style="padding: 4.5px 0;color:white;text-align: center;font:14px Arial;display:inline-block;width:100%;font-weight:bold;">渲染三角网</div>
                  </el-col>
                  <el-col :span="12" style="padding:auto;margin:auto;left:0,right:0;top:0;bottom:0;">

                    <div style="height:28px;line-height:28px ;color:#fff;font-style: italic;display:inline-block">
                      <el-switch style="display:inline-block" active-text="是" inactive-text="否" v-model="earthWorkControl.isRender" active-color="#13ce66" inactive-color="#EE3B3B">
                      </el-switch>
                    </div>

                  </el-col>

                </el-row>
                <el-row :gutter="20" style="padding:auto;margin:5px 0;left:0,right:0;top:0;bottom:0;width:100%">
                  <el-col :span="12" style="padding:auto;margin:auto;left:0,right:0;top:0;bottom:0;width:50%">
                    <el-button style="width:100%" icon="el-icon-mouse" size="mini" type="info" @click="earthWorkControl.drawTriangulation">三角网计算</el-button>
                  </el-col>

                  <el-col :span="12" style="padding:auto;margin:auto;left:0,right:0;top:0;bottom:0;">
                    <div style="height:28px;line-height:28px ;color:#fff;font-style: italic;"> {{earthWorkControl.riangleCount}} 个</div>
                  </el-col>
                </el-row>

              </el-container>
              <el-container style="border-left:1px solid #7a7e86;border-right:1px solid #7a7e86;border-bottom:1px solid #7a7e86" direction="vertical">
                <el-row :gutter="20" style="padding:auto;margin:5px 0;left:0,right:0;top:0;bottom:0;width:100%">
                  <el-col :span="12" style="padding:auto;margin:auto;left:0,right:0;top:0;bottom:0;width:50%">
                    <div style="padding: 4.5px 0;color:white;text-align: center;font:14px Arial;display:inline-block;width:100%;font-weight:bold;">挖方量(立方米)</div>
                  </el-col>
                  <el-col :span="12" style="padding:auto;margin:auto;left:0,right:0;top:0;bottom:0;width:50%">
                    <el-input size="mini" v-model="earthWorkControl.excavationVolume"></el-input>
                  </el-col>
                </el-row>
                <el-row :gutter="20" style="padding:auto;margin:5px 0;left:0,right:0;top:0;bottom:0;width:100%">
                  <el-col :span="12" style="padding:auto;margin:auto;left:0,right:0;top:0;bottom:0;width:50%">
                    <div style="padding: 4.5px 0;color:white;text-align: center;font:14px Arial;display:inline-block;width:100%;font-weight:bold;">填方量(立方米)</div>
                  </el-col>
                  <el-col :span="12" style="padding:auto;margin:auto;left:0,right:0;top:0;bottom:0;width:50%">
                    <el-input size="mini" v-model="earthWorkControl.fillVolume"></el-input>
                  </el-col>
                </el-row>
                <el-row :gutter="20" style="padding:auto;margin:5px 0;left:0,right:0;top:0;bottom:0;width:100%">
                  <el-col :span="12" style="padding:auto;margin:auto;left:0,right:0;top:0;bottom:0;width:50%">
                    <el-button style="width:100%" icon="el-icon-edit" size="mini" type="primary" @click="earthWorkControl.computeEarthWorkVolume">计算土方量</el-button>
                  </el-col>
                  <el-col :span="12" style="padding:auto;margin:auto;left:0,right:0;top:0;bottom:0;width:50%">
                    <el-button style="width:100%" icon="el-icon-refresh" size="mini" type="danger" @click="earthWorkControl.resetEarthWorkOption"> 重置</el-button>
                  </el-col>
                </el-row>
              </el-container>
            </el-tab-pane>
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
      <i class="el-icon-pie-chart   footerIcon" v-if="progressBarShow">
        <el-progress :stroke-width="8" :percentage="progressPercentage" style="width:220px;display:inline-block;padding-left:10px"></el-progress>
      </i>
    </el-footer>
  </div>
</template>

<script>
import * as Cesium from 'cesium';
import './assets/app.css';
import LayerControl from './js/layerControl';
import EarthWorkControl from './js/earthWork';


export default {
  name: 'App',
  data() {
    const viewerId = `viewer${Date.parse(new Date())}`;
    return {
      viewerId,
      /* 头部导航栏 */
      navMenuChecked: { layerControlChecked: true, earthWorkChecked: false },
      /* 图层控制 */
      layerControl: new LayerControl(viewerId, this),
      /* 土石方开挖 */
      earthWorkControl: new EarthWorkControl(viewerId, this),
      /* 进度条 */
      progressBarShow: false,
      progressPercentage: 0,
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
          /* 加载倾斜影像 */
          this.layerControlcheckedKeys.push('3-1');
          this.$refs.layerControlTree.setCheckedKeys(this.layerControlcheckedKeys);
          /* 缩放至土方开挖区域 */
          window[this.viewerId].camera.setView({
            destination: new Cesium.Cartesian3(-2108796.0220383317, 4805915.002069981, 3614304.859235633),
            orientation: {
              heading: 0.6091569770611214,
              pitch: -0.37831468993759243,
              roll: 0.0019361826038952756,
            },
          });
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
