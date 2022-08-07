import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { throttle } from 'lodash';
import './App.css';
import MapContainer from './MapContainer';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import DetailPage from "./DetailPage";

const droneStartMotion = process.env.PUBLIC_URL + '/drone_150_start.gif';
const droneLoopMotion = process.env.PUBLIC_URL + '/drone_150_loop.gif';

function App() {
  const droneRef = useRef<HTMLImageElement>(null);
  const [droneMotion, setDroneMotion] = useState<string>(droneLoopMotion);

  function handleMouseMove(evt: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    const x = -(window.innerWidth / 2 - evt.pageX) / 55;
    const y = -(window.innerHeight / 2 - evt.pageX) / 45;
    const radian = Math.atan2(evt.pageX - x, evt.pageY - y);
    const rot = radian * ((90 / Math.PI) * -1 + 35);

    if (!droneRef || !droneRef.current) return;
    droneRef.current.style.transform = `rotate(${
      (x + y >= 10 ? -420 / (x + y) : -45) + rot
    }deg) translateX(${x}px) translateY(${x + y >= 10 ? -y + 10 : y}px)`;
  }

  return (
    <div
      className="App"
      style={{ minHeight: '100vh' }}
      onMouseMove={throttle(
        (evt: React.MouseEvent<HTMLDivElement, MouseEvent>) =>
          handleMouseMove(evt),
        50,
      )}
    >
      <HeaderContainer>
        <Header>Trip Activity</Header>
      </HeaderContainer>
      <DroneFAB
        ref={droneRef}
        src={droneMotion}
        alt="drone FAB"
        onMouseEnter={() => setDroneMotion(droneStartMotion)}
        onMouseLeave={() => setDroneMotion(droneLoopMotion)}
      />
      <Router>
        <Routes>
          <Route path="/" element={<MapContainer />} />
          <Route path="/detail/:id" element={<DetailPage />} />
        </Routes>
      </Router>
    </div>
  );
}

const HeaderContainer = styled.div`
  transform: skewY(-8deg);
  background: linear-gradient(
    109.6deg,
    rgb(116, 255, 217) 11.2%,
    rgb(88, 200, 223) 91.1%
  );
  box-shadow: #0bc 0px 0px 6px;
`;

const Header = styled.h1`
  text-transform: uppercase;
  font-size: 72px;
  padding: 30px;
  text-shadow: -15px 5px 20px #ced0d3;
  color: white;
`;

const DroneFAB = styled.img`
  position: fixed;
  right: 10px;
  bottom: 0px;
  z-index: 9;
  transition: 0.2s;
`;

export default App;
