import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import {
  Fetcher,
  getRatedListURL,
  urlForGuestSession,
  FetcherError,
} from '@/lib/tmdb/client';
import { MovieResponse, GuestSession } from '@/lib/tmdb/types';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = Number(searchParams.get('page')) || 1;
  try {
    const cookieStore = await cookies();
    let guestSessionId = cookieStore.get('guest_session_id')?.value;
    if (!guestSessionId) {
      const guestSession = await Fetcher<GuestSession>({
        url: urlForGuestSession,
      });
      guestSessionId = guestSession.guest_session_id;
      cookieStore.set('guest_session_id', guestSession.guest_session_id);
    }
    const ratedList = await Fetcher<MovieResponse>({
      url: getRatedListURL(guestSessionId, page),
    });

    return NextResponse.json(ratedList);
  } catch (error) {
    if (
      error instanceof FetcherError &&
      error.status === 404 &&
      error.tmdbStatusCode === 34
    ) {
      const emptyRatedList: MovieResponse = {
        page,
        results: [],
        total_pages: 1,
        total_results: 0,
      };

      return NextResponse.json(emptyRatedList);
    }
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { error: 'Couldn`t load rated movies' },
      { status: 500 },
    );
  }
}
