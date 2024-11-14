// import { getResponse } from "@/helpers/responseMessage";
import { User } from "@/models/user";
// import { Query } from "@/modelCS/query";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken'
import { dbConnect } from "@/utils/db"


export async function POST(request) {

    await dbConnect()
  const { email, password } = await request.json();

  try {
    const user = await User.findOne({ email });

    if (user == null) {
      return NextResponse.json({ message: "user not found" });
    } else {
      const matched = bcrypt.compareSync(password, user.password);
      if (!matched) {
        return NextResponse.json({ message: "password not matched" });
      } else {


        const token = jwt.sign({user},process.env.SECRET_KEY)
        
        const response = NextResponse.json({
            data: user,
            message: "login sucessful",
            success: true
        })

        response.cookies.set("authToken:", token)

        return response
      }
    }
  } catch (error) {
    console.log(error)
    return NextResponse.json({message:"error found in request", status:500});
  }
}
