import Controller from "./controller";
import SceneController from "./sceneController";

class GameLoopController extends Controller {
  public init() {
    let start = Date.now();

    const gameLoop = () => {
      requestAnimationFrame(gameLoop);

      const current = Date.now();
      const delta = current - start;
      start = current;

      this.notify(delta / 1000);
      SceneController.render();
    };
    gameLoop();
  }
}

export default new GameLoopController();
