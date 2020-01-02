import React from 'react';
import styled from 'styled-components';

import ArrowBackIcon from '../../static/img/ic_menu_left/ic_arrow_back/ic_arrow_back.svg';
import SquareIcon from '../../static/img/ic_orientation/ic_square/ic_square.svg';
import PortraitIcon from '../../static/img/ic_orientation/ic_portrait/ic_portrait.svg';
import LandscapeIcon from '../../static/img/ic_orientation/ic_landscape/ic_landscape.svg';

const orientations = [
  {
    id: 'square',
    img: SquareIcon,
  },
  {
    id: 'portrait',
    img: PortraitIcon,
  },
  {
    id: 'landscape',
    img: LandscapeIcon,
  },
];

const Container = styled.div`
  position: relative;
  width: ${props => (props.show ? 300 : 0)}px;
  height: calc(100vh - 70px);
  background-color: #f4f4f4;
  transition: ${props => (props.show ? '0.3s ease-in-out 0.3s' : '0.3s')};
  @media (max-width: 1024px) {
    height: initial;
    width: ${props => (props.show ? '100%' : '0px')};
    position: absolute;
    top: 0px;
  }
`;

const ElementGroup = styled.div`
  width: ${props => (props.show ? 300 : 0)}px;
  overflow: hidden;
  opacity: ${props => (props.show ? 1 : 0)};
  transition: ${props =>
    props.show ? 'opacity 0.3s ease-in-out 0.6s' : 'none'};
  @media (max-width: 1024px) {
    width: ${props => (props.show ? '100%' : '0px')};
  }
`;

const PhotosWrapper = styled.div`
  margin: 30px 20px 0px;
  position: relative;
  overflow: auto;
  height: calc(100vh - 100px);

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
  padding: 0 20px;
  @media (max-width: 1024px) {
    flex-wrap: initial;
  }
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

const Photo = styled.img`
  width: 60px;
  height: 60px;
  padding: 20px;
  border: solid 1px #e0e0e0;
  border-radius: 4px;
  cursor: pointer;

  ${BorderPhoto}:hover & {
    border: solid 1px transparent;
  }
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
  @media (max-width: 1024px) {
    display: none;
  }
`;

const ButtonBackIcon = styled.img`
  height: 15px;
`;

function Orientation({ show, hidden }) {
  return (
    <Container show={show}>
      <ButtonBack show={show} onClick={hidden}>
        <ButtonBackIcon src={ArrowBackIcon} alt={''} />
      </ButtonBack>
      <ElementGroup show={show}>
        <PhotosWrapper>
          <Photos>
            {orientations.map(item => (
              <BorderPhoto key={item.id}>
                <Photo src={item.img} alt={''} />
              </BorderPhoto>
            ))}
          </Photos>
        </PhotosWrapper>
      </ElementGroup>
    </Container>
  );
}

export default Orientation;
