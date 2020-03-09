import React, { Component } from "react";
import { Container } from "./style";

interface IButton {
  children: string;
  onPress?: () => void;
}

export default (props: IButton) => {
  return <Container onClick={props.onPress}>{props.children}</Container>;
};
