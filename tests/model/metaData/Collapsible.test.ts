/*
 * QQQ - Low-code Application Framework for Engineers.
 * Copyright (C) 2021-2025.  Kingsrook, LLC
 * 651 N Broad St Ste 205 # 6917 | Middletown DE 19709 | United States
 * contact@kingsrook.com
 * https://github.com/Kingsrook/
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
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
