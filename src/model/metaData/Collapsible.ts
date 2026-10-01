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
 ** Meta-Data to define Collapsible state, e.g., for a section or widget
 **
 *******************************************************************************/
export class Collapsible
{
   isCollapsible: boolean;
   initiallyOpen: boolean;

   constructor(object: any)
   {
      ////////////////////////////////////////////////////////////////////////////
      // use value === true to let undefined (or any other) values become false //
      ////////////////////////////////////////////////////////////////////////////
      this.isCollapsible = object.isCollapsible === true;
      this.initiallyOpen = object.initiallyOpen === true;
   }


   /***************************************************************************
    *
    ***************************************************************************/
   public clone(): Collapsible
   {
      const clone = new Collapsible({
         ...this
      });
      return (clone);
   }
}
