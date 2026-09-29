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
import {QMenuItem} from "./QMenuItem";

/*******************************************************************************
 * Meta-Data that defines a Menu in a QQQ Instance
 *
 *******************************************************************************/
export class QMenu
{
   label: string;
   icon?: QIcon;
   slot: string;
   items?: QMenuItem[];

   constructor(object: any)
   {
      this.label = object.label;
      if (object.icon)
      {
         this.icon = new QIcon(object.icon);
      }
      this.slot = object.slot;
      if (object.items)
      {
         this.items = object.items.map((item: any) => new QMenuItem(item));
      }
   }

   /***************************************************************************
    *
    ***************************************************************************/
   public clone(): QMenu
   {
      const clone = new QMenu({
         label: this.label,
         slot: this.slot
      });

      clone.icon = this.icon?.clone();

      if (this.items)
      {
         clone.items = this.items.map((item: QMenuItem) => item.clone());
      }

      return (clone);
   }
}
