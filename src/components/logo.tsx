import { PencilRuler } from 'lucide-react'
import Link from 'next/link'
import { cn } from '~/lib/utils'

export function SkribblLogo({ className }: { className?: string }) {
    return (
        <>
            <div className={cn('inline-flex items-center', className)}>
                <PencilRuler className="text-blue-600 translate-y-[0.8px]" />
                <Link href="/" passHref className="ml-3 text-xl">
                    skribbl.ai
                </Link>
            </div>
        </>
    )
}
