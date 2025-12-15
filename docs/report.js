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

    // map header
    const headerMap = {};
    table.cols.forEach((c, i) => c.label && (headerMap[c.label.trim()] = i));

    const get = (row, name) =>
      headerMap[name] === undefined
        ? "-"
        : row.c[headerMap[name]]?.f || row.c[headerMap[name]]?.v || "-";

    const toDate = v => {
      if (!v) return new Date(0);
      const [d, m, y] = v.split("/");
      return new Date(y, m - 1, d);
    };

    // 🔥 ใช้ชื่อคอลัมน์เดียวกันทั้งไฟล์
    const DATE_COL = "วัน เดือน ปี ที่รับหนังสือ";

    table.rows.sort(
      (a, b) => toDate(get(b, DATE_COL)) - toDate(get(a, DATE_COL))
    );

    let html = "";
    table.rows.forEach(r => {
      const status = get(r, "สถานะ").replace(/\s+/g, "-");

      html += `
      <div class="report">
        <div><span>สภ.:</span> ${st}</div>
        <div><span>เลขรายงาน:</span> ${get(r, "เลขรายงาน")}</div>
        <div><span>เลขหนังสือนำส่ง:</span> ${get(r, "เลขหนังสือนำส่ง")}</div>
        <div><span>วันที่รับ:</span> ${get(r, DATE_COL)}</div>
        <div class="status ${status}">
          <span>สถานะรายงาน:</span> ${get(r, "สถานะ")}
        </div>
      </div>`;
    });

    reportsEl.innerHTML = html;
  })
  .catch(() => {
    reportsEl.innerHTML = "❌ โหลดข้อมูลไม่สำเร็จ";
  });
/*************************************************
 * CONFIG : ใส่ Google Sheet ของแต่ละ สภ. ตรงนี้
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
const params = new URLSearchParams(window.location.search);
const st = params.get("st");

const reportsEl = document.getElementById("reports");
const titleEl = document.getElementById("title");

if (!st || !SHEETS[st]) {
  reportsEl.innerHTML =
    "❗ ไม่พบข้อมูลของ สภ. นี้<br>กรุณาตรวจสอบลิงก์อีกครั้ง";
  throw new Error("Invalid st parameter");
}

titleEl.innerText = `รายงาน ${st}`;

/*************************************************
 * สร้าง URL สำหรับดึงข้อมูลจาก Google Sheet
 *************************************************/
const SHEET_ID = SHEETS[st];
const SHEET_URL =
  `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json`;

/*************************************************
 * โหลดข้อมูล
 *************************************************/
fetch(SHEET_URL)
  .then(res => res.text())
  .then(text => {
    const json = JSON.parse(text.substring(47).slice(0, -2));
    const table = json.table;

    if (!table || !table.rows || table.rows.length === 0) {
      reportsEl.innerHTML = "ไม่พบข้อมูล";
      return;
    }

    /*************************************************
     * map ชื่อหัวคอลัมน์ → index
     *************************************************/
    const headerMap = {};
    table.cols.forEach((col, i) => {
      if (col.label) {
        headerMap[col.label.trim()] = i;
      }
    });

    /*************************************************
     * ฟังก์ชันดึงค่าจาก row ตามชื่อคอลัมน์
     *************************************************/
    const get = (row, name) => {
      const idx = headerMap[name];
      if (idx === undefined) return "-";
      return row.c[idx]?.f || row.c[idx]?.v || "-";
    };

    /*************************************************
     * แปลงวันที่ (dd/mm/yyyy)
     *************************************************/
    const toDate = (val) => {
      if (!val) return new Date(0);

      if (val instanceof Date) return val;

      if (typeof val === "string" && val.includes("/")) {
        const [d, m, y] = val.split("/");
        return new Date(y, m - 1, d);
      }

      return new Date(val);
    };

    /*************************************************
     * เรียงตามวันที่รับ (ล่าสุดก่อน)
     *************************************************/
    const rows = table.rows.sort(
      (a, b) =>
        toDate(get(b, "วัน เดือน ปี ที่รับหนังสือ")) -
        toDate(get(a, "วัน เดือน ปี ที่รับหนังสือ"))
    );

    /*************************************************
     * แสดงผล
     *************************************************/
    let html = "";

    rows.forEach(r => {
      html += `
      <div class="report">
        <div><span>สภ.:</span> ${st}</div>
        <div><span>เลขรายงาน:</span> ${get(r, "เลขรายงาน")}</div>
        <div><span>เลขหนังสือนำส่ง:</span> ${get(r, "เลขหนังสือนำส่ง")}</div>
        <div><span>วัน เดือน ปี ที่รับหนังสือ:</span> ${get(r, "วัน เดือน ปี ที่รับหนังสือ")}</div>
        <div class="status ${get(r, "สถานะ")}">
          <span>สถานะรายงาน:</span> ${get(r, "สถานะรายงาน")}
        </div>
      </div>`;
    });

    reportsEl.innerHTML = html || "ไม่พบข้อมูล";
  })
  .catch(err => {
    console.error(err);
    reportsEl.innerHTML =
      "❌ เกิดข้อผิดพลาดในการโหลดข้อมูล";
  });
