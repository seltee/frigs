import Controller from "./controller";
import * as BABYLON from "babylonjs";

class DeviceController extends Controller {
  private _canvas: HTMLCanvasElement;
  private _engine: BABYLON.Engine;
  private _mouseX: number;
  private _mouseY: number;
  private _mouseClick: boolean;
  private _mouseDown: boolean;

  public init() {
    this._canvas = document.getElementById("app-game") as HTMLCanvasElement;
    this._engine = new BABYLON.Engine(this._canvas, true);
    this._engine.setHardwareScalingLevel(1 / window.devicePixelRatio);

    window.addEventListener("resize", () => {
      this._engine.resize();
    });

    window.addEventListener("mousemove", event => {
      this._mouseX = event.pageX;
      this._mouseY = event.pageY;
    });

    window.addEventListener("mousedown", event => {
      this._mouseClick = true;
      this._mouseDown = true;
    });

    window.addEventListener("mouseup", event => {
      this._mouseClick = false;
      this._mouseDown = false;
    });
  }

  public get engine() {
    return this._engine;
  }

  public get mouseX() {
    return this._mouseX;
  }

  public get mouseY() {
    return this._mouseY;
  }

  public get mouseClick() {
    const out = this._mouseClick;
    this._mouseClick = false;
    return out;
  }

  public get mouseDown() {
    return this._mouseDown;
  }
}

export default new DeviceController();
