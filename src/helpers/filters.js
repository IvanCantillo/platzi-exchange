import numeral from "numeral";

const dollarFilter = (value) =>
  value ? numeral(value).format("($0.00a)") : "$0.00";

const percentFilter = (value) =>
  value ? `${Number(value).toFixed(2)}%` : "0%";

export { dollarFilter, percentFilter };
