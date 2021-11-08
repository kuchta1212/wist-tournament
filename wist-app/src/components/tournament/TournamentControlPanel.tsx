import * as React from 'react';
import { Link } from 'react-router-dom';
import { Tournament } from "../../typings/index"
import { getApi } from "./../api/ApiFactory"
import { Collapse, Container, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';

interface TournamentControlPanelProps {
    tournament: Tournament
    reloadPage: () => void;
}

interface TournamentControlPanelState {
    collapsed: boolean;
}

export class TournamentControlPanel extends React.Component<TournamentControlPanelProps, TournamentControlPanelState> {

    constructor(props: TournamentControlPanelProps) {
        super(props);

        this.state = {
            collapsed: false,
        };
    }

    public render() {
        return (
        //    <div className="row">
        //        <div className="col">
        //            <button type="button" className="btn btn-secondary" onClick={() => this.createNextRound()}>Další kolo</button>
        //        </div>
        //        <div className="col">
        //            <button type="button" className="btn btn-secondary" onClick={() => this.createFinalRound()}>Finální kolo</button>
        //        </div>
        //        <div className="col">
        //            <button type="button" className="btn btn-secondary" onClick={() => this.delete()}>Smazat</button>
        //        </div>
        //        <div className="col">
        //            <button type="button" className="btn btn-secondary" onClick={() => this.addParticipant()}>Přidat účastníka</button>
        //        </div>
        //        <div className="col">
        //            <button type="button" className="btn btn-secondary" onClick={() => this.removeParticipant()}>Odebrat účastníka</button>
        //        </div>
        //        <div className="col">
        //            <Link to={`/tournament-live/${this.props.tournament.id}`}>
        //                <button type="button" className="btn btn-success">LIVE</button>
        //            </Link>
        //        </div>
        //    </div>
            <header>
                <Navbar className="navbar-expand-sm navbar-toggleable-sm ng-white border-bottom box-shadow mb-3" light>
                    <Container>
                        <NavbarBrand tag={Link} to="/">Project1</NavbarBrand>
                        <NavbarToggler onClick={this.toggleNavbar} className="mr-2" />
                        <Collapse className="d-sm-inline-flex flex-sm-row-reverse" isOpen={!this.state.collapsed} navbar>
                            <ul className="navbar-nav flex-grow">
                                <NavItem>
                                    <NavLink className="text-dark" onClick={() => this.createNextRound()}>Další kolo</NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink className="text-dark" onClick={() => this.createFinalRound()}>Finální kolo</NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink className="text-dark" to="/" onClick={() => this.delete()}>Smazat</NavLink>
                                </NavItem>
                            </ul>
                        </Collapse>
                    </Container>
                </Navbar>
            </header>

        );
    }

    private toggleNavbar() {
        this.setState({
            collapsed: !this.state.collapsed
        });
    }

    private createNextRound() {
        getApi().createNextRound(this.props.tournament.id);
        this.props.reloadPage();
    }

    private createFinalRound() {
        getApi().createFinalRound(this.props.tournament.id)
        this.props.reloadPage();
    }

    private async delete() {
        await getApi().deleteTournament(this.props.tournament.id)
    }

    private addParticipant() {
        alert("Nefunguje");
    }

    private removeParticipant() {
        alert("Nefunguje");
    }
}