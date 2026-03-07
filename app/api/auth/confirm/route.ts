import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase'
import { redirect } from 'next/navigation'

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const token_hash = searchParams.get('token_hash')
    const type = searchParams.get('type') as EmailOtpType | null
    const next = searchParams.get('next') ?? '/facilitator/setup'

    if (token_hash && type) {
        const supabase = await createSupabaseServerClient()

        const { error } = await supabase.auth.verifyOtp({
            type,
            token_hash,
        })

        if (!error) {
            // successful auth, redirect
            redirect(next)
        }
    }

    // return the user to an error page with some instructions
    redirect('/facilitator/login?error=true')
}
