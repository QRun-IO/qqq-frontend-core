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

import {AxiosError, AxiosResponse} from "axios";
import FormData from "form-data";
import {QException} from "../exceptions/QException";
import {QAuthenticationMetaData} from "../model/metaData/QAuthenticationMetaData";
import {QInstance} from "../model/metaData/QInstance";
import {QProcessMetaData} from "../model/metaData/QProcessMetaData";
import {QTableMetaData} from "../model/metaData/QTableMetaData";
import {QTableVariant} from "../model/metaData/QTableVariant";
import {QJobComplete} from "../model/processes/QJobComplete";
import {QJobError} from "../model/processes/QJobError";
import {QJobRunning} from "../model/processes/QJobRunning";
import {QJobStarted} from "../model/processes/QJobStarted";
import {QPossibleValue} from "../model/QPossibleValue";
import {QRecord} from "../model/QRecord";
import {QQueryFilter} from "../model/query/QQueryFilter";
import {QueryJoin} from "../model/query/QueryJoin";
const axios = require("axios").default;

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// This implementation of QController works with "versions" in two senses:                                           //
// First - it works with a "versioned" deployment of the QQQ Middleware API (specifically, v1)                       //
// Second - it is also capable (via QQQ Middleware v1) to work with application-level API versions                   //
// as defined in the qqq-middleware-api module.                                                                      //
// so paths requested by this class, for an app-api version, may look like:  /qqq/v1/myAppApi/3.1/someTable/whatever //
// or, for non-app-api versions:  /qqq/v1/someTable/whatever                                                         //
// Note that this class, as of its initial publish, is a work-in-progress, with only some methods updated to use the //
// v1 QQQ api -- most methods call the Unversioned qqq middleware API!                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////
// the 3 fields that define an api version //
/////////////////////////////////////////////
export interface ApiVersion
{
   name: string;
   path: string;
   version: string;
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// an input to a function that can be api-versioned - either those 3 fields, or null (for a non-applicatin-api-versioned response) //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export type Version = ApiVersion | null

////////////////////////////
// a key for internal map //
////////////////////////////
interface TableKey
{
   tableName: string;
   version: Version;
}


/*******************************************************************************
 ** Controller for interacting with a QQQ backend going through Middleware V1.
 *******************************************************************************/
export class QControllerV1
{
   private axiosInstance;
   private exceptionHandler;

   public static STEP_TIMEOUT_MILLIS_PARAM_NAME = "_qStepTimeoutMillis";

   ////////////////////////////////////////////////////////////////////
   // memoized promises for calls that don't generally need repeated //
   ////////////////////////////////////////////////////////////////////
   private static metaDataPromise?: Promise<QInstance>;
   private static tableMetaDataPromises = new Map<TableKey, Promise<QTableMetaData>>();
   private static processMetaDataPromises = new Map<string, Promise<QProcessMetaData>>();

   private static authenticationMetaDataLocalStorageKey = "qqq.authenticationMetaData.json";

   private static awaitAuthenticationPromise: Promise<any>;
   private static gotAuthentication = false;

   private static widgetAbortControllerMap = new Map<string, AbortController | null>();

   /*******************************************************************************
    **
    *******************************************************************************/
   constructor(baseUrl: string, exceptionHandler?: (error: QException) => any)
   {
      this.axiosInstance = axios.create({
         baseURL: baseUrl,
         timeout: 60000, // todo - evaluate this!
      });

      //////////////////////////////////////////////////////////////////////////////////////////////////////
      // create a promise which will run a busy-loop until setAuthorizationHeaderValue is called.         //
      // the idea being, to not fire off any other requests until we know that the user is authenticated, //
      // and we know how to send that authentication to the backend.                                      //
      //////////////////////////////////////////////////////////////////////////////////////////////////////
      QControllerV1.awaitAuthenticationPromise = new Promise((resolve) =>
      {
         const interval = setInterval(() =>
         {
            if (QControllerV1.gotAuthentication)
            {
               resolve(true);
               clearInterval(interval);
            }
         }, 50);
      });

      try
      {
         this.axiosInstance.defaults.headers.common["X-QQQ-UserTimezone"] = Intl.DateTimeFormat().resolvedOptions().timeZone;
      }
      catch (e)
      {
         ////////////
         // ignore //
         ////////////
      }

      ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // javascript timezone offset is positive for locations west of GMT (e.g., 300 for US/Central) - which seems //
      // opposite of the convention (e.g., CST=-6, CDT=-5).  So, we'll use a negative version of this value.       //
      ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
      this.axiosInstance.defaults.headers.common["X-QQQ-UserTimezoneOffsetMinutes"] = -new Date().getTimezoneOffset();

      if (exceptionHandler != null)
      {
         this.exceptionHandler = exceptionHandler;
      }
      else
      {
         this.exceptionHandler = (error: QException) =>
         {
            throw error;
         };
      }
   }


