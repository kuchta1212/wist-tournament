﻿import * as React from 'react';
import { Tournament } from "../../typings/index"
import { Link } from 'react-router-dom';
import newIcon from './../../images/new.svg';
import podium from './../../images/podium.svg'
import { TournamentModal } from './TournamentModal'
import { TournamentPage } from './TournamentPage';
import { Collapse } from 'react-collapse'

interface TournamentBoxProps {
    tournament: Tournament;
    isNew: boolean;
    reload: () => void;
}

interface TournamentBoxState {
    showNewForm: boolean
}

export class TournamentBox extends React.Component<TournamentBoxProps, TournamentBoxState> {

    constructor(props: TournamentBoxProps) {
        super(props);

        this.state = {
            showNewForm: false,
        }
    }

    public render() {
        const cardBody = this.props.isNew
            ? this.renderNewBox()
            : this.renderTournamentBox();

        return (
            <div className="col">
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
                {this.state.showNewForm ? <TournamentModal close={this.closeModal.bind(this)} add={this.props.reload.bind(this)} /> : null}
            </div>
        );
    }

    private renderTournamentBox() {
        return (
            <Link className="link-box" to={`/tournament/${this.props.tournament.id}`}>
                    <div className="card tournament-box bg-secondary">
                        <div className="card-body">
                            <h5 className="card-title text-dark">{this.props.tournament.name}</h5>
                            <h6 className="card-subtitle mb-2 text-dark">{this.props.tournament.date}</h6>
                            { this.renderTopThree()}
                        </div>
                        <img className="card-img-bottom podium-icon" src={podium} alt="Nový turnaj" />
                    </div>
                </Link>
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
}