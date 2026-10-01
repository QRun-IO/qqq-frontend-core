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


import {AxiosError} from "axios";

/*******************************************************************************
 ** Exception within qqq
 **
 *******************************************************************************/
export class QException
{
   message: string;
   status: number | undefined;
   code: string | undefined;
   errorObject: any;

   constructor(error: AxiosError)
   {
      this.message = error.message;
      this.code = error.code;

      if (error.response !== undefined && error.response.status !== undefined)
      {
         this.status = error.response.status;
      }
      else if (error.status !== undefined)
      {
         this.status = error.status;
      }

      if (error.response !== undefined && error.response.statusText !== undefined)
      {
         this.code = error.response.statusText;
      }
      else if (error.code !== undefined)
      {
         this.code = error.code;
      }

      const data = error?.response?.data as any;
      if (data?.userFacingError)
      {
         this.message = data.userFacingError;
      }
      else if (data?.error)
      {
         this.message = data?.error;
      }

      this.errorObject = error;
   }
}

