import DeviceController from 'controllers/deviceController';
import * as BABYLON from "babylonjs";

class Scene {
  protected _scene: BABYLON.Scene;
  protected _camera: BABYLON.FreeCamera;
  protected _lights: Array<BABYLON.IShadowLight> = [];

  public render(){
    this._scene.render();
  }

  public init(){
    this._scene = new BABYLON.Scene(DeviceController.engine);
    this._camera = new BABYLON.FreeCamera("SpaceCamera", new BABYLON.Vector3(0, 0, 0), this._scene);
  }

  public get scene(){
    return this._scene;
  }

  protected onEnter(){

  }

  protected onExit(){
    
  }
}
export default Scene;