   /*******************************************************************************
    ** Useful for development (e.g., to be able to use the axios instance, to test
    ** things we probably want to keep in this class, without having to re-install
    ** this module for the testing cycle), but probably not meant for main-line usage.
    *******************************************************************************/
   getAxiosInstance()
   {
      return (this.axiosInstance);
   }


   /*******************************************************************************
    ** clear memoized promises
    *******************************************************************************/
   static clearMemoization()
   {
      QControllerV1.metaDataPromise = undefined;
      QControllerV1.tableMetaDataPromises.clear();
      QControllerV1.processMetaDataPromises.clear();
   }


   /*******************************************************************************
    ** Function to be called by an app after it's authenticated the user.  This will
    ** allow the awaitAuthenticationPromise to resolve, so that other requests can continue.
    *******************************************************************************/
   setGotAuthentication()
   {
      QControllerV1.gotAuthentication = true;
   }


   /*******************************************************************************
    ** Clear the authentication meta data from local storage
    *******************************************************************************/
   clearAuthenticationMetaDataLocalStorage(): void
   {
      localStorage.removeItem(QControllerV1.authenticationMetaDataLocalStorageKey);
   }

   /*******************************************************************************
    ** Fetch the authentication meta data from local storage or the server.
    *******************************************************************************/
   async getAuthenticationMetaData(): Promise<QAuthenticationMetaData>
   {
      try
      {
         const authenticationMetaDataJson = localStorage.getItem(QControllerV1.authenticationMetaDataLocalStorageKey);
         const authenticationMetaData = JSON.parse(authenticationMetaDataJson!);
         if (authenticationMetaData && authenticationMetaData.timestamp)
         {
            const age = ((new Date().getTime()) - authenticationMetaData.timestamp) / 1000;
            if (age < 60 * 60)
            {
               console.log(`Found authentication meta data in local storage (and it's ${age} seconds old) - using it.`);
               return (new QAuthenticationMetaData(authenticationMetaData));
            }
         }
      }
      catch (e)
      {
         console.log(`Caught [${e}] reading authentication meta data from local storage - proceeding to get from backend.`);
      }

      //////////////////////////////////////////
      // resume with a fetch from the backend //
      //////////////////////////////////////////
      return this.axiosInstance
         .get("/metaData/authentication")
         .then((response: AxiosResponse) =>
         {
            response.data.timestamp = new Date().getTime();
            localStorage.setItem(QControllerV1.authenticationMetaDataLocalStorageKey, JSON.stringify(response.data));
            console.log("Fetched authentication meta data from backend.");
            return new QAuthenticationMetaData(response.data);

         })
         .catch((error: AxiosError) =>
         {
            this.handleException(error);
         });
   }

   /*******************************************************************************
    ** create or update a user session
    *******************************************************************************/
   async manageSession(accessToken: string, uuid?: string, more?: { [name: string]: any }): Promise<{ uuid: string, values: { [key: string]: any } }>
   {
      const data = {
         accessToken: accessToken,
         uuid: uuid,
         ...(more ?? {})
      };

      return this.axiosInstance
         .post("/manageSession", data)
         .then((response: AxiosResponse) =>
         {
            return response.data;
         })
         .catch((error: AxiosError) =>
         {
            this.handleException(error);
         });
   }

