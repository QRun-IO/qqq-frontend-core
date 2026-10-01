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
   collapsible?: Collapsible;


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

      if (object.collapsible)
      {
         this.collapsible = new Collapsible(object.collapsible);
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

      const collapsibleClone: Collapsible | undefined = (this.collapsible ? this.collapsible.clone() : undefined);

      const clone = new QTableSection({...this});

      clone.fieldNames = fieldNamesClone;
      clone.helpContents = helpContentsClone;
      clone.alternatives = alternativesClone;
      clone.collapsible = collapsibleClone;

      return (clone);
   }

}
