import { IRouter } from "../utils/router";
import { EActionTypes, IAppState, TActions } from "../types/store";

const initialState: IAppState = {
  popout: null,
  modal: null,
  activeView: "",
  activePanel: "",
  hash: "",
  isBack: true,
};

let router = {} as IRouter;

export default function app(state: IAppState = initialState, action: TActions) {
  function routerBack() {
    router.back();
    return {
      ...state,
      activeView: router.getActiveView(),
      activePanel: router.getActivePanel(),
      arrPanelsView: router.getArrPanelsView(),
      hash: router.getHash(),
      modal: null,
      popout: null
    };
  }

  switch (action.type) {
    case EActionTypes.ROUTER_TO_POPOUT:
      if (!action.payload) {
        return routerBack();
      }

      router.setModal();
      return { ...state, popout: action.payload };
    case EActionTypes.ROUTER_TO_MODAL:
      router.setModal();
      return { ...state, modal: action.payload };
    case EActionTypes.ROUTER_TO_VIEW:
      router.setActiveView(action.payload);
      return { ...state, activeView: action.payload, activePanel: router.getActivePanel(), hash: router.getHash(), arrPanelsView: router.getArrPanelsView()  };
    case EActionTypes.ROUTER_TO_PANEL:
      router.setActivePanel(action.payload);
      return { ...state, activePanel: action.payload, hash: router.getHash(), arrPanelsView: router.getArrPanelsView() };
    case EActionTypes.ROUTER_TO_REPLACE_PANEL:
      router.toReplacePanel(action.payload);
      return { ...state, activePanel: action.payload, hash: router.getHash() };
    case EActionTypes.ROUTER_TO_BACK:
      return routerBack()
    case EActionTypes.ROUTER_TO_HASH:
      router.toHash(action.payload);
      return { ...state, hash: action.payload, activeView: router.getActiveView(), activePanel: router.getActivePanel() };
    case EActionTypes.ROUTER_INIT:
      router = action.payload;
      return { ...state, activeView: router.getActiveView(), activePanel: router.getActivePanel(), arrPanelsView: router.getArrPanelsView() };
    case EActionTypes.ROUTER_RESET_HISTORY:
      router.resetHistory(action.payload);
      return state;
    case EActionTypes.ROUTER_SWITCH_BACK:
      router.switchBack();
      return state;
    default:
      return state;
  }
}
