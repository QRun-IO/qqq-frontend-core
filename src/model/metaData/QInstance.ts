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

import {QAppMetaData} from "./QAppMetaData";
import {QAppNodeType} from "./QAppNodeType";
import {QAppTreeNode} from "./QAppTreeNode";
import {QBrandingMetaData} from "./QBrandingMetaData";
import {QHelpContent} from "./QHelpContent";
import {QProcessMetaData} from "./QProcessMetaData";
import {QReportMetaData} from "./QReportMetaData";
import {QTableMetaData} from "./QTableMetaData";
import {QThemeMetaData} from "./QThemeMetaData";
import {QWidgetMetaData} from "./QWidgetMetaData";

/*******************************************************************************
 ** Meta-Data definition of a QQQ Instance
 **
 *******************************************************************************/
export class QInstance
{
   tables?: Map<string, QTableMetaData>;
   processes?: Map<string, QProcessMetaData>;
   reports?: Map<string, QReportMetaData>;
   widgets?: Map<string, QWidgetMetaData>;
   apps?: Map<string, QAppMetaData>;
   appTree?: QAppTreeNode[];
   branding?: QBrandingMetaData;
   theme?: QThemeMetaData;
   environmentValues?: Map<string, string>;
   helpContent?: Map<string, QHelpContent[]>;
   supplementalInstanceMetaData: Map<String, any> = new Map();
   redirects: Map<string, string> = new Map();
   private pathsMap: Record<string, {path: string, affinity: number}[]> = {};

   constructor(object: any)
   {
      if (object.tables)
      {
         this.tables = new Map<string, QTableMetaData>();
         for (const key in object.tables)
         {
            this.tables.set(key, new QTableMetaData(object.tables[key]));
         }
      }

      if (object.processes)
      {
         this.processes = new Map<string, QProcessMetaData>();
         for (const key in object.processes)
         {
            this.processes.set(key, new QProcessMetaData(object.processes[key]));
         }
      }

      if (object.reports)
      {
         this.reports = new Map<string, QReportMetaData>();
         for (const key in object.reports)
         {
            this.reports.set(key, new QReportMetaData(object.reports[key]));
         }
      }

      if (object.apps)
      {
         this.apps = new Map<string, QAppMetaData>();
         for (const key in object.apps)
         {
            this.apps.set(key, new QAppMetaData(object.apps[key]));
         }
      }

      if (object.widgets)
      {
         this.widgets = new Map<string, QWidgetMetaData>();
         for (const key in object.widgets)
         {
            this.widgets.set(key, new QWidgetMetaData(object.widgets[key]));
         }
      }

      if (object.appTree)
      {
         this.appTree = [];
         for (let i = 0; i < object.appTree.length; i++)
         {
            this.appTree.push(new QAppTreeNode(object.appTree[i]));
         }
      }

      if (object.branding)
      {
         this.branding = new QBrandingMetaData(object.branding);
      }

      if (object.environmentValues)
      {
         this.environmentValues = new Map<string, string>();
         for (const key in object.environmentValues)
         {
            this.environmentValues.set(key, object.environmentValues[key]);
         }
      }

      if (object.supplementalInstanceMetaData)
      {
         for (const key in object.supplementalInstanceMetaData)
         {
            this.supplementalInstanceMetaData.set(key, object.supplementalInstanceMetaData[key]);
         }

         if (object.supplementalInstanceMetaData["theme"])
         {
            this.theme = new QThemeMetaData(object.supplementalInstanceMetaData["theme"]);
         }
      }

      this.helpContent = QHelpContent.buildMap(object.helpContents);

      if (object.redirects)
      {
         for (const key in object.redirects)
         {
            this.redirects.set(key, object.redirects[key]);
         }
      }

      this.buildPathsMap(this.appTree || []);
   }


   /***************************************************************************
    * populate the private/internal "pathsMap" - with lists of all available
    * paths to tables, processes, etc (where a table in more than 1 app will
    * have more than 1 entry).  This is used to help determine which app to
    * open when a user clicks on a table name.  To select a path, they should
    * be sorted by affinity, so that the most preferred app is first.
    ***************************************************************************/
   buildPathsMap(nodes: QAppTreeNode[], path: string = ""): void
   {
      for (let i = 0; i < nodes.length; i++)
      {
         const node = nodes[i];
         if(node.type === QAppNodeType.APP && node.children)
         {
            this.buildPathsMap(node.children, path + "/" + node.name);
         }
         else
         {
            if(!this.pathsMap[node.name])
            {
               this.pathsMap[node.name] = [];
            }
            this.pathsMap[node.name].push({path: path + "/" + node.name, affinity: node.appAffinity ?? Number.MIN_SAFE_INTEGER});
         }
      }
   }


   /*******************************************************************************
    ** Get the full path to an app
    *******************************************************************************/
   getAppPath(app: QAppMetaData): string | null
   {
      return QInstance.searchAppTreeForPath(this.appTree, app.name, QAppNodeType.APP, 1, "");
   }


   /*******************************************************************************
    ** Get the full path to a table
    *******************************************************************************/
   getTablePath(table: QTableMetaData): string | null
   {
      return this.getTablePathByName(table.name);
   }

   /*******************************************************************************
    ** Get the full path to a table
    *******************************************************************************/
   getTablePathByName(tableName: string): string | null
   {
      const value = this.pathsMap[tableName];
      if(value)
      {
         value.sort((a, b) => b.affinity - a.affinity);
         return (value[0].path);
      }

      return (null);
   }

   /*******************************************************************************
    **
    *******************************************************************************/
   private static searchAppTreeForPath(nodes: QAppTreeNode[] | undefined, name: string, appNodeType: QAppNodeType, depth: number, path: string): string | null
   {
      if (nodes === undefined)
      {
         return (null);
      }

      for (let i = 0; i < nodes.length; i++)
      {
         if (nodes[i].type === appNodeType && nodes[i].name === name)
         {
            /////////////////////////////////////////////////////////////////////////////////
            // dont show top level apps, unless they don't have any children that are apps //
            /////////////////////////////////////////////////////////////////////////////////
            if (appNodeType === QAppNodeType.APP && depth === 1)
            {
               let appChildren = null;
               if (nodes[i] && nodes[i].children)
               {
                  appChildren = nodes[i].children?.filter((child) =>
                  {
                     return child.type == QAppNodeType.APP;
                  });
               }

               if (appChildren && appChildren.length > 0)
               {
                  return (null);
               }
            }
            return (`${path}/${name}`);
         }
         else if (nodes[i].type === QAppNodeType.APP)
         {
            const result = this.searchAppTreeForPath(nodes[i].children, name, appNodeType, depth + 1, `${path}/${nodes[i].name}`);
            if (result !== null)
            {
               return (result);
            }
         }
      }
      return (null);
   }

}
