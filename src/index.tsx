import React, { Component } from "react";
import ReactDOM from "react-dom";
import GameLoopController from "controllers/gameLoopController";
import DeviceController from "controllers/deviceController";
import SceneController from "controllers/sceneController";
import PlayerController from "controllers/PlayerController";
import Layout from "UI/Layout";

// Device information
DeviceController.init();

// 3d Scenes
SceneController.init();

// Main game/logic loop
GameLoopController.init();

ReactDOM.render(<Layout />, document.getElementById("app-ui"));
