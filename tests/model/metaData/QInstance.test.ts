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

import {QAppMetaData} from "../../../src/model/metaData/QAppMetaData";
import {QAppNodeType} from "../../../src/model/metaData/QAppNodeType";
import {QAppTreeNode} from "../../../src/model/metaData/QAppTreeNode";
import {QInstance} from "../../../src/model/metaData/QInstance";
import {QTableMetaData} from "../../../src/model/metaData/QTableMetaData";

describe("QInstance", () =>
{
   describe("getTablePath", () =>
   {
      it("should work for basic case (tables in only 1 app)", () =>
      {
         const qInstance = buildTestQInstance();
         expect(qInstance.getTablePathByName("order")).toBe("/oms/order");
         expect(qInstance.getTablePathByName("group")).toBe("/admin/usermgr/group");
         expect(qInstance.getTablePathByName("role")).toBe("/setup/role");
      });

      it("should use app affinity when table is in two apps", () =>
      {
         const qInstance1 = buildTestQInstance({user: {admin: 50, setup: 100}});
         expect(qInstance1.getTablePathByName("user")).toBe("/setup/user");

         const qInstance2 = buildTestQInstance({user: {admin: 1}});
         expect(qInstance2.getTablePathByName("user")).toBe("/admin/usermgr/user");
      });

   });

});


function buildTestQInstance(affinityValues: Record<string, Record<string, number>> = {}): QInstance
{
   const qInstance = new QInstance({});

   qInstance.tables = new Map<string, QTableMetaData>();
   qInstance.tables.set("order", new QTableMetaData({name: "order"}));
   qInstance.tables.set("user", new QTableMetaData({name: "user"})); // will be under both /admin/usermgr and /setup
   qInstance.tables.set("group", new QTableMetaData({name: "group"})); // will just be under /admin/usermgr
   qInstance.tables.set("role", new QTableMetaData({name: "role"})); // will just be under /setup

   qInstance.apps = new Map<string, QAppMetaData>();
   qInstance.apps.set("oms", new QAppMetaData({name: "oms"}));
   qInstance.apps.set("usermgr", new QAppMetaData({name: "usermgr"})); // will go under setup
   qInstance.apps.set("admin", new QAppMetaData({name: "admin"}));
   qInstance.apps.set("setup", new QAppMetaData({name: "setup"}));

   const orderTableNode = new QAppTreeNode({name: "order", type: QAppNodeType.TABLE});
   const userTableNodeForAdminUsermgr = new QAppTreeNode({name: "user", type: QAppNodeType.TABLE, appAffinity: affinityValues["user"]?.["admin"] ?? undefined});
   const userTableNodeForSetup = new QAppTreeNode({name: "user", type: QAppNodeType.TABLE, appAffinity:  affinityValues["user"]?.["setup"] ?? undefined});
   const groupTableNode = new QAppTreeNode({name: "group", type: QAppNodeType.TABLE});
   const roleTableNode = new QAppTreeNode({name: "role", type: QAppNodeType.TABLE});

   const omsAppNode = new QAppTreeNode({name: "oms", type: QAppNodeType.APP, children: [orderTableNode]});
   const usermgrAppNode = new QAppTreeNode({name: "usermgr", type: QAppNodeType.APP, children: [userTableNodeForAdminUsermgr, groupTableNode]});
   const adminAppNode = new QAppTreeNode({name: "admin", type: QAppNodeType.APP, children: [usermgrAppNode]});
   const setupAppNode = new QAppTreeNode({name: "setup", type: QAppNodeType.APP, children: [userTableNodeForSetup, roleTableNode]});

   qInstance.appTree = [];
   qInstance.appTree.push(omsAppNode);
   qInstance.appTree.push(adminAppNode);
   qInstance.appTree.push(setupAppNode);

   qInstance.buildPathsMap(qInstance.appTree);

   return (qInstance);
}