   /*******************************************************************************
    ** Fetch the top-level meta data for a qqq instance.
    *******************************************************************************/
   async loadMetaData(): Promise<QInstance>
   {
      await QControllerV1.awaitAuthenticationPromise;

      if (QControllerV1.metaDataPromise)
      {
         return (QControllerV1.metaDataPromise!);
      }

      QControllerV1.metaDataPromise = this.axiosInstance
         .get("/metaData/")
         .then((response: AxiosResponse) =>
         {
            return new QInstance(response.data);
         })
         .catch((error: AxiosError) =>
         {
            this.handleException(error);
         });

      return QControllerV1.metaDataPromise!;
   }

   /*******************************************************************************
    ** Fetch the full meta data for a specific table.
    *******************************************************************************/
   async loadTableMetaData(tableName: string, version: Version): Promise<QTableMetaData>
   {
      await QControllerV1.awaitAuthenticationPromise;

      const key: TableKey = {tableName, version};

      if (QControllerV1.tableMetaDataPromises.has(key))
      {
         return (QControllerV1.tableMetaDataPromises.get(key)!);
      }

      const promise: Promise<QTableMetaData> = this.axiosInstance
         .get(`${this.getVersionPrefix(version)}/metaData/table/${encodeURIComponent(tableName)}`)
         .then((response: AxiosResponse) =>
         {
            return new QTableMetaData(response.data);
         })
         .catch((error: AxiosError) =>
         {
            this.handleException(error);
         });

      QControllerV1.tableMetaDataPromises.set(key, promise);
      return (promise);
   }

   /*******************************************************************************
    ** Fetch the full meta data for a specific process.
    *******************************************************************************/
   async loadProcessMetaData(processName: string): Promise<QProcessMetaData>
   {
      await QControllerV1.awaitAuthenticationPromise;

      if (QControllerV1.processMetaDataPromises.has(processName))
      {
         return (QControllerV1.processMetaDataPromises.get(processName)!);
      }

      const promise: Promise<QProcessMetaData> = this.axiosInstance
         .get(`/metaData/process/${encodeURIComponent(processName)}`)
         .then((response: AxiosResponse) =>
         {
            return new QProcessMetaData(response.data);
         })
         .catch((error: AxiosError) =>
         {
            this.handleException(error);
         });

      QControllerV1.processMetaDataPromises.set(processName, promise);
      return (promise);
   }

   /*******************************************************************************
    ** Make a count request to the backend
    *******************************************************************************/
   async count(tableName: string, version: Version, queryFilter?: QQueryFilter, queryJoins: QueryJoin[] | null = null, includeDistinct = false, tableVariant: QTableVariant | null = null): Promise<[number, number]>
   {
      let countURL = `${this.getVersionPrefix(version)}/table/${encodeURIComponent(tableName)}/count`;

      const body: any = {};
      if (queryFilter)
      {
         body.filter = queryFilter;
      }

      if (queryJoins)
      {
         body.joins = queryJoins;
      }

      if (tableVariant)
      {
         body.tableVariant = tableVariant;
      }

      if (includeDistinct)
      {
         countURL += "?includeDistinct=true";
      }

      return this.axiosInstance
         .post(countURL, body, {"content-type": "application/json"})
         .then((response: AxiosResponse) =>
         {
            return [response.data.count, response.data.distinctCount];
         })
         .catch((error: AxiosError) =>
         {
            this.handleException(error);
         });
   }

   /*******************************************************************************
    ** Make a query request to the backend
    *******************************************************************************/
   async query(
      tableName: string,
      version: Version,
      queryFilter?: QQueryFilter,
      queryJoins: QueryJoin[] | null = null,
      tableVariant: QTableVariant | null = null
   ): Promise<QRecord[]>
   {
      let queryURL = `${this.getVersionPrefix(version)}/table/${encodeURIComponent(tableName)}/query`;

      const body: any = {};
      if (queryFilter)
      {
         body.filter = queryFilter;
      }

      if (queryJoins)
      {
         body.joins = queryJoins;
      }

      if (tableVariant)
      {
         body.tableVariant = tableVariant;
      }

      return this.axiosInstance
         .post(queryURL, body, {"content-type": "application/json"})
         .then((response: AxiosResponse) =>
         {
            const records: QRecord[] = [];
            if (response.data.records)
            {
               for (let i = 0; i < response.data.records.length; i++)
               {
                  records.push(new QRecord(response.data.records[i]));
               }
            }
            return records;
         })
         .catch((error: AxiosError) =>
         {
            this.handleException(error);
         });
   }

