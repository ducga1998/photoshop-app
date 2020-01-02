import styled from 'styled-components';
import React from 'react';
import DragItemTypes from '../../constants/dragItemTypes';
import { useDrag, useDrop } from 'react-dnd';

function Elements({ children, onDrop, ...props }) {
  const [{ isDragging }, drag] = useDrag({
    item: {
      type: DragItemTypes.assets,
      ...props.item,
      canvas: { height: props.height, width: props.width },
    },
    canDrag: !props.isEditing,
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
    begin() {
      document.body.style.cursor = 'grabbing';
    },
    end() {
      document.body.style.cursor = 'auto';
    },
  });
  const [{ isOver }, drop] = useDrop({
    accept: [DragItemTypes.assets, DragItemTypes.gallery],
    drop(item) {
      onDrop(item);
      return undefined;
    },
    collect: monitor => ({
      isOver: monitor.isOver(),
    }),
  });
  return (
    <Element ref={drop} {...props}>
      <div ref={drag} style={{ opacity: isDragging ? '0.3' : '1' }}>
        {children}
      </div>
      <Overlay showOverlay={isOver && !isDragging} />
    </Element>
  );
}

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  box-sizing: border-box;
  background: rgba(86, 204, 242, 0.5);
  opacity: 0.5;
  display: ${props => (props.showOverlay ? 'block' : 'none')};
  pointer-events: none;
  z-index: 10;
`;

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
    pointer-events: ${props => (props.isEditing ? 'auto' : 'none!important')};
    z-index: ${props => (props.isEditing ? '4!important' : '2!important')};
  }
`;

export default Elements;
