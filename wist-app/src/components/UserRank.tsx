import * as React from 'react';
import { User } from "../typings/index"
import { getApi } from "./api/ApiFactory"
import { Table } from 'reactstrap';
import { Loader } from './Loader'

interface RankProps {
    clickable: boolean;
    userSelected: (id: string, added: boolean) => void;
}

interface RankState {
    users: User[];
    selectedUsers: string[];
    loading: boolean;
}

export class Rank extends React.Component<RankProps, RankState> {

    constructor(props: RankProps) {
        super(props);

        this.state = {
            users: [],
            loading: true,
            selectedUsers: [],
        };
    }

    public async componentDidMount() {
        const users = await getApi().getUsers();
        this.setState({ users: users, loading: false });
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

    private renderRanking() {
        return (
            <Table className="text-light">
                <thead>                    
                </thead>
                <tbody>
                    {this.state.users.map((user, index) => (
                        <tr key={user.id} className={this.isUserSelected(user.id) ? "bg-success" : ""} onClick={() => this.onUserClick(user.id)}>
                            <td>{index + 1}. {user.name}</td>
                            <td>{user.points}</td>
                        </tr>)
                    )}
                </tbody>
            </Table>
        );
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