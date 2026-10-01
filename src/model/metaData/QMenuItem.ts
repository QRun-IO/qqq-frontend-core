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
