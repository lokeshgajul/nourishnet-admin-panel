import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Ngo from '@/models/Ngo';

export async function GET() {
  try {
    await dbConnect();
    
    const stats = await Ngo.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const formattedStats = {
      PENDING: 0,
      APPROVED: 0,
      REJECTED: 0,
      TOTAL: 0
    };

    stats.forEach(stat => {
      if (stat._id) {
        formattedStats[stat._id] = stat.count;
        formattedStats.TOTAL += stat.count;
      }
    });

    return NextResponse.json(formattedStats);
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching stats', error: error.message }, { status: 500 });
  }
}
