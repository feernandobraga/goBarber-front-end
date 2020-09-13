import styled, { keyframes } from "styled-components";

import { shade } from "polished";

import signUpBackgrounImg from "../../assets/sign-up-background.png";

export const Container = styled.div`
  height: 100vh;
  display: flex;
  align-items: stretch;
`; /* end Container */

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  place-content: center;
  align-items: center;
  width: 100%;
  max-width: 800px;
`; /* end Content */

const appearFromRight = keyframes`
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0px);
  }
`;

export const AnimationContainer = styled.div`
  display: flex;
  flex-direction: column;
  place-content: center;
  align-items: center;

  animation: ${appearFromRight} 1s;

  form {
    margin: 80px 0;
    width: 340px;
    text-align: center;

    h1 {
      margin-bottom: 24px;
    }

    a {
      color: #f4ede8;
      display: block;
      text-decoration: none;
      margin-top: 24px;
      transition: color 0.2s;

      &:hover {
        color: ${shade(0.2, "#f4ede8")};
      }
    }
  }
  /*  targets only anchors where the parent is directly the content. Therefore, it won't target the previous anchor */
  > a {
    color: #ff9000;
    display: flex;
    align-items: center;

    text-decoration: none;
    margin-top: 24px;
    transition: color 0.2s;

    &:hover {
      color: ${shade(0.2, "#ff9000")};
    }

    svg {
      margin-right: 16px;
    }
  }
`; // end content

export const Background = styled.div`
  flex: 1;
  background: url(${signUpBackgrounImg}) no-repeat center;
  background-size: cover;
`; /* end Background */
