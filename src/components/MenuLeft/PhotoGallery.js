import React, { useState } from 'react';
import styled from 'styled-components';

import Switch from '../UI/Switch/Switch';
import ArrowBackIcon from '../../static/img/ic_menu_left/ic_arrow_back/ic_arrow_back.svg';
import PhotoIcon from '../../static/img/ic_photo_gallery/ic_photo/ic_photo.svg';
// import BigPhotoIcon from '../../static/img/ic_menu_left/ic_photo/ic_photo_inactive.svg';
import ColorWandIcon from '../../static/img/ic_photo_gallery/ic_color_wand/ic_color_wand.svg';
import BackgroundIcon from '../../static/img/ic_photo_gallery/ic_background/ic_background.svg';
import { STATE_DRAGGING } from '../../helpers/utils';
import config from '../../config';
import { connect } from 'react-redux';
const Container = styled.div`
  position: relative;
  width: ${props => (props.show ? 300 : 0)}px;
  height: calc(100vh - 70px);
  background-color: #f4f4f4;
  transition: ${props => (props.show ? '0.3s ease-in-out 0.3s' : '0.3s')};
`;

const ElementGroup = styled.div`
  width: ${props => (props.show ? 300 : 0)}px;
  overflow: hidden;
  opacity: ${props => (props.show ? 1 : 0)};
  transition: ${props =>
    props.show ? 'opacity 0.3s ease-in-out 0.6s' : 'none'};
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 35px 30px 0px;
`;

const Button = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  background-color: #494b4d;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  width: 100%;
  height: 35px;
  cursor: pointer;
  margin-bottom: 15px;
  label {
    cursor: pointer;
  }
  &:hover {
    background: linear-gradient(90deg, #4568dc 0%, #b06ab3 100%);
  }
`;

const ButtonIcon = styled.img`
  width: 20px;
  height: 20px;
  margin-right: 10px;
`;

const SwitchGroup = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 15px;
  color: #494b4d;
  padding-bottom: 20px;
  border-bottom: solid 1px #e0e0e0;
`;

const PhotoGroup = styled.div`
  padding: 20px 20px 0px;
`;

const Sort = styled.div`
  display: flex;
  align-items: center;
  width: 70px;
  font-size: 15px;
  color: #494b4d;
  cursor: pointer;
  margin: 0px 10px 15px;

  p {
    font-size: 13px;
    margin: 3px 0px 0px 5px;
    transform: ${props => (props.sort ? 'rotate(180deg)' : 'rotate(0deg)')};
    transition: 0.3s;
  }
`;

const PhotosWrapper = styled.div`
  position: relative;
  overflow: auto;
  height: calc(100vh - 360px);

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: #bdbdbd;
    border-radius: 8px;
  }
`;

const Photos = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  padding: 0 20px;
`;

const BorderPhoto = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 100px;
  margin-bottom: 15px;
  border-radius: 4px;
  border: solid 3px transparent;
  cursor: pointer;
  overflow: hidden;
  &:hover {
    border: solid 3px #494b4d;
  }
`;

const Photo = styled.img`
  pointer-events: none;
  width: 100px;
  height: 100px;
  border: solid 1px #e0e0e0;
  cursor: pointer;
  ${BorderPhoto}:hover & {
    border: solid 1px transparent;
  }
`;

const ButtonBack = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 25px;
  height: 25px;
  background-color: #494b4d;
  border-radius: 6px;
  cursor: pointer;
  position: absolute;
  top: 120px;
  left: 288px;
  z-index: ${props => (props.show ? 2 : -1)};
  opacity: ${props => (props.show ? 1 : 0)};
  transition: ${props =>
    props.show ? 'opacity 0.3s ease-in-out 0.3s' : 'opacity 0.3s'};

  &:hover {
    background-color: #b06ab3;
  }
`;

const ButtonBackIcon = styled.img`
  height: 15px;
`;
const projectID = 'u-ojiNLBbWbrP1dkzg2gVXYD/gallery/';
function PhotoGallery({ show, hidden, gallery }) {
  const [sort, setSort] = useState(true);
  const handleDrapStart = event => {
    const target = event.target;
    if (!target) return;
    const src = target.getAttribute('data-src');
    STATE_DRAGGING.src = src;
  };
  function onChangeHandler(e) {
    console.log('e.target', e.target.files[0]);
  }

  return (
    <Container show={show}>
      <ButtonBack show={show} onClick={hidden}>
        <ButtonBackIcon src={ArrowBackIcon} alt={''} />
      </ButtonBack>
      <ElementGroup show={show}>
        <ButtonGroup>
          <Button>
            <ButtonIcon src={PhotoIcon} alt={''} />
            <label or="file-upload">
              Add photos
              <input
                id="file-upload"
                type="file"
                name="Add photos"
                onChange={onChangeHandler}
                style={{ display: 'none' }}
              />
            </label>
          </Button>
          <Button>
            <ButtonIcon src={ColorWandIcon} alt={''} />
            <span>Auto layout</span>
          </Button>
          <Button>
            <ButtonIcon src={BackgroundIcon} alt={''} />
            <span>Add background image</span>
          </Button>
          <SwitchGroup>
            <span>Show my used photos</span>
            <Switch />
          </SwitchGroup>
        </ButtonGroup>
        <PhotoGroup>
          <Sort onClick={() => setSort(!sort)} sort={sort}>
            Sort by
            <p>▲</p>
          </Sort>
          <PhotosWrapper>
            <Photos>
              {gallery.map(idSrc => {
                const src = config.BASE_URL + projectID + idSrc;
                return (
                  <BorderPhoto
                    data-src={src}
                    onDragStart={handleDrapStart}
                    draggable
                    key={idSrc}>
                    <Photo src={src} alt={''} />
                  </BorderPhoto>
                );
              })}
            </Photos>
          </PhotosWrapper>
        </PhotoGroup>
      </ElementGroup>
    </Container>
  );
}

export default connect(state => ({
  gallery: state.imageStore.present.gallery,
}))(PhotoGallery);
