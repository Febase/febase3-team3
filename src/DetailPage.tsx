import React from 'react';
import { useParams } from "react-router-dom";
import styled from "styled-components";

const PageContainer = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: rgb(0,0,255);
`

const DetailPage = () => {
  const {id} = useParams();

  return (
    <PageContainer id="page-container">
      hello world {id}
    </PageContainer>
  );
};

export default DetailPage;
