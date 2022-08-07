import React, { useEffect } from 'react';
import { useParams } from "react-router-dom";
import styled from "styled-components";
import gsap from "gsap";

const PageContainer = styled.div`
  width: 100vw;
  background-color: rgb(0,0,255);
  z-index: 20;
  
  #wave01 {
    top: 4px;
    position: relative;
  }
  
  #slidedown-container {
    z-index: 20;
  }
  
  #spot-container {
    display: flex;
    padding: 50px;
    position: absolute;
    z-index: 5;
    
    img {
      width: 600px;
      height: 400px;
      margin-right: 50px;
    }
  }
`

const DetailPage = () => {
  const {id} = useParams();
  useEffect(() => {
    const tl = gsap.timeline();
    tl.to('#spot-container', {
      display: 'none'
    })
    tl.to('#slidedown-container', 2, {
      height: '100vh',
      backgroundColor: 'rgb(0,0,255)',
    });
    tl.to('#slidedown-container',{
      height: 0,
      backgroundColor: '#ffffff',
    });
    tl.to('#spot-container', {
      display: 'flex'
    })

  }, []);
  return (
    <PageContainer id="page-container">
      {/*hello world {id}*/}
      <div id="spot-container">
        <img id="spot-image" src="https://ko.parisinfo.com/var/otcp/sites/images/node_43/node_51/node_230/vue-a%C3%A9rienne-paris-tour-eiffel-coucher-de-soleil-%7C-630x405-%7C-%C2%A9-fotolia/19544352-1-fre-FR/Vue-a%C3%A9rienne-Paris-Tour-Eiffel-coucher-de-soleil-%7C-630x405-%7C-%C2%A9-Fotolia.jpg"/>
        <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
      </div>
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
