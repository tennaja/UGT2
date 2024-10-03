import axios from "axios";
import dayjs from "dayjs";
import Cookies from "js-cookie";
import { pad } from "lodash";
import numeral from "numeral";
import Swal from "sweetalert2";

export function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export const ceil = (option, dayjsClass) => {
  dayjsClass.prototype.ceil = function (unit, amount) {
    return this.add(amount - (this.get(unit) % amount), unit).startOf(unit);
  };
};

export const floor = (option, dayjsClass) => {
  dayjsClass.prototype.floor = function (unit, amount) {
    const mod = this.get(unit) % amount;
    return this.subtract(mod, unit).startOf(unit);
  };
};

export const round = (option, dayjsClass) => {
  dayjsClass.prototype.round = function (amount, unit) {
    const mod = this.get(unit) % amount;

    if (mod < amount / 2) {
      return this.subtract(mod, unit).startOf(unit);
    }

    return this.add(amount - mod, unit).startOf(unit);
  };
};

export const formatToNumberWithDecimalPlaces = (
  value,
  decimalPlace = 0,
  alwaysShowDecimal = true
) => {
  let stringDecimal = "";
  for (let i = 0; i < decimalPlace; i++) {
    stringDecimal += "0";
  }
  if (alwaysShowDecimal) {
    return numeral(value).format(`0,0.${stringDecimal}`);
  } else {
    return numeral(value).format(`0,0.[${stringDecimal}]`);
  }
};

export const padNumber = (number, size) => {
  if (number.includes(".")) {
    // trim the value to `${size}` decimal point
    let decimalPoint = number.split(".")[1];
    if (decimalPoint.length > size) {
      number = number.slice(0, number.indexOf(".") + (size + 1));
    } else {
      // pad with 0 if decimal point is less than `${size}`
      let decimalPointLength = decimalPoint.length;
      let padLength = size - decimalPointLength;
      for (let i = 0; i < padLength; i++) {
        number += "0";
      }
    }
    return number;
  } else {
    let decimalPoint = pad("0", size, "0");
    return numeral(number).format(`0.${decimalPoint}`);
  }
};

/**
 *
 * @param {*} date
 * @returns MMMM YYYY
 */
export const formatToFullMonthYear = (date) => {
  return dayjs(date).format("MMMM YYYY");
};

export const convertStatus = (status = "", statusType = "") => {
  if (status == "" || status == null) {
    if (statusType == "issue") {
      return "Pending";
    } else if (statusType == "transfer") {
      return "Unavailable";
    } else if (statusType == "redemption") {
      return "Unavailable";
    }
  }
  return status;
};

const authorizationHeader = {
  Authorization: "Bearer " + Cookies.get("token"),
};
export const fetcher = (url) =>
  axios
    .get(url, { headers: { ...authorizationHeader } })
    .then((response) => response.data);

let loadingTimeout = null;
export async function showLoading(
  title = "Please Wait...",
  text = "",
  icon = null,
  delay = 300
) {
  if (loadingTimeout) {
    clearTimeout(loadingTimeout);
  }
  loadingTimeout = setTimeout(() => {
    Swal.fire({
      title: title,
      html: text,
      allowOutsideClick: false, // Prevents clicking outside
      showConfirmButton: false,
      timerProgressBar: true,
      backdrop: `
        rgba(0, 0, 0, 0.4)`, // Semi-transparent dark background
      didOpen: () => {
        Swal.showLoading();
      },
      icon: icon,
    });
  }, delay);
}

export async function hideLoading() {
  if (loadingTimeout) {
    clearTimeout(loadingTimeout);
  }
  Swal.close();
}

