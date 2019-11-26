import * as React from 'react';
import { connect } from 'react-redux';

import { createAction } from 'redux-actions';
import Toolbar from '../Toolbar';
import styled from 'styled-components';
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
  componentDidMount = () => {
    if (this.refFrame) {
      window.addEventListener('resize', () => {});
    }
  };

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
          }}>
          {this.props.children({ ...frameSize })}
          {this.props.selected && this.props.selected.length > 0 && (
            <Toolbar
              selected={this.props.selected}
              changeImageData={this.props.changeImageData}
              deleteImg={this.props.deleteImg}
            />
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
});
const mapDispatchToProps = dispatch => ({
  changeImageData: obj => dispatch(createAction('CHANGE_IMG_DATA')(obj)),
  deleteImg: () => {
    dispatch(createAction('DELETE_IMG')());
  },
});
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Frame);
