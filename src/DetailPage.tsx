import React, { useEffect } from 'react';
import { useParams } from "react-router-dom";
import styled from "styled-components";
import gsap, { TimelineMax } from "gsap";

const PageContainer = styled.div`
  width: 100vw;
  background-color: rgb(0,0,255);
  
  #wave01 {
    top: 4px;
    position: relative;
  }
`

const DetailPage = () => {
  const {id} = useParams();
  useEffect(() => {
    const tl = gsap.timeline();
    tl.to('#slidedown-container', 2, {
      height: '100vh',
      backgroundColor: 'rgb(0,0,255)',
    });
    tl.to('#slidedown-container',{
      height: 0,
      backgroundColor: '#ffffff',
    });

    const waves = new TimelineMax()
      .to('#wave01', 2,{ morphSVG:"#wave02", repeat:-1, yoyo:true} )

  }, []);
  return (
    <PageContainer id="page-container">
      {/*hello world {id}*/}
      <div id="slidedown-container"></div>
      <svg id="wave01" viewBox="0 -20 700 110" width="100%" height="110" preserveAspectRatio="none">
        <g fill="blue">
          <path transform="translate(0, -20)" d="M0,10 c80,-22 240,0 350,18 c90,17 260,7.5 350,-20 v50 h-700" fill="#ffffff" />
          <path d="M0,10 c80,-18 230,-12 350,7 c80,13 260,17 350,-5 v100 h-700z" fill="#ffffff" />
        </g>
      </svg>
    </PageContainer>
  );
};

export default DetailPage;
