import React from 'react';
import styled from 'styled-components';
import { List, AutoSizer } from 'react-virtualized';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';

import ArrowBackIcon from '../../static/img/ic_menu_left/ic_arrow_back/ic_arrow_back.svg';
import TrashIcon from '../../static/img/ic_book_spreads/ic_trash/ic_trash.svg';
import TriangleActiveIcon from '../../static/img/ic_book_spreads/ic_triangle/ic_triangle_active.svg';
import TriangleInactiveIcon from '../../static/img/ic_book_spreads/ic_triangle/ic_triangle_inactive.svg';
import { connect, useSelector } from 'react-redux';
import Frame from '../frame/Frame';
import { convertProportionToPx } from '../../helpers/utils';
import ImageCorePreview from '../Images/ImageCorePreview';
import imageCropAction from '../../store/imageStore/actions';

const Container = styled.div`
  position: relative;
  width: ${props => (props.show ? 300 : 0)}px;
  height: calc(100vh - 70px);
  background-color: #f4f4f4;
  transition: ${props => (props.show ? '0.3s ease-in-out 0.3s' : '0.3s')};
`;

const BookContainer = styled.div`
  padding: 0px 20px 20px;
`;

const ElementGroup = styled.div`
  width: ${props => (props.show ? 300 : 0)}px;
  overflow: hidden;
  opacity: ${props => (props.show ? 1 : 0)};
  transition: ${props =>
    props.show ? 'opacity 0.3s ease-in-out 0.6s' : 'none'};
`;

const BookWrapper = styled.div`
  margin: 30px 15px 0px;
  position: relative;
  height: calc(100vh - 100px);

  .ReactVirtualized__Grid.ReactVirtualized__List {
    ::-webkit-scrollbar {
      width: 4px;
    }

    ::-webkit-scrollbar-track {
      background: transparent;
    }

    ::-webkit-scrollbar-thumb {
      background: #bdbdbd;
      border-radius: 8px;
    }
  }
`;

const Book = styled.div`
  display: flex;
  flex-direction: column;
`;

const CoverContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin-bottom: 10px;
  background-color: transparent;
  box-sizing: border-box;
  border: ${props =>
    props.selected ? 'solid 3px #494b4d;' : 'solid 3px transparent;'};
  cursor: pointer;
`;

const BookOption = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  font-size: 14px;
  color: #4f4f4f;
`;

const ButtonDelete = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 2px;
  background-color: #919699;
  cursor: pointer;

  &:hover {
    background-color: #b06ab3;
  }
`;

const ButtonDeleteIcon = styled.img`
  width: 20px;
  height: 20px;
`;

const ButtonAdd = styled.div`
  display: flex;
  align-items: center;
  width: 25px;
  height: 40px;
  margin-top: 5px;
  background-image: url(${TriangleInactiveIcon});
  background-size: 25px 40px;
  background-position: center center;
  background-repeat: no-repeat;
  color: #fff;
  cursor: pointer;

  &:hover {
    background-image: url(${TriangleActiveIcon});
  }

  span {
    padding-left: 5px;
  }
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

const SortableItem = SortableElement(
  ({ item, setSpread, style, key, _index, removeSpread }) => {
    const spread = useSelector(
      store =>
        store.imageStore.present.spread ||
        store.imageStore.present.initImageState[0].idPage,
    );
    return (
      <Book key={item.idPage} style={style}>
        <CoverContainer
          key={item.id}
          selected={item.idPage === spread}
          onClick={() => {
            setSpread(item);
          }}>
          <Frame data={{ frameSize: { width: 220, height: 110 } }}>
            {({ width, height }) => {
              return item.assets.map((item, index) => {
                const { targetrect } = item;
                const rect = convertProportionToPx(targetrect, {
                  frameWidth: width,
                  frameHeight: height,
                });
                return (
                  <ImageCorePreview
                    key={item.idElement}
                    item={item}
                    rect={rect}
                    editable={false}
                  />
                );
              });
            }}
          </Frame>
        </CoverContainer>
        <BookOption>
          <span>{_index * 2 || ''}</span>
          <ButtonDelete
            onClick={e => {
              e.stopPropagation();
              removeSpread(_index);
            }}>
            <ButtonDeleteIcon src={TrashIcon} alt={''} />
          </ButtonDelete>
          <span>{_index * 2 + 1 || ''}</span>
        </BookOption>
        <ButtonAdd>
          <span>+</span>
        </ButtonAdd>
      </Book>
    );
  },
);

const SortableList = SortableContainer(
  ({ height, width, image, renderRow }) => {
    return (
      <List
        height={height}
        rowCount={image.length}
        rowHeight={215}
        rowRenderer={renderRow}
        width={width}
        style={{ outline: 'none' }}
      />
    );
  },
);

function BookSpreads({
  show,
  hidden,
  image,
  setSpread,
  changeOrderSpread,
  removeSpread,
  spread,
}) {
  const renderRow = React.useCallback(
    ({ index, key, style }) => {
      const item = image[index];
      return (
        <SortableItem
          index={index}
          _index={index}
          item={item}
          style={style}
          setSpread={setSpread}
          removeSpread={removeSpread}
          key={item.idPage}
        />
      );
    },
    [image, setSpread, removeSpread],
  );

  const renderList = React.useCallback(() => {
    return (
      <AutoSizer>
        {({ width, height }) => {
          return (
            <SortableList
              pressDelay={200}
              pressThreshold={20}
              width={width}
              height={height}
              image={image}
              renderRow={renderRow}
              onSortStart={e => console.log(e)}
              onSortEnd={({ oldIndex, newIndex }) =>
                changeOrderSpread(oldIndex, newIndex)
              }
            />
          );
        }}
      </AutoSizer>
    );
  }, [image, renderRow, changeOrderSpread]);

  return (
    <Container show={show}>
      <ButtonBack show={show} onClick={hidden}>
        <ButtonBackIcon src={ArrowBackIcon} alt={''} />
      </ButtonBack>
      <ElementGroup show={show}>
        <BookWrapper>
          <BookContainer style={{ flex: 1, height: '100%' }}>
            {renderList()}
          </BookContainer>
        </BookWrapper>
      </ElementGroup>
    </Container>
  );
}

const mapStateToProps = state => {
  return {
    image: state.imageStore.present.initImageState,
    spread: state.imageStore.present.spread,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    changeOrderSpread: (oldIndex, newIndex) =>
      dispatch(imageCropAction.image.reorderSpread({ oldIndex, newIndex })),
    removeSpread: index =>
      dispatch(imageCropAction.image.removeSpread({ index })),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BookSpreads);
