import * as React from 'react';
import { Draggable, DragProvider, Droppable } from './DragContext';

export class Test extends React.PureComponent {
  render() {
    return (
      <DragProvider id={'hello-123'}>
        <div>
          <Box />
        </div>
        <div>
          <Trash item={'item1'} />
          <Trash item={'item2'} />
          <Trash item={'item3'} />
          <Trash item={'item4'} />
        </div>
      </DragProvider>
    );
  }
}

class Box extends React.PureComponent {
  state = {
    clickTime: '',
  };

  mouseUp = () => {
    console.log(this.state.clickTime - new Date());
    if (this.state.clickTime - new Date() > -200) {
      console.log('click');
    }
  };

  render() {
    return (
      <Droppable onDrop={item => console.log('dropped wrapper', item)}>
        {({ isDragOver, isDragging, ...divProps }) => {
          return (
            <div
              style={{
                margin: 10,
                height: 500,
                width: 500,
                background: isDragging ? 'green' : 'grey',
                border: isDragOver ? '1px solid red' : '',
              }}
              {...divProps}>
              <Droppable onDrop={item => console.log('dropped nested', item)}>
                {({ isDragOver, isDragging, ...divProps }) => {
                  return (
                    <Draggable>
                      {props => (
                        <div
                          style={{
                            height: 200,
                            width: 200,
                            background: 'black',
                            border: isDragOver ? '1px solid #03a9f4' : '',
                          }}
                          {...divProps}
                          {...props}
                          onMouseDown={() =>
                            this.setState({ clickTime: +new Date() })
                          }
                          onMouseUp={() => this.mouseUp()}
                        />
                      )}
                    </Draggable>
                  );
                }}
              </Droppable>
            </div>
          );
        }}
      </Droppable>
    );
  }
}

class Trash extends React.PureComponent {
  render() {
    return (
      <Draggable item={{ hello: 'world', name: this.props.item }}>
        {props => (
          <div
            {...props}
            style={{ width: 100, height: 100, background: 'blue', margin: 10 }}
          />
        )}
      </Draggable>
    );
  }
}
