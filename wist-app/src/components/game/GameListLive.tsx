import * as React from 'react'
import { Game, GameStatus, GameType } from "../../typings/index"
import { getApi } from "../api/ApiFactory"
import { Loader } from '../Loader'
import { GameBox } from './GameBox'
import './Game.css'
import { GameTableLive } from './GameTableLive'
import { HubConnectionBuilder } from '@aspnet/signalr';

interface GameListLiveProps {
    tournamentId: string;
}

interface GameListLiveState {
    gamesIds: string[];
    loading: boolean;
    hubConnection: any
}

export class GameListLive extends React.Component<GameListLiveProps, GameListLiveState> {

    constructor(props: GameListLiveProps) {
        super(props);

        this.state = {
            gamesIds: [],
            loading: true,
            hubConnection: null
        }
    }

    public async componentDidMount() {
        const games = await getApi().getTournamentActiveGames(this.props.tournamentId);
        const hubConnection = new HubConnectionBuilder().withUrl("https://wist-grandslam.azurewebsites.net/hubs/notifications").build();
        //const hubConnection = new HubConnectionBuilder().withUrl("https://localhost:44340/hubs/notifications").build();

        this.setState({ hubConnection: hubConnection, gamesIds: games, loading: false }, () => {
            this.state.hubConnection
                .start()
                .then(() => console.log("Connection set up"))
                .catch(err => console.log("Error:" + err));

            this.state.hubConnection.on("GameStarted", async (message) => {
                this.setState({ loading: true });
                await this.getData();
            });

            this.state.hubConnection.on("GameFinished", async (message) => {
                this.setState({ loading: true });
                await this.getData();
            });
        });
    }

    private async getData() {
        const games = await getApi().getTournamentActiveGames(this.props.tournamentId);
        this.setState({ gamesIds: games, loading: false });
    }

    public render() {
        let contents = this.state.loading
            ? <Loader />
            : this.state.gamesIds.length > 0
                ? this.renderContent()
                : this.renderText();

        return (
            <div>
                {contents}
            </div>
        );
    }

    public renderContent() {
        return (
            <div>
                <button title="Obnovit" type="button" className="btn game-round-btn" onClick={() => this.refresh()}>🔄️</button>
                <div className="row game-list text-light">
                    {
                        this.state.gamesIds.map((gameId) => (
                            <GameTableLive key={gameId} gameId={gameId} />
                        ))
                    }
                </div>
            </div>
        );
    }

    public renderText() {
        return (
            <h5 className="text-light">
                Žádná hra se momentálně nehraje
            </h5>
        );
    }

    private async refresh() {
        this.setState({ loading: true });
        await this.getData();
    }
}