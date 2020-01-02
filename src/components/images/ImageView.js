import * as React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { createAction } from 'redux-actions';
import ImageCore from './ImageCore';
import { STATE_DRAGGING } from '../../helpers/utils';
import { fabric } from 'fabric';
import imageStoreAction from '../../store/imageStore/actions';
import { isClientSide } from '../../helpers/render.helper';
import DragItemTypes from '../../constants/dragItemTypes';
import OverlayLayout from '../Layout/OverlayLayout';

export const mapStore = new Map();
if (isClientSide()) {
  window['mapStore'] = mapStore;
}
fabric.textureSize = 4096;
fabric.filterBackend = fabric.initFilterBackend();

class ImageView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      width: 900,
      height: 600,
    };
  }

  relayout = async positionDrop => {
    const data = {
      assets: [
        ...this.props.spreadDataSelected.assets,
        ...this.props.gallerySelected.map(i => ({
          new: true,
          uniqueId: i,
        })),
      ],
      leftLayoutIndex: 0,
      pagespreadIndex: 1,
      rightLayoutIndex: 0,
    };
    this.props.fetchDataRelayout(data, positionDrop);
    STATE_DRAGGING.clear();
  };

  handleOnMouseDown = e => {
    const target = e.target.closest('[data-element]');
    if (!target) {
      return;
    }
    const idElement = target.getAttribute('data-element');
    const { selected } = this.props;
    const kcanvas = mapStore.get(idElement);
    window.selected = kcanvas;

    this.props.setSelect([{ idElement }]);

    // muti select
    if (e.metaKey || e.ctrlKey) {
      if (selected && selected.some(select => select.idElement === idElement)) {
        this.props.setSelect(
          selected.filter(select => select.idElement !== idElement),
        );
      } else {
        this.props.setSelect([...selected, ...[{ idElement }]]);
      }
      return;
    }
  };

  handleDropReplace({ type, ...item }, target) {
    if (type === DragItemTypes.gallery) {
      if (item.uniqueId !== target.uniqueId) {
        this.props.changeImageData({
          data: { src: item.src, uniqueId: item.uniqueId },
          idDrop: target.idElement,
        });
      }
    } else {
      if (item.idElement !== target.idElement) {
        this.props.swapImageData({
          idDrapStart: item.idElement,
          idDrop: target.idElement,
        });
      }
    }
  }

  handleDropRelayout(item, position) {
    this.relayout(position);
  }

  componentDidMount() {}

  render() {
    const {
      frameWidth,
      frameHeight,
      selected,
      changeImageData,
      spreadDataSelected,
    } = this.props;
    if (!spreadDataSelected) return null;
    return (
      <Wrapper
        onClick={this.handleOnMouseDown}
        onContextMenu={e => e.preventDefault()}>
        <WrapperCanvas {...this.props}>
          {spreadDataSelected.assets.map((item, key) => {
            if (!item || !item.targetrect) return null;
            return (
              <ImageCore
                onDrop={itemDrop => this.handleDropReplace(itemDrop, item)}
                item={item}
                frameWidth={frameWidth}
                frameHeight={frameHeight}
                changeImageData={changeImageData}
                editable={
                  selected &&
                  selected.some(select => select.idElement === item.idElement)
                }
              />
            );
          })}
        </WrapperCanvas>
        <OverlayLayout onDrop={item => this.handleDropRelayout(item, 'left')} />
        <OverlayLayout
          onDrop={item => this.handleDropRelayout(item, 'right')}
        />
      </Wrapper>
    );
  }
}

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`;
const WrapperCanvas = styled.div`
  position: relative;
  width: ${props => (props.width ? props.width + 'px' : '')};
  height: ${props => (props.height ? props.height + 'px' : '')};
`;

const mapStateToProps = state => ({
  initImageState: state.imageStore.present.initImageState,
  selected: state.imageStore.present.selected,
  gallerySelected: state.imageStore.present.gallerySelected,
  spreadDataSelected: (() => {
    const { initImageState } = state.imageStore.present;
    return (
      initImageState.find(
        spreadItem => spreadItem.idPage === state.imageStore.present.spread,
      ) || initImageState[0]
    );
  })(),
});
const mapDispatchToProps = dispatch => ({
  relayout: data => dispatch(imageStoreAction.image.reLayout(data)),
  setSelect: id => dispatch(imageStoreAction.image.setSelected(id)),
  changeImageData: obj => dispatch(imageStoreAction.image.changeImgData(obj)),
  swapImageData: id => dispatch(imageStoreAction.image.swapImg(id)),
  fetchDataRelayout: (assets, positionDrop) =>
    dispatch({ type: 'FETCH_DATA_RELAYOUT', assets, positionDrop }),
  deleteImage: id => {
    return dispatch(createAction('DELETE_IMG')(id));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ImageView);
