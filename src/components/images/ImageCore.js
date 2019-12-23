import * as React from 'react';
import styled from 'styled-components';
import { fabric } from 'fabric';
import {
  convertProportionToPx,
  convertPxToProportion,
  customPositionAndRoute,
  getFromMaxMin,
  getMaxMinRect,
} from '../../helpers/utils';
import { mapStore } from './ImageView';
import withExifLoaded from './withExifLoaded';
import _ from 'lodash';
import PropTypes from 'prop-types';
import exif2css from 'exif2css';

import './ImageCore.css';

const f = fabric.Image.filters;

const RectShape = PropTypes.shape({
  x: PropTypes.number,
  y: PropTypes.number,
  height: PropTypes.number,
  width: PropTypes.number,
});

class ImageCore extends React.Component {
  static propTypes = {
    item: PropTypes.shape({
      src: PropTypes.string.isRequired,
      filterColor: PropTypes.string,
      flipVertical: PropTypes.bool,
      flipHorizontal: PropTypes.bool,
      croprect: RectShape,
      targetrect: RectShape,
      rotate: PropTypes.number,
      idElement: PropTypes.string,
    }),
  };
  state = {
    isDrag: false,
    loading: true,
  };

  async componentDidMount() {
    await this.renderItem();
  }

  oldRotate = 0;
  canvasItem = null;
  imgFabric = null;

  saveDataToStore = () => {
    const croprect = convertPxToProportion(this.imgFabric, this.canvasItem);
    this.props.changeImageData({
      data: {
        croprect,
      },
      idDrop: this.props.item.idElement,
    });
  };

  _saveData = _.debounce(this.saveDataToStore, 500);

  applyFilter() {
    const { item } = this.props;

    requestAnimationFrame(() => {
      if (this.imgFabric) {
        if (item.filterColor && item.filterColor.length > 0) {
          this.imgFabric.filters[0] = new f[item.filterColor]();
        } else {
          this.imgFabric.filters = [];
        }

        this.imgFabric && this.imgFabric.applyFilters();
        this.reRenderCanvas();
      }
    });
  }

  renderItem() {
    const { item } = this.props;

    const canvasItem = new fabric.Canvas(item.idElement, {
      selection: false,
    });
    this.canvasItem = canvasItem;
    fabric.Image.fromURL(
      item.src,
      async imgFabric => {
        this.imgFabric = imgFabric;
        this.addListener(canvasItem);
        const options = await customPositionAndRoute(
          imgFabric,
          item,
          canvasItem,
        );
        this.applyFilter();
        this.oldRotate = options.rotate || 0;
        Object.assign(imgFabric, options);
        imgFabric.flipY = !!item.flipVertical;
        imgFabric.flipX = !!item.flipHorizontal;
        imgFabric.ratio = imgFabric.scaleX / imgFabric.scaleY;
        // imgFabric.originalLeft = 0;
        // imgFabric.originalTop = 0;
        canvasItem.add(imgFabric);

        this.setState({ loading: false });
        this.reRenderCanvas();
        // this.saveDataToStore();
      },
      { crossOrigin: 'anonymous', selectable: false },
    );
    mapStore.set(item.idElement, canvasItem);
  }

  reRenderCanvas = () => {
    this.canvasItem && this.canvasItem.renderAll();
  };

  setStyleForPreview = ({
    top,
    left,
    width,
    height,
    scaleX,
    scaleY,
    orientation,
  }) => {
    this.debounceRemovePreview.cancel();
    this.preview.style.transform = exif2css(orientation).transform;
    this.preview.style.transformOrigin = exif2css(orientation)[
      'transform-origin'
    ];
    this.preview.style.display = 'block';
    this.preview.style.top = top + 'px';
    this.preview.style.left = left + 'px';
    this.preview.style.width = width * scaleX + 'px';
    this.preview.style.height = height * scaleY + 'px';
  };

