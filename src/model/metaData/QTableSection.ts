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

import {QHelpContent} from "./QHelpContent";

/*******************************************************************************
 ** Meta-Data to define a section (of fields) in a table in a QQQ instance.
 **
 *******************************************************************************/
export class QTableSection
{
   name: string;
   label: string;
   tier: string; // todo - enum
   iconName: string;
   fieldNames?: string[];
   widgetName?: string;
   isHidden: boolean;
   gridColumns?: number;
   helpContents?: QHelpContent[];
   alternatives?: Map<string, QTableSection>;


   /*******************************************************************************
    **
    *******************************************************************************/
   constructor(object: any)
   {
      this.name = object.name;
      this.label = object.label;
      this.tier = object.tier;
      this.iconName = object.icon ? object.icon.name : object.iconName;

      if (object.fieldNames)
      {
         this.fieldNames = object.fieldNames;
      }

      this.isHidden = object.isHidden;
      this.widgetName = object.widgetName;
      this.gridColumns = object.gridColumns;

      this.helpContents = QHelpContent.buildArray(object.helpContents)

      if (object.alternatives)
      {
         this.alternatives = new Map<string, QTableSection>();
         for (let type in object.alternatives)
         {
            this.alternatives.set(type, new QTableSection(object.alternatives[type]));
         }
      }
   }

   /***************************************************************************
    *
    ***************************************************************************/
   public clone(): QTableSection
   {
      let fieldNamesClone: string[] | undefined = undefined;
      if(this.fieldNames)
      {
         fieldNamesClone = [...this.fieldNames];
      }

      const helpContentsClone: QHelpContent[] = (this.helpContents ? [] : undefined) as QHelpContent[];
      if(this.helpContents && helpContentsClone)
      {
         for (let helpContent of this.helpContents)
         {
            helpContentsClone.push((helpContent as any).clone());
         }
      }

      const alternativesClone: Map<string, QTableSection> | undefined = (this.alternatives ? new Map<string, QTableSection> : undefined)
      if(this.alternatives && alternativesClone)
      {
         this.alternatives.forEach((value: QTableSection, key: string) =>
            alternativesClone.set(key, value.clone()));
      }

      const clone = new QTableSection({...this});

      clone.fieldNames = fieldNamesClone;
      clone.helpContents = helpContentsClone;
      clone.alternatives = alternativesClone;

      return (clone);
   }

}
