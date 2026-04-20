import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Donor from "@/models/Donor";

export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    let query = {};
    if (status && status.toLowerCase() !== "all") {
      query.status = { $regex: new RegExp(`^${status}$`, "i") };
    }

    if (search) {
      query.$or = [
        { DonorName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const Donors = await Donor.find(query)
      .select("-password")
      .sort({ createdAt: -1 });
    return NextResponse.json(Donors);
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching Donors", error: error.message },
      { status: 500 },
    );
  }
}
