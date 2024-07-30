import { EmailTemplate } from "@/app/components/EmailTemplates";
import { Resend } from "resend";
import * as React from "react";
import { NextRequest, NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const { firstName, email } = await req.json();

  try {
    const { data, error } = await resend.emails.send({
      from: `OSEn jasensivusto <${process.env.FROM_EMAIL}>`,
      to: `${email}`,
      reply_to: `${process.env.REPLY_TO_EMAIL}`,
      subject: "Hello world",
      react: EmailTemplate({ firstName }) as React.ReactElement,
    });

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
