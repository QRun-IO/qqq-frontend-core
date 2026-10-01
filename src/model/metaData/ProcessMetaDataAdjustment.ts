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

import {QFieldMetaData} from "./QFieldMetaData";
import {QFrontendStepMetaData} from "./QFrontendStepMetaData";

/*******************************************************************************
 ** Meta-Data to define a ProcessMetaDataAdjustment
 **
 *******************************************************************************/
export class ProcessMetaDataAdjustment
{
   updatedFrontendStepList?: QFrontendStepMetaData[];
   updatedFields?: Map<string, QFieldMetaData>;


   constructor(object: any)
   {
      if (object.updatedFrontendStepList)
      {
         this.updatedFrontendStepList = [];
         for (let i = 0; i < object.updatedFrontendStepList.length; i++)
         {
            this.updatedFrontendStepList.push(new QFrontendStepMetaData(object.updatedFrontendStepList[i]));
         }
      }

      if(object.updatedFields)
      {
         this.updatedFields = new Map<string, QFieldMetaData>();
         for (const key in object.updatedFields)
         {
            this.updatedFields.set(key, new QFieldMetaData(object.updatedFields[key]));
         }
      }

   }

}
