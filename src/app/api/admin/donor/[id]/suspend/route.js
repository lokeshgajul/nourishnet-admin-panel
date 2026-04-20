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
        status: "SUSPENDED",
        suspendedAt: new Date(),
      },
      { new: true },
    );

    if (!donor) {
      return NextResponse.json({ message: "Donor not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Donor suspended successfully", donor });
  } catch (error) {
    return NextResponse.json(
      { message: "Error suspending donor", error: error.message },
      { status: 500 },
    );
  }
}
