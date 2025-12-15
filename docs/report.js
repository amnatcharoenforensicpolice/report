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
const st = new URLSearchParams(window.location.search).get("st");
const reportsEl = document.getElementById("reports");
const titleEl = document.getElementById("title");

if (!st || !SHEETS[st]) {
  reportsEl.innerHTML = "❗ ไม่พบข้อมูลของ สภ. นี้";
  throw new Error("Invalid st");
}

titleEl.innerText = `รายงาน สภ. ${st}`;

/*************************************************
 * โหลดข้อมูลจาก Google Sheet
 *************************************************/
const SHEET_URL =
  `https://docs.google.com/spreadsheets/d/${SHEETS[st]}/gviz/tq?tqx=out:json`;

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
     * map ชื่อคอลัมน์ → index
     *************************************************/
    const headerMap = {};
    table.cols.forEach((col, i) => {
      if (col.label) headerMap[col.label.trim()] = i;
    });

    /*************************************************
     * ฟังก์ชันดึงค่าจากแถว
     *************************************************/
    const get = (row, name) => {
      const idx = headerMap[name];
      if (idx === undefined) return "-";
      return row.c[idx]?.f || row.c[idx]?.v || "-";
    };

    /*************************************************
     * เรียงตามวันที่รับ (ล่าสุดก่อน)
     *************************************************/
    const toDate = val => {
      if (!val) return new Date(0);
      if (typeof val === "string" && val.includes("/")) {
        const [d, m, y] = val.split("/");
        return new Date(y, m - 1, d);
      }
      return new Date(val);
    };

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
      const status = get(r, "สถานะรายงาน");

      let statusClass = "";
      if (status === "เสร็จแล้ว มารับได้") statusClass = "done";
      else if (status === "รับรายงานแล้ว") statusClass = "received";
      else if (status === "อยู่ระหว่างดำเนินการ") statusClass = "pending";

      html += `
<div class="report">
  <div><b>สภ.:</b> ${st}</div>
  <div><b>เลขรายงาน:</b> ${get(r, "เลขรายงาน")}</div>
  <div><b>เลขหนังสือนำส่ง:</b> ${get(r, "เลขหนังสือนำส่ง")}</div>
  <div><b>วันที่รับ:</b> ${get(r, "วัน เดือน ปี ที่รับหนังสือ")}</div>

  <div class="status ${statusClass}">
    <b>สถานะรายงาน:</b> ${status}
  </div>
</div>`;
    });

    reportsEl.innerHTML = html || "ไม่พบข้อมูล";
  })
  .catch(err => {
    console.error(err);
    reportsEl.innerHTML = "❌ เกิดข้อผิดพลาดในการโหลดข้อมูล";
  });
