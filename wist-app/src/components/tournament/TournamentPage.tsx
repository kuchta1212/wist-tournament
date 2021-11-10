import * as React from 'react';
import { GameType, Tournament } from "../../typings/index"
import { getApi } from './../api/ApiFactory';
import { Loader } from './../Loader'
import { TournamentControlPanel } from './TournamentControlPanel'
import { GameList } from './../game/GameList'
import { RouteComponentProps } from 'react-router-dom';
import { ParticipantRank } from './ParticipantRank';
import { TournamentLive } from './TournamentLive';


interface TournamentPageParams {
    tournamentId: string;
}

interface TournamentPageState {
    loading: boolean;
    tournament: Tournament;
}

export class TournamentPage extends React.Component<RouteComponentProps<TournamentPageParams>, TournamentPageState> {

    constructor(props: RouteComponentProps<TournamentPageParams>) {
        super(props);

        this.state = {
            loading: true,
            tournament: {} as Tournament
        }
    }

    public async componentDidMount() {
        await this.getData();
    }

    public render() {
        let contents = this.state.loading
            ? <Loader />
            : this.renderContent()

        return (
            <div className="tournament-page text-light">
                {contents}
            </div>
        );
    }

    private renderContent() {
        return (
            <div>
                <div className="row">
                    <div className="col">
                        <h2>První kolo</h2>
                        <GameList games={!!this.state.tournament.games ? this.state.tournament.games.filter(g => g.type == GameType.FirstRound) : []} />
                        <h2>Druhé kolo</h2>
                        <GameList games={!!this.state.tournament.games ? this.state.tournament.games.filter(g => g.type == GameType.SecondRound) : []} />
                        <h2>Třetí kolo</h2>
                        <GameList games={!!this.state.tournament.games ? this.state.tournament.games.filter(g => g.type == GameType.ThirdRound) : []} />
                        <h2>Finálové kolo</h2>
                        <GameList games={!!this.state.tournament.games ? this.state.tournament.games.filter(g => g.type == GameType.FinalRound) : []} />
                    </div>
                    <div className="col col-lg-2">
                        <ParticipantRank realod={this.reloadPage.bind(this)} participants={this.state.tournament.participants} tournamentId={this.state.tournament.id} />
                    </div>
                </div>
                <div id="live-mode" className="row">
                    <TournamentLive tournamentId={this.state.tournament.id} />
                </div>
            </div>
        );
        
    }

    private async getData() {
        const tournament = await getApi().getTournament(this.props.match.params.tournamentId);
        this.setState({ tournament: tournament, loading: false });
    }

    private async reloadPage() {
        this.setState({ loading: true });
        await this.getData();
    }
}