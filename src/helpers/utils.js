import piexif from 'piexifjs/piexif';
import config from '../config';
import uuid from 'uuid';

export const convertProportionToPx = (targetRect, canvasRect) => {
  const { height, width, x, y } = targetRect;
  const { frameWidth: widthCanvas, frameHeight: heightCanvas } = canvasRect;

  return {
    height: heightCanvas * height,
    width: widthCanvas * width,
    top: heightCanvas * y,
    left: widthCanvas * x,
  };
};
export const convertPxToProportion = (targetRect, canvasRect) => {
  const { height, width, top, left } = targetRect;
  const { wid: widthCanvas, height: heightCanvas } = canvasRect;
  return {
    height: height / heightCanvas,
    width: width / widthCanvas,
    y: top / heightCanvas,
    x: left / widthCanvas,
  };
};

export const convertCropPxToProportion = (targetRect, canvasRect) => {
  return {};
};
export const swapData = (assets, idSelected, idDrop) => {
  console.log('id =====> ', assets, idSelected, idDrop);
  const dataSelected = assets.find(item => item.idElement === idSelected);
  const dataDrop = assets.find(item => item.idElement === idDrop);
  const indexDrop = assets.indexOf(dataDrop);
  const indexSelected = assets.indexOf(dataSelected);
  const temp = { ...dataSelected };
  const dataCropIndex = { ...assets[indexDrop] };
  // swap src and croprect
  assets[indexSelected].croprect = dataCropIndex.croprect;
  assets[indexSelected].src = dataCropIndex.src;
  assets[indexDrop].croprect = temp.croprect;
  assets[indexDrop].src = temp.src;
  return assets;
};
export const convertCropProporttionToPx = (targetRect, canvasRect) => {
  return {};
};

export const calculateRect = (rect, options) => {
  const { offsetX, offsetY, width, height } = rect;
  const { top, left, right, bottom } = options;
  if (offsetX < left) {
    return 'left';
  }
  if (offsetX > width - right) {
    return 'right';
  }
  if (offsetY < top) {
    return 'top';
  }
  if (offsetY > height - bottom) {
    return 'bottom';
  }
  return 'middle';
};

export async function getBase64ImageFromUrl(imageUrl) {
  var res = await fetch(imageUrl, {
    mode: 'cors',
    cache: 'no-cache',
  });
  var blob = await res.blob();

  return new Promise((resolve, reject) => {
    let reader = new FileReader();
    reader.addEventListener(
      'load',
      () => {
        resolve(reader.result);
      },
      false,
    );

    reader.onerror = () => {
      return reject(this);
    };
    reader.readAsDataURL(blob);
  });
}

export async function getOrientation(url) {
  const data64 = await getBase64ImageFromUrl(url);
  const exif = piexif.load(data64);
  const orientation = exif['0th'][piexif.ImageIFD.Orientation];
  return orientation;
}

export const autoRouteAndFlip = orientation => {
  // console.log('orientation', orientation);
  switch (orientation) {
    case 1: {
      return {};
    }
    case 2:
      return {
        flipX: true,
        originX: 'left',
        originY: 'top',
      };
    //left , top
    case 3:
      return {
        originX: 'right',
        originY: 'bottom',
        angle: 180,
      };
    // is left , top
    case 4:
      return {
        flipX: true,
        originX: 'right',
        originY: 'bottom',
        angle: 180,
        // left , top
      };
    case 5:
      return {
        angle: 90,
        originX: 'left',
        originY: 'bottom',
        flipY: true,
        //left , top
      };
    case 6:
      return {
        angle: 90,
        originX: 'left',
        originY: 'bottom',
        //left , top
      };
    case 7:
      return {
        flipY: true,
        angle: 270,
        originX: 'right',
        originY: 'top',
      };
    case 8:
      return {
        angle: 270,
        originX: 'right',
        originY: 'top',
        // left , top
      };
    default:
      return {
        angle: 0,
      };
  }
};

export async function customPositionAndRoute(imgFabric, dataImage, canvasItem) {
  const orientation = await getOrientation(dataImage.src);
  let imageWidth = imgFabric.width,
    imageHeight = imgFabric.height;
  const options = autoRouteAndFlip(orientation);
  Object.assign(imgFabric, options);
  // console.log('orientation', orientation);
  imgFabric.orientation = orientation;
  if (
    orientation === 6 ||
    orientation === 5 ||
    orientation === 8 ||
    orientation === 7
  ) {
    imageHeight = imgFabric.width;
    imageWidth = imgFabric.height;
  }

  const { width, height, x, y } = dataImage.croprect;
  imgFabric.top = imgFabric.top - y * canvasItem.height;
  imgFabric.left = imgFabric.left - canvasItem.width * x;
  imgFabric.scaleX = canvasItem.width / (imageWidth * width);
  imgFabric.scaleY = canvasItem.height / (imageHeight * height);
  imgFabric.offsetX = 'right';
  imgFabric.offsetY = 'bottom';
  if (options && options.rect) {
    const { rect } = options;
    imgFabric.top = imgFabric.top + imageHeight * rect.top * imgFabric.scaleY;
    imgFabric.left = imgFabric.left + imageWidth * rect.left * imgFabric.scaleX;
  }
  return options;
}