   /*******************************************************************************
    ** Make a request to the backend for a single record
    *******************************************************************************/
   async get(tableName: string, primaryKey: any, tableVariant: QTableVariant | null = null, includeAssociations: boolean = false, queryJoins: QueryJoin[] | null = null): Promise<QRecord>
   {
      let getURL = `/data/${encodeURIComponent(tableName)}/${encodeURIComponent(primaryKey)}`;

      let queryString: string[] = [];
      if (tableVariant)
      {
         queryString.push(`tableVariant=${encodeURIComponent(JSON.stringify(tableVariant))}`);
      }
      if (includeAssociations)
      {
         queryString.push("includeAssociations=true");
      }
      if (queryJoins)
      {
         queryString.push(`queryJoins=${encodeURIComponent(JSON.stringify(queryJoins))}`);
      }

      if (queryString.length > 0)
      {
         getURL += "?" + queryString.join("&");
      }

      return this.axiosInstance
         .get(getURL)
         .then((response: AxiosResponse) =>
         {
            return new QRecord(response.data);
         })
         .catch((error: AxiosError) =>
         {
            this.handleException(error);
         });
   }

   /*******************************************************************************
    ** Make a request to the backend for a single record's developer mode data
    *******************************************************************************/
   async getRecordDeveloperMode(tableName: string, primaryKey: any): Promise<any>
   {
      let getURL = `/data/${encodeURIComponent(tableName)}/${encodeURIComponent(primaryKey)}/developer`;
      return this.axiosInstance
         .get(getURL)
         .then((response: AxiosResponse) =>
         {
            return response.data;
         })
         .catch((error: AxiosError) =>
         {
            this.handleException(error);
         });
   }

   /*******************************************************************************
    ** Make a request to the backend to save a new version of a record's associated script
    *******************************************************************************/
   async storeRecordAssociatedScript(tableName: string, primaryKey: any, fieldName: string, code: string, commitMessage: string): Promise<any>
   {
      let url = `/data/${encodeURIComponent(tableName)}/${encodeURIComponent(primaryKey)}/developer/associatedScript/${encodeURIComponent(fieldName)}`;

      const formData = new FormData();
      formData.append("contents", code);
      formData.append("commitMessage", commitMessage);

      return this.axiosInstance
         .post(url, formData)
         .then((response: AxiosResponse) =>
         {
            return response.data;
         })
         .catch((error: AxiosError) =>
         {
            this.handleException(error);
         });
   }

   /*******************************************************************************
    ** Make a request to the backend to get script logs for an associated script
    *******************************************************************************/
   async getRecordAssociatedScriptLogs(tableName: string, primaryKey: any, fieldName: string, scriptRevisionId: number): Promise<any>
   {
      let url = `/data/${encodeURIComponent(tableName)}/${encodeURIComponent(primaryKey)}/developer/associatedScript/${encodeURIComponent(fieldName)}/${encodeURIComponent(scriptRevisionId)}/logs`;

      return this.axiosInstance
         .get(url)
         .then((response: AxiosResponse) =>
         {
            return response.data;
         })
         .catch((error: AxiosError) =>
         {
            this.handleException(error);
         });
   }

   /*******************************************************************************
    ** Make a request to the backend to test a script
    *******************************************************************************/
   async testScript(tableName: string, primaryKey: any, fieldName: string, code: string, inputValues: Map<string, any>): Promise<any>
   {
      let url = `/data/${encodeURIComponent(tableName)}/${encodeURIComponent(primaryKey)}/developer/associatedScript/${encodeURIComponent(fieldName)}/test`;

      const formData = new FormData();
      formData.append("code", code);


      for (let key of Array.from(inputValues.keys()))
      {
         formData.append(key, inputValues.get(key));
      }

      return this.axiosInstance
         .post(url, formData)
         .then((response: AxiosResponse) =>
         {
            return response.data;
         })
         .catch((error: AxiosError) =>
         {
            this.handleException(error);
         });
   }

