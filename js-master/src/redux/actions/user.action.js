import { createAction } from "@reduxjs/toolkit";

import { REQUEST, USER_ACTION } from "../constants";

export const getCustomerListAction = createAction(
    REQUEST(USER_ACTION.GET_CUSTOMER_LIST)
);

export const createCustomerAction = createAction(
    REQUEST(USER_ACTION.CREATE_CUSTOMER)
);

export const deleteCustomerAction = createAction(
    REQUEST(USER_ACTION.DELETE_CUSTOMER)
);
export const updateCustomerAction = createAction(
    REQUEST(USER_ACTION.UPDATE_CUSTOMER)
);
