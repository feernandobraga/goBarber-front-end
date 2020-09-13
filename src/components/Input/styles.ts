import styled, { css } from "styled-components";

import Tooltip from "../Tooltip";

interface ContainerProps {
  isFocused: boolean;
  isFilled: boolean;
  isErrored: boolean;
}

export const Container = styled.div<ContainerProps>`
  background: #232129;
  border-radius: 10px;
  border: 2px solid #232129;
  padding: 16px;
  width: 100%;
  color: #666360;
  display: flex;
  align-items: center;

  /* every div that is preceded by another div, will get a margin top 8px */
  & + div {
    margin-top: 8px;
  }

  /* get the value of props. If props.isFilled = true, then execute the css */
  ${(props) =>
    props.isErrored &&
    css`
      border-color: #c53030;
    `}


  /* get value of props. If props.isFocused = true, then add css */
  ${(props) =>
    props.isFocused &&
    css`
      color: #ff9000;
      border-color: #ff9000;
    `}

  /* get the value of props. If props.isFilled = true, then execute the css */
  ${(props) =>
    props.isFilled &&
    css`
      color: #ff9000;
    `}
  

  input {
    flex:1;
    background: transparent;
    border: 0;
    color: #f4ede8;

    &::placeholder {
      color: #666360;
    }
  } /* end input */

  svg {
    margin-right: 16px;
  }
`;

export const Error = styled(Tooltip)`
  height: 20px;
  margin-left: 16px;
  svg {
    margin: 0;
  }

  span {
    background: #c53030;
    color: #fff;

    &::before {
      border-color: #c53030 transparent;
    }
  }
`;
