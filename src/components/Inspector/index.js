import * as React from 'react';
import { LINK_IMG } from '../images/ImageView';
import { STATE_DRAGGING } from '../../helpers/utils';
import { connect } from 'react-redux';
import { mapStore } from '../images/ImageView';
import { fabric } from 'fabric';

class Inspector extends React.Component {
  handleDrapOver = e => {
    STATE_DRAGGING.isDragging = true;
    console.log('drap to  inspector', e.target);
  };
  handleDrop = e => {
    STATE_DRAGGING.isDragging = false;
  };
  handleZoomPlus = () => {
    const {
      selected: { id },
    } = this.props;
    console.log('iddd', id);
    const kcanvas = mapStore.get(id);
    kcanvas.setZoom(kcanvas.getZoom() * 1.1);
  };
  handleZoomMinus = () => {
    const {
      selected: { id },
    } = this.props;
    console.log('iddd', id);

    const kcanvas = mapStore.get(id);
    const delta = new fabric.Point(-10, 0);
    kcanvas.relativePan(delta);
    // kcanvas.setZoom(kcanvas.getZoom() / 1.1)
  };

  render() {
    return (
      <div>
        {['2017_07_22_IMG_1194.JPG', '2017_07_22_IMG_1196.JPG'].map(item => {
          return (
            <div
              draggable={true}
              onDragOver={this.handleDrapOver}
              onDrop={this.handleDrop}>
              <img width={'100px'} src={LINK_IMG + item} />
            </div>
          );
        })}
        <button onMouseDown={this.handleZoomPlus}>ZOOM +</button>
        <button onMouseDown={this.handleZoomMinus}>ZOOM -</button>
      </div>
    );
  }
}

export default connect(state => ({
  selected: state.crop.selected,
}))(Inspector);
