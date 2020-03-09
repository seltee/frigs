import React, { Component } from "react";
import Popup from "UI/components/Popup";
import Label from "UI/components/Label";
import Input from "UI/components/Input";
import Divider from "UI/components/Divider";
import Button from "UI/components/Button";
import Error from "UI/components/Error";
import SpaceBetween from "UI/Layout/SpaceBetween";
import PageController from "controllers/pageController";
import { Page } from "../../../controllers/pageController";
import PlayerController from "controllers/PlayerController";
import { useController } from "../../utils/hooks";

interface ILoginPage {}

export default (props: ILoginPage) => {
  const [login, setLogin] = React.useState("");
  const [password, setPassword] = React.useState("");

  useController(PlayerController);

  return (

      <Popup
        after={
          PlayerController.loginError ? (
            <React.Fragment>
              <Divider />
              <Error>{PlayerController.loginError}</Error>
            </React.Fragment>
          ) : null
        }
      >
        <Label>Login(e-mail)</Label>
        <Input onChange={setLogin} type="email" />
        <Divider />
        <Label>Password</Label>
        <Input onChange={setPassword} type="password" />
        <Divider />
        <SpaceBetween>
          <Button onPress={() => PlayerController.doAuth(login, password)}>Sign in</Button>
          <Button onPress={() => PageController.goTo(Page.PageRegistration)}>Registration</Button>
        </SpaceBetween>
      </Popup>

  );
};
