import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Game } from "../../typings/index"
import { getApi } from './../api/ApiFactory';
import { Loader } from './../Loader'
import { GameOrder } from './GameOrder'
import { GameTable } from './GameTable'

interface GameLiveState {
    game: Game;
    loading: boolean;
}

interface GameParams {
    gameId: string
}

export class GameLive extends React.Component<RouteComponentProps<GameParams>, GameLiveState> {

    constructor(props: RouteComponentProps<GameParams>) {
        super(props);

        this.state = {
            game: {} as Game,
            loading: true
        }
    }

    public componentDidMount() {
        this.getData();
    }

    public render() {
        let contents = this.state.loading
            ? <Loader />
            : this.didGameStarted()
                ? <GameTable game={this.state.game} />
                : <GameOrder players={this.state.game.players} gameId={this.state.game.id} reload={this.reload.bind(this)} />

        return (
            <div className="game-live text-light">
                {contents}
            </div>
        );
    }

    private didGameStarted(): boolean {
        return this.state.game.players.filter(p => p.gameRank != 0).length != 0;
    }

    private async getData() {
        const game = await getApi().getGame(this.props.match.params.gameId);
        this.setState({ game: game, loading: false });
    }

    private reload() {
        this.setState({ loading: true });
        this.getData();
    }
}