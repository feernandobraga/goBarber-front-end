import React from "react";
import {
  RouteProps as ReactDOMRouteProps,
  Route as ReactDomRoute,
  Redirect,
} from "react-router-dom";
import { useAuth } from "../hooks/auth";

interface RouteProps extends ReactDOMRouteProps {
  isPrivate?: boolean;
  component: React.ComponentType;
}

/**
 * rest means all other properties, like in 'the rest' of the properties
 * isPrivate is what we will use to define if the route is guarded or not
 * component is the react component(or page) that the route points to
 */
const Route: React.FC<RouteProps> = ({
  isPrivate = false,
  component: Component,
  ...rest
}) => {
  const { user } = useAuth();

  /**
   * The render is the property from the routes that allows for customizing how routes are displayed.
   * for this case, if the route isPrivate and the user is not logged in, then redirect to login/signup
   *
   */
  return (
    <ReactDomRoute
      {...rest}
      render={({ location }) => {
        // TRUE and TRUE - if the route isPrivate and the user is authenticated, show the component
        return isPrivate === !!user ? (
          <Component />
        ) : (
          // else, redirect to '/' if the route is private or to the dashboard if it is not
          // the from: location is to keep the navigation history
          <Redirect
            to={{ pathname: isPrivate ? "/" : "/dashboard", state: { from: location } }}
          />
        );
      }}
    />
  );
};

export default Route;
