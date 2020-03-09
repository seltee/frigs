import React, { Component } from "react";
import { Container } from "./style";

interface IPanel {
  children: any;
  after?: any;
}

export default (props: IPanel) => {
  return (
    <Container>
      {props.children}
    </Container>
  );
};
