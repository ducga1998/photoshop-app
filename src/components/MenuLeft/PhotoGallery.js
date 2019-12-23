import React, { useState, useCallback, useMemo } from 'react';
import styled, { css } from 'styled-components';

import Switch from '../UI/Switch/Switch';
import ArrowBackIcon from '../../static/img/ic_menu_left/ic_arrow_back/ic_arrow_back.svg';
import PhotoIcon from '../../static/img/ic_photo_gallery/ic_photo/ic_photo.svg';
// import BigPhotoIcon from '../../static/img/ic_menu_left/ic_photo/ic_photo_inactive.svg';
import ColorWandIcon from '../../static/img/ic_photo_gallery/ic_color_wand/ic_color_wand.svg';
import BackgroundIcon from '../../static/img/ic_photo_gallery/ic_background/ic_background.svg';
import SelectedIcon from '../../static/img/ic_photo_gallery/ic_selected_gallery/ic_selected_gallery.svg';
import { convertProportionToPx, STATE_DRAGGING } from '../../helpers/utils';
import config from '../../config';
import { connect } from 'react-redux';
import authorizedRequest from '../../helpers/request/authorizedRequest';
import axios from 'axios';
import LazyLoad from 'react-lazyload';
import { toast } from 'react-toastify';
import imageStoreAction from '../../store/imageStore/actions';
import ImageCorePreview from '../Images/ImageCorePreview';
import Frame from '../frame/Frame';
import { createSelector } from 'reselect';
import _ from 'lodash';

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
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  padding: 0 20px;
`;

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
      : ''}
`;

const SelectedGallery = styled.img`
  position: absolute;
  bottom: 0;
  right: 0;
  z-index: 9;
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
const userID = 'u-q7gj6ScmFeiCH4sYGqEY4A/gallery/';

function PhotoGallery({
  show,
  hidden,
  gallery,
  changeGallery,
  gallerySelected,
  selectedImageFromGallery,
  usedPhoto,
}) {
  const [sort, setSort] = useState(true);
  const [dragging, setDragging] = useState(false);
  const [hideUsed, setHideUsed] = useState(false);
  const handleDrapStart = (event, idSrc) => {
    setDragging(true);
    if (gallerySelected.indexOf(idSrc) > -1) {
      // drag all
    } else {
      selectedImageFromGallery([idSrc]);
    }
    const target = event.target;
    if (!target) return;
    const src = target.getAttribute('data-src');
    STATE_DRAGGING.src = src;
  };

  async function onChangeHandler(e) {
    const file = e.target.files[0];
    const { name: nameFile } = e.target.files[0];
    const objectUpload = await authorizedRequest.put(
      'https://t69kla0zpk.execute-api.ap-southeast-1.amazonaws.com/dev/upload/project/p-7ubVMK7eak6da3MwH7vz5X/sign',
      {
        files: [nameFile],
      },
    );
    const linkUpLoad = Object.values(objectUpload)[0].signedUrl;
    await axios.put(linkUpLoad, file, {
      headers: {
        'Content-Type': 'image/png',
      },
    });
    const { files } = await authorizedRequest.put(
      'https://t69kla0zpk.execute-api.ap-southeast-1.amazonaws.com/dev/upload/project/p-7ubVMK7eak6da3MwH7vz5X/mark',
    );
    if (files && files.length) {
      toast.success('Import success');
    }
    changeGallery(files);
    // console.log("files",files)
  }

  const setSelected = useCallback(
    (e, item) => {
      if (e.metaKey) {
        if (gallerySelected.find(i => i === item)) {
          selectedImageFromGallery(gallerySelected.filter(i => i !== item));
        } else {
          selectedImageFromGallery([...gallerySelected, item]);
        }
      } else {
        if (gallerySelected.length === 1 && gallerySelected[0] === item) {
          selectedImageFromGallery([]);
        } else {
          selectedImageFromGallery([item]);
        }
      }
    },
    [gallerySelected, selectedImageFromGallery],
  );

  const filteredGallery = useMemo(() => {
    if (!hideUsed) {
      return gallery;
    } else {
      return gallery.filter(i => usedPhoto.indexOf(i) === -1);
    }
  }, [hideUsed, gallery, usedPhoto]);

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
            <Switch
              value={hideUsed}
              onChange={() => setHideUsed(prev => !prev)}
            />
          </SwitchGroup>
        </ButtonGroup>
        <PhotoGroup>
          <Sort onClick={() => setSort(!sort)} sort={sort}>
            Sort by
            <p>▲</p>
          </Sort>
          <PhotosWrapper id={'photo-wrapper'}>
            {show &&
              filteredGallery.map((idSrc, key) => {
                const src = config.BASE_URL + userID + idSrc;
                return (
                  <LazyLoad
                    key={idSrc}
                    scrollContainer={'#photo-wrapper'}
                    height={61}>
                    <BorderPhoto
                      data-src={src}
                      selected={gallerySelected.find(i => i === idSrc)}
                      dragging={dragging}
                      onDragStart={e => handleDrapStart(e, idSrc)}
                      onDragEnd={() => setDragging(false)}
                      onClick={e => setSelected(e, idSrc)}
                      draggable
                      key={idSrc}>
                      <SelectedGallery
                        src={SelectedIcon}
                        className={'selectedIcon'}
                      />
                      <Frame data={{ frameSize: { width: 94, height: 94 } }}>
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
                      {/*<Photo src={src} crossOrigin={'anonymous'} />*/}
                    </BorderPhoto>
                  </LazyLoad>
                );
              })}
          </PhotosWrapper>
        </PhotoGroup>
      </ElementGroup>
    </Container>
  );
}

const usedPhotoSelector = createSelector(
  [state => state.imageStore.present.initImageState],
  item =>
    item.reduce((acc, item) => {
      return _.uniq([...acc, ...item.assets.map(i => i.uniqueId)]);
    }, []),
);
const mapStateToProps = state => ({
  gallery: state.imageStore.present.gallery,
  gallerySelected: state.imageStore.present.gallerySelected,
  usedPhoto: usedPhotoSelector(state),
});

const mapDispatchToProps = dispatch => ({
  changeGallery: gallery => {
    return dispatch(imageStoreAction.image.changeGallery(gallery));
  },
  selectedImageFromGallery: images => {
    return dispatch(imageStoreAction.image.selectImageFromGallery(images));
  },
});
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PhotoGallery);
