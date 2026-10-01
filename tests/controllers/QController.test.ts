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

import axios from "axios";
import FormData = require("form-data");
import {QController} from "../../src/controllers/QController";
import {QException} from "../../src/exceptions/QException";
import {QAppMetaData} from "../../src/model/metaData/QAppMetaData";
import {QAppNodeType} from "../../src/model/metaData/QAppNodeType";
import {QAppTreeNode} from "../../src/model/metaData/QAppTreeNode";
import {QAuthenticationMetaData} from "../../src/model/metaData/QAuthenticationMetaData";
import {QBrandingMetaData} from "../../src/model/metaData/QBrandingMetaData";
import {QFieldMetaData} from "../../src/model/metaData/QFieldMetaData";
import {QFieldType} from "../../src/model/metaData/QFieldType";
import {QFrontendStepMetaData} from "../../src/model/metaData/QFrontendStepMetaData";
import {QInstance} from "../../src/model/metaData/QInstance";
import {QProcessMetaData} from "../../src/model/metaData/QProcessMetaData";
import {QTableMetaData} from "../../src/model/metaData/QTableMetaData";
import {QTableSection} from "../../src/model/metaData/QTableSection";
import {QJobComplete} from "../../src/model/processes/QJobComplete";
import {QJobError} from "../../src/model/processes/QJobError";
import {QJobRunning} from "../../src/model/processes/QJobRunning";
import {QJobStarted} from "../../src/model/processes/QJobStarted";
import {QPossibleValue} from "../../src/model/QPossibleValue";
import {QRecord} from "../../src/model/QRecord";
const fs = require("fs");
require("jest-localstorage-mock");

const baseURL = "http://localhost:8000";

/////////////////////////////////////////////////////////////////////////////////////
// define if we're using mocks or not (in CI we always want to. but for local dev, //
// we may want to hit an actual backend server, e.g. at the baseURL given above)   //
/////////////////////////////////////////////////////////////////////////////////////
const useMock = true;
if (useMock)
{
   jest.mock("axios");
}

///////////////////////////////////////////////////////////////////////////////////
// function to setup the axis mock, to return the contents of the specified file //
///////////////////////////////////////////////////////////////////////////////////
function mockGet(mockPath: string)
{
   if (useMock)
   {
      axios.create = jest.fn(() => axios);
      // @ts-ignore
      axios.get = buildMockSuccessfulPromise(mockPath);
   }
}

function mockGetError()
{
   if (useMock)
   {
      axios.create = jest.fn(() => axios);
      // @ts-ignore
      axios.get = buildMockFailedPromise();
   }
}

function mockPost(mockPath: string)
{
   if (useMock)
   {
      axios.create = jest.fn(() => axios);
      // @ts-ignore
      axios.post = buildMockSuccessfulPromise(mockPath);
   }
}

function mockPostError()
{
   if (useMock)
   {
      axios.create = jest.fn(() => axios);
      // @ts-ignore
      axios.post = buildMockFailedPromise();
   }
}

function mockPut(mockPath: string)
{
   if (useMock)
   {
      axios.create = jest.fn(() => axios);
      // @ts-ignore
      axios.put = buildMockSuccessfulPromise(mockPath);
   }
}

function mockPutError()
{
   if (useMock)
   {
      axios.create = jest.fn(() => axios);
      // @ts-ignore
      axios.put = buildMockFailedPromise();
   }
}

function mockDelete(mockPath: string)
{
   if (useMock)
   {
      axios.create = jest.fn(() => axios);
      // @ts-ignore
      axios.delete = buildMockSuccessfulPromise(mockPath);
   }
}

function mockDeleteError()
{
   if (useMock)
   {
      axios.create = jest.fn(() => axios);
      // @ts-ignore
      axios.delete = buildMockFailedPromise();
   }
}

function buildMockSuccessfulPromise(mockPath: string)
{
   const json = fs.readFileSync(`./tests/mocks/${mockPath}`);
   const response = {data: JSON.parse(json)};
   return jest.fn(() =>
   {
      return new Promise(function (resolve)
      {
         // @ts-ignore
         resolve(response);
      });
   });
}

function buildMockFailedPromise()
{
   return jest.fn(() =>
   {
      return new Promise(function (_, reject)
      {
         reject(new Error());
      });
   });
}

