import { User } from "@/models/user";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { dbConnect } from "@/utils/db"

export async function POST(request) {

  await dbConnect()

  const {email,password,phone} = await request.json();

  const user = new User({
    email,password,phone
  });

  try {

    
    if(!email || email==""){
        return NextResponse.json({message:"Email should not be empty", status:500})
    }

    if(!password || password==""){
        return NextResponse.json({message:"Password should not be empty", status:500})
    }



    user.password = bcrypt.hashSync(
      user.password,
      10
    );

    const createdUser = await user.save();
    const response = NextResponse.json({
      message: "data created sucess fully",
      status: 201,
      data: createdUser,
    });

    return response;
  } catch (error) {

    return NextResponse.json({
      message: "failed to create user",
      status: 600,
    });
  }
}
