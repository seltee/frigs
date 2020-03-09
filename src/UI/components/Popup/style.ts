import styled from "styled-components";

export const Container = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  vertical-align: middle;
  text-align: center;
  white-space: nowrap;

  :before {
    content: "";
    display: inline-block;
    height: 100%;
    vertical-align: middle;
  }
`;

export const Block = styled.div`
  display: block;
  width: 90%;
  max-width: 520px;
  min-width: 300px;
  background: rgba(181, 179, 198, 0.7);
  background: linear-gradient(
    138deg,
    rgba(181, 179, 198, 0.7) 0%,
    rgba(188, 188, 224, 0.7) 43%,
    rgba(150, 186, 232, 0.7) 100%
  );
  padding: 16px;
  display: inline-block;
  vertical-align: middle;
  border-radius: 8px;
  margin: 64px 0;
`;

export const AfterBlock = styled.div`
  position: absolute;
  width: 90%;
  max-width: 520px;
  min-width: 300px;
`;
