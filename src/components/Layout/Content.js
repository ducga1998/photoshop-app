import styled from 'styled-components';
import React from 'react';
import DragItemTypes from '../../constants/dragItemTypes';
import { useDrop } from 'react-dnd';

const Wrapper = styled.div`
  width: 100%;
  position: relative;
`;

export default function Content({ onDrop, children, ...other }) {
  const [{ isOver }, drop] = useDrop({
    accept: DragItemTypes.assets,
    drop(item) {
      onDrop(item);
      return undefined;
    },
    collect: monitor => ({
      isOver: monitor.isOver(),
    }),
  });
  return (
    <Wrapper>
      <div
        {...other}
        ref={drop}
        style={{
          zIndex: 1,
          position: 'absolute',
          top: 65,
          right: 0,
          left: 0,
          bottom: 0,
          justifyContent: 'center',
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: isOver ? 'rgba(242,174,174,0.7)' : 'transparent',
        }}
      />
      {children}
    </Wrapper>
  );
}
