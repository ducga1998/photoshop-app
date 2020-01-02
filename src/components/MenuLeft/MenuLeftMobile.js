import PlainColor from '../../static/img/ic_core/plain.component.svg';
import Theme from '../../static/img/ic_core/theme.component.svg';
import Wraparound from '../../static/img/ic_core/wraparound.component.svg';
// import Autofill from '../../static/img/ic_core/Autofill.component.svg';
// import Hide from '../../static/img/ic_core/hide.component.svg';
// import  Plus from '../../static/img/ic_core/plus.component.svg';
import styled from 'styled-components';
import * as React from 'react';
import Background from './Background';
import { connect } from 'react-redux';
// import PhotoGallery from './PhotoGallery';
function MenuLeftMobile({ activeGalleryOnMobile }) {
  const [mode, setMode] = React.useState('PlainColor-spreads');
  const menu = React.useMemo(() => {
    return [
      {
        id: 'PlainColor-spreads',
        iconActive: PlainColor,
        iconInactive: PlainColor,
        onClick: () => setMode('PlainColor-spreads'),
      },
      {
        id: 'Theme-spreads',
        iconActive: Theme,
        iconInactive: Theme,
        onClick: () => setMode('Theme-spreads'),
      },
      {
        id: 'Wraparound-spreads',
        iconActive: Wraparound,
        iconInactive: Wraparound,
        onClick: () => setMode('Wraparound-spreads'),
      },
    ];
  }, []);
  return (
    <Wrapper>
      {menu.map(item => (
        <ToggleButton
          key={item.id}
          onClick={item.onClick}
          active={mode === item.id}>
          <item.iconActive />
        </ToggleButton>
      ))}
      <Container>
        <Background show={mode === 'PlainColor-spreads'} />
      </Container>
    </Wrapper>
  );
}
const mapStateToProps = state => {
  return {
    activeGalleryOnMobile: state.imageStore.present.stateMobile.activeGallery,
  };
};
export default connect(
  mapStateToProps,
  // mapDispatchToProps,
)(MenuLeftMobile);
const Container = styled.div`
  width: 100%;
  top: 0px;
  position: absolute;
  transform: translateY(-100%);
  left: 0px;
`;
const Wrapper = styled.div`
  display: none;
  position: fixed;
  bottom: 0px;
  left: 0px;
  width: 100%;
  background: #ffffff;
  @media (max-width: 1024px) {
    display: flex;
  }
`;
const ToggleButton = styled.div`
  display: flex;
  flex : 1;
  align-content: center;
  justify-content: left;
  padding: 10px;
  border-top : ${props => (props.active ? '1px solid black' : '')};
  color: ${props => (props.active ? '#b06ab3' : 'gray')};
  path {
      fill: ${props => (props.active ? 'black' : '#919699')};
    }
  margin: auto;
  cursor: pointer;
  border-top :${props =>
    props.active ? '6px solid black' : '6px solid transparent'};
  svg {
    //height: 40px;
    margin: auto;
    // transform: ${props => (props.invert ? 'scaleX(-1)' : '')};
  }
  flex-direction: column-reverse;
  text-align: center;

`;
