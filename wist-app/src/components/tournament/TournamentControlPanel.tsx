import { get } from 'https';
import * as React from 'react';
import { Link } from 'react-router-dom';
import { Tournament } from '../../typings';
import { getApi } from "./../api/ApiFactory"
import { Rank } from './../UserRank'

interface TournamentControlPanelProps {
    tournament: Tournament
    reload: () => void;
}

interface TournamentControlPanelState {
}

export class TournamentControlPanel extends React.Component<TournamentControlPanelProps, TournamentControlPanelState> {

    constructor(props: TournamentControlPanelProps) {
        super(props);

        this.state = {
            send: false,
            name: "",
            selectedUsers: []
        };
    }

    public render() {
        return (
            <div className="row">
                <div className="col">
                    <button type="button" className="btn btn-secondary" onClick={() => this.createNextRound()}>Další kolo</button>
                </div>
                <div className="col">
                    <button type="button" className="btn btn-secondary" onClick={() => this.createFinalRound()}>Finální kolo</button>
                </div>
                <div className="col">
                    <button type="button" className="btn btn-secondary" onClick={() => this.delete()}>Smazat</button>
                </div>
                <div className="col">
                    <button type="button" className="btn btn-secondary" onClick={() => this.addParticipant()}>Přidat účastníka</button>
                </div>
                <div className="col">
                    <button type="button" className="btn btn-secondary" onClick={() => this.removeParticipant()}>Odebrat účastníka</button>
                </div>
                <div className="col">
                    <Link to={`/tournament-live/${this.props.tournament.id}`}>
                        <button type="button" className="btn btn-success">LIVE</button>
                    </Link>
                </div>
            </div>
        );
    }

    private createNextRound() {
        getApi().createNextRound(this.props.tournament.id);
        this.props.reload();
    }

    private createFinalRound() {
        getApi().createFinalRound(this.props.tournament.id)
        this.props.reload();
    }

    private delete() {
        getApi().deleteTournament(this.props.tournament.id)
        this.props.reload();
    }

    private addParticipant() {
        alert("Nefunguje");
    }

    private removeParticipant() {
        alert("Nefunguje");
    }
}