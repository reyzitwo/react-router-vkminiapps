import bridge from '@vkontakte/vk-bridge';
import { IPanel, IStructure, IView } from "../types/app";
import getHashUrl from "./getHashUrl";

export interface IRouter {
  structure: IStructure;
  hash: string;
  activeView: IView["id"];
  activePanel: IPanel["id"];
  views: any;
  isBack: boolean;
  historyPanels: any;
  historyViews: any[];
  arrPanelsView: Array<IPanel["id"]>;
  getActiveView(): IView["id"];
  getActivePanel(): IPanel["id"];
  getArrPanelsView(): IPanel["id"];
  getHash(): string;
  setModal(): void;
  setActiveView(id: IView["id"]): void;
  setActivePanel(id: IPanel["id"]): void;
  toReplacePanel(id: IPanel["id"]): void;
  back(): void;
  toHash(hash: string): void;
  resetHistory(newStructure: IRouter["structure"]): void;
  switchBack(): void;
}

class Router implements IRouter {
  readonly structure: IRouter["structure"];
  hash: IRouter["hash"];
  activeView: IRouter["activeView"];
  activePanel: IRouter["activePanel"];
  arrPanelsView: IRouter["arrPanelsView"]
  views: IRouter["views"];
  isBack: IRouter["isBack"];
  historyPanels: IRouter["historyPanels"];
  historyViews: IRouter["historyViews"];

  constructor(structure: IRouter["structure"]) {
    this.structure = structure;
    this.hash = "";
    this.activeView = structure[0].id;
    this.activePanel = structure[0].panels[0].id;
    this.arrPanelsView = [structure[0].panels[0].id];
    this.isBack = true;

    bridge.send('VKWebAppSetSwipeSettings', { history: true });

    // объект views для быстрого доступа по id с одной активной панелью
    this.views = structure.reduce((accum: any, item) => {
      accum[item.id] = { ...item, panel: item.panels[0] };
      return accum;
    }, {});

    // история панелей, добавляем первую для каждого views
    this.historyPanels = structure.reduce((accum: any, item) => {
      accum[item.id] = [item.panels[0]];
      return accum;
    }, {});

    // история views, добавляем первую
    this.historyViews = [this.views[this.activeView]];
  }
  getActiveView() {
    return this.activeView;
  }
  getActivePanel() {
    return this.activePanel;
  }
  getArrPanelsView() {
    return this.historyPanels[this.activeView]
  }
  getHistoryView() {
    this.arrPanelsView = this.historyPanels[this.activeView];
    return this.arrPanelsView
  }
  getHash() {
    return this.hash;
  }
  setModal() {
    bridge.send('VKWebAppSetSwipeSettings', { history: false });

    const history = this.historyPanels[this.activeView];
    if (
      history.length > 0 &&
      history[history.length - 1].id === "route_modal"
    ) {
      return;
    }
    window.history.pushState({ route: "route_modal" }, "route_modal");
    this.historyPanels[this.activeView].push({ id: "route_modal" });
  }
  setActiveView(id: IView["id"]) {
    const panel = this.views[id].panel;

    this.activeView = id;
    this.activePanel = panel.id;
    this.historyViews.push(this.views[id]);

    const hash = getHashUrl(this.views[id].hash, panel.hash);

    window.history.pushState({ route: id }, id);

    if (this.hash !== hash) {
      this.hash = hash;
    }
  }
  setActivePanel(panel: IPanel["id"]) {
    const index = this.views[this.activeView].panels.findIndex(
      (item: any) => item.id === panel
    );
    this.views[this.activeView] = {
      ...this.views[this.activeView],
      panel: this.views[this.activeView].panels[index],
    };

    this.activePanel = panel;
    this.historyPanels[this.activeView].push(this.views[this.activeView].panel);

    const hash = getHashUrl(
      this.views[this.activeView].hash,
      this.views[this.activeView].panel.hash
    );

    window.history.pushState({ route: panel }, panel);

    if (this.hash !== hash) {
      this.hash = hash;
    }
  }
  toReplacePanel(panel: IPanel["id"]) {
    const i = this.views[this.activeView].panels.findIndex(
        (item: any) => item.id === panel
    );
    this.views[this.activeView] = {
      ...this.views[this.activeView],
      panel: this.views[this.activeView].panels[i],
    };

    this.activePanel = panel;
    this.historyPanels[this.activeView] = this.views[this.activeView].panel

    const hash = getHashUrl(
        this.views[this.activeView].hash,
        this.views[this.activeView].panel.hash
    );

    window.history.replaceState({ route: panel }, panel);

    if (this.hash !== hash) {
      this.hash = hash;
    }
  }
  back() {
    if (this.historyViews.length === 0) {
      return bridge.send('VKWebAppSetSwipeSettings', { history: false });
    }

    if (this.historyPanels[this.activeView].length > 1) {
      bridge.send('VKWebAppSetSwipeSettings', { history: true });

      const lastPanel = this.historyPanels[this.activeView].pop();
      if (lastPanel.id === "route_modal") {
        return;
      }
      this.activePanel =
        this.historyPanels[this.activeView][
          this.historyPanels[this.activeView].length - 1
        ].id;
      this.views[this.activeView].panel =
        this.historyPanels[this.activeView][
          this.historyPanels[this.activeView].length - 1
        ];
    } else if (this.historyViews.length > 1) {
      this.historyViews.pop();
      this.activeView = this.historyViews[this.historyViews.length - 1].id;
      this.activePanel = this.views[this.activeView].panel.id;
    }

    const hash = getHashUrl(
      this.views[this.activeView].hash,
      this.views[this.activeView].panel.hash
    );

    if (this.hash !== hash) {
      this.hash = hash;
    }
  }
  toHash(hash: IRouter["hash"]) {
    const { structure } = this;
    if (!hash.trim()) {
      return;
    }
    loop: for (let i = 0; i < structure.length; i++) {
      for (let k = 0; k < structure[i].panels.length; k++) {
        const h = getHashUrl(structure[i].hash, structure[i].panels[k].hash);
        // хеш подходит под заданную структуру, меняем состояние активных вивок и панелей
        if (h === hash) {
          this.activeView = structure[i].id;
          this.activePanel = structure[i].panels[k].id;
          this.views[this.activeView].panel = structure[i].panels[k];
          this.hash = h;
          // не первая панель, добавляем в историю для возврата
          if (k > 0) {
            this.historyPanels[this.activeView].push(structure[i].panels[k]);
            window.history.pushState(
              { route: this.activePanel },
              this.activePanel
            );
          }
          break loop;
        }
      }
    }
  }
  resetHistory(newStructure: IStructure) {
    this.hash = "";
    this.activeView = newStructure[0].id;
    this.activePanel = newStructure[0].panels[0].id;
    this.arrPanelsView = [newStructure[0].panels[0].id];

    bridge.send('VKWebAppSetSwipeSettings', { history: true });

    // объект views для быстрого доступа по id с одной активной панелью
    this.views = newStructure.reduce((accum: any, item) => {
      accum[item.id] = { ...item, panel: item.panels[0] };
      return accum;
    }, {});

    // история панелей, добавляем первую для каждого views
    this.historyPanels = newStructure.reduce((accum: any, item) => {
      accum[item.id] = [item.panels[0]];
      return accum;
    }, {});

    // история views, добавляем первую
    this.historyViews = [this.views[this.activeView]];
  }
  switchBack() {
    this.isBack = !this.isBack;
  }
}

export default Router;
