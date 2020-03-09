import styled from "styled-components";

interface IValue {
  isValid: boolean;
}

export const Container = styled.div`
  height: 32px;
  width: 100%;
  color: #4a4a4a;
`;

export const Name = styled.div`
  font-size: 20px;
  float: left;
`;

export const Value = styled.div`
  font-size: 20px;
  color: ${(props: IValue) => (props.isValid ? "#89e851" : "#ffd700")};
  float: right;
`;
