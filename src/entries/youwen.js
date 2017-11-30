import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router, Route, Redirect, Switch
} from 'react-router-dom';
// require('./config/config');

import Login from '../routes/User/Login';

class App extends React.Component {

  render () {
    return (
      <Switch>
        {/* 首页 */}
        <Route exact component={Login} path="/"></Route>
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

// let _basename = "/bidacard";
// // 本地环境需要更改根路径
// if (window.location.origin == "http://localhost:8080") {
//   _basename = "/src/bidacard";
// }

ReactDOM.render(
  <Router getUserConfirmation={getConfirmation} basename="/youwen">
    <App/>
  </Router>
  , document.getElementById('youwen'));
