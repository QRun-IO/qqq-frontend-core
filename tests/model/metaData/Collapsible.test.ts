/*
 * QQQ - Low-code Application Framework for Engineers.
 * Copyright (C) 2021-2025.  Kingsrook, LLC
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

import {Collapsible} from "../../../src/model/metaData/Collapsible";

describe("Collapsible", () =>
{
   describe("constructor", () =>
   {
      it("should construct with all properties from object", () =>
      {
         const collapsible = new Collapsible({
            isCollapsible: true,
            initiallyOpen: true
         });

         expect(collapsible.isCollapsible).toBe(true);
         expect(collapsible.initiallyOpen).toBe(true);
      });

      it("should handle empty object", () =>
      {
         const collapsible = new Collapsible({});

         //////////////////////////////////////
         // both attributes default to false //
         //////////////////////////////////////
         expect(collapsible.isCollapsible).toBe(false);
         expect(collapsible.initiallyOpen).toBe(false);
      });

      it("should treat non-true values as false", () =>
      {
         const collapsible = new Collapsible({
            isCollapsible: 1,
            initiallyOpen: "true"
         });

         //////////////////////////////////////
         // both attributes default to false //
         //////////////////////////////////////
         expect(collapsible.isCollapsible).toBe(false);
         expect(collapsible.initiallyOpen).toBe(false);
      });
   });
});
