/*
 * QQQ - Low-code Application Framework for Engineers.
 * Copyright (C) 2021-2022.  Kingsrook, LLC
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
