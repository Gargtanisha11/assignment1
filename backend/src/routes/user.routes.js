import { Router } from "express";
import { sendUserData, setData } from "../controller/user.controller.js";
import { setBankData } from "../controller/bank.controller.js";
  

    const router = Router();
    router.route("/setUserData").post(setBankData,setData);
    router.route("/getUserData").get(sendUserData);

    export default router