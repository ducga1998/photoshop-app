import React from 'react';
import { isClientSide } from '../helpers/render.helper';

export function useWindowWidth() {
  const [width, setWidth] = React.useState(
    isClientSide() ? window.screen.width : 400,
  );
  React.useEffect(() => {
    setWidth(window.screen.width);
    console.log('set width for rerender');
    if (!isClientSide()) return;
    const onResize = () => {
      setWidth(window.screen.width);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return width;
}
