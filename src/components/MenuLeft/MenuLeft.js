import React, { useMemo, useState, useEffect } from 'react';
import styled from 'styled-components';

import BookSpreads from './BookSpreads';
import PhotoGallery from './PhotoGallery';
import Templates from './Templates';
import Fonts from './Fonts';
import Background from './Background';
import Orientation from './Orientation';
import PageSettings from './PageSettings';
import BookActiveIcon from '../../static/img/ic_menu_left/ic_book/ic_book_active.svg';
import BookInactiveIcon from '../../static/img/ic_menu_left/ic_book/ic_book_inactive.svg';
import PhotoActiveIcon from '../../static/img/ic_menu_left/ic_photo/ic_photo_active.svg';
import PhotoInactiveIcon from '../../static/img/ic_menu_left/ic_photo/ic_photo_inactive.svg';
import TemplateActiveIcon from '../../static/img/ic_menu_left/ic_template/ic_template_active.svg';
import TemplateInactiveIcon from '../../static/img/ic_menu_left/ic_template/ic_template_inactive.svg';
import FontActiveIcon from '../../static/img/ic_menu_left/ic_font/ic_font_active.svg';
import FontInactiveIcon from '../../static/img/ic_menu_left/ic_font/ic_font_inactive.svg';
import BackgroundActiveIcon from '../../static/img/ic_menu_left/ic_background/ic_background_active.svg';
import BackgroundInactiveIcon from '../../static/img/ic_menu_left/ic_background/ic_background_inactive.svg';
import OrientationActiveIcon from '../../static/img/ic_menu_left/ic_orientation/ic_orientation_active.svg';
import OrientationInactiveIcon from '../../static/img/ic_menu_left/ic_orientation/ic_orientation_inactive.svg';
import PageActiveIcon from '../../static/img/ic_menu_left/ic_page/ic_page_active.svg';
import PageInactiveIcon from '../../static/img/ic_menu_left/ic_page/ic_page_inactive.svg';
import { connect } from 'react-redux';
import { useWindowWidth } from '../../hooks/useWindowWidth';
import Responsive from '../Responsive/Responsive';

const WrapperContainer = styled.div`
  position: relative;
  overflow: auto;
  width: 100px;
  min-width: 100px;
  height: calc(100vh - 70px);
  background-color: #ededed;

  &::-webkit-scrollbar {
    width: 3px;
  }

  &::-webkit-scrollbar-track {
    background: #ededed;
  }

  &::-webkit-scrollbar-thumb {
    background: #000;
  }
  @media (max-width: 1024px) {
    //position: fixed;
    //width: 100%;
    // min-width: 0px;
    // width: 0px;
    flex-direction: row;
    height: 53px;
    width: 100%;
    position: fixed;
    bottom: 0px;
    left: 0px;
    z-index: 10;
    overflow: initial;
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #ededed;
  @media (max-width: 1024px) {
    flex-direction: row;
    width: 100%;
    position: relative;
    bottom: 0px;
    left: 0px;
    z-index: 10;
  }
`;

const ItemMenu = styled.div`
  width: 100%;
  height: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: 0.3s;
  background-color: ${props => (props.active ? '#b06ab3' : 'transparent')};

  &:hover {
    background-color: #b06ab3;
  }
  @media (max-width: 1024px) {
    color: #494b4d;
    background: initial;
    height: 50px;
    border-top: ${props =>
      props.active ? '3px solid black' : '3px solid transparent'};
    &:hover {
      background-color: initial;
    }
  }
`;

const IconMenu = styled.div`
  width: 30px;
  height: 30px;
  margin-bottom: 5px;
  background-image: url(${props =>
    props.active ? props.iconActive : props.iconInactive});
  background-size: 30px 30px;
  background-position: center center;

  ${ItemMenu}:hover & {
    background-image: url(${props => props.iconActive});
  }
`;

const TitleMenu = styled.div`
  font-size: 14px;
  color: ${props => (props.active ? '#fff' : '#494b4d')};

  ${ItemMenu}:hover & {
    color: #fff;
  }
  @media (max-width: 1024px) {
    font-size: 0px;
  }
`;
const Wrapper = styled.div`
  display: flex;
  @media (max-width: 1024px) {
    display: none;
  }
`;
const MenuBarMobile = styled.div`
  width: 100%;
  top: 0px;
  position: absolute;
  transform: translateY(-100%);
  left: 0px;
  z-index: -1;
  height: 150px;
`;

