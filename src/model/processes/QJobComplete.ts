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

import {ProcessMetaDataAdjustment} from "../metaData/ProcessMetaDataAdjustment";
import {QFrontendStepMetaData} from "../metaData/QFrontendStepMetaData";

/*******************************************************************************
 ** Indication that a process step has successfully finished running.
 **
 *******************************************************************************/
export class QJobComplete
{
   processUUID: string;
   values?: any;
   nextStep: string;
   backStep: string;
   processMetaDataAdjustment?: ProcessMetaDataAdjustment;

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
   // this field is deprecated - but leaving it here for a few minor versions for some degree of backward compatibility //
   ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
   updatedFrontendStepList?: QFrontendStepMetaData[];

   constructor(object: any)
   {
      this.processUUID = object.processUUID;
      this.values = object.values || {};
      this.nextStep = object.nextStep;
      this.backStep = object.backStep;

      if (object.processMetaDataAdjustment)
      {
         this.processMetaDataAdjustment = new ProcessMetaDataAdjustment(object.processMetaDataAdjustment);
      }
   }

}
