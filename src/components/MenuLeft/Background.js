import React from 'react';
import styled from 'styled-components';

import ArrowBackIcon from '../../static/img/ic_menu_left/ic_arrow_back/ic_arrow_back.svg';

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

function Background({ show, hidden }) {
  return (
    <Container show={show}>
      <ButtonBack show={show} onClick={hidden}>
        <ButtonBackIcon src={ArrowBackIcon} alt={''} />
      </ButtonBack>
      <ElementGroup show={show}>
        <PhotosWrapper>
          <Photos>
            {background.map(item => (
              <BorderPhoto key={item.id}>
                <SubBorderPhoto>
                  <Photo style={{ background: item.color }} />
                </SubBorderPhoto>
              </BorderPhoto>
            ))}
          </Photos>
        </PhotosWrapper>
      </ElementGroup>
    </Container>
  );
}

export default Background;
