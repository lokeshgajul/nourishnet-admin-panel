import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Ngo from '@/models/Ngo';

export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    let query = {};
    if (status && status.toLowerCase() !== 'all') {
      query.status = { $regex: new RegExp(`^${status}$`, 'i') };
    }
    
    if (search) {
      query.$or = [
        { ngoName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const ngos = await Ngo.find(query).select('-password').sort({ createdAt: -1 });
    return NextResponse.json(ngos);
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching NGOs', error: error.message }, { status: 500 });
  }
}
