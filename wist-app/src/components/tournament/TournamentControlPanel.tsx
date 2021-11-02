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
                <button type="button" className="btn" onClick={() => this.createNextRound()}>Další kolo</button>
                <button type="button" className="btn" onClick={() => this.createFinalRound()}>Finální kolo</button>
                <button type="button" className="btn" onClick={() => this.delete()}>Smazat</button>
                <button type="button" className="btn" onClick={() => this.addParticipant()}>Přidat účastníka</button>
                <button type="button" className="btn" onClick={() => this.removeParticipant()}>Odebrat účastníka</button>
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