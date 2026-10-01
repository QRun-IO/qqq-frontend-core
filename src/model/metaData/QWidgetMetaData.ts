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

import {Collapsible} from "./Collapsible";
import {QHelpContent} from "./QHelpContent";
import {QIcon} from "./QIcon";

/*******************************************************************************
 ** Meta-Data to define a widget in a QQQ instance.
 **
 *******************************************************************************/
export class QWidgetMetaData
{
   name: string;
   label: string;
   tooltip: string;
   type: string;
   icon?: string;
   isCard?: boolean;
   minHeight?: string;
   gridColumns?: number;
   footerHTML?: string;
   hasPermission: boolean = false;
   storeDropdownSelections?: boolean;
   dropdowns?: [{
      name?: string,
      possibleValueSourceName?: string,
      isRequired: boolean
   }];
   showReloadButton: boolean = true;
   showExportButton: boolean = true;

   icons?: Map<string, QIcon>;

   helpContent?: Map<string, QHelpContent[]>;
   defaultValues?: Map<string, any>;
   collapsible?: Collapsible;

   constructor(object: any)
   {
      this.name = object.name;
      this.label = object.label;
      this.tooltip = object.tooltip;
      this.type = object.type;
      this.icon = object.icon;
      this.isCard = object.isCard;
      this.minHeight = object.minHeight;
      this.gridColumns = object.gridColumns;
      this.footerHTML = object.footerHTML;
      this.hasPermission = object.hasPermission;
      this.storeDropdownSelections = object.storeDropdownSelections;
      this.dropdowns = object.dropdowns;
      this.showReloadButton = object.showReloadButton;
      this.showExportButton = object.showExportButton;

      if (object.icons)
      {
         this.icons = new Map<string, QIcon>();
         for (const key in object.icons)
         {
            this.icons.set(key, new QIcon(object.icons[key]));
         }
      }

      this.helpContent = QHelpContent.buildMap(object.helpContent);

      if (object.defaultValues)
      {
         this.defaultValues = new Map<string, any>();
         for (const key in object.defaultValues)
         {
            this.defaultValues.set(key, object.defaultValues[key]);
         }
      }

      if (object.collapsible)
      {
         this.collapsible = new Collapsible(object.collapsible);
      }
   }
}
