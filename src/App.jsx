import "@mantine/core/styles.css";
import "./App.css";
import "./index.css";
import "leaflet/dist/leaflet.css";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import Home from "./Component/Dashboard/Home";
import Userlisting from "./Component/User/Userlisting";
import Adduser from "./Component/User/Adduser";
import Updateuser from "./Component/User/Updateuser";
import { ToastContainer } from "react-toastify";
import { Provider } from "react-redux";
import Store from "./Redux/Store";
import { ColorSchemeScript, MantineProvider } from "@mantine/core";

import Subscriberlisting from "./Component/Subscriber/Subscruberlisting";
import InfoSubscriber from "./Component/Subscriber/InfoSubscriber";
import AddScriber from "./Component/Subscriber/AddSubscriber";
import UpdateSubscriber from "./Component/Subscriber/UpdateSubscriber";

import Portfoliolisting from "./Component/Portfolio/Portfoliolisting";
import AddPortfolio from "./Component/Portfolio/AddPortfolio";
import InfoPortfolio from "./Component/Portfolio/InfoPortfolio";
import UpdatePortfolio from "./Component/Portfolio/UpdatePortfolio";

import Main from "./Component/Dashboard/Main";
// import 'bootstrap/dist/css/bootstrap.min.css';
import Devicelisting from "./Component/Device/ListDevice";
import LoginForm from "./Component/Login/Login";
// import PrivateRoute from './Component/Navbar/PrivateRoute'
import PublicRoute from "./Router/PublicRoute";
import AddDevice from "./Component/Device/AddDevice";
import UpdateDevice from "./Component/Device/UpdateDevice";
import Map from "./Component/Map/Map";
import InfoDevice from "./Component/Device/InfoDevice";
import PrivateRoute from "./Router/PrivateRoute";
import * as webURL from "./Constants/WebURL";
import Settlement from "./Component/Settlement/Settlement";
import SettlementApproval from "./Component/Settlement/SettlementApproval";
import EacInfo from "./Component/EAC/Info/Info";
import EacIssueList from "./Component/EAC/Issue/IssueList";
import EacIssuePortList from "./Component/EAC/Issue/PortFolio/PortfolioList";
import EacIssuePortDeviceIssue from "./Component/EAC/Issue/Device/DeviceIssue";
import Transfer from "./Component/EAC/Transfer/Transfer";
import TransferInfo from "./Component/EAC/Transfer/TransferInfo";
import Redemption from "./Component/EAC/Redemption/Redemption";
import RedemptionInfo from "./Component/EAC/Redemption/RedemptionInfo";

function App() {
  return (
    <Provider store={Store}>
      <div className="App">
        <MantineProvider>
          <BrowserRouter>
            <Routes>
              <Route element={<PublicRoute />}>
                <Route path="/" element={<LoginForm />} />
                <Route path={webURL.LOGIN} element={<LoginForm />} />
              </Route>
              <Route element={<PrivateRoute />}>
                <Route path={webURL.DASHBOARD} element={<Main />} />
                <Route
                  path={webURL.USER_LIST}
                  element={<Userlisting></Userlisting>}
                ></Route>
                <Route
                  path={webURL.USER_ADD}
                  element={<Adduser></Adduser>}
                ></Route>
                <Route
                  path={webURL.USER_EDIT}
                  element={<Updateuser></Updateuser>}
                ></Route>
                <Route
                  path={webURL.SUBSCRIBER_LIST}
                  element={<Subscriberlisting></Subscriberlisting>}
                ></Route>
                <Route
                  path={webURL.SUBSCRIBER_ADD}
                  element={<AddScriber></AddScriber>}
                ></Route>
                <Route
                  path={webURL.SUBSCRIBER_EDIT}
                  element={<UpdateSubscriber></UpdateSubscriber>}
                ></Route>
                <Route
                  path={webURL.SUBSCRIBER_INFO}
                  element={<InfoSubscriber></InfoSubscriber>}
                ></Route>
                <Route
                  path={webURL.PORTFOLIO_LIST}
                  element={<Portfoliolisting></Portfoliolisting>}
                ></Route>
                <Route
                  path={webURL.PORTFOLIO_ADD}
                  element={<AddPortfolio></AddPortfolio>}
                ></Route>
                <Route
                  path={webURL.PORTFOLIO_INFO}
                  element={<InfoPortfolio></InfoPortfolio>}
                ></Route>
                <Route
                  path={webURL.PORTFOLIO_EDIT}
                  element={<UpdatePortfolio></UpdatePortfolio>}
                ></Route>
                <Route path={webURL.SETTLEMENT} element={<Settlement />} />
                <Route
                  path={webURL.SETTLEMENT_APPROVAL}
                  element={<SettlementApproval />}
                />

                <Route path={webURL.EAC_INFO} element={<EacInfo />} />
                <Route path={webURL.EAC_ISSUE} element={<EacIssueList />} />
                <Route
                  path={webURL.EAC_ISSUE_PORT}
                  element={<EacIssuePortList />}
                ></Route>
                <Route
                  path={webURL.EAC_ISSUE_PORT_DEVICE}
                  element={<EacIssuePortDeviceIssue />}
                ></Route>

                {/* <Route path={webURL.PORTFOLIO_EDIT} element={<UpdatePortfolio></UpdatePortfolio>}></Route>
            <Route path={webURL.PORTFOLIO_INFO} element={<InfoPortfolio></InfoPortfolio>}></Route> */}
                <Route
                  path={webURL.DEVICE_LIST}
                  element={<Devicelisting></Devicelisting>}
                ></Route>
                <Route
                  path={webURL.DEVICE_ADD}
                  element={<AddDevice></AddDevice>}
                ></Route>
                <Route
                  path={webURL.DEVICE_EDIT}
                  element={<UpdateDevice></UpdateDevice>}
                ></Route>
                <Route
                  path={webURL.DEVICE_INFO}
                  element={<InfoDevice></InfoDevice>}
                ></Route>

                <Route
                  path={webURL.EAC_TRANSFER}
                  element={<Transfer></Transfer>}
                />
                <Route
                  path={webURL.EAC_TRANSFER_INFO}
                  element={<TransferInfo />}
                />
                <Route
                  path={webURL.EAC_REDEMPTION}
                  element={<Redemption></Redemption>}
                />
                <Route
                  path={webURL.EAC_REDEMPTION_INFO}
                  element={<RedemptionInfo></RedemptionInfo>}
                />

                <Route path="/map2" element={<Map />}></Route>
              </Route>
            </Routes>
          </BrowserRouter>
          <ToastContainer
            className="toast-position"
            position="bottom-right"
          ></ToastContainer>
        </MantineProvider>
      </div>
    </Provider>
  );
}

export default App;