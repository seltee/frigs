import React, { Component } from "react";
import PageController, { Page } from "controllers/pageController";
import LoginPage from "UI/Layout/LoginPage";
import RegistrationPage from "./RegistrationPage";
import { useController } from "../utils/hooks";
import FleetPage from "./FleetPage";

interface ILayout {}

export default (props: ILayout) => {
  useController(PageController);

  if (PageController.currentPage == Page.PageLogin) {
    return <LoginPage />;
  }

  if (PageController.currentPage == Page.PageRegistration) {
    return <RegistrationPage />;
  }

  if (PageController.currentPage == Page.PageFleet) {
    return <FleetPage />;
  }

  return null;
};
