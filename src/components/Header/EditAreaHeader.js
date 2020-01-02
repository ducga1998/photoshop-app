import React from 'react';
import styled from 'styled-components';
import ArrowUndoIcon from '../../static/img/ic_edit_area/ic_arrow_undo/ic_arrow_undo.svg';
import ArrowRedoIcon from '../../static/img/ic_edit_area/ic_arrow_redo/ic_arrow_redo.svg';
import BookInactiveIcon from '../../static/img/ic_core/ic_book.component.svg';

import HelpIcon from '../../static/img/ic_edit_area/ic_help/ic_help.svg';
import Grid from '../../static/img/ic_core/grid.component.svg';
import { connect } from 'react-redux';
import { undoableAction } from '../../helpers/undoable';
import imageStoreAction from '../../store/imageStore/actions';
import Responsive from '../Responsive/Responsive';

const Container = styled.div`
  width: 100%;
  height: 65px;
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
  path {
    stroke: white;
  }
  @media (max-width: 1024px) {
    font-size: 0px;
  }
`;
const ButtonMobile = styled.div`
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

  path {
    stroke: white;
  }
  @media (max-width: 1024px) {
    font-size: 0px;
    background: ${props => (props.active ? '#bdbdbd' : '#58595a')};
    border-radius: 8px 8px 0px 0px;
    margin: 5px 10px 0px 0px;
  }
`;

const ButtonIcon = styled.img`
  width: 30px;
  height: 30px;
  margin-bottom: 3px;
  path {
    fill: white;
  }
`;

function EditAreaHeader({
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  saveProject,
  onActive,
  activeViewInMobile,
}) {
  const handleSaveProject = async () => {
    saveProject();
  };
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
      <ButtonGroup>
        <Button onClick={handleSaveProject}>
          <span>Save</span>
        </Button>
        <Button>
          <ButtonIcon src={HelpIcon} alt={''} />
          <span>Help</span>
        </Button>
        <Responsive>
          {({ mobile }) =>
            mobile && (
              <>
                {[
                  { value: 'ViewAllSpread', icon: Grid },
                  { value: 'Spread', icon: BookInactiveIcon },
                ].map((Item, index) => (
                  <ButtonMobile
                    key={String(index)}
                    active={activeViewInMobile === Item.value}
                    onClick={() => onActive(Item.value)}>
                    <Item.icon />
                  </ButtonMobile>
                ))}
              </>
            )
          }
        </Responsive>
      </ButtonGroup>
    </Container>
  );
}

const mapStateToProps = state => {
  return {
    canUndo: state.imageStore.past.length > 0,
    canRedo: state.imageStore.future.length > 0,
    activeViewInMobile: state.imageStore.present.stateMobile.active,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    saveProject: () => dispatch({ type: 'SAVE_PROJECT' }),
    onUndo: () => dispatch(undoableAction.undo()),
    onRedo: () => dispatch(undoableAction.redo()),
    onActive: view =>
      dispatch(imageStoreAction.image.changeViewMobile({ view })),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(EditAreaHeader);
