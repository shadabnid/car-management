import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { User } from "@/models/user";
import { dbConnect } from "@/utils/db";

export async function GET(request) {
  await dbConnect();

  try {
    
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.getAll()[0]?.value;

    if (!tokenCookie || tokenCookie === "") {
      return NextResponse.json({
        message: "You are already signed out",
      });
    }

    const encryptedToken = jwt.verify(tokenCookie, process.env.SECRET_KEY);

    const email = encryptedToken.user.email;


    cookieStore.set("authToken", "");

    const user = await User.findOne({ email: email });


    await user.save();

    return NextResponse.json({
      message: "Logged out successfully",
      status: 200,
    });
  } catch (error) {
    return NextResponse.json({
      message: "Error in clearing cookies",
      status: 500,
    });
  }
}