describe("q controller test", () =>
{
   beforeEach(() =>
   {
      QController.clearMemoization();
   });

   it("should load authentication meta data", async () =>
   {
      mockGet("metaData/authentication.json");
      const qController = new QController(baseURL);

      let authMetaData = await qController.getAuthenticationMetaData();
      expect(authMetaData).toBeInstanceOf(QAuthenticationMetaData);
      expect(authMetaData.type).toBe("MOCK");
      expect(authMetaData.name).toBe("mock");

      ///////////////////////////////////////////////////////////////////////////
      // set the backend now to return the AUTH0 data, but, since it should be //
      // cached in localstorage, make sure we still get back MOCK              //
      ///////////////////////////////////////////////////////////////////////////
      mockGet("metaData/authentication-auth0.json");
      authMetaData = await qController.getAuthenticationMetaData();
      expect(authMetaData.type).toBe("MOCK");

      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // now clear the local storage, fetch again, and assert AUTH0                                                     //
      // note, we'll only do this if we're using mocks, where we can actually get an AUTH0 response from the mocked GET //
      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      if (useMock)
      {
         qController.clearAuthenticationMetaDataLocalStorage();
         authMetaData = await qController.getAuthenticationMetaData();
         expect(authMetaData.type).toBe("AUTH_0");
      }
   });

   it("should return meta data", async () =>
   {
      mockGet("metaData/index.json");
      const qController = new QController(baseURL);
      qController.setGotAuthentication();

      const metaData = await qController.loadMetaData();
      expect(metaData).toBeInstanceOf(QInstance);

      const tables = metaData.tables;
      expect(tables?.size).toBeGreaterThan(1);
      const personTable = tables?.get("person");
      expect(personTable).toBeInstanceOf(QTableMetaData);
      expect(personTable?.label).toBe("Person");
      const fields = personTable?.fields;
      expect(fields).toBeUndefined(); // this meta data does not go down to the field level!

      const processes = metaData.processes;
      expect(processes?.size).toBeGreaterThan(0);
      const greetProcess = processes?.get("greet");
      expect(greetProcess).toBeInstanceOf(QProcessMetaData);
      expect(greetProcess?.label).toBe("Greet People");

      const apps = metaData.apps;
      expect(apps?.size).toBeGreaterThan(0);
      const greetingsApp = apps?.get("greetingsApp");
      expect(greetingsApp).toBeInstanceOf(QAppMetaData);
      expect(greetingsApp?.label).toBe("Greetings App");
      const greetPeopleProcess = greetingsApp?.children?.[0];
      expect(greetPeopleProcess).toBeInstanceOf(QAppTreeNode);
      expect(greetPeopleProcess?.label).toBe("Greet People");
      expect(greetPeopleProcess?.type).toBe(QAppNodeType.PROCESS);
      const peopleApp = apps?.get("peopleApp");
      const greetingsAppUnderPeople = peopleApp?.children?.find(child => child.name === "greetingsApp");
      expect(greetingsAppUnderPeople).toBeInstanceOf(QAppTreeNode);
      expect(greetingsAppUnderPeople?.children).toBeUndefined(); // apps map is Not nested

      const appTree = metaData.appTree;
      expect(appTree?.length).toBeGreaterThan(0);
      const peopleAppUnderTree = appTree?.find(app => app.name === "peopleApp");
      expect(peopleAppUnderTree).toBeInstanceOf(QAppTreeNode);
      const greetingsAppUnderPeopleInTree = peopleAppUnderTree?.children?.find(child => child.name === "greetingsApp");
      expect(greetingsAppUnderPeopleInTree).toBeInstanceOf(QAppTreeNode);
      expect(greetingsAppUnderPeopleInTree?.children?.length).toBeGreaterThan(0); // apps tree IS nested

      const branding = metaData.branding;
      expect(branding).toBeInstanceOf(QBrandingMetaData);
      expect(branding?.companyName).toBe("Kingsrook");
      expect(branding?.icon).toBe("kr-icon.png");
      expect(branding?.logo).toBe("kr-logo.png");
   });

   it("should return an error with a bad base url meta data", async () =>
   {
      try
      {
         mockGetError();
         const qController = new QController("http://notahost:123");
         qController.setGotAuthentication();
         const metaData = await qController.loadMetaData();
         expect(metaData).toBeNull();
      }
      catch (error)
      {
         expect(error).toBeInstanceOf(QException);
      }
   });

   it("should return table meta data", async () =>
   {
      mockGet("metaData/table/carrier.json");
      const qController = new QController(baseURL);
      qController.setGotAuthentication();

      const tableMetaData = await qController.loadTableMetaData("carrier");
      expect(tableMetaData).toBeInstanceOf(QTableMetaData);
      expect(tableMetaData.fields).toBeInstanceOf(Map);
      expect(tableMetaData?.label).toBe("Carrier");

      const nameField = tableMetaData?.fields?.get("name");
      expect(nameField).toBeInstanceOf(QFieldMetaData);
      expect(nameField?.name).toBe("name");
      expect(nameField?.label).toBe("Name");
      expect(nameField?.type).toBe(QFieldType.STRING);

      const sections = tableMetaData?.sections;
      expect(sections).toBeDefined();
      expect(sections?.length).toBeGreaterThan(0);
      const section = sections?.[0];
      expect(section).toBeInstanceOf(QTableSection);
      expect(section?.name).toBeDefined();
      expect(section?.iconName).toBeDefined();
      expect(section?.fieldNames).toBeDefined();
      expect(section?.fieldNames?.length).toBeGreaterThan(0);

      //////////////////////////////////////////////////////////
      // make sure it can be fetched again (from memoization) //
      //////////////////////////////////////////////////////////
      const tableMetaData2 = await qController.loadTableMetaData("carrier");
      expect(tableMetaData2).toBeInstanceOf(QTableMetaData);
      expect(tableMetaData2.fields).toBeInstanceOf(Map);
      expect(tableMetaData2?.label).toBe("Carrier");
   });

   it("should fail table meta data for bad table name", async () =>
   {
      try
      {
         mockGetError();
         const qController = new QController(baseURL);
         qController.setGotAuthentication();

         const tableMetaData = await qController.loadTableMetaData("currier");
         expect(tableMetaData).toBeNull();
      }
      catch (error)
      {
         expect(error).toBeInstanceOf(QException);
      }
   });

   it("should return process meta data", async () =>
   {
      mockGet("metaData/process/greetInteractive.json");
      const qController = new QController(baseURL);
      qController.setGotAuthentication();

      const processMetaData = await qController.loadProcessMetaData(
         "greetInteractive"
      );
      expect(processMetaData).toBeInstanceOf(QProcessMetaData);
      expect(processMetaData?.label).toBe("Greet Interactive");
      expect(processMetaData?.frontendSteps).toBeInstanceOf(Array);

      const setupStep = processMetaData?.frontendSteps?.[0];
      expect(setupStep).toBeInstanceOf(QFrontendStepMetaData);
      expect(setupStep?.name).toBe("setup");
      expect(setupStep?.label).toBe("Setup");
      expect(setupStep?.formFields).toBeInstanceOf(Array);
      expect(setupStep?.formFields?.[0]).toBeInstanceOf(QFieldMetaData);
      expect(setupStep?.formFields?.[0].name).toBe("greetingPrefix");
   });

   it("should fail process meta data for bad process name", async () =>
   {
      try
      {
         mockGetError();
         const qController = new QController(baseURL);
         const processMetaData = await qController.loadProcessMetaData("gort");
         qController.setGotAuthentication();

         expect(processMetaData).toBeNull();
      }
      catch (error)
      {
         expect(error).toBeInstanceOf(QException);
      }
   });

   it("should create a record", async () =>
   {
      let data = {
         firstName: "John",
         lastName: "Doe",
         email: "jdoe@kingsrook.com",
      };
      mockPost("data/person/post.json");
      const qController = new QController(baseURL);
      const personRecord: QRecord = await qController.create("person", data);
      expect(personRecord).toBeInstanceOf(QRecord);
      expect(personRecord.values.get("firstName")).toBe("John");
   });

   it("should update a record", async () =>
   {
      let data = {
         firstName: "John",
         lastName: "Doe",
         email: "jdoe@kingsrook.com",
      };
      mockPut("data/person/put.json");
      const qController = new QController(baseURL);
      const personRecord: QRecord = await qController.update("person", 1, data);
      expect(personRecord).toBeInstanceOf(QRecord);
      expect(personRecord.values.get("firstName")).toBe("John");
   });

   it("should query for records", async () =>
   {
      mockPost("data/person/query.json");
      const qController = new QController(baseURL);
      const personRecords: QRecord[] = await qController.query("person");
      expect(personRecords).toBeInstanceOf(Array);
      expect(personRecords.length).toBe(6);
   });

   it("should query for a limited number of records", async () =>
   {
      mockPost("data/person/queryLimit=2.json");
      const qController = new QController(baseURL);
      const personRecords: QRecord[] = await qController.query("person", undefined);
      expect(personRecords).toBeInstanceOf(Array);
      expect(personRecords.length).toBe(2);
   });

   it("should get a single record by id", async () =>
   {
      mockGet("data/person/get5.json");
      const qController = new QController(baseURL);
      const personRecord: QRecord = await qController.get("person", 5);
      expect(personRecord).toBeInstanceOf(QRecord);
      expect(personRecord.values).toBeInstanceOf(Map);
      expect(personRecord.values.get("firstName")).toBeDefined();
   });

   it("should delete a record", async () =>
   {
      mockDelete("data/person/delete6.json");
      const qController = new QController(baseURL);
      const numberDeleted: number = await qController.delete("person", 6);
      expect(numberDeleted).toBe(1);
   });

   it("should throw when a delete fails", async () =>
   {
      try
      {
         mockDelete("data/person/delete-1.json");
         const qController = new QController(baseURL);
         const numberDeleted: number = await qController.delete("person", -1);
         expect(numberDeleted).toBeNull();
      }
      catch (error)
      {
         expect(error).toBeInstanceOf(QException);
      }
   });

   ///////////////////////////////////////////////////////////////////////////////////////////////////////
   // function that non-mock mode can use, to actually wait on server to finish running async processes //
   ///////////////////////////////////////////////////////////////////////////////////////////////////////
   const sleep = (delay: number) =>
   {
      if (useMock)
      {
         return new Promise((resolve) => setTimeout(resolve, 0));
      }
      else
      {
         return new Promise((resolve) => setTimeout(resolve, delay));
      }
   };

   it("should init a process that goes async", async () =>
   {
      let processName = "simpleSleep";
      mockPost("processes/simpleSleep/initStarted.json");
      const qController = new QController(baseURL);
      const initResponse = await qController.processInit(
         processName,
         "_qStepTimeoutMillis=10&sleepMillis=100"
      );
      expect(initResponse).toBeInstanceOf(QJobStarted);
      const qJobStarted = initResponse as QJobStarted;

      mockGet("processes/simpleSleep/statusRunning.json");
      const statusResponse1 = await qController.processJobStatus(
         processName,
         qJobStarted.processUUID,
         qJobStarted.jobUUID
      );
      expect(statusResponse1).toBeInstanceOf(QJobRunning);

      /////////////////////////////////////////
      // wait for the job to actually finish //
      /////////////////////////////////////////
      await sleep(750);

      mockGet("processes/simpleSleep/statusComplete.json");
      const statusResponse2 = await qController.processJobStatus(
         processName,
         qJobStarted.processUUID,
         qJobStarted.jobUUID
      );
      expect(statusResponse2).toBeInstanceOf(QJobComplete);
   });

   it("should init a process that completes synchronously", async () =>
   {
      let processName = "simpleSleep";
      mockGet("metaData/table/carrier.json");
      mockPost("processes/simpleSleep/initComplete.json");
      const qController = new QController(baseURL);
      const initResponse = await qController.processInit(
         processName,
         "_qStepTimeoutMillis=100&sleepMillis=10"
      );
      expect(initResponse).toBeInstanceOf(QJobComplete);
   });

   it("should run a step in a process that goes async", async () =>
   {
      let processName = "sleepInteractive";
      mockPost("processes/sleepInteractive/initComplete.json");
      const qController = new QController(baseURL);
      const initResponse = await qController.processInit(processName);
      expect(initResponse).toBeInstanceOf(QJobComplete);
      const qJobComplete = initResponse as QJobComplete;

      mockPost("processes/sleepInteractive/stepStarted.json");
      const stepResponse = await qController.processStep(
         processName,
         qJobComplete.processUUID,
         qJobComplete.nextStep,
         "_qStepTimeoutMillis=10&sleepMillis=100"
      );
      expect(stepResponse).toBeInstanceOf(QJobStarted);
      const qJobStarted = stepResponse as QJobStarted;

      /////////////////////////////////////////
      // wait for the job to actually finish //
      /////////////////////////////////////////
      await sleep(200);
      mockGet("processes/simpleSleep/statusComplete.json");
      const statusResponse = await qController.processJobStatus(
         processName,
         qJobComplete.processUUID,
         qJobStarted.jobUUID
      );
      expect(statusResponse).toBeInstanceOf(QJobComplete);
   });

   it("should run a step in a process that does NOT go async with a query string", async () =>
   {
      let processName = "sleepInteractive";
      mockPost("processes/sleepInteractive/initComplete.json");
      const qController = new QController(baseURL);
      const initResponse = await qController.processInit(processName);
      expect(initResponse).toBeInstanceOf(QJobComplete);
      const qJobComplete = initResponse as QJobComplete;

      mockPost("processes/sleepInteractive/stepComplete.json");
      const stepResponse = await qController.processStep(
         processName,
         qJobComplete.processUUID,
         qJobComplete.nextStep,
         "_qStepTimeoutMillis=100&sleepMillis=10"
      );
      expect(stepResponse).toBeInstanceOf(QJobComplete);
      const qJobComplete2 = stepResponse as QJobComplete;

      ///////////////////////////////////////////////////
      // assert that we got back a different next-step //
      ///////////////////////////////////////////////////
      expect(qJobComplete.nextStep).not.toBe(qJobComplete2.nextStep);
   });

   it("should run a step in a process that does NOT go async with a POST body", async () =>
   {
      let processName = "sleepInteractive";
      mockPost("processes/sleepInteractive/initComplete.json");
      const qController = new QController(baseURL);
      const initResponse = await qController.processInit(processName);
      expect(initResponse).toBeInstanceOf(QJobComplete);
      const qJobComplete = initResponse as QJobComplete;

      const formData = new FormData();
      formData.append("sleepMillis", 10);
      formData.append("_qStepTimeoutMillis", 100);

      mockPost("processes/sleepInteractive/stepComplete.json");
      const stepResponse = await qController.processStep(
         processName,
         qJobComplete.processUUID,
         qJobComplete.nextStep,
         formData
      );
      expect(stepResponse).toBeInstanceOf(QJobComplete);
      const qJobComplete2 = stepResponse as QJobComplete;

      ///////////////////////////////////////////////////
      // assert that we got back a different next-step //
      ///////////////////////////////////////////////////
      expect(qJobComplete.nextStep).not.toBe(qJobComplete2.nextStep);
   });

   it("should handle an exception from an init", async () =>
   {
      let processName = "simpleThrow";
      mockPost("processes/simpleThrow/initError.json");
      const qController = new QController(baseURL);
      const initResponse = await qController.processInit(
         processName,
         "_qStepTimeoutMillis=100&sleepMillis=10"
      );
      expect(initResponse).toBeInstanceOf(QJobError);
   });

   it("should handle an exception from an async init", async () =>
   {
      let processName = "simpleThrow";
      mockPost("processes/simpleThrow/initStarted.json");
      const qController = new QController(baseURL);
      const initResponse = await qController.processInit(
         processName,
         "_qStepTimeoutMillis=10&sleepMillis=100"
      );
      expect(initResponse).toBeInstanceOf(QJobStarted);
      const qJobStarted = initResponse as QJobStarted;

      await sleep(200);
      mockGet("processes/simpleThrow/statusError.json");
      const statusResponse = await qController.processJobStatus(
         processName,
         qJobStarted.processUUID,
         qJobStarted.jobUUID
      );
      expect(statusResponse).toBeInstanceOf(QJobError);
   });

   it("should return process records", async () =>
   {
      let processName = "greet";
      mockPost("processes/greet/initComplete.json");
      const qController = new QController(baseURL);
      const initResponse = await qController.processInit(
         processName,
         "recordsParam=recordIds&recordIds=2,3"
      );
      expect(initResponse).toBeInstanceOf(QJobComplete);
      const qJobComplete = initResponse as QJobComplete;
      const processUUID = qJobComplete.processUUID;

      mockGet("processes/greet/records.json");
      const response = await qController.processRecords(
         processName,
         processUUID,
         0,
         20
      );
      const records = response.records;
      expect(records).toBeInstanceOf(Array);
      expect(records.length).toBe(2);
      expect(records[0].values).toBeInstanceOf(Map);
      expect(records[0].values.get("id")).not.toBeNull();
      expect(records[0].values.get("firstName")).not.toBeNull();
      expect(response.totalRecords).toBe(2);
   });

   it("should get data for a widget", async () =>
   {
      mockGet("widget/PersonsByCreateDateBarChart.json");
      const qController = new QController(baseURL);
      const widget = await qController.widget("PersonsByCreateDateBarChart");
      console.log(widget);
      expect(widget).not.toBeNull();
   });

   it("should get options for a possible value", async () =>
   {
      mockPost("data/person/possibleValues-homeStateId.json");
      const qController = new QController(baseURL);
      const result = await qController.possibleValues("person", null, "homeStateId", "");
      expect(result).not.toBeNull();
      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBe(2);
      expect(result[0]).toBeInstanceOf(QPossibleValue);
      expect(result[0].id).toBe(1);
      expect(result[0].label).toBe("IL");
   });

});
