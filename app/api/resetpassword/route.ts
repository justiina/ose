import { ResetPasswordTemplate } from "@/app/components/EmailTemplates";
import { Resend } from "resend";
import * as React from "react";
import { NextRequest, NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const { token, email } = await req.json();

  if (!email || typeof email !== "string") {
    return NextResponse.json(
      { error: "Invalid email address" },
      { status: 400 }
    );
  }

  // Create uuid for the reset link
  const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL}/resetpassword?token=${token}`

  try {
    const { data, error } = await resend.emails.send({
      from: `OSEn jasensivusto <${process.env.FROM_EMAIL}>`,
      to: `${email}`,
      reply_to: `${process.env.REPLY_TO_EMAIL}`,
      subject: "Salasanan nollaus",
      react: ResetPasswordTemplate({ resetLink }) as React.ReactElement,
    });

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
