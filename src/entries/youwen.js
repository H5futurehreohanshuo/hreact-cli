import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router, Route, Redirect, Switch
} from 'react-router-dom';
require('../polyfill'); // 兼容性垫片

import Login from '../routes/User/Login';
import { navData } from '../navs/youwen';

class App extends React.Component {

  render () {
    return (
      <Switch>
        {
          navData.map((value) =>
            <Route key={value.title} exact={value.exact} component={value.component} path={value.path}></Route>
          )
        }
        {/* 404页面 */}
        {/* <Route component={Component404} path='/404' />
        <Redirect from='*' to='/404' /> */}
      </Switch>
    );
  }
}

// 使用默认的确认函数
const getConfirmation = (message, callback) => {
  console.log(message);
  const allowTransition = window.confirm(message)
  callback(allowTransition)
};

ReactDOM.render(
  <Router getUserConfirmation={getConfirmation} basename="/youwen">
    <App/>
  </Router>
  , document.getElementById('youwen'));
