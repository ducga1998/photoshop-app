import React from 'react';
import styled from 'styled-components';
import _ from 'lodash';
import { AutoSizer } from 'react-virtualized';
import TouchBackend from 'react-dnd-touch-backend';
import { DndProvider } from 'react-dnd';

import MainHeader from '../components/Header/MainHeader';
import MenuLeft from '../components/MenuLeft/MenuLeft';
import EditAreaHeader from '../components/Header/EditAreaHeader';
import ImageView from '../components/Images/ImageView';
import Frame from '../components/Frame/Frame';
import { connect } from 'react-redux';
import IconNext from '../static/img/ic_edit_area/ic_next_spread/ic_next_spread.svg';
import IconPrev from '../static/img/ic_edit_area/ic_prev_spread/ic_prev_spread.svg';
import imageStoreAction from '../store/imageStore/actions';
import BookSpreads from '../components/MenuLeft/BookSpreads';
import MenuLeftMobile from '../components/MenuLeft/MenuLeftMobile';
import Responsive from '../components/Responsive/Responsive';
import Content from '../components/Layout/Content';
import CustomDragLayer from '../components/Layout/CustomLayer';
// import { DragProvider, Droppable } from '../components/DragAndDrop/DragContext';

const Container = styled.div`
  font-family: sans-serif;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const Body = styled.div`
  display: flex;
  background-color: #bdbdbd;
  flex: 1;
`;

const ButtonNavigateSpread = styled.img`
  cursor: pointer;
  width: 33px;
  height: 33px;
  top: 50%;
  margin-top: -17.5px;
  position: absolute;
  @media (max-width: 480px) {
    width: 25px;
    height: 25px;
  }
`;

const NextButton = styled(ButtonNavigateSpread)`
  right: 20px;
  @media (max-width: 480px) {
    right: 10px;
  }
  z-index: 4;
`;
const PrevButton = styled(ButtonNavigateSpread)`
  left: 20px;
  @media (max-width: 480px) {
    left: 10px;
  }
  z-index: 4;
`;

function Layout(props) {
  const { spread, viewMobileInSpread } = props;
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

  function renderButton(props) {
    return (
      <>
        {index !== 0 && (
          <PrevButton
            src={IconPrev}
            onClick={() => props.changeSpread(props.image[index - 1].idPage)}
          />
        )}
        {props.image && index !== props.image.length - 1 && (
          <NextButton
            src={IconNext}
            onClick={() => props.changeSpread(props.image[index + 1].idPage)}
          />
        )}
      </>
    );
  }

  const renderForMobile = () => {
    return (
      <BookSpreads
        show
        setSpread={item => {
          props.changeSpread(item.idPage);
          // props.onActive('Spread')
        }}
        hidden={() => null}
      />
    );
  };

  const renderForDesktop = isMobile => {
    return (
      <AutoSizer onResize={onResize}>
        {({ width, height }) => {
          let aspectRatio = 2;
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
                flex: 1,
              }}>
              <Frame
                isMobile={isMobile}
                renderButton={() => {
                  return renderButton(props);
                }}
                data={{
                  frameSize: { height: h, width: w },
                }}>
                {({ width, height }) => {
                  return (
                    visibleOnResize && (
                      <>
                        <ImageView
                          key={props.id}
                          spread={spread}
                          frameHeight={height}
                          frameWidth={width}
                          id={props.id}
                          renderButton={renderButton}
                        />
                      </>
                    )
                  );
                }}
              </Frame>
            </div>
          );
        }}
      </AutoSizer>
    );
  };

  const renderTabsForMobile = isMobile => {
    return (
      <>
        <div
          style={{
            display: viewMobileInSpread === 'ViewAllSpread' ? 'block' : 'none',
          }}>
          {renderForMobile(isMobile)}
        </div>
        <div
          style={{
            display: viewMobileInSpread === 'Spread' ? 'block' : 'none',
            height: '100%',
            width: '100%',
          }}>
          {renderForDesktop(isMobile)}
        </div>
      </>
    );
  };

  return (
    <DndProvider
      backend={TouchBackend}
      options={{
        enableMouseEvents: true,
        delayTouchStart: 200,
        delayMouseStart: 0,
        ignoreContextMenu: true,
        enableKeyboardEvents: true,
      }}>
      <Container>
        <CustomDragLayer />
        <MainHeader />
        <Body>
          <MenuLeft
            onChangeSpread={item => {
              props.changeSpread(item.idPage);
            }}
          />
          {/*<Droppable*/}
          {/*  onDrop={item => props.deleteImageAsync(item.idElement)}*/}
          {/*  acceptTypes={['image-spread']}>*/}
          {/*  {({ isDragOver, isDragging, ...divProps }) => (*/}
          <Content
            onDrop={item => props.deleteImageAsync(item.idElement)}
            ref={refContent}
            data-outside="layout_outside"
            onClick={e => {
              const target = e.target.closest('[data-outside]');
              if (
                target &&
                target.getAttribute('data-outside') &&
                target.getAttribute('data-outside').startsWith('layout_outside')
              ) {
                e.preventDefault();
                e.stopPropagation();
                props.setSelect([]);
              }
            }}>
            <EditAreaHeader />
            <div style={{ height: '100%', width: '100%' }}>
              <Responsive>
                {matches =>
                  matches.mobile
                    ? renderTabsForMobile(matches.mobile)
                    : renderForDesktop(matches.mobile)
                }
              </Responsive>
              <Responsive>
                {({ mobile }) =>
                  mobile &&
                  props.selected &&
                  viewMobileInSpread === 'Spread' &&
                  !props.selected.length && <MenuLeftMobile />
                }
              </Responsive>
            </div>
          </Content>
          {/*)}*/}
          {/*</Droppable>*/}
        </Body>
      </Container>
    </DndProvider>
  );
}

const mapStateToProps = state => {
  const selectedSpread = (() => {
    const { initImageState } = state.imageStore.present;
    return (
      initImageState.find(
        spreadItem => spreadItem.idPage === state.imageStore.present.spread,
      ) || initImageState[0]
    );
  })();
  return {
    selected: state.imageStore.present.selected,
    image: state.imageStore.present.initImageState,
    spread: state.imageStore.present.spread,
    spreadDataSelected: selectedSpread,
    id: selectedSpread && selectedSpread.idPage,
    viewMobileInSpread: state.imageStore.present.stateMobile.active,
  };
};
const mapDispatchToProps = dispatch => ({
  changeSpread: spreadIndex => {
    dispatch(imageStoreAction.image.changeSpread(spreadIndex));
  },
  relayout: data => dispatch(imageStoreAction.image.reLayout(data)),
  setSelect: id => dispatch(imageStoreAction.image.setSelected(id)),
  deleteImageAsync: id => dispatch({ type: 'DELETE_IMG_ASYNC', id }),
  onActive: view => dispatch(imageStoreAction.image.changeViewMobile({ view })),
  fetchDataRelayout: assets =>
    dispatch({ type: 'FETCH_DATA_RELAYOUT', assets }),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Layout);
