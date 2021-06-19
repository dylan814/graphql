
import React, {Component} from 'react'
import { Route, Switch } from "react-router-dom";

import Home from './components/Home'
import GraphQL from './components/GraphQL'
import Signup from './components/Signup'






const MainRouter = () => (
    <div>
        
        <Switch>
            <Route exact path="/" component={Home} />
            <Route match exact path="/signup" component={Signup} />

            
        </Switch>
    </div>
);

export default MainRouter;