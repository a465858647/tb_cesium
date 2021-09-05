import * as Cesium from 'cesium';
// 菜单树配置
const layerControlDataOption = [{
  id: '1',
  label: '影像',
  children: [{
    id: '1-1',
    label: 'Cesium',
  }, {
    id: '1-2',
    label: '天地图',
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
export default class LayerControl {
  constructor(viewerId, layerControlData, layerControlProps) {
    this.viewerId = viewerId;
    this.layerControlData = layerControlData || layerControlDataOption;
    this.layerControlProps = layerControlProps || layerControlPropsOption;
  }
  layerTreesCheckChanged = (obj, selected, hasChild) => {
    if (hasChild === false) {
      if (obj.label === 'Cesium' && selected === true) {
        window[this.viewerId].imageryLayers.add(cesiumImageryLayer);
      }
      if (obj.label === 'Cesium' && selected === false) {
        window[this.viewerId].imageryLayers.remove(cesiumImageryLayer, false);
      }
      if (obj.label === '天地图' && selected === true) {
        window[this.viewerId].imageryLayers.add(tdtImageryLayer);
      }
      if (obj.label === '天地图' && selected === false) {
        window[this.viewerId].imageryLayers.remove(tdtImageryLayer, false);
      }
    }
  }
}
