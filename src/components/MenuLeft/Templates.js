import React, { useState, useCallback } from 'react';
import styled from 'styled-components';

import ArrowBackIcon from '../../static/img/ic_menu_left/ic_arrow_back/ic_arrow_back.svg';
import PlainColorsActiveIcon from '../../static/img/ic_templates/ic_plain_colors/ic_plain_colors_active.svg';
import PlainColorsInactiveIcon from '../../static/img/ic_templates/ic_plain_colors/ic_plain_colors_inactive.svg';
import ThemesActiveIcon from '../../static/img/ic_templates/ic_themes/ic_themes_active.svg';
import ThemesInactiveIcon from '../../static/img/ic_templates/ic_themes/ic_themes_inactive.svg';
import WrapAroundActiveIcon from '../../static/img/ic_templates/ic_wrap_around/ic_wrap_around_active.svg';
import WrapAroundInactiveIcon from '../../static/img/ic_templates/ic_wrap_around/ic_wrap_around_inactive.svg';
import BigPhotoIcon from '../../static/img/ic_menu_left/ic_photo/ic_photo_inactive.svg';

const background = [
  { id: 1, color: '#fff' },
  { id: 2, color: 'linear-gradient(90deg, #EE9CA7 0%, #FFDDE1 100%)' },
  { id: 3, color: 'linear-gradient(90deg, #FFEFBA 0%, #FFFFFF 100%)' },
  { id: 4, color: 'linear-gradient(90deg, #D3CCE3 0%, #E9E4F0 100%)' },
  { id: 5, color: 'linear-gradient(90deg, #DE6262 0%, #FFB88C 100%)' },
  { id: 6, color: 'linear-gradient(90deg, #DDD6F3 0%, #FAACA8 100%)' },
  { id: 7, color: '#E6E6E6' },
  { id: 8, color: '#DDD6F3' },
  { id: 9, color: '#FAACA8' },
  { id: 10, color: '#FFB88C' },
  { id: 11, color: '#fff' },
  { id: 12, color: 'linear-gradient(90deg, #EE9CA7 0%, #FFDDE1 100%)' },
  { id: 13, color: 'linear-gradient(90deg, #FFEFBA 0%, #FFFFFF 100%)' },
  { id: 14, color: 'linear-gradient(90deg, #D3CCE3 0%, #E9E4F0 100%)' },
  { id: 15, color: 'linear-gradient(90deg, #DE6262 0%, #FFB88C 100%)' },
  { id: 16, color: 'linear-gradient(90deg, #DDD6F3 0%, #FAACA8 100%)' },
  { id: 17, color: '#E6E6E6' },
  { id: 18, color: '#DDD6F3' },
  { id: 19, color: '#FAACA8' },
  { id: 20, color: '#FFB88C' },
];

const pictures = Array(20)
  .fill(0)
  .map((item, index) => ({
    img: BigPhotoIcon,
    id: index + 1,
  }));

const wraps = Array(20)
  .fill(0)
  .map((item, index) => ({
    wrap: 'rgba(0,0,0,0.5)',
    id: index + 1,
  }));

const Container = styled.div`
  position: relative;
  width: ${props => (props.show ? 300 : 0)}px;
  height: calc(100vh - 70px);
  background-color: #f4f4f4;
  transition: ${props => (props.show ? '0.3s ease-in-out 0.3s' : '0.3s')};
`;

const ElementGroup = styled.div`
  width: ${props => (props.show ? 300 : 0)}px;
  overflow: hidden;
  opacity: ${props => (props.show ? 1 : 0)};
  transition: ${props =>
    props.show ? 'opacity 0.3s ease-in-out 0.6s' : 'none'};
`;

const TemplatesWrapper = styled.div`
  margin-top: 30px;
  position: relative;
`;

const Tabs = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #e0e0e0;
`;

const Tab = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  cursor: pointer;
`;

const IconTab = styled.img`
  width: 30px;
  height: 30px;
`;

