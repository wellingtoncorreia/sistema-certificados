// import { NextResponse } from "next/server"
// import jwt from "jsonwebtoken"

// export async function POST(req: Request) {
//   const { email, senha } = await req.json()

//   if (
//     email === process.env.ADMIN_EMAIL &&
//     senha === process.env.ADMIN_PASSWORD
//   ) {
//     const token = jwt.sign({ email }, process.env.JWT_SECRET!, {
//       expiresIn: "8h"
//     })

//     const response = NextResponse.json({ ok: true })
//     response.cookies.set("token", token, { httpOnly: true })

//     return response
//   }

//   return NextResponse.json({ error: "Credenciais inválidas" }, { status: 401 })
// }