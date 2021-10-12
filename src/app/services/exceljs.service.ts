import { Injectable } from '@angular/core';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { Caja } from '../interfaces/caja';

@Injectable({
  providedIn: 'root'
})
export class ExceljsService {

  constructor() { }

  exportExcel(excelData:any) {

    //Title, Header & Data
    const title = excelData.title;
    const header = excelData.headers
    const data = excelData.data;

    //Create a workbook with a worksheet
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Caja');


    //Add Row and formatting
    worksheet.mergeCells('C1', 'F4');
    let titleRow = worksheet.getCell('C1');
    titleRow.value = title
    titleRow.font = {
      name: 'Calibri',
      size: 16,
      underline: 'single',
      bold: true,
      color: { argb: '0085A3' }
    }
    titleRow.alignment = { vertical: 'middle', horizontal: 'center' }

    // Date
    worksheet.mergeCells('G1:H4');
    let d = new Date();
    let date = d.getDate() + '-' + d.getMonth() + '-' + d.getFullYear();
    let dateCell = worksheet.getCell('G1');
    dateCell.value = date;
    dateCell.font = {
      name: 'Calibri',
      size: 12,
      bold: true
    }
    dateCell.alignment = { vertical: 'middle', horizontal: 'center' }

    //Blank Row 
    worksheet.addRow([]);
    worksheet.addRow([]);
    worksheet.addRow([]);
    worksheet.addRow([]);
    //Adding Header Row
    let headerRow = worksheet.addRow(header);
    headerRow.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '4167B8' },
        bgColor: { argb: '' }
      }
      cell.font = {
        bold: true,
        color: { argb: 'FFFFFF' },
        size: 12
      }
    })
    worksheet.addRow([]);
    worksheet.columns = [
      {key:'fecha'},
      {key:'movimiento'},
      {key:'detalle'},
      {key:'importe'},
      {key:'recibo'},
      {key:'name'},
      {key:'last_name'},

    ];
    // Adding Data with Conditional Formatting
   console.log("Voy a imprimir la data antes de bajar el excel")
   console.log(data)
   data.forEach( (d:Caja, count:Number) => {
     
     worksheet.addRow(d);
     
    }
    );

    worksheet.getColumn(3).width = 20;
    worksheet.addRow([]);

    
    //Generate & Save Excel File
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, title + '.xlsx');
    })

  }
}