const Bar = styled.div`
  width: calc(100% / 3);
  height: 3px;
  background-color: #494b4d;
  position: absolute;
  bottom: 0px;
  left: ${props => `calc(100% * ${props.tabActive} / 3)`};
  transition: left 0.2s ease;
`;

const PhotosWrapper = styled.div`
  margin: 0px 20px;
  position: relative;
  overflow: auto;
  height: calc(100vh - 150px);

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: #bdbdbd;
    border-radius: 8px;
  }
`;

const Photos = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  padding: 30px 20px 10px;
`;

const BorderPhoto = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 100px;
  margin-bottom: 15px;
  border-radius: 4px;
  border: solid 3px transparent;
  cursor: pointer;

  &:hover {
    border: solid 3px #494b4d;
  }
`;

const SubBorderPhoto = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 100px;
  border: solid 1px #e0e0e0;
  border-radius: 4px;
  cursor: pointer;

  ${BorderPhoto}:hover & {
    border: solid 1px transparent;
  }
`;

const Photo = styled.div`
  width: 90px;
  height: 90px;
`;

const ButtonBack = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 25px;
  height: 25px;
  background-color: #494b4d;
  border-radius: 6px;
  cursor: pointer;
  position: absolute;
  top: 120px;
  left: 288px;
  z-index: ${props => (props.show ? 2 : -1)};
  opacity: ${props => (props.show ? 1 : 0)};
  transition: ${props =>
    props.show ? 'opacity 0.3s ease-in-out 0.3s' : 'opacity 0.3s'};

  &:hover {
    background-color: #b06ab3;
  }
`;

const ButtonBackIcon = styled.img`
  height: 15px;
`;

function Templates({ show, hidden }) {
  const [tabActive, setTabActive] = useState(0);

  const changeTab = useCallback(tab => {
    setTabActive(tab);
  }, []);

  const renderTab = useCallback(() => {
    switch (tabActive) {
      case 0:
        return background.map(item => (
          <BorderPhoto key={item.id}>
            <SubBorderPhoto>
              <Photo style={{ background: item.color }} />
            </SubBorderPhoto>
          </BorderPhoto>
        ));

      case 1:
        return pictures.map(item => (
          <BorderPhoto key={item.id}>
            <SubBorderPhoto>
              <Photo
                style={{
                  background: `url(${item.img})`,
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '90px 90px',
                  backgroundPosition: 'center center',
                }}
              />
            </SubBorderPhoto>
          </BorderPhoto>
        ));

      case 2:
        return wraps.map(item => (
          <BorderPhoto key={item.id}>
            <SubBorderPhoto>
              <Photo style={{ background: item.wrap }} />
            </SubBorderPhoto>
          </BorderPhoto>
        ));

      default:
        return null;
    }
  }, [tabActive]);

  return (
    <Container show={show}>
      <ButtonBack show={show} onClick={hidden}>
        <ButtonBackIcon src={ArrowBackIcon} alt={''} />
      </ButtonBack>
      <ElementGroup show={show}>
        <TemplatesWrapper>
          <Tabs>
            <Tab active={tabActive === 0} onClick={() => changeTab(0)}>
              <IconTab
                src={
                  tabActive === 0
                    ? PlainColorsActiveIcon
                    : PlainColorsInactiveIcon
                }
                alt={''}
              />
            </Tab>
            <Tab active={tabActive === 1} onClick={() => changeTab(1)}>
              <IconTab
                src={tabActive === 1 ? ThemesActiveIcon : ThemesInactiveIcon}
                alt={''}
              />
            </Tab>
            <Tab active={tabActive === 2} onClick={() => changeTab(2)}>
              <IconTab
                src={
                  tabActive === 2
                    ? WrapAroundActiveIcon
                    : WrapAroundInactiveIcon
                }
                alt={''}
              />
            </Tab>
            <Bar tabActive={tabActive} />
          </Tabs>
          <PhotosWrapper>
            <Photos>{renderTab()}</Photos>
          </PhotosWrapper>
        </TemplatesWrapper>
      </ElementGroup>
    </Container>
  );
}

export default Templates;
