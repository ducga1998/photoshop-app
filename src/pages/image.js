import * as React from 'react';
import ImageView from '../components/images/ImageView';
import Frame from '../components/frame/Frame';
import { connect } from 'react-redux';

class Image extends React.PureComponent {
  render() {
    return (
      <div style={{ display: 'flex' }}>
        <div style={{ flex: 1 }}>
          <Frame data={{ frameSize: { height: 900, width: 900 } }}>
            {({ width, height }) => {
              return (
                <ImageView
                  frameHeight={height}
                  frameWidth={width}
                  id={this.props.id}
                />
              );
            }}
          </Frame>
        </div>
      </div>
    );
  }
}

export default connect()(Image);
