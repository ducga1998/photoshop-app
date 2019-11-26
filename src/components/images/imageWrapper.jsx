import * as React from 'react';
import styled from 'styled-components';

class ImageWrapper extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <WrapperCanvas {...this.props}>{this.props.children}</WrapperCanvas>;
  }
}

const WrapperCanvas = styled.div`
  position: relative;

  width: ${props => (props.width ? props.width + 'px' : '')};
  height: ${props => (props.height ? props.height + 'px' : '')};
`;

export default ImageWrapper;