  removePreview = () => {
    this.preview.style.display = 'none';
  };
  debounceRemovePreview = _.debounce(this.removePreview, 500);
  addListener = canvasItem => {
    const { imgFabric } = this;
    canvasItem.on('mouse:wheel', opt => {
      opt.e.preventDefault();
      opt.e.stopPropagation();
      if (!this.props.editable) {
        return;
      }
      const delta = Math.min(Math.max(-4, opt.e.deltaY), 4);
      const nextScaleX = imgFabric.scaleX * (1 + delta * 0.05);
      const factor = imgFabric.scaleX / nextScaleX;
      const dx = (opt.e.offsetX - imgFabric.left) * (factor - 1),
        dy = (opt.e.offsetY - imgFabric.top) * (factor - 1);
      const {
        maxTop,
        minTop,
        maxLeft,
        minLeft,
        minScaleY,
        minScaleX,
      } = getMaxMinRect(imgFabric, canvasItem);
      if (
        imgFabric.scaleX * factor < minScaleX ||
        imgFabric.scaleY * factor <= minScaleY
      ) {
        return;
      }
      imgFabric.top = getFromMaxMin(minTop, imgFabric.top - dy, maxTop);
      imgFabric.left = getFromMaxMin(minLeft, imgFabric.left - dx, maxLeft);
      imgFabric.scaleX = getFromMaxMin(minScaleX, imgFabric.scaleX * factor, 5);
      imgFabric.scaleY = getFromMaxMin(minScaleY, imgFabric.scaleY * factor, 5);
      this.setStyleForPreview(imgFabric);
      this.debounceRemovePreview();
      this._saveData();
      this.reRenderCanvas();
      // console.log("")
    });

    let startOffsetX = 0,
      startOffsetY = 0,
      originalTop = 0,
      originalLeft = 0;

    const onMouseMove = ({ e }) => {
      const { maxTop, minTop, maxLeft, minLeft } = getMaxMinRect(
        imgFabric,
        canvasItem,
      );
      imgFabric.left = getFromMaxMin(
        minLeft,
        originalLeft + e.clientX - startOffsetX,
        maxLeft,
      );
      imgFabric.top = getFromMaxMin(
        minTop,
        originalTop + e.clientY - startOffsetY,
        maxTop,
      );
      this.setStyleForPreview(imgFabric);
      this.reRenderCanvas();
    };

    canvasItem.on('mouse:down', opt => {
      if (!opt.e.clientX || !opt.e.clientY) {
        return;
      }
      startOffsetX = opt.e.clientX;
      startOffsetY = opt.e.clientY;
      originalTop = imgFabric.top;
      originalLeft = imgFabric.left;
      const onMouseUp = ({ e }) => {
        e.preventDefault();
        e.stopPropagation();
        this.removePreview();
        this._saveData();
        canvasItem.off('mouse:move', onMouseMove);
        canvasItem.off('mouse:up', onMouseUp);
      };
      canvasItem.on('mouse:move', onMouseMove);
      canvasItem.on('mouse:up', onMouseUp);
    });
    this.canvasRef &&
      this.canvasRef.addEventListener(
        'touchstart',
        e => {
          if (!this.props.editable) {
            return;
          }
          const originalScaleX = imgFabric.scaleX;
          const originalScaleY = imgFabric.scaleY;
          if (e.touches.length === 1) {
            startOffsetX = e.touches[0].clientX;
            startOffsetY = e.touches[0].clientY;
            originalTop = imgFabric.top;
            originalLeft = imgFabric.left;
          }

          function onTouchMove(e) {
            imgFabric.left = originalLeft + e.touches[0].clientX - startOffsetX;
            imgFabric.top = originalTop + e.touches[0].clientY - startOffsetY;
            if (e.touches.length === 2) {
              const offsetX =
                [...e.changedTouches].reduce(
                  (acc, item) => acc + item.offsetX,
                  0,
                ) / e.changedTouches.length;
              const offsetY =
                [...e.changedTouches].reduce(
                  (acc, item) => acc + item.offsetY,
                  0,
                ) / e.changedTouches.length;
              const dx = (offsetX - imgFabric.left) * (e.scale - 1),
                dy = (offsetY - imgFabric.top) * (e.scale - 1);
              imgFabric.scaleX = originalScaleX * e.scale;
              imgFabric.scaleY = originalScaleY * e.scale;
              imgFabric.top = Math.min(imgFabric.top - dy, 0);
              imgFabric.left = Math.min(imgFabric.left - dx, 0);
            }
            this.reRenderCanvas();
          }

          const onTouchEnd = e => {
            e.preventDefault();
            e.stopPropagation();
            this.canvasRef.removeEventListener('touchend', onTouchEnd);
            this.canvasRef.removeEventListener('touchmove', onTouchMove);
          };

          this.canvasRef.addEventListener('touchmove', onTouchMove);
          this.canvasRef.addEventListener('touchend', onTouchEnd);
          console.log(e);
        },
        false,
      );
  };

