/*
 * QQQ - Low-code Application Framework for Engineers.
 * Copyright (C) 2021-2022.  Kingsrook, LLC
 * 651 N Broad St Ste 205 # 6917 | Middletown DE 19709 | United States
 * contact@kingsrook.com
 * https://github.com/Kingsrook/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


/*******************************************************************************
 ** Data Record within qqq.  e.g., a single row from a database.
 **
 *******************************************************************************/
export class QRecord
{
   tableName: string;
   recordLabel: string;
   values: Map<string, any>;
   displayValues: Map<string, string>;
   associatedRecords?: Map<string, QRecord[]>;
   errors?: string[];
   warnings?: string[];

   constructor(object: any)
   {
      this.tableName = object.tableName;
      this.recordLabel = object.recordLabel;

      this.values = new Map<string, any>();
      for (const key in object.values)
      {
         this.values.set(key, object.values[key]);
      }

      this.displayValues = new Map<string, any>();
      for (const key in object.displayValues)
      {
         this.displayValues.set(key, object.displayValues[key]);
      }

      if (object.associatedRecords)
      {
         this.associatedRecords = new Map<string, QRecord[]>();
         for (const key in object.associatedRecords)
         {
            const list: QRecord[] = [];
            this.associatedRecords.set(key, list);
            for (let i = 0; i < object.associatedRecords[key].length; i++)
            {
               list.push(new QRecord(object.associatedRecords[key][i]));
            }
         }
      }

      if(object.errors)
      {
         this.errors = [];
         for (let i = 0; i < object.errors.length; i++)
         {
            this.errors.push(object.errors[i].message ?? object.errors[i])
         }
      }

      if(object.warnings)
      {
         this.warnings = [];
         for (let i = 0; i < object.warnings.length; i++)
         {
            this.warnings.push(object.warnings[i].message ?? object.warnings[i])
         }
      }
   }
}

