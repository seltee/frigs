import React, { Component } from "react";
import { Container } from "./style";

interface IInput {
  value?: string;
  onChange: (val: string) => void;
  type?:string;
}

export default (props: IInput) => {
  const onChange = e => {
    props.onChange(e.target.value);
  };
  return <Container value={props.value} onChange={onChange} type={props.type}/>;
};
