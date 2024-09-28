import { ApiError } from "../ApiError.js";
import { ApiResponse } from "../ApiResponse.js";
import { IFSC_URL } from "../ApiURL.js";
import { asyncHandler } from "../asyncHandler.js";
import { Bank } from "../model/bank.model.js";
import axios from "axios"

const fetchFromIFSC = async (ifsc) => {
  try {
    const response = await axios.get(IFSC_URL + ifsc);
    return response;
  } catch (error) {
    throw new ApiError(500, " not getting the data from url ");
  }
};

const fetchFromCity = async () => {

  // we should call the api where i need to do subscribe but we send the static data 
  const weather = {
    temp: 25.5,
    humidity: 50,
  };

  return weather ;
};

const setBankData = asyncHandler(async (req, res,next) => {
   
  const {IFSC} = req.body;
  if(!IFSC){
    throw new ApiError(400," need an IFSC code")
  };


  const alreadyBank= await Bank.findOne({
    ifsc:IFSC
  })
  
  if(alreadyBank){
    next();
    return
  }


  const bankResponse =await fetchFromIFSC(IFSC);
  if(!bankResponse){
    throw new ApiError(500," error while getting the bankdetails from Ifsc")
  }

  const weatherResponse = await fetchFromCity(bankResponse.CITY);
  if(!weatherResponse){
    throw new ApiError(500," error while fetch the weather data of city ")
  }
   

  const {data }= bankResponse;
  const createdBank = await Bank.create({
    bankName:data.BANK,
    branch:data.BRANCH,
    address:data.ADDRESS,
    city:data.CITY,
    district:data.DISTRICT,
    state:data.STATE,
    bank_code:data.STATE,
    ifsc:data.IFSC,
    weather: weatherResponse,
  });

  if (!createdBank) {
    throw new ApiError(500, " bank account details is not created ");
  }
  
  next()

  // return res
  //   .status(200)
  //   .json(new ApiResponse(200, createdBank, " successfully set the data"));
});

export { setBankData };
