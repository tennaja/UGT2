import { configureStore, combineReducers } from "@reduxjs/toolkit";
import logger from "redux-logger";
import thunk from "redux-thunk";
import { BookReducer } from "././Book/BookReducer";
import { DeviceReducer } from "./Device/DeviceReducer";
import { SubscriberReducer } from "./Subscriber/SubscriberReducer";
import { PortfolioReducer } from "./Portfolio/PortfolioReducer";
import { LoginReducer } from "./Login/LoginReducer";
import { DropdrowReducer } from "./Dropdrow/DropdrowReducer";
import { MenuReducer } from "./Menu/MenuReducer";
import { ModalReducer } from "./Modal/ModalReducer";
import { TransferReducer } from "./EAC/Transfer/TransferReducer";
import { RedemptionReducer } from "./EAC/Redemption/RedemptionReducer";
import { SettlementReducer } from "./Settlement/SettlementReducer";
import { EACReducer } from "./EAC/EACReducer";
import {InventoryReducer} from "./Inventory/InventoryReducer"

const rootreducer = combineReducers({
  book: BookReducer,
  device: DeviceReducer,
  login: LoginReducer,
  dropdrow: DropdrowReducer,
  menu: MenuReducer,
  modal: ModalReducer,
  subscriber: SubscriberReducer,
  portfolio: PortfolioReducer,
  transfer: TransferReducer,
  redeem: RedemptionReducer,
  settlement: SettlementReducer,
  eac: EACReducer,
  inventory:InventoryReducer
});

// Determine if we're in 'qas' or 'production' mode
const isProduction = process.env.NODE_ENV === "production";
const isQAS = process.env.NODE_ENV === "qas";

// Conditionally include the logger middleware
const middleware = [thunk];
if (!isProduction && !isQAS) {
  middleware.push(logger);
}

// const BookStore = configureStore({ reducer: rootreducer, middleware: [thunk] })
const BookStore = configureStore({
  reducer: rootreducer,
  middleware: middleware,
});
export default BookStore;
