import * as React from 'react'
import { Game, GameStatus, GameType } from "../../typings/index"
import { getApi } from "../api/ApiFactory"
import { Loader } from '../Loader'
import { GameBox } from './GameBox'
import './Game.css'
import { GameTableLive } from './GameTableLive'

interface GameListLiveProps {
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
        const games = await getApi().getTournamentActiveGames(this.props.tournamentId);
        this.setState({ games: games, loading: false });
    }

    public render() {
        let contents = this.state.loading
            ? <Loader />
            : this.state.games.length > 0
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
                        this.state.games.map((game, index) => (
                            <GameTableLive key={game.id} game={game} />
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