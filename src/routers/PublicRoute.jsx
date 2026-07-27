import PropTypes from 'prop-types';
// import { Navigate, Route } from 'react-router-dom';
import { Route } from 'react-router-dom';

export const PublicRoute = ({ isLoggedIn, component: Component, ...rest }) => {
console.log(rest);
    return (
        <Route component={ Component } />
        // <Route
        //     {...rest}
        //     component={
        //         props => (
        //             !isLoggedIn
        //                 ? <Component {...props} />
        //                 : <Navigate to="/" />
        //         )
        //     }
        // />
    )
}

PublicRoute.prototype = {
    isLoggedIn: PropTypes.bool.isRequired,
    component: PropTypes.func.isRequired
}