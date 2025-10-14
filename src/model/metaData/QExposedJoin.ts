/*
 * QQQ - Low-code Application Framework for Engineers.
 * Copyright (C) 2021-2022.  Kingsrook, LLC
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
      this.label = object.label;
      this.isMany = object.isMany;
      this.joinTable = new QTableMetaData(object.joinTable);
      this.joinPath = [];
      for (let i = 0; i < object.joinPath.length; i++)
      {
         this.joinPath.push(new QJoinMetaData(object.joinPath[i]));
      }
   }

   /***************************************************************************
    *
    ***************************************************************************/
   public clone(): QExposedJoin
   {
      const joinTableClone = (this.joinTable as any).clone();

      const joinPathClone: QJoinMetaData[] = [];
      for (let joinMetaData of this.joinPath)
      {
         joinPathClone.push((joinMetaData as any).clone());
      }

      const clone = new QExposedJoin({
         ...this,
         joinTable: joinTableClone,
         joinPath: joinPathClone
      });
      return (clone);
   }
}
