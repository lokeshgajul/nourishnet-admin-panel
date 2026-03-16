import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Ngo from '@/models/Ngo';
import { sendRejectionEmail } from '@/services/emailService';

export async function PATCH(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const { rejectionReason } = await request.json();

    const ngo = await Ngo.findByIdAndUpdate(
      id,
      { 
        status: 'REJECTED', 
        rejectedAt: new Date(),
        rejectionReason 
      },
      { new: true }
    );

    if (!ngo) {
      return NextResponse.json({ message: 'NGO not found' }, { status: 404 });
    }

    try {
      await sendRejectionEmail(ngo.email, ngo.ngoName, rejectionReason);
    } catch (emailError) {
      console.error('Email notification failed:', emailError);
    }

    return NextResponse.json({ message: 'NGO rejected successfully', ngo });
  } catch (error) {
    return NextResponse.json({ message: 'Error rejecting NGO', error: error.message }, { status: 500 });
  }
}
