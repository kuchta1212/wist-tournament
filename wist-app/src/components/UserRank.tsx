import * as React from 'react';
import { User } from "../typings/index"
import { getApi } from "./api/ApiFactory"
import { Table } from 'reactstrap';
import { Loader } from './Loader'

interface RankProps {
}

interface RankState {
    users: User[];
    loading: boolean;
}

export class Rank extends React.Component<RankProps, RankState> {

    constructor(props: RankProps) {
        super(props);

        this.state = {
            users: {} as User[],
            loading: true
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
            <div className="col-4 text-light">
                <h1 id="tabelLabel" >Celkové pořadí</h1>
                {contents}
            </div>
        );
    }

    private renderRanking() {
        return (
            <Table>
                <thead>                    
                </thead>
                <tbody>
                    {this.state.users.map((user, index) => (
                        <tr key={user.id}>
                            <td>{index + 1}. {user.name}</td>
                            <td>{user.points}</td>
                        </tr>)
                    )}
                </tbody>
            </Table>
        );
    }
}