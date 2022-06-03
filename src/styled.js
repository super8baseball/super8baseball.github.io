import styled from 'styled-components';

export const StyledApp = styled.div`
  padding: 0 0 3% 0;
  .header {
    position: relative;
    img {
      object-position: center;
      object-fit: cover;
      width: 100%;
      height: 480px;
      max-height: 33vw;
    }
    .mask {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      background-color: black;
      opacity: 0.3;
    }
    .wrapper {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: #f2f2f2;
      h1 {
        font-size: 3rem;
        margin: 0.5rem;
      }
      h3 {
        font-size: 1.5rem;
        margin: 0.5rem;
      }
    }
  }
  .content {
    padding: 2% 5%;
    margin: 0 auto;
    width: 90%;
    max-width: 980px;
  }
`;

export const StyledGame = styled.div`
  p {
    font-size: 18px;
    margin: 5px 0;
  }
  .snapshot {
    cursor: pointer;
    width: 100%;
    margin: 10px 0;
  }
`;

export const StyledTable = styled.div`
  overflow-x: auto;
  .title {
    font-size: 24px;
    margin: 10px 0 2px;
  }
  table {
    border: 1px solid lightgray;
  }

  tbody {
    border-bottom: 1px solid lightgray;
  }

  th {
    border-bottom: 1px solid lightgray;
  }

  th,
  td {
    text-align: center;
    white-space: nowrap;
    padding: 6px 10px;
  }
`;
