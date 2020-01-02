import * as React from 'react';
// import { findDOMNode } from 'react-dom';
import styled from 'styled-components';
import { mapStore } from '../Images/ImageView';
// import { fabric } from 'fabric';
import Delete from '../../static/img/ic_core/delete.component.svg';
import Rotate from '../../static/img/ic_core/rotate.component.svg';
import Filter from '../../static/img/ic_core/filter.component.svg';
import Flip from '../../static/img/ic_core/flip.component.svg';
import ReplaceImage from '../../static/img/ic_core/replaceImage.component.svg';
import {
  convertPxToProportion,
  translateOnFlip,
  translateOnRotate,
} from '../../helpers/position.helper';
import { STATE_DRAGGING } from '../../helpers/utils';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import _ from 'lodash';
import imageStoreAction from '../../store/imageStore/actions';
import PhotoGallery from '../MenuLeft/PhotoGallery';

// fabric.filterBackend = webglBackend;

// new f.Brownie()
class Toolbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openFilter: false,
      selectedColor: '',
    };
  }

  componentDidMount() {}

  // componentDidUpdate(prevProps, prevState, snapshot) {
  //   if (prevProps.selected !== this.props.selected) {
  //     if (this.props.selected && this.props.selected.length > 0) {
  //       this.addBackDrop();
  //     } else {
  //       this.removeBackDrop();
  //     }
  //   }
  // }
  //
  // onClickBackDrop = (e) => {
  //   const dom = findDOMNode(this);
  //   console.log(dom);
  //   if (dom === e.target ? false : dom.contains(e.target)) {
  //     e.preventDefault();
  //     e.stopPropagation();
  //     this.props.setSelect([]);
  //   }
  // };
  //
  // addBackDrop() {
  //   document.addEventListener('click', this.onClickBackDrop);
  // }
  //
  // removeBackDrop() {
  //   document.removeEventListener('click', this.onClickBackDrop);
  // }

  getKclass = () => {
    const { selected } = this.props;
    if (!selected.length) return {};
    return selected.map(select => {
      const kclassCanvas = mapStore.get(select.idElement);
      const kclassImage = kclassCanvas.item(0);
      return { kclassCanvas, kclassImage };
    });
  };

  flipImage = () => {
    if (Array.isArray(this.props.selectedAssets)) {
      const changeData = this.props.selectedAssets.map(selectedItem => {
        const canvasItem = mapStore.get(selectedItem.idElement);
        const kclassImage = canvasItem.item(0);
        const options = translateOnFlip(selectedItem, kclassImage, canvasItem);
        const objectClass = {
          ..._.pick(kclassImage, [
            'top',
            'left',
            'orientation',
            'scaleX',
            'scaleY',
            'width',
            'height',
          ]),
          ...options,
        };
        const croprect = convertPxToProportion(objectClass, canvasItem);

        if (kclassImage.angle === 90 || kclassImage.angle === 270) {
          return {
            flipVertical: selectedItem.flipVertical
              ? !selectedItem.flipVertical
              : true,
            idElement: selectedItem.idElement,
            croprect,
          };
        } else {
          return {
            flipHorizontal: selectedItem.flipHorizontal
              ? !selectedItem.flipHorizontal
              : true,
            idElement: selectedItem.idElement,
            croprect,
          };
        }
      });
      this.props.changeListImageData(changeData);
    }
  };
  rotateImage = () => {
    if (Array.isArray(this.props.selectedAssets)) {
      const changeData = this.props.selectedAssets.map(selectedItem => {
        const canvasItem = mapStore.get(selectedItem.idElement);
        const kclassImage = canvasItem.item(0);
        let rotate = selectedItem.rotate || 0;
        rotate = rotate - 90;
        if (rotate < 0) {
          rotate = 270;
        }
        const options = translateOnRotate(
          selectedItem,
          kclassImage,
          canvasItem,
          rotate,
        );
        const objectClass = {
          ..._.pick(kclassImage, [
            'top',
            'left',
            'orientation',
            'scaleX',
            'scaleY',
            'width',
            'height',
          ]),
          ...options,
        };
        const croprect = convertPxToProportion(objectClass, canvasItem);
        return {
          idElement: selectedItem.idElement,
          rotate,
          croprect,
        };
      });
      this.props.changeListImageData(changeData);
    }
  };
  handleFilterColor = filterColor => {
    this.props.changeImageData({ data: { filterColor } });
  };
  deleteImage = async () => {
    await this.props.deleteImageAsync();
    STATE_DRAGGING.clear();
  };

  render() {
    const { openFilter } = this.state;
    if (!this.props.selected && !this.props.selected.length) {
      return null;
    }
    const {
      selected,
      selectedAssets,
      isMobile,
      activeGalleryOnMobile,
    } = this.props;
    if (selected && !selected.length) return;
    const rect = selected.reduce(
      (init, next, currentIndex, intArr) => {
        const domTarget = document.getElementById(next.idElement);
        if (!domTarget) return init;
        const { top, left, height, width } = domTarget.getBoundingClientRect();
        const count = selected.length;
        init.left += left / count;
        init.widthWraper += width / count;
        if (init.top + init.heightWraper < top + height) {
          init.top = top;
          init.heightWraper = height;
        }
        return init;
      },
      { top: 0, left: 0, widthWraper: 0, heightWraper: 0 },
    );
    if (!rect.top || this.props.isInSpead) return null;
    const activeFilterColor =
      selectedAssets.length && selectedAssets[0].filterColor
        ? selectedAssets[0].filterColor
        : '';
    return (
      <Wrapper {...rect} data-outside="toolbar">
        {isMobile && (
          <TooggleButton
            active={activeGalleryOnMobile}
            stroke={'true'}
            onClick={() => {
              this.props.toggleActiveGalleryOnMobile(!activeGalleryOnMobile);
            }}>
            <ReplaceImage />
          </TooggleButton>
        )}
        <TooggleButton stroke={'true'} onClick={this.flipImage}>
          Flip <Flip />{' '}
        </TooggleButton>
        <TooggleButton invert stroke={'true'} onClick={this.rotateImage}>
          Rotate <Rotate />
        </TooggleButton>
        <TooggleButton
          active={this.state.openFilter}
          onClick={() =>
            this.setState(preState => ({ openFilter: !preState.openFilter }))
          }>
          Color Filter
          <Filter />
        </TooggleButton>
        <TooggleButton stroke={'true'} onClick={this.deleteImage}>
          Delete <Delete />
        </TooggleButton>
        {openFilter && (
          <WrapperColorFilter
            data-test={rect.top + 90 + 65 + rect.heightWraper}
            isTop={rect.top + 90 + 65 + rect.heightWraper < window.innerHeight}>
            {[
              { name: 'Normal', value: '' },
              { name: 'Sepia', value: 'Sepia' },
              { name: 'BlackWhite', value: 'BlackWhite' },
              { name: 'Brownie', value: 'Brownie' },
              { name: 'Vintage', value: 'Vintage' },
              { name: 'Kodachrome', value: 'Kodachrome' },
              { name: 'Technicolor', value: 'Technicolor' },
            ].map((itemFilter, key) => {
              return (
                <ToggleFilter
                  active={activeFilterColor === itemFilter.value}
                  key={key}
                  onClick={() => this.handleFilterColor(itemFilter.value)}>
                  {itemFilter.name}
                </ToggleFilter>
              );
            })}
          </WrapperColorFilter>
        )}

        {isMobile && activeGalleryOnMobile && (
          <WrapperGallery>
            <div></div>
            <PhotoGallery show isMobile={isMobile} hidden={() => {}} />
          </WrapperGallery>
        )}
      </Wrapper>
    );
  }
}

