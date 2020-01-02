import React from 'react';
import styled from 'styled-components';

import ArrowBackIcon from '../../static/img/ic_menu_left/ic_arrow_back/ic_arrow_back.svg';

const pages = [
  { id: 'basic', title: 'Basic', size: 24, cost: 0 },
  { id: 'recommended', title: 'Recommended', size: 40, cost: 0 },
  { id: 'best', title: 'Best', size: 60, cost: 0 },
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
    z-index: -1;
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

const PageWrapper = styled.div`
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

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0px 10px;
  @media (max-width: 1024px) {
    flex-direction: row;
    overflow-y: scroll;
  }
`;

const Page = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 85px;
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

const HeaderPage = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: 900;
  padding: 0px 20px;
  border-bottom: solid 1px #f2f2f2;
`;

const FooterPage = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding: 0px 20px;
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

function PageSettings({ show, hidden }) {
  return (
    <Container show={show}>
      <ButtonBack show={show} onClick={hidden}>
        <ButtonBackIcon src={ArrowBackIcon} alt={''} />
      </ButtonBack>
      <ElementGroup show={show}>
        <PageWrapper>
          {show && (
            <PageContainer>
              {pages.map(item => (
                <Page key={item.id}>
                  <HeaderPage>{item.title}</HeaderPage>
                  <FooterPage>
                    <span>{item.size} pages</span>
                    <span>${item.cost.toFixed(2)}</span>
                  </FooterPage>
                </Page>
              ))}
            </PageContainer>
          )}
        </PageWrapper>
      </ElementGroup>
    </Container>
  );
}

export default PageSettings;
