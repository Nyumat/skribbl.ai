

export default function LobbyPage({ params }: { params: { lobbyCode: string } }) {
    const { lobbyCode } = params
    return (
        <h1>Joining lobby with code: {lobbyCode}</h1>
    )
}