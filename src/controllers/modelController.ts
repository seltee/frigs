import Controller from "./controller";
import * as BABYLON from "babylonjs";

export interface Model {
  isModelInLoad: boolean;
  isTextureInLoad: boolean;
  mesh: BABYLON.AbstractMesh
}

const ShipModelsPath = "models/";

const fregatModels = {
  brigand: "test_brigand.babylon"
};

const motherModels = {
  hermes: "test_fregat.babylon"
};

class ModelController extends Controller {
  private _playerSceneAssetManager: BABYLON.AssetsManager;
  private _models: Array<Model>;
  private _taskNum = 0;

  public addShipModel(scene: BABYLON.Scene, model: string, onCreated?: (model: Model) => void): Model {
    if (fregatModels[model]) {
      return this.addModel(scene, fregatModels[model], onCreated);
    }
    console.error(`Undefined ship type ${model}`);
    return null;
  }

  public addMotherShipModel(scene: BABYLON.Scene, model: string, onCreated?: (model: Model) => void) {
    if (motherModels[model]) {
      return this.addModel(scene, motherModels[model], onCreated);
    }
    console.error(`Undefined ship type ${model}`);
    return null;
  }

  private addModel(scene: BABYLON.Scene, file: string, onCreated?: (model: Model) => void) {
    const assetManager = new BABYLON.AssetsManager(scene);
    const meshTask = assetManager.addMeshTask(`Ship task ${this._taskNum}`, "", ShipModelsPath, file);

    const defMaterial = new BABYLON.StandardMaterial(`Def Player Material ${this._taskNum}`, scene);

    defMaterial.diffuseColor = new BABYLON.Color3(0.5, 0.5, 0.5);
    defMaterial.specularColor = new BABYLON.Color3(0.8, 0.8, 0.8);
    defMaterial.emissiveColor = new BABYLON.Color3(0.1, 0.1, 0.15);

    this._taskNum++;

    const model: Model = {
      isModelInLoad: true,
      isTextureInLoad: true,
      mesh: null
    };

    meshTask.onSuccess = task => {
      task.loadedMeshes.forEach(item => {
        item.position = new BABYLON.Vector3(0, 0, 0);
        item.material = defMaterial;
        item.receiveShadows = true;
        model.isModelInLoad = false;

        if (onCreated) {
          model.mesh = item;
          onCreated(model);
        }
      });
    };

    assetManager.load();
    return model;
  }
}

export default new ModelController();
