import React, { Component } from "react";
import PlayerController from "controllers/PlayerController";
import { useController } from "../../utils/hooks";
import InnerPage from "UI/components/InnerPage";
import Panel from "UI/components/Panel";
import Condition from "UI/components/Condition";
import useEffect from "react";
import DeviceController from "controllers/deviceController";
import GameLoopController from "controllers/gameLoopController";
import SceneController from "controllers/sceneController";
import FleetScene from "controllers/scenes/fleetScene";

interface IFleetPage {}

export default (props: IFleetPage) => {
  useController(PlayerController);

  const motherShipCnd = PlayerController.motherShipStatus;
  const fregatesCnd = PlayerController.fregatesStatus;

  React.useEffect(() => {
    const loop = () => {
      // Pick and hover frigate from scene
      if (FleetScene) {
        if (!PlayerController.selected) {
          const el = FleetScene.scene.pick(DeviceController.mouseX, DeviceController.mouseY);
          if (el.hit) {
            const frig = PlayerController.getFregateById(el.pickedMesh.id);
            if (frig) {
              frig.setFocused();
              if (DeviceController.mouseClick) {
                frig.setSelected();
              }
            }
          } else {
            PlayerController.unHoverAll();
          }
        }
      }
    };

    GameLoopController.subscribe(loop);
    return () => {
      GameLoopController.unSubscribe(loop);
    };
  }, []);

  if (PlayerController.player) {
    return (
      <InnerPage>
        {PlayerController.selected ? null : (
          <Panel>
            <Condition name={PlayerController.player.nickname} />
            <Condition name="MotherShip" isValid={motherShipCnd}>
              {motherShipCnd ? "OK" : "PROBLEMS"}
            </Condition>
            <Condition name="Fregates" isValid={fregatesCnd}>
              {fregatesCnd ? "OK" : "PROBLEMS"}
            </Condition>
          </Panel>
        )}
      </InnerPage>
    );
  }
  return null;
};
