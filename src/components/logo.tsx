import { PencilRuler } from 'lucide-react'
import Link from 'next/link'

export function SkribblLogo() {
    return (
        <>
            <div className='inline-flex items-center'>
            <PencilRuler className="text-blue-600 translate-y-[0.8px]" />
            <Link href="/" passHref className="ml-3 text-xl">
                skribbl.ai
            </Link>
            </div>
        </>
    )
}
