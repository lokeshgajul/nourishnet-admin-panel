import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Ngo from '@/models/Ngo';
import { sendApprovalEmail, sendCredentialsEmail } from '@/services/emailService';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

export async function PATCH(request, { params }) {
  try {
    const { sendCredentials } = await request.json().catch(() => ({}));
    await dbConnect();
    const { id } = await params;

    // 1. Find the NGO first
    const ngo = await Ngo.findById(id);
    if (!ngo) {
      return NextResponse.json({ message: 'NGO not found' }, { status: 404 });
    }

    if (ngo.status === 'APPROVED') {
      return NextResponse.json({ message: 'NGO already approved' }, { status: 400 });
    }

    let tempPassword = null;
    let hashedPassword = null;
    if (sendCredentials) {
      // Generate a random 8-character password
      tempPassword = crypto.randomBytes(4).toString('hex'); 
      hashedPassword = await bcrypt.hash(tempPassword, 10);
    }

    // 2. Try sending email BEFORE committing to DB
    try {
      if (sendCredentials && tempPassword) {
        await sendCredentialsEmail(ngo.email, ngo.ngoName, tempPassword);
      } else {
        await sendApprovalEmail(ngo.email, ngo.ngoName);
      }
    } catch (emailError) {
      console.error('Email notification failed:', emailError);
      // Fail the whole operation if email fails
      return NextResponse.json({ 
        message: 'Could not send notification email. Approval cancelled.', 
        error: emailError.message 
      }, { status: 503 }); // 503 Service Unavailable
    }

    // 3. ONLY if email succeeded, update the database
    ngo.status = 'APPROVED';
    ngo.approvedAt = new Date();
    ngo.isVerified = true;
    if (hashedPassword) {
      ngo.password = hashedPassword;
    }

    await ngo.save();

    return NextResponse.json({ message: 'NGO approved and notification sent successfully', ngo });
  } catch (error) {
    return NextResponse.json({ message: 'Error approving NGO', error: error.message }, { status: 500 });
  }
}


