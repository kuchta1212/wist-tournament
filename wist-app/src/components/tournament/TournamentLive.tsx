import * as React from 'react';
import { Tournament } from "../../typings/index"
import { getApi } from './../api/ApiFactory';
import { Loader } from './../Loader'
import { GameList } from './../game/GameList'
import { RouteComponentProps, RouteProps } from 'react-router-dom';

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

    public async componentDidMount() {
        //const id = this.props.match.params.id;
        //const tournament = await getApi().getTournament(this.props.tournamentId);
        //this.setState({ tournament: tournament, loading: false });
    }

    public render() {
        //let contents = this.state.loading
        //    ? <Loader />
        //    : <GameList games={!!this.state.tournament.games ? this.state.tournament.games : []} />

        return (
            <div className="tournament-page text-light">
                <h5><a id="live">Hello from tournament live {this.state.tournamentId}</a></h5>
            </div>
        );
    }
}