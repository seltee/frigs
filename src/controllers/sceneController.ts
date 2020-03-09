import Controller from "./controller";
import DeviceController from "./deviceController";
import * as BABYLON from "babylonjs";
import PlayerController from "controllers/PlayerController";
import Event from "./utils/event";
import ModelController, { Model } from "controllers/modelController";
import FleetScene from "controllers/scenes/fleetScene";
import Scene from './scenes/scene';

const fregatePositions = [new BABYLON.Vector3(60, 0, 30), new BABYLON.Vector3(-60, 0, 30)];
const selectTint = new BABYLON.Color3(252 / 255, 219 / 255, 3 / 255);
const systemTint = new BABYLON.Color3(0.1, 0.1, 0.15);

class SceneController extends Controller {
  private _currentScene: Scene;

  public init() {
    FleetScene.init();
    this._currentScene = FleetScene;
  }

  public render() {
    if (this._currentScene) {
      this._currentScene.render();
    }
  }
}

export default new SceneController();
