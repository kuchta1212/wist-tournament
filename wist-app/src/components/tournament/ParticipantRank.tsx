import * as React from 'react';
import { Participant, TournamentPoints, User } from "../../typings/index"
import { getApi } from "./../api/ApiFactory"
import { Table } from 'reactstrap';
import { Loader } from './../Loader'
import newIcon from './../../images/new.svg';
import { Rank } from './../UserRank';


interface ParticipantRankProps {
    tournamentId: string;
    participants: Participant[];
    realod: () => void;
}

interface ParticipantRankState {
    selectedParticipant: string;
    showNewForm: boolean;
    showRemoveButton: boolean;
    clickable: boolean;
}

export class ParticipantRank extends React.Component<ParticipantRankProps, ParticipantRankState> {

    constructor(props: ParticipantRankProps) {
        super(props);

        this.state = {
            selectedParticipant: "",
            showNewForm: false,
            clickable: false,
            showRemoveButton: false
        };
    }

    public render() {
        return (
            <div>
                <h1 id="tabelLabel" >Turnajové pořadí</h1>
                {this.renderRanking()}
            </div>
        );
    }

    private renderRanking() {
        return (
            <div>
                {this.state.showRemoveButton ? this.renderRemoveButton() : null}
                <Table className="user-rank text-light">
                    <thead>
                    </thead>
                    <tbody>
                        {this.props.participants.filter(p => !p.left).sort((p1, p2) => this.sortParticipants(p1.tournamentPoints, p2.tournamentPoints)).map((participant, index) => (
                            <tr key={participant.id} className={this.isParticipantSelected(participant.id) ? "bg-danger" : ""} onClick={() => this.onParticipantClick(participant.id)}>
                                <td>{index + 1}.</td>
                                <td>{participant.user.name}</td>
                                <td>{participant.tournamentPoints.avaragePlace}</td>
                                <td>{participant.tournamentPoints.pointMedian}</td>
                                <td>{participant.tournamentPoints.pointAvg}</td>
                                <td>{participant.tournamentPoints.totalPoints}</td>
                            </tr>)
                        )}
                        {this.renderNewRow()}
                    </tbody>
                </Table>

                {this.state.showNewForm ? <Rank selectAllPosibility={false} clickable={true} userSelected={this.userSelected.bind(this)} /> : null}

                <Table className="user-rank text-light">
                    <thead>
                    </thead>
                    <tbody>
                        {this.props.participants.filter(p => p.left).map((participant, index) => (
                            <tr key={participant.id} className="participant-left">
                                <td></td>
                                <td>{participant.user.name}</td>
                                <td>{participant.tournamentPoints.avaragePlace}</td>
                                <td>{participant.tournamentPoints.pointMedian}</td>
                                <td>{participant.tournamentPoints.pointAvg}</td>
                                <td>{participant.tournamentPoints.totalPoints}</td>
                            </tr>)
                        )}
                    </tbody>
                </Table>
            </div>
        );
    }

    private renderNewRow() {
        return (
            <React.Fragment>
                <tr>
                    <td></td>
                    <td>
                        <img className="card-img-top new-icon" src={newIcon} alt="Nový hráč" onClick={() => this.createNewUserClick()} />
                    </td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
            </React.Fragment>
        )
    }

    private renderRemoveButton() {
        return (
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => this.removeParticipant()}>Smazat hráče</button>
        );
    }

    private sortParticipants(p1: TournamentPoints, p2: TournamentPoints): number {
        //return r1.roundNumber > r2.roundNumber ? 1 : -1
        if (p1.totalPoints > p2.totalPoints) {
            return 1;
        } else if (p1.totalPoints < p2.totalPoints) {
            return -1;
        }

        if (p1.avaragePlace > p2.avaragePlace) {
            return 1;
        } else if(p1.avaragePlace < p2.avaragePlace) {
            return -1;
        }

        if (p1.pointMedian > p2.pointMedian) {
            return 1;
        } else if (p1.pointMedian < p2.pointMedian) {
            return -1;
        }

        if (p1.pointAvg > p2.pointAvg) {
            return 1;
        } else if (p1.pointAvg < p2.pointAvg) {
            return -1;
        }

        return 1;
    }

    private createNewUserClick() {
        this.setState({ showNewForm: !this.state.showNewForm });
    }

    private closeModal() {
        this.setState({ showNewForm: false });
    }

    private onParticipantClick(id: string) {
        if (this.isParticipantSelected(id)) {
            this.setState({ selectedParticipant: "", showRemoveButton: false });

        } else {
            this.setState({ selectedParticipant: id, showRemoveButton: true });
        }
    }

    private isParticipantSelected(id: string): boolean {
        return this.state.selectedParticipant === id
    }

    private async userSelected(userId: string, added: boolean) {
        await getApi().addParticipant(this.props.tournamentId, userId);
        this.props.realod();
    }

    private async removeParticipant() {
        await getApi().removeParticipant(this.props.tournamentId, this.state.selectedParticipant);
        this.props.realod();
    }
}