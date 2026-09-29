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

/*******************************************************************************
 ** Meta-Data that defines a Join in a QQQ Instance
 **
 *******************************************************************************/
export class QJoinMetaData
{
   name: string;
   type: "ONE_TO_ONE" | "ONE_TO_MANY" | "MANY_TO_ONE";
   leftTable: string;
   rightTable: string;

   constructor(object: any)
   {
      this.name = object.name;
      this.type = object.type;
      this.leftTable = object.leftTable;
      this.rightTable = object.rightTable;
   }

   /***************************************************************************
    *
    ***************************************************************************/
   public clone(): QJoinMetaData
   {
      const clone = new QJoinMetaData({
         ...this
      });
      return (clone);
   }
}
