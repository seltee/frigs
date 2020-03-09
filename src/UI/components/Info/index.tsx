import React, { Component } from "react";
import { Container } from "./style";

interface IInfo {
  children: string;
}

export default (props: IInfo) => {
  return <Container>{props.children}</Container>;
};
