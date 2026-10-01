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

      const clone = new FieldAdornment({type: this.type});
      clone.values = valuesClone;
      return (clone);
   }
}
