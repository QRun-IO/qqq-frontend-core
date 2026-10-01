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

import {QExposedJoin} from "./QExposedJoin";
import {QFieldMetaData} from "./QFieldMetaData";
import {QHelpContent} from "./QHelpContent";
import {QMenu} from "./QMenu";
import {QTableSection} from "./QTableSection";
import {QVirtualFieldMetaData} from "./QVirtualFieldMetaData";

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
   virtualFields?: Map<string, QVirtualFieldMetaData>;
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
   menus?: QMenu[];

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

      if (object.virtualFields)
      {
         this.virtualFields = new Map<string, QVirtualFieldMetaData>();
         for (const key in object.virtualFields)
         {
            this.virtualFields.set(key, new QVirtualFieldMetaData(object.virtualFields[key]));
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
         for (let i = 0; i < object.capabilities.length; i++)
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

      if(object.menus)
      {
         this.menus = [];
         for(let i = 0; i < object.menus.length; i++)
         {
            this.menus.push(new QMenu(object.menus[i]));
         }
      }
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

      const virtualFieldsClone = this.virtualFields ? new Map() : undefined;
      if (this.virtualFields && virtualFieldsClone)
      {
         this.virtualFields.forEach((field, name) =>
         {
            virtualFieldsClone.set(name, field.clone());
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

      const supplementalTableMetaDataClone = new Map<String, any>();
      this.supplementalTableMetaData.forEach((value, name) =>
      {
         supplementalTableMetaDataClone.set(name, Object.assign({}, value));
      });

      const menusClone: QMenu[] | undefined = this.menus ? [] : undefined;
      if (this.menus && menusClone)
      {
         for (let i = 0; i < this.menus.length; i++)
         {
            menusClone.push(this.menus[i].clone());
         }
      }

      const clone = new QTableMetaData({...this});

      clone.fields = fieldsClone;
      clone.virtualFields = virtualFieldsClone;
      clone.sections = sectionsClone;
      clone.exposedJoins = exposedJoinsClone;
      clone.capabilities = capabilitiesClone;
      clone.supplementalTableMetaData = supplementalTableMetaDataClone;
      clone.helpContent = helpContentsClone;
      clone.menus = menusClone;

      return (clone);
   }


}
