import * as React from 'react';
import { GameType, Tournament, TournamentStatus } from "../../typings/index"
import { getApi } from './../api/ApiFactory';
import { Loader } from './../Loader'
import { GameList } from './../game/GameList'
import { RouteComponentProps } from 'react-router-dom';
import { ParticipantRank } from './ParticipantRank';
import { TournamentLive } from './TournamentLive';


interface TournamentPageParams {
    tournamentId: string;
    status: string
}

interface TournamentPageState {
    status: TournamentStatus
}

export class TournamentPage extends React.Component<RouteComponentProps<TournamentPageParams>, TournamentPageState> {

    constructor(props: RouteComponentProps<TournamentPageParams>) {
        super(props);

        this.state = {
            status: parseInt(this.props.match.params.status)
        }
    }

    public render() {
        return (
            <div className="tournament-page text-light">
                <div className="row">
                    <div className="col-8">
                        <h2>První kolo</h2>
                        <GameList type={GameType.FirstRound} tournamentId={this.props.match.params.tournamentId} tournamentStatus={this.state.status} />
                        <h2>Druhé kolo</h2>
                        <GameList type={GameType.SecondRound} tournamentId={this.props.match.params.tournamentId} tournamentStatus={this.state.status} />
                        <h2>Třetí kolo</h2>
                        <GameList type={GameType.ThirdRound} tournamentId={this.props.match.params.tournamentId} tournamentStatus={this.state.status} />
                        <h2>Finálové kolo</h2>
                        <GameList type={GameType.FinalRound} tournamentId={this.props.match.params.tournamentId} tournamentStatus={this.state.status} />
                    </div>
                    <div className="col-4">
                        <ParticipantRank tournamentId={this.props.match.params.tournamentId} tournamentStatus={this.state.status} />
                    </div>
                </div>
                {
                    this.state.status == TournamentStatus.inProgess
                        ? <div id="live" className="row"><TournamentLive tournamentId={this.props.match.params.tournamentId} /></div>
                        : null
                }
            </div>
        );
        
    }
}