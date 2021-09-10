/* eslint-disable no-use-before-define */
import * as Cesium from 'cesium';

const heightAccuracy = 1;
export default class inundationAnalysisControl {
  constructor(viewerId) {
    this.dynamicHeightGradeOption = {
      heightBelow: 0,
      colorBelow: '#F90404',
      // colorBelow: rgba(249, 4, 4,0.7),
      heightAbove: 0,
      colorAbove: '#F5D104',
      // colorAbove: 'rgba(245, 209, 4,0.7)',

    };
    this.waterLevel = 0;
    this.viewerId = viewerId;
  }
  inundationAnalysisRender = () => {
    this.dynamicHeightGradeOption.heightBelow = parseFloat(this.dynamicHeightGradeOption.heightBelow);
    this.dynamicHeightGradeOption.heightAbove = this.waterLevel;
    const step = parseInt((this.dynamicHeightGradeOption.heightAbove - this.dynamicHeightGradeOption.heightBelow) / heightAccuracy, 0);
    const colors = gradientColor(this.dynamicHeightGradeOption.colorBelow, this.dynamicHeightGradeOption.colorAbove, step, 0);
    const layers = [];
    // const backgroundColorOpton = [
    //   {
    //     HeightBelow: 100,
    //     HeightAbove: '0',
    //     Color: 'rgba(0, 255, 255, 0.5)',
    //     IsGradient: true,
    //   },
    //   {
    //     HeightBelow: '94',
    //     HeightAbove: '94.2',
    //     Color: 'rgba(0, 255, 21, 0.5)',
    //     IsGradient: true,
    //   },
    //   {
    //     HeightBelow: '94',
    //     HeightAbove: '100',
    //     Color: 'rgba(0, 255, 212, 0.5)',
    //     IsGradient: true,
    //   },
    //   {
    //     HeightBelow: 100,
    //     HeightAbove: '150',
    //     Color: 'rgba(0, 31, 143, 0.5)',
    //     IsGradient: true,
    //   },
    //   {
    //     HeightBelow: 100,
    //     HeightAbove: '300',
    //     Color: 'rgba(19, 0, 143, 0.5)',
    //     IsGradient: true,
    //   },
    // ];
    // const backgroundLayer = {
    //   entries: [],
    //   extendDownwards: true,
    //   extendUpwards: true,
    // };
    // for (let i = 0; i < backgroundColorOpton.length; i += 1) {
    //   const one = backgroundColorOpton[i];
    //   backgroundLayer.entries.push({
    //     height: parseFloat(one.HeightAbove),
    //     color: Cesium.Color.fromCssColorString(one.Color),
    //   });
    // }
    // layers.push(backgroundLayer);
    // layers.push({
    //   entries: [
    //     {
    //       // eslint-disable-next-line no-mixed-operators
    //       height: 40,
    //       color: Cesium.Color.fromCssColorString('rgba(249, 4, 4, 1)'),
    //     },
    //     {
    //       // eslint-disable-next-line no-mixed-operators
    //       height: 89,
    //       color: Cesium.Color.fromCssColorString('rgba(249, 4, 4, 1)'),
    //     },
    //   ],
    // });
    if (colors.length > 1) {
      for (let i = 0; i < colors.length; i += 1) {
        layers.push({
          entries: [
            {
              // eslint-disable-next-line no-mixed-operators
              height: this.dynamicHeightGradeOption.heightBelow + i * heightAccuracy,
              color: Cesium.Color.fromCssColorString(colors[i]),
            },
            {
              // eslint-disable-next-line no-mixed-operators
              height: this.dynamicHeightGradeOption.heightBelow + (i + 1) * heightAccuracy,
              color: Cesium.Color.fromCssColorString(colors[i]),
            },
          ],
        });
      }
      const material = Cesium.createElevationBandMaterial({
        scene: window[this.viewerId].scene,
        layers,
      });
      window[this.viewerId].scene.globe.material = material;
    }
  }
}
/* eslint-disable no-use-before-define */
/* eslint-disable consistent-return */
/*
     // startColor：开始颜色hex
     // endColor：结束颜色hex
     // step:几个阶级（几步）
     // strengthenStep:0----step
     */
function gradientColor(startColor, endColor, step, strengthenStep) {
  const startRGB = colorRgb(startColor);// 转换为rgb数组模式
  const startR = startRGB[0];
  const startG = startRGB[1];
  const startB = startRGB[2];

  const endRGB = colorRgb(endColor);
  let endR = endRGB[0];
  let endG = endRGB[1];
  let endB = endRGB[2];

  let sR = (endR - startR) / step;// 总差值
  let sG = (endG - startG) / step;
  let sB = (endB - startB) / step;
  /* -------------start 颜色增强-------------- */
  endR = endRGB[0] - (strengthenStep * sR);
  endG = endRGB[1] - (strengthenStep * sG);
  endB = endRGB[2] - (strengthenStep * sB);
  sR = (endR - startR) / step;// 总差值
  sG = (endG - startG) / step;
  sB = (endB - startB) / step;
  /* -------------end  颜色增强-------------- */

  const colorArr = [];

  for (let i = 0; i < step; i += 1) {
    // 计算每一步的hex值
    // eslint-disable-next-line radix
    const hex = colorHex(`rgb(${parseInt(((sR * i) + startR))},${parseInt(((sG * i) + startG))},${parseInt(((sB * i) + startB))})`);
    colorArr.push(hex);
  }

  return colorArr;
}
// 将hex表示方式转换为rgb表示方式(这里返回rgb数组模式)
// eslint-disable-next-line func-names
// gradientColor.prototype.colorRgb =
function colorRgb(sColor) {
  const reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
  let sColor2 = sColor.toLowerCase();
  if (sColor2 && reg.test(sColor2)) {
    if (sColor2.length === 4) {
      let sColorNew = '#';
      for (let i = 1; i < 4; i += 1) {
        sColorNew += sColor2.slice(i, i + 1).concat(sColor2.slice(i, i + 1));
      }
      sColor2 = sColorNew;
    }
    // 处理六位的颜色值
    const sColorChange = [];
    for (let i = 1; i < 7; i += 2) {
      // eslint-disable-next-line radix
      sColorChange.push(parseInt(`0x${sColor2.slice(i, i + 2)}`));
    }
    return sColorChange;
  }
  return sColor;
}
// 将rgb表示方式转换为hex表示方式
// eslint-disable-next-line func-names
// gradientColor.prototype.colorHex =
// eslint-disable-next-line consistent-return
function colorHex(rgb) {
  // eslint-disable-next-line no-underscore-dangle
  const _this = rgb;
  const reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
  if (/^(rgb|RGB)/.test(_this)) {
    const aColor = _this.replace(/(?:(|)|rgb|RGB)*/g, '').split(',');
    let strHex = '#';
    for (let i = 0; i < aColor.length; i += 1) {
      let hex = Number(aColor[i]).toString(16);
      hex = hex < 10 ? `${0}${hex}` : hex;// 保证每个rgb的值为2位
      if (hex === '0') {
        hex += hex;
      }
      strHex += hex;
    }
    if (strHex.length !== 7) {
      strHex = _this;
    }
    return strHex;
  } else if (reg.test(_this)) {
    const aNum = _this.replace(/#/, '').split('');
    if (aNum.length === 6) {
      return _this;
    } else if (aNum.length === 3) {
      let numHex = '#';
      for (let i = 0; i < aNum.length; i += 1) {
        numHex += (aNum[i] + aNum[i]);
      }
      return numHex;
    }
  } else {
    return _this;
  }
}
