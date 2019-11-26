import * as React from 'react';

const DragContext = React.createContext({
  id: '',
  isDragging: false,
});

const withDragProps = C => {
  return class DragWithProps extends React.PureComponent {
    render() {
      return (
        <DragContext.Consumer>
          {dragProps => <C {...dragProps} {...this.props} />}
        </DragContext.Consumer>
      );
    }
  };
};

export class DragProvider extends React.Component {
  state = {
    isDragging: false,
    draggingItem: null,
    id: this.props.id || '__dragable_id',
    draggingType: null,
  };

  setValue = (key, value, callback) => {
    return this.setState({ [key]: value }, callback);
  };

  render() {
    return (
      <DragContext.Provider value={{ ...this.state, setValue: this.setValue }}>
        {this.props.children}
      </DragContext.Provider>
    );
  }
}

export const Draggable = withDragProps(
  class Drag extends React.PureComponent {
    handleDragStart = () => {
      this.props.setValue('isDragging', true);
      this.props.setValue('draggingItem', this.props.item);
      this.props.setValue('draggingType', this.props.type);
    };

    handleDragStop = () => {
      this.props.setValue('isDragging', false);
      this.props.setValue('draggingItem', null);
      this.props.setValue('draggingType', null);
    };

    render() {
      return this.props.children({
        draggable: true,
        onDragStart: this.handleDragStart,
        onDragEnd: this.handleDragStop,
      });
    }
  },
);

class Drop extends React.PureComponent {
  state = {
    isDragOver: false,
  };

  onDragOver = e => {
    e.preventDefault();
    e.stopPropagation();
    if (
      this.props.isDragging &&
      (!this.props.acceptType ||
        this.props.acceptType === this.props.draggingType)
    ) {
      this.setState({ isDragOver: true });
    } else {
      this.setState({ isDragOver: false });
    }
  };

  onDragLeave = e => {
    console.log('leave', e.target);
    e.stopPropagation();
    this.setState({ isDragOver: false });
  };

  onDrop = e => {
    e.stopPropagation();
    if (
      this.props.isDragging &&
      (!this.props.acceptType ||
        this.props.acceptType === this.props.draggingType)
    ) {
      this.props.onDrop(this.props.draggingItem);
      this.setState({ isDragOver: false });
    }
  };

  render() {
    return this.props.children({
      onDragOver: this.onDragOver,
      onDrop: this.onDrop,
      onDragLeave: this.onDragLeave,
      isDragOver: this.state.isDragOver,
      isDragging:
        this.props.isDragging &&
        (!this.props.acceptType ||
          this.props.acceptType === this.props.draggingType),
    });
  }
}

export const Droppable = withDragProps(Drop);
