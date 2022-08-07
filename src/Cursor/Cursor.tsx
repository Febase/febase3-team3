import React, { MouseEvent, useEffect } from 'react';
import { useState } from 'react';

import useMouse from '@react-hook/mouse-position';
import { motion, useTransform } from 'framer-motion';

import './Cursor.css';

type Prop = {
  children?: React.ReactNode;
};

function Cursor(prop: Prop) {
  // const [cursorText, setCursorText] = useState('');
  const [cursorVariant, setCursorVariant] = useState('default');

  const ref = React.useRef(null);
  const mouse = useMouse(ref, {
    enterDelay: 100,
    leaveDelay: 100,
  });

  const [defaultMouse, setDefaultMouse] = useState({ x: 0, y: 0 });
  function updateMouse(evt: globalThis.MouseEvent) {
    setDefaultMouse({ x: evt.clientX - 50, y: evt.clientY - 50 });
  }

  useEffect(() => {
    document.addEventListener('mousemove', updateMouse);
    return () => {
      document.removeEventListener('mousemove', updateMouse);
    };
  });

  let mouseXPosition = 0;
  let mouseYPosition = 0;

  if (mouse.x !== null) {
    mouseXPosition = mouse.clientX || defaultMouse.x;
  } else mouseXPosition = defaultMouse.x;

  if (mouse.y !== null) {
    mouseYPosition = mouse.clientY || defaultMouse.y;
  } else mouseYPosition = defaultMouse.y;

  const variants = {
    default: {
      opacity: 1,
      height: 100,
      width: 100,
      fontSize: '16px',
      x: mouseXPosition,
      y: mouseYPosition,
      transition: {
        type: 'spring',
        mass: 0.6,
      },
    },
    rect: {
      borderRadius: 0,
      opacity: 1,
      background: 'transparent',
      border: '5px solid black',
      height: '100px',
      width: '100px',
      x: mouseXPosition - 50,
      y: mouseYPosition - 50,
    },
  };

  const spring = {
    type: 'spring',
    stiffness: 500,
    damping: 28,
  };

  const [defaultCursor, setDefaultCursor] = useState(true);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function itemEnter(event: MouseEvent<HTMLDivElement>) {
    setCursorVariant('rect');
    setDefaultCursor(false);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function itemLeave(event: MouseEvent<HTMLDivElement>) {
    setCursorVariant('default');
    setDefaultCursor(true);
  }

  return (
    <div>
      <motion.div
        variants={variants}
        className="circle"
        animate={cursorVariant}
        transition={spring}
      >
        {defaultCursor && <span className="cursorText" />}
      </motion.div>

      <div className="container" ref={ref}>
        <div className="item" onMouseEnter={itemEnter} onMouseLeave={itemLeave}>
          {prop.children && prop.children}
        </div>
      </div>
    </div>
  );
}

export default Cursor;
