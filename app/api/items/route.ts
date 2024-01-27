import { NextRequest, NextResponse } from "next/server";

export enum ItemAccess {
  PUBLIC = "PUBLIC",
  USER = "USER",
  ADMIN = "ADMIN",
}

export type Item = {
  id: string;
  title: string;
  access: ItemAccess;
};

const defaultItems: Item[] = [
  { id: "item-1", title: "I am a public item", access: ItemAccess.PUBLIC },
  { id: "item-2", title: "I am a public item", access: ItemAccess.PUBLIC },
  { id: "item-3", title: "I am a user item", access: ItemAccess.USER },
  { id: "item-4", title: "I am a user item", access: ItemAccess.USER },
  { id: "item-5", title: "I am an admin item", access: ItemAccess.ADMIN },
];

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json(defaultItems);
  } catch (error) {
    return new NextResponse("Internal error", { status: 500 });
  }
}
