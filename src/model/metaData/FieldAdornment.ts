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

import {AdornmentType} from "./AdornmentType";
import {QFieldMetaData} from "./QFieldMetaData";

/*******************************************************************************
 ** Meta-data to represent an adornment for a field
 **
 *******************************************************************************/
export class FieldAdornment
{
   type: AdornmentType;
   values?: Map<string, any>;

   constructor(object: any)
   {
      this.type = object.type;

      if (object.values)
      {
         this.values = new Map<string, any>();
         for (const key in object.values)
         {
            this.values.set(key, object.values[key]);
         }
      }
   }

   getValue(key: string): any
   {
      if (this.values)
      {
         return (this.values.get(key));
      }
      return (null);
   }

   /***************************************************************************
    *
    ***************************************************************************/
   public clone(): FieldAdornment
   {
      const valuesClone = this.values ? new Map<string, any>() : undefined;
      if(this.values && valuesClone)
      {
         this.values.forEach((value, key) =>
         {
            valuesClone.set(key, value);
         });
      }

      const clone = new FieldAdornment({
         ...this,
         values: valuesClone
      });
      return (clone);
   }
}
