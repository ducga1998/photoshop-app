import React from 'react';
import styled from 'styled-components';
import _ from 'lodash';
import { AutoSizer } from 'react-virtualized';

import MainHeader from '../components/Header/MainHeader';
import MenuLeft from '../components/MenuLeft/MenuLeft';
import EditAreaHeader from '../components/Header/EditAreaHeader';
import ImageView from '../components/images/ImageView';
import Frame from '../components/frame/Frame';
import { connect } from 'react-redux';
import { createAction } from 'redux-actions';
import { STATE_DRAGGING } from '../helpers/utils';
import IconNext from '../static/img/ic_edit_area/ic_next_spread/ic_next_spread.svg';
import IconPrev from '../static/img/ic_edit_area/ic_prev_spread/ic_prev_spread.svg';

const Container = styled.div`
  font-family: sans-serif;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
`;

const Body = styled.div`
  display: flex;
  background-color: #bdbdbd;
`;

const Content = styled.div`
  width: 100%;
`;

const ButtonNavigateSpread = styled.img`
  cursor: pointer;
  width: 33px;
  height: 33px;
  top: 50%;
  margin-top: -17.5px;
  position: absolute;
`;

const NextButton = styled(ButtonNavigateSpread)`
  right: 20px;
`;
const PrevButton = styled(ButtonNavigateSpread)`
  left: 20px;
`;

function Layout(props) {
  const { spread } = props;
  const refContent = React.useRef(null);
  const [visibleOnResize, setVisibleOnResize] = React.useState(true);
  const debouceResize = React.useMemo(() => {
    return _.debounce(() => {
      setVisibleOnResize(true);
    }, 50);
  }, [setVisibleOnResize]);
  const onResize = React.useCallback(() => {
    // function to hide the image view and show after 100ms when resize with debounce
    setVisibleOnResize(false);
    debouceResize();
  }, [debouceResize, setVisibleOnResize]);

  let index = props.image.findIndex(i => i.idPage === props.spread);
  if (index === -1) {
    index = 0;
  }
  return (
    <Container>
      <MainHeader />
      <Body>
        <MenuLeft
          onChangeSpread={item => {
            props.changeSpread(item.idPage);
            props.setSelect([]);
          }}
        />
        <Content
          ref={refContent}
          data-outside="layout_outside"
          onMouseDown={e => {
            const target = e.target.closest('[data-outside]');
            if (
              target &&
              target.getAttribute('data-outside') &&
              target.getAttribute('data-outside').startsWith('layout_outside')
            ) {
              props.setSelect([]);
            }
          }}
          onDragOver={e => {
            e.preventDefault();
          }}
          onDrop={async e => {
            const target = e.target.closest('[data-outside]');
            console.log('targettt drop capture', e.target);
            if (e.target && e.target.getAttribute('data-element') === 'frame') {
              return;
            }
            if (
              STATE_DRAGGING.idDragging.length > 0 &&
              target &&
              target.getAttribute('data-outside') &&
              target.getAttribute('data-outside').startsWith('layout_outside')
            ) {
              props.deleteImage(STATE_DRAGGING.idDragging);
              STATE_DRAGGING.clear();
            }
          }}
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'column',
          }}>
          <EditAreaHeader />
          <div style={{ flex: 1, width: '100%' }}>
            <AutoSizer onResize={onResize}>
              {({ width, height }) => {
                let aspectRatio = 1.825;
                const maxWidth = width * 0.75;
                const maxHeight = height * 0.9;
                let h = maxHeight,
                  w = h * aspectRatio;
                if (maxHeight * aspectRatio > maxWidth) {
                  // scale base on width;
                  w = maxWidth;
                  h = w / aspectRatio;
                }
                return (
                  <div
                    style={{
                      width,
                      height,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    {index !== 0 && (
                      <PrevButton
                        src={IconPrev}
                        onClick={() =>
                          props.changeSpread(props.image[index - 1].idPage)
                        }
                      />
                    )}
                    {props.image && index !== props.image.length - 1 && (
                      <NextButton
                        src={IconNext}
                        onClick={() =>
                          props.changeSpread(props.image[index + 1].idPage)
                        }
                      />
                    )}
                    <Frame
                      data={{
                        frameSize: { height: h, width: w },
                      }}>
                      {({ width, height }) => {
                        return (
                          visibleOnResize && (
                            <ImageView
                              key={props.id}
                              spread={spread}
                              frameHeight={height}
                              frameWidth={width}
                              id={props.id}
                            />
                          )
                        );
                      }}
                    </Frame>
                  </div>
                );
              }}
            </AutoSizer>
          </div>
        </Content>
      </Body>
    </Container>
  );
}

const mapStateToProps = state => {
  return {
    image: state.imageStore.present.initImageState,
    spread: state.imageStore.present.spread,
    spreadDataSelected: (() => {
      const { initImageState } = state.imageStore.present;
      return (
        initImageState.find(
          spreadItem => spreadItem.idPage === state.imageStore.present.spread,
        ) || initImageState[0]
      );
    })(),
  };
};
const mapDispatchToProps = dispatch => ({
  changeSpread: spreadIndex => {
    dispatch(createAction('CHANGE_SPREAD')(spreadIndex));
  },
  relayout: data => dispatch(createAction('RE_LAYOUT')(data)),
  changeImage: data => dispatch('CHANGE_IMG_DATA')({ data }),
  setSelect: id => dispatch(createAction('SET_SELECTED')(id)),
  deleteImage: id => {
    return dispatch(createAction('DELETE_IMG')(id));
  },
});
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Layout);
