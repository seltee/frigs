import React, { Component } from "react";
import { Container } from "./style";

interface InnerPage {
  children: React.ReactElement | Array<React.ReactElement>;
}

export default (props: InnerPage) => {
  return <Container>{props.children}</Container>;
};
