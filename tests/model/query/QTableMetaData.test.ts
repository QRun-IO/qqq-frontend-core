/*
 * QQQ - Low-code Application Framework for Engineers.
 * Copyright (C) 2021-2025.  Kingsrook, LLC
 * 651 N Broad St Ste 205 # 6917 | Middletown DE 19709 | United States
 * contact@kingsrook.com
 * https://github.com/Kingsrook/
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */


import {QTableMetaData} from "../../../src/model/metaData/QTableMetaData";

describe("QTableMetaData tests", () =>
{
   it("it should clone", () =>
   {
      /////////////////////////////////////
      // build a table with lots of data //
      /////////////////////////////////////
      const table = new QTableMetaData(
         {
            "name": "myTable",
            "label": "My Table",
            "isHidden": false,
            "primaryKeyField": "id",
            "icon": {"name": "link"},
            "fields": {
               "id": {
                  "name": "id",
                  "label": "Id",
                  "type": "INTEGER",
                  "isRequired": false,
                  "isEditable": true,
                  "isHeavy": false,
                  "isHidden": false,
                  "gridColumns": -1,
                  "displayFormat": "%s"
               },
               "name": {
                  "name": "name",
                  "label": "Name",
                  "type": "STRING",
                  "isRequired": false,
                  "isEditable": true,
                  "isHeavy": false,
                  "isHidden": false,
                  "gridColumns": -1,
                  "displayFormat": "%s",
                  "maxLength": 100
               },
               "clientId": {
                  "name": "clientId",
                  "label": "Client",
                  "type": "INTEGER",
                  "isRequired": false,
                  "isEditable": true,
                  "isHeavy": false,
                  "isHidden": false,
                  "gridColumns": -1,
                  "possibleValueSourceName": "client",
                  "displayFormat": "%s",
                  "adornments": [
                     {
                        "type": "LINK",
                        "values": {
                           "toRecordFromTable": "client"
                        }
                     }
                  ]
               },
               "apiKey": {
                  "name": "apiKey",
                  "label": "API Key",
                  "type": "PASSWORD",
                  "isRequired": false,
                  "isEditable": true,
                  "isHeavy": false,
                  "isHidden": false,
                  "gridColumns": -1,
                  "displayFormat": "%s",
                  "adornments": [
                     {
                        "type": "REVEAL"
                     }
                  ]
               },
               "type": {
                  "name": "type",
                  "label": "Type",
                  "type": "BOOLEAN",
                  "isRequired": false,
                  "isEditable": true,
                  "isHeavy": false,
                  "isHidden": false,
                  "gridColumns": -1,
                  "displayFormat": "%s",
                  "possibleValueSourceName": "type",
                  "supplementalFieldMetaData": {
                     "materialDashboard": {
                        "formAdjusterIdentifier": "table:myTable;field:type",
                        "onChangeFormAdjuster": {
                           "name": "com.qqq.MyTableFormAdjuster",
                           "codeType": "JAVA"
                        },
                        "type": "materialDashboard"
                     }
                  }
               },
            },
            "sections": [
               {
                  "name": "identity",
                  "label": "Identity",
                  "tier": "T1",
                  "fieldNames": ["id", "name"],
                  "icon": {"name": "badge"},
                  "isHidden": false
               },
               {
                  "name": "authentication",
                  "label": "Authentication",
                  "tier": "T2",
                  "fieldNames": ["apiKey",],
                  "icon": {"name": "edit_attributes"},
                  "isHidden": false
               },
            ],
            "exposedJoins": [],
            "supplementalTableMetaData": {
               "materialDashboard": {
                  "onLoadFormAdjuster": {
                     "name": "com.qqq.MyTableFormAdjuster",
                     "codeType": "JAVA"
                  },
                  "type": "materialDashboard"
               }
            },
            "capabilities": [
               "TABLE_COUNT",
               "TABLE_GET",
               "TABLE_QUERY",
               "QUERY_STATS",
               "TABLE_INSERT",
               "TABLE_UPDATE",
               "TABLE_DELETE",
               "TABLE_EXPORT"
            ],
            "readPermission": true,
            "insertPermission": true,
            "editPermission": true,
            "deletePermission": true,
            "usesVariants": false,
            "iconName": "link"
         });

      ////////////////////////////////////////////////////////////////
      // clone it - make a few assertions about data being the same //
      ////////////////////////////////////////////////////////////////
      const cloneTable = table.clone();
      expect(cloneTable.name).toEqual(table.name);

      expect(cloneTable.sections?.length).toEqual(2);
      expect(cloneTable.sections?.length).toEqual(table.sections?.length);
      expect(cloneTable.sections?.[0].name).toEqual(table.sections?.[0].name);

      ///////////////////////////////////////////////////////////////////////////////////////////
      // change some things in the clone - assert that they are then not equal to the original //
      ///////////////////////////////////////////////////////////////////////////////////////////
      cloneTable.name = "changed"
      expect(cloneTable.name).not.toEqual(table.name);
      if(cloneTable.sections)
      {
         cloneTable.sections[0].name = "changed"
         cloneTable.sections[0].isHidden = true;
      }

      expect(cloneTable.sections?.[0].name).not.toEqual(table.sections?.[0].name);
      expect(cloneTable.sections?.[0].isHidden).not.toEqual(table.sections?.[0].isHidden);
   });

});