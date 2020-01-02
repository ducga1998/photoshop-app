import styled from 'styled-components';
import React from 'react';
import { useDrop } from 'react-dnd';
import DragItemTypes from '../../constants/dragItemTypes';

const Layout = styled.div`
  display: block;
  width: 50%;
  flex: 1;
`;

export default function OverlayLayout({ onDrop, ...props }) {
  const [{ isOver }, drop] = useDrop({
    accept: [DragItemTypes.gallery],
    drop(item) {
      onDrop(item);
      return undefined;
    },
    collect: monitor => ({
      isOver: monitor.isOver(),
    }),
  });
  return (
    <Layout
      {...props}
      ref={drop}
      style={{
        backgroundColor: isOver ? 'rgba(86, 204, 242, 0.5)' : 'transparent',
      }}
    />
  );
}
