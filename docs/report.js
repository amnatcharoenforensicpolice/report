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
  "ลืออำนาจ2": "103nCws9f7YEXmFu_L4YB_I0sMCn0Bj4DudjF22rqm2E",

  "เมืองอำนาจเจริญ3": "1W_Y8wBDpBnAYX_cr8wIEc0enq7A_S5UVlfGN6-xQuoo",
  "ชานุมาน3": "1FlkyV2UiFawFBWIGZEKiS7XO4AUNP3vccwLojN7Beu0",
  "พนา3": "1dgG0xAgOexMH2y3zOzOBe6ppQPaMhLrq9H0T-F20GK4",
  "เสนางคนิคม3": "1UdQdKNys6lw0Vp3T8ZZPoeVDoiJkZq71eLESrG4H8Aw",
  "หัวตะพาน3": "195ClORmau9_Vm_l_WmcPJStQx7xXPxPxCzVhLUJ3fps",
  "โพนทอง3": "17kz4jHWEPufMwj7Ry-9RuzvZlyTgN-BVKLX5WcbMD9g",
  "ปทุมราชวงศา3": "1hq4HnKnEY-MiH-D-loGdFEDUAwMJZYNtXsGhyy-V9fI",
  "ปลาค้าว3": "1YZ0Ezjgu3SqyWyZ4vI2GK5IEFweZXU7PARWsJ_GpAbU",
  "น้ำปลีก3": "1huiMUgWuKNhddN5Z7WRkfyI6PMq8mbraTsAJ0u8kRCc",
  "ลืออำนาจ3": "1swv6b-u9LIxohV7gtM_AyNINDTMpdsZGqlDmK1m_KA0"
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

// 🔥 แสดงชื่อ สภ. แบบไม่เอาเลขท้าย
const displaySt = st.replace(/[0-9]+$/, "");
titleEl.innerText = `รายงาน สภ. ${displaySt}`;

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

    const get = (row, name) => {
      const idx = headerMap[name];
      if (idx === undefined) return "-";
      return row.c[idx]?.f || row.c[idx]?.v || "-";
    };

    /*************************************************
     * เรียงตามวันที่ล่าสุด
     *************************************************/
    const toDate = v => {
      if (!v) return new Date(0);
      if (typeof v === "string" && v.includes("/")) {
        const [d, m, y] = v.split("/");
        return new Date(y, m - 1, d);
      }
      return new Date(v);
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
  <div><b>วันที่รับแจ้ง:</b> ${get(r, "วัน เดือน ปี ที่รับหนังสือ")}</div>
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
  "ลืออำนาจ2": "103nCws9f7YEXmFu_L4YB_I0sMCn0Bj4DudjF22rqm2E",
  "เมืองอำนาจเจริญ3": "1W_Y8wBDpBnAYX_cr8wIEc0enq7A_S5UVlfGN6-xQuoo",
  "ชานุมาน3": "1FlkyV2UiFawFBWIGZEKiS7XO4AUNP3vccwLojN7Beu0",
  "พนา3": "1dgG0xAgOexMH2y3zOzOBe6ppQPaMhLrq9H0T-F20GK4",
  "เสนางคนิคม3": "1UdQdKNys6lw0Vp3T8ZZPoeVDoiJkZq71eLESrG4H8Aw",
  "หัวตะพาน3": "195ClORmau9_Vm_l_WmcPJStQx7xXPxPxCzVhLUJ3fps",
  "โพนทอง3": "17kz4jHWEPufMwj7Ry-9RuzvZlyTgN-BVKLX5WcbMD9g",
  "ปทุมราชวงศา3": "1hq4HnKnEY-MiH-D-loGdFEDUAwMJZYNtXsGhyy-V9fI",
  "ปลาค้าว3": "1YZ0Ezjgu3SqyWyZ4vI2GK5IEFweZXU7PARWsJ_GpAbU",
  "น้ำปลีก3": "1huiMUgWuKNhddN5Z7WRkfyI6PMq8mbraTsAJ0u8kRCc",
  "ลืออำนาจ3": "1swv6b-u9LIxohV7gtM_AyNINDTMpdsZGqlDmK1m_KA0"
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
  <div><b>วันที่รับตรวจ:</b> ${get(r, "วัน เดือน ปี ที่รับหนังสือ")}</div>
  <div><b>สภ.:</b> ${st}</div>
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
