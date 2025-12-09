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


import {QHelpContent} from "../../../src/model/metaData/QHelpContent";
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
                  ],
                  "possibleValueSourceFilter": {
                     "criteria": [
                        {
                           "fieldName": "isActive",
                           "operator": "EQUALS",
                           "values": [
                              true
                           ]
                        }
                     ],
                     "booleanOperator": "AND",
                     "subFilters": [
                        {
                           "criteria": [
                              {
                                 "fieldName": "clientId",
                                 "operator": "EQUALS",
                                 "values": [
                                    "${input.clientId}"
                                 ]
                              },
                              {
                                 "fieldName": "clientId",
                                 "operator": "IS_BLANK"
                              }
                           ],
                           "booleanOperator": "OR"
                        }
                     ]
                  }
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
                  "helpContents": [
                     {
                        "content": "Field Help",
                        "format": "MARKDOWN",
                        "roles": ["READ_SCREENS"],
                        "contentAsHtml": "Field Help"
                     }
                  ],
                  "supplementalFieldMetaData": {
                     "materialDashboard": {
                        "formAdjusterIdentifier": "table:connection;field:externalSystemId",
                        "onChangeFormAdjuster": {
                           "name": "com.coldtrack.live.tables.setup.customizers.ConnectionTableMetaDataAdjuster",
                           "codeType": "JAVA"
                        },
                        "type": "materialDashboard"
                     }
                  },
                  "adornments": [
                     {
                        "type": "LINK",
                        "values": {"toRecordFromTable": "foreignTable"}
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
                  "isHidden": false,
                  "alternatives": {
                     "RECORD_VIEW": {
                        "name": "identityView",
                        "label": "Identity",
                        "fieldNames": ["id", "specialName"]
                     }
                  }
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
            "iconName": "link",
            "helpContents": {
               "key": [
                  {
                     "content": "Table Help",
                     "format": "MARKDOWN",
                     "roles": ["WRITE_SCREENS"],
                     "contentAsHtml": "Table Help"
                  }
               ]
            }
         });

      ////////////////////////////////////////////////////////////////
      // clone it - make a few assertions about data being the same //
      ////////////////////////////////////////////////////////////////
      const cloneTable = table.clone();
      expect(cloneTable.name).toEqual(table.name);

      expect(cloneTable.sections?.length).toEqual(2);
      expect(cloneTable.sections?.length).toEqual(table.sections?.length);
      expect(cloneTable.sections?.[0].name).toEqual(table.sections?.[0].name);
      expect(cloneTable.sections?.[0].iconName).toEqual(table.sections?.[0].iconName);
      expect(cloneTable.sections?.[0].alternatives?.size).toEqual(1);

      expect(cloneTable.capabilities.size).toEqual(table.capabilities.size);

      expect(cloneTable.helpContent?.size).toEqual(table.helpContent?.size);
      expect(cloneTable.helpContent?.get("key")?.[0].roles.size).not.toEqual(0);
      expect(cloneTable.helpContent?.get("key")?.[0].roles.size).toEqual(table.helpContent?.get("key")?.[0].roles.size);

      expect(cloneTable.supplementalTableMetaData.size).not.toEqual(0);
      expect(cloneTable.supplementalTableMetaData.size).toEqual(table.supplementalTableMetaData.size);

      const apiKeyField = table.fields?.get("apiKey");
      const cloneApiKeyField = cloneTable.fields?.get("apiKey");
      expect(cloneApiKeyField?.supplementalFieldMetaData.size).not.toEqual(0);
      expect(cloneApiKeyField?.supplementalFieldMetaData.size).toEqual(apiKeyField?.supplementalFieldMetaData.size);
      expect(cloneApiKeyField?.adornments?.length).not.toEqual(0);
      expect(cloneApiKeyField?.adornments?.length).toEqual(apiKeyField?.adornments?.length);
      expect(cloneApiKeyField?.adornments?.[0].values?.size).not.toEqual(0);
      expect(cloneApiKeyField?.adornments?.[0].values?.size).toEqual(apiKeyField?.adornments?.[0].values?.size);

      ////////////////////////////////////////////////////////////////////////////////////////////////
      // turns out toEqual will do a deep equality test, so, we could have just done this all along //
      ////////////////////////////////////////////////////////////////////////////////////////////////
      expect(cloneTable).toEqual(table);

      ///////////////////////////////////////////////////////////////////////////////////////////
      // change some things in the clone - assert that they are then not equal to the original //
      ///////////////////////////////////////////////////////////////////////////////////////////
      cloneTable.name = "changed";
      expect(cloneTable.name).not.toEqual(table.name);
      if (cloneTable.sections)
      {
         cloneTable.sections[0].name = "changed";
         cloneTable.sections[0].isHidden = true;
      }

      expect(cloneTable.sections?.[0].name).not.toEqual(table.sections?.[0].name);
      expect(cloneTable.sections?.[0].isHidden).not.toEqual(table.sections?.[0].isHidden);

      cloneTable.capabilities.delete("TABLE_COUNT");
      expect(cloneTable.capabilities.size).not.toEqual(table.capabilities.size);

      if (cloneTable.helpContent && table.helpContent) // avoid possibly-undef and ?. on left-hand sides below
      {
         cloneTable.helpContent.set("key2", []);
         expect(cloneTable.helpContent.size).not.toEqual(table.helpContent.size);

         cloneTable.helpContent.get("key")?.push(new QHelpContent({}));
         expect(cloneTable.helpContent.get("key")?.length).not.toEqual(table.helpContent.get("key")?.length);

         cloneTable.helpContent.get("key")?.[0].roles.add("READ_SCREENS");
         expect(cloneTable.helpContent.get("key")?.[0].roles.size).not.toEqual(table.helpContent.get("key")?.[0].roles.size);
      }
      else
      {
         fail("help content wasn't set in either table or cloneTable (or neither)");
      }

      cloneTable.sections?.[0]?.fieldNames?.push("foobar");
      expect(cloneTable.sections?.[0]?.fieldNames?.length).not.toEqual(table.sections?.[0]?.fieldNames?.length);

      cloneTable.sections?.[0]?.alternatives?.get("RECORD_VIEW")?.fieldNames?.push("another");
      expect(table.sections?.[0]?.alternatives?.get("RECORD_VIEW")?.fieldNames?.length).toEqual(2);
      expect(cloneTable.sections?.[0]?.alternatives?.get("RECORD_VIEW")?.fieldNames?.length).toEqual(3);
   });

});