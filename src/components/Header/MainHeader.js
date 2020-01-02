import React, { useState, useCallback } from 'react';
import styled from 'styled-components';

import MainNavbar from '../Navbar/MainNavbar';
import LogoIcon from '../../static/img/ic_logo/ic_logo.svg';

const Container = styled.div`
  width: 100vw;
  height: 70px;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0px 40px;
  position: relative;
  z-index: 100;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  @media (max-width: 480px) {
    padding: 20px;
  }
`;

const ElementGroup = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const MenuButton = styled.div`
  width: 35px;
  height: 35px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background-color: #b06ab3;
  }
`;

const Bar = styled.div`
  width: 30px;
  height: 3px;
  background-color: #494b4d;
  margin: 3px 0;
  transition: 0.3s;

  ${MenuButton}:hover & {
    background-color: #fff;
  }
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  height: 30px;
  margin-left: 40px;
  cursor: pointer;
  @media (max-width: 480px) {
    margin-left: 20px;
  }
`;

const ImageLogo = styled.img`
  height: 30px;
`;

const CompanyName = styled.span`
  font-weight: 900;
  font-size: 25px;
  margin-left: 10px;
  color: #494b4d;
  @media (max-width: 480px) {
    font-size: 15px;
  }
`;

const ButtonBorder = styled.div`
  cursor: pointer;
  width: 70px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  box-sizing: border-box;
  background-clip: padding-box;
  background-color: #fff;
  border: solid 3px transparent;
  margin-right: 20px;

  &:before {
    content: '';

    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: -1;
    border-radius: inherit;
    margin: -3px;
    background: linear-gradient(90deg, #4568dc 0%, #b06ab3 100%);
  }
  @media (max-width: 480px) {
    width: 50px;
    height: 28px;
    margin-right: 13px;
  }
`;

const TextGradient = styled.p`
  font-size: 16px;
  font-weight: 900;
  background: linear-gradient(90deg, #4568dc 0%, #b06ab3 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  @media (max-width: 480px) {
    font-size: 10px;
  }
`;

const ButtonBackground = styled.div`
  cursor: pointer;
  width: 70px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 900;
  color: #fff;
  background-image: linear-gradient(90deg, #4568dc 0%, #b06ab3 100%);
  @media (max-width: 480px) {
    width: 50px;
    height: 28px;
    font-size: 10px;
  }
`;

function MainHeader() {
  const [toggle, setToggle] = useState(false);

  const toggleMenu = useCallback(() => {
    setToggle(!toggle);
  }, [toggle]);

  return (
    <React.Fragment>
      <MainNavbar toggle={toggle} toggleMenu={toggleMenu} />
      <Container>
        <ElementGroup>
          <MenuButton onClick={toggleMenu}>
            <Bar />
            <Bar />
            <Bar />
          </MenuButton>
          <LogoContainer>
            <ImageLogo src={LogoIcon} alt={''} />
            <CompanyName>The Company</CompanyName>
          </LogoContainer>
        </ElementGroup>
        <ElementGroup>
          <ButtonBorder>
            <TextGradient>Share</TextGradient>
          </ButtonBorder>
          <ButtonBackground>Order</ButtonBackground>
        </ElementGroup>
      </Container>
    </React.Fragment>
  );
}

export default MainHeader;
