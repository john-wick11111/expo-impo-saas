import * as XLSX from 'xlsx';
import path from 'path';

const filePath = path.join(__dirname, '../../dubai buisness contacts.xls');
const workbook = XLSX.readFile(filePath);
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];

import fs from 'fs';
const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
fs.writeFileSync(path.join(__dirname, 'columns.json'), JSON.stringify(data[0], null, 2));
console.log('Total Rows:', data.length);
console.log('Total Rows:', data.length);
