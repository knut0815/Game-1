import Server from "./server";
import HTTPServer from "./http";

import {
  WS_PORT,
  HTTP_PORT
} from "./cfg";

(() => {

  let http = new HTTPServer();
  let server = new Server();

  console.log(`WS Server listening at http://127.0.0.1:${WS_PORT}`);
  console.log(`HTTP Server listening at http://127.0.0.1:${HTTP_PORT}`);

})();