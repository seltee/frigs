import React, { Component } from "react";
import { Container } from "./style";

interface ISpaceBetween {
  children: any;
}

export default (props: ISpaceBetween) => {
  return <Container>{props.children}</Container>;
};
