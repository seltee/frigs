import React, { Component } from "react";
import { Container } from "./style";

interface ILabel{
  children: string;
}

export default (props:ILabel) => {
return <Container>{props.children}</Container>
}
