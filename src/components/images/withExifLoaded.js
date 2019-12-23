import { getOrientation } from '../../helpers/exifOrientation';
import React from 'react';

export default function(C) {
  return props => {
    const [isFetched, setIsFetched] = React.useState(false);

    React.useEffect(() => {
      getOrientation(props.src || props.item.src)
        .then(() => {
          setIsFetched(true);
        })
        .catch(e => {
          setIsFetched(true);
        });
    }, [props.src, props.item.src]);
    return !isFetched ? null : <C {...props} key={props.item.src} />;
  };
}
