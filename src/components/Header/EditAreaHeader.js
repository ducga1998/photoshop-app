import React from 'react';
import styled from 'styled-components';
import { ActionCreators as UndoActionCreators } from 'redux-undo';
import ArrowUndoIcon from '../../static/img/ic_edit_area/ic_arrow_undo/ic_arrow_undo.svg';
import ArrowRedoIcon from '../../static/img/ic_edit_area/ic_arrow_redo/ic_arrow_redo.svg';
import HelpIcon from '../../static/img/ic_edit_area/ic_help/ic_help.svg';
import { connect } from 'react-redux';

const Container = styled.div`
  width: 100%;
  height: 60px;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: #494b4d;
`;

const ButtonGroup = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Button = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 60px;
  padding: 0px 15px;
  font-size: 14px;
  color: #fff;
  cursor: pointer;
  opacity: ${props => (props.disabled ? '0.5' : '1')};
  pointer-events: ${props => (props.disabled ? 'none' : '')};
  &:hover {
    background: linear-gradient(90deg, #4568dc 0%, #b06ab3 100%);
  }
`;

const ButtonIcon = styled.img`
  width: 30px;
  height: 30px;
  margin-bottom: 3px;
`;

function EditAreaHeader({ canUndo, canRedo, onUndo, onRedo }) {
  return (
    <Container>
      <ButtonGroup>
        <Button data-outside="undo" onClick={onUndo} disabled={!canUndo}>
          <ButtonIcon src={ArrowUndoIcon} alt={''} />
          <span>Undo</span>
        </Button>
        <Button data-outside="redo" onClick={onRedo} disabled={!canRedo}>
          <ButtonIcon src={ArrowRedoIcon} alt={''} />
          <span>Redo</span>
        </Button>
      </ButtonGroup>
      <Button>
        <ButtonIcon src={HelpIcon} alt={''} />
        <span>Help</span>
      </Button>
    </Container>
  );
}
const mapStateToProps = state => {
  return {
    canUndo: state.imageStore.past.length > 0,
    canRedo: state.imageStore.future.length > 0,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onUndo: () => dispatch(UndoActionCreators.undo()),
    onRedo: () => dispatch(UndoActionCreators.redo()),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(EditAreaHeader);
