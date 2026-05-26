import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const SECRET = "supersecret";

export async function POST(req: Request) {
  const { username, password } = await req.json();

  if (username === "admin" && password === "admin123") {
    const token = jwt.sign({ username }, SECRET, {
      expiresIn: "1h",
    });

    const res = NextResponse.json({ success: true });

    res.cookies.set("token", token, {
      httpOnly: true,
      path: "/",
    });

    return res;
  }

  return NextResponse.json({ error: "invalid" }, { status: 401 });
}