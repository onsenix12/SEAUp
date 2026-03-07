import { createSupabaseServerClient } from '@/lib/supabase'
import FacilitatorSetupClient from './FacilitatorSetupClient'
import { redirect } from 'next/navigation'

export default async function FacilitatorSetupPage() {
    const supabase = await createSupabaseServerClient()

    const { data: { session }, error } = await supabase.auth.getSession()

    // Protect this route - must be logged in as a facilitator
    if (error || !session) {
        return redirect('/facilitator/login');
    }

    return (
        <FacilitatorSetupClient userEmail={session.user.email || 'facilitator'} userId={session.user.id} />
    )
}
