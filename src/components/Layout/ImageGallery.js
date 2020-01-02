import * as React from 'react';
import SelectedIcon from '../../static/img/ic_photo_gallery/ic_selected_gallery/ic_selected_gallery.svg';
import Frame from '../Frame/Frame';
import { convertProportionToPx } from '../../helpers/position.helper';
import ImageCorePreview from '../Images/ImageCorePreview';
import styled, { css } from 'styled-components';
import config from '../../config';
import DragItemTypes from '../../constants/dragItemTypes';
import { useDrag } from 'react-dnd';

const BorderPhoto = styled.div`
  display: flex;
  position: relative;
  align-items: center;
  justify-content: center;
  width: 94px;
  height: 94px;
  margin-bottom: 15px;
  border-radius: 4px;
  cursor: pointer;
  overflow: hidden;
  transition: all 300ms ease-in-out;
  padding: 3px;
  border: 2px solid #e0e0e0;
  .selectedIcon {
    ${props =>
      props.selected
        ? css`
            display: block;
          `
        : css`
            display: none;
          `}
  }
  ${props =>
    props.dragging && props.selected
      ? css`
          transform: scale(0.75);
          border: solid 2px #494b4d;
          & > div {
            opacity: 0.8;
          }
        `
      : ''};
  @media (max-width: 1024px) {
    overflow: initial;
    margin: 15px;
  }
`;

const SelectedGallery = styled.img`
  position: absolute;
  bottom: 0;
  right: 0;
  z-index: 9;
`;

const userID = 'u-q7gj6ScmFeiCH4sYGqEY4A/gallery/';

export function ImageGallery(props) {
  const {
    gallerySelected,
    onClick,
    idSrc,
    isInSpread,
    onDragStart,
    onDragEnd,
    dragging,
  } = props;
  const src = config.BASE_URL + userID + idSrc;
  const [, drag] = useDrag({
    item: { type: DragItemTypes.gallery, src: src, uniqueId: idSrc },
    begin() {
      onDragStart(idSrc);
      document.body.style.cursor = 'grabbing';
    },
    end() {
      onDragEnd();
      document.body.style.cursor = 'auto';
    },
  });
  return (
    <BorderPhoto
      ref={drag}
      data-src={src}
      selected={gallerySelected.find(i => i === idSrc)}
      onMouseUp={onClick}
      dragging={dragging}
      key={idSrc}>
      <SelectedGallery src={SelectedIcon} className={'selectedIcon'} />
      <Frame
        isInSpead={isInSpread}
        data={{ frameSize: { width: 94, height: 94 } }}>
        {({ width, height }) => {
          const targetrect = {
            x: 0,
            y: 0,
            width: 1,
            height: 1,
          };
          const rect = convertProportionToPx(targetrect, {
            frameWidth: width,
            frameHeight: height,
          });
          return (
            <ImageCorePreview
              {...props}
              editable={false}
              rect={rect}
              item={{
                src: src,
                idElement: 'gallery' + src,
              }}
            />
          );
        }}
      </Frame>
    </BorderPhoto>
  );
}
