const fs = require("fs");
const path = require("path");
const XLSX = require("xlsx");

const inputPath = process.argv[2];
const outputPath = process.argv[3] || "vkm-register.csv";
const sheetName = "Alpha new";

const CSV_SEPARATOR = ";";

function csvEscape(value) {
  if (value === null || value === undefined) return "";
  const str = String(value);
  if (
    str.includes(CSV_SEPARATOR) ||
    str.includes('"') ||
    str.includes("\n") ||
    str.includes("\r")
  ) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

function findColumnByHeader(sheet, headerRow, searchText) {
  const range = XLSX.utils.decode_range(sheet["!ref"]);
  const needle = searchText.toLowerCase();

  for (let c = range.s.c; c <= range.e.c; c++) {
    const cellAddress = XLSX.utils.encode_cell({ r: headerRow, c });
    const cell = sheet[cellAddress];
    if (!cell || cell.v == null) continue;

    const value = String(cell.v).toLowerCase();
    if (value.includes(needle)) {
      return c;
    }
  }
  return null;
}

try {
  if (!fs.existsSync(inputPath)) {
    console.error(`Datei nicht gefunden: ${inputPath}`);
    process.exit(1);
  }

  const workbook = XLSX.readFile(inputPath);
  const sheet = workbook.Sheets[sheetName];

  if (!sheet) {
    console.error(`Blatt "${sheetName}" wurde in der Excel-Datei nicht gefunden.`);
    process.exit(1);
  }

  const range = XLSX.utils.decode_range(sheet["!ref"]);

  // Suche Header Zeile
  let headerRow = null;
  for (let r = range.s.r; r <= range.e.r && r < 50; r++) {
    for (let c = range.s.c; c <= range.e.c; c++) {
      const cellAddress = XLSX.utils.encode_cell({ r, c });
      const cell = sheet[cellAddress];
      if (!cell || cell.v == null) continue;

      const value = String(cell.v).trim();
      if (value === "VKM Latin (UNIQUE)") {
        headerRow = r;
        break;
      }
    }
    if (headerRow !== null) break;
  }

  if (headerRow === null) {
    console.error(
      'Header-Zeile mit "VKM Latin (UNIQUE)" wurde nicht gefunden. ' +
      "Struktur der Excel-Datei prüfen."
    );
    process.exit(1);
  }

  // 2) Spaltenindizes ermitteln
  const colVkmLatin = findColumnByHeader(sheet, headerRow, "vkm latin");
  const colKeeper = findColumnByHeader(sheet, headerRow, "keeper name");
  const colCountry = findColumnByHeader(sheet, headerRow, "country");
  const colStatus = findColumnByHeader(sheet, headerRow, "status");
  const colWebsite = findColumnByHeader(sheet, headerRow, "www");

  if (
    colVkmLatin === null ||
    colKeeper === null ||
    colCountry === null ||
    colStatus === null ||
    colWebsite === null
  ) {
    console.error(
      "Nicht alle benötigten Spalten konnten gefunden werden.\n" +
      "Gefunden wurde:\n" +
      `  VKM Latin: ${colVkmLatin}\n` +
      `  Keeper:    ${colKeeper}\n` +
      `  Country:   ${colCountry}\n` +
      `  Status:    ${colStatus}\n` +
      `  Website:   ${colWebsite}\n`
    );
    process.exit(1);
  }

  // 3) Datenzeilen auslesen
  const rows = [];
  for (let r = headerRow + 1; r <= range.e.r; r++) {
    const getCell = (col) => {
      const addr = XLSX.utils.encode_cell({ r, c: col });
      const cell = sheet[addr];
      return cell && cell.v != null ? String(cell.v).trim() : "";
    };

    const vkmLatin = getCell(colVkmLatin);
    const keeper = getCell(colKeeper);
    const country = getCell(colCountry);
    const status = getCell(colStatus);
    const website = getCell(colWebsite);

    // Zeilen überspringen, die komplett leer sind
    if (!vkmLatin && !keeper && !country && !status && !website) {
      continue;
    }

    rows.push({ vkmLatin, keeper, country, status, website });
  }

  // 4) CSV erstellen
  const lines = [];
  lines.push(
    [
      csvEscape("VKM"),
      csvEscape("Keeper Name"),
      csvEscape("Country"),
      csvEscape("Status"),
      csvEscape("Website"),
    ].join(CSV_SEPARATOR)
  );
  for (const row of rows) {
    lines.push(
      [
        csvEscape(row.vkmLatin),
        csvEscape(row.keeper),
        csvEscape(row.country),
        csvEscape(row.status),
        csvEscape(row.website),
      ].join(CSV_SEPARATOR)
    );
  }

  const csvContent = lines.join("\n");
  fs.writeFileSync(outputPath, csvContent, "utf8");

  console.log(`CSV-Datei erfolgreich erstellt: ${path.resolve(outputPath)}`);
} catch (err) {
  console.error("Fehler beim Konvertieren des VKM-Registers:", err.message);
  process.exit(1);
}
