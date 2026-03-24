import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      error:
        "Deprecated endpoint. Use Firebase callable function `runRemindersCallable` from admin UI.",
    },
    { status: 410 }
  );
}

