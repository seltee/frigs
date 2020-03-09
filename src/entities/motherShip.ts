import Frigate from "./frigate";

interface MotherShipType {
  name: string;
  model3d: string;
}

export default class MotherShip {
  private _shipType: MotherShipType;
  private _capitanName = "";
  private _ships: Array<Frigate> = [];

  constructor(shipType: MotherShipType, capitanName: string) {
    this._shipType = shipType;
    this._capitanName = capitanName;
  }

  public get type() {
    return this._shipType;
  }
}
