import * as React from 'react';
import { Test } from '../components/DragAndDrop/test';
import { connect } from 'react-redux';

class TestC extends React.PureComponent {
  render() {
    return <Test />;
  }
}

export default connect()(TestC);
