import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Feedback from "@/models/Feedback";

export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");

    let query = {};
    if (search) {
      query.feedback = { $regex: search, $options: "i" };
    }

    const feedbacks = await Feedback.find(query).sort({ createdAt: -1 });
    return NextResponse.json(feedbacks);
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching feedbacks", error: error.message },
      { status: 500 },
    );
  }
}
