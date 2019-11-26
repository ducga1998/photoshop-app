import * as React from 'react';
import styled from 'styled-components';
import { fabric } from 'fabric';
import { convertProportionToPx, customPositionAndRoute, tranfromImageWhenRotate } from '../../helpers/utils';
import { mapStore } from './ImageView';

export default class ImageCore extends React.Component {
  state = {
    isDrag: false,
    loading: true,
  };

  async componentDidMount() {
    console.log('render in componentDidMount');
    await this.renderItem();
  }

  oldAngle = 0;
  kClass = null;
  async renderItem() {
    const { item } = this.props;

    const canvasItem = new fabric.Canvas(item.idElement, {
      crossOrigin: 'anonymous',
      cache: 'no-cache',
    });

    await fabric.Image.fromURL(item.src, async imgFabric => {
      // canvasItem.filterBackend = new fabric.WebglFilterBackend()
      // imgFabric.id= item.idElement,
      // imgFabric.filters.push(new fabric.Image.filters.BlendColor({
      //   color: '#FF0000', // make it red!
      //   mode: 'tint',
      //   opacity: 0
      // }))
      const options = await customPositionAndRoute(imgFabric, item, canvasItem);
      this.oldAngle = options.angle || 0;
      await canvasItem.add(imgFabric);
      // imgFabric.applyFilters()
      await canvasItem.renderAll();
    });

    mapStore.set(item.idElement, canvasItem);
    this.kClass = canvasItem;
    await this.setState({ loading: false });

    canvasItem.on('mouse:wheel', opt => {
      if (!this.props.editable) {
        return;
      }
      console.log("offetX, offsetY ", opt.e.offsetX , opt.e.offsetY)
      const delta = opt.e.deltaY;
      let zoom = canvasItem.getZoom();
      zoom = Math.max(zoom - delta / 300, 0.2);
      canvasItem.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
      opt.e.preventDefault();
      opt.e.stopPropagation();
    })
  }
  componentDidUpdate = async (prevProps, prevState, snapshot) => {
    const { item } = this.props;
    const canvasItem = this.kClass;
    const imgFabric = canvasItem.item(0);
    if (!imgFabric) return;
    if (typeof item.flipX === 'boolean' && item.flipX !== imgFabric.flipX) {
      imgFabric.flipX = !!item.flipX;
    }
    if (
      item.croprect.x !== prevProps.item.croprect.x ||
      item.croprect.y !== prevProps.item.croprect.y ||
      item.croprect.height !== prevProps.item.croprect.height ||
      item.croprect.width !== prevProps.item.croprect.width ||
      item.aoirect.width !== prevProps.item.aoirect.width ||
      item.aoirect.height !== prevProps.item.aoirect.height ||
      item.aoirect.y !== prevProps.item.aoirect.y ||
      item.aoirect.x !== prevProps.item.aoirect.x
    ) {
      // console.log('change croprect and aoirect',item);
      canvasItem.renderAll();
      await customPositionAndRoute(imgFabric, item, canvasItem);
    }
    if (typeof item.flipY === 'boolean' && item.flipY !== imgFabric.flipY) {
      console.log('change flip');
      imgFabric.flipY = !!item.flipY;
    }
    if (typeof item.angle === 'number' && item.angle !== imgFabric.angle) {
      console.log('change angle', item.angle, this.oldAngle);
      imgFabric.angle = item.angle;
      tranfromImageWhenRotate(imgFabric, this.oldAngle, item.angle);
    }
    if (item.src !== imgFabric.getSrc()) {
      console.log('change src');
      imgFabric.setSrc(item.src, () => {
        canvasItem.renderAll();
      });
    }
    canvasItem.renderAll();
  };
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
        data-element={item.idElement}
        data-src={item.src}
        isDelete={!item.src.length}
        draggable
        isDrag={editable}>
        {this.state.loading ? <Loading /> : null}
        <Border border={editable} />
        <Canvas id={item.idElement} {...rect} isLoading={this.state.loading} />
      </Element>
    );
  }
}
const Element = styled.div`
  position: absolute;
  top: ${props => (props.top ? props.top + 'px' : '')};
  width: ${props => (props.width ? props.width + 'px' : '')};
  height: ${props => (props.height ? props.height + 'px' : '')};
  left: ${props => (props.left ? props.left + 'px' : '')};
  overflow: hidden;
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
  z-index: 219;
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
