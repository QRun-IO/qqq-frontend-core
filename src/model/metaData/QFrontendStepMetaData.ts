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
import {QFrontendComponent} from "./QFrontendComponent";
import {QHelpContent} from "./QHelpContent";

/*******************************************************************************
 ** Meta-Data to define a step (for the frontend) in a QQQ process.
 **
 *******************************************************************************/
export class QFrontendStepMetaData
{
   name: string;
   label: string;
   format: string;

   components?: QFrontendComponent[];
   formFields?: QFieldMetaData[];
   viewFields?: QFieldMetaData[];
   recordListFields?: QFieldMetaData[];
   helpContents?: QHelpContent[];

   constructor(object: any)
   {
      this.name = object.name;
      this.label = object.label;
      this.format = object.format;

      if (object.components)
      {
         this.components = [];
         for (let i = 0; i < object.components.length; i++)
         {
            this.components.push(new QFrontendComponent(object.components[i]));
         }
      }

      if (object.formFields)
      {
         this.formFields = [];
         for (let i = 0; i < object.formFields.length; i++)
         {
            this.formFields.push(new QFieldMetaData(object.formFields[i]));
         }
      }

      if (object.viewFields)
      {
         this.viewFields = [];
         for (let i = 0; i < object.viewFields.length; i++)
         {
            this.viewFields.push(new QFieldMetaData(object.viewFields[i]));
         }
      }

      if (object.recordListFields)
      {
         this.recordListFields = [];
         for (let i = 0; i < object.recordListFields.length; i++)
         {
            this.recordListFields.push(new QFieldMetaData(object.recordListFields[i]));
         }
      }

      this.helpContents = QHelpContent.buildArray(object.helpContents)
   }
}
