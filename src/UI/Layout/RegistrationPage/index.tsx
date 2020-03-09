import React, { Component } from "react";
import Popup from "UI/components/Popup";
import Label from "UI/components/Label";
import Input from "UI/components/Input";
import Divider from "UI/components/Divider";
import Button from "UI/components/Button";
import Info from "UI/components/Info";
import SpaceBetween from "../SpaceBetween";
import PageController from "controllers/pageController";
import { Page } from "controllers/pageController";
import PlayerController from 'controllers/PlayerController';

interface ILoginPage {}

export default (props: ILoginPage) => {
  const [email, setEmail] = React.useState("");
  const [registrationSent, setRegistrationSent] = React.useState(false);

  return (
    <div>
      {registrationSent ? (
        <Popup>
          <Info>Enter the game by link, sent to your e-mail</Info>
        </Popup>
      ) : (
        <Popup>
          <Label>E-Mail</Label>
          <Input onChange={setEmail} type="email" />
          <Divider />
          <SpaceBetween>
            <Button onPress={() => PlayerController.doRegistration(email)}>Do registration</Button>
            <Button onPress={() => PageController.goTo(Page.PageLogin)}>Go back</Button>
          </SpaceBetween>
        </Popup>
      )}
    </div>
  );
};
