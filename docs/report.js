const SHEET_ID = "1qkgsYnJHQKLAY2Rifyu9LMaWqfxSbmE7Sjh49FFyCwE";
const SHEET_URL =
 `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json`;

const st = new URLSearchParams(location.search).get("st");

if (!st) {
  document.getElementById("reports").innerHTML =
    "❗ ลิงก์ไม่ถูกต้อง (ไม่พบชื่อ สภ.)";
  throw new Error("missing st");
}

fetch(SHEET_URL)
  .then(res => res.text())
  .then(text => {
    const json = JSON.parse(text.substring(47).slice(0, -2));
    const table = json.table;

    // map หัวคอลัมน์
    const headerMap = {};
    table.cols.forEach((c,i)=>headerMap[c.label.trim()]=i);

    const get = (row, name) =>
      row.c[headerMap[name]]?.f ||
      row.c[headerMap[name]]?.v ||
      "-";

    const toDate = v => {
      if (typeof v === "string" && v.includes("/")) {
        const [d,m,y] = v.split("/");
        return new Date(y, m-1, d);
      }
      return new Date(v);
    };

    // กรอง + เรียงวันที่ล่าสุด
    const rows = table.rows
      .filter(r => get(r,"สภ.") === st)
      .sort((a,b)=>toDate(get(b,"วัน เดือน ปี
ที่รับหนังสือ"))-toDate(get(a,"วัน เดือน ปี
ที่รับหนังสือ")));

    document.getElementById("title").innerText = `รายงาน ${st}`;

    let html = "";
    rows.forEach(r => {
      html += `
      <div class="report">
        <div><span>เลขรายงาน:</span> ${get(r,"เลขรายงาน")}</div>
        <div><span>เลขหนังสือนำส่ง:</span> ${get(r,"เลขหนังสือนำส่ง")}</div>
        <div><span>วัน เดือน ปี
ที่รับหนังสือ:</span> ${get(r,"วันที่รับงาน")}</div>
        <div class="status ${get(r,"สถานะรายงาน")}">
          <span>สถานะรายงาน:</span> ${get(r,"สถานะรายงาน")}
        </div>
      </div>`;
    });

    document.getElementById("reports").innerHTML =
      html || "ไม่พบข้อมูลของ สภ. นี้";
  });
