import * as React from 'react'
import { Game, GameStatus, GameType } from "../../typings/index"
import { getApi } from "../api/ApiFactory"
import { Loader } from '../Loader'
import { GameBox } from './GameBox'
import { HubConnectionBuilder } from '@aspnet/signalr';
import './Game.css'

interface GameListProps {
    type: GameType;
    tournamentId: string;
}

interface GameListState {
    games: Game[];
    loading: boolean;
    hubConnection: any;
}

export class GameList extends React.Component<GameListProps, GameListState> {

    constructor(props: GameListProps) {
        super(props);

        this.state = {
            games: [],
            loading: true,
            hubConnection: null
        }
    }

    public async componentDidMount() {
        const games = await getApi().getTournamentGamesForRound(this.props.tournamentId, this.props.type);
        //const hubConnection = new HubConnectionBuilder().withUrl("https://wist-grandslam.azurewebsites.net/hubs/notifications").build();
        const hubConnection = new HubConnectionBuilder().withUrl("https://localhost:44340/hubs/notifications").build();

        this.setState({ hubConnection: hubConnection, games: games, loading: false }, () => {
            this.state.hubConnection
                .start()
                .then(() => console.log("Connection set up"))
                .catch(err => console.log("Error:" + err));

            this.state.hubConnection.on("GameStarted", async (gameId) => {
                console.log(gameId);
                if (this.state.games.filter(g => g.id == gameId).length > 0) {
                    this.setState({ loading: true });
                    await this.getData();
                }
                
            });

            this.state.hubConnection.on("GameFinished", async (gameId) => {
                console.log(gameId);
                if (this.state.games.filter(g => g.id == gameId).length > 0) {
                    this.setState({ loading: true });
                    await this.getData();
                }
            });
        });


    }

    private async getData() {
        const games = await getApi().getTournamentGamesForRound(this.props.tournamentId, this.props.type);
        this.setState({ games: games, loading: false });
    }

    public render() {
        let contents = this.state.loading
            ? <Loader />
            : this.renderContent()

        return (
            <div>
                {this.renderButtons()}
                {contents}
            </div>
        );
    }

    public renderButtons() {
        const createBtn = this.state.games.length === 0;
        const reCreateBtn = !createBtn && this.state.games.filter(g => g.status !== GameStatus.notStarted).length === 0;
        const refreshBtn = !createBtn;
        const deleteBtn = !createBtn && this.state.games.filter(g => g.status !== GameStatus.notStarted).length === 0

        return (
            <div className="btn-group" role="group" aria-label="Basic example">
                {createBtn ? <button title="Vytvoř" type="button" className="btn game-round-btn" onClick={() => this.createNextRound()}>➕</button> : null}
                {reCreateBtn ? <button title="Přegeneruj" type="button" className="btn game-round-btn" onClick={() => this.reCreateGameRound()}>↩️</button> : null}
                {refreshBtn ? <button title="Obnovit" type="button" className="btn game-round-btn" onClick={() => this.refresh()}>🔄️</button> : null}
                {deleteBtn ? <button title="Smaž" type="button" className="btn game-round-btn" onClick={() => this.removeGameRound()}>🚫</button> : null}
            </div>
        )
    }

    public renderContent() {
        return (
            <div className="row game-list text-light">
                {
                    this.state.games.map((game, index) => (
                        <GameBox key={game.id} game={game} />
                    ))
                }
            </div>
        );
    }

    private async createNextRound() {
        if (this.state.games.length === 0) {
            await getApi().createRoundOfGames(this.props.tournamentId, this.props.type);
            await this.getData();
        } else {
            alert("Kolo už existuje");
        }

    }

    private async reCreateGameRound() {
        if (this.state.games.length === 0) {
            alert("Kolo neexistuje");
            return;
        } else if (this.state.games.filter(g => g.status !== GameStatus.notStarted).length !== 0) {
            alert("Některé hry již začali. Nejde přegenerovat");
            return;
        }

        await getApi().createRoundOfGames(this.props.tournamentId, this.props.type);
        await this.getData();
    }

    private async refresh() {
        this.setState({ loading: true });
        await this.getData();
    }

    private async removeGameRound() {
        if (this.state.games.filter(g => g.status !== GameStatus.notStarted).length !== 0) {
            alert("Některé hry již začali. Nejde smazat");
            return;
        }

        await getApi().removeGames(this.props.tournamentId, this.props.type);
        await this.getData();
    }
}