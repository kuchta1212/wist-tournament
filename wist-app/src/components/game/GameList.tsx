import * as React from 'react'
import { Game, GameType } from "../../typings/index"
import { getApi } from "../api/ApiFactory"
import { Loader } from '../Loader'
import { GameBox } from './GameBox'
import './Game.css'

interface GameListProps {
    type: GameType;
    tournamentId: string;
}

interface GameListState {
    games: Game[];
    loading: boolean;
}

export class GameList extends React.Component<GameListProps, GameListState> {

    constructor(props: GameListProps) {
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
                <div className="btn-group" role="group" aria-label="Basic example">
                    <button type="button" className="btn">➕</button>
                    <button type="button" className="btn">🔃</button>
                    <button type="button" className="btn">🚫</button>
                </div>
                {contents}
            </div>
        );
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
}