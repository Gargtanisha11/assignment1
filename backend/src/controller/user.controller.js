import { asyncHandler } from "../asyncHandler.js";
import { User } from "../model/user.model.js";
import { Bank } from "../model/bank.model.js";
import { ApiError } from "../ApiError.js";
import { ApiResponse } from "../ApiResponse.js";
import mongoose from "mongoose";

const setData = asyncHandler(async (req, res) => {
  const { userID, IFSC } = req.body;

  if (!(userID && IFSC)) {
    throw new ApiError(402, "user Id , IFSC and bankCcount Id is required ");
  }

  const user = await User.findOne({
    userId: userID,
  });

  if (!user) {
    const newUser = await User.create({
      userId: userID,
    });

    if (!newUser) {
      throw new ApiError(500, " some error while creating the user");
    }
  }

  // user created
  const bank = await Bank.findOne({
    ifsc: IFSC,
  });


  if (!user || !user.bankAccount.includes(IFSC)) {
    const userdata = await User.findOneAndUpdate(
      {
        userId: Number(userID),
      },
      {
        $push: {
          bankAccount: IFSC,
        },
      }
    );


    userdata.save({ validateBeforeSave: true });

    if (!userdata) {
      throw new ApiError(500, " some error while saving the data ");
    }
  }


  const userPayload = await User.aggregate([
    {
      $match: {
        userId: Number(userID),
      },
    },
    {
      $lookup: {
        from: "banks",
        localField: "bankAccount",
        foreignField: "ifsc",
        as: "bankDetails",
      },
    }
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        userPayload,
        " successfully get and set the user data "
      )
    );
});

const sendUserData = asyncHandler(async (req, res) => {
  const userDetails = await User.aggregate([
    {
      $lookup: {
        from: "banks",
        localField: "bankAccount",
        foreignField: "ifsc",
        as: "bankDetails",
      },
    },
  ]);

  if (!userDetails.length === 0) {
    throw new ApiError(" userdetails is not fetch");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, userDetails, " successfully fetched the data "));
});

export { setData, sendUserData };
