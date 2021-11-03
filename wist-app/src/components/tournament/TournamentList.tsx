import * as React from 'react';
import { Tournament, User } from "../../typings/index"
import { getApi } from "../api/ApiFactory"
import { Loader } from '../Loader'
import { TournamentBox } from './TournamentBox'
import './Tournament.css'

interface TournamentListProps {
}

interface TournamentListState {
    tournaments: Tournament[];
    loading: boolean;
}

export class TournamentList extends React.Component<TournamentListProps, TournamentListState> {

    constructor(props: TournamentListProps) {
        super(props);

        this.state = {
            tournaments: {} as Tournament[],
            loading: true
        };
    }

    public async componentDidMount() {
        const tournaments = await getApi().getTournaments();
        this.setState({ tournaments: tournaments, loading: false });
    }

    public render() {
        let contents = this.state.loading
            ? <Loader />
            : this.renderList()

        return (
            <div className="text-light">
                {contents}
            </div>
        );
    }

    private renderList() {
        return (
            <div className="tournament-list">
                {this.state.tournaments.map((tournament, index) => (
                    <TournamentBox key={tournament.id} tournament={tournament} isNew={false} tournamentAdded={() => { return;}}/>
                ))}
                <TournamentBox tournament={{} as Tournament} isNew={true} tournamentAdded={this.tournamentAdded.bind(this)} />
            </div>
        );
    }

    private tournamentAdded() {
        alert("added");
    }
}