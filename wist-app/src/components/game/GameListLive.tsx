import * as React from 'react'
import { Game, GameStatus, GameType } from "../../typings/index"
import { getApi } from "../api/ApiFactory"
import { Loader } from '../Loader'
import { GameBox } from './GameBox'
import './Game.css'
import { GameTableLive } from './GameTableLive'

interface GameListLiveProps {
    type: GameType;
    tournamentId: string;
}

interface GameListLiveState {
    games: Game[];
    loading: boolean;
}

export class GameListLive extends React.Component<GameListLiveProps, GameListLiveState> {

    constructor(props: GameListLiveProps) {
        super(props);

        this.state = {
            games: [],
            loading: true
        }
    }

    public async componentDidMount() {
        await this.getData();
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
                {contents}
            </div>
        );
    }

    public renderContent() {
        return (
            <div className="row game-list text-light">
                {
                    this.state.games.map((game, index) => (
                        <GameTableLive key={game.id} game={game} />
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

    private async removeGameRound() {
        if (this.state.games.filter(g => g.status !== GameStatus.notStarted).length !== 0) {
            alert("Některé hry již začali. Nejde smazat");
            return;
        }

        await getApi().removeGames(this.props.tournamentId, this.props.type);
        await this.getData();
    }
}