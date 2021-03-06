/* eslint-disable no-use-before-define */
import * as Cesium from 'cesium';
// 菜单树配置
const layerControlDataOption = [{
  id: '1',
  label: '影像',
  children: [{
    id: '1-1',
    label: 'Cesium影像',
  }, {
    id: '1-2',
    label: '天地图影像',
  }],
}, {
  id: '2',
  label: '地形',
  children: [{
    id: '2-1',
    label: '世界地形',
  }, {
    id: '2-2',
    label: '土方开挖片区地形',
  }],
}, {
  id: '3',
  label: '倾斜模型',
  children: [{
    id: '3-1',
    label: '土方开挖片区倾斜',
  }],
}];
const layerControlPropsOption = {
  children: 'children',
  label: 'label',
};
const tdtImageryLayer = new Cesium.ImageryLayer(
  new Cesium.UrlTemplateImageryProvider({
    url:
      `http://t${Math.round(Math.random() * 7)}.tianditu.gov.cn/` +
      'img' +
      '_w' +
      '/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=' +
      'img' +
      '&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles' +
      '&TILECOL=' +
      '{x}' +
      '&TILEROW=' +
      '{y}' +
      '&TILEMATRIX=' +
      '{z}' +
      '&tk=' +
      '958ae533fdcf1d8f7677f7c9f711a4cc',
  }),
);

const cesiumImageryLayer = new Cesium.ImageryLayer(
  new Cesium.BingMapsImageryProvider({
    url: 'https://dev.virtualearth.net',
    key: 'AmXdbd8UeUJtaRSn7yVwyXgQlBBUqliLbHpgn2c76DfuHwAXfRrgS5qwfHU6Rhm8',
    mapStyle: Cesium.BingMapsStyle.AERIAL,
  }),
);
const earthWorkTerrainProvider = new Cesium.CesiumTerrainProvider({
  url: 'http://172.16.100.8:8001/金水区三维模型/未来路街道模型/dem20210830',
  requestVertexNormals: true,
});
const ellipsoidTerrainProvider = new Cesium.EllipsoidTerrainProvider();
const earthWordTilesSetOption = {
  url: 'http://172.16.100.8:8001/金水区三维模型/未来路街道模型/15和18区/tileset.json',
  preferLeaves: true,
  dynamicScreenSpaceError: true,
  skipLevelOfDetail: false,
  skipLevels: 1,
  loadSiblings: true,
};
let earthWordTilesSet = {};

export default class LayerControl {
  constructor(viewerId, vue, layerControlData, layerControlProps) {
    this.viewerId = viewerId;
    this.vue = vue;
    this.layerControlData = layerControlData || layerControlDataOption;
    this.layerControlProps = layerControlProps || layerControlPropsOption;
  }
  layerTreesCheckChanged = (obj, selected, hasChild) => {
    if (hasChild === false) {
      if (obj.label === 'Cesium影像' && selected === true) {
        window[this.viewerId].imageryLayers.add(cesiumImageryLayer);
      }
      if (obj.label === 'Cesium影像' && selected === false) {
        window[this.viewerId].imageryLayers.remove(cesiumImageryLayer, false);
      }
      if (obj.label === '天地图影像' && selected === true) {
        window[this.viewerId].imageryLayers.add(tdtImageryLayer);
      }
      if (obj.label === '天地图影像' && selected === false) {
        window[this.viewerId].imageryLayers.remove(tdtImageryLayer, false);
      }
      if (obj.label === '世界地形' && selected === true) {
        window[this.viewerId].terrainProvider = Cesium.createWorldTerrain();
      }
      if (obj.label === '世界地形' && selected === false) {
        window[this.viewerId].terrainProvider = undefined;
      }
      if (obj.label === '土方开挖片区地形' && selected === true) {
        window[this.viewerId].terrainProvider = earthWorkTerrainProvider;
      }
      if (obj.label === '土方开挖片区地形' && selected === false) {
        window[this.viewerId].terrainProvider = ellipsoidTerrainProvider;
      }
      if (obj.label === '土方开挖片区倾斜' && selected === true) {
        earthWordTilesSet = new Cesium.Cesium3DTileset(earthWordTilesSetOption);
        window[this.viewerId].scene.primitives.add(earthWordTilesSet);
      }
      if (obj.label === '土方开挖片区倾斜' && selected === false) {
        window[this.viewerId].scene.primitives.remove(earthWordTilesSet);
      }
    }
  }
}
