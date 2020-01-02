import React, { useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';

import Switch from '../UI/Switch/Switch';
import ArrowBackIcon from '../../static/img/ic_menu_left/ic_arrow_back/ic_arrow_back.svg';
import PhotoIcon from '../../static/img/ic_photo_gallery/ic_photo/ic_photo.svg';
import ColorWandIcon from '../../static/img/ic_photo_gallery/ic_color_wand/ic_color_wand.svg';
import BackgroundIcon from '../../static/img/ic_photo_gallery/ic_background/ic_background.svg';
import Hide from '../../static/img/ic_core/hide.component.svg';
import AutoFill from '../../static/img/ic_core/autofill.component.svg';
import Plus from '../../static/img/ic_core/plus.component.svg';
import { connect } from 'react-redux';
import authorizedRequest from '../../helpers/request/authorizedRequest';
import axios from 'axios';
import LazyLoad from 'react-lazyload';
import { toast } from 'react-toastify';
import imageStoreAction from '../../store/imageStore/actions';
import { createSelector } from 'reselect';
import _ from 'lodash';
import { ImageGallery } from '../Layout/ImageGallery';

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
  @media (max-width: 1024px) {
    flex-wrap: initial;
    height: auto;
    background: #f4f4f4;
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
const WrapperTool = styled.div`
  width: 300px;
  display: flex;
  align-items: center;
  border-right: 1px solid #e0e0e0;
  margin: 20px 0px;
  svg {
    border-radius: 50%;
    background: #e0e0e0;
    padding: 10px;
    margin: 0px 10px;
    cursor: pointer;
  }
`;
const ButtonBackIcon = styled.img`
  height: 15px;
`;

function PhotoGallery({
  show,
  hidden,
  gallery,
  changeGallery,
  gallerySelected,
  selectedImageFromGallery,
  usedPhoto,
  isMobile,
}) {
  const [sort, setSort] = useState(true);
  const [dragging, setDragging] = useState(false);
  const [showUsed, setShowUsed] = useState(false);
  const handleDrapStart = uniqueId => {
    if (gallerySelected.indexOf(uniqueId) > -1) {
      // drag all
    } else {
      selectedImageFromGallery([uniqueId]);
    }
    setDragging(true);
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
    if (!showUsed) {
      return gallery;
    } else {
      return gallery.filter(i => usedPhoto.indexOf(i) > -1);
    }
  }, [showUsed, gallery, usedPhoto]);

  function renderGalleryList(isInSpread) {
    return (
      show &&
      filteredGallery.map((idSrc, key) => {
        return (
          <LazyLoad key={idSrc} scrollContainer={'#photo-wrapper'} height={61}>
            {/*<Draggable*/}
            {/*  onDragStart={({ e, item }) => handleDrapStart(e, item.uniqueId)}*/}
            {/*  onDragEnd={() => setDragging(false)}*/}
            {/*  type={'image-gallery'}*/}
            {/*  item={{*/}
            {/*    src: src,*/}
            {/*    uniqueId: idSrc,*/}
            {/*  }}>*/}
            {/*  {props => (*/}
            {/*    */}
            {/*  )}*/}
            {/*</Draggable>*/}
            <ImageGallery
              idSrc={idSrc}
              onDragStart={uniqueId => handleDrapStart(uniqueId)}
              onDragEnd={() => setDragging(false)}
              gallerySelected={gallerySelected}
              isInSpread={true}
              dragging={dragging}
              onClick={e => setSelected(e, idSrc)}
            />
          </LazyLoad>
        );
      })
    );
  }

  if (isMobile) {
    return (
      <PhotosWrapper id={'photo-wrapper'}>
        {show && (
          <>
            <WrapperTool>
              <Plus />
              <AutoFill />
              <Hide />
            </WrapperTool>
            {renderGalleryList(true)}
          </>
        )}
      </PhotosWrapper>
    );
  }
  return (
    <Container show={show} onContextMenu={e => e.preventDefault()}>
      <ButtonBack show={show} onClick={hidden}>
        <ButtonBackIcon src={ArrowBackIcon} alt={''} />
      </ButtonBack>
      <ElementGroup show={show}>
        <ButtonGroup>
          <Button>
            <ButtonIcon src={PhotoIcon} alt={''} />
            <label for="file-upload">
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
              value={showUsed}
              onChange={() => setShowUsed(prev => !prev)}
            />
          </SwitchGroup>
        </ButtonGroup>
        <PhotoGroup>
          <Sort onClick={() => setSort(!sort)} sort={sort}>
            Sort by
            <p>▲</p>
          </Sort>
          <PhotosWrapper id={'photo-wrapper'}>
            {renderGalleryList()}
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
