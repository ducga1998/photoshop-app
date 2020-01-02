import Media from 'react-media';
import React from 'react';

const Responsive = props => {
  return (
    <Media
      defaultMatches={{ desktop: true, mobile: false }}
      queries={{
        desktop: '(min-width: 992px)',
        mobile: '(max-width: 991px)',
      }}>
      {matches => props.children(matches)}
    </Media>
  );
};

export default Responsive;
