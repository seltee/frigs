import Controller from "./controller";

export enum Page {
  PageLogin,
  PageRegistration,
  PageRegInfo,
  PageFleet
};

class PageController extends Controller {
  private _currentPage: Page = Page.PageLogin;

  public goTo(page: Page){
    console.log("goto", page);
    this._currentPage = page;
    this.notify(null);
  }

  public get currentPage(){
    return this._currentPage;
  }
}

export default new PageController();
