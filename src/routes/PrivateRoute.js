import {Route, Link} from 'react-router-dom';
import {getItem} from '../utils/AsyncUtils';

const isLogin = () => (getItem('username') ? true : false);
const PrivateRoute = ({component: Component, ...rest}) => {
  // Show the component only when the user is logged in
  // Otherwise, redirect the user to /signin page
  return (
    <Route
      {...rest}
      render={(props) =>
        isLogin() ? <Component {...props} /> : <Link to="/" />
      }
    />
  );
};

export default PrivateRoute;
