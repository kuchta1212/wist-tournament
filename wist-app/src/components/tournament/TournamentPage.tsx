import * as React from 'react';
import { Tournament } from "../../typings/index"
import newIcon from './../../images/new.svg';
import podium from './../../images/podium.svg';
import { getApi } from './../api/ApiFactory';
import { Loader } from './../Loader'
import { TournamentControlPanel } from './TournamentControlPanel'
import { GameList } from './../game/GameList'

interface TournamentPageProps {
    tournamentId: string;
}

interface TournamentPageState {
    loading: boolean;
    tournament: Tournament;
}

export class TournamentPage extends React.Component<TournamentPageProps, TournamentPageState> {

    constructor(props: TournamentPageProps) {
        super(props);

        this.state = {
            loading: true,
            tournament: {} as Tournament
        }
    }

    public async componentDidMount() {
        const tournament = await getApi().getTournament(this.props.tournamentId);
        this.setState({ tournament: tournament, loading: false });
    }

    public render() {
        let contents = this.state.loading
            ? <Loader />
            : <GameList games={!!this.state.tournament.games ? this.state.tournament.games : []} />

        return (
            <div className="col text-light">
                <TournamentControlPanel tournament={this.state.tournament} />
                {contents}
            </div>
        );
    }
}