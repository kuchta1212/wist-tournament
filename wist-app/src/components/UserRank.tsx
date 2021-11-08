import * as React from 'react';
import { User } from "../typings/index"
import { getApi } from "./api/ApiFactory"
import { Table } from 'reactstrap';
import { Loader } from './Loader'
import newIcon from './../images/new.svg';
import { NewUserModal } from './NewUserModal';


interface RankProps {
    clickable: boolean;
    selectAllPosibility: boolean;
    userSelected: (id: string, added: boolean) => void;
}

interface RankState {
    users: User[];
    selectedUsers: string[];
    loading: boolean;
    showNewForm: boolean;
}

export class Rank extends React.Component<RankProps, RankState> {

    constructor(props: RankProps) {
        super(props);

        this.state = {
            users: [],
            loading: true,
            selectedUsers: [],
            showNewForm: false,
        };
    }

    public async componentDidMount() {
        this.loadData();
    }

    public render() {
        let contents = this.state.loading
            ? <Loader />
            : this.renderRanking()

        return (
            <div>
                {this.props.clickable ? <h5 id="tabelLabel" >Vyber účastníky</h5> : <h1 id="tabelLabel" >Celkové pořadí</h1>}
                {contents}
            </div>
        );
    }

    private async loadData() {
        const users = await getApi().getUsers();
        this.setState({ users: users, loading: false });
    }

    private renderRanking() {
        return (
            <div>
                {this.props.selectAllPosibility ? this.renderSelectAllButton() : null}
                <Table className="user-rank text-light">
                <thead>                    
                </thead>
                <tbody>
                    {this.state.users.map((user, index) => (
                        <tr key={user.id} className={this.isUserSelected(user.id) ? "bg-success" : ""} onClick={() => this.onUserClick(user.id)}>
                            <td>{index + 1}.</td>
                            <td>{user.name}</td>
                            <td>{user.points}</td>
                        </tr>)
                    )}
                    {!this.props.clickable ? this.renderNewRow() : null}
                </tbody>
            </Table>
            { this.state.showNewForm ? <NewUserModal close={this.closeModal.bind(this)} add={this.userAdded.bind(this)} /> : null }
            </div>
        );
    }

    private renderSelectAllButton() {
        return (
            <div className="btn-group-toggle" data-toggle="buttons" onClick={() => this.selectAll()}>
                <label className="btn btn-secondary active">
                    <input type="checkbox" /> Označit vše
                </label>
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
                </tr>
            </React.Fragment>
        )
    }

    private selectAll() {
        if (this.state.selectedUsers.length == 0) {
            const allUsersIds = this.state.users.map((user) => { return user.id })
            this.setState({ selectedUsers: this.state.selectedUsers.concat(allUsersIds) })
        } else {
            this.setState({selectedUsers: []})
        }
    }

    private createNewUserClick() {
        this.setState({ showNewForm: !this.state.showNewForm });
    }

    private closeModal() {
        this.setState({ showNewForm: false });
    }

    private userAdded() {
        this.setState({ loading: true });
        this.loadData();
    }

    private onUserClick(id: string) {
        if (this.props.clickable) {
            if (this.isUserSelected(id)) {
                this.props.userSelected(id, false);
                this.setState({ selectedUsers: this.state.selectedUsers.filter(function (selectedUser) {
                        return selectedUser !== id
                    })
                });
            } else {
                this.props.userSelected(id, true);
                this.setState({ selectedUsers: this.state.selectedUsers.concat([id]) });
            }
        }
    }

    private isUserSelected(id: string): boolean {
        return this.state.selectedUsers.indexOf(id) > -1;
    }
}