import * as React from 'react';
import { Tournament } from "../../typings/index"
import newIcon from './../../images/new.svg';
import podium from './../../images/podium.svg'
import { TournamentModal } from './TournamentModal'
import { TournamentPage } from './TournamentPage';
import { TournamentControlPanel } from './TournamentControlPanel';
import { Collapse } from 'react-collapse'

interface TournamentBoxProps {
    tournament: Tournament;
    isNew: boolean;
    tournamentAdded: () => void;
}

interface TournamentBoxState {
    showNewForm: boolean
    showTournamentPage: boolean;
}

export class TournamentBox extends React.Component<TournamentBoxProps, TournamentBoxState> {

    constructor(props: TournamentBoxProps) {
        super(props);

        this.state = {
            showNewForm: false,
            showTournamentPage: false,
        }
    }

    public render() {
        const cardBody = this.props.isNew
            ? this.renderNewBox()
            : this.renderTournamentBox();

        return (
            <div>
                {cardBody}
            </div>
        );
    }

    private renderNewBox() {
        return (
            <div>
                <div className="card tournament-box bg-secondary" onClick={() => this.clickOnNewBox()}>
                    <img className="card-img-top new-icon" src={newIcon} alt="Nový turnaj" />
                </div>
                {this.state.showNewForm ? <TournamentModal close={this.closeModal.bind(this)} add={this.props.tournamentAdded.bind(this)} /> : null}
            </div>
        );
    }

    private renderTournamentBox() {
        return (
            <div>
                <div className="card tournament-box bg-secondary" onClick={() => this.clickOnBox()}>
                    <div className="card-body">
                        <h5 className="card-title text-dark">{this.props.tournament.name}</h5>
                        <h6 className="card-subtitle mb-2 text-dark">{this.props.tournament.date}</h6>
                        { this.renderTopThree()}
                    </div>
                    <img className="card-img-bottom podium-icon" src={podium} alt="Nový turnaj" />
                </div>
                {this.state.showTournamentPage ? <TournamentPage tournamentId={this.props.tournament.id} /> : null}
            </div>
        );
    }

    private renderTopThree() {
        return (
            <div>
                {this.props.tournament.winners.map((winner, index) => (
                    <p key={winner.id} className="podium-winners">{winner.user.name}</p>
                ))}
            </div>
        )
    }

    private closeModal() {
        this.setState({ showNewForm: false });
    }

    private clickOnNewBox() {
        this.setState({ showNewForm: !this.state.showNewForm });
    }

    private clickOnBox() {
        this.setState({ showTournamentPage: !this.state.showTournamentPage });
    }
}