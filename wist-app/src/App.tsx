import React from 'react';
import { Route } from 'react-router';
import { Layout } from './components/Layout'
import { Main } from './components/Main'
import { Switch } from 'react-router-dom';
import { TournamentLive } from './components/tournament/TournamentLive'
import { GameLive } from './components/game/GameLive'
import { TournamentPage } from './components/tournament/TournamentPage';
import { TournamentManualCreate } from './components/tournament/TournamentManualCreate';

function App() {
    return (
        <div className="App text-light">
           <Layout>
                <Switch>
                    <Route exact path='/' component={Main} />
                    <Route path="/tournament/:tournamentId/:status" component={TournamentPage} />
                    <Route path="/game-live/:gameId" component={GameLive} />
                    <Route path="/tournament/manual-create" component={TournamentManualCreate} />
                </Switch>
            </Layout>
        </div>
  );
}

export default App;
