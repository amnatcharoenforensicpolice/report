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
  "ลืออำนาจ": "1l3mBtDjj3Fj6dv1l-nL-_K8ImzvzEK6bRb1lBnlzZRU",
  "เมืองอำนาจเจริญ2": "1b5UwGweBz99ryyfFSQPc7491pWvPInm_Mt_Ytjuk2Hs",
  "ชานุมาน2": "1pOxI1KVWwT2VpfZqYgzUg9d5h9QG2d1NAwGDny8H8Qo",
  "พนา2": "16u0J1VIPdZVXzRMVFgVsgykOWBMqYtstk9LsIx-VgFw",
  "เสนางคนิคม2": "1solNpWHecrb0QGRWipX-bLayapecHi-Uad3oZuGuxOU",
  "หัวตะพาน2": "1sJHUZ_iD5v3m_JpUngVnF1HgExIUdpT1IG1Nyowu7sQ",
  "โพนทอง2": "1MT6qu1pfQ-VrBw4_aBCnqVjSMMId-4MVMgyyF2u-RBo",
  "ปทุมราชวงศา2": "1PcmQUU4QXLgixIYNF1c1xRzl3jvSbTKvupkcMPkTf_k",
  "ปลาค้าว2": "12r0eMZnCoOZV8v8ivJ5OoCp6oMmGKBQLSHx9KOdhYgg",
  "น้ำปลีก2": "1Ps4lwj3b6dcPdIGQgzclbh72ilTlR9X03tz2KRJsjvo",
  "ลืออำนาจ2": "103nCws9f7YEXmFu_L4YB_I0sMCn0Bj4DudjF22rqm2E"
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

const displaySt = st.replace(/[0-9]+$/, "");

// กำหนดหัวข้อจากเลขท้าย
let reportTitle = "รายงานยา";

if (st.endsWith("2")) {
  reportTitle = "รายงานตรวจสถานที่เกิดเหตุ";
}
titleEl.innerText = `${reportTitle} สภ.${displaySt}`;

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
  if (!val || typeof val !== "string") return new Date(0);

  const monthMap = {
    "ม.ค.": 0,
    "ก.พ.": 1,
    "มี.ค.": 2,
    "เม.ย.": 3,
    "พ.ค.": 4,
    "มิ.ย.": 5,
    "ก.ค.": 6,
    "ส.ค.": 7,
    "ก.ย.": 8,
    "ต.ค.": 9,
    "พ.ย.": 10,
    "ธ.ค.": 11
  };

  // ตัวอย่าง "4 ธ.ค. 2025"
  const parts = val.trim().split(" ");
  if (parts.length !== 3) return new Date(0);

  const day = parseInt(parts[0], 10);
  const month = monthMap[parts[1]];
  const year = parseInt(parts[2], 10);

  if (isNaN(day) || month === undefined || isNaN(year)) {
    return new Date(0);
  }

  return new Date(year, month, day);
};


    const rows = table.rows.sort(
      (a, b) =>
        toDate(get(a, "วัน เดือน ปี ที่รับหนังสือ")) -
        toDate(get(b, "วัน เดือน ปี ที่รับหนังสือ"))
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
  <div><b>วันที่รับตรวจ:</b> ${get(r, "วัน เดือน ปี ที่รับตรวจ")}</div>
  <div><b>สภ.:</b> ${displaySt}</div>
  <div><b>เลขหนังสือนำส่ง:</b> ${get(r, "เลขหนังสือนำส่ง")}</div>
  <div><b>เลขรายงาน:</b> ${get(r, "เลขรายงาน")}</div>
  
  <div>
  <b>สถานะรายงาน:</b>
  <span class="status ${statusClass}">${status}</span>
</div>
</div>`;
    });

    reportsEl.innerHTML = html || "ไม่พบข้อมูล";
  })
  .catch(err => {
    console.error(err);
    reportsEl.innerHTML = "❌ เกิดข้อผิดพลาดในการโหลดข้อมูล";
  });
