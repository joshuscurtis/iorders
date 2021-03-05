import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";

import { createGlobalState } from "react-hooks-global-state";

import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Box from "@material-ui/core/Box";
import CardHeader from "@material-ui/core/CardHeader";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slider from "@material-ui/core/Slider";

import KitchenIcon from "@material-ui/icons/Kitchen";

import LocalCafeIcon from "@material-ui/icons/LocalCafe";
import CloseIcon from "@material-ui/icons/Close";

import io from "socket.io-client";
import $ from "jquery";

import "./styles.css";
//var orders = require("./orders.json");

const initialState = { count: 10 };
const { useGlobalState, setGlobalState } = createGlobalState(initialState);

function SettingsDialog(props) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = (e) => {
    e.stopPropagation();
    setOpen(true);
  };
  const handleClose = (e) => {
    e.stopPropagation();
    setOpen(false);
  };

  function valuetext(value) {
    return `${value}°C`;
  }
  const [count, setCount] = useGlobalState("count");
  const handleChange = (event, newValue) => {
    setCount(newValue);
    setGlobalState("count", newValue);
  };

  return (
    <div>
      <Button size="large" variant="contained" onClick={handleClickOpen}>
        Settings
      </Button>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"General Settings"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Time before alert (minutes):
          </DialogContentText>
          <Slider
            defaultValue={count}
            getAriaValueText={valuetext}
            aria-labelledby="discrete-slider"
            valueLabelDisplay="auto"
            step={1}
            min={1}
            max={30}
            onChange={handleChange}
            value={count}
          />
          <DialogContentText id="alert-dialog-description">
            This will adjust the time before an alert is shown for any new
            orders ariving.
          </DialogContentText>
          <DialogContentText id="alert-dialog-description">Made By Josh!</DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button
            className="OrderCard__closeButton"
            onClick={handleClose}
            color="primary"
            autoFocus
          >
            <CloseIcon />
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

function AlertDialog(props) {
  const [open, setOpen] = React.useState(false);

  const handleCloseOrder = (e) => {
    e.stopPropagation();
    setOpen(false);
    updatePG(props.id, "isclosed", true);
  };
  const handleClickOpen = (e) => {
    e.stopPropagation();
    setOpen(true);
  };
  const handleClose = (e) => {
    e.stopPropagation();
    setOpen(false);
  };

  return (
    <div>
      <Button
        className="OrderCard__CloseButton"
        size="large"
        variant="contained"
        color="secondary"
        onClick={handleClickOpen}
      >
        <CloseIcon className="CloseButton" />
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Are you sure you want to close this order?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Once the order has been served, close the order.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button
            className="OrderCard__closeButton"
            onClick={handleCloseOrder}
            color="primary"
            autoFocus
          >
            Close Order
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
function checkAlert(time, alertTime) {
  var timeopen = time.substring(0, 2);
  if (time.substring(1, 2) === "m") timeopen = time.substring(0, 1);

  if (timeopen > alertTime) {
    return true;
  } else return false;
}

function CardApp(props) {
  //do not create closed orders
  //set states
  // const [close, setClose] = useState(false);

  const [alert, setAlert] = useState("");
  //calc time
  var count = useGlobalState("count");

  useEffect(() => {
    if (checkAlert(props.time, count[0])) setAlert("flash");
    else setAlert("");
    return () => {};
  }, [count, props.time]);

  //default button colours
  var kitCol = false;
  var barCol = false;
  if (props.assignee === "false") kitCol = true;
  if (props.assignee2 === "false") barCol = true;

  //create card title
  var cardTitle = "Order: " + ((props.orderid % 99) + 1);

  if (props.istable === true) {
    if (props.tablenum !== null) {
      cardTitle =
        props.tablenum + " (Order: " + ((props.orderid % 99) + 1) + ")";
    }
  } else if (props.isfoyer !== "null" && props.isfoyer !== null) {
    cardTitle = props.isfoyer + " (Order: " + ((props.orderid % 99) + 1) + ")";
  } else if (props.isfoyer === "null") {
    cardTitle = "Order: " + ((props.orderid % 99) + 1);
  }

  //onClick action
  const handleClick = (e) => {
    if (props.isprocessing === false)
      updatePG(props.orderid, "isprocessing", true);
    e.stopPropagation();
  };

  return (
    <div className={alert}>
      <Card
        className="OrderCard__Main"
        onClick={handleClick}
        style={{ backgroundColor: props.isprocessing ? "#7ea8be" : "#28a745" }}
        variant="outlined"
      >
        <CardHeader
          title={cardTitle}
          subheader={props.time}
          action={<AlertDialog id={props.orderid} />}
        ></CardHeader>
        <CardContent>
          <OrderItems order={props.order} />
        </CardContent>

        <CardActions>
          <KitchenButton orderId={props.orderid} colour={kitCol} />
          <BarButton orderId={props.orderid} colour={barCol} />
        </CardActions>
      </Card>
    </div>
  );
}

function BarButton(props) {
  const handleClick = (e) => {
    e.stopPropagation();
    updatePG(props.orderId, "assignee2", false);
  };

  return (
    <Button
      className="Card__BarButton"
      onClick={handleClick}
      variant="contained"
      size="large"
      style={{
        backgroundColor: props.colour ? "#5cb85c" : "#f50057",
        color: "white",
      }}
    >
      <LocalCafeIcon />
      Bar
    </Button>
  );
}

function KitchenButton(props) {
  const handleClick = (e) => {
    e.stopPropagation();
    updatePG(props.orderId, "assignee", false);
  };

  return (
    <Button
      className="Card__KitButton"
      onClick={handleClick}
      variant="contained"
      style={{
        backgroundColor: props.colour ? "#5cb85c" : "#f50057",
        color: "white",
      }}
      size="large"
    >
      <KitchenIcon />
      Kitchen
    </Button>
  );
}

function ButtonAppBar() {
  var jumpId = "#take";

  const [jump, setJump] = useState("#take");

  function handleClick() {
    console.log(jumpId);

    if (jump === "#take") {
      setJump("#table");
    }
    if (jump === "#table") {
      setJump("#take");
    }
  }

  return (
    <div>
      <AppBar position="fixed">
        <Toolbar className="AppBar__main">
          <img alt="" className="AppBar__logo" src="logo.webp" />
          <div className="App__Title">
            <Typography align="center" variant="h4" component="h1">
              The Way
            </Typography>
          </div>

          <div className="toggle">
            <Button
              size="large"
              variant="contained"
              href={jump}
              onClick={handleClick}
            >
              {jump === "#table" ? "Takeaway" : "Table"}
            </Button>
          </div>
          <SettingsDialog />
        </Toolbar>
      </AppBar>
    </div>
  );
}

function TakeawayStream(props) {
  var rows = [];
  var orders = props.orders;

  //	console.log(orders);
  for (var i = 0; i < orders.length; i++) {
    if (orders[i].tablenum.substring(0, 5) !== "Table") {
      rows.push(
        <CardApp
          key={orders[i].order_id}
          orderid={orders[i].order_id}
          order={orders[i]}
          time={orders[i].timeopen}
          isprocessing={orders[i].isprocessing}
          istable={orders[i].istable}
          isnew={orders[i].isnew}
          isclosed={orders[i].isclosed}
          tablenum={orders[i].tablenum}
          assignee={orders[i].assignee}
          assignee2={orders[i].assignee2}
          isfoyer={orders[i].isfoyer}
        />
      );
    }
  }
  return (
    <div id="take" className="Takeaway__Stream">
      <div className="Stream__title">
        <Typography className="Stream__title" align="center" variant="h5">
          Takeaway Orders
        </Typography>
      </div>
      {rows}
    </div>
  );
}

function TableStream(props) {
  var rows = [];
  var orders = props.orders;

  for (var i = 0; i < orders.length; i++) {
    if (orders[i].tablenum.substring(0, 5) === "Table") {
      rows.push(
        <CardApp
          key={orders[i].order_id}
          orderid={orders[i].order_id}
          order={orders[i]}
          time={orders[i].timeopen}
          isprocessing={orders[i].isprocessing}
          istable={orders[i].istable}
          isnew={orders[i].isnew}
          isclosed={orders[i].isclosed}
          tablenum={orders[i].tablenum}
          assignee={orders[i].assignee}
          assignee2={orders[i].assignee2}
        />
      );
    }
  }
  return (
    <div id="table" className="Table__Stream">
      <div className="Stream__title">
        <Typography align="center" variant="h5">
          Table Orders
        </Typography>
      </div>
      {rows}
    </div>
  );
}

function OrderItem(props) {
  var comment = "";
  if (props.comment != null) comment = "Comment: " + props.comment;

  const [strikeClass, setStrikeClass] = useState("");

  const handleClick = (e) => {
    if (strikeClass !== "crossed-line") setStrikeClass("crossed-line");
    if (strikeClass === "crossed-line") setStrikeClass("");
  };

  return (
    <div className={strikeClass} onClick={handleClick}>
      <Box m={1} borderBottom={1}>
        <Typography variant="h5" align="center">
          {props.itemName}
        </Typography>
        <Typography variant="h6" color="textSecondary" align="center">
          {props.variantName}
        </Typography>
        <Typography variant="h5" color="textSecondary" align="center">
          Qty: {props.qty}
        </Typography>
        <Typography variant="h6" color="textSecondary" align="center">
          {comment}
        </Typography>
      </Box>
    </div>
  );
}

function OrderItems(props) {
  var order = props.order;
  //console.log(order);
  var rows = [];
  for (var i = 0; i < order.products.length; i++) {
    if (order.products[i].name.substring(0, 5) !== "Table") {
      if (order.products[i].name.substring(0, 5) !== "Foyer") {
        rows.push(
          <OrderItem
            variantName={order.products[i].variantName}
            itemName={order.products[i].name}
            qty={order.products[i].quantity}
            comment={order.products[i].comment}
            key={i}
          />
        );
      }
    }
  }
  return <div>{rows}</div>;
}

function updatePG(id, column, value) {
  var settings = {
    url: "/update",
    method: "POST",
    timeout: 0,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: {
      value: value,
      id: id,
      column: column,
    },
  };
  $.ajax(settings)
    .done(function (response) {})
    .fail(function (data) {
      console.log("fail ");
    });
}

const socket = io();
console.log("starting socketio...");
socket.on("connect", function (data) {
  socket.emit("join", "Hello World from react client");
});

const audio = new Audio(
  "https://github.com/joshuscurtis/theway/raw/master/piece-of-cake.mp3"
);

export default function App() {
  const [orderData, setOrderData] = useState(0);

  //for local
  /*useEffect(() => {
     console.log(orders);
     setOrderData(orders.orders);
   }, []);
 */

  useEffect(() => {
    socket.on("load", function (data) {
      console.log("loading data...");
      setOrderData(data.db);
    });

    return () => {
      console.log("stop socket");
      socket.removeAllListeners();
      socket.close();
    };
  }, []);

  useEffect(() => {
    socket.on("db", function (data) {
      console.log("getting data for react...");
      console.log(data.db);
      setOrderData(data.db);
    });
    return () => {
      console.log("stop socket");
      socket.removeAllListeners();
      socket.close();
    };
  }, []);
  useEffect(() => {
    socket.on("db", function (data) {
      console.log("cleaning up...");
    });
    return () => {
      socket.close();
    };
  }, []);

  useEffect(() => {
    socket.on("broadcast", function (data) {
      console.log("new order...");
      if (data.description === true) audio.play();
    });
    return () => {
      socket.close();
    };
  }, []);

  return (
    <div style={{ margin: 0 }}>
      <ButtonAppBar />
      <div className="App_Contents">
        <TakeawayStream orders={orderData} />
        <TableStream orders={orderData} />
      </div>
    </div>
  );
}

ReactDOM.render(<App />, document.querySelector("#root"));
