import React, { Component } from "react";
import { Container } from "./style";

interface IError {
  children: string;
}

export default (props: IError) => {
  return <Container>{props.children}</Container>;
};
