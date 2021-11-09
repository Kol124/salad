import React from 'react'
import { createGlobalStyle } from 'styled-components'
//import theme from '../../../../../../../../vWindows.old.000/Users/23480/Desktop/STUFF/Everything web/Web development/Work space/NEW/Firebase-app/frontend/small-talk/src/util/theme';

export const GlobalStyles = createGlobalStyle`
*,
*::before,
*::after {
  box-sizing: border-box;
  transition:background-color .5s ease-in;
}

body {
  background-color: ${({theme})=>theme.bodyBackground};
}

main {
  width: 50%;
  margin-top: 75px;
  @media (min-width: 630px) and (max-width: 905px) {
    width: 65% !important;
    margin-left: 30%;
  }
  @media (max-width: 630px) {
    width: 100%;
    margin-left: 0;
    margin-top: 120px;
    margin-bottom: 50px;
  }
}

.section-container {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}
`
