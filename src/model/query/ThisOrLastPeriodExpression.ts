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


export type ThisOrLastPeriodOperator = "THIS" | "LAST";
export type ThisOrLastPeriodUnit = "HOURS" | "DAYS" | "WEEKS" | "MONTHS" | "YEARS";

/*******************************************************************************
 ** Define a "this or last period" type expression, as part of a criteria in a QQQ instance.
 **
 *******************************************************************************/
export class ThisOrLastPeriodExpression
{
   operator?: ThisOrLastPeriodOperator;
   timeUnit?: ThisOrLastPeriodUnit;
   type: "ThisOrLastPeriod";

   constructor(object?: any)
   {
      this.operator = object?.operator;
      this.timeUnit = object?.timeUnit;
      this.type = "ThisOrLastPeriod";
   }

   toString()
   {
      if(this.timeUnit == "DAYS")
      {
         return this.operator == "THIS" ? "today" : "yesterday";
      }

      let operatorString = this.operator?.toLowerCase() ?? "";
      let timeUnitString = (this.timeUnit?.toLowerCase() ?? "").replace(/s$/, "");
      return `${operatorString} ${timeUnitString}`;
   }
}
