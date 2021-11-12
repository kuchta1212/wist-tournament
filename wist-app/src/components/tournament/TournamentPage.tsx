import * as React from 'react';
import { GameType, Tournament } from "../../typings/index"
import { getApi } from './../api/ApiFactory';
import { Loader } from './../Loader'
import { GameList } from './../game/GameList'
import { RouteComponentProps } from 'react-router-dom';
import { ParticipantRank } from './ParticipantRank';
import { TournamentLive } from './TournamentLive';


interface TournamentPageParams {
    tournamentId: string;
}

interface TournamentPageState {

}

export class TournamentPage extends React.Component<RouteComponentProps<TournamentPageParams>, TournamentPageState> {

    constructor(props: RouteComponentProps<TournamentPageParams>) {
        super(props);
    }

    public render() {
        return (
            <div className="tournament-page text-light">
                <div className="row">
                    <div className="col">
                        <h2>První kolo</h2>
                        <GameList type={GameType.FirstRound} tournamentId={this.props.match.params.tournamentId} />
                        <h2>Druhé kolo</h2>
                        <GameList type={GameType.SecondRound} tournamentId={this.props.match.params.tournamentId} />
                        <h2>Třetí kolo</h2>
                        <GameList type={GameType.ThirdRound} tournamentId={this.props.match.params.tournamentId} />
                        <h2>Finálové kolo</h2>
                        <GameList type={GameType.FinalRound} tournamentId={this.props.match.params.tournamentId} />
                    </div>
                    <div className="col col-lg-2">
                        <ParticipantRank tournamentId={this.props.match.params.tournamentId} />
                    </div>
                </div>
                {/*<div id="live" className="row">*/}
                {/*    <TournamentLive tournamentId={this.props.match.params.tournamentId} />*/}
                {/*</div>*/}
            </div>
        );
        
    }
}