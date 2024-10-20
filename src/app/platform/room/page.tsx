"use client";


export default function RoomPage({
    searchParams,
}: {
    params: { slug: string }
    searchParams: { [key: string]: string | string[] | undefined }
}) {
    const id = searchParams.id;
    return (
        <>
            <div className="min-h-screen flex flex-col justify-center items-center">
                <h1 className="text-3xl font-bold">Room Page</h1>
                <h1 className="text-3xl font-bold">{id}</h1>
            </div>
        </>
    )
}