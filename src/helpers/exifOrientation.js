import EXIF from 'exif-js';

const storage = {
  key: 'orientation',
  setItem(value) {
    if (process.browser) {
      localStorage.setItem(this.key, JSON.stringify(value));
    }
  },
  getItem() {
    const store = process.browser && localStorage.getItem(this.key);
    if (!store) {
      return null;
    }
    try {
      const response = JSON.parse(store);
      return response;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
};

export const orientationCache = {
  __cache: storage.getItem() || {},
  setCache(url, orientation) {
    this.__cache[url] = orientation;
    storage.setItem(this.__cache);
  },
  getItem(url) {
    return this.__cache[url];
  },
};

export async function getBase64ImageFromUrl(imageUrl) {
  var res = await fetch(imageUrl, {
    mode: 'cors',
    cache: 'force-cache',
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

function getExif(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = url;
    image.crossOrigin = 'anonymous';
    image.onload = () => {
      EXIF.getData(image, function() {
        const orientation = EXIF.getTag(image, 'Orientation');
        console.log(url, orientation);
        resolve(orientation || 1);
      });
    };
  });
}

export async function getOrientation(url) {
  const cache = orientationCache.getItem(url);
  if (cache) {
    return cache;
  }
  try {
    const orientation = await getExif(url);
    // const data64 = await getBase64ImageFromUrl(url);
    // const exif = piexif.load(data64);
    // const orientation = exif['0th'][piexif.ImageIFD.Orientation];
    orientationCache.setCache(url, orientation);
    return orientation || 1;
  } catch (e) {
    console.log('err exif', url);
    orientationCache.setCache(url, 1);
    return 1;
  }
}
