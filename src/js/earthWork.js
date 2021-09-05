/* eslint-disable no-param-reassign */
import * as Cesium from 'cesium';
import * as turf from '@turf/turf';

const earthWordPolygonId = 'earthWordPolygonId';
export default class EarthWorkControl {
  constructor(viewerId, vue) {
    this.viewerId = viewerId;
    this.vue = vue;
    this.earthWordArea = 0;
    this.earthWordPolygonPositions = [];
    this.riangleSideLength = 5;
    this.earthWordHeight = 95;
    this.isRender = true;
    this.riangleCount = 0;
    this.excavationVolume = 0;
    this.fillVolume = 0;
    this.rianglePositions = [];
  }
  drawExcavateRange = () => {
    const viewer = window[this.viewerId];
    const viewerHandlerDoubldClick = viewer.screenSpaceEventHandler.getInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
    viewer.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
    const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    let label;
    const labelGraphics = new Cesium.LabelGraphics({
      text: '请拾取绘制范围坐标',
      font: '13px bold',
      fillColor: Cesium.Color.BLACK,
      showBackground: true,
      backgroundColor: Cesium.Color.GAINSBORO.withAlpha(0.7),
      horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      pixelOffset: new Cesium.Cartesian2(0, -10),
      disableDepthTestDistance: 500,
    });
    const positions = [];
    const points = [];
    const polygonGraphics = new Cesium.PolygonGraphics({
      hierarchy: new Cesium.PolygonHierarchy(positions),
      outline: true,
      outlineColor: Cesium.Color.DARKTURQUOISE,
      material: Cesium.Color.DARKTURQUOISE.withAlpha(0.3),
      classificationType: Cesium.ClassificationType.CESIUM_3D_TILE,
    });
    const polylineGraphics = new Cesium.PolylineGraphics({
      positions,
      classificationType: Cesium.ClassificationType.CESIUM_3D_TILE,
      material: Cesium.Color.RED.withAlpha(1),
      width: 2,
      clampToGround: true,
    });
    let polygon = viewer.entities.getById(earthWordPolygonId);
    if (polygon) {
      viewer.entities.remove(polygon);
    }
    polygon = viewer.entities.add({
      id: earthWordPolygonId,
      polygon: polygonGraphics,
      polyline: polylineGraphics,

    });
    handler.setInputAction((movement) => {
      const position = viewer.scene.pickPosition(movement.endPosition);
      if (label === undefined) {
        label = viewer.entities.add({
          position,
          label: labelGraphics,
        });
      } else {
        label.position = position;
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    handler.setInputAction((movement) => {
      const position = viewer.scene.pickPosition(movement.position);
      if (positions.length > 0 && Cesium.Cartesian3.distance(position, positions[positions.length - 1]) < 0.1) {
        return;
      }
      positions.push(position);
      polygon.polygon.hierarchy = new Cesium.PolygonHierarchy(positions.concat(positions[0]));
      polygon.polyline.positions = positions.concat(positions[0]);
      const point = viewer.entities.add({
        position,
        point: {
          pixelSize: 5,
          color: Cesium.Color.TRANSPARENT,
          outlineWidth: 2,
          outlineColor: Cesium.Color.DARKTURQUOISE,
          disableDepthTestDistance: 500,
        },
      });
      points.push(point);
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    /* 双击结束 */
    handler.setInputAction(() => {
      /* 清除label */
      viewer.entities.remove(label);
      /* 清除事件和handler */
      handler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
      handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
      handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
      /* 清除points */
      points.forEach((point) => {
        viewer.entities.remove(point);
      });
      /* 恢复默认双击事件 */
      viewer.screenSpaceEventHandler.setInputAction(viewerHandlerDoubldClick, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
      /* 计算面积 */
      const cartographicArray = [];
      positions.concat(positions[0]).forEach((position) => {
        const cartographic = Cesium.Cartographic.fromCartesian(position);
        const cartographicOneArray = [Cesium.Math.toDegrees(cartographic.longitude), Cesium.Math.toDegrees(cartographic.latitude)];
        cartographicArray.push(cartographicOneArray);
      });
      const polygonTurf = turf.polygon([cartographicArray]);

      const polygonArea = turf.area(polygonTurf);
      this.earthWordArea = parseInt(polygonArea, 0);// 图形面积
      /* 存储坐标 */
      positions.push(positions[0]);
      this.earthWordPolygonPositions = positions; // 范围坐标
      handler.destroy();
    }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
  }
  drawTriangulation = () => {
    if (this.earthWordPolygonPositions === undefined) {
      this.vue.$message.error('请先绘制开挖设计线');
      return;
    }
    this.vue.progressBarShow = true; // 打开进度条
    this.rianglePositions = [];
    /* 转地理坐标 */
    const turfPositons = [];
    for (let i = 0; i < this.earthWordPolygonPositions.length; i += 1) {
      const carPosition = this.earthWordPolygonPositions[i];
      const wgs84Position = Cesium.Cartographic.fromCartesian(carPosition);
      const turfPosition = [Cesium.Math.toDegrees(wgs84Position.longitude), Cesium.Math.toDegrees(wgs84Position.latitude)];
      turfPositons.push(turfPosition);
    }
    /* 多边形划分三角网  start */
    const poly = turf.polygon([turfPositons]);
    const triangles = turf.tesselate(poly);
    /* 递归分割三角网 */
    const sideLength = this.riangleSideLength / 1000;
    const triangleNetPositions = [];
    triangles.features.forEach((feature) => {
      triangleNetPositions.push(feature.geometry.coordinates[0].splice(0, 3));
    });
    triangleNetPositions.sort((a, b) => {
      const line1 = turf.lineString(a);
      const length1 = turf.length(line1, { units: 'kilometers' });
      const line2 = turf.lineString(b);
      const length2 = turf.length(line2, { units: 'kilometers' });
      return length1 - length2;
    });
    let index = 0;
    while (index < triangleNetPositions.length) {
      const triangleNetPosition = triangleNetPositions[index];
      const line = turf.lineString(triangleNetPosition.concat([triangleNetPosition[0]]));
      const length = turf.length(line, { units: 'kilometers' });
      if (length > 3 * sideLength) {
        const triangleNetPositionsTem = []; // 用于存储分割后得三角形坐标，多余三个点
        for (let i = 0; i < 3; i += 1) {
          if (i === 0 || i === 1) {
            const lineTem = turf.lineString([triangleNetPosition[i], triangleNetPosition[i + 1]]);
            const lengthTem = turf.length(lineTem, { units: 'kilometers' });
            if (lengthTem > sideLength) {
              triangleNetPositionsTem.push(triangleNetPosition[i]);
              triangleNetPositionsTem.push([(triangleNetPosition[i][0] + triangleNetPosition[i + 1][0]) / 2, (triangleNetPosition[i][1] + triangleNetPosition[i + 1][1]) / 2]);
            } else {
              triangleNetPositionsTem.push(triangleNetPosition[i]);
            }
          } else {
            const lineTem = turf.lineString([triangleNetPosition[2], triangleNetPosition[0]]);
            const lengthTem = turf.length(lineTem, { units: 'kilometers' });
            if (lengthTem > sideLength) {
              triangleNetPositionsTem.push(triangleNetPosition[2]);
              triangleNetPositionsTem.push([(triangleNetPosition[2][0] + triangleNetPosition[0][0]) / 2, (triangleNetPosition[2][1] + triangleNetPosition[0][1]) / 2]);
            } else {
              triangleNetPositionsTem.push(triangleNetPosition[2]);
            }
          }
        }
        triangleNetPositionsTem.push(triangleNetPositionsTem[0]);
        // console.log(triangleNetPositionsTem);

        /* 加入分割后得三角坐标 */
        const polyTem = turf.polygon([triangleNetPositionsTem]);
        const trianglesTem = turf.tesselate(polyTem);
        trianglesTem.features.forEach((feature) => {
          triangleNetPositions.push(feature.geometry.coordinates[0].splice(0, 3));
        });
        triangleNetPositions.splice(index, 1);
      } else {
        index += 1;
      }
    }
    this.riangleCount = triangleNetPositions.length;
    /* 递归分割三角网  end */
    const renderIndex = 0;
    console.log(triangleNetPositions);
    // eslint-disable-next-line no-use-before-define
    const viewer = window[this.viewerId];
    renderTriangle(triangleNetPositions, renderIndex, this.vue, this, viewer);
  }
}

function renderTriangle(triangleNetPositions, renderIndex, vue, control, viewer) {
  if (renderIndex >= triangleNetPositions.length) {
    return;
  }
  const terrainProvider = new Cesium.CesiumTerrainProvider({
    url: 'http://172.16.100.8:8001/金水区三维模型/未来路街道模型/dem20210830',
    requestVertexNormals: true,

  });
  const triangleTurfPositons = triangleNetPositions[renderIndex]; // [[113，34],[],[]]坐标数组

  /* 转cartographic数组 */
  const triangleCartoPositons = [];
  triangleTurfPositons.forEach((triangleTurfPositon) => {
    triangleCartoPositons.push(new Cesium.Cartographic(Cesium.Math.toRadians(triangleTurfPositon[0]), Cesium.Math.toRadians(triangleTurfPositon[1])));
  });
  /* 内插地形求高程 */
  const promise = Cesium.sampleTerrainMostDetailed(terrainProvider, triangleCartoPositons);
  // eslint-disable-next-line no-loop-func
  Cesium.when(promise, (triangleCartoHeightPositons) => {
    const triangleCar3Positons = [];
    triangleCartoHeightPositons.forEach((triangleCartoHeightPositon) => {
      triangleCar3Positons.push(Cesium.Cartographic.toCartesian(triangleCartoHeightPositon));
    });
    control.rianglePositions.push(triangleCar3Positons);
    /* 绘制三角网 start */
    if (control.isRender === true) {
      const polylineGeometry = new Cesium.GroundPolylineGeometry({
        positions: triangleCar3Positons.concat(triangleCar3Positons[0]),
        width: 1,
      });
      const polylineInstance = new Cesium.GeometryInstance({
        geometry: polylineGeometry,
        attributes: {
          color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.RED),
        },
      });
      const primitiveCol = new Cesium.PrimitiveCollection();
      const polylinePrimitive = new Cesium.GroundPolylinePrimitive({
        geometryInstances: [polylineInstance],
        releaseGeometryInstances: false,
        classificationType: Cesium.ClassificationType.CESIUM_3D_TILE,
      });
      // const polygonPrimitive = new Cesium.Primitive();
      primitiveCol.add(polylinePrimitive);
      // primitiveCol.add(polygonPrimitive);
      const primitive = viewer.scene.primitives.add(primitiveCol);
      if (window.earthWorkPrimitives === undefined) {
        window.earthWorkPrimitives = [];
      }
      window.earthWorkPrimitives.push(primitive);
    }
    /* 绘制三角网 end */


    renderIndex += 1;
    vue.progressPercentage = parseInt((renderIndex * 10000) / triangleNetPositions.length, 0) / 100;
    if (renderIndex === triangleNetPositions.length) {
      vue.progressBarShow = false;
      vue.progressPercentage = 0;
      vue.$message({
        type: 'success',
        message: '三角网计算完成！',
      });
    }
    renderTriangle(triangleNetPositions, renderIndex, vue, control, viewer);
  });
}

