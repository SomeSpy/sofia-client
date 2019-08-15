import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Button from "@material-ui/core/Button";
import { PythonShell } from "python-shell";
import { exec } from "child_process";

const useStyles = makeStyles(theme => ({
  button: {
    display: "block",
    marginTop: theme.spacing(2)
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120
  }
}));

export default function ConfigPicker(props) {
  //getInfo();
  const classes = useStyles();
  const [mode, setMode] = React.useState("");
  const [config, setConfig] = React.useState("");

  const [open, setOpen] = React.useState(false);

  function handleChange(event) {
    getInfo();
    let result = setInfo(event.target.value);
    console.log(result);
    if (result) {
      console.log("got here");
      setMode(event.target.value);
    }
  }

  function handleClose() {
    setOpen(false);
  }

  function handleOpen() {
    setOpen(true);
  }

  function getInfo() {
    console.log(mode);
    exec(
      "python3 connect.py 192.168.1.156 get Camera",
      (err, stdout, stderr) => {
        if (err) {
          console.error(err);
          return;
        }
        console.log(stdout);
      }
    );
    /* if (dayNight == "0x00000000" || dayNight == "0x0") {
      setMode("star_ir");
    } else if (dayNight == "0x00000001" || dayNight == "0x1") {
      setMode("full_color");
    } else if (dayNight == "0x00000002" || dayNight == "0x2") {
      setMode("black_and_white");
    } */
  }
  function setInfo(setMode) {
    let returnVal = false;
    console.log(mode);
    let val;
    if (setMode == "star_ir") {
      val = "0x0";
    } else if (setMode == "full_color") {
      val = "0x1";
    } else {
      val = "0x2";
    }
    exec(
      "python3 connect.py 192.168.1.156 set Camera DayNightColor " + val,
      (err, stdout, stderr) => {
        if (err) {
          console.error(err);
        }
        const response = JSON.parse(stdout);
        return true;
        returnVal = response["success"];
      }
    );
    return returnVal;
  }
  return (
    <form autoComplete="off">
      <FormControl className={classes.formControl}>
        <InputLabel htmlFor="demo-controlled-open-select">
          {props.configLabel}
        </InputLabel>
        <Select
          open={open}
          onClose={handleClose}
          onOpen={handleOpen}
          value={mode}
          onChange={handleChange}
          inputProps={{
            name: "age",
            id: "demo-controlled-open-select"
          }}
        >
          {props.configOptions.map((item, i) => (
            <MenuItem value={item.value} key={i}>
              {item.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </form>
  );
}
