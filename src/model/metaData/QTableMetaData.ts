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

import {QExposedJoin} from "./QExposedJoin";
import {QFieldMetaData} from "./QFieldMetaData";
import {QHelpContent} from "./QHelpContent";
import {QTableSection} from "./QTableSection";

/*******************************************************************************
 ** Meta-Data to define a table in a QQQ instance.
 **
 *******************************************************************************/
export class QTableMetaData
{
   name: string;
   label: string;
   isHidden: boolean = false;
   primaryKeyField: string;
   fields?: Map<string, QFieldMetaData>;
   iconName?: string;
   sections?: QTableSection[];
   exposedJoins?: QExposedJoin[];
   capabilities: Set<string>;
   readPermission: boolean = false;
   insertPermission: boolean = false;
   editPermission: boolean = false;
   deletePermission: boolean = false;
   usesVariants: boolean = false;
   variantTableLabel: string = "";
   supplementalTableMetaData: Map<String, any> = new Map();
   shareableTableMetaData: any;
   helpContent?: Map<string, QHelpContent[]>;

   constructor(object: any)
   {
      this.name = object.name;
      this.label = object.label;
      this.isHidden = object.isHidden;
      this.primaryKeyField = object.primaryKeyField;
      this.iconName = object.iconName;
      this.readPermission = object.readPermission;
      this.insertPermission = object.insertPermission;
      this.editPermission = object.editPermission;
      this.deletePermission = object.deletePermission;
      this.usesVariants = object.usesVariants;
      this.variantTableLabel = object.variantTableLabel;

      if (object.fields)
      {
         this.fields = new Map<string, QFieldMetaData>();
         for (const key in object.fields)
         {
            this.fields.set(key, new QFieldMetaData(object.fields[key]));
         }
      }

      if (object.sections)
      {
         this.sections = [];
         for (let i = 0; i < object.sections.length; i++)
         {
            this.sections.push(new QTableSection(object.sections[i]));
         }
      }

      if (object.exposedJoins)
      {
         this.exposedJoins = [];
         for (let i = 0; i < object.exposedJoins.length; i++)
         {
            this.exposedJoins.push(new QExposedJoin(object.exposedJoins[i]));
         }
      }

      this.capabilities = new Set<string>();
      if (object.capabilities)
      {
         for (var i = 0; i < object.capabilities.length; i++)
         {
            this.capabilities.add(object.capabilities[i]);
         }
      }

      if (object.supplementalTableMetaData)
      {
         for (const key in object.supplementalTableMetaData)
         {
            this.supplementalTableMetaData.set(key, object.supplementalTableMetaData[key]);
         }
      }

      this.shareableTableMetaData = object.shareableTableMetaData;

      this.helpContent = QHelpContent.buildMap(object.helpContents);
   }


   /***************************************************************************
    *
    ***************************************************************************/
   public clone(): QTableMetaData
   {
      const fieldsClone = this.fields ? new Map() : undefined;
      if (this.fields && fieldsClone)
      {
         this.fields.forEach((field, name) =>
         {
            fieldsClone.set(name, field.clone());
         });
      }

      const sectionsClone: QTableSection[] | undefined = this.sections ? [] : undefined;
      if (this.sections && sectionsClone)
      {
         for (let section of this.sections)
         {
            sectionsClone.push((section as any).clone());
         }
      }

      const exposedJoinsClone: QExposedJoin[] | undefined = this.exposedJoins ? [] : undefined;
      if (this.exposedJoins && exposedJoinsClone)
      {
         for (let exposedJoin of this.exposedJoins)
         {
            exposedJoinsClone.push((exposedJoin as any).clone());
         }
      }

      const capabilitiesClone = new Set<string>();
      if (this.capabilities && capabilitiesClone)
      {
         this.capabilities.forEach((capability) =>
         {
            capabilitiesClone.add(capability);
         });
      }

      const helpContentsClone = this.helpContent ? new Map() : undefined;
      if (this.helpContent && helpContentsClone)
      {
         this.helpContent.forEach((helpContentArray, name) =>
         {
            if (helpContentArray)
            {
               const helpContentArrayClone: QHelpContent[] = [];
               for (let qHelpContent of helpContentArray)
               {
                  helpContentArrayClone.push((qHelpContent as any).clone());
               }
               helpContentsClone.set(name, helpContentArrayClone);
            }
         });
      }

      const clone = new QTableMetaData({...this});
      clone.fields = fieldsClone;
      clone.sections = sectionsClone;
      clone.exposedJoins = exposedJoinsClone;
      clone.capabilities = capabilitiesClone;
      clone.supplementalTableMetaData = new Map(this.supplementalTableMetaData);
      clone.helpContent = helpContentsClone;

      return (clone);
   }


}
