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

import {QJoinMetaData} from "./QJoinMetaData";
import {QTableMetaData} from "./QTableMetaData";

/*******************************************************************************
 ** Meta-Data to define a Join for a table that should be visible on the frontend
 ** (e.g., query screens).
 **
 *******************************************************************************/
export class QExposedJoin
{
   label: string;
   isMany: boolean;
   joinTable: QTableMetaData;
   joinPath: QJoinMetaData[];

   constructor(object: any)
   {
      this.label = object?.label;
      this.isMany = object?.isMany;
      this.joinTable = new QTableMetaData(object?.joinTable);
      this.joinPath = [];
      for (let i = 0; i < object?.joinPath?.length; i++)
      {
         this.joinPath.push(new QJoinMetaData(object.joinPath[i]));
      }
   }

   /***************************************************************************
    *
    ***************************************************************************/
   public clone(): QExposedJoin
   {
      const joinTableClone = this.joinTable?.clone();

      const joinPathClone: QJoinMetaData[] = [];
      for (let joinMetaData of this.joinPath ?? [])
      {
         joinPathClone.push(joinMetaData.clone());
      }

      const clone = new QExposedJoin({
         ...this,
         joinTable: joinTableClone,
         joinPath: joinPathClone
      });
      // overwrite joinTable — the constructor re-wraps it in new QTableMetaData(),
      // which loses Map-based fields/virtualFields from the already-cloned object
      clone.joinTable = joinTableClone;
      return (clone);
   }
}
