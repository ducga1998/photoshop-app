import * as React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { createAction } from 'redux-actions';
import ImageCore from './ImageCore';
import { STATE_DRAGGING } from '../../helpers/utils';
import authorizedRequest from '../../helpers/request/authorizedRequest';

export const mapStore = new Map();
if (process.browser) {
  window['mapStore'] = mapStore;
}
class ImageView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      width: 900,
      height: 600,
    };
  }

  handleDragOver = e => {
    e.preventDefault();
    const target = e.target.closest('[data-element]');
    if (!target) {
      return;
    }
    console.log('state', STATE_DRAGGING.src);
    const typeElement = target.getAttribute('data-element');
    if (typeElement.includes('-overlay') && STATE_DRAGGING.src.length === 0)
      return;
    const targetRect = target.getBoundingClientRect();
    Object.assign(this.refOverlay.style, {
      top: targetRect.top - window.scrollX + 'px',
      left: targetRect.left + 'px',
      width: targetRect.width + 'px',
      height: targetRect.height + 'px',
      display: 'block',
    });
  };
  relayout = async positionDrop => {
    console.log('STATE_DRAGGING.src', STATE_DRAGGING.src);
    const data = {
      assets: [
        ...this.props.spreadDataSelected.assets,
        ...[
          {
            new: true,
            uniqueId: STATE_DRAGGING.src.split('/').pop(),
          },
        ],
      ],
      leftLayoutIndex: 0,
      pagespreadIndex: 1,
      rightLayoutIndex: 0,
    };
    const result = await authorizedRequest.put(
      'https://t69kla0zpk.execute-api.ap-southeast-1.amazonaws.com/dev/relayout/p-pFWrCqq5jmARDeuSLxaP8s/spread/' +
        positionDrop,
      data,
    );

    await this.props.relayout({ ...result, ...{ positionDrop } });
    // console.log('csancjknasc', result);
    STATE_DRAGGING.clear();
  };
  // handleDrapEnd
  handleDrop = e => {
    e.preventDefault();
    e.stopPropagation();
    const idDrapStart = e.dataTransfer.getData('text');

    const target = e.target.closest('[data-element]');
    const idDrop = target.getAttribute('data-element');
    this.refOverlay.style.display = 'none';
    const { selected } = this.props;
    // case drog from  outside
    if (idDrop.length > 0 && STATE_DRAGGING.src.length > 0) {
      if (idDrop === 'left-overlay') {
        console.log('drop to left overlay ');
        this.relayout('left');

        return;
      }
      if (idDrop === 'right-overlay') {
        console.log('drop t right overlay');
        this.relayout('right');

        return;
      }

      this.props.changeImageData({ data: { src: STATE_DRAGGING.src }, idDrop });
      STATE_DRAGGING.clear();
      return;
    }
    if (
      (!selected && !selected.length) ||
      !idDrop.length ||
      !idDrapStart.length
    )
      return;

    this.props.swapImageData({ idDrapStart, idDrop });
  };
  handleOnMouseDown = e => {
    const target = e.target.closest('[data-element]');
    if (!target) {
      return;
    }
    const idElement = target.getAttribute('data-element');
    const { selected } = this.props;
    const kcanvas = mapStore.get(idElement);
    if ((kcanvas && !kcanvas._objects.length) || !kcanvas) {
      console.log('no have item object in kclass');
      return;
    }
    const kImage = kcanvas.item(0);

    this.props.setSelect([{ idElement }]);
    window.selected = kcanvas;
    if (!kImage) return;
    // const src = kImage.getSrc();
    // const angle = kImage.angle;

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

  handleDragStart = e => {
    const id = e.target.getAttribute('data-element');
    e.dataTransfer.setData('text/plain', id);
    STATE_DRAGGING.idDragging = id;
  };
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
        draggable
        onDragOverCapture={this.handleDragOver}
        onMouseUpCapture={this.handleOnMouseDown}
        onDragEndCapture={this.handleDrop}
        onDragStartCapture={this.handleDragStart}
        onDropCapture={this.handleDrop}>
        <WrapperCanvas {...this.props}>
          {spreadDataSelected.assets.map((item, key) => {
            if (!item || !item.targetrect) return null;
            return (
              <ImageCore
                key={item.idElement}
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

          <Overlay ref={e => (this.refOverlay = e)} />
        </WrapperCanvas>
        <OverlayLayout data-element="left-overlay" />
        <OverlayLayout data-element="right-overlay" />
      </Wrapper>
    );
  }
}

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`;
const OverlayLayout = styled.div`
  display: block;
  width: 50%;
  flex: 1;
`;
const WrapperCanvas = styled.div`
  position: relative;
  width: ${props => (props.width ? props.width + 'px' : '')};
  height: ${props => (props.height ? props.height + 'px' : '')};
`;

const mapStateToProps = state => ({
  initImageState: state.imageStore.present.initImageState,
  selected: state.imageStore.present.selected,
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
  relayout: data => dispatch(createAction('RE_LAYOUT')(data)),
  setSelect: id => dispatch(createAction('SET_SELECTED')(id)),
  changeImageData: obj => dispatch(createAction('CHANGE_IMG_DATA')(obj)),
  swapImageData: id => dispatch(createAction('SWAP_IMG')(id)),
  deleteImage: id => {
    return dispatch(createAction('DELETE_IMG')(id));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ImageView);
const Overlay = styled.div`
  position: fixed;
  box-sizing: border-box;
  background: rgba(86, 204, 242, 0.5);
  opacity: 0.5;
  display: none;
  pointer-events: none;
`;
