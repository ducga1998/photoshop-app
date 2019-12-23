import * as React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { fabric } from 'fabric';
import { customPositionAndRoute } from '../../helpers/utils';
import withExifLoaded from './withExifLoaded';

const f = fabric.Image.filters;

const Item = styled.div`
  position: absolute;
  top: ${props => (props.top ? props.top + 'px' : '')};
  width: ${props => (props.width ? props.width + 'px' : '')};
  height: ${props => (props.height ? props.height + 'px' : '')};
  left: ${props => (props.left ? props.left + 'px' : '')};
  pointer-events: none;
  overflow: hidden;
`;

const RectShape = PropTypes.shape({
  x: PropTypes.number,
  y: PropTypes.number,
  height: PropTypes.number,
  width: PropTypes.number,
});

class ImageCorePreview extends React.PureComponent {
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

  componentDidMount() {
    this.renderItem();
  }

  renderItem() {
    const { item } = this.props;
    const canvasItem = new fabric.Canvas(item.idElement + 'preview', {
      selection: false,
    });
    this.canvasItem = canvasItem;
    fabric.Image.fromURL(
      item.src,
      async imgFabric => {
        const options = await customPositionAndRoute(
          imgFabric,
          item,
          canvasItem,
        );
        this.imgFabric = imgFabric;
        if (item.filterColor) {
          if (item.filterColor.length > 0) {
            imgFabric.filters[0] = new f[item.filterColor]();
          } else {
            imgFabric.filters = [];
          }

          imgFabric.applyFilters();
        }
        imgFabric.flipY = !!item.flipVertical;
        imgFabric.flipX = !!item.flipHorizontal;

        Object.assign(imgFabric, options);
        canvasItem.add(imgFabric);
        canvasItem.renderAll();
      },
      { crossOrigin: 'anonymous', selectable: false },
    );
  }

  applyFilter() {
    const { item } = this.props;

    requestAnimationFrame(() => {
      if (item.filterColor && item.filterColor.length > 0) {
        this.imgFabric.filters[0] = new f[item.filterColor]();
      } else {
        this.imgFabric.filters = [];
      }

      this.imgFabric.applyFilters();
      this.canvasItem.renderAll();
    });
  }

  componentDidUpdate = async (prevProps, prevState, snapshot) => {
    const { item } = this.props;
    const canvasItem = this.canvasItem;

    let needRerender = false;
    let imgKclass = canvasItem.item(0);
    if (!imgKclass) {
      return;
    }
    if (
      (item.croprect && item.croprect.x !== prevProps.item.croprect.x) ||
      (item.croprect && item.croprect.y !== prevProps.item.croprect.y) ||
      (item.croprect &&
        item.croprect.height !== prevProps.item.croprect.height) ||
      (item.croprect &&
        item.croprect.width !== prevProps.item.croprect.width) ||
      (item.targetrect &&
        item.targetrect.width !== prevProps.item.targetrect.width) ||
      (item.targetrect &&
        item.targetrect.height !== prevProps.item.targetrect.height) ||
      (item.targetrect && item.targetrect.y !== prevProps.item.targetrect.y) ||
      (item.targetrect && item.targetrect.x !== prevProps.item.targetrect.x) ||
      item.rotate !== prevProps.item.rotate ||
      item.src !== prevProps.item.src
    ) {
      const options = await customPositionAndRoute(imgKclass, item, canvasItem);
      Object.assign(imgKclass, options);
      needRerender = true;
    }
    if (item.filterColor !== prevProps.item.filterColor) {
      this.applyFilter();
      // kclassCanvas.renderAll();
    }
    if (item.flipHorizontal !== prevProps.item.flipHorizontal) {
      imgKclass.flipX = !!item.flipHorizontal;
      needRerender = true;
    }

    if (item.flipVertical !== prevProps.item.flipVertical) {
      imgKclass.flipY = !!item.flipVertical;
      needRerender = true;
      // console.log('after change view port ', vpt);
    }
    if (needRerender) {
      canvasItem.renderAll();
    }
  };

  render() {
    // console.log('props item', this.props);
    const { rect, item } = this.props;
    return (
      <Item {...rect} data-element={item.idElement} draggable>
        <canvas
          {...rect}
          style={{ width: '100%', height: '100%1' }}
          id={item.idElement + 'preview'}
        />
      </Item>
    );
  }
}

export default withExifLoaded(ImageCorePreview);
