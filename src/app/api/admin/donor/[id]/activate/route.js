import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Donor from "@/models/Donor";

export async function PATCH(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;

    const donor = await Donor.findByIdAndUpdate(
      id,
      {
        status: "ACTIVE",
        $unset: { suspendedAt: "" },
      },
      { new: true },
    );

    if (!donor) {
      return NextResponse.json({ message: "Donor not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Donor activated successfully", donor });
  } catch (error) {
    return NextResponse.json(
      { message: "Error activating donor", error: error.message },
      { status: 500 },
    );
  }
}
