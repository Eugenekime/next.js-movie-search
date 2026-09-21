import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { Fetcher, getRatedListURL } from '@/lib/tmdb/client';
import { MovieResponse } from '@/lib/tmdb/types';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = Number(searchParams.get('page')) || 1;
  try {
    const cookieStore = await cookies();
    let guestSessionId = cookieStore.get('guest_session_id')?.value;
    if (!guestSessionId) {
      const res = await fetch('/api/guest-session');
      const data = await res.json();
      guestSessionId = data.guestSessionId;
    }

    const ratedList = await Fetcher<MovieResponse>({
      url: getRatedListURL(guestSessionId, page),
    });

    return NextResponse.json(ratedList);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { error: 'Couldn`t load rated movies' },
      { status: 500 },
    );
  }
}
