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