   /*******************************************************************************
    ** Make a backend call to create a single record
    **
    *******************************************************************************/
   async create(tableName: string, data: { [key: string]: any }): Promise<QRecord>
   {
      const formData = this.dataObjectToFormData(data);

      return this.axiosInstance
         .post(`/data/${encodeURIComponent(tableName)}`, formData, this.defaultMultipartFormDataHeaders())
         .then((response: AxiosResponse) =>
         {
            return new QRecord(response.data.records[0]);
         })
         .catch((error: AxiosError) =>
         {
            this.handleException(error);
         });
   }

   /*******************************************************************************
    ** Convert a javascript object of form data to a "FormData" object for multipart posting.
    *******************************************************************************/
   private dataObjectToFormData(data: { [p: string]: any })
   {
      const formData = new FormData();
      Object.keys(data).forEach((key) =>
      {
         if (data[key] == null)
         {
            formData.append(key, "");
         }
         else
         {
            formData.append(key, data[key]);
         }
      });
      return formData;
   }

   /*******************************************************************************
    ** Make a backend call to update a single record
    **
    *******************************************************************************/
   async update(tableName: string, id: any, data: { [key: string]: any }): Promise<QRecord>
   {
      const formData = this.dataObjectToFormData(data);

      return this.axiosInstance
         .put(`/data/${encodeURIComponent(tableName)}/${encodeURIComponent(id)}`, formData, this.defaultMultipartFormDataHeaders())
         .then((response: AxiosResponse) =>
         {
            return new QRecord(response.data.records[0]);
         })
         .catch((error: AxiosError) =>
         {
            this.handleException(error);
         });
   }

   /*******************************************************************************
    ** Make a backend call to delete a single record
    **
    *******************************************************************************/
   async delete(tableName: string, id: any): Promise<number>
   {
      return this.axiosInstance
         .delete(`/data/${encodeURIComponent(tableName)}/${encodeURIComponent(id)}`)
         .then((response: AxiosResponse) =>
         {
            if (response.data.deletedRecordCount === 1)
            {
               if (response.data.recordsWithWarnings && response.data.recordsWithWarnings.length > 0)
               {
                  const recordWithWarnings = response.data.recordsWithWarnings[0];
                  if (recordWithWarnings && recordWithWarnings.warnings && recordWithWarnings.warnings.length > 0)
                  {
                     const warning = recordWithWarnings.warnings[0];
                     if (warning)
                     {
                        this.exceptionHandler(new QException(new AxiosError(`Warning: ${warning.message ?? warning}`)));
                        return (0);
                     }
                  }
               }

               return (1);
            }
            else
            {
               let qException = new QException(new AxiosError("Unknown error deleting record"));

               const error = response.data?.recordsWithErrors[0]?.errors[0];
               if (error)
               {
                  qException = new QException(error);
               }

               this.exceptionHandler(qException);
               return (0);
            }
         })
         .catch((error: AxiosError) =>
         {
            this.handleException(error);
         });
   }

   /*******************************************************************************
    ** Common logic to parse a process-related server response into an appropriate object.
    *******************************************************************************/
   parseProcessResponse(response: AxiosResponse): QJobStarted | QJobRunning | QJobComplete | QJobError
   {
      //////////////////////////////////////////////////////////////////////////////////////
      // so, the order of these checks is critical (mostly because, complete & error have //
      // a jobStatus with them too, so, you can't check that one too soon                 //
      //////////////////////////////////////////////////////////////////////////////////////
      if (response.data.jobUUID)
      {
         return new QJobStarted(response.data);
      }
      else if (response.data.values || response.data.nextStep)
      {
         return new QJobComplete(response.data);
      }
      else if (response.data.error)
      {
         return new QJobError(response.data);
      }
      else if (response.data.jobStatus)
      {
         return new QJobRunning(response.data.jobStatus);
      }
      else
      {
         return new QJobError({error: "Unexpected server response."});
      }
   }

