import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';


const TrackingTooltip = (props) => {
    const { position, ...rest } = props;
    // const [position, setPosition] = React.useState({ x: undefined, y: undefined });
    // console.log(position);
    return (
        <Tooltip
         onMouseMove={e => {
             setPosition({ x: e.pageX, y: e.pageY });
             // console.log("oi " + position);
         }}
         PopperProps={{
           anchorEl: {
             clientHeight: 0,
             clientWidth: 0,
             getBoundingClientRect: () => ({
               top: position.y,
               left: position.x,
               right: position.x,
               bottom: position.y,
               width: 0,
               height: 0,
             })
           }
         }}
         {...rest}
       >
       {props.children}
       </Tooltip>
   );
};

/*
import * as React from 'react';
import Box from '@material-ui/core/Box';
import Tooltip from '@material-ui/core/Tooltip';
import PopperJs from 'popper.js';

function TrackingTooltip() {
  const positionRef = React.useRef({
    x: 0,
    y: 0,
  });
  const popperRef = React.useRef(null);
  const areaRef = React.useRef<HTMLDivElement>(null);

  const handleMouseMove = (event) => { // (event: React.MouseEvent) => {
    positionRef.current = { x: event.clientX, y: event.clientY };

    if (popperRef.current != null) {
      popperRef.current.scheduleUpdate();
    }
  };

  return (
    <Tooltip
      title="Add"
      placement="top"
      arrow
      PopperProps={{
        popperRef,
        anchorEl: {
          clientHeight: 0,
          clientWidth: 0,
          getBoundingClientRect: () => ({
            top: areaRef.current?.getBoundingClientRect().top ?? 0,
            left: positionRef.current.x,
            right: positionRef.current.x,
            bottom: areaRef.current?.getBoundingClientRect().bottom ?? 0,
            width: 0,
            height: 0,
          }),
        },
      }}
    >
      <div ref={areaRef}>
        <Box
          onMouseMove={handleMouseMove}
          p={2}
          border={1}
          borderColor="text.secondary"
        >
          Tooltip area
        </Box>
      </div>
    </Tooltip>
  );
}
*/

export default TrackingTooltip;
