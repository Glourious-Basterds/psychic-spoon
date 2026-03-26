'use client';

import { useParams } from 'next/navigation';
import ProfilePage from '../page';

export default function UserProfilePage() {
    const params = useParams();
    const id = params.id as string;

    // We can reuse the ProfilePage but we need it to accept a prop or use searchParams.
    // However, ProfilePage currently reads from useSearchParams.
    // I will refactor ProfilePage to use a prop or check for params.
    
    return <ProfilePage userId={id} />;
}
