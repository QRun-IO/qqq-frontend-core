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

import {QFrontendStepMetaData} from "./QFrontendStepMetaData";

/*******************************************************************************
 ** Meta-Data to define a process in a QQQ instance.
 **
 *******************************************************************************/
export class QProcessMetaData
{
   name: string;
   label: string;
   tableName: string;
   isHidden: boolean = false;
   iconName?: string;
   frontendSteps?: QFrontendStepMetaData[];
   hasPermission: boolean = false;
   stepFlow: string = "LINEAR";
   minInputRecords?: number;
   maxInputRecords?: number;

   constructor(object: any)
   {
      this.name = object.name;
      this.label = object.label;
      this.tableName = object.tableName;
      this.isHidden = object.isHidden;
      this.iconName = object.iconName;
      this.hasPermission = object.hasPermission;
      this.minInputRecords = object.minInputRecords;
      this.maxInputRecords = object.maxInputRecords;

      if(object.stepFlow)
      {
         this.stepFlow = object.stepFlow;
      }

      if (object.frontendSteps)
      {
         this.frontendSteps = [];
         for (let i = 0; i < object.frontendSteps.length; i++)
         {
            this.frontendSteps.push(
               new QFrontendStepMetaData(object.frontendSteps[i])
            );
         }
      }
   }
}
