import React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import BlogList from "./BlogList";
import BlogDetail from "./BlogDetail";
import "../../../css/blog.css";

export default function BlogPage() {
  const match = useRouteMatch();

  return (
    <Switch>
      <Route path={`${match.path}/:slug`}>
        <BlogDetail />
      </Route>
      <Route path={`${match.path}`}>
        <BlogList />
      </Route>
    </Switch>
  );
}