function MenuLeft(props) {
  const isMobile = useWindowWidth() < 1024;
  const [mode, setMode] = useState(null);
  useEffect(() => {
    if (isMobile) {
      setMode('');
    } else {
      setMode('book-spreads');
    }
  }, [isMobile]);
  const menu = useMemo(() => {
    return [
      {
        id: 'book-spreads',
        iconActive: BookActiveIcon,
        iconInactive: BookInactiveIcon,
        title: 'Book Spreads',
        onClick: () => setMode('book-spreads'),
      },
      {
        id: 'photo-gallery',
        iconActive: PhotoActiveIcon,
        iconInactive: PhotoInactiveIcon,
        title: 'Photo Gallery',
        onClick: () => setMode('photo-gallery'),
      },
      {
        id: 'templates',
        iconActive: TemplateActiveIcon,
        iconInactive: TemplateInactiveIcon,
        title: 'Templates',
        onClick: () => setMode('templates'),
      },
      {
        id: 'fonts',
        iconActive: FontActiveIcon,
        iconInactive: FontInactiveIcon,
        title: 'Fonts',
        onClick: () => setMode('fonts'),
      },
      {
        id: 'background',
        iconActive: BackgroundActiveIcon,
        iconInactive: BackgroundInactiveIcon,
        title: 'Background',
        onClick: () => setMode('background'),
      },
      {
        id: 'orientation',
        iconActive: OrientationActiveIcon,
        iconInactive: OrientationInactiveIcon,
        title: 'Orientation',
        onClick: () => setMode('orientation'),
      },
      {
        id: 'page-settings',
        iconActive: PageActiveIcon,
        iconInactive: PageInactiveIcon,
        title: 'Page Settings',
        onClick: () => setMode('page-settings'),
      },
    ];
  }, []);

  // render mobile
  function renderMobile() {
    return (
      <WrapperContainer>
        <Container>
          {menu.map(item => {
            if (item.id === 'book-spreads') return null;
            return (
              <ItemMenu
                key={item.id}
                onClick={item.onClick}
                active={mode === item.id}>
                <IconMenu
                  active={mode === item.id}
                  iconActive={item.iconInactive}
                  iconInactive={item.iconInactive}
                />
                <TitleMenu active={mode === item.id}>{item.title}</TitleMenu>
              </ItemMenu>
            );
          })}
          {mode && (
            <MenuBarMobile>
              <div style={{ position: 'relative' }}>
                <PhotoGallery
                  isMobile={true}
                  show={mode === 'photo-gallery'}
                  hidden={() => setMode(null)}
                />
                <Templates
                  isMobile={true}
                  show={mode === 'templates'}
                  hidden={() => setMode(null)}
                />
                <Fonts
                  isMobile={true}
                  show={mode === 'fonts'}
                  hidden={() => setMode(null)}
                />
                <Background
                  isMobile={true}
                  show={mode === 'background'}
                  hidden={() => setMode(null)}
                />
                <Orientation
                  show={mode === 'orientation'}
                  hidden={() => setMode(null)}
                />
                <PageSettings
                  isMobile={true}
                  show={mode === 'page-settings'}
                  hidden={() => setMode(null)}
                />
              </div>
            </MenuBarMobile>
          )}
        </Container>
      </WrapperContainer>
    );
  }

  const renderDesktop = () => (
    <Wrapper>
      <WrapperContainer>
        <Container>
          {menu.map(item => (
            <ItemMenu
              key={item.id}
              onClick={item.onClick}
              active={mode === item.id}>
              <IconMenu
                active={mode === item.id}
                iconActive={item.iconActive}
                iconInactive={item.iconInactive}
              />
              <TitleMenu active={mode === item.id}>{item.title}</TitleMenu>
            </ItemMenu>
          ))}
        </Container>
      </WrapperContainer>
      <div
        style={{
          width: mode ? 300 : 0,
          display: 'flex',
          transition: 'all 0.3s ease',
        }}>
        <BookSpreads
          setSpread={props.onChangeSpread}
          show={mode === 'book-spreads'}
          hidden={() => setMode(null)}
        />
        <PhotoGallery
          show={mode === 'photo-gallery'}
          hidden={() => setMode(null)}
        />
        <Templates show={mode === 'templates'} hidden={() => setMode(null)} />
        <Fonts show={mode === 'fonts'} hidden={() => setMode(null)} />
        <Background show={mode === 'background'} hidden={() => setMode(null)} />

        <Orientation
          show={mode === 'orientation'}
          hidden={() => setMode(null)}
        />
        <PageSettings
          show={mode === 'page-settings'}
          hidden={() => setMode(null)}
        />
      </div>
    </Wrapper>
  );

  return (
    <Responsive>
      {matches => {
        return (
          <>
            {matches.mobile && props.viewMobileInSpread === 'ViewAllSpread'
              ? renderMobile()
              : renderDesktop()}
          </>
        );
      }}
    </Responsive>
  );
}

// toolbar white => viewMobileInSpread === 'allspread' && isMobile = true
//toolbar white isMobile= false => render
// toolbar white isMobile  = true and viewMobileInSpread == 'Spread' => not render
const mapStateToProps = state => {
  return {
    viewMobileInSpread: state.imageStore.present.stateMobile.active,
  };
};
export default connect(mapStateToProps)(MenuLeft);
