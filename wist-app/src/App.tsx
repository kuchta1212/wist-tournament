import React from 'react';
import { Route } from 'react-router';
import { NavMenu } from './components/NavMenu'
import { Layout } from './components/Layout'
import { Main } from './components/Main'
import { Switch } from 'react-router-dom';
import { TournamentLive } from './components/tournament/TournamentLive'
import { GameLive } from './components/game/GameLive'

function App() {
    return (
        <div className="App text-light">
           <Layout>
                <Switch>
                        <Route exact path='/' component={Main} />
                        <Route path="/tournament-live/:tournamentId" component={TournamentLive} />
                        <Route path="/game-live/:gameId" component={GameLive} />
                    </Switch>
            </Layout>
        </div>
  );
}

export default App;
