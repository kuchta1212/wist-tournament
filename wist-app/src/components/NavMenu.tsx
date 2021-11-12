import * as React from 'react';
import { Collapse, Container, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import './NavMenu.css';
import { getApi } from './api/ApiFactory';
import { RouteComponentProps, withRouter } from 'react-router-dom';

interface INavMenuState {
    collapsed: boolean;
}


class NavMenu extends React.Component<RouteComponentProps, INavMenuState> {
    static displayName = NavMenu.name;

    constructor(props: RouteComponentProps) {
        super(props);

        this.toggleNavbar = this.toggleNavbar.bind(this);
        this.state = {
            collapsed: true
        };
    }

    private toggleNavbar() {
        this.setState({
            collapsed: !this.state.collapsed
        });
    }

    public render() {
        return (
            <header>
                <Navbar className="navbar-expand-sm navbar-toggleable-sm ng-white border-bottom box-shadow mb-3" light>
                    <Container>
                        <NavbarBrand className="text-light" tag={Link} to="/">Wist Grandslam</NavbarBrand>
                        <NavbarToggler onClick={this.toggleNavbar} className="mr-2" />
                        {this.props.location.pathname.includes("tournament") ? this.renderActionButtons() : null}
                    </Container>
                </Navbar>
            </header>
        );
    }

    private renderActionButtons() {
        return (
            <Collapse className="d-sm-inline-flex flex-sm-row-reverse" isOpen={!this.state.collapsed} navbar>
                <ul className="navbar-nav flex-grow">
                    <NavItem>
                        <NavLink tag={Link} className="text-light" to="/" onClick={() => this.delete()}>Smazat</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink tag={Link} className="text-success" to={this.getLiveTournamentRoute()} onClick={() => this.toLive()}>Live</NavLink>
                    </NavItem>
                </ul>
            </Collapse>
        );
    }

    private getLiveTournamentRoute() {
        return "/tournament/" + this.props.location.pathname.substring(12) + "#live";
    }

    private toLive() {
        window.location.href = "#live";
    }

    private async delete() {
        await getApi().deleteTournament(this.props.location.pathname.substring(12))
        window.location.reload();
    }

}

export default withRouter(NavMenu);