   /*******************************************************************************
    ** Initialize a process
    *******************************************************************************/
   async processInit(
      processName: string,
      formDataOrQueryString: string | FormData = "",
      formDataHeaders?: FormData.Headers
   ): Promise<QJobStarted | QJobComplete | QJobError>
   {
      let url = `/processes/${encodeURIComponent(processName)}/init`;
      return this.processStepOrInit(url, formDataOrQueryString, formDataHeaders);
   }

   /*******************************************************************************
    ** Fully run a process (i.e., not stopping for frontend steps)
    *******************************************************************************/
   async processRun(
      processName: string,
      formDataOrQueryString: string | FormData = "",
      formDataHeaders?: FormData.Headers,
      dontGoAsyncOnBackend: boolean = false
   ): Promise<QJobStarted | QJobComplete | QJobError>
   {
      let url = `/processes/${encodeURIComponent(processName)}/run`;
      return this.processStepOrInit(url, formDataOrQueryString, formDataHeaders, dontGoAsyncOnBackend);
   }

   /*******************************************************************************
    ** Helper function for the process init & step functions, as well as bulk functions
    ** which may run async.
    *******************************************************************************/
   private postWithQueryStringToPossibleAsyncBackendJob(queryString: string, url: string)
   {
      if (queryString && queryString !== "")
      {
         url += `?${queryString}`;
      }
      return this.axiosInstance
         .post(url)
         .then((response: AxiosResponse) =>
         {
            const responseObject = this.parseProcessResponse(response);
            if (responseObject instanceof QJobRunning)
            {
               ////////////////////////////////////////////////////////////////////
               // we aren't allowed to return "Running" here, so just in case... //
               ////////////////////////////////////////////////////////////////////
               return new QJobError({error: "Unexpected server response."});
            }
            return responseObject;
         })
         .catch((error: AxiosError) =>
         {
            this.handleException(error);
         });
   }

   /*******************************************************************************
    ** Proceed to the next step in a process
    *******************************************************************************/
   async processStep(
      processName: string,
      processUUID: string,
      step: string,
      formDataOrQueryString: string | FormData = "",
      formDataHeaders?: FormData.Headers
   ): Promise<QJobStarted | QJobComplete | QJobError>
   {
      let url = `/processes/${encodeURIComponent(processName)}/${encodeURIComponent(processUUID)}/step/${encodeURIComponent(step)}`;
      return this.processStepOrInit(url, formDataOrQueryString, formDataHeaders);
   }

   /*******************************************************************************
    ** Proceed to the next step in a process
    *******************************************************************************/
   async processStepOrInit(
      url: string,
      formDataOrQueryString: string | FormData = "",
      formDataHeaders?: FormData.Headers,
      dontGoAsyncOnBackend: boolean = false
   ): Promise<QJobStarted | QJobComplete | QJobError>
   {
      if (formDataOrQueryString instanceof FormData)
      {
         if (!formDataHeaders)
         {
            /////////////////////////////////////////////////////////////////////////////////////////////////////////
            // so, it looks like FormData is supplied by the browser, when running the browser, but by a form-data //
            // lib when running not in the browser.  The browser version doesn't have a getHeaders method...       //
            /////////////////////////////////////////////////////////////////////////////////////////////////////////
            if (formDataOrQueryString.getHeaders)
            {
               formDataHeaders = formDataOrQueryString.getHeaders();
            }
            else
            {
               formDataHeaders = {"content-type": "multipart/form-data; boundary=--------------------------320289315924586491558366"};
            }
         }

         if (dontGoAsyncOnBackend)
         {
            formDataOrQueryString.append("_qStepTimeoutMillis", 300 * 1000);
         }

         return this.axiosInstance
            .post(url, formDataOrQueryString, {headers: formDataHeaders})
            .then((response: AxiosResponse) =>
            {
               const responseObject = this.parseProcessResponse(response);
               if (responseObject instanceof QJobRunning)
               {
                  ////////////////////////////////////////////////////////////////////
                  // we aren't allowed to return "Running" here, so just in case... //
                  ////////////////////////////////////////////////////////////////////
                  return new QJobError({error: "Unexpected server response."});
               }
               return responseObject;
            })
            .catch((error: AxiosError) =>
            {
               this.handleException(error);
            });
      }
      else
      {
         if (dontGoAsyncOnBackend)
         {
            formDataOrQueryString += `&_qStepTimeoutMillis=${300 * 1000}`;
         }

         return this.postWithQueryStringToPossibleAsyncBackendJob(formDataOrQueryString, url);
      }
   }

