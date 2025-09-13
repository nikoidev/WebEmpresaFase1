import HomePage from '@/components/HomePage'
import DevFileInfo from '@/components/DevFileInfo'

export default function Page() {
    return (
        <>
            <DevFileInfo filePath="frontend/src/app/page.tsx" />
            <HomePage />
        </>
    )
}