const getSelectedSpread = state => state.imageStore.present.spread;

const getSelectedAssets = state => state.imageStore.present.selected;

const getImageState = state => state.imageStore.present.initImageState;

const getCurrentSelected = createSelector(
  [getSelectedSpread, getSelectedAssets, getImageState],
  (selectedSpread, selectedAssets, imageState) => {
    const currentSpread =
      imageState &&
      (imageState.find(item => item.idPage === selectedSpread) ||
        imageState[0]);
    const currentAssets = selectedAssets
      .map(i => {
        return currentSpread.assets.find(
          item => item.idElement === i.idElement,
        );
      })
      .filter(i => i);
    return currentAssets;
  },
);

const mapStateToProps = state => {
  return {
    selectedAssets: getCurrentSelected(state),
    activeGalleryOnMobile: state.imageStore.present.stateMobile.activeGallery,
  };
};

export default connect(
  mapStateToProps,
  dispatch => {
    return {
      changeListImageData: arr =>
        dispatch(imageStoreAction.image.changeListImgData(arr)),
      setSelect: id => dispatch(imageStoreAction.image.setSelected(id)),
      toggleActiveGalleryOnMobile: toggle =>
        dispatch(imageStoreAction.image.toggleActiveSpread(toggle)),
      deleteImageAsync: id => dispatch({ type: 'DELETE_IMG_ASYNC', id }),
    };
  },
)(Toolbar);
const ToggleFilter = styled.div`
  padding: 10px;
  cursor: pointer;
  background: #e0e0e0;
  margin: 9px;
  font-size: 8px;
  text-align: center;
  color: ${props => (props.active ? 'white' : '#828282')};
  background: ${props => (props.active ? '#b06ab3' : '')};
`;
const WrapperColorFilter = styled.div`
  width: 450px;
  background: #828282;
  overflow-x: scroll;
  border-radius: 6px;
  position: absolute;
  display: flex;
  z-index: 1;
  top: ${props => (props.isTop ? '90px' : '-90px')};
  transform: translateX(-10%);
  @media (max-width: 1024px) {
    top: 0px;
    transform: translateY(-100%);
    border-radius: 0px;
    width: 100%;
    ${ToggleFilter} {
      flex: 1;
      padding: 20px;
      width: 60px;
    }
  }
`;
const WrapperGallery = styled.div`
  display: none;
  overflow-x: scroll;
  position: absolute;
  @media (max-width: 1024px) {
    display: flex;
    top: 0px;
    transform: translateY(-100%);
    border-radius: 0px;
    width: 1000px;
  }
  @media (max-width: 480px) {
    width: 500px;
  }
`;