   /*******************************************************************************
    ** Get the status for a currently executing job within a process (init or step)
    *******************************************************************************/
   async processJobStatus(
      processName: string,
      processUUID: string,
      jobUUID: string
   ): Promise<QJobRunning | QJobComplete | QJobError>
   {
      return this.axiosInstance
         .get(`/processes/${encodeURIComponent(processName)}/${encodeURIComponent(processUUID)}/status/${encodeURIComponent(jobUUID)}`)
         .then((response: AxiosResponse) =>
         {
            const responseObject = this.parseProcessResponse(response);
            if (responseObject instanceof QJobStarted)
            {
               ////////////////////////////////////////////////////////////////////
               // we aren't allowed to return "Started" here, so just in case... //
               ////////////////////////////////////////////////////////////////////
               return new QJobError({error: "Unexpected server response."});
            }
            return responseObject;
         })
         .catch((error: AxiosError) =>
         {
            this.handleException(error);
         });
   }

   /*******************************************************************************
    ** Get records from a process's state
    *******************************************************************************/
   async processRecords(
      processName: string,
      processUUID: string,
      skip: number = 0,
      limit: number = 20
   ): Promise<{ totalRecords: number, records: QRecord[] }>
   {
      return this.axiosInstance
         .get(
            `/processes/${encodeURIComponent(processName)}/${encodeURIComponent(processUUID)}/records?skip=${encodeURIComponent(skip)}&limit=${encodeURIComponent(limit)}`
         )
         .then((response: AxiosResponse) =>
         {
            const records: QRecord[] = [];
            if (response.data && response.data.records && response.data.records.length)
            {
               for (let i = 0; i < response.data.records.length; i++)
               {
                  records.push(new QRecord(response.data.records[i]));
               }
            }
            return {totalRecords: response.data.totalRecords, records: records};
         })
         .catch((error: AxiosError) =>
         {
            this.handleException(error);
         });
   }


   /*******************************************************************************
    ** Handle a user clicking cancel on a process
    *******************************************************************************/
   async processCancel(processName: string, processUUID: string): Promise<boolean>
   {
      return this.axiosInstance
         .get(`/processes/${encodeURIComponent(processName)}/${encodeURIComponent(processUUID)}/cancel`)
         .then(() =>
         {
            return true;
         })
         .catch((error: AxiosError) =>
         {
            this.handleException(error);
         });
   }


   /*******************************************************************************
    ** Fetch the data for a specific widget.
    *******************************************************************************/
   async tableVariants(tableName: string): Promise<QTableVariant[]>
   {
      let url = `/data/${encodeURIComponent(tableName)}/variants`;
      console.log("Looking for variants for table [" + tableName + "]");

      return this.axiosInstance
         .get(url)
         .then((response: AxiosResponse) =>
         {
            const variants: QTableVariant[] = [];
            if (response.data && response.data.length)
            {
               for (let i = 0; i < response.data.length; i++)
               {
                  variants.push(new QTableVariant(response.data[i]));
               }
            }
            return variants;
         })
         .catch((e: any) =>
         {
            if (e.code && e.code === "ERR_CANCELED")
            {
               console.log("Controller request cancellation successful!");
               return;
            }
            this.handleException(e);
         });
   }


