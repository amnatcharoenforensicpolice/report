/*************************************************
 * CONFIG : Google Sheet ของแต่ละ สภ.
 *************************************************/
const SHEETS = {
  "เมืองอำนาจเจริญ": "1PZ-cnf5s6VXF8VhNWbGWKo8EQV01GjM5TjyVFPQYLE4",
  "ชานุมาน": "1QFVzhYRpsGqEZ4hrOo3gh4-FPQQ1zMCgAxRNhy6PTAk",
  "พนา": "1TQqCyBrt9eTSNw3AX1I4uGYqgGlApdFqYAFnRQXG70Y",
  "เสนางคนิคม": "1PwWQF0uTug0Q9tICyHnfOdOOvkSN2uqZH4B2n_UNqNU",
  "หัวตะพาน": "1qkgsYnJHQKLAY2Rifyu9LMaWqfxSbmE7Sjh49FFyCwE",
  "โพนทอง": "1hCgFgNhdZmERywlrArIrZBtDPW6jZVix-zZKGWQAwwg",
  "ปทุมราชวงศา": "1AEhFFptBKZ2DvnX5FC1uODw5UZBZSYlmKW2_1M4V1Hs",
  "ปลาค้าว": "1ikommb_C5ACjHcrv5UK7lwDn7mgRnXo8o7tBAy6Lwyc",
  "น้ำปลีก": "188q-OrPsgQy3DawUpFsgrT5dhqUoQ2Xb6glFiHha35o",
  "ลืออำนาจ": "1l3mBtDjj3Fj6dv1l-nL-_K8ImzvzEK6bRb1lBnlzZRU"
};

/*************************************************
 * อ่านค่า สภ. จาก URL
 *************************************************/
const st = new URLSearchParams(location.search).get("st");
const reportsEl = document.getElementById("reports");
const titleEl = document.getElementById("title");

if (!st || !SHEETS[st]) {
  reportsEl.innerHTML = "❗ ไม่พบข้อมูลของ สภ. นี้";
  throw new Error("Invalid st");
}

titleEl.innerText = `รายงาน ${st}`;

/*************************************************
 * โหลดข้อมูลจาก Google Sheet
 *************************************************/
const SHEET_URL =
  `https://docs.google.com/spreadsheets/d/${SHEETS[st]}/gviz/tq?tqx=out:json`;

fetch(SHEET_URL)
  .then(r => r.text())
  .then(text => {
    const json = JSON.parse(text.substring(47).slice(0, -2));
    const table = json.table;

    if (!table.rows.length) {
      reportsEl.innerHTML = "ไม่พบข้อมูล";
      return;
    }

    /*************************************************
     * map header
     *************************************************/
    const headerMap = {};
    table.cols.forEach((c, i) => {
      if (c.label) headerMap[c.label.trim()] = i;
    });

    const get = (row, name) => {
      const idx = headerMap[name];
      return idx === undefined
        ? "-"
        : row.c[idx]?.f || row.c[idx]?.v || "-";
    };

    /*************************************************
     * เรียงตามวันที่ล่าสุด
     *************************************************/
    const DATE_COL = "วัน เดือน ปี ที่รับหนังสือ";

    const toDate = v => {
      if (!v || v === "-") return new Date(0);
      const [d, m, y] = v.split("/");
      return new Date(y, m - 1, d);
    };

    table.rows.sort(
      (a, b) => toDate(get(b, DATE_COL)) - toDate(get(a, DATE_COL))
    );

    /*************************************************
     * แสดงผล
     *************************************************/
    let html = "";

    table.rows.forE
