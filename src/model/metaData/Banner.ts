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

/*******************************************************************************
 ** Meta-Data to define a Banner (e.g., used in branding)
 **
 *******************************************************************************/
export class Banner
{
   severity?: string;
   textColor?: string;
   backgroundColor?: string
   messageText?: string;
   messageHTML?: string;
   additionalStyles?: {[name: string]: string | number | boolean}

   constructor(object: any)
   {
      this.severity = object.severity;
      this.textColor = object.textColor;
      this.backgroundColor = object.backgroundColor;
      this.messageText = object.messageText;
      this.messageHTML = object.messageHTML;
      this.additionalStyles = object.additionalStyles;
   }
}
