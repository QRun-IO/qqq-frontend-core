/*
 * QQQ - Low-code Application Framework for Engineers.
 * Copyright (C) 2021-2026.  Kingsrook, LLC
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

import {QFieldMetaData} from "./QFieldMetaData";

/***************************************************************************
 * Meta-data to represent a virtual field in a table.
 *
 * This is a subclass of QFieldMetaData, as it is on the QQQ backend.
 ***************************************************************************/
export class QVirtualFieldMetaData extends QFieldMetaData
{
   isQueryCriteria: boolean  = false;
   isQuerySelectable: boolean = false;

   /***************************************************************************
    *
    ***************************************************************************/
   constructor(object: any)
   {
      super(object);

      this.isQueryCriteria = object.isQueryCriteria;
      this.isQuerySelectable = object.isQuerySelectable;
   }



   /***************************************************************************
    *
    ***************************************************************************/
   public clone(): QVirtualFieldMetaData
   {
      const clone = super.clone() as QVirtualFieldMetaData;

      ///////////////////////////////////////////////////////////////////////////////
      // any time we do a super clone, we want to set the prototype to our subtype //
      ///////////////////////////////////////////////////////////////////////////////
      Object.setPrototypeOf(clone, QVirtualFieldMetaData.prototype)

      clone.isQueryCriteria = this.isQueryCriteria;
      clone.isQuerySelectable = this.isQuerySelectable;

      return (clone);
   }
}