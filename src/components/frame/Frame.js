import * as React from 'react';
import { connect } from 'react-redux';
import Toolbar from '../Toolbar';
import styled from 'styled-components';
import imageStoreAction from '../../store/imageStore/actions';
class Frame extends React.PureComponent {
  static defaultProps = {
    data: {
      frameSize: {
        height: 0,
        width: 0,
      },
    },
  };
  state = {};
  refFrame = null;
  componentDidMount = () => {};

  render() {
    const { frameSize } = this.props.data;

    return (
      <WrapperFrame ref={e => (this.refFrame = e)}>
        <div
          data-outside="frame"
          data-element="frame"
          ref={e => (this.refFrame = e)}
          style={{
            height: frameSize.height,
            width: frameSize.width,
            position: 'relative',
            background: '#fff',
            overflow: 'hidden',
          }}>
          {this.props.children({ ...frameSize })}
          {this.props.selected && this.props.selected.length > 0 && (
            <Toolbar {...this.props} />
          )}
        </div>
      </WrapperFrame>
    );
  }
}
const WrapperFrame = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
`;
const mapStateToProps = state => ({
  selected: state.imageStore.present.selected,
  dataInit: state.imageStore.present.initImageState,
  spread: state.imageStore.present.spread,

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
  changeImageData: obj => dispatch(imageStoreAction.image.changeImgData(obj)),
  deleteImg: () => {
    dispatch(imageStoreAction.image.deleteImg());
  },
  relayout: data => dispatch(imageStoreAction.image.reLayout(data)),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Frame);
