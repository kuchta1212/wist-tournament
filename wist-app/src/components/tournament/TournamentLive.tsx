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
            <div className="row live">
                <div className="col">
                    <h2>První kolo</h2>
                    <GameListLive type={GameType.FirstRound} tournamentId={this.props.tournamentId} />
                    <h2>Druhé kolo</h2>
                    <GameListLive type={GameType.SecondRound} tournamentId={this.props.tournamentId} />
                    <h2>Třetí kolo</h2>
                    <GameListLive type={GameType.ThirdRound} tournamentId={this.props.tournamentId} />
                    <h2>Finálové kolo</h2>
                    <GameListLive type={GameType.FinalRound} tournamentId={this.props.tournamentId} />
                </div>
            </div>
        );
    }
}