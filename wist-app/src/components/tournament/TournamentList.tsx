import * as React from 'react'
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
        await this.getData();
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
                    <TournamentBox key={tournament.id} tournament={tournament} isNew={false} reload={this.reload.bind(this)}/>
                ))}
                <TournamentBox tournament={{} as Tournament} isNew={true} reload={this.reload.bind(this)} />
            </div>
        );
    }

    private async getData() {
        const tournaments = await getApi().getTournaments();
        this.setState({ tournaments: tournaments, loading: false });
    }

    private reload() {
        this.setState({ loading: true });
        this.getData();
    }
}