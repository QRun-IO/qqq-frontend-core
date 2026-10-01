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


import {QCriteriaOperator} from "../../../src/model/query/QCriteriaOperator";
import {QQueryFilter} from "../../../src/model/query/QQueryFilter";

describe("QQueryFilter tests", () =>
{

   it("should handle an empty object", () =>
   {
      const filter = QQueryFilter.makeFromObject({});
      expect(filter).toBeInstanceOf(QQueryFilter);
      expect(filter.criteria).toHaveLength(0);
      expect(filter.orderBys).toHaveLength(0);
      expect(filter.subFilters).toHaveLength(0);
      expect(filter.booleanOperator).toEqual("AND");
      expect(filter.skip).toBeUndefined();
      expect(filter.limit).toBeUndefined();
   });


   it("should handle the basic use case", () =>
   {
      const filter = QQueryFilter.makeFromObject(
         {
            criteria:
               [
                  {fieldName: "name", operator: "EQUALS", values: ["Darin"]},
                  {fieldName: "homeStateId", operator: "NOT_IN", values: [17, 47]}
               ],
            orderBys: [{fieldName: "id", isAscending: false}],
            operator: "OR",
            skip: 50,
            limit: 25
         });

      expect(filter).toBeInstanceOf(QQueryFilter);

      expect(filter.criteria).toHaveLength(2);
      expect(filter.criteria?.[0].fieldName).toEqual("name");
      expect(filter.criteria?.[0].operator).toEqual(QCriteriaOperator.EQUALS);
      expect(filter.criteria?.[0].values).toHaveLength(1);
      expect(filter.criteria?.[0].values[0]).toEqual("Darin");

      expect(filter.criteria?.[1].fieldName).toEqual("homeStateId");
      expect(filter.criteria?.[1].operator).toEqual(QCriteriaOperator.NOT_IN);
      expect(filter.criteria?.[1].values).toHaveLength(2);
      expect(filter.criteria?.[1].values[0]).toEqual(17);
      expect(filter.criteria?.[1].values[1]).toEqual(47);

      expect(filter.orderBys).toHaveLength(1);
      expect(filter.orderBys?.[0].fieldName).toEqual("id");
      expect(filter.orderBys?.[0].isAscending).toEqual(false);

      expect(filter.subFilters).toHaveLength(0);
      expect(filter.booleanOperator).toEqual("AND");
      expect(filter.skip).toEqual(50);
      expect(filter.limit).toEqual(25);
   });


   it("should handle sub filters", () =>
   {
      const filter = QQueryFilter.makeFromObject(
         {
            criteria:
               [
                  {fieldName: "name", operator: "EQUALS", values: ["Darin"]}
               ],
            subFilters:
               [
                  {
                     criteria:
                        [
                           {fieldName: "age", operator: "GREATER_THAN_OR_EQUALS", values: [21]},
                        ]
                  },
                  {
                     criteria:
                        [
                           {fieldName: "isEmployed", operator: "IS_BLANK"},
                           {fieldName: "isEmployed", operator: "EQUALS", values: [false]},
                        ],
                     booleanOperator: "OR"
                  }
               ]
         });

      expect(filter).toBeInstanceOf(QQueryFilter);

      expect(filter.criteria).toHaveLength(1);
      expect(filter.criteria?.[0].fieldName).toEqual("name");
      expect(filter.criteria?.[0].operator).toEqual(QCriteriaOperator.EQUALS);
      expect(filter.criteria?.[0].values).toHaveLength(1);
      expect(filter.criteria?.[0].values[0]).toEqual("Darin");

      expect(filter.subFilters).toHaveLength(2);

      const subFilter0 = filter.subFilters?.[0];
      expect(subFilter0).toBeInstanceOf(QQueryFilter);
      expect(subFilter0?.criteria).toHaveLength(1);
      expect(subFilter0?.criteria?.[0].fieldName).toEqual("age");
      expect(subFilter0?.criteria?.[0].operator).toEqual(QCriteriaOperator.GREATER_THAN_OR_EQUALS);
      expect(subFilter0?.criteria?.[0].values).toHaveLength(1);
      expect(subFilter0?.criteria?.[0].values[0]).toEqual(21);

      const subFilter1 = filter.subFilters?.[1];
      expect(subFilter1).toBeInstanceOf(QQueryFilter);
      expect(subFilter1?.criteria).toHaveLength(2);
      expect(subFilter1?.criteria?.[0].fieldName).toEqual("isEmployed");
      expect(subFilter1?.criteria?.[0].operator).toEqual(QCriteriaOperator.IS_BLANK);
      expect(subFilter1?.criteria?.[0].values).toBeUndefined();
      expect(subFilter1?.criteria?.[1].fieldName).toEqual("isEmployed");
      expect(subFilter1?.criteria?.[1].operator).toEqual(QCriteriaOperator.EQUALS);
      expect(subFilter1?.criteria?.[1].values).toHaveLength(1);
      expect(subFilter1?.criteria?.[1].values[0]).toEqual(false)
      expect(subFilter1?.booleanOperator).toEqual("OR");
   });

});