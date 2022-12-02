import {
  EActionTypes,
  IrouterInit,
  ItoHash,
  ItoModal,
  ItoPanel,
  ItoReplacePanel,
  ItoPopout,
  ItoView,
  TActions,
} from "../types/store";

export const toPopout = function (payload: ItoPopout["payload"]): TActions {
  return {
    type: EActionTypes.ROUTER_TO_POPOUT,
    payload,
  };
};
export const toView = function (payload: ItoView["payload"]): TActions {
  return {
    type: EActionTypes.ROUTER_TO_VIEW,
    payload,
  };
};
export const toPanel = function (payload: ItoPanel["payload"]): TActions {
  return {
    type: EActionTypes.ROUTER_TO_PANEL,
    payload,
  };
};
export const toReplacePanel = function (payload: ItoReplacePanel["payload"]): TActions {
  return {
    type: EActionTypes.ROUTER_TO_REPLACE_PANEL,
    payload,
  };
};
export const toModal = function (payload: ItoModal["payload"]): TActions {
  return {
    type: EActionTypes.ROUTER_TO_MODAL,
    payload,
  };
};
export const toBack = function (): TActions {
  return {
    type: EActionTypes.ROUTER_TO_BACK,
  };
};
export const toHash = function (payload: ItoHash["payload"]): TActions {
  return {
    type: EActionTypes.ROUTER_TO_HASH,
    payload,
  };
};
export const routerInit = function (payload: IrouterInit["payload"]): TActions {
  return {
    type: EActionTypes.ROUTER_INIT,
    payload,
  };
};
export const resetHistory = function (): TActions {
  return {
    type: EActionTypes.ROUTER_RESET_HISTORY,
  };
};
export const switchBack = function (): TActions {
  return {
    type: EActionTypes.ROUTER_SWITCH_BACK,
  };
};
