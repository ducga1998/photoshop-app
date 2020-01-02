import React from 'react';
import { useDragLayer } from 'react-dnd';
import DragItemTypes from '../../constants/dragItemTypes';
import ImageCorePreview from '../Images/ImageCorePreview';
import { convertProportionToPx } from '../../helpers/position.helper';

const layerStyles = {
  position: 'fixed',
  pointerEvents: 'none',
  cursor: 'pointer',
  zIndex: 100,
  left: 0,
  top: 0,
  width: '100%',
  height: '100%',
};

function getItemStyles(initialOffset, currentOffset, type, canvas = {}) {
  if (!initialOffset || !currentOffset) {
    return {
      display: 'none',
      transform: 'scale(1)',
    };
  }
  let { x, y } = currentOffset;
  const transform = `scale(${type === DragItemTypes.assets ? 0.7 : 1})`;
  return {
    display: 'block',
    position: 'fixed',
    transform,
    left: x,
    top: y,
    width: canvas.width,
    height: canvas.height,
    WebkitTransform: transform,
    transformOrigin: `center center`,
  };
}

const CustomDragLayer = props => {
  const {
    itemType,
    isDragging,
    item,
    initialOffset,
    currentOffset,
  } = useDragLayer(monitor => ({
    item: monitor.getItem(),
    itemType: monitor.getItemType(),
    initialOffset: monitor.getInitialSourceClientOffset(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging(),
  }));

  function renderItem() {
    switch (itemType) {
      case DragItemTypes.assets: {
        const { type, canvas, ...itemData } = item;
        const rect = convertProportionToPx(
          {
            x: 0,
            y: 0,
            width: 1,
            height: 1,
          },
          {
            frameWidth: canvas.width,
            frameHeight: canvas.height,
          },
        );
        return (
          <ImageCorePreview item={itemData} rect={rect} editable={false} />
        );
      }
      case DragItemTypes.gallery: {
        const src = item.src;
        const rect = convertProportionToPx(
          {
            x: 0,
            y: 0,
            width: 1,
            height: 1,
          },
          {
            frameWidth: 94,
            frameHeight: 94,
          },
        );
        return (
          <ImageCorePreview
            editable={false}
            rect={rect}
            item={{
              src: src,
              idElement: 'hehe' + src,
            }}
          />
        );
      }

      default:
        return null;
    }
  }

  if (!isDragging) {
    return null;
  }
  return (
    <div style={layerStyles}>
      <div
        style={{
          ...getItemStyles(initialOffset, currentOffset, itemType, item.canvas),
          transition: 'transform 0.3s ease',
        }}>
        {renderItem()}
      </div>
    </div>
  );
};
export default CustomDragLayer;