   /*******************************************************************************
    ** Fetch the data for a specific widget.
    *******************************************************************************/
   async widget(widgetName: string, urlParams?: string): Promise<any>
   {
      let url = `/widget/${encodeURIComponent(widgetName)}`;
      if (urlParams)
      {
         url += `?${urlParams}`;
      }

      /////////////////////////////////////////////////////////////////
      // see if an abort controller was created for this widget name //
      /////////////////////////////////////////////////////////////////
      console.log("Looking for controller for widget [" + widgetName + "]");
      let controller = QControllerV1.widgetAbortControllerMap.get(widgetName);
      if (controller)
      {
         console.log(`Found existing abort controller for widget '${widgetName}', aborting...`);
         controller.abort();
      }

      /////////////////////////////////////////
      // keep track of this widget's request //
      /////////////////////////////////////////
      controller = new AbortController();
      const signal = controller.signal;
      QControllerV1.widgetAbortControllerMap.set(widgetName, controller);

      return this.axiosInstance
         .get(url, {signal})
         .then((response: AxiosResponse) =>
         {
            ///////////////////////////////////////////////////
            // make sure to clear out the request controller //
            ///////////////////////////////////////////////////
            QControllerV1.widgetAbortControllerMap.set(widgetName, null);
            return response.data;
         })
         .catch((e: any) =>
         {
            if (e.code && e.code === "ERR_CANCELED")
            {
               console.log("Controller request cancellation successful!");
               return;
            }
            this.handleException(e);
         });
   }


   /*******************************************************************************
    ** Fetch options for a possible-value drop down.
    **
    ** This method operates in 3 modes:
    ** - for a PVS field on a table (pass (tableName, null, fieldName, ...)
    ** - for a PVS field on a process (pass (null, processName, fieldName, ...)
    ** - for a standalone PVS (pass (null, null, process, ...)
    *******************************************************************************/
   async possibleValues(tableName: string | null, processName: string | null, fieldNameOrPossibleValueSourceName: string, searchTerm: string = "", ids: any[] = [], values: Map<string, any> = new Map(), useCase: string = ""): Promise<QPossibleValue[]>
   {
      let url;
      if (tableName)
      {
         url = `/data/${encodeURIComponent(tableName)}/possibleValues/${encodeURIComponent(fieldNameOrPossibleValueSourceName)}`;
      }
      else if (processName)
      {
         url = `/processes/${encodeURIComponent(processName)}/possibleValues/${encodeURIComponent(fieldNameOrPossibleValueSourceName)}`;
      }
      else
      {
         url = `/possibleValues/${encodeURIComponent(fieldNameOrPossibleValueSourceName)}`;
      }

      let queryComponents = [];

      if (searchTerm !== "")
      {
         queryComponents.push(`searchTerm=${encodeURIComponent(searchTerm)}`);
      }

      if (useCase !== "")
      {
         queryComponents.push(`useCase=${encodeURIComponent(useCase)}`);
      }

      if (ids && ids.length)
      {
         queryComponents.push(`ids=${encodeURIComponent(ids.join(","))}`);
      }

      if (queryComponents.length > 0)
      {
         url += `?${queryComponents.join("&")}`;
      }

      const postBody = new FormData();
      postBody.append("values", JSON.stringify(Object.fromEntries(values)));

      return this.axiosInstance
         .post(url, postBody)
         .then((response: AxiosResponse) =>
         {
            const results: QPossibleValue[] = [];
            if (response.data && response.data.options)
            {
               for (let i = 0; i < response.data.options.length; i++)
               {
                  results.push(new QPossibleValue(response.data.options[i]));
               }
            }
            return results;
         })
         .catch(this.handleException);
   }


   /***************************************************************************
    ** Let an app piggyback on our axiosInstance and handleException methods
    ** to issue ad-hock requests.
    ***************************************************************************/
   public async axiosRequest(config: any): Promise<any>
   {
      return this.axiosInstance
         .request(config)
         .then((response: AxiosResponse) =>
         {
            return (response.data);
         })
         .catch(this.handleException);
   }


   /*******************************************************************************
    **
    *******************************************************************************/
   public defaultMultipartFormDataHeaders(): FormData.Headers
   {
      return {
         "content-type": "multipart/form-data; boundary=--------------------------320289315924586491558366",
      };
   }

   /*******************************************************************************
    ** exception handler which will marshal axios error into a QException and
    *  send that the exception handler provided to this class
    *******************************************************************************/
   private handleException(error: AxiosError): void
   {
      const qException = new QException(error);
      this.exceptionHandler(qException);
   }


   /***************************************************************************
    ** function get map a Version to the string we put into urls
    ***************************************************************************/
   private getVersionPrefix(version: Version): string
   {
      if (version)
      {
         return `/${version.path}/${version.version}`;
      }

      return "";
   }

}
