import * as React from 'react';
import { GameType, Tournament } from "../../typings/index"
import { getApi } from './../api/ApiFactory';
import { Loader } from './../Loader'
import { RouteComponentProps, RouteProps } from 'react-router-dom';
import { GameListLive } from '../game/GameListLive';

interface TournamentLiveState {
    tournamentId: string
}


interface TournamentParam {
    tournamentId: string
}

export class TournamentLive extends React.Component<TournamentParam, TournamentLiveState> {

    constructor(props: TournamentParam) {
        super(props);

        this.state = {
            tournamentId: this.props.tournamentId
        }
    }

    public render() {
        return (
            <div className="live-page">
                <h3>
                    LIVE
                    <svg height="100" width="100" className="blinking">
                        <circle cx="50" cy="50" r="10" fill="red" />
                    </svg>
                </h3>
            <div className="row">
                <div className="col">
                    <GameListLive type={GameType.FirstRound} tournamentId={this.props.tournamentId} />
                </div>
                </div>
            </div>
        );
    }
}