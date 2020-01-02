import { getOrientation } from './exifOrientation';
import { fabric } from 'fabric';
import { isClientSide } from './render.helper';

if (isClientSide()) {
  Object.defineProperty(fabric.Image.prototype, 'imageWidth', {
    get: function imageWidth() {
      if (this.angle === 90 || this.angle === 270) {
        return this.height;
      }
      return this.width;
    },
  });
  Object.defineProperty(fabric.Image.prototype, 'imageHeight', {
    get: function imageHeight() {
      if (this.angle === 90 || this.angle === 270) {
        return this.width;
      }
      return this.height;
    },
  });
  Object.defineProperty(fabric.Image.prototype, 'imageActualHeight', {
    get: function imageActualHeight() {
      if (this.angle === 90 || this.angle === 270) {
        return this.width * this.scaleX;
      }
      return this.height * this.scaleY;
    },
  });
  Object.defineProperty(fabric.Image.prototype, 'imageActualWidth', {
    get: function imageActualWidth() {
      if (this.angle === 90 || this.angle === 270) {
        return this.height * this.scaleY;
      }
      return this.width * this.scaleX;
    },
  });
  Object.defineProperty(fabric.Image.prototype, 'ratio', {
    get: function ratio() {
      return this.scaleX / this.scaleY;
    },
  });
}

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

