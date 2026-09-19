import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { Fetcher } from '@/lib/tmdb/client';
import { GuestSession } from '@/lib/tmdb/types';

export async function GET() {
  try {
    const cookieStore = await cookies();

    let guestSessionId = cookieStore.get('guest_session_id')?.value;
    if (!guestSessionId) {
      const guestSession = await Fetcher<GuestSession>({
        url: 'authentication/guest_session/new',
      });
      guestSessionId = guestSession.guest_session_id;
      cookieStore.set('guest_session_id', guestSessionId);
    }
    return NextResponse.json({ guestSessionId });
  } catch {
    return NextResponse.json(
      { error: 'Couldn`t create guest session' },
      { status: 500 },
    );
  }
}
