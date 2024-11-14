import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function verifyToken(){

    const cookie = cookies();

    const tokenCookie = cookie.getAll()[0].value;

        let token = "" 

        if (!tokenCookie || tokenCookie == "" && token === "undefined") {
          
            return token
          }

          else{
            token = jwt.verify(tokenCookie, process.env.SECRET_KEY);

            
            return token

          }


}