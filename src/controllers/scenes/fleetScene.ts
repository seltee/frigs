import * as BABYLON from "babylonjs";
import PlayerController from "controllers/PlayerController";
import ModelController, { Model } from "controllers/modelController";
import Scene from "./scene";
import Event from "../utils/event";
import GameLoopController from "controllers/gameLoopController";

const fregatePositions = [new BABYLON.Vector3(60, 0, 30), new BABYLON.Vector3(-60, 0, 30)];
const selectTint = new BABYLON.Color3(0.5, 0.4, 0.05);
const systemTint = new BABYLON.Color3(0.1, 0.1, 0.15);

class FleetScene extends Scene {
  private _shadowGenerator: BABYLON.ShadowGenerator;

  private _motherShip: Model;
  private _frigates: Array<Model> = [];

  private _animLookFrig = 0;

  private _cameraSpacePosition = new BABYLON.Vector3(0, 0, 0);
  private _cameraSpaceFocus = new BABYLON.Vector3(0, 0, 0);
  private _cameraFrigFocusPosition = new BABYLON.Vector3(0, 0, 0);
  private _cameraFrigFocusTarget = new BABYLON.Vector3(0, 0, 0);

  public init() {
    super.init();

    const directLight = new BABYLON.DirectionalLight("Direction Light", new BABYLON.Vector3(-0.9, -1, -1), this._scene);
    directLight.position = new BABYLON.Vector3(80, 60, -40);
    this._lights.push(directLight);

    const shadowGenerator = new BABYLON.ShadowGenerator(2048, directLight);
    shadowGenerator.usePoissonSampling = true;

    shadowGenerator.blurKernel = 8;
    shadowGenerator.useKernelBlur = true;
    shadowGenerator.blurScale = 4;
    this._shadowGenerator = shadowGenerator;

    // Subscriptions
    PlayerController.subscribe(type => {
      // Reload meshes on update
      if (type == Event.Updated) {
        this._scene.meshes = [];
        this.repositionCamera(10);

        this._motherShip = ModelController.addMotherShipModel(
          this._scene,
          PlayerController.player.motherShip.type,
          model => {
            model.mesh.id = `mothership`;
            this._shadowGenerator.addShadowCaster(model.mesh);
          }
        );

        PlayerController.player.fregates.forEach((item, i) => {
          this._frigates[i] = ModelController.addShipModel(this._scene, item.type, model => {
            model.mesh.position = fregatePositions[i];
            model.mesh.id = `frig/${i}`;
            this._shadowGenerator.addShadowCaster(model.mesh);
          });
        });
      }

      // Focus changed
      if (type == Event.FocusChanged) {
        if (this._motherShip.mesh) {
          if (PlayerController.player.motherShip.hover) {
            (this._motherShip.mesh.material as BABYLON.StandardMaterial).emissiveColor = selectTint;
          } else {
            (this._motherShip.mesh.material as BABYLON.StandardMaterial).emissiveColor = systemTint;
          }
        }
        this._frigates.forEach((frig, i) => {
          if (frig.mesh) {
            if (PlayerController.player.fregates[i] && PlayerController.player.fregates[i].hover) {
              (frig.mesh.material as BABYLON.StandardMaterial).emissiveColor = selectTint;
            } else {
              (frig.mesh.material as BABYLON.StandardMaterial).emissiveColor = systemTint;
            }
          }
        });
      }

      if (type == Event.SelectionChanged) {
        if (PlayerController.selected) {
          const model = PlayerController.selected.isMothership
            ? this._motherShip
            : this._frigates[PlayerController.selected.frigNum];

          if (model) {
            this._cameraFrigFocusTarget = model.mesh.position;
            this._cameraFrigFocusPosition = new BABYLON.Vector3(
              model.mesh.position.x - 60,
              model.mesh.position.y + 40,
              model.mesh.position.z
            );
          }
        }
      }
    });

    // UpdateLoop
    GameLoopController.subscribe(delta => {
      // Reposition camera
      if (PlayerController.selected) {
        this._animLookFrig = this._animLookFrig < 1 ? this._animLookFrig + delta : 1;
      } else {
        this._animLookFrig = this._animLookFrig > 0 ? this._animLookFrig - delta : 0;
      }

      const posX =
        this._cameraSpacePosition.x +
        (this._cameraFrigFocusPosition.x - this._cameraSpacePosition.x) * this._animLookFrig;
      const posY =
        this._cameraSpacePosition.y +
        (this._cameraFrigFocusPosition.y - this._cameraSpacePosition.y) * this._animLookFrig;
      const posZ =
        this._cameraSpacePosition.z +
        (this._cameraFrigFocusPosition.z - this._cameraSpacePosition.z) * this._animLookFrig;
      const tgX =
        this._cameraSpaceFocus.x + (this._cameraFrigFocusTarget.x - this._cameraSpaceFocus.x) * this._animLookFrig;
      const tgY =
        this._cameraSpaceFocus.y + (this._cameraFrigFocusTarget.y - this._cameraSpaceFocus.y) * this._animLookFrig;
      const tgZ =
        this._cameraSpaceFocus.z + (this._cameraFrigFocusTarget.z - this._cameraSpaceFocus.z) * this._animLookFrig;

      this._camera.position = new BABYLON.Vector3(posX, posY, posZ);
      this._camera.setTarget(new BABYLON.Vector3(tgX, tgY, tgZ));
      console.log(this._cameraFrigFocusPosition.x, this._cameraFrigFocusPosition.y, this._cameraFrigFocusPosition.z);
    });
  }

  public repositionCamera(distFactor: number) {
    this._cameraSpacePosition = new BABYLON.Vector3(-6 * distFactor, 8 * distFactor, 12 * distFactor);
    this._cameraSpaceFocus = new BABYLON.Vector3(-1 * distFactor, 1 * distFactor, 2 * distFactor);
  }
}

export default new FleetScene();
