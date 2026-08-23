import { useState, SyntheticEvent, useEffect } from "react";
import { Dispatch } from "@reduxjs/toolkit";
import { Container, Stack, Box } from "@mui/material";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PausedOrders from "./PausedOrders";
import ProcessOrders from "./ProcessOrders";
import FinishedOrders from "./FinishedOrders";
import Divider from "../../components/divider";
import { setPausedOrders, setProcessOrders, setFinishedOrders } from "./slice";
import { useDispatch } from "react-redux";
import { Order, OrderInquiry } from "../../../lib/types/order";
import { OrderStatus } from "../../../lib/enums/order.enum";
import OrderService from "../../services/OrderService";
import { useGlobals } from "../../hooks/useGlobals";
import "../../../css/order.css";
import { useHistory } from "react-router-dom";
import { serverApi } from "../../../lib/config";
import { MemberType } from "../../../lib/enums/member.enum";

/** REDUX SLICE & SELECTOR **/
const actionDispatch = (dispatch: Dispatch) => ({
  setPausedOrders: (data: Order[]) => dispatch(setPausedOrders(data)),
  setProccessOrders: (data: Order[]) => dispatch(setProcessOrders(data)),
  setTFinishedOrders: (data: Order[]) => dispatch(setFinishedOrders(data)),
});

export default function OrdersPage() {
  const { setPausedOrders, setProccessOrders, setTFinishedOrders } =
    actionDispatch(useDispatch());
  const { orderBuilder, authMember } = useGlobals();
  const history = useHistory();
  const [value, setValue] = useState("1");
  const [orderInquiry, setOrderInquiry] = useState<OrderInquiry>({
    page: 1,
    limit: 5,
    orderStatus: OrderStatus.PAUSE,
  });

  useEffect(() => {
    const order = new OrderService();

    order
      .getMyOrders({ ...orderInquiry, orderStatus: OrderStatus.PAUSE })
      .then((data) => setPausedOrders(data))
      .catch((err) => console.log(err));

    order
      .getMyOrders({ ...orderInquiry, orderStatus: OrderStatus.PROCESS })
      .then((data) => setProccessOrders(data))
      .catch((err) => console.log(err));

    order
      .getMyOrders({ ...orderInquiry, orderStatus: OrderStatus.FINISH })
      .then((data) => setTFinishedOrders(data))
      .catch((err) => console.log(err));
  }, [orderInquiry, orderBuilder]);

  /** HANDLERS **/

  const handleChange = (e: SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  if (!authMember) history.push("/");
  return (
    <div className={"order-page"}>
      <Container className="order-container">
        <Stack className={"order-left"}>
          <TabContext value={value}>
            <Box className={"order-nav-frame"}>
              <Box
                sx={{ borderBottom: 1, borderColor: "divider", width: "679px" }}
                className={"order-tabs-box"}
              >
                <Tabs
                  value={value}
                  onChange={handleChange}
                  aria-label="basic tabs example"
                  className={"table_list"}
                >
                  <Tab label="PAUSED ORDERS" value={"1"} />
                  <Tab label="PROCESS ORDERS" value={"2"} />
                  <Tab label="FINISHED ORDERS" value={"3"} />
                </Tabs>
              </Box>
            </Box>

            <Stack className={"order-main-content"}>
              <PausedOrders setValue={setValue} />
              <ProcessOrders setValue={setValue} />
              <FinishedOrders />
            </Stack>
          </TabContext>
        </Stack>

        <Stack className={"order-right"}>
          <Stack className="profile-box">
            <Stack className="profile-info">
              <img
                src={
                  authMember?.memberImage
                    ? `${serverApi}/${authMember.memberImage}`
                    : "/icons/default-user.svg"
                }
              />
              <span className="user-badge">
                <img
                  className=""
                  src={
                    authMember?.memberType === MemberType.ADMIN
                      ? "/icons/restaurant.svg"
                      : "/icons/user-badge.svg"
                  }
                  alt=""
                />
              </span>
              <p>{authMember?.memberNick}</p>
              <p> {authMember?.memberType}</p>
            </Stack>
            <Stack className="address">
              <Divider width="100%" height="2" bg="#A1A1A1" />
              <Box className="address-box">
                <LocationOnIcon />
                <p>
                  {authMember?.memberAddress
                    ? authMember.memberAddress
                    : "no adress"}
                </p>
              </Box>
            </Stack>
          </Stack>

          <Stack className="card-box">
            <Stack>
              <input
                type="text"
                placeholder="Card number : 5243 4090 2002 7495"
                className="card-input "
              />
              <Box className="card-exp-cvv">
                <input
                  type="text"
                  placeholder="07 / 24"
                  className="card-input-inner top-input"
                />
                <input
                  type="text"
                  placeholder="CVV : 010"
                  className="card-input-inner top-input"
                />
              </Box>
              <input
                type="text"
                placeholder="Justin Robertson"
                className="card-input"
              />
            </Stack>
            <Stack className="card-icons">
              <img src="/icons/western-card.svg" alt="" className="card-icon" />
              <img src="/icons/master-card.svg" alt="" className="card-icon" />
              <img src="/icons/paypal-card.svg" alt="" className="card-icon" />
              <img src="/icons/visa-card.svg" alt="" className="card-icon" />
            </Stack>
          </Stack>
        </Stack>
      </Container>
    </div>
  );
}
