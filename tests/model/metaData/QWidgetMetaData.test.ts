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

import {QWidgetMetaData} from "../../../src/model/metaData/QWidgetMetaData";

describe("QWidgetMetaData", () =>
{
   describe("constructor", () =>
   {
      it("should construct with collapsible object if set in source object", () =>
      {
         const widget = new QWidgetMetaData({
            name: "widget1",
            collapsible: {
               isCollapsible: true,
               initiallyOpen: false
            }
         });

         expect(widget.name).toBe("widget1");
         expect(widget.collapsible?.isCollapsible).toBe(true);
         expect(widget.collapsible?.initiallyOpen).toBe(false);
      });

      it("should construct with undefined collapsible object if not present in source object", () =>
      {
         const widget = new QWidgetMetaData({
            name: "widget2"
         });

         expect(widget.name).toBe("widget2");
         expect(widget.collapsible).toBeUndefined();
      });

      it("should construct with collapsible object with null values if empty collapsible object is in source", () =>
      {
         const widget = new QWidgetMetaData({
            name: "widget3",
            collapsible: {}
         });

         expect(widget.name).toBe("widget3");
         expect(widget.collapsible?.isCollapsible).toBe(false);
         expect(widget.collapsible?.initiallyOpen).toBe(false);
      });

   });

});
