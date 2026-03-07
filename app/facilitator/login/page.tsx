import { createSupabaseServerClient } from '@/lib/supabase'
import FacilitatorLoginClient from './FacilitatorLoginClient'
import { redirect } from 'next/navigation'

export default async function FacilitatorLoginPage() {
    const supabase = await createSupabaseServerClient()

    const { data: { session } } = await supabase.auth.getSession()

    // If they already have a session, redirect straight to the setup screen
    if (session) {
        redirect('/facilitator/setup')
    }

    return (
        <FacilitatorLoginClient />
    )
}
