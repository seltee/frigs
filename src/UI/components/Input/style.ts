import styled from "styled-components";

export const Container = styled.input`
  text-align: left;

  background: none;
  border: none;
  font-size: 24px;

  color: #2a2a2a;
  padding: 2px 0;
  width: 100%;
  outline: none;
  border-bottom: 1px solid #2a2a2a;

  :-webkit-autofill,
  :-webkit-autofill:hover,
  :-webkit-autofill:focus,
  :-webkit-autofill:active {
    transition: background-color 500000000s ease-in-out 0s !important;
    font-size: 24px !important;
    color: #2a2a2a !important;
  }

  :-internal-autofill-previewed {
    font-size: 24px !important;
    color: #2a2a2a !important;
  }

  :-internal-autofill-selected {
    background-color: rgba(0, 0, 0, 0) !important;
    background-image: none !important;
    color: #2a2a2a !important;
    font-size: 24px !important;
  }
`;

