import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { User } from "@/models/user";
import { dbConnect } from "@/utils/db";

export async function GET(request) {
  await dbConnect();

  try {
    const cookieStore = cookies();
  
    const tokenCookie = cookieStore.get("authToken:")?.value;

    if (!tokenCookie) {
      return NextResponse.json({
        message: "You are already signed out",
      });
    }

    const encryptedToken = jwt.verify(tokenCookie, process.env.SECRET_KEY);
    const email = encryptedToken.user.email;

    
    const response = NextResponse.json({
      message: "Logged out successfully",
      status: 200,
    });


    response.cookies.set("authToken", "", {
      maxAge: -1,
      path: "/",
    });

    const user = await User.findOne({ email: email });
    if (user) {
      await user.save();
    }

    return response;
  } catch (error) {
    return NextResponse.json({
      message: "Error in clearing cookies",
      status: 500,
    });
  }
}
