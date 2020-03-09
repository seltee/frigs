import Controller from "./controller";
import Axios from "axios";

class ServerController extends Controller {
  public request(link: string, req: any = {}) {
    return new Promise(function(resolve, reject) {
      Axios.post(link, req)
        .then(function(data) {
          let sData = data.data;
          try {
            if (typeof sData === "string") {
              sData = JSON.parse(sData);
            }
          } catch (e) {
            console.error("CAN'T PARSE JSON", e, sData);
            reject("Unexpected server error");
          }

          
          if (sData.success) {
            resolve(sData.data);
          } else {
            console.error("FAILED", link, req);
            reject(sData.errorMessage);
          }
        })
        .catch(function(reason) {
          console.error("ERROR: ", reason);
          reject("Unexpected server error");
        });
    });
  }
}

export default new ServerController();
