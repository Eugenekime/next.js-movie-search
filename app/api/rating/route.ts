import { NextRequest, NextResponse } from 'next/server';

import { cookies } from 'next/headers';
import { Fetcher, rateMovieURL, urlForGuestSession } from '@/lib/tmdb/client';
import { GuestSession } from '@/lib/tmdb/types';

export async function POST(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const movieId = Number(searchParams.get('movie_id'));

  const cookieStore = await cookies();
  let guestSessionId = cookieStore.get('guest_session_id')?.value;

  const body = await request.json();
  const value = Number(body.value);

  if (!Number.isInteger(movieId) || movieId <= 0) {
    return NextResponse.json(
      { error: 'Movie ID is required' },
      { status: 400 },
    );
  }

  if (value < 0.5 || value > 10) {
    return NextResponse.json(
      { error: 'Rating must be between 0.5 and 10' },
      { status: 400 },
    );
  }

  if (!guestSessionId) {
    const guestSession = await Fetcher<GuestSession>({
      url: urlForGuestSession,
    });
    guestSessionId = guestSession.guest_session_id;
    cookieStore.set('guest_session_id', guestSession.guest_session_id);
  }

  try {
    const data = await Fetcher({
      url: rateMovieURL(movieId, guestSessionId),
      options: {
        method: 'POST',
        body: JSON.stringify({
          value,
        }),
      },
    });

    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message });
    }

    return NextResponse.json({ error: 'Couldn`t rate movie' }, { status: 500 });
  }
}
