import React, { Component } from "react";
import { Container, Name, Value } from "./style";

interface ICondition {
  name?: string;
  isValid?: boolean;
  children?: string;
}

export default (props: ICondition) => {
  return <Container>
    <Name>{props.name}</Name>
    <Value isValid={props.isValid}>{props.children}</Value>
  </Container>;
};
