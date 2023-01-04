import React, { ReactElement, useEffect } from "react";
import { Provider } from "react-redux";
import { routerInit, toBack } from "../store/actions";
import Router from "../utils/router";
import store from "../store";
import { IStructure } from "../types/app";

export const RouterContext = React.createContext<any | null>(null);

interface AppProps {
  structure: IStructure;
  children: ReactElement;
}

const App: React.FC<AppProps> = ({ structure, children }) => {
  try {
    const router = new Router(structure);
    router.toHash("/");
    store.dispatch(routerInit(router));

    useEffect(() => {
      window.addEventListener("popstate", () => {
        if (!router.isBack) return;
        store.dispatch(toBack());
      });
    }, []);

    return (
      <Provider store={store} context={RouterContext}>
        {children}
      </Provider>
    );
  } catch (error) {
    throw new Error("Incorrect structure! Check your application structure.");
  }
};

export default App;