const Wrapper = styled.div`
  position: fixed;
  background: #494b4d;
  display: flex;
  z-index: 6;
  border-radius: 6px;
  top: ${props => (props.top ? props.top + props.heightWraper + 'px' : '0px')};
  left: ${props =>
    props.left ? props.left + props.widthWraper / 2 + 'px' : '0px'};
  transform: translate(-50%, 20%);
  @media (max-width: 1024px) {
    top: initial;
    bottom: 0px;
    width: 100%;
    left: 0px;
    border-radius: 0px;
    transform: none;
  }
`;
const TooggleButton = styled.div`

  display: flex;
  align-content: center;
  justify-content: left;
  padding: 10px;
  //background  : black;
  color: ${props => (props.active ? '#b06ab3' : 'white')};
  path {
      fill: ${props => (props.active ? '#b06ab3' : '')};
    }
  margin: auto;
  cursor: pointer;
  &:hover {
    color: #b06ab3;
    path {
      fill: ${props => (props.stroke ? '' : '#b06ab3')};
    }
    [stroke='#fff'] {
      stroke: #b06ab3;
    }
  }
  
  svg {
    height: 40px;
    margin: auto;
    // transform: ${props => (props.invert ? 'scaleX(-1)' : '')};
  }
  flex-direction: column-reverse;
  text-align: center;
  @media (max-width: 1024px) {
    font-size: 0px;
    height: auto;
  }
`;
