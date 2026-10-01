/*
 * QQQ - Low-code Application Framework for Engineers.
 * Copyright (C) 2021-2026.  Kingsrook, LLC
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