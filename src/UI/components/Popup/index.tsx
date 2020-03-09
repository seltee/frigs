import React, { Component } from "react";
import { Container, Block, AfterBlock } from "./style";

interface IPopup {
  children: any;
  after?: any;
}

export default (props: IPopup) => {
  return (
    <Container>
      <Block>
        {props.children}
        <AfterBlock>{props.after}</AfterBlock>
      </Block>
    </Container>
  );
};
