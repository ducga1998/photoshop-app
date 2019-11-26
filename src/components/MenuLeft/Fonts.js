import React from 'react';
import styled from 'styled-components';
import Head from 'next/head';

import ArrowBackIcon from '../../static/img/ic_menu_left/ic_arrow_back/ic_arrow_back.svg';

const fonts = [
  { font: `'ABeeZee', sans-serif`, title: 'ABeeZee Regular' },
  { font: `'Abhaya Libre', serif`, title: 'Abhaya Libre' },
  { font: `'Abril Fatface', cursive`, title: 'Abril Fatface' },
  { font: `'Aladin', cursive`, title: 'Aladin' },
  {
    font: `'Annie Use Your Telescope', cursive`,
    title: 'Annie Use Your Telescope',
  },
  { font: `'Bad Script', cursive`, title: 'Bad Script' },
  { font: `'Baloo', cursive`, title: 'Baloo' },
  { font: `'Chivo', sans-serif`, title: 'Chivo' },
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

const FontsWrapper = styled.div`
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

const FontsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0px 10px;
`;

const Font = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 90px;
  margin-bottom: 20px;
  background-color: #fff;
  box-shadow: 0px 2px 12px rgba(22, 25, 101, 0.05);
  border-radius: 6px;
  color: #494b4d;
  cursor: pointer;

  &:hover {
    background-color: #494b4d;
    color: #fff;
  }
`;

const StyleFont = styled.div`
  flex: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 21px;
  font-weight: 900;
  border-bottom: solid 1px #f2f2f2;
`;

const TitleFont = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  color: #b06ab3;
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

function Fonts({ show, hidden }) {
  return (
    <React.Fragment>
      <Head>
        <link
          href="https://fonts.googleapis.com/css?family=ABeeZee&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css?family=Abhaya+Libre&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css?family=Abril+Fatface&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css?family=Aladin&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css?family=Annie+Use+Your+Telescope&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css?family=Bad+Script&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css?family=Baloo&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css?family=Chivo&display=swap"
          rel="stylesheet"
        />
      </Head>
      <Container show={show}>
        <ButtonBack show={show} onClick={hidden}>
          <ButtonBackIcon src={ArrowBackIcon} alt={''} />
        </ButtonBack>
        <ElementGroup show={show}>
          <FontsWrapper>
            <FontsContainer>
              {fonts.map(item => (
                <Font key={item.title}>
                  <StyleFont style={{ fontFamily: item.font }}>
                    AaBbCcDdEeFfGg
                  </StyleFont>
                  <TitleFont>{item.title}</TitleFont>
                </Font>
              ))}
            </FontsContainer>
          </FontsWrapper>
        </ElementGroup>
      </Container>
    </React.Fragment>
  );
}

export default Fonts;
