import * as React from 'react';
import { Bet, BetStatus } from "../../typings/index"

interface BetCellProps {
    bet: Bet
    onBetResultSet: (betId: string, isSuccess: boolean) => void;
}

interface BetCellState {
    bet: Bet
}

export class BetCell extends React.Component<BetCellProps, BetCellState> {

    constructor(props: BetCellProps) {
        super(props);

        this.state = {
            bet: this.props.bet
        }
    }

    public render() {
        return (
            <td key={this.props.bet.id} className={this.state.bet.status == BetStatus.withResult ? this.state.bet.isSuccess ? "bg-success" : "bg-danger" : ""}>
                <div className="input-group">
                    <input type="number" className="form-control" value={this.getValue()} readOnly />
                    <div className="input-group-append" id="button-addon4">
                        <button className="btn btn-outline-success" type="button" onClick={() => this.success()}>👍</button>
                        <button className="btn btn-outline-danger" type="button" onClick={() => this.failed()}>👎</button>
                    </div>
                </div>
            </td>
        );
    }

    private getValue() {
        if (this.state.bet.status == BetStatus.withResult) {
            return this.state.bet.isSuccess ? this.props.bet.tip + 10 : this.props.bet.tip * (-1);
        }
        return this.props.bet.tip;
    }

    private success() {
        this.props.onBetResultSet(this.props.bet.id, true);
        const bet = this.state.bet;
        bet.isSuccess = true;
        bet.status = BetStatus.withResult;
        this.setState({ bet: bet });
    }

    private failed() {
        this.props.onBetResultSet(this.props.bet.id, false);
        const bet = this.state.bet;
        bet.isSuccess = false;
        bet.status = BetStatus.withResult;
        this.setState({ bet: bet });
    }
}