  componentDidUpdate = async prevProps => {
    const { item } = this.props;
    const canvasItem = this.canvasItem;
    let needRerender = false;
    let imgKclass = canvasItem.item(0);
    if (!imgKclass) {
      return;
    }
    if (
      item.croprect.x !== prevProps.item.croprect.x ||
      item.croprect.y !== prevProps.item.croprect.y ||
      item.croprect.height !== prevProps.item.croprect.height ||
      item.croprect.width !== prevProps.item.croprect.width ||
      item.targetrect.width !== prevProps.item.targetrect.width ||
      item.targetrect.height !== prevProps.item.targetrect.height ||
      item.targetrect.y !== prevProps.item.targetrect.y ||
      item.targetrect.x !== prevProps.item.targetrect.x ||
      item.rotate !== prevProps.item.rotate
    ) {
      const options = await customPositionAndRoute(imgKclass, item, canvasItem);
      Object.assign(imgKclass, options);
      needRerender = true;
    }
    if (item.filterColor !== prevProps.item.filterColor) {
      this.applyFilter();
    }
    if (item.flipHorizontal !== prevProps.item.flipHorizontal) {
      imgKclass.flipX = !!item.flipHorizontal;
      needRerender = true;
    }

    if (item.flipVertical !== prevProps.item.flipVertical) {
      imgKclass.flipY = !!item.flipVertical;
      needRerender = true;
    }
    if (item.src !== imgKclass.getSrc()) {
      imgKclass.setSrc(item.src, () => {
        this.reRenderCanvas();
      });
    }
    if (needRerender) {
      this.reRenderCanvas();
    }
  };

  componentWillUnmount() {
    this.canvasItem = null;
    this.imgFabric = null;
    mapStore.delete(this.props.item.idElement);
  }

  render() {
    const { item, frameHeight, frameWidth, editable } = this.props;
    const rect = convertProportionToPx(item.targetrect, {
      frameHeight,
      frameWidth,
    });
    // console.log("rect",item.idElement,rect)
    return (
      <Element
        border={editable}
        {...rect}
        ref={ref => (this.canvasRef = ref)}
        data-element={item.idElement}
        data-src={item.src}
        isDelete={!item.src.length}
        draggable
        isDrag={editable}>
        {this.state.loading ? <Loading /> : null}
        <img
          src={item.src}
          ref={ref => (this.preview = ref)}
          className="img-preview"
        />
        <Border border={editable} />
        {/*{item.uniqueId}*/}
        <Canvas id={item.idElement} {...rect} isLoading={this.state.loading} />
      </Element>
    );
  }
}

const Element = styled.div`
  color: black;
  font-size: 9px;
  position: absolute;
  top: ${props => (props.top ? props.top + 'px' : '')};
  width: ${props => (props.width ? props.width + 'px' : '')};
  height: ${props => (props.height ? props.height + 'px' : '')};
  left: ${props => (props.left ? props.left + 'px' : '')};
  cursor: pointer;
  box-sizing: content-box;
  background: ${props => (props.isDelete ? '#d4d4d4' : '')};
  canvas {
    pointer-events: ${props => (props.isDrag ? 'auto' : 'none!important')};
  }
`;

const Canvas = styled.canvas`
  width: 100%;
  height: 100%;
  display: ${props => (props.loading ? 'none' : 'block')};
`;
const Border = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0px;
  left: 0px;
  box-sizing: border-box;
  z-index: 1;
  pointer-events: none;

  border: ${props =>
    props.border ? '2px dashed #494B4D;' : '3px dashed  transparent '};
`;
const Loading = styled.div`
  overflow: hidden;
  animation: placeholderShimmer 2s linear;
  animation-iteration-count: infinite;
  background-color: #fff;
  background-image: linear-gradient(
    to right,
    rgba(0, 0, 0, 0.08) 0,
    rgba(0, 0, 0, 0.15) 15%,
    rgba(0, 0, 0, 0.08) 30%
  );
  background-size: 1200px 100%;
  max-width: 30rem;
  height: 100%;
  width: 100%;
  background-color: #fff;
  @keyframes placeholderShimmer {
    0% {
      background-position: -1200px 0;
    }

    100% {
      background-position: 1200px 0;
    }
  }
`;

export default withExifLoaded(ImageCore);
