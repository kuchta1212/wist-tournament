import * as React from 'react';
import { Tournament } from '../../typings';
import { getApi } from "./../api/ApiFactory"
import { Rank } from './../UserRank'

interface TournamentControlPanelProps {
    tournament: Tournament
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
                    <button type="button" className="btn btn-success" onClick={() => this.removeParticipant()}>LIVE</button>
                </div>
            </div>
        );
    }

    private createNextRound() {

    }

    private createFinalRound() {

    }

    private delete() {

    }

    private addParticipant() {

    }

    private removeParticipant() {

    }
}