import {Route, Link} from 'react-router-dom';
import {getItem} from '../utils/AsyncUtils';

const PublicRoute = ({component: Component, restricted, ...rest}) => {
  const isLogin = getItem('username') ? true : false;
  return (
    // restricted = false meaning public route
    // restricted = true meaning restricted route
    <Route
      {...rest}
      render={(props) =>
        isLogin && restricted ? (
      
          <Component {...props} />
        ) : (
          <Component {...props} />
        )
      }
      
    />
  );
};

export default PublicRoute;
