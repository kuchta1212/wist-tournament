import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Game } from "../../typings/index"
import { getApi } from './../api/ApiFactory';
import { Loader } from './../Loader'
import { GameList } from './GameList'

interface GameLiveState {
    gameId: string;
}

interface GameParams {
    gameId: string
}

export class GameLive extends React.Component<RouteComponentProps<GameParams>, GameLiveState> {

    constructor(props: RouteComponentProps<GameParams>) {
        super(props);

        this.state = {
            gameId: this.props.match.params.gameId
        }
    }

    public async componentDidMount() {
        //const tournament = await getApi().getTournament(this.props.tournamentId);
        //this.setState({ tournament: tournament, loading: false });
    }

    public render() {
        //let contents = this.state.loading
        //    ? <Loader />
        //    : <GameList games={!!this.state.tournament.games ? this.state.tournament.games : []} />

        return (
            <div className="tournament-page text-light">
                <p>Hello from game live {this.state.gameId}</p>
            </div>
        );
    }
}