export const tranfromImageWhenRotate = (kclassImage, oldAngle, angle) => {
  const { originX, originY } = kclassImage;
  // really, it' can  selected.angle to orgitation
  const offsetOfAngle = angle - oldAngle;
  const heightScale = kclassImage.height * kclassImage.scaleY;
  const widthScale = kclassImage.width * kclassImage.scaleX;
  if ([3, 8].includes(kclassImage.orientation)) {
    if (offsetOfAngle === 90 || offsetOfAngle === -270) {
      kclassImage.left = kclassImage.left + heightScale;
    }
    if (Math.abs(offsetOfAngle) === 180) {
      kclassImage.left = kclassImage.left - (heightScale - widthScale);
      kclassImage.top = kclassImage.top + heightScale;
    }
    if (offsetOfAngle === -90 || offsetOfAngle === 270) {
      kclassImage.left = kclassImage.left - widthScale;
      kclassImage.top = kclassImage.top - (heightScale - widthScale);
    }
    if (offsetOfAngle === 0) {
      kclassImage.top =
        kclassImage.top - kclassImage.width * kclassImage.scaleX;
    }
    return;
  }
  if (
    (originX === 'left' && originY === 'top') ||
    kclassImage.orientation === 3
  ) {
    console.log('TH left top of orgi = 3');
    if (offsetOfAngle === 90) {
      kclassImage.left = kclassImage.left + heightScale;
    }
    if (Math.abs(offsetOfAngle) === 180) {
      kclassImage.left = kclassImage.left - (heightScale - widthScale);
      kclassImage.top = kclassImage.top + heightScale;
    }
    if (offsetOfAngle === -90 || offsetOfAngle === 270) {
      kclassImage.left = kclassImage.left - widthScale;
      kclassImage.top = kclassImage.top - (heightScale - widthScale);
    }
    if (offsetOfAngle === 0) {
      kclassImage.top =
        kclassImage.top - kclassImage.width * kclassImage.scaleX;
    }
  }
  if (originX === 'right' && originY === 'bottom') {
    console.log('TH right bottom  ');
    // console.log('offsetOfAngle', offsetOfAngle);
    if (offsetOfAngle === 90) {
      console.log('th1');
      kclassImage.left =
        kclassImage.left +
        kclassImage.height * kclassImage.scaleY -
        kclassImage.width * kclassImage.scaleX;
    }
    if (Math.abs(offsetOfAngle) === 180) {
      console.log('th2');
      kclassImage.left =
        kclassImage.left -
        kclassImage.height * kclassImage.scaleY +
        kclassImage.width * kclassImage.scaleX;
      kclassImage.top =
        kclassImage.top + kclassImage.height * kclassImage.scaleY;
    }
    if (offsetOfAngle === -90 || offsetOfAngle === 270) {
      console.log('th3');
      kclassImage.left =
        kclassImage.left - kclassImage.width * kclassImage.scaleX;
      kclassImage.top =
        kclassImage.top -
        kclassImage.height * kclassImage.scaleY +
        kclassImage.width * kclassImage.scaleX;
    }
    if (offsetOfAngle === 0) {
      kclassImage.top =
        kclassImage.top - kclassImage.width * kclassImage.scaleX;
    }
  }
  if (originX === 'left' && originY === 'bottom') {
    console.log('th left bottom');
    if (offsetOfAngle === 90) {
      kclassImage.left = kclassImage.left + widthScale;
    }
    if (Math.abs(offsetOfAngle) === 180) {
      // console.log('th2');
      kclassImage.left = kclassImage.left - (widthScale - heightScale);
      kclassImage.top = kclassImage.top + widthScale;
    }
    if (offsetOfAngle === -90 || offsetOfAngle === 270) {
      console.log('th3');
      kclassImage.left = kclassImage.left - heightScale;
      kclassImage.top = kclassImage.top - (widthScale - heightScale);
    }
    if (offsetOfAngle === 0) {
      kclassImage.top = kclassImage.top - heightScale;
    }
  }
};
export const STATE_DRAGGING = {
  isDragging: false,
  src: '',
  dragOut: false,
  idDragging: '',
  positionDrop: '',

  clear: () => {
    STATE_DRAGGING.src = '';
    STATE_DRAGGING.dragOut = false;
    STATE_DRAGGING.idDragging = '';
  },
};
export const getIndexSpreadAndSpreadData = state => {
  const imageSpread = state.initImageState.find(
    item => item.idPage === (state.spread || state.initImageState[0].idPage),
  );
  // end get imageSpread
  // get indexPage
  const indexPage = state.initImageState.indexOf(imageSpread);
  return { imageSpread, indexPage };
};
export const convertRawDataToStandard = rawData => {
  const {
    files: gallery,
    assetPrefix,
    layout: {
      photobook: { pagespreads },
    },
  } = rawData;
  const initImageState = pagespreads.map(item => {
    const assets = item.assets.map(asset => ({
      ...asset,
      ...{
        src: config.BASE_URL + assetPrefix + asset.uniqueId,
        idElement: uuid(),
      },
    }));
    return {
      assets,
      idPage: uuid(),
    };
  });
  return {
    initImageState,
    gallery,
  };
};
