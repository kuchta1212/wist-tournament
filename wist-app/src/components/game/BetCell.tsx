import * as React from 'react';
import { Bet } from "../../typings/index"

interface BetCellState {
    state: BetCellStatus
}

enum BetCellStatus {
    none,
    success,
    failed
}

interface BetCellProps {
    bet: Bet
    onBetResultSet: (betId: string, isSuccess: boolean) => void;
}

export class BetCell extends React.Component<BetCellProps, BetCellState> {

    constructor(props: BetCellProps) {
        super(props);

        this.state = {
            state: BetCellStatus.none
        }
    }

    public render() {
        return (
            <td key={this.props.bet.id} className={this.state.state == BetCellStatus.success ? "bg-success" : this.state.state == BetCellStatus.failed ? "bg-danger" : ""}>
                <div className="input-group">
                    <input type="number" className="form-control" value={this.props.bet.tip} readOnly />
                    <div className="input-group-append" id="button-addon4">
                        <button className="btn btn-outline-success" type="button" onClick={() => this.success()}>👍</button>
                        <button className="btn btn-outline-danger" type="button" onClick={() => this.failed()}>👎</button>
                    </div>
                </div>
            </td>
        );
    }

    private success() {
        this.props.onBetResultSet(this.props.bet.id, true);
        this.setState({ state: BetCellStatus.success })
    }

    private failed() {
        this.props.onBetResultSet(this.props.bet.id, false);
        this.setState({ state: BetCellStatus.failed })
    }
}