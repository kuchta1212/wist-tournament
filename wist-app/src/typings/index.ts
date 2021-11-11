export interface Tournament {
    id: string;
    name: string;
    date: string;
    participants: Participant[];
    winners: Participant[];
    games: Game[];
    isDone: boolean;
}

export interface Game {
    id: string;
    name: string;
    players: Player[];
    rounds: Round[];
    type: GameType;
    status: GameStatus;
}

export enum GameType {
    FirstRound,
    SecondRound,
    ThirdRound,
    FinalRound
}

export interface Participant {
    id: string;
    user: User;
    tournamentPoints: TournamentPoints;
    left: boolean;
}

export interface Player {
    id: string;
    participant: Participant;
    gameRank: number;
}

export interface Round {
    id: string;
    roundNumber: number;
    dealerNumber: number;
    amountOfCards: number;
    bets: Bet[];
    status: RoundStatus
}

export interface TournamentPoints {
    id: string;
    avaragePlace: number;
    pointMedian: number;
    pointAvg: number;
    totalPoints: number;
}

export interface GamePoints {
    id: string;
    points: number;
    amountOfDecks: number;
    Rank: number;
}

export interface User {
    id: string;
    name: string;
    points: number;
}

export interface Bet {
    id: string;
    tip: number;
    isSuccess: boolean;
    player: Player;
    status: BetStatus;
}

export enum RoundStatus {
    notStarted,
    betsAreSet,
    done
}

export enum GameStatus {
    notStarted,
    started,
    finished
}

export enum BetStatus {
    notSet,
    set,
    withResult
}

