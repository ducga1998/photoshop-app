import React from 'react';

export function withLayout(Component, options) {
  return class extends React.PureComponent {
    render() {
      return (
        <div>
          <Component {...this.props}/>
        </div>
      );
    }
  };
}
