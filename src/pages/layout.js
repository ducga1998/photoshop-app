import React from 'react';
import styled from 'styled-components';
import _ from 'lodash';
import { AutoSizer } from 'react-virtualized';

import MainHeader from '../components/Header/MainHeader';
import MenuLeft from '../components/MenuLeft/MenuLeft';
import EditAreaHeader from '../components/Header/EditAreaHeader';
import ImageView from '../components/Images/ImageView';
import Frame from '../components/frame/Frame';
import { connect } from 'react-redux';
import { STATE_DRAGGING } from '../helpers/utils';
import IconNext from '../static/img/ic_edit_area/ic_next_spread/ic_next_spread.svg';
import IconPrev from '../static/img/ic_edit_area/ic_prev_spread/ic_prev_spread.svg';
import { toast } from 'react-toastify';
import imageStoreAction from '../store/imageStore/actions';
import authorizedRequest from '../helpers/request/authorizedRequest';

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
          }}
        />
        {/*{bool? 'cdscdscdscds' : 'duc'}*/}
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
              e.preventDefault();
              e.stopPropagation();
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
              const data = {
                assets: props.spreadDataSelected.assets,
                leftLayoutIndex: 0,
                pagespreadIndex: 1,
                rightLayoutIndex: 0,
              };
              const result = await authorizedRequest.put(
                `https://t69kla0zpk.execute-api.ap-southeast-1.amazonaws.com/dev/relayout/p-7ubVMK7eak6da3MwH7vz5X/spread/` +
                  'left',
                data,
              );
              if (result && Object.keys(result).length === 0) {
                toast.error('Maximum in layout');
                return;
              }
              await props.relayout(result);

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
  const selectedSpread = (() => {
    const { initImageState } = state.imageStore.present;
    return (
      initImageState.find(
        spreadItem => spreadItem.idPage === state.imageStore.present.spread,
      ) || initImageState[0]
    );
  })();
  return {
    image: state.imageStore.present.initImageState,
    spread: state.imageStore.present.spread,
    spreadDataSelected: selectedSpread,
    id: selectedSpread && selectedSpread.idPage,
  };
};
const mapDispatchToProps = dispatch => ({
  changeSpread: spreadIndex => {
    dispatch(imageStoreAction.image.changeSpread(spreadIndex));
  },
  relayout: data => dispatch(imageStoreAction.image.reLayout(data)),
  setSelect: id => dispatch(imageStoreAction.image.setSelected(id)),
  deleteImage: id => {
    return dispatch(imageStoreAction.image.deleteImg(id));
  },
});
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Layout);
