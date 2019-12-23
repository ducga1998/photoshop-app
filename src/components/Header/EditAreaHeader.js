import React from 'react';
import styled from 'styled-components';
import ArrowUndoIcon from '../../static/img/ic_edit_area/ic_arrow_undo/ic_arrow_undo.svg';
import ArrowRedoIcon from '../../static/img/ic_edit_area/ic_arrow_redo/ic_arrow_redo.svg';
import HelpIcon from '../../static/img/ic_edit_area/ic_help/ic_help.svg';
import { connect } from 'react-redux';
import authorizedRequest from '../../helpers/request/authorizedRequest';
import { idProject } from '../../store/imageStore/saga';
import config from '../../config';
import { toast } from 'react-toastify';
import { undoableAction } from '../../helpers/undoable';

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

function EditAreaHeader({ canUndo, canRedo, onUndo, onRedo, initImageState }) {
  const handleSaveProject = async () => {
    console.log('initImageState', initImageState);
    const rawData = initImageState.map(imgState => {
      return {
        assets: imgState.assets,
      };
    });
    const rawDataSendServer = {
      photobook: {
        coverid: '20171212_145352.jpg',
        pagespreads: rawData,
      },
    };
    const respond = await authorizedRequest.put(
      config.BASE_URL_REQUEST + idProject,
      {
        layout: rawDataSendServer,
      },
    );
    if (respond.layout) {
      if (process.browser) {
        localStorage.setItem('pwa-store', '');
      }
      toast.success('Save Success');
    } else {
      toast.error('Save False');
    }
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
      </ButtonGroup>
    </Container>
  );
}

const mapStateToProps = state => {
  return {
    canUndo: state.imageStore.past.length > 0,
    canRedo: state.imageStore.future.length > 0,
    initImageState: state.imageStore.present.initImageState,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onUndo: () => dispatch(undoableAction.undo()),
    onRedo: () => dispatch(undoableAction.redo()),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(EditAreaHeader);
