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

import {QIcon} from "./QIcon";

/*******************************************************************************
 * Meta-Data that defines a MenuItem in a QQQ Instance
 *
 *******************************************************************************/
export class QMenuItem
{
   label: string;
   icon?: QIcon;
   itemType: string;
   values?: Map<string, any>;

   constructor(object: any)
   {
      this.label = object.label;
      if (object.icon)
      {
         this.icon = new QIcon(object.icon);
      }
      this.itemType = object.itemType;

      if (object.values)
      {
         this.values = new Map<string, any>();

         for (let key in object.values)
         {
            this.values?.set(key, object.values[key]);
         }
      }
   }

   /***************************************************************************
    *
    ***************************************************************************/
   public clone(): QMenuItem
   {
      const clone = new QMenuItem({
         label: this.label,
         itemType: this.itemType
      });

      clone.icon = this.icon?.clone();

      if (this.values)
      {
         clone.values = new Map<string, any>();
         this.values.forEach((value: any, key: string) => clone.values?.set(key, value));
      }

      return (clone);
   }
}
