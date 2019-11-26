import * as React from 'react';
import styled from 'styled-components';
import { mapStore } from '../images/ImageView';
import { fabric } from 'fabric';
import Delete from '../../static/img/ic_core/Delete.component.svg';
import Rotate from '../../static/img/ic_core/Rotate.component.svg';
import Filter from '../../static/img/ic_core/Filter.component.svg';
import Flip from '../../static/img/ic_core/Flip.component.svg';

if (process.browser) {
  var webglBackend = new fabric.WebglFilterBackend();
}
const f = fabric.Image.filters;
fabric.filterBackend = webglBackend;

// new f.Brownie()
class Toolbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openFilter: false,
      selectedColor: '',
    };
  }

  applyFilter = (index, filter) => {
    const { idElement } = this.props.selected;
    const kclassCanvas = mapStore.get(idElement);
    console.log('kclassCanvas', kclassCanvas);
    const obj = kclassCanvas.item(0);
    obj.filters.push(filter);
    obj.applyFilters();
  };
  getKclass = () => {
    const { selected } = this.props;
    if (!selected.length) return {};
    return selected.map(select => {
      const kclassCanvas = mapStore.get(select.idElement);
      const kclassImage = kclassCanvas.item(0);
      console.log('{ kclassCanvas, kclassImage, angle: select.angle }', {
        kclassCanvas,
        kclassImage,
        angle: select.angle,
      });
      return { kclassCanvas, kclassImage, angle: select.angle };
    });
  };

  flipImage = () => {
    const arrKclass = this.getKclass();
    arrKclass.map(({ kclassImage, kclassCanvas }) => {
      if (
        kclassImage.orientation &&
        [5, 6, 7, 8].includes(kclassImage.orientation)
      ) {
        this.props.changeImageData({
          data: {
            flipY: !kclassImage.flipY,
          },
        });
      } else {
        this.props.changeImageData({
          data: { flipX: !kclassImage.flipX },
        });
      }
      kclassCanvas.renderAll();
      return null;
      // });
    });
  };
  rotateImage = () => {
    const arrKclass = this.getKclass();
    arrKclass.map(({ kclassImage }) => {
      let angle = kclassImage.angle;
      angle = angle + 90;

      if (angle >= 360) {
        angle = angle - 360;
      }
      this.props.changeImageData({ data: { angle } });
      return null;
    });
  };
  handleFilterColor = filterColor => {
    if (filterColor === 'Brownie') {
      this.setState({ selectedColor: filterColor });
      this.applyFilter(4, new f.Brownie());
    }
  };
  deleteImage = () => {
    this.props.changeImageData({
      data: { src: '' }
    });
  };

  render() {
    const { openFilter } = this.state;
    if (!this.props.selected && !this.props.selected.length) {
      return null;
    }
    const { selected } = this.props;
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
    if (!rect.top) return null;
    // console.log('rect', rect);
    return (
      <Wrapper {...rect} data-outside="toolbar">
        <TooggleButton stroke onClick={this.flipImage}>
          Flip <Flip />{' '}
        </TooggleButton>
        <TooggleButton invert stroke onClick={this.rotateImage}>
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
        <TooggleButton stroke onClick={this.deleteImage}>
          Delete <Delete />
        </TooggleButton>
        {openFilter && (
          <WrapperColorFilter>
            {[
              'Sepia',
              'Black/White',
              'Brownie',
              'Vintage',
              'Kodachrome',
              'Technicolor',
              'Polaroid',
              'Remove Color',
            ].map((styleFilter, key) => {
              return (
                <ToggleFilter
                  key={key}
                  onClick={() => this.handleFilterColor(styleFilter)}>
                  {styleFilter}
                </ToggleFilter>
              );
            })}
          </WrapperColorFilter>
        )}
      </Wrapper>
    );
  }
}

export default Toolbar;
const WrapperColorFilter = styled.div`
  width: 450px;
  background: #828282;
  overflow-x: scroll;
  border-radius: 6px;
  position: absolute;
  display: flex;
  top: 110px;
  transform: translateX(-10%);
`;
const ToggleFilter = styled.div`
  padding: 10px;
  cursor: pointer;
  background: #e0e0e0;
  margin: 9px;
  font-size: 8px;
  color: #828282;
`;
const Wrapper = styled.div`
  position: fixed;
  background: #494b4d;
  display: flex;
  border-radius: 6px;
  top: ${props => (props.top ? props.top + props.heightWraper + 'px' : '0px')};
  left: ${props =>
    props.left ? props.left + props.widthWraper / 2 + 'px' : '0px'};
  transform: translate(-50%, 20%);
`;
const TooggleButton = styled.div`
  display: flex;
  align-content: center;
  justify-content: left;
  padding: 15px;
  //background  : black;
  color: ${props => (props.active ? '#b06ab3' : 'white')};
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
    transform: ${props => (props.invert ? 'scaleX(-1)' : '')};
  }
  flex-direction: column-reverse;
  text-align: center;
`;
