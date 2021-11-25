import * as React from 'react';
import { Participant, TournamentPoints, TournamentStatus } from "../../typings/index"
import { getApi } from "./../api/ApiFactory"
import { Table } from 'reactstrap';
import { Loader } from './../Loader'
import newIcon from './../../images/new.svg';
import { Rank } from './../UserRank';
import { HubConnectionBuilder } from '@aspnet/signalr';


interface ParticipantRankProps {
    tournamentId: string;
    tournamentStatus: TournamentStatus
}

interface ParticipantRankState {
    loading: boolean;
    participants: Participant[];
    selectedParticipant: string;
    showNewForm: boolean;
    showRemoveButton: boolean;
    clickable: boolean;
    hubConnection: any
}

export class ParticipantRank extends React.Component<ParticipantRankProps, ParticipantRankState> {

    constructor(props: ParticipantRankProps) {
        super(props);

        this.state = {
            loading: true,
            participants: [],
            selectedParticipant: "",
            showNewForm: false,
            clickable: false,
            showRemoveButton: false,
            hubConnection: null
        };
    }

    public async componentDidMount() {
        const participants = await getApi().getTournamentParticipants(this.props.tournamentId);
        //const hubConnection = new HubConnectionBuilder().withUrl("https://wist-grandslam.azurewebsites.net/hubs/notifications").build();
        const hubConnection = new HubConnectionBuilder().withUrl("https://localhost:44340/hubs/notifications").build();

        this.setState({ hubConnection: hubConnection, participants: participants, loading: false }, () => {
            this.state.hubConnection
                .start()
                .then(() => console.log("Connection set up"))
                .catch(err => console.log("Error:" + err));

            this.state.hubConnection.on("GameFinished", async (message) => {
                this.setState({ loading: true });
                await this.getData();
            });

            this.state.hubConnection.on("TournamentFinished", async (tournamentId) => {
                if (this.props.tournamentId == tournamentId) {
                    this.setState({ loading: true });
                    await this.getData();
                }
            });
        });
    }

    private async getData() {
        const participants = await getApi().getTournamentParticipants(this.props.tournamentId);
        this.setState({ participants: participants, loading: false });
    }

    public render() {
        let contents = this.state.loading
            ? <Loader />
            : this.renderRanking()

        return (
            <div>
                <h1 id="tabelLabel" >Turnajové pořadí</h1>
                {contents}
            </div>
        );
    }

    private renderRanking() {
        return (
            <div>
                {this.state.showRemoveButton ? this.renderRemoveButton() : null}
                <Table className="user-rank text-light">
                    <thead>
                        <tr>
                            <th></th>
                            <th></th>
                            <th>Průměrně umístění</th>
                            <th>Počet vítězství</th>
                            <th>Bodový medián</th>
                            <th>Bodový průměr</th>
                            <th>Turnajový počet bodů</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.participants.filter(p => !p.left).sort((p1, p2) => this.sortParticipants(p1.tournamentPoints, p2.tournamentPoints)).map((participant, index) => (
                            <tr key={participant.id} className={this.getRowClass(participant.id, index+1)} onClick={() => this.onParticipantClick(participant.id)}>
                                <td>{index + 1}.</td>
                                <td>{participant.user.name}</td>
                                <td>{participant.tournamentPoints.avaragePlace}</td>
                                <td>{participant.tournamentPoints.amountOfVictories}</td>
                                <td>{participant.tournamentPoints.pointMedian}</td>
                                <td>{participant.tournamentPoints.pointAvg}</td>
                                <td>{participant.tournamentPoints.totalPoints}</td>
                            </tr>)
                        )}
                        {this.renderNewRow()}
                    </tbody>
                </Table>

                {this.state.showNewForm ? <Rank selectAllPosibility={false} clickable={true} userSelected={this.userSelected.bind(this)} usersSelected={(id, added) => { return; }} /> : null}

                <Table className="user-rank text-light">
                    <thead>
                    </thead>
                    <tbody>
                        {this.state.participants.filter(p => p.left).map((participant, index) => (
                            <tr key={participant.id} className="participant-left">
                                <td></td>
                                <td>{participant.user.name}</td>
                                <td>{participant.tournamentPoints.avaragePlace}</td>
                                <td>{participant.tournamentPoints.amountOfVictories}</td>
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
        return this.props.tournamentStatus === TournamentStatus.inProgess ? (
            <React.Fragment>
                <tr>
                    <td></td>
                    <td>
                        <img className="card-img-top new-icon" src={newIcon} alt="Nový hráč" onClick={() => this.createNewUserClick()} />
                    </td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
            </React.Fragment>
        ) : null;
    }

    private renderRemoveButton() {
        return (
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => this.removeParticipant()}>Smazat hráče</button>
        );
    }

    private sortParticipants(p1: TournamentPoints, p2: TournamentPoints): number {
        if (p1.totalPoints < p2.totalPoints) {
            return 1;
        } else if (p1.totalPoints > p2.totalPoints) {
            return -1;
        }

        if (p1.avaragePlace == 0) {
            return 1;
        }

        if (p2.avaragePlace == 0) {
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

    private onParticipantClick(id: string) {
        if (this.props.tournamentStatus == TournamentStatus.finished) {
            return;
        }

        if (this.isParticipantSelected(id)) {
            this.setState({ selectedParticipant: "", showRemoveButton: false });

        } else {
            this.setState({ selectedParticipant: id, showRemoveButton: true });
        }
    }

    private getRowClass(participantId: string, index: number) {
        let classes: string[] = [];
        switch (index) {
            case 1:
                classes.push("text-success")
                break;
            case 2:
                classes.push("text-warning")
                break;
            case 3:
                classes.push("text-info")
                break;
            default:
                break;
        }

        if (this.props.tournamentStatus == TournamentStatus.inProgess && this.isParticipantSelected(participantId)) {
            classes.push("bg-danger")
        }

        return classes.join(" ");
    }

    private isParticipantSelected(id: string): boolean {
        return this.state.selectedParticipant === id
    }

    private async userSelected(userId: string, added: boolean) {
        await getApi().addParticipant(this.props.tournamentId, userId);
        this.setState({ loading: true });
        await this.getData();
    }

    private async removeParticipant() {
        await getApi().removeParticipant(this.props.tournamentId, this.state.selectedParticipant);
        this.setState({ loading: true });
        await this.getData();
    }
}