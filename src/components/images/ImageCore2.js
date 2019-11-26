import * as React from 'react';
import styled from 'styled-components';
import { fabric } from 'fabric';
import { customPositionAndRoute } from '../../helpers/utils';

const Item = styled.div`
  position: absolute;
  top: ${props => (props.top ? props.top + 'px' : '')};
  width: ${props => (props.width ? props.width + 'px' : '')};
  height: ${props => (props.height ? props.height + 'px' : '')};
  left: ${props => (props.left ? props.left + 'px' : '')};

  overflow: hidden;
`;
export default class ImageCore extends React.PureComponent {
  componentDidMount() {
    this.renderItem();
  }

  renderItem() {
    const { item } = this.props;
    const canvasItem = new fabric.Canvas(item.idElement + 'preview', {
      crossOrigin: 'anonymous',
      cache: 'no-cache',
    });

    fabric.util.loadImage(item.src, async img => {
      const imgFabric = new fabric.Image(img, {
        id: item.idElement + 'preview',
        selectable: false,
      });
      const options = await customPositionAndRoute(imgFabric, item, canvasItem);
      this.oldAngle = options.angle || 0;
      canvasItem.add(imgFabric);
    });
  }

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
