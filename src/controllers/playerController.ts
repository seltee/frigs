import Controller from "./controller";
import ServerController from "controllers/serverController";
import PageController from "controllers/pageController";
import { Page } from "./pageController";
import Event from "./utils/event";

export interface IMotherShip {
  name: string;
  type: string;
  hover: boolean;
}

export interface IFregate {
  name: string;
  type: string;
  hover: boolean;
}

export interface IUser {
  nickname: string;
  motherShip: IMotherShip;
  fregates: Array<IFregate>;
}

export interface IFregateControl {
  isMothership: boolean;
  name: string;
  type: string;
  frigNum: number;
  setFocused: () => void;
  setSelected: () => void;
}

class PlayerController extends Controller {
  private _user: IUser;
  private _selected: IFregateControl;
  
  public loginError: string;

  public getUser() {
    ServerController.request("/api/user").then(data => {
      console.log("USER", data);
      this._user = data as IUser;
      this.notify(Event.Updated);
      this.unHoverAll();
    });
  }

  public doRegistration(email: string) {
    ServerController.request("/api/registration", {
      email
    }).then(() => {
      PageController.goTo(Page.PageRegInfo);
    });
  }

  public doAuth(login, password) {
    this.loginError = null;
    ServerController.request("/api/auth", {
      email: login,
      password: password
    })
      .then(data => {
        PageController.goTo(Page.PageFleet);
        this.getUser();
      })
      .catch(message => {
        this.loginError = message;
        this.notify(Event.Error);
      });
  }

  public unHoverAll(preventEvent = false) {
    this._user.motherShip.hover = false;
    this._user.fregates.forEach(frig => {
      frig.hover = false;
    });
    if (!preventEvent) {
      this.notify(Event.FocusChanged);
    }
  }

  public getFregateById(id: string): IFregateControl {
    const sp = id.split("/");
    if (sp[0] == "mothership") {
      const m: IFregateControl = {
        isMothership: true,
        name: this._user.motherShip.name,
        type: this._user.motherShip.type,
        frigNum: -1,
        setFocused: () => {
          this.unHoverAll(true);
          this._user.motherShip.hover = true;
          this.notify(Event.FocusChanged);
        },
        setSelected: () => {
          this._selected = m;
          this.unHoverAll();
          this.notify(Event.SelectionChanged);
        }
      };
      return m;
    } else {
      const num = parseInt(sp[1]);
      const frig = this._user.fregates[num];
      if (frig) {
        const m: IFregateControl = {
          isMothership: false,
          name: frig.name,
          type: frig.type,
          frigNum: num,
          setFocused: () => {
            this.unHoverAll(true);
            frig.hover = true;
            this.notify(Event.FocusChanged);
          },
          setSelected: () => {
            this._selected = m;
            this.unHoverAll();
            this.notify(Event.SelectionChanged);
          }
        };

        return m;
      }
    }
    return null;
  }

  public get fregatesStatus() {
    return true;
  }

  public get motherShipStatus() {
    return true;
  }

  public get player() {
    return this._user;
  }

  public get selected() {
    return this._selected;
  }
}

export default new PlayerController();