export const convertPxToProportion = (imgFabric, canvasItem) => {
  let imageActualWidth = imgFabric.width * imgFabric.scaleX;
  let imageActualHeight = imgFabric.height * imgFabric.scaleY;
  if (imgFabric.orientation >= 5) {
    imageActualWidth = imgFabric.height * imgFabric.scaleX;
    imageActualHeight = imgFabric.width * imgFabric.scaleY;
  }
  const height = canvasItem.height / imageActualHeight;
  const width = canvasItem.width / imageActualWidth;
  const x = -imgFabric.left / imageActualWidth,
    y = -imgFabric.top / imageActualHeight;
  return {
    x,
    y,
    width,
    height,
  };
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

const data = {
  notFlip: {
    0: {
      originX: 'left',
      originY: 'top',
      angle: 0,
    },
    180: {
      originX: 'right',
      originY: 'bottom',
      angle: 180,
    },
    90: {
      angle: 90,
      originX: 'left',
      originY: 'bottom',
    },
    270: {
      angle: 270,
      originX: 'right',
      originY: 'top',
    },
  },
  flip: {
    0: {
      flipHorizontal: true,
      originX: 'left',
      originY: 'top',
      angle: 0,
    },
    180: {
      flipHorizontal: true,
      originX: 'right',
      originY: 'bottom',
      angle: 180,
    },
    90: {
      angle: 90,
      originX: 'left',
      originY: 'bottom',
      flipVertical: true,
    },
    270: {
      flipVertical: true,
      angle: 270,
      originX: 'right',
      originY: 'top',
    },
  },
};

function getRotate(a) {
  return a % 360;
}

function getNewIndex(currentIndex, addIndex, maxIndex = 3) {
  const n = currentIndex + addIndex;
  if (n > maxIndex) {
    return ((n + 1) % (maxIndex + 1)) - 1;
  }
  return n;
}

export function getOrientations(orientation = 1, angle = 0, flipX, flipY) {
  const notFlip = [1, 6, 3, 8];
  const flip = [2, 5, 4, 7];
  const isFlip = flip.indexOf(orientation);
  const isNotFlip = notFlip.indexOf(orientation);
  if (isFlip > -1) {
    orientation = flip[getNewIndex(isFlip, angle / 90)];
  } else {
    orientation = notFlip[getNewIndex(isNotFlip, angle / 90)];
  }
  if (angle === 90 || angle === 270) {
    [flipX, flipY] = [flipY, flipX];
  }
  if (flipX && flipY) {
    const isFlip = flip.indexOf(orientation);
    const isNotFlip = notFlip.indexOf(orientation);
    orientation =
      isFlip > -1
        ? flip[getNewIndex(isFlip, 2)]
        : notFlip[getNewIndex(isNotFlip, 2)];
  } else if (flipX) {
    const isFlip = flip.indexOf(orientation);
    const isNotFlip = notFlip.indexOf(orientation);
    orientation = isFlip > -1 ? notFlip[isFlip] : flip[isNotFlip];
  } else if (flipY) {
    const isFlip = flip.indexOf(orientation);
    const isNotFlip = notFlip.indexOf(orientation);
    orientation =
      isFlip > -1
        ? notFlip[getNewIndex(isFlip, 2)]
        : flip[getNewIndex(isNotFlip, 2)];
  }
  return orientation;
}

export function getTotalAngle(orientation, rotate) {
  const map = {
    1: 0,
    2: 0,
    3: 180,
    4: 180,
    5: 90,
    6: 90,
    7: 270,
    8: 270,
  };
  return rotate + (map[orientation] || 0);
}

export const autoRouteAndFlip = (orientation, rotate = 0) => {
  switch (orientation) {
    case 1: {
      return {
        ...data.notFlip[getRotate(rotate)],
      };
    }
    case 2:
      return {
        ...data.flip[getRotate(rotate)],
      };
    //left , top
    case 3:
      return {
        ...data.notFlip[getRotate(rotate + 180)],
      };
    // is left , top
    case 4:
      return {
        ...data.flip[getRotate(rotate + 180)],
      };
    case 5:
      return {
        ...data.flip[getRotate(rotate + 90)],
      };
    case 6:
      return {
        ...data.notFlip[getRotate(rotate + 90)],
      };
    case 7:
      return {
        ...data.flip[getRotate(rotate + 270)],
      };
    case 8:
      return {
        ...data.notFlip[getRotate(rotate + 270)],
      };
    default:
      return {
        ...data.notFlip[getRotate(rotate)],
      };
  }
};

export function translateOnFlip(dataImg, imgFabric, canvasItem) {
  const { angle } = imgFabric;
  const imgActualWidth =
    angle === 90 || angle === 270
      ? imgFabric.height * imgFabric.scaleY
      : imgFabric.width * imgFabric.scaleX;
  const nextLeft = canvasItem.width - imgActualWidth - imgFabric.left;
  return { left: nextLeft };
}

export function translateOnRotate(dataImg, imgFabric, canvasItem, nextAngle) {
  const prevAngle = imgFabric.rotate; // rotate store in redux
  const imgCurrentAngle = imgFabric.angle; // angle with rotate and exif orientation
  let translate = (canvasItem.height - canvasItem.width) / 2;
  if (
    (!nextAngle && prevAngle === 270) ||
    prevAngle + 90 === (nextAngle || 0)
  ) {
    // revert;
    const imgActualHeight =
      !imgCurrentAngle || imgCurrentAngle === 180
        ? imgFabric.height * imgFabric.scaleY
        : imgFabric.width * imgFabric.scaleX;
    const bottom = canvasItem.height - imgActualHeight - imgFabric.top;
    return { left: bottom - translate, top: imgFabric.left + translate };
  }
  const imgActualWidth =
    imgCurrentAngle === 90 || imgCurrentAngle === 270
      ? imgFabric.height * imgFabric.scaleY
      : imgFabric.width * imgFabric.scaleX;
  const right = canvasItem.width - imgActualWidth - imgFabric.left;
  return {
    left: imgFabric.top - translate,
    top: right + translate,
  };
}

export async function customPositionAndRoute(imgFabric, dataImage, canvasItem) {
  const orientation = await getOrientation(dataImage.src);
  let imageWidth = imgFabric.width,
    imageHeight = imgFabric.height;
  // console.log(dataImage.rotate);
  const options = autoRouteAndFlip(orientation, dataImage.rotate);
  imgFabric.orientation = orientation || 1;
  if (
    orientation === 6 ||
    orientation === 5 ||
    orientation === 8 ||
    orientation === 7
  ) {
    imageHeight = imgFabric.width;
    imageWidth = imgFabric.height;
  }

  if (!dataImage.croprect) {
    // case with gallery
    const { width: canvasWidth, height: canvasHeight } = canvasItem;
    const ratio = imageWidth / imageHeight;
    const canvasRatio = canvasWidth / canvasHeight;
    if (canvasRatio < ratio) {
      // scale base on height
      const top = 0;
      const scale = canvasHeight / imageHeight;
      const left = -(scale * imageWidth - canvasWidth) / 2;
      return {
        ...options,
        top: top,
        left: left,
        scaleY: scale,
        scaleX: scale,
      };
    } else {
      // scale base on width
      const left = 0;
      const scale = canvasWidth / imageWidth;
      const top = -(scale * imageHeight - canvasHeight) / 2;
      return {
        ...options,
        top: top,
        left: left,
        scaleY: scale,
        scaleX: scale,
      };
    }
  }
  const { width, height, x, y } = dataImage.croprect;
  const scaleX = canvasItem.width / (imageWidth * width);
  const scaleY = canvasItem.height / (imageHeight * height);
  let top = -y * imageHeight * scaleY;
  let left = -imageWidth * scaleX * x;
  return {
    ...options,
    top,
    left,
    scaleX,
    scaleY,
  };
}

export function getMaxMinRect(imgFabric, canvasItem) {
  let imgHeight = imgFabric.height;
  let imgWidth = imgFabric.width;
  let canvasHeight = canvasItem.height;
  let canvasWidth = canvasItem.width;
  if (imgFabric.angle === 90 || imgFabric.angle === 270) {
    [canvasHeight, canvasWidth] = [canvasWidth, canvasHeight];
  }
  const ratio =
    (imgFabric.width * imgFabric.scaleX) /
    (imgFabric.height * imgFabric.scaleY);
  let minScaleX = canvasWidth / imgWidth;
  let minScaleY = minScaleX / imgFabric.ratio;
  const canvasRatio = canvasWidth / canvasHeight;
  const maxTop = 0;
  const minTop = canvasItem.height - imgFabric.imageActualHeight;
  const maxLeft = 0;
  const minLeft = canvasItem.width - imgFabric.imageActualWidth;
  if (canvasRatio < ratio) {
    minScaleY = canvasHeight / imgHeight;
    minScaleX = minScaleY * imgFabric.ratio;
  }
  return {
    maxTop,
    minTop,
    maxLeft,
    minLeft,
    minScaleY,
    minScaleX,
  };
}
