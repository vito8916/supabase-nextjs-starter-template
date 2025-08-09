import Link from 'next/link'
import React from 'react'
import { hasEnvVars } from '@/lib/utils'
import { DeployButton } from '@/components/landing/deploy-button'
import { AuthButton } from '@/components/landing/auth-button'
import { EnvVarWarning } from '@/components/landing/env-var-warning'

export default function Navbar() {
  return (
    <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
          <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
            <div className="flex gap-5 items-center font-semibold">
              <Link href={"/"}>SupaNext Starter Kit2</Link>
              <div className="flex items-center gap-2">
                <DeployButton />
              </div>
            </div>
            {!hasEnvVars ? <EnvVarWarning /> : <AuthButton />}
          </div>
        </nav>
  )
}
