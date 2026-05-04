# Digenty Farm API — Endpoint Reference

**Base URL:** `https://school-app-backend-y82vo.ondigitalocean.app`  
**Title:** Digenty Farm API  
**Version:** 1.0  
**Total operations:** 344 across 59 sections  
**Schemas:** 322 (full reference in [Schemas appendix](#schemas-appendix))

---

## Table of Contents

**Endpoints by section:**
- [Branches](#branches) (7)
- [Fee Group Items](#fee-group-items) (1)
- [Fee Groups](#fee-groups) (4)
- [Fee Items](#fee-items) (1)
- [Module Permissions Management](#module-permissions-management) (1)
- [Parent Portal - Fees](#parent-portal---fees) (4)
- [Parent Portal - Lookup](#parent-portal---lookup) (5)
- [Staff Management](#staff-management) (9)
- [academic-session-controller](#academic-session-controller) (6)
- [admin-controller](#admin-controller) (1)
- [admin-role-controller](#admin-role-controller) (5)
- [admission-number-controller](#admission-number-controller) (4)
- [arm-controller](#arm-controller) (11)
- [assessment-2-controller](#assessment-2-controller) (19)
- [assessment-setting-controller](#assessment-setting-controller) (9)
- [attendance-controller](#attendance-controller) (8)
- [authentication-controller](#authentication-controller) (8)
- [bank-account-controller](#bank-account-controller) (3)
- [cbt-overview-controller](#cbt-overview-controller) (3)
- [class-arm-report-controller](#class-arm-report-controller) (9)
- [class-controller](#class-controller) (8)
- [class-level-controller](#class-level-controller) (4)
- [class-teacher-controller](#class-teacher-controller) (3)
- [department-controller](#department-controller) (18)
- [domain-controller](#domain-controller) (13)
- [edit-access-controller](#edit-access-controller) (7)
- [fee-class-controller](#fee-class-controller) (2)
- [fee-collection-setup-controller](#fee-collection-setup-controller) (5)
- [fee-controller](#fee-controller) (5)
- [fee-routing-controller](#fee-routing-controller) (5)
- [grading-controller](#grading-controller) (9)
- [invoice-controller](#invoice-controller) (3)
- [invoice-settings-controller](#invoice-settings-controller) (1)
- [parent-controller](#parent-controller) (8)
- [payment-config-controller](#payment-config-controller) (6)
- [payment-controller](#payment-controller) (4)
- [permission-controller](#permission-controller) (1)
- [question-bank-controller](#question-bank-controller) (11)
- [re-authentication-controller](#re-authentication-controller) (1)
- [report-initialization-controller](#report-initialization-controller) (1)
- [result-setting-controller](#result-setting-controller) (15)
- [role-controller](#role-controller) (5)
- [school-controller](#school-controller) (7)
- [security-settings-controller](#security-settings-controller) (3)
- [stock-category-controller](#stock-category-controller) (5)
- [stock-controller](#stock-controller) (9)
- [stock-settings-controller](#stock-settings-controller) (2)
- [stock-transaction-controller](#stock-transaction-controller) (1)
- [stock-unit-controller](#stock-unit-controller) (5)
- [student-cbt-controller](#student-cbt-controller) (3)
- [student-controller](#student-controller) (13)
- [student-promotion-controller](#student-promotion-controller) (2)
- [student-report-card-controller](#student-report-card-controller) (1)
- [subject-controller](#subject-controller) (13)
- [subject-report-controller](#subject-report-controller) (4)
- [subject-teacher-controller](#subject-teacher-controller) (3)
- [subscription-controller](#subscription-controller) (10)
- [teacher-input-controller](#teacher-input-controller) (3)
- [user-controller](#user-controller) (7)

- [Schemas appendix](#schemas-appendix)

---

## Branches

### `GET` `/branches`
_getAllBranches_  

**Query parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `page` | integer(int32) |  |  |
| `size` | integer(int32) |  |  |

**Responses**

- `200` — OK (`*/*`) → [`CreateBranchResponseDto`](#schema-createbranchresponsedto)[]

---

### `POST` `/branches`
_createBranch_  

**Request body** (required) — `application/json`

Schema: [`CreateBranchesDto`](#schema-createbranchesdto) — full fields in appendix.

**Responses**

- `200` — OK (`*/*`) → [`CreateBranchResponseDto`](#schema-createbranchresponsedto)[]

---

### `PUT` `/branches`
_editBranch_  

**Request body** (required) — `application/json`

Schema: [`EditBranchDto`](#schema-editbranchdto) — full fields in appendix.

**Responses**

- `200` — OK (`*/*`) → object

---

### `GET` `/branches/arms/{branchId}`
_getBranchArmById_  

**Path parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `branchId` | integer(int64) | ✓ |  |

**Responses**

- `200` — OK (`*/*`) → [`BranchDTO`](#schema-branchdto)

---

### `POST` `/branches/update-branch`
_updateBranchesWithLevels_  

**Request body** (required) — `application/json`

Schema: [`UpdateBranchWithLevelsListDto`](#schema-updatebranchwithlevelslistdto) — full fields in appendix.

**Responses**

- `200` — OK (`*/*`) → object

---

### `DELETE` `/branches/{branchId}`
_deleteBranchById_  

**Path parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `branchId` | integer(int64) | ✓ |  |

**Responses**

- `200` — OK (`*/*`) → object

---

### `GET` `/branches/{id}`
_getBranchById_  

**Path parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `id` | integer(int64) | ✓ |  |

**Responses**

- `200` — OK (`*/*`) → [`CreateBranchResponseDto`](#schema-createbranchresponsedto)

---

## Fee Group Items

### `POST` `/fee/group/items`
_createFeeItem_1_  

**Request body** (required) — `application/json`

Schema: [`FeeGroupItemDto`](#schema-feegroupitemdto) — full fields in appendix.

**Responses**

- `200` — OK (`*/*`) → object

---

## Fee Groups

### `POST` `/fee/group`
_createFeeGroup_  

**Request body** (required) — `application/json`

Schema: [`FeeGroupDto`](#schema-feegroupdto) — full fields in appendix.

**Responses**

- `200` — OK (`*/*`) → object

---

### `GET` `/fee/group/overview`
_getFeeGroupsOverview_  

**Query parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `sessionId` | integer(int64) | ✓ |  |
| `term` | enum(FIRST \| SECOND \| THIRD) | ✓ |  |
| `branchId` | integer(int64) |  |  |

**Responses**

- `200` — OK (`*/*`) → [`FeeGroupOverviewResponse`](#schema-feegroupoverviewresponse)

---

### `GET` `/fee/group/{feeGroupId}`
_getFeeGroupDetail_  

**Path parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `feeGroupId` | integer(int64) | ✓ |  |

**Responses**

- `200` — OK (`*/*`) → [`FeeGroupDetailResponse`](#schema-feegroupdetailresponse)

---

### `DELETE` `/fee/group/{feeGroupId}`
_deleteFeeGroup_  

**Path parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `feeGroupId` | integer(int64) | ✓ |  |

**Responses**

- `200` — OK (`*/*`) → object

---

## Fee Items

### `POST` `/fee/items`
_createFeeItem_  

**Request body** (required) — `application/json`

Schema: [`FeeItemDto`](#schema-feeitemdto) — full fields in appendix.

**Responses**

- `200` — OK (`*/*`) → object

---

## Module Permissions Management

### `GET` `/modules/permissions`
_getAllModulePermissions_  

**Responses**

- `200` — OK (`*/*`) → object

---

## Parent Portal - Fees

### `GET` `/parent/portal/fees/{studentId}`
_getFeeOverview_  

**Path parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `studentId` | integer(int64) | ✓ |  |

**Query parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `termId` | integer(int64) |  |  |

**Responses**

- `200` — OK (`*/*`) → [`FeeOverviewResponse`](#schema-feeoverviewresponse)

---

### `GET` `/parent/portal/fees/{studentId}/invoice`
_getInvoice_  

**Path parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `studentId` | integer(int64) | ✓ |  |

**Query parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `termId` | integer(int64) |  |  |

**Responses**

- `200` — OK (`*/*`) → [`InvoiceResponse`](#schema-invoiceresponse)

---

### `GET` `/parent/portal/fees/{studentId}/pay`
_getPayFeesData_  

**Path parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `studentId` | integer(int64) | ✓ |  |

**Query parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `termId` | integer(int64) |  |  |

**Responses**

- `200` — OK (`*/*`) → [`PayFeeResponse`](#schema-payfeeresponse)

---

### `POST` `/parent/portal/fees/{studentId}/pay`
_recordPayment_  

**Path parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `studentId` | integer(int64) | ✓ |  |

**Request body** (required) — `application/json`

Schema: [`PayFeeRequest`](#schema-payfeerequest) — full fields in appendix.

**Responses**

- `200` — OK (`*/*`) → map<string, string>

---

## Parent Portal - Lookup

### `GET` `/parent/portal/lookup/classes/{classId}/arms`
_getArms_  

**Path parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `classId` | integer(int64) | ✓ |  |

**Responses**

- `200` — OK (`*/*`) → [`ArmLookupDto`](#schema-armlookupdto)[]

---

### `GET` `/parent/portal/lookup/schools/by-domain`
_getSchoolByHost_  

**Query parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `host` | string | ✓ |  |

**Responses**

- `200` — OK (`*/*`) → [`SchoolLookupDto`](#schema-schoollookupdto)

---

### `GET` `/parent/portal/lookup/schools/{schoolId}/branches`
_getBranches_  

**Path parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `schoolId` | integer(int64) | ✓ |  |

**Responses**

- `200` — OK (`*/*`) → [`BranchLookupDto`](#schema-branchlookupdto)[]

---

### `GET` `/parent/portal/lookup/schools/{schoolId}/classes`
_getClasses_  

**Path parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `schoolId` | integer(int64) | ✓ |  |

**Query parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `branchId` | integer(int64) |  |  |

**Responses**

- `200` — OK (`*/*`) → [`ClassLookupDto`](#schema-classlookupdto)[]

---

### `GET` `/parent/portal/lookup/schools/{schoolId}/terms`
_getTerms_  

**Path parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `schoolId` | integer(int64) | ✓ |  |

**Query parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `academicSessionId` | integer(int64) |  |  |

**Responses**

- `200` — OK (`*/*`) → [`TermLookupDto`](#schema-termlookupdto)[]

---

## Staff Management

### `GET` `/staffs`
_getStaffList_  

**Query parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `search` | string |  |  |
| `branchId` | integer(int64) |  |  |
| `pageable` | [`Pageable`](#schema-pageable) | ✓ |  |

**Responses**

- `200` — OK (`*/*`) → [`PageStaffListResponse`](#schema-pagestafflistresponse)

---

### `POST` `/staffs`
_createStaff_  

**Request body** (required) — `application/json`

Schema: [`StaffCreateDto`](#schema-staffcreatedto) — full fields in appendix.

**Responses**

- `200` — OK (`*/*`) → object

---

### `PUT` `/staffs/branch-admin`
_assignBranchAdmin_  

**Request body** (required) — `application/json`

Schema: [`AssignBranchAdminDto`](#schema-assignbranchadmindto) — full fields in appendix.

**Responses**

- `200` — OK (`*/*`) → object

---

### `GET` `/staffs/export`
_exportStaff_  

**Query parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `branchId` | integer(int64) |  |  |

**Responses**

- `200` — OK (`*/*`) → string(binary)

---

### `GET` `/staffs/role/{roleId}`
_getStaffByRole_  

**Path parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `roleId` | integer(int64) | ✓ |  |

**Query parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `search` | string |  |  |
| `pageable` | [`Pageable`](#schema-pageable) | ✓ |  |

**Responses**

- `200` — OK (`*/*`) → [`PageStaffListResponse`](#schema-pagestafflistresponse)

---

### `PUT` `/staffs/{staffId}`
_updateStaff_  

**Path parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `staffId` | integer(int64) | ✓ |  |

**Request body** (required) — `application/json`

Schema: [`StaffUpdateDto`](#schema-staffupdatedto) — full fields in appendix.

**Responses**

- `200` — OK (`*/*`) → object

---

### `PUT` `/staffs/{staffId}/deactivate`
_deactivate_  

**Path parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `staffId` | integer(int64) | ✓ |  |

**Responses**

- `200` — OK (`*/*`) → object

---

### `DELETE` `/staffs/{staffId}/delete`
_delete_1_  

**Path parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `staffId` | integer(int64) | ✓ |  |

**Responses**

- `200` — OK (`*/*`) → object

---

### `GET` `/staffs/{staffId}/details`
_getStaffDetails_  

**Path parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `staffId` | integer(int64) | ✓ |  |

**Responses**

- `200` — OK (`*/*`) → [`StaffDetailsResponse`](#schema-staffdetailsresponse)

---

## academic-session-controller

### `GET` `/academic/session`
_getAllSessions_  

**Responses**

- `200` — OK (`*/*`) → [`AcademicSession`](#schema-academicsession)[]

---

### `POST` `/academic/session`
_createAcademicSession_  

**Request body** (required) — `application/json`

Schema: [`CreateAcademicSessionDto`](#schema-createacademicsessiondto) — full fields in appendix.

**Responses**

- `200` — OK (`*/*`) → object

---

### `POST` `/academic/session/activate`
_activateTerm_  

**Request body** (required) — `application/json`

`integer(int64)`

**Responses**

- `200` — OK (`*/*`) → object

---

### `GET` `/academic/session/active`
_getActiveSession_  

**Responses**

- `200` — OK (`*/*`) → [`AcademicSession`](#schema-academicsession)

---

### `GET` `/academic/session/school/{schoolId}/terms`
_getAllAcademicTerm_  

**Path parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `schoolId` | integer(int64) | ✓ |  |

**Query parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `academicSessionId` | integer(int64) |  |  |

**Responses**

- `200` — OK (`*/*`) → [`GetAllTermsResponseDto`](#schema-getalltermsresponsedto)

---

### `PUT` `/academic/session/{sessionId}`
_updateSession_  

**Path parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `sessionId` | integer(int64) | ✓ |  |

**Request body** (required) — `application/json`

Schema: [`UpdateAcademicSessionDto`](#schema-updateacademicsessiondto) — full fields in appendix.

**Responses**

- `200` — OK (`*/*`) → [`AcademicSession`](#schema-academicsession)

---

## admin-controller

### `GET` `/admin/dashboard`
_getOverview_1_  

**Query parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `termId` | integer(int64) |  |  |
| `branchId` | integer(int64) |  |  |

**Responses**

- `200` — OK (`*/*`) → [`DashboardOverviewDto`](#schema-dashboardoverviewdto)

---

## admin-role-controller

### `GET` `/admin/roles`
_getRoles_1_  

**Responses**

- `200` — OK (`*/*`) → object

---

### `POST` `/admin/roles`
_createRole_1_  

**Request body** (required) — `application/json`

Schema: [`RoleDto`](#schema-roledto) — full fields in appendix.

**Responses**

- `200` — OK (`*/*`) → object

---

### `GET` `/admin/roles/{roleId}`
_getRole_  

**Path parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `roleId` | integer(int64) | ✓ |  |

**Responses**

- `200` — OK (`*/*`) → object

---

### `PUT` `/admin/roles/{roleId}`
_updateRole_1_  

**Path parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `roleId` | integer(int64) | ✓ |  |

**Request body** (required) — `application/json`

Schema: [`RoleDto`](#schema-roledto) — full fields in appendix.

**Responses**

- `200` — OK (`*/*`) → object

---

### `DELETE` `/admin/roles/{roleId}`
_delete_  

**Path parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `roleId` | integer(int64) | ✓ |  |

**Responses**

- `200` — OK (`*/*`) → object

---

## admission-number-controller

### `GET` `/admission/number`
_getAdmissionNumberSettings_  

**Responses**

- `200` — OK (`*/*`) → [`AdmissionNumberSetting`](#schema-admissionnumbersetting)

---

### `POST` `/admission/number`
_createAdmissionNumber_  

**Request body** (required) — `application/json`

Schema: [`CreateAdmissionNumberDto`](#schema-createadmissionnumberdto) — full fields in appendix.

**Responses**

- `200` — OK (`*/*`) → object

---

### `GET` `/admission/number/generate`
_generateAdmissionNumber_  

**Responses**

- `200` — OK (`*/*`) → object

---

### `PUT` `/admission/number/{id}`
_updateAdmissionNumber_  

**Path parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `id` | integer(int64) | ✓ |  |

**Request body** (required) — `application/json`

Schema: [`UpdateAdmissionNumberDto`](#schema-updateadmissionnumberdto) — full fields in appendix.

**Responses**

- `200` — OK (`*/*`) → [`AdmissionNumberSetting`](#schema-admissionnumbersetting)

---

## arm-controller

### `GET` `/arms`
_getAllArmsWithClassNames_  

**Query parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `branchId` | integer(int64) |  |  |
| `classId` | integer(int64) |  |  |

**Responses**

- `200` — OK (`*/*`) → [`ArmWithClassNameDto`](#schema-armwithclassnamedto)[]

---

### `POST` `/arms`
_createArm_  

**Request body** (required) — `application/json`

Schema: [`CreateArmDto`](#schema-createarmdto) — full fields in appendix.

**Responses**

- `200` — OK (`*/*`) → [`Arm`](#schema-arm)

---

### `POST` `/arms/class`
_createByClass_2_  

**Request body** (required) — `application/json`

Schema: [`CreateArmByClassDto`](#schema-createarmbyclassdto) — full fields in appendix.

**Responses**

- `200` — OK (`*/*`) → [`Arm`](#schema-arm)[]

---

### `PUT` `/arms/class`
_updateByClass_2_  

**Request body** (required) — `application/json`

Schema: [`UpdateArmByClassDto`](#schema-updatearmbyclassdto) — full fields in appendix.

**Responses**

- `200` — OK (`*/*`) → [`Arm`](#schema-arm)

---

### `DELETE` `/arms/class`
_deleteByClass_2_  

**Query parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `armId` | integer(int64) | ✓ |  |
| `classId` | integer(int64) | ✓ |  |

**Responses**

- `200` — OK (`*/*`) → object

---

### `GET` `/arms/class/{classId}`
_getByClassId_1_  

**Path parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `classId` | integer(int64) | ✓ |  |

**Responses**

- `200` — OK (`*/*`) → object

---

### `GET` `/arms/level`
_getByLevel_2_  

**Query parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `levelType` | enum(CRECHE \| KINDERGARTEN \| NURSERY \| PRIMARY \| JUNIOR_SECONDARY \| SENIOR_SECONDARY) | ✓ |  |
| `branchId` | integer(int64) |  |  |

**Responses**

- `200` — OK (`*/*`) → object

---

### `POST` `/arms/level`
_createByLevel_2_  

**Request body** (required) — `application/json`

Schema: [`CreateArmByLevelDto`](#schema-createarmbyleveldto) — full fields in appendix.

**Responses**

- `200` — OK (`*/*`) → [`Arm`](#schema-arm)[]

---

### `PUT` `/arms/level`
_updateByLevel_2_  

**Request body** (required) — `application/json`

Schema: [`UpdateArmByLevelDto`](#schema-updatearmbyleveldto) — full fields in appendix.

**Responses**

- `200` — OK (`*/*`) → [`Arm`](#schema-arm)

---

### `DELETE` `/arms/level`
_deleteByLevel_2_  

**Query parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `armName` | string | ✓ |  |
| `levelId` | integer(int64) | ✓ |  |

**Responses**

- `200` — OK (`*/*`) → object

---

### `GET` `/arms/{id}`
_getArmById_  

**Path parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `id` | integer(int64) | ✓ |  |

**Responses**

- `200` — OK (`*/*`) → object

---

## assessment-2-controller

### `GET` `/api/cbt/assessments`
_listAssessments_  

**Query parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `branchId` | integer(int64) | ✓ |  |
| `classId` | integer(int64) | ✓ |  |
| `subjectId` | integer(int64) | ✓ |  |

**Responses**

- `200` — OK (`*/*`) → [`AssessmentListDTO`](#schema-assessmentlistdto)[]

---

### `POST` `/api/cbt/assessments`
_createAssessment_  

**Request body** (required) — `application/json`

Schema: [`AssessmentDTO`](#schema-assessmentdto) — full fields in appendix.

**Responses**

- `200` — OK (`*/*`) → [`Assessment2`](#schema-assessment2)

---

### `POST` `/api/cbt/assessments/answers`
_submitAnswer_  

**Request body** (required) — `application/json`

Schema: [`SubmitAnswerDTO`](#schema-submitanswerdto) — full fields in appendix.

**Responses**

- `200` — OK (`*/*`) → [`StudentAnswer`](#schema-studentanswer)

---

### `DELETE` `/api/cbt/assessments/assessment-questions/{aqId}`
_removeQuestion_  

**Path parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `aqId` | integer(int64) | ✓ |  |

**Responses**

- `200` — OK (`*/*`) → object

---

### `POST` `/api/cbt/assessments/grade-manually`
_gradeManually_  

**Request body** (required) — `application/json`

Schema: [`ManualGradeDTO`](#schema-manualgradedto) — full fields in appendix.

**Responses**

- `200` — OK (`*/*`) → [`StudentAnswer`](#schema-studentanswer)

---

### `GET` `/api/cbt/assessments/my`
_getMyAssessments_  

**Responses**

- `200` — OK (`*/*`) → [`TeacherAssessmentListDTO`](#schema-teacherassessmentlistdto)[]

---

### `GET` `/api/cbt/assessments/paper/{studentAssessmentId}`
_getStudentPaper_  

**Path parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `studentAssessmentId` | integer(int64) | ✓ |  |

**Responses**

- `200` — OK (`*/*`) → [`StudentAssessmentPaperDTO`](#schema-studentassessmentpaperdto)

---

### `DELETE` `/api/cbt/assessments/sections/{sectionId}`
_deleteSection_  

**Path parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `sectionId` | integer(int64) | ✓ |  |

**Responses**

- `200` — OK (`*/*`) → object

---

### `POST` `/api/cbt/assessments/sections/{sectionId}/questions`
_addQuestionsToSection_  

**Path parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `sectionId` | integer(int64) | ✓ |  |

**Request body** (required) — `application/json`

Array of `integer(int64)`.

**Responses**

- `200` — OK (`*/*`) → object

---

### `POST` `/api/cbt/assessments/sections/{sectionId}/questions/new`
_createAndAddQuestion_  

**Path parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `sectionId` | integer(int64) | ✓ |  |

**Request body** (required) — `application/json`

Schema: [`QuestionDTO`](#schema-questiondto) — full fields in appendix.

**Responses**

- `200` — OK (`*/*`) → [`QuestionResponseDTO`](#schema-questionresponsedto)

---

### `POST` `/api/cbt/assessments/start`
_startAssessment_  

**Request body** (required) — `application/json`

Schema: [`StartAssessmentDTO`](#schema-startassessmentdto) — full fields in appendix.

**Responses**

- `200` — OK (`*/*`) → [`StudentAssessment`](#schema-studentassessment)

---

### `POST` `/api/cbt/assessments/submit/{studentAssessmentId}`
_submitAssessment_  

**Path parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `studentAssessmentId` | integer(int64) | ✓ |  |

**Responses**

- `200` — OK (`*/*`) → [`StudentAssessment`](#schema-studentassessment)

---

### `GET` `/api/cbt/assessments/{id}`
_getAssessment_  

**Path parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `id` | integer(int64) | ✓ |  |

**Responses**

- `200` — OK (`*/*`) → [`Assessment2`](#schema-assessment2)

---

### `PUT` `/api/cbt/assessments/{id}`
_updateAssessment_  

**Path parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `id` | integer(int64) | ✓ |  |

**Request body** (required) — `application/json`

Schema: [`AssessmentDTO`](#schema-assessmentdto) — full fields in appendix.

**Responses**

- `200` — OK (`*/*`) → [`Assessment2`](#schema-assessment2)

---

### `POST` `/api/cbt/assessments/{id}/publish`
_publishAssessment_  

**Path parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `id` | integer(int64) | ✓ |  |

**Responses**

- `200` — OK (`*/*`) → [`Assessment2`](#schema-assessment2)

---

### `GET` `/api/cbt/assessments/{id}/results`
_getResults_  

**Path parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `id` | integer(int64) | ✓ |  |

**Responses**

- `200` — OK (`*/*`) → [`StudentAssessment`](#schema-studentassessment)[]

---

### `GET` `/api/cbt/assessments/{id}/sections`
_getSections_  

**Path parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `id` | integer(int64) | ✓ |  |

**Responses**

- `200` — OK (`*/*`) → [`AssessmentSectionResponseDTO`](#schema-assessmentsectionresponsedto)[]

---

### `POST` `/api/cbt/assessments/{id}/sections`
_addSection_  

**Path parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `id` | integer(int64) | ✓ |  |

**Request body** (required) — `application/json`

Schema: [`AssessmentSectionDTO`](#schema-assessmentsectiondto) — full fields in appendix.

**Responses**

- `200` — OK (`*/*`) → [`AssessmentSection`](#schema-assessmentsection)

---

### `GET` `/api/cbt/assessments/{id}/stats`
_getStats_1_  

**Path parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `id` | integer(int64) | ✓ |  |

**Responses**

- `200` — OK (`*/*`) → [`AssessmentStatsDTO`](#schema-assessmentstatsdto)

---

## assessment-setting-controller

### `GET` `/assessments/branch/{branchId}`
_getByBranch_2_  

**Path parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `branchId` | integer(int64) | ✓ |  |

**Responses**

- `200` — OK (`*/*`) → [`AssessmentListResponseDto`](#schema-assessmentlistresponsedto)

---

### `GET` `/assessments/class`
_getAssessmentsByClass_  

**Query parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `classId` | integer(int64) | ✓ |  |

**Responses**

- `200` — OK (`*/*`) → [`AssessmentListResponseDto`](#schema-assessmentlistresponsedto)

---

### `GET` `/assessments/level`
_getAssessmentsByLevel_  

**Query parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `levelId` | integer(int64) |  |  |
| `branchId` | integer(int64) |  |  |

**Responses**

- `200` — OK (`*/*`) → [`AssessmentListResponseDto`](#schema-assessmentlistresponsedto)

---

### `POST` `/assessments/level`
_createLevelAssessment_  

**Request body** (required) — `application/json`

Schema: [`CreateLevelAssessmentDto`](#schema-createlevelassessmentdto) — full fields in appendix.

**Responses**

- `200` — OK (`*/*`) → [`SummativeAssessment`](#schema-summativeassessment)[]

---

### `PUT` `/assessments/level`
_updateLevelAssessment_  

**Request body** (required) — `application/json`

Schema: [`CreateLevelAssessmentDto`](#schema-createlevelassessmentdto) — full fields in appendix.

**Responses**

- `200` — OK (`*/*`) → [`SummativeAssessment`](#schema-summativeassessment)[]

---

### `GET` `/assessments/school-default`
_getSchoolDefault_  

**Responses**

- `200` — OK (`*/*`) → [`AssessmentListResponseDto`](#schema-assessmentlistresponsedto)

---

### `POST` `/assessments/school-default`
_createSchoolDefaultAssessment_  

**Request body** (required) — `application/json`

Schema: [`CreateSchoolDefaultAssessmentDto`](#schema-createschooldefaultassessmentdto) — full fields in appendix.

**Responses**

- `200` — OK (`*/*`) → [`SummativeAssessment`](#schema-summativeassessment)[]

---

### `PUT` `/assessments/school-default`
_updateSchoolDefaultAssessment_  

**Request body** (required) — `application/json`

Schema: [`CreateSchoolDefaultAssessmentDto`](#schema-createschooldefaultassessmentdto) — full fields in appendix.

**Responses**

- `200` — OK (`*/*`) → [`SummativeAssessment`](#schema-summativeassessment)[]

---

### `DELETE` `/assessments/{assessmentId}`
_deleteAssessmentById_  

**Path parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `assessmentId` | integer(int64) | ✓ |  |

**Responses**

- `200` — OK (`*/*`) → object

---

## attendance-controller

### `GET` `/attendance`
_getAttendanceStats_  

**Query parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `branchId` | integer(int64) |  |  |
| `classId` | integer(int64) |  |  |
| `armId` | integer(int64) |  |  |
| `termId` | integer(int64) |  |  |
| `search` | string |  |  |

**Responses**

- `200` — OK (`*/*`) → [`GetBranchAttendanceResponseDto`](#schema-getbranchattendanceresponsedto)

---

### `POST` `/attendance`
_createAttendance_  

**Request body** (required) — `application/json`

Schema: [`CreateAttendanceDto`](#schema-createattendancedto) — full fields in appendix.

**Responses**

- `200` — OK (`*/*`) → object

---

### `GET` `/attendance/arm/{armId}`
_getAttendanceByArmId_  

**Path parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `armId` | integer(int64) | ✓ |  |

**Query parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `page` | integer(int32) |  |  |
| `size` | integer(int32) |  |  |
| `date` | string(date) |  |  |

**Responses**

- `200` — OK (`*/*`) → [`GetAttendanceByArmDto`](#schema-getattendancebyarmdto)

---

### `GET` `/attendance/branch/{branchId}`
_getAllAttendances_  

**Path parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `branchId` | integer(int64) | ✓ |  |

**Responses**

- `200` — OK (`*/*`) → [`GetBranchAttendanceResponseDto`](#schema-getbranchattendanceresponsedto)

---

### `POST` `/attendance/mark`
_markAttendance_  

**Request body** (required) — `application/json`

Schema: [`MarkAttendanceDto`](#schema-markattendancedto) — full fields in appendix.

**Responses**

- `200` — OK (`*/*`) → object

---

### `POST` `/attendance/mark-all`
_markAllPresent_  

**Request body** (required) — `application/json`

Schema: [`MarkAllPresentByArmDto`](#schema-markallpresentbyarmdto) — full fields in appendix.

**Responses**

- `200` — OK (`*/*`) → object

---

### `PUT` `/attendance/multiple/attendance/update`
_multipleAttendanceUpdate_  

**Request body** (required) — `application/json`

Schema: [`MultipleAttendanceUpdate`](#schema-multipleattendanceupdate) — full fields in appendix.

**Responses**

- `200` — OK (`*/*`) → object

---

### `GET` `/attendance/term-sheet/arm/{armId}`
_getTermAttendanceSheetByArm_  

**Path parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `armId` | integer(int64) | ✓ |  |

**Query parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `termId` | integer(int64) |  |  |

**Responses**

- `200` — OK (`*/*`) → [`GetTermSheetResponse`](#schema-gettermsheetresponse)[]

---

## authentication-controller

### `POST` `/auth/forgot-password`
_forgotPassword_  

**Request body** (required) — `application/json`

Schema: [`ForgotPasswordDto`](#schema-forgotpassworddto) — full fields in appendix.

**Responses**

- `200` — OK (`*/*`) → object

---

### `POST` `/auth/login`
_login_  

**Request body** (required) — `application/json`

Schema: [`LoginRequest`](#schema-loginrequest) — full fields in appendix.

**Responses**

- `200` — OK (`*/*`) → object

---

### `POST` `/auth/register`
_onboard_  

**Request body** (required) — `application/json`

Schema: [`RegistrationReqData`](#schema-registrationreqdata) — full fields in appendix.

**Responses**

- `200` — OK (`*/*`) → object

---

### `POST` `/auth/register/parent`
_registerParent_  

**Request body** (required) — `application/json`

Schema: [`ParentRegistrationRequestDto`](#schema-parentregistrationrequestdto) — full fields in appendix.

**Responses**

- `200` — OK (`*/*`) → object

---

### `POST` `/auth/reset-password`
_resetPassword_  

**Request body** (required) — `application/json`

Schema: [`ResetPasswordDto`](#schema-resetpassworddto) — full fields in appendix.

**Responses**

- `200` — OK (`*/*`) → object

---

### `POST` `/auth/select-profile`
_selectProfile_  

**Request body** (required) — `application/json`

Schema: [`SelectProfileDto`](#schema-selectprofiledto) — full fields in appendix.

**Responses**

- `200` — OK (`*/*`) → object

---

### `POST` `/auth/switch-profile`
_switchProfile_  

**Request body** (required) — `application/json`

Schema: [`SelectProfileDto`](#schema-selectprofiledto) — full fields in appendix.

**Responses**

- `200` — OK (`*/*`) → object

---

### `POST` `/auth/verify-otp`
_verifyOtp_  

**Request body** (required) — `application/json`

Schema: [`VerifyOtpDto`](#schema-verifyotpdto) — full fields in appendix.

**Responses**

- `200` — OK (`*/*`) → object

---

## bank-account-controller

### `POST` `/banks/account/create`
_createSubAccount_  

**Request body** (required) — `application/json`

Schema: [`CreateSubAccountRequest`](#schema-createsubaccountrequest) — full fields in appendix.

**Responses**

- `200` — OK (`*/*`) → object

---

### `POST` `/banks/account/details`
_requestBankAccountDetails_  

**Request body** (required) — `application/json`

Schema: [`AccountDetails`](#schema-accountdetails) — full fields in appendix.

**Responses**

- `200` — OK (`*/*`) → object

---

### `GET` `/banks/all`
_getBanks_  

**Responses**

- `200` — OK (`*/*`) → [`Bank`](#schema-bank)[]

---

## cbt-overview-controller

### `GET` `/api/cbt/classes/{armId}/subjects`
_getArmDetail_  

**Path parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `armId` | integer(int64) | ✓ |  |

**Responses**

- `200` — OK (`*/*`) → [`CbtArmDetailDTO`](#schema-cbtarmdetaildto)

---

### `POST` `/api/cbt/classes/{armId}/subjects/{subjectId}/notify-teacher`
_notifyTeacher_  

**Path parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `armId` | integer(int64) | ✓ |  |
| `subjectId` | integer(int64) | ✓ |  |

**Responses**

- `200` — OK (`*/*`) → map<string, string>

---

### `GET` `/api/cbt/overview`
_getOverview_  

**Query parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `branchId` | integer(int64) |  |  |
| `levelId` | integer(int64) |  |  |
| `search` | string |  |  |

**Responses**

- `200` — OK (`*/*`) → [`CbtOverviewDTO`](#schema-cbtoverviewdto)

---

## class-arm-report-controller

### `POST` `/report/class/arm`
_createClassArmReport_  

**Request body** (required) — `application/json`

Schema: [`CreateClassArmReportRequest`](#schema-createclassarmreportrequest) — full fields in appendix.

**Responses**

- `200` — OK (`*/*`) → object

---

### `PUT` `/report/class/arm`
_submitClassArmReport_  

**Request body** (required) — `application/json`

Schema: [`SubmitClassArmReportRequest`](#schema-submitclassarmreportrequest) — full fields in appendix.

**Responses**

- `200` — OK (`*/*`) → object

---

### `GET` `/report/class/arm/branch/{branchId}`
_getBranchArmReport_  

**Path parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `branchId` | integer(int64) | ✓ |  |

**Query parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `page` | integer(int32) |  |  |
| `size` | integer(int32) |  |  |
| `termId` | integer(int64) |  |  |
| `search` | string |  |  |
| `levelId` | integer(int64) |  |  |

**Responses**

- `200` — OK (`*/*`) → [`BranchArmReportStats`](#schema-brancharmreportstats)

---

### `PUT` `/report/class/arm/branch/{branchId}/publish`
_publishBranchReport_  

**Path parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `branchId` | integer(int64) | ✓ |  |

**Query parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `termId` | integer(int64) |  |  |

**Responses**

- `200` — OK (`*/*`) → map<string, object>

---

### `PUT` `/report/class/arm/branch/{branchId}/unpublish`
_unpublishBranchReport_  

**Path parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `branchId` | integer(int64) | ✓ |  |

**Query parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `termId` | integer(int64) |  |  |

**Responses**

- `200` — OK (`*/*`) → object

---

### `GET` `/report/class/arm/school`
_getSchoolReport_  

**Query parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `page` | integer(int32) |  |  |
| `size` | integer(int32) |  |  |

**Responses**

- `200` — OK (`*/*`) → [`GetSchoolReportResponseDto`](#schema-getschoolreportresponsedto)

---

### `GET` `/report/class/arm/{armId}`
_getClassArmReport_  

**Path parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `armId` | integer(int64) | ✓ |  |

**Query parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `page` | integer(int32) |  |  |
| `size` | integer(int32) |  |  |
| `termId` | integer(int64) |  |  |

**Responses**

- `200` — OK (`*/*`) → [`GetClassArmStudentReportResponseDto`](#schema-getclassarmstudentreportresponsedto)

---

### `GET` `/report/class/arm/{armId}/cumulative-report`
_getClassArmCumulativeReport_  

**Path parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `armId` | integer(int64) | ✓ |  |

**Query parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `academicSessionId` | integer(int64) |  |  |

**Responses**

- `200` — OK (`*/*`) → [`StudentCumulativeReportResponse`](#schema-studentcumulativereportresponse)

---

### `GET` `/report/class/arm/{armId}/required-subject-report`
_getRequiredSubjectReport_  

**Path parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `armId` | integer(int64) | ✓ |  |

**Query parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `academicSessionId` | integer(int64) |  |  |

**Responses**

- `200` — OK (`*/*`) → [`StudentRequiredSubjectReportResponse`](#schema-studentrequiredsubjectreportresponse)

---

## class-controller

### `GET` `/classes`
_getAllClasses_  

**Query parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `page` | integer(int32) |  |  |
| `size` | integer(int32) |  |  |
| `branchId` | integer(int64) |  |  |
| `schoolId` | integer(int64) |  |  |

**Responses**

- `200` — OK (`*/*`) → object

---

### `POST` `/classes`
_createClassroom_  

**Request body** (required) — `application/json`

Schema: [`ClassRoomDto`](#schema-classroomdto) — full fields in appendix.

**Responses**

- `200` — OK (`*/*`) → [`ClassRoom`](#schema-classroom)

---

### `PUT` `/classes`
_updateClassroom_  

**Request body** (required) — `application/json`

Schema: [`UpdateClassroomDto`](#schema-updateclassroomdto) — full fields in appendix.

**Responses**

- `200` — OK (`*/*`) → [`ClassRoom`](#schema-classroom)

---

### `GET` `/classes/branch/{branchId}`
_getClassArmSubjects_1_  

**Path parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `branchId` | integer(int64) | ✓ |  |

**Query parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `page` | integer(int32) |  |  |
| `size` | integer(int32) |  |  |

**Responses**

- `200` — OK (`*/*`) → [`PageGetClassArmSubjectResponseDto`](#schema-pagegetclassarmsubjectresponsedto)

---

### `GET` `/classes/details/level/{levelId}`
_getClassArmSubjectsByLevelId_  

**Path parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `levelId` | integer(int64) | ✓ |  |

**Query parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `page` | integer(int32) |  |  |
| `size` | integer(int32) |  |  |

**Responses**

- `200` — OK (`*/*`) → [`PageClassArmSubjectDepartmentResponseDto`](#schema-pageclassarmsubjectdepartmentresponsedto)

---

### `GET` `/classes/level/{levelId}`
_getClassByLevelId_  

**Path parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `levelId` | integer(int64) | ✓ |  |

**Responses**

- `200` — OK (`*/*`) → [`ClassRoom`](#schema-classroom)[]

---

### `DELETE` `/classes/{classroomId}`
_deleteClassRoom_  

**Path parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `classroomId` | integer(int64) | ✓ |  |

**Responses**

- `200` — OK (`*/*`) → object

---

### `GET` `/classes/{id}`
_getClassById_  

**Path parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `id` | integer(int64) | ✓ |  |

**Responses**

- `200` — OK (`*/*`) → object

---

## class-level-controller

### `POST` `/class-levels`
_createClassLevel_  

**Request body** (required) — `application/json`

Schema: [`CreateLevelDto`](#schema-createleveldto) — full fields in appendix.

**Responses**

- `200` — OK (`*/*`) → object

---

### `PUT` `/class-levels`
_updateClassLevel_  

**Request body** (required) — `application/json`

Schema: [`CustomizeLevelDto`](#schema-customizeleveldto) — full fields in appendix.

**Responses**

- `200` — OK (`*/*`) → object

---

### `GET` `/class-levels/names`
_getClassLevelNames_  

**Query parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `branchId` | integer(int64) |  |  |

**Responses**

- `200` — OK (`*/*`) → [`BranchClassLevelNameDto`](#schema-branchclasslevelnamedto)[]

---

### `DELETE` `/class-levels/{levelId}`
_deleteClassLevelById_  

**Path parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `levelId` | integer(int64) | ✓ |  |

**Responses**

- `200` — OK (`*/*`) → object

---

## class-teacher-controller

### `POST` `/teacher/class`
_assignClassTeacher_  

**Request body** (required) — `application/json`

Schema: [`AssignClassTeacherDto`](#schema-assignclassteacherdto) — full fields in appendix.

**Responses**

- `200` — OK (`*/*`) → object

---

### `PUT` `/teacher/class`
_reassignClassTeacher_  

**Request body** (required) — `application/json`

Schema: [`AssignClassTeacherDto`](#schema-assignclassteacherdto) — full fields in appendix.

**Responses**

- `200` — OK (`*/*`) → object

---

### `GET` `/teacher/class/my`
_getClassTeacher_  

**Responses**

- `200` — OK (`*/*`) → [`GetClassArmNameDto`](#schema-getclassarmnamedto)[]

---

## department-controller

### `GET` `/departments/arms/class`
_getArmsByClass_  

**Query parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `departmentId` | integer(int64) | ✓ |  |
| `classId` | integer(int64) | ✓ |  |

**Responses**

- `200` — OK (`*/*`) → [`Arm`](#schema-arm)[]

---

### `POST` `/departments/arms/class`
_assignArmByClass_  

**Request body** (required) — `application/json`

Schema: [`AssignDepartmentArmByClassDto`](#schema-assigndepartmentarmbyclassdto) — full fields in appendix.

**Responses**

- `200` — OK (`*/*`) → object

---

### `GET` `/departments/arms/level`
_getArmsByLevel_  

**Query parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `departmentId` | integer(int64) | ✓ |  |
| `levelId` | integer(int64) | ✓ |  |

**Responses**

- `200` — OK (`*/*`) → [`Arm`](#schema-arm)[]

---

### `POST` `/departments/arms/level`
_assignArmsByLevel_  

**Request body** (required) — `application/json`

Schema: [`AssignDepartmentArmByLevelDto`](#schema-assigndepartmentarmbyleveldto) — full fields in appendix.

**Responses**

- `200` — OK (`*/*`) → object

---

### `GET` `/departments/class`
_getByClass_1_  

**Query parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `className` | string | ✓ |  |
| `levelType` | enum(CRECHE \| KINDERGARTEN \| NURSERY \| PRIMARY \| JUNIOR_SECONDARY \| SENIOR_SECONDARY) | ✓ |  |
| `branchId` | integer(int64) |  |  |

**Responses**

- `200` — OK (`*/*`) → object

---

### `POST` `/departments/class`
_createByClass_1_  

**Request body** (required) — `application/json`

Schema: [`CreateDepartmentByClassDto`](#schema-createdepartmentbyclassdto) — full fields in appendix.

**Responses**

- `200` — OK (`*/*`) → [`Department`](#schema-department)[]

---

### `PUT` `/departments/class`
_updateByClass_1_  

**Request body** (required) — `application/json`

Schema: [`UpdateDepartmentDto`](#schema-updatedepartmentdto) — full fields in appendix.

**Responses**

- `200` — OK (`*/*`) → [`Department`](#schema-department)

---

### `DELETE` `/departments/class`
_deleteByClass_1_  

**Query parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `departmentId` | integer(int64) | ✓ |  |
| `classId` | integer(int64) | ✓ |  |

**Responses**

- `200` — OK (`*/*`) → object

---

### `GET` `/departments/level`
_getByLevel_1_  

**Query parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `levelType` | enum(CRECHE \| KINDERGARTEN \| NURSERY \| PRIMARY \| JUNIOR_SECONDARY \| SENIOR_SECONDARY) | ✓ |  |
| `branchId` | integer(int64) |  |  |

**Responses**

- `200` — OK (`*/*`) → object

---

### `POST` `/departments/level`
_createByLevel_1_  

**Request body** (required) — `application/json`

Schema: [`CreateDepartmentByLevelDto`](#schema-createdepartmentbyleveldto) — full fields in appendix.

**Responses**

- `200` — OK (`*/*`) → [`Department`](#schema-department)[]

---

### `PUT` `/departments/level`
_updateByLevel_1_  

**Request body** (required) — `application/json`

Schema: [`UpdateDepartmentDto`](#schema-updatedepartmentdto) — full fields in appendix.

**Responses**

- `200` — OK (`*/*`) → [`Department`](#schema-department)

---

### `DELETE` `/departments/level`
_deleteByLevel_1_  

**Query parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `departmentId` | integer(int64) | ✓ |  |
| `levelId` | integer(int64) | ✓ |  |

**Responses**

- `200` — OK (`*/*`) → object

---

### `POST` `/departments/subjects`
_assignSubjects_  

**Request body** (required) — `application/json`

Schema: [`AssignDepartmentSubjectsDto`](#schema-assigndepartmentsubjectsdto) — full fields in appendix.

**Responses**

- `200` — OK (`*/*`) → object

---

### `GET` `/departments/subjects/class`
_getSubjectsByClass_  

**Query parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `departmentId` | integer(int64) | ✓ |  |
| `classId` | integer(int64) | ✓ |  |

**Responses**

- `200` — OK (`*/*`) → [`SubjectDto`](#schema-subjectdto)[]

---

### `PUT` `/departments/subjects/class`
_updateSubjectsByClass_  

**Request body** (required) — `application/json`

Schema: [`UpdateDepartmentSubjectsByClassDto`](#schema-updatedepartmentsubjectsbyclassdto) — full fields in appendix.

**Responses**

- `200` — OK (`*/*`) → object

---

### `GET` `/departments/subjects/level`
_getSubjectsByLevel_  

**Query parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `departmentId` | integer(int64) | ✓ |  |
| `levelId` | integer(int64) | ✓ |  |

**Responses**

- `200` — OK (`*/*`) → [`SubjectDto`](#schema-subjectdto)[]

---

### `PUT` `/departments/subjects/level`
_updateSubjectsByLevel_  

**Request body** (required) — `application/json`

Schema: [`UpdateDepartmentSubjectsByLevelDto`](#schema-updatedepartmentsubjectsbyleveldto) — full fields in appendix.

**Responses**

- `200` — OK (`*/*`) → object

---

### `DELETE` `/departments/{departmentId}/subject/{subjectId}`
_deleteById_1_  

**Path parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `departmentId` | integer(int64) | ✓ |  |
| `subjectId` | integer(int64) | ✓ |  |

**Responses**

- `200` — OK (`*/*`) → object

---

## domain-controller

### `POST` `/api/domains/check`
_checkDomain_  

**Request body** (required) — `application/json`

Schema: [`CheckDomainRequest`](#schema-checkdomainrequest) — full fields in appendix.

**Responses**

- `200` — OK (`*/*`) → object

---

### `GET` `/api/domains/contact`
_getContact_  

**Query parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `domain` | string | ✓ |  |

**Responses**

- `200` — OK (`*/*`) → object

---

### `PUT` `/api/domains/contact`
_updateContact_  

**Request body** (required) — `application/json`

Schema: [`UpdateContactRequest`](#schema-updatecontactrequest) — full fields in appendix.

**Responses**

- `200` — OK (`*/*`) → object

---

### `GET` `/api/domains/epp`
_getEppCode_  

**Query parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `domain` | string | ✓ |  |

**Responses**

- `200` — OK (`*/*`) → object

---

### `GET` `/api/domains/info`
_getDomainInfo_  

**Query parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `domain` | string | ✓ |  |

**Responses**

- `200` — OK (`*/*`) → object

---

### `GET` `/api/domains/nameservers`
_getNameservers_  

**Query parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `domain` | string | ✓ |  |

**Responses**

- `200` — OK (`*/*`) → object

---

### `PUT` `/api/domains/nameservers`
_updateNameservers_  

**Request body** (required) — `application/json`

Schema: [`UpdateNameserversRequest`](#schema-updatenameserversrequest) — full fields in appendix.

**Responses**

- `200` — OK (`*/*`) → object

---

### `GET` `/api/domains/pricing`
_getTldPricingList_  

**Responses**

- `200` — OK (`*/*`) → object

---

### `POST` `/api/domains/register`
_registerDomain_  

**Request body** (required) — `application/json`

Schema: [`RegisterDomainRequest`](#schema-registerdomainrequest) — full fields in appendix.

**Responses**

- `200` — OK (`*/*`) → object

---

### `GET` `/api/domains/registrar-lock`
_getRegistrarLock_  

**Query parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `domain` | string | ✓ |  |

**Responses**

- `200` — OK (`*/*`) → object

---

### `PUT` `/api/domains/registrar-lock`
_updateRegistrarLock_  

**Request body** (required) — `application/json`

Schema: [`RegistrarLockRequest`](#schema-registrarlockrequest) — full fields in appendix.

**Responses**

- `200` — OK (`*/*`) → object

---

### `POST` `/api/domains/renew`
_renewDomain_  

**Request body** (required) — `application/json`

Schema: [`RenewDomainRequest`](#schema-renewdomainrequest) — full fields in appendix.

**Responses**

- `200` — OK (`*/*`) → object

---

### `POST` `/api/domains/transfer`
_transferDomain_  

**Request body** (required) — `application/json`

Schema: [`TransferDomainRequest`](#schema-transferdomainrequest) — full fields in appendix.

**Responses**

- `200` — OK (`*/*`) → object

---

## edit-access-controller

### `POST` `/edit-access`
_create_2_  

**Request body** (required) — `application/json`

Schema: [`CreateEditAccessDto`](#schema-createeditaccessdto) — full fields in appendix.

**Responses**

- `200` — OK (`*/*`) → [`EditRequestResponseDto`](#schema-editrequestresponsedto)

---

### `POST` `/edit-access/approve`
_approveOrRejectEditAccess_  

**Request body** (required) — `application/json`

Schema: [`ApproveEditRequestDto`](#schema-approveeditrequestdto) — full fields in appendix.

**Responses**

- `200` — OK (`*/*`) → [`EditRequestResponseDto`](#schema-editrequestresponsedto)

---

### `POST` `/edit-access/approve/all`
_approveOrRejectAllEditAccess_  

**Request body** (required) — `application/json`

Schema: [`ApproveAllRequestDto`](#schema-approveallrequestdto) — full fields in appendix.

**Responses**

- `200` — OK (`*/*`) → object

---

### `GET` `/edit-access/arm/{armId}`
_getListByArm_  

**Path parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `armId` | integer(int64) | ✓ |  |

**Responses**

- `200` — OK (`*/*`) → [`EditRequestResponseDto`](#schema-editrequestresponsedto)[]

---

### `GET` `/edit-access/branch/{branchId}`
_getByBranch_1_  

**Path parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `branchId` | integer(int64) | ✓ |  |

**Query parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `search` | string |  |  |

**Responses**

- `200` — OK (`*/*`) → [`EditRequestResponseDto`](#schema-editrequestresponsedto)[]

---

### `GET` `/edit-access/class/arm/{armId}`
_getByArm_  

**Path parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `armId` | integer(int64) | ✓ |  |

**Responses**

- `200` — OK (`*/*`) → [`EditRequestResponseDto`](#schema-editrequestresponsedto)

---

### `GET` `/edit-access/subject/{subjectId}/arm/{armId}`
_getByArmAndSubject_  

**Path parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `armId` | integer(int64) | ✓ |  |
| `subjectId` | integer(int64) | ✓ |  |

**Responses**

- `200` — OK (`*/*`) → [`EditRequestResponseDto`](#schema-editrequestresponsedto)

---

## fee-class-controller

### `GET` `/fee/class/overview`
_getFeeClassesOverview_  

**Query parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `sessionId` | integer(int64) | ✓ |  |
| `term` | enum(FIRST \| SECOND \| THIRD) | ✓ |  |
| `branchId` | integer(int64) |  |  |

**Responses**

- `200` — OK (`*/*`) → [`FeeClassOverviewResponse`](#schema-feeclassoverviewresponse)

---

### `PUT` `/fee/class/{id}/name`
_renameClass_  

**Path parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `id` | integer(int64) | ✓ |  |

**Query parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `name` | string | ✓ |  |

**Responses**

- `200` — OK (`*/*`) → map<string, string>

---

## fee-collection-setup-controller

### `GET` `/api/fee-collection/accounts`
_getBankAccounts_  

**Responses**

- `200` — OK (`*/*`) → [`BankAccountInfo`](#schema-bankaccountinfo)[]

---

### `PUT` `/api/fee-collection/accounts/{accountId}`
_updateBankAccount_  

**Path parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `accountId` | integer(int64) | ✓ |  |

**Request body** (required) — `application/json`

Schema: [`UpdateBankAccountDto`](#schema-updatebankaccountdto) — full fields in appendix.

**Responses**

- `200` — OK (`*/*`) → map<string, string>

---

### `PUT` `/api/fee-collection/mode`
_updateMode_  

**Request body** (required) — `application/json`

Schema: [`UpdateModeDto`](#schema-updatemodedto) — full fields in appendix.

**Responses**

- `200` — OK (`*/*`) → map<string, string>

---

### `POST` `/api/fee-collection/setup`
_setupFeeCollection_  

**Request body** (required) — `application/json`

Schema: [`FeeCollectionSetupDto`](#schema-feecollectionsetupdto) — full fields in appendix.

**Responses**

- `200` — OK (`*/*`) → map<string, string>

---

### `GET` `/api/fee-collection/setup/status`
_getSetupStatus_  

**Responses**

- `200` — OK (`*/*`) → [`FeeCollectionConfigResponse`](#schema-feecollectionconfigresponse)

---

## fee-controller

### `GET` `/fee/fees`
_getFees_  

**Query parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `termId` | integer(int64) |  |  |

**Responses**

- `200` — OK (`*/*`) → [`Fee`](#schema-fee)[]

---

### `DELETE` `/fee/fees/{id}`
_deleteFee_  

**Path parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `id` | integer(int64) | ✓ |  |

**Responses**

- `200` — OK (`*/*`) → object

---

### `GET` `/fee/fees/{id}/arms`
_getFeeArms_  

**Path parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `id` | integer(int64) | ✓ |  |

**Responses**

- `200` — OK (`*/*`) → [`FeeArm`](#schema-feearm)[]

---

### `GET` `/fee/fees/{id}/items`
_getFeeItems_  

**Path parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `id` | integer(int64) | ✓ |  |

**Responses**

- `200` — OK (`*/*`) → [`FeeItem`](#schema-feeitem)[]

---

### `POST` `/fee/fees/{id}/publish`
_publishFee_  

**Path parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `id` | integer(int64) | ✓ |  |

**Responses**

- `200` — OK (`*/*`) → map<string, string>

---

## fee-routing-controller

### `GET` `/fee/route`
_getAllFeeRoutes_  

**Responses**

- `200` — OK (`*/*`) → [`FeeRouteResponseDto`](#schema-feerouteresponsedto)[]

---

### `POST` `/fee/route`
_createFeeRoute_  

**Request body** (required) — `application/json`

Schema: [`FeeRouteRequestDto`](#schema-feerouterequestdto) — full fields in appendix.

**Responses**

- `200` — OK (`*/*`) → object

---

### `GET` `/fee/route/branch/{branchId}`
_getFeeRoutesByBranch_  

**Path parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `branchId` | integer(int64) | ✓ |  |

**Responses**

- `200` — OK (`*/*`) → [`FeeRouteResponseDto`](#schema-feerouteresponsedto)[]

---

### `PUT` `/fee/route/{id}`
_updateFeeRoute_  

**Path parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `id` | integer(int64) | ✓ |  |

**Request body** (required) — `application/json`

Schema: [`FeeRouteRequestDto`](#schema-feerouterequestdto) — full fields in appendix.

**Responses**

- `200` — OK (`*/*`) → [`FeeRouteResponseDto`](#schema-feerouteresponsedto)

---

### `DELETE` `/fee/route/{id}`
_deleteFeeRoute_  

**Path parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `id` | integer(int64) | ✓ |  |

**Responses**

- `200` — OK (`*/*`) → object

---

## grading-controller

### `GET` `/gradings/branch/{branchId}`
_getByBranch_  

**Path parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `branchId` | integer(int64) | ✓ |  |

**Responses**

- `200` — OK (`*/*`) → [`Grading`](#schema-grading)[]

---

### `GET` `/gradings/class`
_getGradingByClass_  

**Query parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `classId` | integer(int64) | ✓ |  |

**Responses**

- `200` — OK (`*/*`) → [`Grading`](#schema-grading)[]

---

### `GET` `/gradings/level`
_getGradingByLevel_  

**Query parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `levelId` | integer(int64) |  |  |
| `branchId` | integer(int64) |  |  |

**Responses**

- `200` — OK (`*/*`) → [`Grading`](#schema-grading)[]

---

### `POST` `/gradings/level`
_createLevelGrading_  

**Request body** (required) — `application/json`

Schema: [`CreateLevelGradingDto`](#schema-createlevelgradingdto) — full fields in appendix.

**Responses**

- `200` — OK (`*/*`) → [`Grading`](#schema-grading)[]

---

### `PUT` `/gradings/level`
_updateLevelGrading_  

**Request body** (required) — `application/json`

Schema: [`CreateLevelGradingDto`](#schema-createlevelgradingdto) — full fields in appendix.

**Responses**

- `200` — OK (`*/*`) → [`Grading`](#schema-grading)[]

---

### `GET` `/gradings/school`
_getSchoolDefault_1_  

**Responses**

- `200` — OK (`*/*`) → [`Grading`](#schema-grading)[]

---

### `POST` `/gradings/school-default`
_createSchoolDefaultGrading_  

**Request body** (required) — `application/json`

Schema: [`CreateSchoolDefaultGradingDto`](#schema-createschooldefaultgradingdto) — full fields in appendix.

**Responses**

- `200` — OK (`*/*`) → [`Grading`](#schema-grading)[]

---

### `PUT` `/gradings/school-default`
_updateSchoolDefault_  

**Request body** (required) — `application/json`

Schema: [`CreateSchoolDefaultGradingDto`](#schema-createschooldefaultgradingdto) — full fields in appendix.

**Responses**

- `200` — OK (`*/*`) → [`Grading`](#schema-grading)[]

---

### `DELETE` `/gradings/{gradingId}`
_deleteGradingById_  

**Path parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `gradingId` | integer(int64) | ✓ |  |

**Responses**

- `200` — OK (`*/*`) → object

---

## invoice-controller

### `POST` `/invoices`
_createInvoice_  

**Request body** (required) — `application/json`

Schema: [`CreateInvoiceDto`](#schema-createinvoicedto) — full fields in appendix.

**Responses**

- `200` — OK (`*/*`) → object

---

### `GET` `/invoices/student/{studentId}`
_getInvoicesForStudent_  

**Path parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `studentId` | integer(int64) | ✓ |  |

**Query parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `page` | integer(int32) |  |  |
| `size` | integer(int32) |  |  |

**Responses**

- `200` — OK (`*/*`) → [`PageInvoice`](#schema-pageinvoice)

---

### `GET` `/invoices/{branchId}`
_getInvoices_  

**Path parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `branchId` | integer(int64) | ✓ |  |

**Query parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `page` | integer(int32) |  |  |
| `size` | integer(int32) |  |  |
| `classId` | integer(int64) |  |  |
| `armId` | integer(int64) |  |  |
| `termId` | integer(int64) |  |  |
| `startDate` | string(date-time) |  |  |
| `endDate` | string(date-time) |  |  |

**Responses**

- `200` — OK (`*/*`) → [`InvoicesPageResponse`](#schema-invoicespageresponse)

---

## invoice-settings-controller

### `POST` `/invoice-settings`
_createInvoiceSettings_  

**Request body** (required) — `application/json`

Schema: [`CreateInvoiceSettingsDto`](#schema-createinvoicesettingsdto) — full fields in appendix.

**Responses**

- `200` — OK (`*/*`) → object

---

## parent-controller

### `POST` `/parents`
_create_  

**Request body** (required) — `application/json`

Schema: [`CreateParentDto`](#schema-createparentdto) — full fields in appendix.

**Responses**

- `200` — OK (`*/*`) → object

---

### `PUT` `/parents`
_updateParent_  

**Request body** (required) — `application/json`

Schema: [`UpdateParentDto`](#schema-updateparentdto) — full fields in appendix.

**Responses**

- `200` — OK (`*/*`) → [`ParentResponseDto`](#schema-parentresponsedto)

---

### `GET` `/parents/all`
_getParents_  

**Query parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `page` | integer(int32) |  |  |
| `size` | integer(int32) |  |  |
| `branchId` | integer(int64) |  |  |
| `search` | string |  |  |

**Responses**

- `200` — OK (`*/*`) → object

---

### `GET` `/parents/export`
_exportParents_  

**Query parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `branchId` | integer(int64) |  |  |

**Responses**

- `200` — OK (`*/*`) → string(binary)

---

### `POST` `/parents/upload`
_upload_1_  

**Request body** (optional) — `application/json`

| Field | Type | Required | Notes |
|---|---|---|---|
| `file` | string(binary) | ✓ |  |

**Responses**

- `200` — OK (`*/*`) → object

---

### `POST` `/parents/upload/{branchId}`
_upload_2_  

**Path parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `branchId` | integer(int64) | ✓ |  |

**Request body** (optional) — `application/json`

| Field | Type | Required | Notes |
|---|---|---|---|
| `file` | string(binary) | ✓ |  |

**Responses**

- `200` — OK (`*/*`) → object

---

### `DELETE` `/parents/{parentIds}`
_deleteParent_1_  

**Path parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `parentIds` | integer(int64)[] | ✓ |  |

**Responses**

- `200` — OK (`*/*`) → object

---

### `GET` `/parents/{parentId}`
_getParent_  

**Path parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `parentId` | integer(int64) | ✓ |  |

**Responses**

- `200` — OK (`*/*`) → [`ParentResponseDto`](#schema-parentresponsedto)

---

## payment-config-controller

### `GET` `/api/payments/config/currencies`
_getCurrencyConfig_  

**Responses**

- `200` — OK (`*/*`) → [`CurrencyConfigDto`](#schema-currencyconfigdto)

---

### `POST` `/api/payments/config/currencies`
_configureCurrencies_  

**Request body** (required) — `application/json`

Schema: [`CurrencyConfigDto`](#schema-currencyconfigdto) — full fields in appendix.

**Responses**

- `200` — OK (`*/*`) → object

---

### `GET` `/api/payments/config/exchange-rates`
_getExchangeRates_  

**Responses**

- `200` — OK (`*/*`) → [`ExchangeRateDto`](#schema-exchangeratedto)[]

---

### `POST` `/api/payments/config/exchange-rates`
_updateExchangeRates_  

**Request body** (required) — `application/json`

Array of [`ExchangeRateDto`](#schema-exchangeratedto).

**Responses**

- `200` — OK (`*/*`) → object

---

### `GET` `/api/payments/config/service-charge`
_getServiceChargeConfig_  

**Responses**

- `200` — OK (`*/*`) → [`ServiceChargeConfigDto`](#schema-servicechargeconfigdto)

---

### `POST` `/api/payments/config/service-charge`
_configureServiceCharge_  

**Request body** (required) — `application/json`

Schema: [`ServiceChargeConfigDto`](#schema-servicechargeconfigdto) — full fields in appendix.

**Responses**

- `200` — OK (`*/*`) → object

---

## payment-controller

### `POST` `/api/payments/calculate`
_calculatePayment_  

**Request body** (required) — `application/json`

Schema: [`PaymentCalculateDto`](#schema-paymentcalculatedto) — full fields in appendix.

**Responses**

- `200` — OK (`*/*`) → [`PaymentCalculation`](#schema-paymentcalculation)

---

### `POST` `/api/payments/initiate`
_initiatePayment_  

**Request body** (required) — `application/json`

Schema: [`PaymentRequestDto`](#schema-paymentrequestdto) — full fields in appendix.

**Responses**

- `200` — OK (`*/*`) → [`PaymentResponseDto`](#schema-paymentresponsedto)

---

### `GET` `/api/payments/invoice/{invoiceId}`
_getStudentInvoice_  

**Path parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `invoiceId` | integer(int64) | ✓ |  |

**Query parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `currency` | enum(NGN \| USD \| GBP \| EUR) |  |  |

**Responses**

- `200` — OK (`*/*`) → [`StudentInvoiceDto`](#schema-studentinvoicedto)

---

### `POST` `/api/payments/webhook/paystack`
_handlePaystackWebhook_  

**Request body** (required) — `application/json`

Map of `string` → `object`.

**Responses**

- `200` — OK (`*/*`) → object

---

## permission-controller

### `GET` `/permissions`
_getPermissions_  

**Query parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `page` | integer(int32) |  |  |
| `size` | integer(int32) |  |  |

**Responses**

- `200` — OK (`*/*`) → object

---

## question-bank-controller

### `POST` `/api/cbt/question-bank/questions`
_createQuestion_  

**Request body** (required) — `application/json`

Schema: [`QuestionDTO`](#schema-questiondto) — full fields in appendix.

**Responses**

- `200` — OK (`*/*`) → [`QuestionResponseDTO`](#schema-questionresponsedto)

---

### `GET` `/api/cbt/question-bank/questions/classes/{classId}/subjects/{subjectId}`
_getQuestions_  

**Path parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `classId` | integer(int64) | ✓ |  |
| `subjectId` | integer(int64) | ✓ |  |

**Query parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `topicId` | integer(int64) |  |  |
| `search` | string |  |  |

**Responses**

- `200` — OK (`*/*`) → [`QuestionResponseDTO`](#schema-questionresponsedto)[]

---

### `POST` `/api/cbt/question-bank/questions/import`
_importQuestions_  

**Query parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `classId` | integer(int64) | ✓ |  |
| `subjectId` | integer(int64) | ✓ |  |

**Request body** (optional) — `application/json`

| Field | Type | Required | Notes |
|---|---|---|---|
| `file` | string(binary) | ✓ |  |

**Responses**

- `200` — OK (`*/*`) → [`ImportResult`](#schema-importresult)

---

### `GET` `/api/cbt/question-bank/questions/{id}`
_getQuestion_  

**Path parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `id` | integer(int64) | ✓ |  |

**Responses**

- `200` — OK (`*/*`) → [`QuestionResponseDTO`](#schema-questionresponsedto)

---

### `PUT` `/api/cbt/question-bank/questions/{id}`
_updateQuestion_  

**Path parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `id` | integer(int64) | ✓ |  |

**Request body** (required) — `application/json`

Schema: [`QuestionDTO`](#schema-questiondto) — full fields in appendix.

**Responses**

- `200` — OK (`*/*`) → [`QuestionResponseDTO`](#schema-questionresponsedto)

---

### `DELETE` `/api/cbt/question-bank/questions/{id}`
_deleteQuestion_  

**Path parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `id` | integer(int64) | ✓ |  |

**Responses**

- `200` — OK (`*/*`) → object

---

### `GET` `/api/cbt/question-bank/stats`
_getStats_  

**Query parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `classId` | integer(int64) | ✓ |  |
| `subjectId` | integer(int64) | ✓ |  |

**Responses**

- `200` — OK (`*/*`) → [`SubjectCbtStatsDTO`](#schema-subjectcbtstatsdto)

---

### `GET` `/api/cbt/question-bank/topics`
_getTopics_  

**Query parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `classId` | integer(int64) |  |  |
| `subjectId` | integer(int64) |  |  |

**Responses**

- `200` — OK (`*/*`) → [`Topic`](#schema-topic)[]

---

### `POST` `/api/cbt/question-bank/topics`
_createTopic_  

**Request body** (required) — `application/json`

Schema: [`TopicDTO`](#schema-topicdto) — full fields in appendix.

**Responses**

- `200` — OK (`*/*`) → [`Topic`](#schema-topic)

---

### `PUT` `/api/cbt/question-bank/topics/{id}`
_updateTopic_  

**Path parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `id` | integer(int64) | ✓ |  |

**Request body** (required) — `application/json`

Schema: [`TopicDTO`](#schema-topicdto) — full fields in appendix.

**Responses**

- `200` — OK (`*/*`) → [`Topic`](#schema-topic)

---

### `DELETE` `/api/cbt/question-bank/topics/{id}`
_deleteTopic_  

**Path parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `id` | integer(int64) | ✓ |  |

**Responses**

- `200` — OK (`*/*`) → object

---

## re-authentication-controller

### `GET` `/reauth/token`
_login_1_  

**Responses**

- `200` — OK (`*/*`) → object

---

## report-initialization-controller

### `POST` `/report-initialization`
_initializeReports_  

**Responses**

- `200` — OK (`*/*`) → object

---

## result-setting-controller

### `GET` `/result-settings`
_getAll_  

**Responses**

- `200` — OK (`*/*`) → [`ResultSettingResponseDto`](#schema-resultsettingresponsedto)[]

---

### `POST` `/result-settings`
_create_1_  

**Request body** (required) — `application/json`

Schema: [`CreateResultSettingDto`](#schema-createresultsettingdto) — full fields in appendix.

**Responses**

- `200` — OK (`*/*`) → [`ResultSettingResponseDto`](#schema-resultsettingresponsedto)

---

### `GET` `/result-settings/level`
_getByLevel_4_  

**Query parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `levelId` | integer(int64) | ✓ |  |
| `academicSessionId` | integer(int64) |  |  |

**Responses**

- `200` — OK (`*/*`) → [`ResultSettingResponseDto`](#schema-resultsettingresponsedto)

---

### `GET` `/result-settings/principal-comment`
_getAllPrincipalComment_  

**Responses**

- `200` — OK (`*/*`) → [`PrincipalCommentResponseDto`](#schema-principalcommentresponsedto)[]

---

### `POST` `/result-settings/principal-comment`
_createComments_  

**Request body** (required) — `application/json`

Schema: [`PrincipalCommentRequestDto`](#schema-principalcommentrequestdto) — full fields in appendix.

**Responses**

- `200` — OK (`*/*`) → object

---

### `PUT` `/result-settings/principal-comment`
_updateComments_  

**Request body** (required) — `application/json`

Schema: [`PrincipalCommentRequestDto`](#schema-principalcommentrequestdto) — full fields in appendix.

**Responses**

- `200` — OK (`*/*`) → object

---

### `GET` `/result-settings/principal-comment/level/{levelId}`
_getByLevel_3_  

**Path parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `levelId` | integer(int64) | ✓ |  |

**Responses**

- `200` — OK (`*/*`) → [`PrincipalCommentResponseDto`](#schema-principalcommentresponsedto)

---

### `DELETE` `/result-settings/principal-comment/level/{levelId}`
_deleteAllByLevel_  

**Path parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `levelId` | integer(int64) | ✓ |  |

**Responses**

- `200` — OK

---

### `DELETE` `/result-settings/principal-comment/{commentId}`
_delete_2_  

**Path parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `commentId` | integer(int64) | ✓ |  |

**Responses**

- `200` — OK

---

### `GET` `/result-settings/submission-deadline`
_getDeadlines_  

**Responses**

- `200` — OK (`*/*`) → [`SubmissionDeadlineResponse`](#schema-submissiondeadlineresponse)[]

---

### `POST` `/result-settings/submission-deadline`
_createDeadlines_  

**Request body** (required) — `application/json`

Schema: [`CreateSubmissionDeadlineDto`](#schema-createsubmissiondeadlinedto) — full fields in appendix.

**Responses**

- `200` — OK (`*/*`) → [`SubmissionDeadlineResponse`](#schema-submissiondeadlineresponse)[]

---

### `PUT` `/result-settings/submission-deadline`
_replaceDeadlines_  

**Request body** (required) — `application/json`

Schema: [`UpdateSubmissionDeadlineDto`](#schema-updatesubmissiondeadlinedto) — full fields in appendix.

**Responses**

- `200` — OK (`*/*`) → [`SubmissionDeadlineResponse`](#schema-submissiondeadlineresponse)[]

---

### `GET` `/result-settings/submission-deadline/term`
_getDeadlineByTerm_  

**Query parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `termId` | integer(int64) | ✓ |  |

**Responses**

- `200` — OK (`*/*`) → [`SubmissionDeadlineResponse`](#schema-submissiondeadlineresponse)

---

### `GET` `/result-settings/{resultSettingId}`
_getById_  

**Path parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `resultSettingId` | integer(int64) | ✓ |  |

**Responses**

- `200` — OK (`*/*`) → [`ResultSettingResponseDto`](#schema-resultsettingresponsedto)

---

### `PUT` `/result-settings/{resultSettingId}`
_update_  

**Path parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `resultSettingId` | integer(int64) | ✓ |  |

**Request body** (required) — `application/json`

Schema: [`UpdateResultSettingDto`](#schema-updateresultsettingdto) — full fields in appendix.

**Responses**

- `200` — OK (`*/*`) → [`ResultSettingResponseDto`](#schema-resultsettingresponsedto)

---

## role-controller

### `GET` `/role`
_getRoles_  

**Query parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `search` | string |  |  |

**Responses**

- `200` — OK (`*/*`) → [`GetRoleListResponseDto`](#schema-getrolelistresponsedto)[]

---

### `POST` `/role`
_createRole_  

**Request body** (required) — `application/json`

Schema: [`RoleCreateDto`](#schema-rolecreatedto) — full fields in appendix.

**Responses**

- `200` — OK (`*/*`) → object

---

### `PUT` `/role`
_updateRole_  

**Request body** (required) — `application/json`

Schema: [`RoleUpdateDto`](#schema-roleupdatedto) — full fields in appendix.

**Responses**

- `200` — OK (`*/*`) → object

---

### `GET` `/role/{roleId}`
_getRole_1_  

**Path parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `roleId` | integer(int64) | ✓ |  |

**Responses**

- `200` — OK (`*/*`) → object

---

### `DELETE` `/role/{roleId}`
_deleteRole_  

**Path parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `roleId` | integer(int64) | ✓ |  |

**Responses**

- `200` — OK (`*/*`) → object

---

## school-controller

### `GET` `/schools`
_getAllSchools_  

**Responses**

- `200` — OK (`*/*`) → object

---

### `POST` `/schools`
_onboarding_  

**Request body** (required) — `application/json`

Schema: [`OnboardingDto`](#schema-onboardingdto) — full fields in appendix.

**Responses**

- `200` — OK (`*/*`) → object

---

### `PUT` `/schools`
_updateSchool_  

**Request body** (required) — `application/json`

Schema: [`SchoolUpdateDto`](#schema-schoolupdatedto) — full fields in appendix.

**Responses**

- `200` — OK (`*/*`) → object

---

### `GET` `/schools/details`
_getDetails_  

**Responses**

- `200` — OK (`*/*`) → [`SchoolDetailsResponse`](#schema-schooldetailsresponse)

---

### `PATCH` `/schools/domain`
_updateSchoolDomain_  

**Request body** (required) — `application/json`

Schema: [`UpdateSchoolDomainDto`](#schema-updateschooldomaindto) — full fields in appendix.

**Responses**

- `200` — OK (`*/*`) → object

---

### `GET` `/schools/onboarding/progress`
_getOnboardingProgress_  

**Responses**

- `200` — OK (`*/*`) → [`OnboardingProgressResponse`](#schema-onboardingprogressresponse)

---

### `GET` `/schools/student-population-ranges`
_getPopulationRanges_  

**Responses**

- `200` — OK (`*/*`) → [`StudentPopulationRangeOptionDto`](#schema-studentpopulationrangeoptiondto)[]

---

## security-settings-controller

### `GET` `/security-settings`
_getSecurityOverview_  

**Responses**

- `200` — OK (`*/*`) → [`SecurityOverviewDto`](#schema-securityoverviewdto)

---

### `PUT` `/security-settings/change-password`
_changePassword_  

**Request body** (required) — `application/json`

Schema: [`ChangePasswordRequestDto`](#schema-changepasswordrequestdto) — full fields in appendix.

**Responses**

- `200` — OK (`*/*`) → string

---

### `POST` `/security-settings/logout-all`
_logoutAllSessions_  

**Responses**

- `200` — OK (`*/*`) → string

---

## stock-category-controller

### `GET` `/stock/category`
_getAllStocks_  

**Query parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `page` | integer(int32) |  |  |
| `size` | integer(int32) |  |  |

**Responses**

- `200` — OK (`*/*`) → object

---

### `POST` `/stock/category`
_createStockCategory_  

**Request body** (required) — `application/json`

Schema: [`CreateStockCategoryDto`](#schema-createstockcategorydto) — full fields in appendix.

**Responses**

- `200` — OK (`*/*`) → object

---

### `PUT` `/stock/category`
_editStockCategory_  

**Request body** (required) — `application/json`

Schema: [`EditStockCategoryDto`](#schema-editstockcategorydto) — full fields in appendix.

**Responses**

- `200` — OK (`*/*`) → object

---

### `GET` `/stock/category/search/name/{name}`
_getStockCategoryByName_  

**Path parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `name` | string | ✓ |  |

**Responses**

- `200` — OK (`*/*`) → object

---

### `DELETE` `/stock/category/{stockCategoryId}`
_deleteStockCategory_  

**Path parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `stockCategoryId` | integer(int64) | ✓ |  |

**Responses**

- `200` — OK (`*/*`) → object

---

## stock-controller

### `POST` `/stocks`
_createStock_  

**Request body** (required) — `application/json`

Schema: [`CreateStockDto`](#schema-createstockdto) — full fields in appendix.

**Responses**

- `200` — OK (`*/*`) → object

---

### `PUT` `/stocks`
_editStock_  

**Request body** (required) — `application/json`

Schema: [`EditStockDto`](#schema-editstockdto) — full fields in appendix.

**Responses**

- `200` — OK (`*/*`) → object

---

### `PUT` `/stocks/adjust/quantity`
_adjustStockQuantity_  

**Request body** (required) — `application/json`

Schema: [`AdjustQuantityDto`](#schema-adjustquantitydto) — full fields in appendix.

**Responses**

- `200` — OK (`*/*`) → object

---

### `GET` `/stocks/branch/{branchId}`
_getAllStocks_1_  

**Path parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `branchId` | integer(int64) | ✓ |  |

**Query parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `page` | integer(int32) |  |  |
| `size` | integer(int32) |  |  |

**Responses**

- `200` — OK (`*/*`) → object

---

### `GET` `/stocks/category/{category}`
_getStockByCategory_  

**Path parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `category` | [`StockCategory`](#schema-stockcategory) | ✓ |  |

**Responses**

- `200` — OK (`*/*`) → object

---

### `GET` `/stocks/search/name/{name}`
_getStockByName_  

**Path parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `name` | string | ✓ |  |

**Responses**

- `200` — OK (`*/*`) → object

---

### `GET` `/stocks/status/{status}`
_getStockByStatus_  

**Path parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `status` | enum(IN_STOCK \| OUT_OF_STOCK \| LOW_STOCK) | ✓ |  |

**Responses**

- `200` — OK (`*/*`) → object

---

### `GET` `/stocks/{id}`
_getStockById_  

**Path parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `id` | integer(int64) | ✓ |  |

**Responses**

- `200` — OK (`*/*`) → object

---

### `DELETE` `/stocks/{stockId}`
_deleteStock_  

**Path parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `stockId` | integer(int64) | ✓ |  |

**Responses**

- `200` — OK (`*/*`) → object

---

## stock-settings-controller

### `GET` `/stock-settings`
_getStockSettings_  

**Query parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `branchId` | integer(int64) |  |  |

**Responses**

- `200` — OK (`*/*`) → [`StockSettingsResponseDto`](#schema-stocksettingsresponsedto)

---

### `PUT` `/stock-settings`
_updateStockSettings_  

**Query parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `branchId` | integer(int64) |  |  |

**Request body** (required) — `application/json`

Schema: [`StockSettingsRequestDto`](#schema-stocksettingsrequestdto) — full fields in appendix.

**Responses**

- `200` — OK (`*/*`) → [`StockSettingsResponseDto`](#schema-stocksettingsresponsedto)

---

## stock-transaction-controller

### `GET` `/stockTransaction/{stockId}`
_getAllStocks_2_  

**Path parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `stockId` | integer(int64) | ✓ |  |

**Query parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `page` | integer(int32) |  |  |
| `size` | integer(int32) |  |  |

**Responses**

- `200` — OK (`*/*`) → object

---

## stock-unit-controller

### `GET` `/stock/unit`
_getAllStockUnits_  

**Query parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `page` | integer(int32) |  |  |
| `size` | integer(int32) |  |  |

**Responses**

- `200` — OK (`*/*`) → object

---

### `POST` `/stock/unit`
_createStockUnit_  

**Request body** (required) — `application/json`

Schema: [`CreateStockUnitDto`](#schema-createstockunitdto) — full fields in appendix.

**Responses**

- `200` — OK (`*/*`) → object

---

### `PUT` `/stock/unit`
_editStockUnit_  

**Request body** (required) — `application/json`

Schema: [`EditStockUnitDto`](#schema-editstockunitdto) — full fields in appendix.

**Responses**

- `200` — OK (`*/*`) → object

---

### `DELETE` `/stock/unit/delete/{stockUnitId}`
_deleteStockUnit_  

**Path parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `stockUnitId` | integer(int64) | ✓ |  |

**Responses**

- `200` — OK (`*/*`) → object

---

### `GET` `/stock/unit/size`
_getAllStockUnitsSize_  

**Query parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `page` | integer(int32) |  |  |
| `size` | integer(int32) |  |  |

**Responses**

- `200` — OK (`*/*`) → object

---

## student-cbt-controller

### `GET` `/cbt/student/assessments/{assessmentId}/preview`
_getAssessmentPreview_  

**Path parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `assessmentId` | integer(int64) | ✓ |  |

**Responses**

- `200` — OK (`*/*`) → [`AssessmentPreviewDTO`](#schema-assessmentpreviewdto)

---

### `GET` `/cbt/student/dashboard`
_getDashboard_  

**Responses**

- `200` — OK (`*/*`) → [`StudentDashboardDTO`](#schema-studentdashboarddto)

---

### `GET` `/cbt/student/results/{studentAssessmentId}`
_getMyResult_  

**Path parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `studentAssessmentId` | integer(int64) | ✓ |  |

**Responses**

- `200` — OK (`*/*`) → [`StudentResultDTO`](#schema-studentresultdto)

---

## student-controller

### `POST` `/students`
_createStudent_  

**Request body** (required) — `application/json`

Schema: [`CreateStudentDto`](#schema-createstudentdto) — full fields in appendix.

**Responses**

- `200` — OK (`*/*`) → [`StudentResponseDto`](#schema-studentresponsedto)

---

### `PUT` `/students`
_updateStudent_  

**Request body** (required) — `application/json`

Schema: [`UpdateStudentDto`](#schema-updatestudentdto) — full fields in appendix.

**Responses**

- `200` — OK (`*/*`) → object

---

### `GET` `/students/all/{branchId}`
_getAllStudents_  

**Path parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `branchId` | integer(int64) | ✓ |  |

**Query parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `page` | integer(int32) |  |  |
| `size` | integer(int32) |  |  |
| `classId` | integer(int64) |  |  |
| `departmentId` | integer(int64) |  |  |
| `armId` | integer(int64) |  |  |
| `status` | enum(GRADUATED \| ACTIVE \| SUSPENDED \| WITHDRAWN \| INACTIVE \| TOTAL) |  |  |

**Responses**

- `200` — OK (`*/*`) → [`PageStudent`](#schema-pagestudent)

---

### `GET` `/students/arm/{id}`
_getStudentsByArmId_1_  

**Path parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `id` | integer(int64) | ✓ |  |

**Query parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `pageable` | [`Pageable`](#schema-pageable) | ✓ |  |

**Responses**

- `200` — OK (`*/*`) → object

---

### `GET` `/students/export`
_exportStudents_  

**Query parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `branchId` | integer(int64) |  |  |
| `classId` | integer(int64) |  |  |
| `armId` | integer(int64) |  |  |
| `status` | enum(GRADUATED \| ACTIVE \| SUSPENDED \| WITHDRAWN \| INACTIVE \| TOTAL) |  |  |

**Responses**

- `200` — OK (`*/*`) → string(binary)

---

### `GET` `/students/parent/search/{emailOrLastname}`
_getStudentsByArmId_  

**Path parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `emailOrLastname` | string | ✓ |  |

**Responses**

- `200` — OK (`*/*`) → object

---

### `GET` `/students/school`
_getAllSchoolStudents_  

**Query parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `page` | integer(int32) |  |  |
| `size` | integer(int32) |  |  |
| `classId` | integer(int64) |  |  |
| `departmentId` | integer(int64) |  |  |
| `armId` | integer(int64) |  |  |
| `branchId` | integer(int64) |  |  |
| `status` | enum(GRADUATED \| ACTIVE \| SUSPENDED \| WITHDRAWN \| INACTIVE \| TOTAL) |  |  |
| `search` | string |  |  |

**Responses**

- `200` — OK (`*/*`) → [`PageStudentResponseDto`](#schema-pagestudentresponsedto)

---

### `GET` `/students/status/distribution`
_getStatusDistribution_  

**Query parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `classId` | integer(int64) |  |  |
| `departmentId` | integer(int64) |  |  |
| `armId` | integer(int64) |  |  |
| `branchId` | integer(int64) |  |  |

**Responses**

- `200` — OK (`*/*`) → [`StudentStatusCount`](#schema-studentstatuscount)[]

---

### `POST` `/students/upload`
_upload_  

**Query parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `branchId` | integer(int64) |  |  |

**Request body** (optional) — `application/json`

| Field | Type | Required | Notes |
|---|---|---|---|
| `file` | string(binary) | ✓ |  |

**Responses**

- `200` — OK (`*/*`) → object

---

### `POST` `/students/upload/{branchId}`
_uploadWithBranch_  

**Path parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `branchId` | integer(int64) | ✓ |  |

**Request body** (optional) — `application/json`

| Field | Type | Required | Notes |
|---|---|---|---|
| `file` | string(binary) | ✓ |  |

**Responses**

- `200` — OK (`*/*`) → object

---

### `PUT` `/students/withdraw/{studentIds}`
_withdrawStudent_  

**Path parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `studentIds` | integer(int64)[] | ✓ |  |

**Responses**

- `200` — OK (`*/*`) → object

---

### `GET` `/students/{id}`
_getStudentById_  

**Path parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `id` | integer(int64) | ✓ |  |

**Responses**

- `200` — OK (`*/*`) → object

---

### `DELETE` `/students/{studentIds}`
_deleteParent_  

**Path parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `studentIds` | integer(int64)[] | ✓ |  |

**Responses**

- `200` — OK (`*/*`) → object

---

## student-promotion-controller

### `POST` `/student-promotion/execute`
_executePromotions_  

**Query parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `sessionId` | integer(int64) | ✓ |  |

**Responses**

- `200` — OK (`*/*`) → object

---

### `POST` `/student-promotion/submit`
_submitPromotion_  

**Request body** (required) — `application/json`

Schema: [`SubmitClassPromotionReportDto`](#schema-submitclasspromotionreportdto) — full fields in appendix.

**Responses**

- `200` — OK (`*/*`) → object

---

## student-report-card-controller

### `GET` `/report-card/student/{studentId}/arm/{armId}`
_getReportCard_  

**Path parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `studentId` | integer(int64) | ✓ |  |
| `armId` | integer(int64) | ✓ |  |

**Query parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `termId` | integer(int64) |  |  |

**Responses**

- `200` — OK (`*/*`) → [`StudentReportCardResponse`](#schema-studentreportcardresponse)

---

## subject-controller

### `GET` `/subjects`
_getAllBySchoolId_  

**Responses**

- `200` — OK (`*/*`) → [`Subject`](#schema-subject)[]

---

### `POST` `/subjects`
_createSubject_  

**Request body** (required) — `application/json`

Schema: [`CreateSubjectDto`](#schema-createsubjectdto) — full fields in appendix.

**Responses**

- `200` — OK (`*/*`) → [`Subject`](#schema-subject)

---

### `GET` `/subjects/class`
_getByClass_  

**Query parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `className` | string | ✓ |  |
| `levelType` | enum(CRECHE \| KINDERGARTEN \| NURSERY \| PRIMARY \| JUNIOR_SECONDARY \| SENIOR_SECONDARY) | ✓ |  |
| `branchId` | integer(int64) |  |  |

**Responses**

- `200` — OK (`*/*`) → object

---

### `POST` `/subjects/class`
_createByClass_  

**Request body** (required) — `application/json`

Schema: [`CreateSubjectByClassDto`](#schema-createsubjectbyclassdto) — full fields in appendix.

**Responses**

- `200` — OK (`*/*`) → [`Subject`](#schema-subject)[]

---

### `PUT` `/subjects/class`
_updateByClass_  

**Request body** (required) — `application/json`

Schema: [`UpdateSubjectByClassDto`](#schema-updatesubjectbyclassdto) — full fields in appendix.

**Responses**

- `200` — OK (`*/*`) → [`Subject`](#schema-subject)

---

### `DELETE` `/subjects/class`
_deleteByClass_  

**Query parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `subjectId` | integer(int64) | ✓ |  |
| `classId` | integer(int64) | ✓ |  |

**Responses**

- `200` — OK (`*/*`) → object

---

### `GET` `/subjects/class-arms`
_getClassArmSubjects_  

**Query parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `branchId` | integer(int64) | ✓ |  |
| `page` | integer(int32) |  |  |
| `size` | integer(int32) |  |  |

**Responses**

- `200` — OK (`*/*`) → [`PageGetClassArmSubjectResponseDto`](#schema-pagegetclassarmsubjectresponsedto)

---

### `GET` `/subjects/class/{classId}`
_getByClassId_  

**Path parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `classId` | integer(int64) | ✓ |  |

**Responses**

- `200` — OK (`*/*`) → [`Subject`](#schema-subject)[]

---

### `GET` `/subjects/level`
_getByLevel_  

**Query parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `levelType` | enum(CRECHE \| KINDERGARTEN \| NURSERY \| PRIMARY \| JUNIOR_SECONDARY \| SENIOR_SECONDARY) | ✓ |  |
| `branchId` | integer(int64) |  |  |

**Responses**

- `200` — OK (`*/*`) → object

---

### `POST` `/subjects/level`
_createByLevel_  

**Request body** (required) — `application/json`

Schema: [`CreateSubjectByLevelDto`](#schema-createsubjectbyleveldto) — full fields in appendix.

**Responses**

- `200` — OK (`*/*`) → [`Subject`](#schema-subject)[]

---

### `PUT` `/subjects/level`
_updateByLevel_  

**Request body** (required) — `application/json`

Schema: [`UpdateSubjectByLevelDto`](#schema-updatesubjectbyleveldto) — full fields in appendix.

**Responses**

- `200` — OK (`*/*`) → [`Subject`](#schema-subject)

---

### `DELETE` `/subjects/level`
_deleteByLevel_  

**Query parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `subjectId` | integer(int64) | ✓ |  |
| `levelId` | integer(int64) | ✓ |  |

**Responses**

- `200` — OK (`*/*`) → object

---

### `DELETE` `/subjects/{id}`
_deleteById_  

**Path parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `id` | integer(int64) | ✓ |  |

**Responses**

- `200` — OK (`*/*`) → object

---

## subject-report-controller

### `GET` `/report/subject/arm/{armId}`
_getSubjectReportByClassArm_  

**Path parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `armId` | integer(int64) | ✓ |  |

**Query parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `page` | integer(int32) |  |  |
| `size` | integer(int32) |  |  |
| `termId` | integer(int64) |  |  |

**Responses**

- `200` — OK (`*/*`) → [`GetArmSubjectReportResponseDto`](#schema-getarmsubjectreportresponsedto)

---

### `POST` `/report/subject/students`
_createStudentSubjectReport_  

**Request body** (required) — `application/json`

Schema: [`CreateSubjectReportDto`](#schema-createsubjectreportdto) — full fields in appendix.

**Responses**

- `200` — OK (`*/*`) → [`SubjectReport`](#schema-subjectreport)

---

### `POST` `/report/subject/submit`
_submitSubjectReport_  

**Request body** (required) — `application/json`

Schema: [`SubmitSubjectReportDto`](#schema-submitsubjectreportdto) — full fields in appendix.

**Responses**

- `200` — OK (`*/*`) → object

---

### `GET` `/report/subject/{subjectId}/arm/{armId}`
_getStudentSubjectReportByClassArm_  

**Path parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `armId` | integer(int64) | ✓ |  |
| `subjectId` | integer(int64) | ✓ |  |

**Query parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `page` | integer(int32) |  |  |
| `size` | integer(int32) |  |  |
| `termId` | integer(int64) |  |  |

**Responses**

- `200` — OK (`*/*`) → [`StudentSubjectReportResponse`](#schema-studentsubjectreportresponse)

---

## subject-teacher-controller

### `POST` `/teacher/subject`
_assignSubjectTeacher_  

**Request body** (required) — `application/json`

Schema: [`AssignSubjectTeacherDto`](#schema-assignsubjectteacherdto) — full fields in appendix.

**Responses**

- `200` — OK (`*/*`) → object

---

### `PUT` `/teacher/subject`
_reassignSubjectTeacher_  

**Request body** (required) — `application/json`

Schema: [`AssignSubjectTeacherDto`](#schema-assignsubjectteacherdto) — full fields in appendix.

**Responses**

- `200` — OK (`*/*`) → object

---

### `GET` `/teacher/subject/my`
_getMySubjects_  

**Responses**

- `200` — OK (`*/*`) → [`GetTeacherSubjectsDto`](#schema-getteachersubjectsdto)[]

---

## subscription-controller

### `GET` `/subscriptions`
_getCurrentSubscription_  

**Responses**

- `200` — OK (`*/*`) → [`SubscriptionOverviewDto`](#schema-subscriptionoverviewdto)

---

### `POST` `/subscriptions`
_createSubscription_  

**Request body** (required) — `application/json`

Schema: [`CreateSubscriptionDto`](#schema-createsubscriptiondto) — full fields in appendix.

**Responses**

- `200` — OK (`*/*`) → [`Subscription`](#schema-subscription)

---

### `GET` `/subscriptions/active`
_getActiveSubscription_  

**Responses**

- `200` — OK (`*/*`) → [`SubscriptionOverviewDto`](#schema-subscriptionoverviewdto)

---

### `GET` `/subscriptions/billing`
_getBillingHistory_  

**Query parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `pageable` | [`Pageable`](#schema-pageable) | ✓ |  |

**Responses**

- `200` — OK (`*/*`) → [`PageBillingHistoryDto`](#schema-pagebillinghistorydto)

---

### `POST` `/subscriptions/checkout`
_checkoutSubscription_  

**Request body** (required) — `application/json`

Schema: [`CheckoutSubscriptionDto`](#schema-checkoutsubscriptiondto) — full fields in appendix.

**Responses**

- `200` — OK (`*/*`) → [`CheckoutResponseDto`](#schema-checkoutresponsedto)

---

### `GET` `/subscriptions/plans`
_getPlans_  

**Responses**

- `200` — OK (`*/*`) → [`PlanResponseDto`](#schema-planresponsedto)[]

---

### `GET` `/subscriptions/verify`
_verifyPayment_  

**Query parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `reference` | string | ✓ |  |

**Responses**

- `200` — OK (`*/*`) → [`SubscriptionOverviewDto`](#schema-subscriptionoverviewdto)

---

### `PATCH` `/subscriptions/{id}`
_updateSubscription_  

**Path parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `id` | integer(int64) | ✓ |  |

**Request body** (required) — `application/json`

Schema: [`UpdateSubscriptionDto`](#schema-updatesubscriptiondto) — full fields in appendix.

**Responses**

- `200` — OK (`*/*`) → [`SubscriptionOverviewDto`](#schema-subscriptionoverviewdto)

---

### `POST` `/subscriptions/{id}/cancel`
_cancelSubscription_  

**Path parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `id` | integer(int64) | ✓ |  |

**Responses**

- `200` — OK (`*/*`) → map<string, string>

---

### `POST` `/subscriptions/{id}/renew`
_renewSubscription_  

**Path parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `id` | integer(int64) | ✓ |  |

**Query parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `callbackUrl` | string |  |  |

**Responses**

- `200` — OK (`*/*`) → [`CheckoutResponseDto`](#schema-checkoutresponsedto)

---

## teacher-input-controller

### `POST` `/teacher-input`
_createOrUpdate_  

**Request body** (required) — `application/json`

Schema: [`TeacherInputRequest`](#schema-teacherinputrequest) — full fields in appendix.

**Responses**

- `200` — OK (`*/*`) → [`TeacherInputResponse`](#schema-teacherinputresponse)

---

### `GET` `/teacher-input/arm/{armId}`
_getForArm_  

**Path parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `armId` | integer(int64) | ✓ |  |

**Responses**

- `200` — OK (`*/*`) → [`TeacherInputResponse`](#schema-teacherinputresponse)[]

---

### `GET` `/teacher-input/branch/{branchId}/student/{studentId}/arm/{armId}`
_getForStudent_  

**Path parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `studentId` | integer(int64) | ✓ |  |
| `armId` | integer(int64) | ✓ |  |
| `branchId` | integer(int64) | ✓ |  |

**Responses**

- `200` — OK (`*/*`) → [`TeacherInputResponse`](#schema-teacherinputresponse)

---

## user-controller

### `GET` `/users`
_getAllUsers_  

**Query parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `page` | integer(int32) |  |  |
| `size` | integer(int32) |  |  |

**Responses**

- `200` — OK (`*/*`) → object

---

### `PUT` `/users`
_updateUser_  

**Request body** (required) — `application/json`

Schema: [`UserUpdateDto`](#schema-userupdatedto) — full fields in appendix.

**Responses**

- `200` — OK (`*/*`) → object

---

### `POST` `/users/change-password`
_changePassword_1_  

**Query parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `dto` | [`ChangePasswordDto`](#schema-changepassworddto) | ✓ |  |

**Responses**

- `200` — OK (`*/*`) → object

---

### `POST` `/users/change-password-otp`
_requestChangePasswordOtp_  

**Responses**

- `200` — OK (`*/*`) → object

---

### `GET` `/users/email/lookup/{email}`
_emailLookUp_  

**Path parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `email` | string | ✓ |  |

**Responses**

- `200` — OK (`*/*`) → object

---

### `GET` `/users/profile`
_getUser_  

**Responses**

- `200` — OK (`*/*`) → [`UserDetailsResponse`](#schema-userdetailsresponse)

---

### `POST` `/users/verify-change-password-otp`
_verifyChangePasswordOtp_  

**Query parameters**

| Name | Type | Required | Notes |
|---|---|---|---|
| `dto` | [`VerifyChangePasswordOtpDto`](#schema-verifychangepasswordotpdto) | ✓ |  |

**Responses**

- `200` — OK (`*/*`) → object

---

## Schemas appendix

All 322 component schemas, fully expanded. Every field — required and non-required — is listed. Fields shown as `OneOf<...>` mean the API accepts any one of the listed variants; click through to see each variant's shape.

### `AcademicSession` <a id="schema-academicsession"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | integer(int64) |  |  |
| `uuid` | string(uuid) |  |  |
| `active` | boolean |  |  |
| `version` | integer(int64) |  |  |
| `createdAt` | string(date-time) |  |  |
| `updatedAt` | string(date-time) |  |  |
| `name` | string |  |  |
| `isActive` | boolean |  |  |
| `schoolId` | integer(int64) |  |  |

---

### `AccountDetails` <a id="schema-accountdetails"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `accountNumber` | string | ✓ |  |
| `bankCode` | string | ✓ |  |

---

### `ActiveSessionResponseDto` <a id="schema-activesessionresponsedto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `sessionId` | integer(int64) |  |  |
| `deviceName` | string |  |  |
| `browser` | string |  |  |
| `ipAddress` | string |  |  |
| `lastActiveAt` | string(date-time) |  |  |

---

### `AdjustQuantityDto` <a id="schema-adjustquantitydto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `stockId` | integer(int64) | ✓ |  |
| `quantityAdjustment` | integer(int32) |  |  |
| `reason` | enum(RESTOCK \| DONATION \| RETURNED \| CORRECTION_OF_PREVIOUS_ERROR \| TRANSFER_FROM_ANOTHER_BRANCH \| RECOVERED_ITEMS) |  | enum: `RESTOCK`, `DONATION`, `RETURNED`, `CORRECTION_OF_PREVIOUS_ERROR`, `TRANSFER_FROM_ANOTHER_BRANCH`, `RECOVERED_ITEMS` |

---

### `AdmissionNumberSetting` <a id="schema-admissionnumbersetting"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | integer(int64) |  |  |
| `uuid` | string(uuid) |  |  |
| `active` | boolean |  |  |
| `version` | integer(int64) |  |  |
| `createdAt` | string(date-time) |  |  |
| `updatedAt` | string(date-time) |  |  |
| `prefix` | string |  |  |
| `numberFormat` | string |  |  |
| `startingNumber` | integer(int32) |  |  |
| `padding` | integer(int32) |  |  |
| `schoolId` | integer(int64) |  |  |

---

### `AllTerms` <a id="schema-allterms"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `termId` | integer(int64) |  |  |
| `term` | enum(FIRST \| SECOND \| THIRD) |  | enum: `FIRST`, `SECOND`, `THIRD` |
| `startDate` | string(date) |  |  |
| `endDate` | string(date) |  |  |
| `isActiveTerm` | boolean |  |  |

---

### `ApproveAllRequestDto` <a id="schema-approveallrequestdto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `editAccessIds` | integer(int64)[] |  |  |
| `isApproved` | boolean |  |  |

---

### `ApproveEditRequestDto` <a id="schema-approveeditrequestdto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `editAccessId` | integer(int64) |  |  |
| `isApproved` | boolean |  |  |

---

### `Arm` <a id="schema-arm"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | integer(int64) |  |  |
| `uuid` | string(uuid) |  |  |
| `active` | boolean |  |  |
| `version` | integer(int64) |  |  |
| `createdAt` | string(date-time) |  |  |
| `updatedAt` | string(date-time) |  |  |
| `name` | string |  |  |
| `classId` | integer(int64) |  |  |
| `levelId` | integer(int64) |  |  |
| `departmentId` | integer(int64) |  |  |
| `branchId` | integer(int64) |  |  |
| `schoolId` | integer(int64) |  |  |

---

### `ArmDTO` <a id="schema-armdto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `armId` | integer(int64) |  |  |
| `armName` | string |  |  |
| `classTeacherName` | string |  |  |

---

### `ArmDto` <a id="schema-armdto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `armId` | integer(int64) | ✓ |  |

---

### `ArmFeeOverview` <a id="schema-armfeeoverview"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `armId` | integer(int64) |  |  |
| `armName` | string |  |  |
| `feeItems` | [`FeeItemDetail`](#schema-feeitemdetail)[] |  |  |
| `totalAmount` | number |  |  |

---

### `ArmInfo` <a id="schema-arminfo"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `armId` | integer(int64) |  |  |
| `armName` | string |  |  |
| `classId` | integer(int64) |  |  |
| `className` | string |  |  |

---

### `ArmListProjectionDto` <a id="schema-armlistprojectiondto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `name` | string |  |  |
| `id` | integer(int64) |  |  |

---

### `ArmLookupDto` <a id="schema-armlookupdto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | integer(int64) |  |  |
| `name` | string |  |  |
| `classId` | integer(int64) |  |  |

---

### `ArmWithClassNameDto` <a id="schema-armwithclassnamedto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `armId` | integer(int64) |  |  |
| `armName` | string |  |  |
| `className` | string |  |  |
| `fullName` | string |  |  |
| `classId` | integer(int64) |  |  |
| `levelId` | integer(int64) |  |  |
| `branchId` | integer(int64) |  |  |
| `schoolId` | integer(int64) |  |  |

---

### `Assessment2` <a id="schema-assessment2"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | integer(int64) |  |  |
| `uuid` | string(uuid) |  |  |
| `active` | boolean |  |  |
| `version` | integer(int64) |  |  |
| `createdAt` | string(date-time) |  |  |
| `updatedAt` | string(date-time) |  |  |
| `name` | string |  |  |
| `classId` | integer(int64) |  |  |
| `subjectId` | integer(int64) |  |  |
| `branchId` | integer(int64) |  |  |
| `schoolId` | integer(int64) |  |  |
| `term` | enum(FIRST \| SECOND \| THIRD) |  | enum: `FIRST`, `SECOND`, `THIRD` |
| `testType` | enum(CONTINUOUS_ASSESSMENT \| EXAMINATION \| MOCK_EXAM \| PRACTICE_TEST) |  | enum: `CONTINUOUS_ASSESSMENT`, `EXAMINATION`, `MOCK_EXAM`, `PRACTICE_TEST` |
| `assessmentMapping` | enum(NONE_MANUAL_SCORING \| CONTINUOUS_ASSESSMENT_1_20_PERCENT \| CONTINUOUS_ASSESSMENT_2_20_PERCENT \| EXAMINATION_60_PERCENT \| CUSTOM) |  | enum: `NONE_MANUAL_SCORING`, `CONTINUOUS_ASSESSMENT_1_20_PERCENT`, `CONTINUOUS_ASSESSMENT_2_20_PERCENT`, `EXAMINATION_60_PERCENT`, `CUSTOM` |
| `durationMinutes` | integer(int32) |  |  |
| `totalMarks` | integer(int32) |  |  |
| `passingMarks` | integer(int32) |  |  |
| `status` | enum(DRAFT \| PUBLISHED \| ONGOING \| COMPLETED \| ARCHIVED) |  | enum: `DRAFT`, `PUBLISHED`, `ONGOING`, `COMPLETED`, `ARCHIVED` |
| `startDateTime` | string(date-time) |  |  |
| `endDateTime` | string(date-time) |  |  |
| `instructions` | string |  |  |
| `shuffleQuestions` | boolean |  |  |
| `shuffleOptions` | boolean |  |  |
| `showResultsImmediately` | boolean |  |  |
| `allowReview` | boolean |  |  |
| `createdBy` | integer(int64) |  |  |

---

### `AssessmentDTO` <a id="schema-assessmentdto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | integer(int64) |  |  |
| `name` | string | ✓ |  |
| `classId` | integer(int64) | ✓ |  |
| `subjectId` | integer(int64) | ✓ |  |
| `branchId` | integer(int64) | ✓ |  |
| `term` | enum(FIRST \| SECOND \| THIRD) | ✓ | enum: `FIRST`, `SECOND`, `THIRD` |
| `testType` | enum(CONTINUOUS_ASSESSMENT \| EXAMINATION \| MOCK_EXAM \| PRACTICE_TEST) | ✓ | enum: `CONTINUOUS_ASSESSMENT`, `EXAMINATION`, `MOCK_EXAM`, `PRACTICE_TEST` |
| `assessmentMapping` | enum(NONE_MANUAL_SCORING \| CONTINUOUS_ASSESSMENT_1_20_PERCENT \| CONTINUOUS_ASSESSMENT_2_20_PERCENT \| EXAMINATION_60_PERCENT \| CUSTOM) |  | enum: `NONE_MANUAL_SCORING`, `CONTINUOUS_ASSESSMENT_1_20_PERCENT`, `CONTINUOUS_ASSESSMENT_2_20_PERCENT`, `EXAMINATION_60_PERCENT`, `CUSTOM` |
| `durationMinutes` | integer(int32) |  | min: 1 |
| `totalMarks` | integer(int32) |  |  |
| `passingMarks` | integer(int32) |  |  |
| `startDateTime` | string(date-time) |  |  |
| `endDateTime` | string(date-time) |  |  |
| `instructions` | string |  |  |
| `shuffleQuestions` | boolean |  |  |
| `shuffleOptions` | boolean |  |  |
| `showResultsImmediately` | boolean |  |  |
| `allowReview` | boolean |  |  |
| `createdBy` | integer(int64) |  |  |
| `sections` | [`AssessmentSectionDTO`](#schema-assessmentsectiondto)[] |  |  |

---

### `AssessmentListDTO` <a id="schema-assessmentlistdto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | integer(int64) |  |  |
| `name` | string |  |  |
| `classId` | integer(int64) |  |  |
| `subjectId` | integer(int64) |  |  |
| `testType` | enum(CONTINUOUS_ASSESSMENT \| EXAMINATION \| MOCK_EXAM \| PRACTICE_TEST) |  | enum: `CONTINUOUS_ASSESSMENT`, `EXAMINATION`, `MOCK_EXAM`, `PRACTICE_TEST` |
| `term` | enum(FIRST \| SECOND \| THIRD) |  | enum: `FIRST`, `SECOND`, `THIRD` |
| `status` | enum(DRAFT \| PUBLISHED \| ONGOING \| COMPLETED \| ARCHIVED) |  | enum: `DRAFT`, `PUBLISHED`, `ONGOING`, `COMPLETED`, `ARCHIVED` |
| `durationMinutes` | integer(int32) |  |  |
| `totalMarks` | integer(int32) |  |  |
| `startDateTime` | string(date-time) |  |  |
| `endDateTime` | string(date-time) |  |  |
| `questionCount` | integer(int32) |  |  |

---

### `AssessmentListResponseDto` <a id="schema-assessmentlistresponsedto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `assessments` | [`AssessmentResponseDto`](#schema-assessmentresponsedto)[] |  |  |
| `totalWeight` | number(double) |  |  |

---

### `AssessmentPreviewDTO` <a id="schema-assessmentpreviewdto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `assessmentId` | integer(int64) |  |  |
| `name` | string |  |  |
| `className` | string |  |  |
| `subjectName` | string |  |  |
| `branchName` | string |  |  |
| `testType` | enum(CONTINUOUS_ASSESSMENT \| EXAMINATION \| MOCK_EXAM \| PRACTICE_TEST) |  | enum: `CONTINUOUS_ASSESSMENT`, `EXAMINATION`, `MOCK_EXAM`, `PRACTICE_TEST` |
| `term` | enum(FIRST \| SECOND \| THIRD) |  | enum: `FIRST`, `SECOND`, `THIRD` |
| `durationMinutes` | integer(int32) |  |  |
| `totalMarks` | integer(int32) |  |  |
| `questionCount` | integer(int32) |  |  |
| `instructions` | string |  |  |
| `startDateTime` | string(date-time) |  |  |
| `endDateTime` | string(date-time) |  |  |
| `allowReview` | boolean |  |  |
| `showResultsImmediately` | boolean |  |  |
| `studentAssessmentId` | integer(int64) |  |  |
| `attemptStatus` | enum(NOT_STARTED \| IN_PROGRESS \| PENDING \| COMPLETED \| ABSENT \| TIMED_OUT) |  | enum: `NOT_STARTED`, `IN_PROGRESS`, `PENDING`, `COMPLETED`, `ABSENT`, `TIMED_OUT` |

---

### `AssessmentResponseDto` <a id="schema-assessmentresponsedto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | integer(int64) |  |  |
| `name` | string |  |  |
| `assessmentType` | enum(CONTINUOUS_ASSESSMENT \| EXAM) |  | enum: `CONTINUOUS_ASSESSMENT`, `EXAM` |
| `weight` | number(double) |  |  |

---

### `AssessmentScoreDto` <a id="schema-assessmentscoredto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `assessmentId` | integer(int64) |  |  |
| `assessmentName` | string |  |  |
| `score` | number(double) |  |  |
| `weight` | number(double) |  |  |

---

### `AssessmentSection` <a id="schema-assessmentsection"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | integer(int64) |  |  |
| `uuid` | string(uuid) |  |  |
| `active` | boolean |  |  |
| `version` | integer(int64) |  |  |
| `createdAt` | string(date-time) |  |  |
| `updatedAt` | string(date-time) |  |  |
| `assessmentId` | integer(int64) |  |  |
| `name` | string |  |  |
| `instructions` | string |  |  |
| `sectionOrder` | integer(int32) |  |  |
| `timeLimitMinutes` | integer(int32) |  |  |

---

### `AssessmentSectionDTO` <a id="schema-assessmentsectiondto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | integer(int64) |  |  |
| `name` | string | ✓ |  |
| `instructions` | string |  |  |
| `sectionOrder` | integer(int32) | ✓ |  |
| `timeLimitMinutes` | integer(int32) |  |  |
| `questionIds` | integer(int64)[] |  |  |

---

### `AssessmentSectionResponseDTO` <a id="schema-assessmentsectionresponsedto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | integer(int64) |  |  |
| `assessmentId` | integer(int64) |  |  |
| `name` | string |  |  |
| `instructions` | string |  |  |
| `sectionOrder` | integer(int32) |  |  |
| `timeLimitMinutes` | integer(int32) |  |  |
| `questions` | [`QuestionResponseDTO`](#schema-questionresponsedto)[] |  |  |

---

### `AssessmentStatsDTO` <a id="schema-assessmentstatsdto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `assessmentId` | integer(int64) |  |  |
| `assessmentName` | string |  |  |
| `totalStudents` | integer(int32) |  |  |
| `completedCount` | integer(int32) |  |  |
| `pendingCount` | integer(int32) |  |  |
| `absentCount` | integer(int32) |  |  |
| `averageScore` | number(double) |  |  |
| `highestScore` | number(double) |  |  |
| `lowestScore` | number(double) |  |  |
| `passingPercentage` | number(double) |  |  |

---

### `AssignBranchAdminDto` <a id="schema-assignbranchadmindto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `staffId` | integer(int64) | ✓ |  |
| `branchIds` | integer(int64)[] | ✓ |  |

---

### `AssignClassTeacherDto` <a id="schema-assignclassteacherdto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `armDtos` | [`ArmDto`](#schema-armdto)[] |  |  |
| `teacherId` | integer(int64) | ✓ |  |

---

### `AssignDepartmentArmByClassDto` <a id="schema-assigndepartmentarmbyclassdto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `departmentId` | integer(int64) | ✓ |  |
| `armId` | integer(int64) | ✓ |  |

---

### `AssignDepartmentArmByLevelDto` <a id="schema-assigndepartmentarmbyleveldto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `departmentId` | integer(int64) | ✓ |  |
| `levelId` | integer(int64) | ✓ |  |
| `branchId` | integer(int64) | ✓ |  |

---

### `AssignDepartmentSubjectsDto` <a id="schema-assigndepartmentsubjectsdto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `departmentName` | string | ✓ |  |
| `subjectNames` | string[] | ✓ |  |
| `branchId` | integer(int64) |  |  |
| `branchSpecific` | boolean |  |  |

---

### `AssignSubjectTeacherDto` <a id="schema-assignsubjectteacherdto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `teacherId` | integer(int64) | ✓ |  |
| `subjectArmAndClassDtos` | [`SubjectArmAndClassDto`](#schema-subjectarmandclassdto)[] |  |  |

---

### `Bank` <a id="schema-bank"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `name` | string |  |  |
| `code` | string |  |  |
| `slug` | string |  |  |

---

### `BankAccountInfo` <a id="schema-bankaccountinfo"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | integer(int64) |  |  |
| `accountNumber` | string |  |  |
| `accountName` | string |  |  |
| `bankName` | string |  |  |
| `isDefault` | boolean |  |  |

---

### `BankTransferInfo` <a id="schema-banktransferinfo"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `accountName` | string |  |  |
| `accountNumber` | string |  |  |
| `bankName` | string |  |  |
| `reference` | string |  |  |

---

### `BillingHistoryDto` <a id="schema-billinghistorydto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `periodStart` | string(date) |  |  |
| `periodEnd` | string(date) |  |  |
| `planName` | string |  |  |
| `planType` | enum(YEARLY \| TERMLY) |  | enum: `YEARLY`, `TERMLY` |
| `status` | enum(PENDING \| SUCCESS \| FAILED) |  | enum: `PENDING`, `SUCCESS`, `FAILED` |
| `amount` | number |  |  |

---

### `BlankData` <a id="schema-blankdata"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `blankLabel` | string |  |  |
| `marks` | integer(int32) |  |  |
| `answerType` | string |  |  |
| `correctAnswers` | string[] |  |  |

---

### `Branch` <a id="schema-branch"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | integer(int64) |  |  |
| `uuid` | string(uuid) |  |  |
| `active` | boolean |  |  |
| `version` | integer(int64) |  |  |
| `createdAt` | string(date-time) |  |  |
| `updatedAt` | string(date-time) |  |  |
| `schoolId` | integer(int64) |  |  |
| `name` | string |  |  |
| `address` | string |  |  |
| `phoneNumber` | string |  |  |
| `email` | string |  |  |
| `branchHeadId` | integer(int64) |  |  |
| `country` | string |  |  |

---

### `BranchAccountDto` <a id="schema-branchaccountdto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `branchId` | integer(int64) |  |  |
| `bankName` | string | ✓ |  |
| `bankCode` | string | ✓ |  |
| `accountNumber` | string | ✓ |  |
| `isDefault` | boolean |  |  |

---

### `BranchAccountInfo` <a id="schema-branchaccountinfo"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `branchId` | integer(int64) |  |  |
| `branchName` | string |  |  |
| `account` | [`BankAccountInfo`](#schema-bankaccountinfo) |  |  |

---

### `BranchArmReportResponseDto` <a id="schema-brancharmreportresponsedto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `classArmReportId` | integer(int64) |  |  |
| `classId` | integer(int64) |  |  |
| `armId` | integer(int64) |  |  |
| `classArmName` | string |  |  |
| `classTeacherName` | string |  |  |
| `numberOfSubjects` | integer(int64) |  |  |
| `numberOfSubmittedSubjects` | integer(int64) |  |  |
| `status` | enum(APPROVED \| PENDING_APPROVAL \| NOT_SUBMITTED \| EDIT_REQUEST \| APPROVED_EDIT_REQUEST) |  | enum: `APPROVED`, `PENDING_APPROVAL`, `NOT_SUBMITTED`, `EDIT_REQUEST`, `APPROVED_EDIT_REQUEST` |
| `numberOfEditRequest` | integer(int64) |  |  |

---

### `BranchArmReportStats` <a id="schema-brancharmreportstats"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `totalArms` | integer(int64) |  |  |
| `totalPendingSubmissions` | integer(int64) |  |  |
| `totalCompletedSubmissions` | integer(int64) |  |  |
| `isPublished` | boolean |  |  |
| `branchArmReportResponseDtos` | [`PageBranchArmReportResponseDto`](#schema-pagebrancharmreportresponsedto) |  |  |

---

### `BranchClassLevelNameDto` <a id="schema-branchclasslevelnamedto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `branchId` | integer(int64) |  |  |
| `branchName` | string |  |  |
| `classLevels` | [`ClassLevelNameDto`](#schema-classlevelnamedto)[] |  |  |

---

### `BranchDTO` <a id="schema-branchdto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `branchId` | integer(int64) |  |  |
| `branchName` | string |  |  |
| `classes` | [`ClassRoomDTO`](#schema-classroomdto)[] |  |  |

---

### `BranchFeeGroupOverview` <a id="schema-branchfeegroupoverview"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `branchId` | integer(int64) |  |  |
| `branchName` | string |  |  |
| `feeGroups` | [`FeeGroupSummary`](#schema-feegroupsummary)[] |  |  |

---

### `BranchFeeOverview` <a id="schema-branchfeeoverview"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `branchId` | integer(int64) |  |  |
| `branchName` | string |  |  |
| `totalFees` | number |  |  |
| `totalClassVariations` | integer(int64) |  |  |
| `classes` | [`ClassFeeOverview`](#schema-classfeeoverview)[] |  |  |

---

### `BranchLookupDto` <a id="schema-branchlookupdto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | integer(int64) |  |  |
| `name` | string |  |  |

---

### `BranchReportResponseDto` <a id="schema-branchreportresponsedto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `branchId` | integer(int64) |  |  |
| `branchName` | string |  |  |
| `branchHeadName` | string |  |  |
| `numberOfClassArm` | integer(int64) |  |  |
| `numberOfSubjects` | integer(int64) |  |  |
| `numberOfSubmittedSubjects` | integer(int64) |  |  |
| `numberOfClassTeacherSubmitted` | integer(int64) |  |  |
| `numberOfPendingApprovals` | integer(int64) |  |  |

---

### `CbtArmDetailDTO` <a id="schema-cbtarmdetaildto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `armId` | integer(int64) |  |  |
| `armName` | string |  |  |
| `className` | string |  |  |
| `displayName` | string |  |  |
| `classId` | integer(int64) |  |  |
| `branchId` | integer(int64) |  |  |
| `branchName` | string |  |  |
| `subjects` | [`CbtArmSubjectDTO`](#schema-cbtarmsubjectdto)[] |  |  |

---

### `CbtArmSubjectDTO` <a id="schema-cbtarmsubjectdto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `subjectId` | integer(int64) |  |  |
| `subjectName` | string |  |  |
| `teacherId` | integer(int64) |  |  |
| `teacherName` | string |  |  |
| `questionsInBank` | integer(int64) |  |  |
| `testsCount` | integer(int64) |  |  |

---

### `CbtArmSummaryDTO` <a id="schema-cbtarmsummarydto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `armId` | integer(int64) |  |  |
| `armName` | string |  |  |
| `className` | string |  |  |
| `displayName` | string |  |  |
| `classId` | integer(int64) |  |  |
| `branchId` | integer(int64) |  |  |
| `branchName` | string |  |  |
| `levelId` | integer(int64) |  |  |
| `subjectCount` | integer(int64) |  |  |

---

### `CbtOverviewDTO` <a id="schema-cbtoverviewdto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `totalClasses` | integer(int64) |  |  |
| `totalSubjects` | integer(int64) |  |  |
| `arms` | [`CbtArmSummaryDTO`](#schema-cbtarmsummarydto)[] |  |  |

---

### `ChangePasswordDto` <a id="schema-changepassworddto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `oldPassword` | string | ✓ |  |
| `newPassword` | string | ✓ |  |
| `confirmPassword` | string | ✓ |  |

---

### `ChangePasswordRequestDto` <a id="schema-changepasswordrequestdto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `currentPassword` | string |  | pattern: `^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$` |
| `newPassword` | string |  | pattern: `^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$` |
| `confirmPassword` | string |  | pattern: `^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$` |

---

### `CheckDomainRequest` <a id="schema-checkdomainrequest"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `domain` | string | ✓ |  |
| `tld` | string | ✓ |  |

---

### `CheckoutResponseDto` <a id="schema-checkoutresponsedto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `authorizationUrl` | string |  |  |
| `reference` | string |  |  |
| `subscriptionId` | integer(int64) |  |  |

---

### `CheckoutSubscriptionDto` <a id="schema-checkoutsubscriptiondto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `planId` | integer(int64) | ✓ |  |
| `studentCapacity` | integer(int64) |  |  |
| `callbackUrl` | string |  |  |

---

### `ClassArmAmount` <a id="schema-classarmamount"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `armId` | integer(int64) |  |  |
| `amount` | number |  |  |

---

### `ClassArmAttendanceCard` <a id="schema-classarmattendancecard"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `armId` | integer(int64) |  |  |
| `classArm` | string |  |  |
| `classTeacher` | string |  |  |
| `numberOfStudentInArm` | integer(int64) |  |  |
| `attendancePercentage` | number(double) |  |  |
| `lastUpdated` | string(date-time) |  |  |

---

### `ClassArmReportDto` <a id="schema-classarmreportdto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `armId` | integer(int64) |  |  |
| `classId` | integer(int64) |  |  |
| `classArmName` | string |  |  |
| `reportStatus` | string |  |  |

---

### `ClassArmStudentReport` <a id="schema-classarmstudentreport"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `studentId` | integer(int64) |  |  |
| `studentName` | string |  |  |
| `subjectScores` | [`SubjectScore`](#schema-subjectscore)[] |  |  |
| `total` | number(double) |  |  |
| `percentage` | number(double) |  |  |
| `position` | integer(int32) |  |  |
| `suggestion` | string |  |  |
| `decision` | enum(PROMOTED \| DOUBLE_PROMOTION \| REPEAT \| IN_SESSION) |  | enum: `PROMOTED`, `DOUBLE_PROMOTION`, `REPEAT`, `IN_SESSION` |

---

### `ClassArmSubjectDepartmentResponseDto` <a id="schema-classarmsubjectdepartmentresponsedto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `levelId` | integer(int64) |  |  |
| `classId` | integer(int64) |  |  |
| `className` | string |  |  |
| `subjects` | [`SubjectListProjectionDto`](#schema-subjectlistprojectiondto)[] |  |  |
| `departments` | [`ClassDepartmentDto`](#schema-classdepartmentdto)[] |  |  |
| `arms` | [`ArmListProjectionDto`](#schema-armlistprojectiondto)[] |  |  |

---

### `ClassDepartmentDto` <a id="schema-classdepartmentdto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `departmentId` | integer(int64) |  |  |
| `departmentName` | string |  |  |
| `subjects` | [`SubjectListProjectionDto`](#schema-subjectlistprojectiondto)[] |  |  |

---

### `ClassFeeOverview` <a id="schema-classfeeoverview"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `classId` | integer(int64) |  |  |
| `className` | string |  |  |
| `arms` | [`ArmFeeOverview`](#schema-armfeeoverview)[] |  |  |
| `feeNames` | string[] |  |  |
| `totalAmount` | number |  |  |

---

### `ClassLevel` <a id="schema-classlevel"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | integer(int64) |  |  |
| `uuid` | string(uuid) |  |  |
| `active` | boolean |  |  |
| `version` | integer(int64) |  |  |
| `createdAt` | string(date-time) |  |  |
| `updatedAt` | string(date-time) |  |  |
| `levelName` | string |  |  |
| `levelType` | enum(CRECHE \| KINDERGARTEN \| NURSERY \| PRIMARY \| JUNIOR_SECONDARY \| SENIOR_SECONDARY) |  | enum: `CRECHE`, `KINDERGARTEN`, `NURSERY`, `PRIMARY`, `JUNIOR_SECONDARY`, `SENIOR_SECONDARY` |
| `classNamePrefix` | string |  |  |
| `classStart` | integer(int32) |  |  |
| `classEnd` | integer(int32) |  |  |
| `branchId` | integer(int64) |  |  |
| `schoolId` | integer(int64) |  |  |

---

### `ClassLevelNameDto` <a id="schema-classlevelnamedto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | integer(int64) |  |  |
| `levelName` | string |  |  |
| `levelType` | enum(CRECHE \| KINDERGARTEN \| NURSERY \| PRIMARY \| JUNIOR_SECONDARY \| SENIOR_SECONDARY) |  | enum: `CRECHE`, `KINDERGARTEN`, `NURSERY`, `PRIMARY`, `JUNIOR_SECONDARY`, `SENIOR_SECONDARY` |
| `classNamePrefix` | string |  |  |
| `classStart` | integer(int32) |  |  |
| `classEnd` | integer(int32) |  |  |

---

### `ClassLookupDto` <a id="schema-classlookupdto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | integer(int64) |  |  |
| `name` | string |  |  |
| `branchId` | integer(int64) |  |  |
| `levelId` | integer(int64) |  |  |

---

### `ClassRoom` <a id="schema-classroom"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | integer(int64) |  |  |
| `uuid` | string(uuid) |  |  |
| `active` | boolean |  |  |
| `version` | integer(int64) |  |  |
| `createdAt` | string(date-time) |  |  |
| `updatedAt` | string(date-time) |  |  |
| `name` | string |  |  |
| `levelId` | integer(int64) |  |  |
| `branchId` | integer(int64) |  |  |
| `schoolId` | integer(int64) |  |  |

---

### `ClassRoomDTO` <a id="schema-classroomdto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `classId` | integer(int64) |  |  |
| `className` | string |  |  |
| `departments` | [`DepartmentDTO`](#schema-departmentdto)[] |  |  |
| `arms` | [`ArmDTO`](#schema-armdto)[] |  |  |

---

### `ClassRoomDto` <a id="schema-classroomdto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `levelId` | integer(int64) |  |  |
| `name` | string |  |  |

---

### `ClassTeacherDto` <a id="schema-classteacherdto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `armId` | integer(int64) |  |  |
| `armName` | string |  |  |
| `studentCount` | integer(int64) |  |  |
| `active` | boolean |  |  |

---

### `CreateAcademicSessionDto` <a id="schema-createacademicsessiondto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `name` | string | ✓ |  |
| `currentTerm` | enum(FIRST \| SECOND \| THIRD) | ✓ | enum: `FIRST`, `SECOND`, `THIRD` |
| `firstTermStartDate` | string(date) | ✓ |  |
| `firstTermEndDate` | string(date) | ✓ |  |
| `secondTermStartDate` | string(date) | ✓ |  |
| `secondTermEndDate` | string(date) | ✓ |  |
| `thirdTermStartDate` | string(date) | ✓ |  |
| `thirdTermEndDate` | string(date) | ✓ |  |

---

### `CreateAdmissionNumberDto` <a id="schema-createadmissionnumberdto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `prefix` | string |  |  |
| `numberFormat` | string |  |  |
| `startingNumber` | integer(int32) |  |  |
| `padding` | integer(int32) |  |  |

---

### `CreateArmByClassDto` <a id="schema-createarmbyclassdto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `names` | string[] | ✓ |  |
| `className` | string | ✓ |  |
| `levelType` | enum(CRECHE \| KINDERGARTEN \| NURSERY \| PRIMARY \| JUNIOR_SECONDARY \| SENIOR_SECONDARY) | ✓ | enum: `CRECHE`, `KINDERGARTEN`, `NURSERY`, `PRIMARY`, `JUNIOR_SECONDARY`, `SENIOR_SECONDARY` |
| `branchId` | integer(int64) |  |  |
| `branchSpecific` | boolean |  |  |

---

### `CreateArmByLevelDto` <a id="schema-createarmbyleveldto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `names` | string[] | ✓ |  |
| `levelType` | enum(CRECHE \| KINDERGARTEN \| NURSERY \| PRIMARY \| JUNIOR_SECONDARY \| SENIOR_SECONDARY) | ✓ | enum: `CRECHE`, `KINDERGARTEN`, `NURSERY`, `PRIMARY`, `JUNIOR_SECONDARY`, `SENIOR_SECONDARY` |
| `branchId` | integer(int64) |  |  |
| `branchSpecific` | boolean |  |  |

---

### `CreateArmDto` <a id="schema-createarmdto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `classId` | integer(int64) |  |  |
| `name` | string |  |  |

---

### `CreateAssessmentDtoList` <a id="schema-createassessmentdtolist"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `name` | string | ✓ |  |
| `weight` | number(double) | ✓ |  |
| `assessmentType` | enum(CONTINUOUS_ASSESSMENT \| EXAM) | ✓ | enum: `CONTINUOUS_ASSESSMENT`, `EXAM` |

---

### `CreateAttendanceDto` <a id="schema-createattendancedto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `armId` | integer(int64) | ✓ |  |
| `date` | string(date) |  |  |

---

### `CreateBranchDto` <a id="schema-createbranchdto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `branchName` | string | ✓ |  |
| `address` | string | ✓ |  |
| `levels` | enum(CRECHE \| KINDERGARTEN \| NURSERY \| PRIMARY \| JUNIOR_SECONDARY \| SENIOR_SECONDARY)[] |  |  |

---

### `CreateBranchResponseDto` <a id="schema-createbranchresponsedto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `branch` | [`Branch`](#schema-branch) |  |  |
| `classLevels` | [`ClassLevel`](#schema-classlevel)[] |  |  |

---

### `CreateBranchesDto` <a id="schema-createbranchesdto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `branchDtos` | [`CreateBranchDto`](#schema-createbranchdto)[] |  |  |

---

### `CreateClassArmReportRequest` <a id="schema-createclassarmreportrequest"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `armId` | integer(int64) |  |  |
| `termId` | integer(int64) |  |  |

---

### `CreateDepartmentByClassDto` <a id="schema-createdepartmentbyclassdto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `names` | string[] | ✓ |  |
| `className` | string | ✓ |  |
| `levelType` | enum(CRECHE \| KINDERGARTEN \| NURSERY \| PRIMARY \| JUNIOR_SECONDARY \| SENIOR_SECONDARY) | ✓ | enum: `CRECHE`, `KINDERGARTEN`, `NURSERY`, `PRIMARY`, `JUNIOR_SECONDARY`, `SENIOR_SECONDARY` |
| `branchId` | integer(int64) |  |  |
| `branchSpecific` | boolean |  |  |

---

### `CreateDepartmentByLevelDto` <a id="schema-createdepartmentbyleveldto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `names` | string[] | ✓ |  |
| `levelType` | enum(CRECHE \| KINDERGARTEN \| NURSERY \| PRIMARY \| JUNIOR_SECONDARY \| SENIOR_SECONDARY) | ✓ | enum: `CRECHE`, `KINDERGARTEN`, `NURSERY`, `PRIMARY`, `JUNIOR_SECONDARY`, `SENIOR_SECONDARY` |
| `branchId` | integer(int64) |  |  |
| `branchSpecific` | boolean |  |  |

---

### `CreateEditAccessDto` <a id="schema-createeditaccessdto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `reason` | string | ✓ |  |
| `additionalDetails` | string |  |  |
| `armId` | integer(int64) | ✓ |  |
| `subjectId` | integer(int64) |  |  |

---

### `CreateInvoiceDto` <a id="schema-createinvoicedto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `studentIds` | integer(int64)[] |  |  |
| `termId` | integer(int64) |  |  |
| `armId` | integer(int64) |  |  |
| `branchId` | integer(int64) |  |  |
| `issuedDate` | string |  |  |
| `dueDate` | string |  |  |
| `invoiceItemDtos` | [`InvoiceItemDto`](#schema-invoiceitemdto)[] |  |  |
| `note` | string |  |  |
| `accountDetails` | string |  |  |

---

### `CreateInvoiceSettingsDto` <a id="schema-createinvoicesettingsdto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `numberFormat` | string |  |  |
| `startNumber` | integer(int64) |  |  |
| `numberPadding` | integer(int32) |  |  |
| `lastGeneratedNumber` | integer(int64) |  |  |
| `branchId` | integer(int64) |  |  |
| `image` | string |  |  |
| `invoicePrefix` | string |  |  |
| `padding` | string |  |  |
| `defaultInvoiceNote` | string |  |  |
| `defaultDueDate` | string(date-time) |  |  |
| `noOfDaysBeforeDueDate` | integer(int32) |  |  |
| `noOfDaysAfterDueDate` | integer(int32) |  |  |
| `repeatFrequency` | integer(int32) |  |  |

---

### `CreateLevelAssessmentDto` <a id="schema-createlevelassessmentdto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `levelType` | enum(CRECHE \| KINDERGARTEN \| NURSERY \| PRIMARY \| JUNIOR_SECONDARY \| SENIOR_SECONDARY) | ✓ | enum: `CRECHE`, `KINDERGARTEN`, `NURSERY`, `PRIMARY`, `JUNIOR_SECONDARY`, `SENIOR_SECONDARY` |
| `branchId` | integer(int64) |  |  |
| `branchSpecific` | boolean |  |  |
| `assessments` | [`CreateAssessmentDtoList`](#schema-createassessmentdtolist)[] | ✓ |  |

---

### `CreateLevelDto` <a id="schema-createleveldto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `name` | string |  |  |
| `levelType` | enum(CRECHE \| KINDERGARTEN \| NURSERY \| PRIMARY \| JUNIOR_SECONDARY \| SENIOR_SECONDARY) |  | enum: `CRECHE`, `KINDERGARTEN`, `NURSERY`, `PRIMARY`, `JUNIOR_SECONDARY`, `SENIOR_SECONDARY` |
| `branchId` | integer(int64) |  |  |

---

### `CreateLevelGradingDto` <a id="schema-createlevelgradingdto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `levelType` | enum(CRECHE \| KINDERGARTEN \| NURSERY \| PRIMARY \| JUNIOR_SECONDARY \| SENIOR_SECONDARY) | ✓ | enum: `CRECHE`, `KINDERGARTEN`, `NURSERY`, `PRIMARY`, `JUNIOR_SECONDARY`, `SENIOR_SECONDARY` |
| `branchId` | integer(int64) |  |  |
| `branchSpecific` | boolean |  |  |
| `gradingDtoList` | [`GradingDto`](#schema-gradingdto)[] | ✓ |  |

---

### `CreateParentDto` <a id="schema-createparentdto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `firstName` | string | ✓ |  |
| `lastName` | string | ✓ |  |
| `middleName` | string |  |  |
| `gender` | enum(MALE \| FEMALE) | ✓ | enum: `MALE`, `FEMALE` |
| `relationship` | enum(FATHER \| MOTHER \| GUARDIAN) | ✓ | enum: `FATHER`, `MOTHER`, `GUARDIAN` |
| `branchId` | integer(int64) | ✓ |  |
| `nationality` | string | ✓ |  |
| `stateOfOrigin` | string | ✓ |  |
| `email` | string | ✓ |  |
| `phoneNumber` | string | ✓ |  |
| `secondaryPhoneNumber` | string |  |  |
| `address` | string | ✓ |  |
| `image` | string |  |  |
| `linkedStudents` | integer(int64)[] |  |  |
| `tags` | string[] |  |  |

---

### `CreateResultSettingDto` <a id="schema-createresultsettingdto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `levelId` | integer(int64) |  |  |
| `academicSessionId` | integer(int64) |  |  |
| `calculationMethod` | enum(CUMULATIVE \| THIRD_TERM_ONLY) |  | enum: `CUMULATIVE`, `THIRD_TERM_ONLY` |
| `promotionType` | enum(PROMOTE_ALL \| MANUAL \| BY_PERFORMANCE) |  | enum: `PROMOTE_ALL`, `MANUAL`, `BY_PERFORMANCE` |
| `minimumOverallPercentage` | number(double) |  |  |
| `minimumPassGrade` | string |  |  |
| `requiredSubjectIds` | integer(int64)[] |  |  |

---

### `CreateSchoolDefaultAssessmentDto` <a id="schema-createschooldefaultassessmentdto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `branchId` | integer(int64) |  |  |
| `branchSpecific` | boolean |  |  |
| `assessments` | [`CreateAssessmentDtoList`](#schema-createassessmentdtolist)[] | ✓ |  |

---

### `CreateSchoolDefaultGradingDto` <a id="schema-createschooldefaultgradingdto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `branchId` | integer(int64) |  |  |
| `branchSpecific` | boolean |  |  |
| `gradingDtoList` | [`GradingDto`](#schema-gradingdto)[] | ✓ |  |

---

### `CreateStockCategoryDto` <a id="schema-createstockcategorydto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `name` | string | ✓ |  |

---

### `CreateStockDto` <a id="schema-createstockdto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `name` | string | ✓ |  |
| `description` | string | ✓ |  |
| `categoryId` | integer(int64) | ✓ |  |
| `imagePath` | string | ✓ |  |
| `stockUnitId` | integer(int64) | ✓ |  |
| `quantity` | integer(int32) | ✓ |  |
| `price` | number | ✓ |  |
| `costPrice` | number | ✓ |  |
| `branchId` | integer(int64) | ✓ |  |

---

### `CreateStockUnitDto` <a id="schema-createstockunitdto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `name` | string | ✓ |  |
| `description` | string | ✓ |  |

---

### `CreateStudentDto` <a id="schema-createstudentdto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `firstName` | string | ✓ |  |
| `lastName` | string | ✓ |  |
| `middleName` | string |  |  |
| `gender` | enum(MALE \| FEMALE) | ✓ | enum: `MALE`, `FEMALE` |
| `email` | string | ✓ |  |
| `image` | string |  |  |
| `admissionNumber` | string |  |  |
| `boardingStatus` | enum(DAY \| BOARDING) |  | enum: `DAY`, `BOARDING` |
| `dateOfBirth` | string(date) |  |  |
| `address` | string | ✓ |  |
| `stateOfOrigin` | string | ✓ |  |
| `nationality` | string | ✓ |  |
| `emergencyContact` | string |  |  |
| `emergencyContactName` | string |  |  |
| `phoneNumber` | string |  |  |
| `secondaryPhoneNumber` | string |  |  |
| `departmentId` | integer(int64) |  |  |
| `classId` | integer(int64) | ✓ |  |
| `armId` | integer(int64) | ✓ |  |
| `branchId` | integer(int64) | ✓ |  |
| `admissionStatus` | enum(GRADUATED \| ACTIVE \| SUSPENDED \| WITHDRAWN \| INACTIVE \| TOTAL) | ✓ | enum: `GRADUATED`, `ACTIVE`, `SUSPENDED`, `WITHDRAWN`, `INACTIVE`, `TOTAL` |
| `joinedSchoolSession` | string |  |  |
| `joinedSchoolTerm` | enum(FIRST \| SECOND \| THIRD) |  | enum: `FIRST`, `SECOND`, `THIRD` |
| `linkedParents` | integer(int64)[] | ✓ |  |
| `medicalInformation` | string |  |  |
| `tags` | string[] |  |  |

---

### `CreateSubAccountRequest` <a id="schema-createsubaccountrequest"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `accountName` | string |  |  |
| `bankCode` | string | ✓ |  |
| `accountNumber` | string | ✓ |  |
| `description` | string |  |  |
| `branchId` | integer(int64) | ✓ |  |

---

### `CreateSubjectByClassDto` <a id="schema-createsubjectbyclassdto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `names` | string[] | ✓ |  |
| `className` | string | ✓ |  |
| `levelType` | enum(CRECHE \| KINDERGARTEN \| NURSERY \| PRIMARY \| JUNIOR_SECONDARY \| SENIOR_SECONDARY) | ✓ | enum: `CRECHE`, `KINDERGARTEN`, `NURSERY`, `PRIMARY`, `JUNIOR_SECONDARY`, `SENIOR_SECONDARY` |
| `branchId` | integer(int64) |  |  |
| `branchSpecific` | boolean |  |  |

---

### `CreateSubjectByLevelDto` <a id="schema-createsubjectbyleveldto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `names` | string[] | ✓ |  |
| `levelType` | enum(CRECHE \| KINDERGARTEN \| NURSERY \| PRIMARY \| JUNIOR_SECONDARY \| SENIOR_SECONDARY) | ✓ | enum: `CRECHE`, `KINDERGARTEN`, `NURSERY`, `PRIMARY`, `JUNIOR_SECONDARY`, `SENIOR_SECONDARY` |
| `branchId` | integer(int64) |  |  |
| `branchSpecific` | boolean |  |  |

---

### `CreateSubjectDto` <a id="schema-createsubjectdto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `name` | string | ✓ |  |
| `classId` | integer(int64) | ✓ |  |

---

### `CreateSubjectReportDto` <a id="schema-createsubjectreportdto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `subjectId` | integer(int64) |  |  |
| `armId` | integer(int64) |  |  |
| `status` | enum(SUBMITTED \| NOT_SUBMITTED \| IN_PROGRESS \| REQUESTED_EDIT_ACCESS \| APPROVED \| APPROVED_EDIT_ACCESS) |  | enum: `SUBMITTED`, `NOT_SUBMITTED`, `IN_PROGRESS`, `REQUESTED_EDIT_ACCESS`, `APPROVED`, `APPROVED_EDIT_ACCESS` |
| `studentReports` | [`StudentReportDto`](#schema-studentreportdto)[] |  |  |

---

### `CreateSubmissionDeadlineDto` <a id="schema-createsubmissiondeadlinedto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `termsDeadline` | [`TermDeadlineDto`](#schema-termdeadlinedto)[] |  |  |

---

### `CreateSubscriptionDto` <a id="schema-createsubscriptiondto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `planId` | integer(int64) | ✓ |  |
| `studentCapacity` | integer(int64) |  |  |

---

### `CurrencyConfigDto` <a id="schema-currencyconfigdto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `defaultCurrency` | enum(NGN \| USD \| GBP \| EUR) | ✓ | enum: `NGN`, `USD`, `GBP`, `EUR` |
| `acceptUSD` | boolean | ✓ |  |
| `acceptGBP` | boolean | ✓ |  |
| `acceptEUR` | boolean | ✓ |  |
| `customerBearsGatewayFees` | boolean | ✓ |  |

---

### `CurrencyOption` <a id="schema-currencyoption"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `currency` | enum(NGN \| USD \| GBP \| EUR) |  | enum: `NGN`, `USD`, `GBP`, `EUR` |
| `amount` | number |  |  |
| `displayAmount` | string |  |  |

---

### `CustomizeLevelDto` <a id="schema-customizeleveldto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `levelId` | integer(int64) |  |  |
| `levelType` | enum(CRECHE \| KINDERGARTEN \| NURSERY \| PRIMARY \| JUNIOR_SECONDARY \| SENIOR_SECONDARY) |  | enum: `CRECHE`, `KINDERGARTEN`, `NURSERY`, `PRIMARY`, `JUNIOR_SECONDARY`, `SENIOR_SECONDARY` |
| `levelName` | string |  |  |
| `classNamePrefix` | string |  |  |
| `classStart` | integer(int32) |  |  |
| `classEnd` | integer(int32) |  |  |
| `branchSpecific` | boolean |  |  |

---

### `DashboardOverviewDto` <a id="schema-dashboardoverviewdto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `totalFeesCollected` | number |  |  |
| `outstandingFees` | number |  |  |
| `totalStudents` | integer(int64) |  |  |
| `totalExpenses` | number |  |  |
| `feesCollectedChange` | [`PercentageChangeDto`](#schema-percentagechangedto) |  |  |
| `outstandingFeesChange` | [`PercentageChangeDto`](#schema-percentagechangedto) |  |  |
| `studentsChange` | [`PercentageChangeDto`](#schema-percentagechangedto) |  |  |
| `expensesChange` | [`PercentageChangeDto`](#schema-percentagechangedto) |  |  |

---

### `Department` <a id="schema-department"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | integer(int64) |  |  |
| `uuid` | string(uuid) |  |  |
| `active` | boolean |  |  |
| `version` | integer(int64) |  |  |
| `createdAt` | string(date-time) |  |  |
| `updatedAt` | string(date-time) |  |  |
| `name` | string |  |  |
| `branchId` | integer(int64) |  |  |
| `schoolId` | integer(int64) |  |  |

---

### `DepartmentDTO` <a id="schema-departmentdto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `departmentId` | integer(int64) |  |  |
| `departmentName` | string |  |  |
| `arms` | [`ArmDTO`](#schema-armdto)[] |  |  |

---

### `EditBranchDto` <a id="schema-editbranchdto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `branchId` | integer(int64) |  |  |
| `name` | string |  |  |
| `address` | string |  |  |

---

### `EditRequestResponseDto` <a id="schema-editrequestresponsedto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `editRequestId` | integer(int64) |  |  |
| `teacherName` | string |  |  |
| `teacherEmail` | string |  |  |
| `classArmName` | string |  |  |
| `subjectName` | string |  |  |
| `reason` | string |  |  |
| `additionalDetails` | string |  |  |
| `sessionName` | string |  |  |
| `termName` | string |  |  |
| `dateCreated` | string(date-time) |  |  |
| `isApproved` | boolean |  |  |

---

### `EditStockCategoryDto` <a id="schema-editstockcategorydto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `stockCategoryId` | integer(int64) | ✓ |  |
| `name` | string |  |  |

---

### `EditStockDto` <a id="schema-editstockdto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `stockId` | integer(int64) | ✓ |  |
| `name` | string |  |  |
| `description` | string |  |  |
| `categoryId` | integer(int64) |  |  |
| `imagePath` | string |  |  |
| `stockUnitId` | integer(int64) |  |  |
| `quantity` | integer(int32) |  |  |
| `price` | number |  |  |
| `costPrice` | number |  |  |

---

### `EditStockUnitDto` <a id="schema-editstockunitdto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `stockUnitId` | integer(int64) | ✓ |  |
| `name` | string |  |  |
| `description` | string |  |  |

---

### `EssayData` <a id="schema-essaydata"></a>

_Composed via `allOf`: extends [`TypeSpecificData`](#schema-typespecificdata) — inherited fields are merged below._

| Field | Type | Required | Notes |
|---|---|---|---|
| `type` | string | ✓ |  |
| `minWords` | integer(int32) |  |  |
| `maxWords` | integer(int32) |  |  |
| `modelAnswer` | string |  |  |
| `rubric` | string |  |  |

---

### `ExchangeInfo` <a id="schema-exchangeinfo"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `fromCurrency` | enum(NGN \| USD \| GBP \| EUR) |  | enum: `NGN`, `USD`, `GBP`, `EUR` |
| `toCurrency` | enum(NGN \| USD \| GBP \| EUR) |  | enum: `NGN`, `USD`, `GBP`, `EUR` |
| `rate` | number |  |  |
| `originalAmount` | number |  |  |
| `convertedAmount` | number |  |  |

---

### `ExchangeRateDto` <a id="schema-exchangeratedto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `fromCurrency` | enum(NGN \| USD \| GBP \| EUR) | ✓ | enum: `NGN`, `USD`, `GBP`, `EUR` |
| `toCurrency` | enum(NGN \| USD \| GBP \| EUR) | ✓ | enum: `NGN`, `USD`, `GBP`, `EUR` |
| `rate` | number | ✓ | min: 1e-08 |
| `source` | string |  |  |
| `lastUpdated` | string(date-time) |  |  |

---

### `Fee` <a id="schema-fee"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | integer(int64) |  |  |
| `uuid` | string(uuid) |  |  |
| `active` | boolean |  |  |
| `version` | integer(int64) |  |  |
| `createdAt` | string(date-time) |  |  |
| `updatedAt` | string(date-time) |  |  |
| `schoolId` | integer(int64) |  |  |
| `branchId` | integer(int64) |  |  |
| `termId` | integer(int64) |  |  |
| `academicYear` | string |  |  |
| `term` | string |  |  |
| `dueDate` | string(date) |  |  |
| `published` | boolean |  |  |
| `publishedAt` | string(date-time) |  |  |

---

### `FeeArm` <a id="schema-feearm"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | integer(int64) |  |  |
| `uuid` | string(uuid) |  |  |
| `active` | boolean |  |  |
| `version` | integer(int64) |  |  |
| `createdAt` | string(date-time) |  |  |
| `updatedAt` | string(date-time) |  |  |
| `feeId` | integer(int64) |  |  |
| `armId` | integer(int64) |  |  |

---

### `FeeClassOverviewResponse` <a id="schema-feeclassoverviewresponse"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `branches` | [`BranchFeeOverview`](#schema-branchfeeoverview)[] |  |  |
| `grandTotalFees` | number |  |  |
| `grandTotalVariations` | integer(int64) |  |  |

---

### `FeeCollectionConfigResponse` <a id="schema-feecollectionconfigresponse"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `mode` | enum(SINGLE_ACCOUNT \| BRANCH_ACCOUNTS) |  | enum: `SINGLE_ACCOUNT`, `BRANCH_ACCOUNTS` |
| `defaultAccount` | [`BankAccountInfo`](#schema-bankaccountinfo) |  |  |
| `branchAccounts` | [`BranchAccountInfo`](#schema-branchaccountinfo)[] |  |  |
| `feeRoutes` | [`FeeRouteInfo`](#schema-feerouteinfo)[] |  |  |
| `customRouteCount` | integer(int32) |  |  |
| `defaultRouteCount` | integer(int32) |  |  |
| `totalFees` | integer(int32) |  |  |

---

### `FeeCollectionSetupDto` <a id="schema-feecollectionsetupdto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `mode` | enum(SINGLE_ACCOUNT \| BRANCH_ACCOUNTS) | ✓ | enum: `SINGLE_ACCOUNT`, `BRANCH_ACCOUNTS` |
| `branchAccounts` | [`BranchAccountDto`](#schema-branchaccountdto)[] | ✓ |  |
| `feeRoutes` | [`FeeRouteDto`](#schema-feeroutedto)[] |  |  |

---

### `FeeGroupDetailResponse` <a id="schema-feegroupdetailresponse"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `feeGroupId` | integer(int64) |  |  |
| `name` | string |  |  |
| `description` | string |  |  |
| `branchId` | integer(int64) |  |  |
| `branchName` | string |  |  |
| `termId` | integer(int64) |  |  |
| `items` | [`FeeGroupItemDetail`](#schema-feegroupitemdetail)[] |  |  |
| `appliedToArms` | [`ArmInfo`](#schema-arminfo)[] |  |  |
| `totalAmount` | number |  |  |
| `allowPartPayment` | boolean |  |  |
| `minimumPartPayment` | number |  |  |

---

### `FeeGroupDto` <a id="schema-feegroupdto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `name` | string | ✓ |  |
| `description` | string |  |  |
| `session` | integer(int64) | ✓ |  |
| `term` | enum(FIRST \| SECOND \| THIRD) | ✓ | enum: `FIRST`, `SECOND`, `THIRD` |
| `branchId` | integer(int64) | ✓ |  |
| `armIds` | integer(int64)[] | ✓ |  |
| `items` | [`FeeGroupItemDto`](#schema-feegroupitemdto)[] | ✓ |  |
| `allowPartPayment` | boolean |  |  |
| `minimumPartPayment` | number |  |  |

---

### `FeeGroupItemDetail` <a id="schema-feegroupitemdetail"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | integer(int64) |  |  |
| `itemType` | enum(FEE_CLASS \| STOCK \| CUSTOM) |  | enum: `FEE_CLASS`, `STOCK`, `CUSTOM` |
| `itemName` | string |  |  |
| `unitPrice` | number |  |  |
| `quantity` | integer(int32) |  |  |
| `total` | number |  |  |
| `optional` | boolean |  |  |

---

### `FeeGroupItemDto` <a id="schema-feegroupitemdto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `itemType` | enum(FEE_CLASS \| STOCK \| CUSTOM) |  | enum: `FEE_CLASS`, `STOCK`, `CUSTOM` |
| `feeClassId` | integer(int64) |  |  |
| `stockId` | integer(int64) |  |  |
| `name` | string |  |  |
| `unitPrice` | number |  |  |
| `amount` | number |  |  |
| `minimumPartPayment` | number |  |  |
| `quantity` | integer(int32) |  |  |
| `optional` | boolean |  |  |
| `armIds` | integer(int64)[] |  |  |
| `classArmAmounts` | [`ClassArmAmount`](#schema-classarmamount)[] |  |  |
| `session` | integer(int64) |  |  |
| `term` | enum(FIRST \| SECOND \| THIRD) |  | enum: `FIRST`, `SECOND`, `THIRD` |
| `branchId` | integer(int64) |  |  |
| `setDifferentPricesPerClass` | boolean |  |  |
| `allowPartPayment` | boolean |  |  |

---

### `FeeGroupOverviewResponse` <a id="schema-feegroupoverviewresponse"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `branches` | [`BranchFeeGroupOverview`](#schema-branchfeegroupoverview)[] |  |  |
| `totalGroups` | integer(int64) |  |  |

---

### `FeeGroupSummary` <a id="schema-feegroupsummary"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `feeGroupId` | integer(int64) |  |  |
| `name` | string |  |  |
| `description` | string |  |  |
| `feeNames` | string[] |  |  |
| `totalAmount` | number |  |  |
| `appliedToArmsCount` | integer(int64) |  |  |

---

### `FeeItem` <a id="schema-feeitem"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | integer(int64) |  |  |
| `uuid` | string(uuid) |  |  |
| `active` | boolean |  |  |
| `version` | integer(int64) |  |  |
| `createdAt` | string(date-time) |  |  |
| `updatedAt` | string(date-time) |  |  |
| `feeId` | integer(int64) |  |  |
| `name` | string |  |  |
| `required` | boolean |  |  |
| `allowPartPayment` | boolean |  |  |
| `minimumPartPayment` | number |  |  |
| `feeClassId` | integer(int64) |  |  |
| `armId` | integer(int64) |  |  |
| `amount` | number |  |  |
| `quantity` | integer(int32) |  |  |
| `classId` | integer(int64) |  |  |
| `branchId` | integer(int64) |  |  |
| `termId` | integer(int64) |  |  |

---

### `FeeItemDetail` <a id="schema-feeitemdetail"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `feeItemId` | integer(int64) |  |  |
| `feeClassId` | integer(int64) |  |  |
| `feeName` | string |  |  |
| `amount` | number |  |  |
| `quantity` | integer(int32) |  |  |
| `required` | boolean |  |  |
| `allowPartPayment` | boolean |  |  |
| `minimumPartPayment` | number |  |  |

---

### `FeeItemDto` <a id="schema-feeitemdto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `name` | string | ✓ |  |
| `session` | integer(int64) | ✓ |  |
| `term` | enum(FIRST \| SECOND \| THIRD) | ✓ | enum: `FIRST`, `SECOND`, `THIRD` |
| `quantity` | integer(int32) |  |  |
| `armIds` | integer(int64)[] | ✓ |  |
| `amount` | number |  |  |
| `setDifferentPricesPerClass` | boolean |  |  |
| `classArmAmounts` | [`ClassArmAmount`](#schema-classarmamount)[] |  |  |
| `allowPartPayment` | boolean |  |  |
| `minimumPartPayment` | number |  |  |
| `required` | boolean |  |  |

---

### `FeeItemPayment` <a id="schema-feeitempayment"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `studentFeeItemId` | integer(int64) | ✓ |  |
| `amount` | number | ✓ |  |

---

### `FeeOverviewResponse` <a id="schema-feeoverviewresponse"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `studentFeeId` | integer(int64) |  |  |
| `termName` | string |  |  |
| `outstandingAmount` | number |  |  |
| `totalPaid` | number |  |  |
| `status` | enum(PENDING \| PARTIALLY_PAID \| PAID \| OVERDUE) |  | enum: `PENDING`, `PARTIALLY_PAID`, `PAID`, `OVERDUE` |
| `pendingItems` | [`PendingFeeItem`](#schema-pendingfeeitem)[] |  |  |

---

### `FeeRouteDto` <a id="schema-feeroutedto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `feeClassId` | integer(int64) | ✓ |  |
| `bankAccountId` | integer(int64) | ✓ |  |
| `isDefault` | boolean |  |  |

---

### `FeeRouteInfo` <a id="schema-feerouteinfo"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `feeClassId` | integer(int64) |  |  |
| `feeName` | string |  |  |
| `account` | [`BankAccountInfo`](#schema-bankaccountinfo) |  |  |
| `isDefault` | boolean |  |  |

---

### `FeeRouteRequestDto` <a id="schema-feerouterequestdto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `branchId` | integer(int64) |  |  |
| `bankAccountId` | integer(int64) |  |  |
| `feeClassId` | integer(int64) |  |  |
| `isDefault` | boolean |  |  |

---

### `FeeRouteResponseDto` <a id="schema-feerouteresponsedto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | integer(int64) |  |  |
| `branchName` | string |  |  |
| `bankAccountName` | string |  |  |
| `bankAccountNumber` | string |  |  |
| `feeClassName` | string |  |  |
| `feeClassId` | integer(int64) |  |  |
| `isDefault` | boolean |  |  |

---

### `FillInTheBlankData` <a id="schema-fillintheblankdata"></a>

_Composed via `allOf`: extends [`TypeSpecificData`](#schema-typespecificdata) — inherited fields are merged below._

| Field | Type | Required | Notes |
|---|---|---|---|
| `type` | string | ✓ |  |
| `blanks` | [`BlankData`](#schema-blankdata)[] |  |  |
| `caseSensitive` | boolean |  |  |
| `instruction` | string |  |  |

---

### `ForgotPasswordDto` <a id="schema-forgotpassworddto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `email` | string | ✓ |  |

---

### `GetAllTermsResponseDto` <a id="schema-getalltermsresponsedto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `academicSessionName` | string |  |  |
| `isActiveSession` | boolean |  |  |
| `terms` | [`AllTerms`](#schema-allterms)[] |  |  |

---

### `GetArmSubjectReportResponseDto` <a id="schema-getarmsubjectreportresponsedto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `classId` | integer(int64) |  |  |
| `armId` | integer(int64) |  |  |
| `classArmName` | string |  |  |
| `classTeacherName` | string |  |  |
| `subjectReportResponseDtoList` | [`GetSubjectReportResponseDto`](#schema-getsubjectreportresponsedto)[] |  |  |

---

### `GetAttendanceByArmDto` <a id="schema-getattendancebyarmdto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `classAndArmName` | string |  |  |
| `studentsPresent` | [`StudentAndIsPresent`](#schema-studentandispresent)[] |  |  |

---

### `GetBranchAttendanceResponseDto` <a id="schema-getbranchattendanceresponsedto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `totalClasses` | integer(int64) |  |  |
| `numberOfClassAttendanceTaken` | integer(int64) |  |  |
| `totalStudents` | integer(int64) |  |  |
| `overallAttendancePercentage` | number(double) |  |  |
| `classArmAttendanceCardList` | [`ClassArmAttendanceCard`](#schema-classarmattendancecard)[] |  |  |

---

### `GetClassArmNameDto` <a id="schema-getclassarmnamedto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `classId` | integer(int64) |  |  |
| `armId` | integer(int64) |  |  |
| `classArmName` | string |  |  |

---

### `GetClassArmStudentReportResponseDto` <a id="schema-getclassarmstudentreportresponsedto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `classArmReportId` | integer(int64) |  |  |
| `status` | enum(APPROVED \| PENDING_APPROVAL \| NOT_SUBMITTED \| EDIT_REQUEST \| APPROVED_EDIT_REQUEST) |  | enum: `APPROVED`, `PENDING_APPROVAL`, `NOT_SUBMITTED`, `EDIT_REQUEST`, `APPROVED_EDIT_REQUEST` |
| `classArmStudentReports` | [`ClassArmStudentReport`](#schema-classarmstudentreport)[] |  |  |

---

### `GetClassArmSubjectResponseDto` <a id="schema-getclassarmsubjectresponsedto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `levelId` | integer(int64) |  |  |
| `classId` | integer(int64) |  |  |
| `className` | string |  |  |
| `subjects` | [`SubjectListProjectionDto`](#schema-subjectlistprojectiondto)[] |  |  |
| `arms` | [`ArmListProjectionDto`](#schema-armlistprojectiondto)[] |  |  |

---

### `GetRoleListResponseDto` <a id="schema-getrolelistresponsedto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `roleId` | integer(int64) |  |  |
| `roleName` | string |  |  |
| `description` | string |  |  |
| `totalUsers` | integer(int64) |  |  |
| `permissionIds` | integer(int64)[] |  |  |

---

### `GetSchoolReportResponseDto` <a id="schema-getschoolreportresponsedto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `totalBranchesInSchool` | integer(int64) |  |  |
| `totalArmsInSchool` | integer(int64) |  |  |
| `totalPendingArmSubmission` | integer(int64) |  |  |
| `totalArmSubmitted` | integer(int64) |  |  |
| `totalPublishedReport` | integer(int64) |  |  |
| `branchReports` | [`BranchReportResponseDto`](#schema-branchreportresponsedto)[] |  |  |

---

### `GetStudentSubjectReportResponseDto` <a id="schema-getstudentsubjectreportresponsedto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `studentId` | integer(int64) |  |  |
| `studentName` | string |  |  |
| `assessmentScores` | map<string, [`AssessmentScoreDto`](#schema-assessmentscoredto)> |  |  |
| `total` | number(double) |  |  |
| `grade` | string |  |  |
| `remark` | string |  |  |

---

### `GetSubjectReportResponseDto` <a id="schema-getsubjectreportresponsedto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `subjectId` | integer(int64) |  |  |
| `subjectName` | string |  |  |
| `subjectTeacherName` | string |  |  |
| `status` | enum(SUBMITTED \| NOT_SUBMITTED \| IN_PROGRESS \| REQUESTED_EDIT_ACCESS \| APPROVED \| APPROVED_EDIT_ACCESS) |  | enum: `SUBMITTED`, `NOT_SUBMITTED`, `IN_PROGRESS`, `REQUESTED_EDIT_ACCESS`, `APPROVED`, `APPROVED_EDIT_ACCESS` |

---

### `GetTeacherSubjectsDto` <a id="schema-getteachersubjectsdto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `subjectName` | string |  |  |
| `subjectId` | integer(int64) |  |  |
| `classArmReportDtos` | [`ClassArmReportDto`](#schema-classarmreportdto)[] |  |  |

---

### `GetTermSheetResponse` <a id="schema-gettermsheetresponse"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `studentId` | integer(int64) |  |  |
| `studentName` | string |  |  |
| `totalSchoolDays` | integer(int32) |  |  |
| `totalPresent` | integer(int32) |  |  |
| `totalAbsent` | integer(int32) |  |  |
| `attendancePercentage` | number(double) |  |  |
| `weeks` | [`WeeklyAttendanceDto`](#schema-weeklyattendancedto)[] |  |  |

---

### `Grading` <a id="schema-grading"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | integer(int64) |  |  |
| `uuid` | string(uuid) |  |  |
| `active` | boolean |  |  |
| `version` | integer(int64) |  |  |
| `createdAt` | string(date-time) |  |  |
| `updatedAt` | string(date-time) |  |  |
| `grade` | string |  |  |
| `upperLimit` | number(double) |  |  |
| `lowerLimit` | number(double) |  |  |
| `remark` | string |  |  |
| `levelId` | integer(int64) |  |  |
| `branchId` | integer(int64) |  |  |
| `schoolId` | integer(int64) |  |  |
| `isDefault` | boolean |  |  |

---

### `GradingDto` <a id="schema-gradingdto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `grade` | string | ✓ |  |
| `upperLimit` | number(double) |  |  |
| `lowerLimit` | number(double) |  |  |
| `remark` | string | ✓ |  |

---

### `ImportResult` <a id="schema-importresult"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `totalRecords` | integer(int32) |  |  |
| `successCount` | integer(int32) |  |  |
| `failureCount` | integer(int32) |  |  |
| `errors` | string[] |  |  |
| `successful` | boolean |  |  |

---

### `Invoice` <a id="schema-invoice"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | integer(int64) |  |  |
| `uuid` | string(uuid) |  |  |
| `active` | boolean |  |  |
| `version` | integer(int64) |  |  |
| `createdAt` | string(date-time) |  |  |
| `updatedAt` | string(date-time) |  |  |
| `studentId` | integer(int64) |  |  |
| `termId` | integer(int64) |  |  |
| `schoolId` | integer(int64) |  |  |
| `branchId` | integer(int64) |  |  |
| `classId` | integer(int64) |  |  |
| `armId` | integer(int64) |  |  |
| `invoiceId` | string |  |  |
| `studentName` | string |  |  |
| `totalAmount` | number |  |  |
| `outstandingAmount` | number |  |  |
| `paidAmount` | number |  |  |
| `status` | enum(PAID \| UNPAID \| FULLY_PAID \| DRAFT \| OUTSTANDING \| PARTIALLY_PAID) |  | enum: `PAID`, `UNPAID`, `FULLY_PAID`, `DRAFT`, `OUTSTANDING`, `PARTIALLY_PAID` |
| `session` | string |  |  |
| `note` | string |  |  |
| `accountDetails` | string |  |  |
| `issueDate` | string(date-time) |  |  |
| `dueDate` | string(date-time) |  |  |
| `studentFeeId` | integer(int64) |  |  |

---

### `InvoiceEntryDto` <a id="schema-invoiceentrydto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `invoiceId` | string |  |  |
| `studentName` | string |  |  |
| `amount` | number |  |  |
| `status` | enum(PAID \| UNPAID \| FULLY_PAID \| DRAFT \| OUTSTANDING \| PARTIALLY_PAID) |  | enum: `PAID`, `UNPAID`, `FULLY_PAID`, `DRAFT`, `OUTSTANDING`, `PARTIALLY_PAID` |
| `lastActivity` | string(date-time) |  |  |

---

### `InvoiceItemDto` <a id="schema-invoiceitemdto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `name` | string |  |  |
| `quantity` | integer(int32) |  |  |
| `unitPrice` | number |  |  |
| `isRequired` | boolean |  |  |

---

### `InvoiceLineItem` <a id="schema-invoicelineitem"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `name` | string |  |  |
| `amount` | number |  |  |
| `amountPaid` | number |  |  |
| `balance` | number |  |  |

---

### `InvoiceResponse` <a id="schema-invoiceresponse"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `invoiceId` | integer(int64) |  |  |
| `invoiceNumber` | string |  |  |
| `studentName` | string |  |  |
| `className` | string |  |  |
| `termName` | string |  |  |
| `issueDate` | string(date) |  |  |
| `dueDate` | string(date) |  |  |
| `requiredFees` | [`InvoiceLineItem`](#schema-invoicelineitem)[] |  |  |
| `optionalFees` | [`InvoiceLineItem`](#schema-invoicelineitem)[] |  |  |
| `totalRequired` | number |  |  |
| `totalOptional` | number |  |  |
| `totalPaid` | number |  |  |
| `totalBalance` | number |  |  |
| `status` | enum(PAID \| UNPAID \| FULLY_PAID \| DRAFT \| OUTSTANDING \| PARTIALLY_PAID) |  | enum: `PAID`, `UNPAID`, `FULLY_PAID`, `DRAFT`, `OUTSTANDING`, `PARTIALLY_PAID` |

---

### `InvoicesPageResponse` <a id="schema-invoicespageresponse"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `totalIssued` | number |  |  |
| `totalPaid` | number |  |  |
| `outstandingFees` | number |  |  |
| `invoices` | [`InvoiceEntryDto`](#schema-invoiceentrydto)[] |  |  |

---

### `LinkedPersonDto` <a id="schema-linkedpersondto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | integer(int64) |  |  |
| `image` | string |  |  |
| `fullName` | string |  |  |
| `relationship` | enum(FATHER \| MOTHER \| GUARDIAN) |  | enum: `FATHER`, `MOTHER`, `GUARDIAN` |

---

### `LoginRequest` <a id="schema-loginrequest"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `email` | string | ✓ |  |
| `password` | string | ✓ |  |
| `userType` | enum(DIGENTY_STAFF \| SCHOOL_ADMIN \| SCHOOL_STAFF \| STUDENT \| PARENT \| BRANCH_ADMIN \| SYSTEM) | ✓ | enum: `DIGENTY_STAFF`, `SCHOOL_ADMIN`, `SCHOOL_STAFF`, `STUDENT`, `PARENT`, `BRANCH_ADMIN`, `SYSTEM` |

---

### `ManualGradeDTO` <a id="schema-manualgradedto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `answerId` | integer(int64) | ✓ |  |
| `marksAwarded` | number(double) | ✓ | min: 0.0 |
| `feedback` | string |  |  |
| `gradedBy` | integer(int64) | ✓ |  |

---

### `MarkAllPresentByArmDto` <a id="schema-markallpresentbyarmdto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `armId` | integer(int64) | ✓ |  |
| `date` | string(date) |  |  |
| `isPresent` | boolean | ✓ |  |

---

### `MarkAttendanceDto` <a id="schema-markattendancedto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `attendanceId` | integer(int64) | ✓ |  |
| `studentAttendanceList` | [`StudentAttendance`](#schema-studentattendance)[] |  |  |

---

### `MatchData` <a id="schema-matchdata"></a>

_Composed via `allOf`: extends [`TypeSpecificData`](#schema-typespecificdata) — inherited fields are merged below._

| Field | Type | Required | Notes |
|---|---|---|---|
| `type` | string | ✓ |  |
| `pairs` | [`MatchPairData`](#schema-matchpairdata)[] | ✓ |  |
| `marksForEach` | integer(int32) |  |  |
| `shuffleItems` | boolean |  |  |
| `partialCredit` | boolean |  |  |

---

### `MatchPairData` <a id="schema-matchpairdata"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `itemText` | string |  |  |
| `itemHtml` | string |  |  |
| `matchText` | string |  |  |
| `matchHtml` | string |  |  |
| `itemImageUrl` | string |  |  |
| `matchImageUrl` | string |  |  |

---

### `MultipleAnswersData` <a id="schema-multipleanswersdata"></a>

_Composed via `allOf`: extends [`TypeSpecificData`](#schema-typespecificdata) — inherited fields are merged below._

| Field | Type | Required | Notes |
|---|---|---|---|
| `type` | string | ✓ |  |
| `options` | [`OptionData`](#schema-optiondata)[] | ✓ |  |
| `minSelections` | integer(int32) |  |  |
| `maxSelections` | integer(int32) |  |  |
| `partialCredit` | boolean |  |  |

---

### `MultipleAttendanceUpdate` <a id="schema-multipleattendanceupdate"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `attendanceDtoList` | [`StudentAttendanceDto`](#schema-studentattendancedto)[] |  |  |

---

### `MultipleChoiceData` <a id="schema-multiplechoicedata"></a>

_Composed via `allOf`: extends [`TypeSpecificData`](#schema-typespecificdata) — inherited fields are merged below._

| Field | Type | Required | Notes |
|---|---|---|---|
| `type` | string | ✓ |  |
| `options` | [`OptionData`](#schema-optiondata)[] | ✓ |  |

---

### `NumericAnswerData` <a id="schema-numericanswerdata"></a>

_Composed via `allOf`: extends [`TypeSpecificData`](#schema-typespecificdata) — inherited fields are merged below._

| Field | Type | Required | Notes |
|---|---|---|---|
| `type` | string | ✓ |  |
| `correctAnswer` | number |  |  |
| `tolerance` | number |  |  |
| `minValue` | number |  |  |
| `maxValue` | number |  |  |
| `unit` | string |  |  |
| `decimalPlaces` | integer(int32) |  |  |

---

### `OnboardingDto` <a id="schema-onboardingdto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `firstName` | string |  |  |
| `lastName` | string |  |  |
| `schoolName` | string |  |  |
| `studentPopulation` | enum(SMALL \| MEDIUM \| LARGE) |  | enum: `SMALL`, `MEDIUM`, `LARGE` |
| `role` | string |  |  |
| `country` | string |  |  |
| `currency` | string |  |  |

---

### `OnboardingProgressResponse` <a id="schema-onboardingprogressresponse"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `steps` | [`OnboardingStepDto`](#schema-onboardingstepdto)[] |  |  |
| `completedSteps` | integer(int32) |  |  |
| `totalSteps` | integer(int32) |  |  |
| `fullyComplete` | boolean |  |  |

---

### `OnboardingStepDto` <a id="schema-onboardingstepdto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `stepNumber` | integer(int32) |  |  |
| `title` | string |  |  |
| `description` | string |  |  |
| `completed` | boolean |  |  |

---

### `OptionData` <a id="schema-optiondata"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `optionText` | string |  |  |
| `optionHtml` | string |  |  |
| `optionLabel` | string |  |  |
| `imageUrl` | string |  |  |
| `isCorrect` | boolean |  |  |

---

### `PageBillingHistoryDto` <a id="schema-pagebillinghistorydto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `totalElements` | integer(int64) |  |  |
| `totalPages` | integer(int32) |  |  |
| `pageable` | [`PageableObject`](#schema-pageableobject) |  |  |
| `size` | integer(int32) |  |  |
| `content` | [`BillingHistoryDto`](#schema-billinghistorydto)[] |  |  |
| `number` | integer(int32) |  |  |
| `sort` | [`SortObject`](#schema-sortobject) |  |  |
| `numberOfElements` | integer(int32) |  |  |
| `first` | boolean |  |  |
| `last` | boolean |  |  |
| `empty` | boolean |  |  |

---

### `PageBranchArmReportResponseDto` <a id="schema-pagebrancharmreportresponsedto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `totalElements` | integer(int64) |  |  |
| `totalPages` | integer(int32) |  |  |
| `pageable` | [`PageableObject`](#schema-pageableobject) |  |  |
| `size` | integer(int32) |  |  |
| `content` | [`BranchArmReportResponseDto`](#schema-brancharmreportresponsedto)[] |  |  |
| `number` | integer(int32) |  |  |
| `sort` | [`SortObject`](#schema-sortobject) |  |  |
| `numberOfElements` | integer(int32) |  |  |
| `first` | boolean |  |  |
| `last` | boolean |  |  |
| `empty` | boolean |  |  |

---

### `PageClassArmSubjectDepartmentResponseDto` <a id="schema-pageclassarmsubjectdepartmentresponsedto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `totalElements` | integer(int64) |  |  |
| `totalPages` | integer(int32) |  |  |
| `pageable` | [`PageableObject`](#schema-pageableobject) |  |  |
| `size` | integer(int32) |  |  |
| `content` | [`ClassArmSubjectDepartmentResponseDto`](#schema-classarmsubjectdepartmentresponsedto)[] |  |  |
| `number` | integer(int32) |  |  |
| `sort` | [`SortObject`](#schema-sortobject) |  |  |
| `numberOfElements` | integer(int32) |  |  |
| `first` | boolean |  |  |
| `last` | boolean |  |  |
| `empty` | boolean |  |  |

---

### `PageGetClassArmSubjectResponseDto` <a id="schema-pagegetclassarmsubjectresponsedto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `totalElements` | integer(int64) |  |  |
| `totalPages` | integer(int32) |  |  |
| `pageable` | [`PageableObject`](#schema-pageableobject) |  |  |
| `size` | integer(int32) |  |  |
| `content` | [`GetClassArmSubjectResponseDto`](#schema-getclassarmsubjectresponsedto)[] |  |  |
| `number` | integer(int32) |  |  |
| `sort` | [`SortObject`](#schema-sortobject) |  |  |
| `numberOfElements` | integer(int32) |  |  |
| `first` | boolean |  |  |
| `last` | boolean |  |  |
| `empty` | boolean |  |  |

---

### `PageGetStudentSubjectReportResponseDto` <a id="schema-pagegetstudentsubjectreportresponsedto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `totalElements` | integer(int64) |  |  |
| `totalPages` | integer(int32) |  |  |
| `pageable` | [`PageableObject`](#schema-pageableobject) |  |  |
| `size` | integer(int32) |  |  |
| `content` | [`GetStudentSubjectReportResponseDto`](#schema-getstudentsubjectreportresponsedto)[] |  |  |
| `number` | integer(int32) |  |  |
| `sort` | [`SortObject`](#schema-sortobject) |  |  |
| `numberOfElements` | integer(int32) |  |  |
| `first` | boolean |  |  |
| `last` | boolean |  |  |
| `empty` | boolean |  |  |

---

### `PageInvoice` <a id="schema-pageinvoice"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `totalElements` | integer(int64) |  |  |
| `totalPages` | integer(int32) |  |  |
| `pageable` | [`PageableObject`](#schema-pageableobject) |  |  |
| `size` | integer(int32) |  |  |
| `content` | [`Invoice`](#schema-invoice)[] |  |  |
| `number` | integer(int32) |  |  |
| `sort` | [`SortObject`](#schema-sortobject) |  |  |
| `numberOfElements` | integer(int32) |  |  |
| `first` | boolean |  |  |
| `last` | boolean |  |  |
| `empty` | boolean |  |  |

---

### `PageStaffListResponse` <a id="schema-pagestafflistresponse"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `totalElements` | integer(int64) |  |  |
| `totalPages` | integer(int32) |  |  |
| `pageable` | [`PageableObject`](#schema-pageableobject) |  |  |
| `size` | integer(int32) |  |  |
| `content` | [`StaffListResponse`](#schema-stafflistresponse)[] |  |  |
| `number` | integer(int32) |  |  |
| `sort` | [`SortObject`](#schema-sortobject) |  |  |
| `numberOfElements` | integer(int32) |  |  |
| `first` | boolean |  |  |
| `last` | boolean |  |  |
| `empty` | boolean |  |  |

---

### `PageStudent` <a id="schema-pagestudent"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `totalElements` | integer(int64) |  |  |
| `totalPages` | integer(int32) |  |  |
| `pageable` | [`PageableObject`](#schema-pageableobject) |  |  |
| `size` | integer(int32) |  |  |
| `content` | [`Student`](#schema-student)[] |  |  |
| `number` | integer(int32) |  |  |
| `sort` | [`SortObject`](#schema-sortobject) |  |  |
| `numberOfElements` | integer(int32) |  |  |
| `first` | boolean |  |  |
| `last` | boolean |  |  |
| `empty` | boolean |  |  |

---

### `PageStudentResponseDto` <a id="schema-pagestudentresponsedto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `totalElements` | integer(int64) |  |  |
| `totalPages` | integer(int32) |  |  |
| `pageable` | [`PageableObject`](#schema-pageableobject) |  |  |
| `size` | integer(int32) |  |  |
| `content` | [`StudentResponseDto`](#schema-studentresponsedto)[] |  |  |
| `number` | integer(int32) |  |  |
| `sort` | [`SortObject`](#schema-sortobject) |  |  |
| `numberOfElements` | integer(int32) |  |  |
| `first` | boolean |  |  |
| `last` | boolean |  |  |
| `empty` | boolean |  |  |

---

### `Pageable` <a id="schema-pageable"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `page` | integer(int32) |  | min: 0 |
| `size` | integer(int32) |  | min: 1 |
| `sort` | string[] |  |  |

---

### `PageableObject` <a id="schema-pageableobject"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `paged` | boolean |  |  |
| `pageNumber` | integer(int32) |  |  |
| `pageSize` | integer(int32) |  |  |
| `offset` | integer(int64) |  |  |
| `sort` | [`SortObject`](#schema-sortobject) |  |  |
| `unpaged` | boolean |  |  |

---

### `ParentRegistrationRequestDto` <a id="schema-parentregistrationrequestdto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `email` | string | ✓ |  |
| `password` | string |  | pattern: `^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$` |

---

### `ParentResponseDto` <a id="schema-parentresponsedto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | integer(int64) |  |  |
| `uuid` | string |  |  |
| `firstName` | string |  |  |
| `image` | string |  |  |
| `lastName` | string |  |  |
| `middleName` | string |  |  |
| `email` | string |  |  |
| `phoneNumber` | string |  |  |
| `branchId` | integer(int64) |  |  |
| `branch` | string |  |  |
| `gender` | enum(MALE \| FEMALE) |  | enum: `MALE`, `FEMALE` |
| `nationality` | string |  |  |
| `stateOfOrigin` | string |  |  |
| `address` | string |  |  |
| `secondaryPhoneNumber` | string |  |  |
| `tags` | string[] |  |  |
| `linkedStudents` | [`LinkedPersonDto`](#schema-linkedpersondto)[] |  |  |

---

### `PayFeeRequest` <a id="schema-payfeerequest"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `studentFeeId` | integer(int64) | ✓ |  |
| `items` | [`FeeItemPayment`](#schema-feeitempayment)[] | ✓ |  |

---

### `PayFeeResponse` <a id="schema-payfeeresponse"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `studentFeeId` | integer(int64) |  |  |
| `termName` | string |  |  |
| `requiredFees` | [`PendingFeeItem`](#schema-pendingfeeitem)[] |  |  |
| `optionalFees` | [`PendingFeeItem`](#schema-pendingfeeitem)[] |  |  |
| `totalRequired` | number |  |  |
| `totalPaid` | number |  |  |
| `totalBalance` | number |  |  |
| `status` | enum(PENDING \| PARTIALLY_PAID \| PAID \| OVERDUE) |  | enum: `PENDING`, `PARTIALLY_PAID`, `PAID`, `OVERDUE` |

---

### `PaymentBreakdown` <a id="schema-paymentbreakdown"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `description` | string |  |  |
| `currency` | enum(NGN \| USD \| GBP \| EUR) |  | enum: `NGN`, `USD`, `GBP`, `EUR` |
| `invoiceAmount` | number |  |  |
| `serviceCharge` | number |  |  |
| `subtotal` | number |  |  |
| `paystackFee` | number |  |  |
| `totalAmount` | number |  |  |
| `exchangeInfo` | [`ExchangeInfo`](#schema-exchangeinfo) |  |  |

---

### `PaymentCalculateDto` <a id="schema-paymentcalculatedto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `amount` | number | ✓ |  |
| `fromCurrency` | enum(NGN \| USD \| GBP \| EUR) | ✓ | enum: `NGN`, `USD`, `GBP`, `EUR` |
| `toCurrency` | enum(NGN \| USD \| GBP \| EUR) | ✓ | enum: `NGN`, `USD`, `GBP`, `EUR` |

---

### `PaymentCalculation` <a id="schema-paymentcalculation"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `originalInvoiceAmount` | number |  |  |
| `invoiceAmountInPaymentCurrency` | number |  |  |
| `serviceCharge` | number |  |  |
| `subtotal` | number |  |  |
| `gatewayFee` | number |  |  |
| `totalAmount` | number |  |  |
| `currency` | enum(NGN \| USD \| GBP \| EUR) |  | enum: `NGN`, `USD`, `GBP`, `EUR` |
| `exchangeInfo` | [`ExchangeInfo`](#schema-exchangeinfo) |  |  |

---

### `PaymentRequestDto` <a id="schema-paymentrequestdto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `invoiceId` | integer(int64) | ✓ |  |
| `email` | string | ✓ |  |
| `currency` | enum(NGN \| USD \| GBP \| EUR) | ✓ | enum: `NGN`, `USD`, `GBP`, `EUR` |
| `paymentType` | enum(FULL \| PARTIAL \| CUSTOM) | ✓ | enum: `FULL`, `PARTIAL`, `CUSTOM` |
| `selectedFeeIds` | integer(int64)[] |  |  |
| `customAmount` | number |  |  |
| `callBackUrl` | string |  |  |

---

### `PaymentResponseDto` <a id="schema-paymentresponsedto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `authorizationUrl` | string |  |  |
| `reference` | string |  |  |
| `currency` | enum(NGN \| USD \| GBP \| EUR) |  | enum: `NGN`, `USD`, `GBP`, `EUR` |
| `invoiceAmount` | number |  |  |
| `serviceCharge` | number |  |  |
| `paystackFee` | number |  |  |
| `totalAmount` | number |  |  |
| `breakdown` | [`PaymentBreakdown`](#schema-paymentbreakdown) |  |  |

---

### `PendingFeeItem` <a id="schema-pendingfeeitem"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `studentFeeItemId` | integer(int64) |  |  |
| `name` | string |  |  |
| `required` | boolean |  |  |
| `amount` | number |  |  |
| `amountPaid` | number |  |  |
| `balance` | number |  |  |
| `status` | enum(PENDING \| PARTIALLY_PAID \| PAID \| OVERDUE) |  | enum: `PENDING`, `PARTIALLY_PAID`, `PAID`, `OVERDUE` |

---

### `PercentageChangeDto` <a id="schema-percentagechangedto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `percentage` | number(double) |  |  |
| `direction` | string |  |  |

---

### `PlanResponseDto` <a id="schema-planresponsedto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | integer(int64) |  |  |
| `name` | string |  |  |
| `pricePerStudent` | number |  |  |
| `maxStudentCount` | integer(int32) |  |  |
| `minStudentCount` | integer(int32) |  |  |
| `planType` | enum(YEARLY \| TERMLY) |  | enum: `YEARLY`, `TERMLY` |
| `features` | string[] |  |  |

---

### `PrincipalCommentRequestDto` <a id="schema-principalcommentrequestdto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `levelId` | integer(int64) | ✓ |  |
| `rows` | [`RowRequest`](#schema-rowrequest)[] |  |  |

---

### `PrincipalCommentResponseDto` <a id="schema-principalcommentresponsedto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `rows` | [`RowResponse`](#schema-rowresponse)[] |  |  |

---

### `QuestionDTO` <a id="schema-questiondto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `classId` | integer(int64) | ✓ |  |
| `subjectId` | integer(int64) | ✓ |  |
| `topicId` | integer(int64) |  |  |
| `questionText` | string | ✓ |  |
| `questionHtml` | string |  |  |
| `imageUrl` | string |  |  |
| `marks` | integer(int32) | ✓ | min: 1 |
| `explanation` | string |  |  |
| `difficultyLevel` | string |  |  |
| `typeSpecificData` | OneOf< [`EssayData`](#schema-essaydata) \| [`FillInTheBlankData`](#schema-fillintheblankdata) \| [`MatchData`](#schema-matchdata) \| [`MultipleAnswersData`](#schema-multipleanswersdata) \| [`MultipleChoiceData`](#schema-multiplechoicedata) \| [`NumericAnswerData`](#schema-numericanswerdata) \| [`QuestionGroupData`](#schema-questiongroupdata) \| [`ShortAnswerData`](#schema-shortanswerdata) \| [`TrueFalseData`](#schema-truefalsedata) > | ✓ |  |

---

### `QuestionGroupData` <a id="schema-questiongroupdata"></a>

_Composed via `allOf`: extends [`TypeSpecificData`](#schema-typespecificdata) — inherited fields are merged below._

| Field | Type | Required | Notes |
|---|---|---|---|
| `type` | string | ✓ |  |
| `stimulusType` | string |  |  |
| `stimulusContent` | string |  |  |
| `stimulusHtml` | string |  |  |
| `stimulusImageUrl` | string |  |  |
| `chartData` | string |  |  |
| `tableData` | string |  |  |
| `subQuestions` | [`SubQuestionRequest`](#schema-subquestionrequest)[] |  |  |

---

### `QuestionOptionDTO` <a id="schema-questionoptiondto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | integer(int64) |  |  |
| `optionText` | string | ✓ |  |
| `optionHtml` | string |  |  |
| `optionLabel` | string |  |  |
| `optionOrder` | integer(int32) | ✓ |  |
| `imageUrl` | string |  |  |
| `isCorrect` | boolean |  |  |

---

### `QuestionResponseDTO` <a id="schema-questionresponsedto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | integer(int64) |  |  |
| `classId` | integer(int64) |  |  |
| `subjectId` | integer(int64) |  |  |
| `branchId` | integer(int64) |  |  |
| `schoolId` | integer(int64) |  |  |
| `topicId` | integer(int64) |  |  |
| `questionText` | string |  |  |
| `questionHtml` | string |  |  |
| `imageUrl` | string |  |  |
| `marks` | integer(int32) |  |  |
| `difficultyLevel` | enum(EASY \| MEDIUM \| HARD) |  | enum: `EASY`, `MEDIUM`, `HARD` |
| `questionType` | enum(MULTIPLE_CHOICE \| TRUE_FALSE \| ESSAY \| FILL_IN_THE_BLANK \| SHORT_ANSWER \| MULTIPLE_ANSWERS \| NUMERIC_ANSWER \| MATCH \| QUESTION_GROUP) |  | enum: `MULTIPLE_CHOICE`, `TRUE_FALSE`, `ESSAY`, `FILL_IN_THE_BLANK`, `SHORT_ANSWER`, `MULTIPLE_ANSWERS`, `NUMERIC_ANSWER`, `MATCH`, `QUESTION_GROUP` |
| `explanation` | string |  |  |
| `options` | [`QuestionOptionDTO`](#schema-questionoptiondto)[] |  |  |
| `additionalData` | object |  |  |

---

### `RegisterDomainRequest` <a id="schema-registerdomainrequest"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `domain` | string | ✓ |  |
| `tld` | string | ✓ |  |
| `years` | integer(int32) | ✓ | min: 1 |
| `firstname` | string | ✓ |  |
| `lastname` | string | ✓ |  |
| `companyname` | string |  |  |
| `address` | string | ✓ |  |
| `city` | string | ✓ |  |
| `state` | string | ✓ |  |
| `postcode` | string | ✓ |  |
| `country` | string | ✓ |  |
| `phone` | string | ✓ |  |
| `emailAddress` | string | ✓ |  |
| `nameserver1` | string | ✓ |  |
| `nameserver2` | string | ✓ |  |
| `nameserver3` | string |  |  |
| `nameserver4` | string |  |  |

---

### `RegistrarLockRequest` <a id="schema-registrarlockrequest"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `domain` | string | ✓ |  |
| `lock` | boolean | ✓ |  |

---

### `RegistrationReqData` <a id="schema-registrationreqdata"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `email` | string | ✓ |  |
| `password` | string |  | pattern: `^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$` |

---

### `RenewDomainRequest` <a id="schema-renewdomainrequest"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `domain` | string | ✓ |  |
| `years` | integer(int32) | ✓ | min: 1 |

---

### `RequiredSubjectStats` <a id="schema-requiredsubjectstats"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `promoted` | integer(int64) |  |  |
| `repeated` | integer(int64) |  |  |
| `pending` | integer(int64) |  |  |

---

### `ResetPasswordDto` <a id="schema-resetpassworddto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `email` | string | ✓ |  |
| `otp` | string | ✓ | minLength: 6; maxLength: 6 |
| `newPassword` | string | ✓ | minLength: 8; maxLength: 2147483647 |
| `confirmPassword` | string | ✓ |  |

---

### `ResultSettingResponseDto` <a id="schema-resultsettingresponsedto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | integer(int64) |  |  |
| `classId` | integer(int64) |  |  |
| `academicSessionId` | integer(int64) |  |  |
| `calculationMethod` | enum(CUMULATIVE \| THIRD_TERM_ONLY) |  | enum: `CUMULATIVE`, `THIRD_TERM_ONLY` |
| `promotionType` | enum(PROMOTE_ALL \| MANUAL \| BY_PERFORMANCE) |  | enum: `PROMOTE_ALL`, `MANUAL`, `BY_PERFORMANCE` |
| `minimumOverallPercentage` | number(double) |  |  |
| `minimumPassGrade` | string |  |  |
| `requiredSubjectIds` | integer(int64)[] |  |  |

---

### `RoleCreateDto` <a id="schema-rolecreatedto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `name` | string |  |  |
| `description` | string |  |  |
| `permissionIds` | integer(int64)[] |  |  |

---

### `RoleDto` <a id="schema-roledto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `name` | string |  | pattern: `\b[a-z]+(?:_[a-z]+)+\b` |
| `permission_ids` | integer(int64)[] |  |  |

---

### `RoleUpdateDto` <a id="schema-roleupdatedto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `roleId` | integer(int64) |  |  |
| `name` | string |  |  |
| `description` | string |  |  |
| `permissionIds` | integer(int64)[] |  |  |

---

### `RowRequest` <a id="schema-rowrequest"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `commentId` | integer(int64) |  |  |
| `minPercentage` | number(double) | ✓ | min: 0; max: 100 |
| `maxPercentage` | number(double) | ✓ | min: 0; max: 100 |
| `comment` | string | ✓ | minLength: 0; maxLength: 500 |

---

### `RowResponse` <a id="schema-rowresponse"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | integer(int64) |  |  |
| `levelId` | integer(int64) |  |  |
| `minPercentage` | number(double) |  |  |
| `maxPercentage` | number(double) |  |  |
| `comment` | string |  |  |

---

### `SchoolDetailsResponse` <a id="schema-schooldetailsresponse"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `logo` | string |  |  |
| `firstName` | string |  |  |
| `lastName` | string |  |  |
| `middleName` | string |  |  |
| `email` | string |  |  |
| `schoolName` | string |  |  |
| `motto` | string |  |  |
| `phoneNumber` | string |  |  |
| `country` | string |  |  |
| `currency` | string |  |  |
| `timezone` | string |  |  |

---

### `SchoolLookupDto` <a id="schema-schoollookupdto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | integer(int64) |  |  |
| `name` | string |  |  |
| `logo` | string |  |  |
| `motto` | string |  |  |
| `country` | string |  |  |
| `currency` | string |  |  |
| `timezone` | string |  |  |
| `subdomain` | string |  |  |
| `customDomain` | string |  |  |

---

### `SchoolUpdateDto` <a id="schema-schoolupdatedto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `logo` | string |  |  |
| `firstName` | string |  |  |
| `lastName` | string |  |  |
| `middleName` | string |  |  |
| `schoolName` | string |  |  |
| `motto` | string |  |  |
| `phoneNumber` | string |  |  |
| `country` | string |  |  |
| `currency` | string |  |  |
| `timezone` | string |  |  |

---

### `SecurityOverviewDto` <a id="schema-securityoverviewdto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `passwordStrength` | string |  |  |
| `activeSessions` | [`ActiveSessionResponseDto`](#schema-activesessionresponsedto)[] |  |  |

---

### `SelectProfileDto` <a id="schema-selectprofiledto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `profileId` | integer(int64) |  |  |

---

### `ServiceChargeConfigDto` <a id="schema-servicechargeconfigdto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `type` | enum(PERCENTAGE \| FIXED_AMOUNT \| TIERED) | ✓ | enum: `PERCENTAGE`, `FIXED_AMOUNT`, `TIERED` |
| `value` | number |  |  |
| `includeCharge` | boolean | ✓ |  |
| `tieredCharges` | [`TieredChargeDto`](#schema-tieredchargedto)[] |  |  |

---

### `ShortAnswerData` <a id="schema-shortanswerdata"></a>

_Composed via `allOf`: extends [`TypeSpecificData`](#schema-typespecificdata) — inherited fields are merged below._

| Field | Type | Required | Notes |
|---|---|---|---|
| `type` | string | ✓ |  |
| `correctAnswers` | string[] |  |  |
| `caseSensitive` | boolean |  |  |
| `exactMatch` | boolean |  |  |
| `maxLength` | integer(int32) |  |  |

---

### `SortObject` <a id="schema-sortobject"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `sorted` | boolean |  |  |
| `empty` | boolean |  |  |
| `unsorted` | boolean |  |  |

---

### `StaffArmDto` <a id="schema-staffarmdto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `classId` | integer(int64) |  |  |
| `armId` | integer(int64) |  |  |
| `armName` | string |  |  |

---

### `StaffBranchAssignmentDto` <a id="schema-staffbranchassignmentdto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `branchId` | integer(int64) |  |  |
| `roleIds` | integer(int64)[] |  |  |

---

### `StaffBranchDetailDto` <a id="schema-staffbranchdetaildto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `branchId` | integer(int64) |  |  |
| `branchName` | string |  |  |
| `roleNames` | string[] |  |  |
| `subjectTeachings` | [`SubjectTeachingDto`](#schema-subjectteachingdto)[] |  |  |
| `classTeacherArms` | [`ClassTeacherDto`](#schema-classteacherdto)[] |  |  |
| `permissions` | [`StaffPermissionDto`](#schema-staffpermissiondto)[] |  |  |

---

### `StaffCreateDto` <a id="schema-staffcreatedto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `firstName` | string |  |  |
| `lastName` | string |  |  |
| `email` | string | ✓ |  |
| `phoneNumber` | string |  | minLength: 10; maxLength: 15 |
| `branchAssignmentDtos` | [`StaffBranchAssignmentDto`](#schema-staffbranchassignmentdto)[] |  |  |

---

### `StaffDetailsResponse` <a id="schema-staffdetailsresponse"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `staffId` | integer(int64) |  |  |
| `fullname` | string |  |  |
| `email` | string |  |  |
| `phoneNumber` | string |  |  |
| `status` | enum(ACTIVE \| INACTIVE \| PENDING \| DELETED) |  | enum: `ACTIVE`, `INACTIVE`, `PENDING`, `DELETED` |
| `branches` | [`StaffBranchDetailDto`](#schema-staffbranchdetaildto)[] |  |  |

---

### `StaffListResponse` <a id="schema-stafflistresponse"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `staffId` | integer(int64) |  |  |
| `fullName` | string |  |  |
| `email` | string |  |  |
| `roleName` | string |  |  |
| `status` | enum(ACTIVE \| INACTIVE \| PENDING \| DELETED) |  | enum: `ACTIVE`, `INACTIVE`, `PENDING`, `DELETED` |
| `branchName` | string |  |  |
| `lastLogin` | string(date-time) |  |  |

---

### `StaffPermissionDto` <a id="schema-staffpermissiondto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `moduleName` | string |  |  |
| `permissions` | string[] |  |  |

---

### `StaffUpdateDto` <a id="schema-staffupdatedto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `firstName` | string |  |  |
| `lastName` | string |  |  |
| `email` | string |  |  |
| `phoneNumber` | string |  | minLength: 10; maxLength: 15 |
| `branchAssignmentDtos` | [`StaffBranchAssignmentDto`](#schema-staffbranchassignmentdto)[] |  |  |

---

### `StartAssessmentDTO` <a id="schema-startassessmentdto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `assessmentId` | integer(int64) | ✓ |  |
| `studentId` | integer(int64) | ✓ |  |
| `ipAddress` | string |  |  |
| `browserInfo` | string |  |  |

---

### `StockCategory` <a id="schema-stockcategory"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | integer(int64) |  |  |
| `uuid` | string(uuid) |  |  |
| `active` | boolean |  |  |
| `version` | integer(int64) |  |  |
| `createdAt` | string(date-time) |  |  |
| `updatedAt` | string(date-time) |  |  |
| `name` | string |  |  |
| `schoolId` | integer(int64) |  |  |

---

### `StockSettingsRequestDto` <a id="schema-stocksettingsrequestdto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `lowStockThreshold` | integer(int32) | ✓ | min: 0 |
| `lowStockAlertEnabled` | boolean | ✓ |  |

---

### `StockSettingsResponseDto` <a id="schema-stocksettingsresponsedto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | integer(int64) |  |  |
| `lowStockThreshold` | integer(int32) |  |  |
| `lowStockAlertEnabled` | boolean |  |  |
| `schoolId` | integer(int64) |  |  |
| `branchId` | integer(int64) |  |  |

---

### `Student` <a id="schema-student"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | integer(int64) |  |  |
| `uuid` | string(uuid) |  |  |
| `active` | boolean |  |  |
| `version` | integer(int64) |  |  |
| `createdAt` | string(date-time) |  |  |
| `updatedAt` | string(date-time) |  |  |
| `firstName` | string |  |  |
| `lastName` | string |  |  |
| `middleName` | string |  |  |
| `email` | string |  |  |
| `admissionNumber` | string |  |  |
| `image` | string |  |  |
| `phoneNumber` | string |  |  |
| `secondaryPhoneNumber` | string |  |  |
| `address` | string |  |  |
| `stateOfOrigin` | string |  |  |
| `nationality` | string |  |  |
| `emergencyContact` | string |  |  |
| `emergencyContactName` | string |  |  |
| `boardingStatus` | enum(DAY \| BOARDING) |  | enum: `DAY`, `BOARDING` |
| `gender` | enum(MALE \| FEMALE) |  | enum: `MALE`, `FEMALE` |
| `dateOfBirth` | string(date) |  |  |
| `parentId` | integer(int64) |  |  |
| `schoolId` | integer(int64) |  |  |
| `branchId` | integer(int64) |  |  |
| `studentStatus` | enum(GRADUATED \| ACTIVE \| SUSPENDED \| WITHDRAWN \| INACTIVE \| TOTAL) |  | enum: `GRADUATED`, `ACTIVE`, `SUSPENDED`, `WITHDRAWN`, `INACTIVE`, `TOTAL` |
| `joinedSchoolSession` | string |  |  |
| `joinedSchoolTerm` | enum(FIRST \| SECOND \| THIRD) |  | enum: `FIRST`, `SECOND`, `THIRD` |
| `medicalInformation` | string |  |  |
| `tags` | string |  |  |
| `fullName` | string |  |  |

---

### `StudentAndIsPresent` <a id="schema-studentandispresent"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `studentId` | integer(int64) |  |  |
| `studentName` | string |  |  |
| `isPresent` | boolean |  |  |

---

### `StudentAnswer` <a id="schema-studentanswer"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | integer(int64) |  |  |
| `uuid` | string(uuid) |  |  |
| `active` | boolean |  |  |
| `version` | integer(int64) |  |  |
| `createdAt` | string(date-time) |  |  |
| `updatedAt` | string(date-time) |  |  |
| `studentAssessmentId` | integer(int64) |  |  |
| `assessmentQuestionId` | integer(int64) |  |  |
| `answerData` | string |  |  |
| `answerText` | string |  |  |
| `selectedOptionId` | integer(int64) |  |  |
| `isCorrect` | boolean |  |  |
| `marksAwarded` | number(double) |  |  |
| `maxMarks` | integer(int32) |  |  |
| `gradingStatus` | enum(PENDING \| AUTO_GRADED \| MANUALLY_GRADED \| REVIEW_REQUIRED) |  | enum: `PENDING`, `AUTO_GRADED`, `MANUALLY_GRADED`, `REVIEW_REQUIRED` |
| `autoGraded` | boolean |  |  |
| `gradedBy` | integer(int64) |  |  |
| `gradedAt` | string(date-time) |  |  |
| `feedback` | string |  |  |
| `timeSpentSeconds` | integer(int64) |  |  |
| `flagged` | boolean |  |  |
| `answeredAt` | string(date-time) |  |  |

---

### `StudentAssessment` <a id="schema-studentassessment"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | integer(int64) |  |  |
| `uuid` | string(uuid) |  |  |
| `active` | boolean |  |  |
| `version` | integer(int64) |  |  |
| `createdAt` | string(date-time) |  |  |
| `updatedAt` | string(date-time) |  |  |
| `assessmentId` | integer(int64) |  |  |
| `studentId` | integer(int64) |  |  |
| `status` | enum(NOT_STARTED \| IN_PROGRESS \| PENDING \| COMPLETED \| ABSENT \| TIMED_OUT) |  | enum: `NOT_STARTED`, `IN_PROGRESS`, `PENDING`, `COMPLETED`, `ABSENT`, `TIMED_OUT` |
| `startTime` | string(date-time) |  |  |
| `endTime` | string(date-time) |  |  |
| `submissionTime` | string(date-time) |  |  |
| `timeSpentSeconds` | integer(int64) |  |  |
| `score` | number(double) |  |  |
| `totalMarks` | integer(int32) |  |  |
| `percentage` | number(double) |  |  |
| `weightedScore` | number(double) |  |  |
| `passed` | boolean |  |  |
| `attemptNumber` | integer(int32) |  |  |
| `ipAddress` | string |  |  |
| `browserInfo` | string |  |  |
| `questionOrder` | string |  |  |

---

### `StudentAssessmentItemDTO` <a id="schema-studentassessmentitemdto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `assessmentId` | integer(int64) |  |  |
| `name` | string |  |  |
| `subjectName` | string |  |  |
| `className` | string |  |  |
| `testType` | enum(CONTINUOUS_ASSESSMENT \| EXAMINATION \| MOCK_EXAM \| PRACTICE_TEST) |  | enum: `CONTINUOUS_ASSESSMENT`, `EXAMINATION`, `MOCK_EXAM`, `PRACTICE_TEST` |
| `term` | enum(FIRST \| SECOND \| THIRD) |  | enum: `FIRST`, `SECOND`, `THIRD` |
| `durationMinutes` | integer(int32) |  |  |
| `totalMarks` | integer(int32) |  |  |
| `questionCount` | integer(int32) |  |  |
| `startDateTime` | string(date-time) |  |  |
| `endDateTime` | string(date-time) |  |  |
| `studentAssessmentId` | integer(int64) |  |  |
| `attemptStatus` | enum(NOT_STARTED \| IN_PROGRESS \| PENDING \| COMPLETED \| ABSENT \| TIMED_OUT) |  | enum: `NOT_STARTED`, `IN_PROGRESS`, `PENDING`, `COMPLETED`, `ABSENT`, `TIMED_OUT` |
| `score` | number(double) |  |  |
| `percentage` | number(double) |  |  |
| `passed` | boolean |  |  |

---

### `StudentAssessmentPaperDTO` <a id="schema-studentassessmentpaperdto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `studentAssessmentId` | integer(int64) |  |  |
| `assessmentId` | integer(int64) |  |  |
| `assessmentName` | string |  |  |
| `durationMinutes` | integer(int32) |  |  |
| `totalMarks` | integer(int32) |  |  |
| `instructions` | string |  |  |
| `timeRemainingSeconds` | integer(int64) |  |  |
| `sections` | [`StudentSectionDTO`](#schema-studentsectiondto)[] |  |  |

---

### `StudentAssessmentScoreDto` <a id="schema-studentassessmentscoredto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `assessmentId` | integer(int64) |  |  |
| `score` | number(double) |  |  |

---

### `StudentAttendance` <a id="schema-studentattendance"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `studentId` | integer(int64) |  |  |
| `isPresent` | boolean |  |  |

---

### `StudentAttendanceDto` <a id="schema-studentattendancedto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `attendanceTransactionId` | integer(int64) | ✓ |  |
| `isPresent` | boolean |  |  |

---

### `StudentCumulative` <a id="schema-studentcumulative"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `studentId` | integer(int64) |  |  |
| `studentName` | string |  |  |
| `firstTermPercentage` | number(double) |  |  |
| `secondTermPercentage` | number(double) |  |  |
| `thirdTermPercentage` | number(double) |  |  |
| `cumulativePercentage` | number(double) |  |  |
| `suggestion` | string |  |  |
| `decision` | enum(PROMOTED \| DOUBLE_PROMOTION \| REPEAT \| IN_SESSION) |  | enum: `PROMOTED`, `DOUBLE_PROMOTION`, `REPEAT`, `IN_SESSION` |

---

### `StudentCumulativeReportResponse` <a id="schema-studentcumulativereportresponse"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `status` | enum(APPROVED \| PENDING_APPROVAL \| NOT_SUBMITTED \| EDIT_REQUEST \| APPROVED_EDIT_REQUEST) |  | enum: `APPROVED`, `PENDING_APPROVAL`, `NOT_SUBMITTED`, `EDIT_REQUEST`, `APPROVED_EDIT_REQUEST` |
| `levelId` | integer(int64) |  |  |
| `firstTermStatus` | enum(APPROVED \| PENDING_APPROVAL \| NOT_SUBMITTED \| EDIT_REQUEST \| APPROVED_EDIT_REQUEST) |  | enum: `APPROVED`, `PENDING_APPROVAL`, `NOT_SUBMITTED`, `EDIT_REQUEST`, `APPROVED_EDIT_REQUEST` |
| `secondTermStatus` | enum(APPROVED \| PENDING_APPROVAL \| NOT_SUBMITTED \| EDIT_REQUEST \| APPROVED_EDIT_REQUEST) |  | enum: `APPROVED`, `PENDING_APPROVAL`, `NOT_SUBMITTED`, `EDIT_REQUEST`, `APPROVED_EDIT_REQUEST` |
| `thirdTermStatus` | enum(APPROVED \| PENDING_APPROVAL \| NOT_SUBMITTED \| EDIT_REQUEST \| APPROVED_EDIT_REQUEST) |  | enum: `APPROVED`, `PENDING_APPROVAL`, `NOT_SUBMITTED`, `EDIT_REQUEST`, `APPROVED_EDIT_REQUEST` |
| `studentCumulative` | [`StudentCumulative`](#schema-studentcumulative)[] |  |  |

---

### `StudentDashboardDTO` <a id="schema-studentdashboarddto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `studentId` | integer(int64) |  |  |
| `studentName` | string |  |  |
| `armDisplay` | string |  |  |
| `activeAssessments` | [`StudentAssessmentItemDTO`](#schema-studentassessmentitemdto)[] |  |  |
| `upcomingAssessments` | [`StudentAssessmentItemDTO`](#schema-studentassessmentitemdto)[] |  |  |
| `completedAssessments` | [`StudentAssessmentItemDTO`](#schema-studentassessmentitemdto)[] |  |  |

---

### `StudentInvoiceDto` <a id="schema-studentinvoicedto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `invoiceId` | integer(int64) |  |  |
| `invoiceNumber` | string |  |  |
| `studentId` | integer(int64) |  |  |
| `studentName` | string |  |  |
| `className` | string |  |  |
| `currency` | enum(NGN \| USD \| GBP \| EUR) |  | enum: `NGN`, `USD`, `GBP`, `EUR` |
| `totalAmount` | number |  |  |
| `paidAmount` | number |  |  |
| `balanceAmount` | number |  |  |
| `status` | enum(PAID \| UNPAID \| FULLY_PAID \| DRAFT \| OUTSTANDING \| PARTIALLY_PAID) |  | enum: `PAID`, `UNPAID`, `FULLY_PAID`, `DRAFT`, `OUTSTANDING`, `PARTIALLY_PAID` |
| `dueDate` | string(date) |  |  |
| `requiredFees` | [`InvoiceItemDto`](#schema-invoiceitemdto)[] |  |  |
| `optionalFees` | [`InvoiceItemDto`](#schema-invoiceitemdto)[] |  |  |
| `bankTransferInfo` | [`BankTransferInfo`](#schema-banktransferinfo) |  |  |
| `availableCurrencies` | [`CurrencyOption`](#schema-currencyoption)[] |  |  |

---

### `StudentPopulationRangeOptionDto` <a id="schema-studentpopulationrangeoptiondto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `value` | enum(SMALL \| MEDIUM \| LARGE) |  | enum: `SMALL`, `MEDIUM`, `LARGE` |
| `label` | string |  |  |

---

### `StudentPromotionDecision` <a id="schema-studentpromotiondecision"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `studentId` | integer(int64) |  |  |
| `status` | enum(PROMOTED \| DOUBLE_PROMOTION \| REPEAT \| IN_SESSION) |  | enum: `PROMOTED`, `DOUBLE_PROMOTION`, `REPEAT`, `IN_SESSION` |
| `toClassId` | integer(int64) |  |  |
| `toArmId` | integer(int64) |  |  |

---

### `StudentQuestionDTO` <a id="schema-studentquestiondto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `assessmentQuestionId` | integer(int64) |  |  |
| `questionId` | integer(int64) |  |  |
| `questionText` | string |  |  |
| `questionHtml` | string |  |  |
| `imageUrl` | string |  |  |
| `marks` | integer(int32) |  |  |
| `questionType` | enum(MULTIPLE_CHOICE \| TRUE_FALSE \| ESSAY \| FILL_IN_THE_BLANK \| SHORT_ANSWER \| MULTIPLE_ANSWERS \| NUMERIC_ANSWER \| MATCH \| QUESTION_GROUP) |  | enum: `MULTIPLE_CHOICE`, `TRUE_FALSE`, `ESSAY`, `FILL_IN_THE_BLANK`, `SHORT_ANSWER`, `MULTIPLE_ANSWERS`, `NUMERIC_ANSWER`, `MATCH`, `QUESTION_GROUP` |
| `typeData` | object |  |  |

---

### `StudentReportCardResponse` <a id="schema-studentreportcardresponse"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `schoolName` | string |  |  |
| `sessionName` | string |  |  |
| `studentId` | integer(int64) |  |  |
| `studentName` | string |  |  |
| `className` | string |  |  |
| `totalSchoolDays` | integer(int32) |  |  |
| `totalPresent` | integer(int32) |  |  |
| `totalAbsent` | integer(int32) |  |  |
| `neatness` | enum(EXCELLENT \| VERY_GOOD \| GOOD \| FAIR \| POOR) |  | enum: `EXCELLENT`, `VERY_GOOD`, `GOOD`, `FAIR`, `POOR` |
| `punctuality` | enum(EXCELLENT \| VERY_GOOD \| GOOD \| FAIR \| POOR) |  | enum: `EXCELLENT`, `VERY_GOOD`, `GOOD`, `FAIR`, `POOR` |
| `diligence` | enum(EXCELLENT \| VERY_GOOD \| GOOD \| FAIR \| POOR) |  | enum: `EXCELLENT`, `VERY_GOOD`, `GOOD`, `FAIR`, `POOR` |
| `subjectReports` | [`SubjectReportRow`](#schema-subjectreportrow)[] |  |  |
| `overallPercentage` | number(double) |  |  |
| `classTeacherComment` | string |  |  |
| `principalComment` | string |  |  |
| `nextTermBegins` | string |  |  |

---

### `StudentReportDto` <a id="schema-studentreportdto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `studentId` | integer(int64) |  |  |
| `scores` | [`StudentAssessmentScoreDto`](#schema-studentassessmentscoredto)[] |  |  |

---

### `StudentRequiredSubject` <a id="schema-studentrequiredsubject"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `studentId` | integer(int64) |  |  |
| `studentName` | string |  |  |
| `subjects` | [`SubjectScore`](#schema-subjectscore)[] |  |  |
| `total` | number(double) |  |  |
| `percentage` | number(double) |  |  |
| `promotionDecision` | enum(PROMOTED \| DOUBLE_PROMOTION \| REPEAT \| IN_SESSION) |  | enum: `PROMOTED`, `DOUBLE_PROMOTION`, `REPEAT`, `IN_SESSION` |

---

### `StudentRequiredSubjectReportResponse` <a id="schema-studentrequiredsubjectreportresponse"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `status` | enum(APPROVED \| PENDING_APPROVAL \| NOT_SUBMITTED \| EDIT_REQUEST \| APPROVED_EDIT_REQUEST) |  | enum: `APPROVED`, `PENDING_APPROVAL`, `NOT_SUBMITTED`, `EDIT_REQUEST`, `APPROVED_EDIT_REQUEST` |
| `levelId` | integer(int64) |  |  |
| `submissionStatus` | enum(APPROVED \| PENDING_APPROVAL \| NOT_SUBMITTED \| EDIT_REQUEST \| APPROVED_EDIT_REQUEST) |  | enum: `APPROVED`, `PENDING_APPROVAL`, `NOT_SUBMITTED`, `EDIT_REQUEST`, `APPROVED_EDIT_REQUEST` |
| `students` | [`StudentRequiredSubject`](#schema-studentrequiredsubject)[] |  |  |
| `stats` | [`RequiredSubjectStats`](#schema-requiredsubjectstats) |  |  |

---

### `StudentResponseDto` <a id="schema-studentresponsedto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | integer(int64) |  |  |
| `uuid` | string |  |  |
| `firstName` | string |  |  |
| `lastName` | string |  |  |
| `middleName` | string |  |  |
| `email` | string |  |  |
| `admissionNumber` | string |  |  |
| `image` | string |  |  |
| `boardingStatus` | enum(DAY \| BOARDING) |  | enum: `DAY`, `BOARDING` |
| `dateOfBirth` | string(date) |  |  |
| `address` | string |  |  |
| `stateOfOrigin` | string |  |  |
| `gender` | enum(MALE \| FEMALE) |  | enum: `MALE`, `FEMALE` |
| `nationality` | string |  |  |
| `emergencyContact` | string |  |  |
| `phoneNumber` | string |  |  |
| `class` | string |  |  |
| `branch` | string |  |  |
| `schoolId` | integer(int64) |  |  |
| `armId` | integer(int64) |  |  |
| `departmentId` | integer(int64) |  |  |
| `parentId` | integer(int64) |  |  |
| `studentStatus` | enum(GRADUATED \| ACTIVE \| SUSPENDED \| WITHDRAWN \| INACTIVE \| TOTAL) |  | enum: `GRADUATED`, `ACTIVE`, `SUSPENDED`, `WITHDRAWN`, `INACTIVE`, `TOTAL` |
| `joinedSchoolSession` | string |  |  |
| `joinedSchoolTerm` | enum(FIRST \| SECOND \| THIRD) |  | enum: `FIRST`, `SECOND`, `THIRD` |
| `medicalInformation` | string |  |  |
| `tags` | string[] |  |  |
| `emergencyContactName` | string |  |  |
| `secondaryPhoneNumber` | string |  |  |
| `arm` | string |  |  |
| `department` | string |  |  |
| `linkedParents` | [`LinkedPersonDto`](#schema-linkedpersondto)[] |  |  |

---

### `StudentResultDTO` <a id="schema-studentresultdto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `studentAssessmentId` | integer(int64) |  |  |
| `assessmentId` | integer(int64) |  |  |
| `assessmentName` | string |  |  |
| `status` | enum(NOT_STARTED \| IN_PROGRESS \| PENDING \| COMPLETED \| ABSENT \| TIMED_OUT) |  | enum: `NOT_STARTED`, `IN_PROGRESS`, `PENDING`, `COMPLETED`, `ABSENT`, `TIMED_OUT` |
| `score` | number(double) |  |  |
| `totalMarks` | integer(int32) |  |  |
| `percentage` | number(double) |  |  |
| `passed` | boolean |  |  |
| `submissionTime` | string(date-time) |  |  |
| `timeSpentSeconds` | integer(int64) |  |  |

---

### `StudentSectionDTO` <a id="schema-studentsectiondto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `sectionId` | integer(int64) |  |  |
| `name` | string |  |  |
| `instructions` | string |  |  |
| `sectionOrder` | integer(int32) |  |  |
| `timeLimitMinutes` | integer(int32) |  |  |
| `questions` | [`StudentQuestionDTO`](#schema-studentquestiondto)[] |  |  |

---

### `StudentStatusCount` <a id="schema-studentstatuscount"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `status` | enum(GRADUATED \| ACTIVE \| SUSPENDED \| WITHDRAWN \| INACTIVE \| TOTAL) |  | enum: `GRADUATED`, `ACTIVE`, `SUSPENDED`, `WITHDRAWN`, `INACTIVE`, `TOTAL` |
| `count` | integer(int64) |  |  |

---

### `StudentSubjectReportResponse` <a id="schema-studentsubjectreportresponse"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `status` | enum(SUBMITTED \| NOT_SUBMITTED \| IN_PROGRESS \| REQUESTED_EDIT_ACCESS \| APPROVED \| APPROVED_EDIT_ACCESS) |  | enum: `SUBMITTED`, `NOT_SUBMITTED`, `IN_PROGRESS`, `REQUESTED_EDIT_ACCESS`, `APPROVED`, `APPROVED_EDIT_ACCESS` |
| `response` | [`PageGetStudentSubjectReportResponseDto`](#schema-pagegetstudentsubjectreportresponsedto) |  |  |

---

### `StudentTermAttendance` <a id="schema-studenttermattendance"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `attendanceTransactionId` | integer(int64) |  |  |
| `date` | string(date) |  |  |
| `isPresent` | boolean |  |  |

---

### `SubQuestionRequest` <a id="schema-subquestionrequest"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `questionText` | string | ✓ |  |
| `questionHtml` | string |  |  |
| `imageUrl` | string |  |  |
| `marks` | integer(int32) | ✓ | min: 1 |
| `explanation` | string |  |  |
| `questionType` | enum(MULTIPLE_CHOICE \| TRUE_FALSE \| ESSAY \| FILL_IN_THE_BLANK \| SHORT_ANSWER \| MULTIPLE_ANSWERS \| NUMERIC_ANSWER \| MATCH \| QUESTION_GROUP) | ✓ | enum: `MULTIPLE_CHOICE`, `TRUE_FALSE`, `ESSAY`, `FILL_IN_THE_BLANK`, `SHORT_ANSWER`, `MULTIPLE_ANSWERS`, `NUMERIC_ANSWER`, `MATCH`, `QUESTION_GROUP` |
| `typeSpecificData` | OneOf< [`EssayData`](#schema-essaydata) \| [`FillInTheBlankData`](#schema-fillintheblankdata) \| [`MatchData`](#schema-matchdata) \| [`MultipleAnswersData`](#schema-multipleanswersdata) \| [`MultipleChoiceData`](#schema-multiplechoicedata) \| [`NumericAnswerData`](#schema-numericanswerdata) \| [`QuestionGroupData`](#schema-questiongroupdata) \| [`ShortAnswerData`](#schema-shortanswerdata) \| [`TrueFalseData`](#schema-truefalsedata) > | ✓ |  |

---

### `Subject` <a id="schema-subject"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | integer(int64) |  |  |
| `uuid` | string(uuid) |  |  |
| `active` | boolean |  |  |
| `version` | integer(int64) |  |  |
| `createdAt` | string(date-time) |  |  |
| `updatedAt` | string(date-time) |  |  |
| `name` | string |  |  |
| `branchId` | integer(int64) |  |  |
| `schoolId` | integer(int64) |  |  |

---

### `SubjectArmAndClassDto` <a id="schema-subjectarmandclassdto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `subjectId` | integer(int64) | ✓ |  |
| `armId` | integer(int64) | ✓ |  |

---

### `SubjectCbtStatsDTO` <a id="schema-subjectcbtstatsdto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `schoolId` | integer(int64) |  |  |
| `classId` | integer(int64) |  |  |
| `subjectId` | integer(int64) |  |  |
| `questionCount` | integer(int64) |  |  |
| `assessmentCount` | integer(int64) |  |  |

---

### `SubjectDto` <a id="schema-subjectdto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `subjectId` | integer(int64) |  |  |
| `subjectName` | string |  |  |
| `fromDepartment` | boolean |  |  |

---

### `SubjectListProjectionDto` <a id="schema-subjectlistprojectiondto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `name` | string |  |  |
| `id` | integer(int64) |  |  |

---

### `SubjectReport` <a id="schema-subjectreport"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | integer(int64) |  |  |
| `uuid` | string(uuid) |  |  |
| `active` | boolean |  |  |
| `version` | integer(int64) |  |  |
| `createdAt` | string(date-time) |  |  |
| `updatedAt` | string(date-time) |  |  |
| `armId` | integer(int64) |  |  |
| `subjectId` | integer(int64) |  |  |
| `status` | enum(SUBMITTED \| NOT_SUBMITTED \| IN_PROGRESS \| REQUESTED_EDIT_ACCESS \| APPROVED \| APPROVED_EDIT_ACCESS) |  | enum: `SUBMITTED`, `NOT_SUBMITTED`, `IN_PROGRESS`, `REQUESTED_EDIT_ACCESS`, `APPROVED`, `APPROVED_EDIT_ACCESS` |
| `termId` | integer(int64) |  |  |
| `branchId` | integer(int64) |  |  |
| `schoolId` | integer(int64) |  |  |

---

### `SubjectReportRow` <a id="schema-subjectreportrow"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `subjectName` | string |  |  |
| `assessments` | [`AssessmentScoreDto`](#schema-assessmentscoredto)[] |  |  |
| `total` | number(double) |  |  |
| `grade` | string |  |  |
| `remark` | string |  |  |

---

### `SubjectScore` <a id="schema-subjectscore"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `subjectId` | integer(int64) |  |  |
| `subjectName` | string |  |  |
| `score` | number(double) |  |  |

---

### `SubjectTeachingDto` <a id="schema-subjectteachingdto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `subjectId` | integer(int64) |  |  |
| `subjectName` | string |  |  |
| `arms` | [`StaffArmDto`](#schema-staffarmdto)[] |  |  |

---

### `SubmissionDeadlineResponse` <a id="schema-submissiondeadlineresponse"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `schoolId` | integer(int64) |  |  |
| `termId` | integer(int64) |  |  |
| `openDate` | string(date) |  |  |
| `closeDate` | string(date) |  |  |
| `autoLockAfterDeadline` | boolean |  |  |

---

### `SubmitAnswerDTO` <a id="schema-submitanswerdto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `studentAssessmentId` | integer(int64) | ✓ |  |
| `assessmentQuestionId` | integer(int64) | ✓ |  |
| `answerData` | object | ✓ |  |
| `timeSpentSeconds` | integer(int64) |  |  |
| `flagged` | boolean |  |  |

---

### `SubmitClassArmReportRequest` <a id="schema-submitclassarmreportrequest"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `classArmReportId` | integer(int64) | ✓ |  |
| `status` | enum(APPROVED \| PENDING_APPROVAL \| NOT_SUBMITTED \| EDIT_REQUEST \| APPROVED_EDIT_REQUEST) | ✓ | enum: `APPROVED`, `PENDING_APPROVAL`, `NOT_SUBMITTED`, `EDIT_REQUEST`, `APPROVED_EDIT_REQUEST` |
| `comment` | string |  |  |

---

### `SubmitClassPromotionReportDto` <a id="schema-submitclasspromotionreportdto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `armId` | integer(int64) |  |  |
| `sessionId` | integer(int64) |  |  |
| `decisions` | [`StudentPromotionDecision`](#schema-studentpromotiondecision)[] |  |  |

---

### `SubmitSubjectReportDto` <a id="schema-submitsubjectreportdto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `armId` | integer(int64) |  |  |
| `subjectId` | integer(int64) |  |  |
| `termId` | integer(int64) |  |  |

---

### `Subscription` <a id="schema-subscription"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | integer(int64) |  |  |
| `uuid` | string(uuid) |  |  |
| `active` | boolean |  |  |
| `version` | integer(int64) |  |  |
| `createdAt` | string(date-time) |  |  |
| `updatedAt` | string(date-time) |  |  |
| `schoolId` | integer(int64) |  |  |
| `branchId` | integer(int64) |  |  |
| `planId` | integer(int64) |  |  |
| `studentCapacity` | integer(int64) |  |  |
| `activeStudentCount` | integer(int64) |  |  |
| `totalAmount` | number |  |  |
| `status` | enum(ACTIVE \| EXPIRED \| CANCELLED \| PENDING) |  | enum: `ACTIVE`, `EXPIRED`, `CANCELLED`, `PENDING` |
| `startDate` | string(date) |  |  |
| `endDate` | string(date) |  |  |

---

### `SubscriptionOverviewDto` <a id="schema-subscriptionoverviewdto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `subscriptionId` | integer(int64) |  |  |
| `planName` | string |  |  |
| `studentCapacity` | integer(int64) |  |  |
| `activeStudentCount` | integer(int64) |  |  |
| `status` | enum(ACTIVE \| EXPIRED \| CANCELLED \| PENDING) |  | enum: `ACTIVE`, `EXPIRED`, `CANCELLED`, `PENDING` |
| `endDate` | string(date) |  |  |

---

### `SummativeAssessment` <a id="schema-summativeassessment"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | integer(int64) |  |  |
| `uuid` | string(uuid) |  |  |
| `active` | boolean |  |  |
| `version` | integer(int64) |  |  |
| `createdAt` | string(date-time) |  |  |
| `updatedAt` | string(date-time) |  |  |
| `assessmentId` | integer(int64) |  |  |
| `classId` | integer(int64) |  |  |
| `levelId` | integer(int64) |  |  |
| `branchId` | integer(int64) |  |  |
| `schoolId` | integer(int64) |  |  |
| `isDefault` | boolean |  |  |

---

### `TeacherAssessmentListDTO` <a id="schema-teacherassessmentlistdto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | integer(int64) |  |  |
| `name` | string |  |  |
| `classId` | integer(int64) |  |  |
| `className` | string |  |  |
| `subjectId` | integer(int64) |  |  |
| `subjectName` | string |  |  |
| `branchId` | integer(int64) |  |  |
| `testType` | enum(CONTINUOUS_ASSESSMENT \| EXAMINATION \| MOCK_EXAM \| PRACTICE_TEST) |  | enum: `CONTINUOUS_ASSESSMENT`, `EXAMINATION`, `MOCK_EXAM`, `PRACTICE_TEST` |
| `term` | enum(FIRST \| SECOND \| THIRD) |  | enum: `FIRST`, `SECOND`, `THIRD` |
| `status` | enum(DRAFT \| PUBLISHED \| ONGOING \| COMPLETED \| ARCHIVED) |  | enum: `DRAFT`, `PUBLISHED`, `ONGOING`, `COMPLETED`, `ARCHIVED` |
| `durationMinutes` | integer(int32) |  |  |
| `totalMarks` | integer(int32) |  |  |
| `startDateTime` | string(date-time) |  |  |
| `endDateTime` | string(date-time) |  |  |
| `questionCount` | integer(int32) |  |  |

---

### `TeacherInputRequest` <a id="schema-teacherinputrequest"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `studentId` | integer(int64) |  |  |
| `armId` | integer(int64) |  |  |
| `branchId` | integer(int64) |  |  |
| `neatness` | enum(EXCELLENT \| VERY_GOOD \| GOOD \| FAIR \| POOR) |  | enum: `EXCELLENT`, `VERY_GOOD`, `GOOD`, `FAIR`, `POOR` |
| `punctuality` | enum(EXCELLENT \| VERY_GOOD \| GOOD \| FAIR \| POOR) |  | enum: `EXCELLENT`, `VERY_GOOD`, `GOOD`, `FAIR`, `POOR` |
| `diligence` | enum(EXCELLENT \| VERY_GOOD \| GOOD \| FAIR \| POOR) |  | enum: `EXCELLENT`, `VERY_GOOD`, `GOOD`, `FAIR`, `POOR` |
| `classTeacherComment` | string |  |  |

---

### `TeacherInputResponse` <a id="schema-teacherinputresponse"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | integer(int64) |  |  |
| `branchId` | integer(int64) |  |  |
| `studentId` | integer(int64) |  |  |
| `studentName` | string |  |  |
| `armId` | integer(int64) |  |  |
| `termId` | integer(int64) |  |  |
| `neatness` | enum(EXCELLENT \| VERY_GOOD \| GOOD \| FAIR \| POOR) |  | enum: `EXCELLENT`, `VERY_GOOD`, `GOOD`, `FAIR`, `POOR` |
| `punctuality` | enum(EXCELLENT \| VERY_GOOD \| GOOD \| FAIR \| POOR) |  | enum: `EXCELLENT`, `VERY_GOOD`, `GOOD`, `FAIR`, `POOR` |
| `diligence` | enum(EXCELLENT \| VERY_GOOD \| GOOD \| FAIR \| POOR) |  | enum: `EXCELLENT`, `VERY_GOOD`, `GOOD`, `FAIR`, `POOR` |
| `classTeacherComment` | string |  |  |

---

### `TermDeadlineDto` <a id="schema-termdeadlinedto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `termId` | integer(int64) |  |  |
| `openDate` | string(date) |  |  |
| `closeDate` | string(date) |  |  |
| `autoLockAfterDeadline` | boolean |  |  |

---

### `TermLookupDto` <a id="schema-termlookupdto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | integer(int64) |  |  |
| `term` | enum(FIRST \| SECOND \| THIRD) |  | enum: `FIRST`, `SECOND`, `THIRD` |
| `startDate` | string(date) |  |  |
| `endDate` | string(date) |  |  |
| `isActive` | boolean |  |  |
| `academicSessionId` | integer(int64) |  |  |
| `academicSessionName` | string |  |  |

---

### `TieredChargeDto` <a id="schema-tieredchargedto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `minAmount` | number | ✓ |  |
| `maxAmount` | number |  |  |
| `charge` | number | ✓ |  |
| `isPercentage` | boolean | ✓ |  |

---

### `Topic` <a id="schema-topic"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | integer(int64) |  |  |
| `uuid` | string(uuid) |  |  |
| `active` | boolean |  |  |
| `version` | integer(int64) |  |  |
| `createdAt` | string(date-time) |  |  |
| `updatedAt` | string(date-time) |  |  |
| `name` | string |  |  |
| `classId` | integer(int64) |  |  |
| `subjectId` | integer(int64) |  |  |
| `branchId` | integer(int64) |  |  |
| `schoolId` | integer(int64) |  |  |
| `description` | string |  |  |
| `displayOrder` | integer(int32) |  |  |

---

### `TopicDTO` <a id="schema-topicdto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `name` | string | ✓ |  |
| `classId` | integer(int64) | ✓ |  |
| `subjectId` | integer(int64) | ✓ |  |
| `branchId` | integer(int64) | ✓ |  |
| `description` | string |  |  |
| `displayOrder` | integer(int32) |  |  |

---

### `TransferDomainRequest` <a id="schema-transferdomainrequest"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `domain` | string | ✓ |  |
| `eppCode` | string | ✓ |  |

---

### `TrueFalseData` <a id="schema-truefalsedata"></a>

_Composed via `allOf`: extends [`TypeSpecificData`](#schema-typespecificdata) — inherited fields are merged below._

| Field | Type | Required | Notes |
|---|---|---|---|
| `type` | string | ✓ |  |
| `correctAnswer` | boolean | ✓ |  |

---

### `TypeSpecificData` <a id="schema-typespecificdata"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `type` | string | ✓ |  |

---

### `UpdateAcademicSessionDto` <a id="schema-updateacademicsessiondto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `name` | string |  |  |
| `currentTerm` | enum(FIRST \| SECOND \| THIRD) |  | enum: `FIRST`, `SECOND`, `THIRD` |
| `firstTermStartDate` | string(date) |  |  |
| `firstTermEndDate` | string(date) |  |  |
| `secondTermStartDate` | string(date) |  |  |
| `secondTermEndDate` | string(date) |  |  |
| `thirdTermStartDate` | string(date) |  |  |
| `thirdTermEndDate` | string(date) |  |  |

---

### `UpdateAdmissionNumberDto` <a id="schema-updateadmissionnumberdto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `prefix` | string |  |  |
| `numberFormat` | string |  |  |
| `startingNumber` | integer(int32) |  |  |
| `padding` | integer(int32) |  |  |

---

### `UpdateArmByClassDto` <a id="schema-updatearmbyclassdto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `classId` | integer(int64) | ✓ |  |
| `armId` | integer(int64) | ✓ |  |
| `name` | string |  |  |
| `departmentId` | integer(int64) |  |  |

---

### `UpdateArmByLevelDto` <a id="schema-updatearmbyleveldto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `levelId` | integer(int64) | ✓ |  |
| `armId` | integer(int64) | ✓ |  |
| `name` | string |  |  |
| `departmentId` | integer(int64) |  |  |

---

### `UpdateBankAccountDto` <a id="schema-updatebankaccountdto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `bankName` | string | ✓ |  |
| `bankCode` | string | ✓ |  |
| `accountNumber` | string | ✓ |  |

---

### `UpdateBranchWithLevelsDto` <a id="schema-updatebranchwithlevelsdto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `branchId` | integer(int64) |  |  |
| `branchName` | string |  |  |
| `branchAddress` | string |  |  |
| `levels` | enum(CRECHE \| KINDERGARTEN \| NURSERY \| PRIMARY \| JUNIOR_SECONDARY \| SENIOR_SECONDARY)[] |  |  |

---

### `UpdateBranchWithLevelsListDto` <a id="schema-updatebranchwithlevelslistdto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `updateBranchWithLevelsDto` | [`UpdateBranchWithLevelsDto`](#schema-updatebranchwithlevelsdto)[] |  |  |

---

### `UpdateClassroomDto` <a id="schema-updateclassroomdto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `classId` | integer(int64) |  |  |
| `name` | string |  |  |

---

### `UpdateContactRequest` <a id="schema-updatecontactrequest"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `domain` | string | ✓ |  |
| `firstname` | string | ✓ |  |
| `lastname` | string | ✓ |  |
| `companyname` | string |  |  |
| `address` | string | ✓ |  |
| `city` | string | ✓ |  |
| `state` | string | ✓ |  |
| `postcode` | string | ✓ |  |
| `country` | string | ✓ |  |
| `phone` | string | ✓ |  |
| `emailAddress` | string | ✓ |  |

---

### `UpdateDepartmentDto` <a id="schema-updatedepartmentdto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `departmentId` | integer(int64) | ✓ |  |
| `name` | string | ✓ |  |

---

### `UpdateDepartmentSubjectsByClassDto` <a id="schema-updatedepartmentsubjectsbyclassdto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `departmentId` | integer(int64) | ✓ |  |
| `classId` | integer(int64) | ✓ |  |
| `subjectIds` | integer(int64)[] | ✓ |  |

---

### `UpdateDepartmentSubjectsByLevelDto` <a id="schema-updatedepartmentsubjectsbyleveldto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `departmentId` | integer(int64) | ✓ |  |
| `levelId` | integer(int64) | ✓ |  |
| `subjectIds` | integer(int64)[] | ✓ |  |

---

### `UpdateModeDto` <a id="schema-updatemodedto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `mode` | enum(SINGLE_ACCOUNT \| BRANCH_ACCOUNTS) | ✓ | enum: `SINGLE_ACCOUNT`, `BRANCH_ACCOUNTS` |

---

### `UpdateNameserversRequest` <a id="schema-updatenameserversrequest"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `domain` | string | ✓ |  |
| `nameserver1` | string | ✓ |  |
| `nameserver2` | string | ✓ |  |
| `nameserver3` | string |  |  |
| `nameserver4` | string |  |  |

---

### `UpdateParentDto` <a id="schema-updateparentdto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | integer(int64) | ✓ |  |
| `firstName` | string |  |  |
| `lastName` | string |  |  |
| `middleName` | string |  |  |
| `gender` | enum(MALE \| FEMALE) |  | enum: `MALE`, `FEMALE` |
| `relationship` | enum(FATHER \| MOTHER \| GUARDIAN) |  | enum: `FATHER`, `MOTHER`, `GUARDIAN` |
| `branchId` | integer(int64) |  |  |
| `nationality` | string |  |  |
| `stateOfOrigin` | string |  |  |
| `email` | string |  |  |
| `phoneNumber` | string |  |  |
| `secondaryPhoneNumber` | string |  |  |
| `address` | string |  |  |
| `image` | string |  |  |
| `linkedStudents` | integer(int64)[] |  |  |
| `tags` | string[] |  |  |

---

### `UpdateResultSettingDto` <a id="schema-updateresultsettingdto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `calculationMethod` | enum(CUMULATIVE \| THIRD_TERM_ONLY) |  | enum: `CUMULATIVE`, `THIRD_TERM_ONLY` |
| `promotionType` | enum(PROMOTE_ALL \| MANUAL \| BY_PERFORMANCE) |  | enum: `PROMOTE_ALL`, `MANUAL`, `BY_PERFORMANCE` |
| `minimumOverallPercentage` | number(double) |  |  |
| `minimumPassGrade` | string |  |  |
| `requiredSubjectIds` | integer(int64)[] |  |  |

---

### `UpdateSchoolDomainDto` <a id="schema-updateschooldomaindto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `subdomain` | string |  | minLength: 3; maxLength: 63; pattern: `^[a-z0-9]([a-z0-9-]{1,61}[a-z0-9])?$` |
| `customDomain` | string |  | minLength: 0; maxLength: 253; pattern: `^([a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$` |

---

### `UpdateStudentDto` <a id="schema-updatestudentdto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `studentId` | integer(int64) | ✓ |  |
| `firstName` | string |  |  |
| `lastName` | string |  |  |
| `middleName` | string |  |  |
| `admissionNumber` | string |  |  |
| `gender` | enum(MALE \| FEMALE) |  | enum: `MALE`, `FEMALE` |
| `email` | string |  |  |
| `image` | string |  |  |
| `boardingStatus` | enum(DAY \| BOARDING) |  | enum: `DAY`, `BOARDING` |
| `dateOfBirth` | string(date) |  |  |
| `address` | string |  |  |
| `stateOfOrigin` | string |  |  |
| `nationality` | string |  |  |
| `emergencyContact` | string |  |  |
| `phoneNumber` | string |  |  |
| `departmentId` | integer(int64) |  |  |
| `classId` | integer(int64) |  |  |
| `armId` | integer(int64) |  |  |
| `branchId` | integer(int64) |  |  |
| `parentId` | integer(int64) |  |  |
| `admissionStatus` | enum(GRADUATED \| ACTIVE \| SUSPENDED \| WITHDRAWN \| INACTIVE \| TOTAL) |  | enum: `GRADUATED`, `ACTIVE`, `SUSPENDED`, `WITHDRAWN`, `INACTIVE`, `TOTAL` |
| `joinedSchoolSession` | string |  |  |
| `joinedSchoolTerm` | enum(FIRST \| SECOND \| THIRD) |  | enum: `FIRST`, `SECOND`, `THIRD` |
| `medicalInformation` | string |  |  |
| `tags` | string[] |  |  |
| `emergencyContactName` | string |  |  |

---

### `UpdateSubjectByClassDto` <a id="schema-updatesubjectbyclassdto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `subjectId` | integer(int64) | ✓ |  |
| `classId` | integer(int64) | ✓ |  |
| `name` | string |  |  |

---

### `UpdateSubjectByLevelDto` <a id="schema-updatesubjectbyleveldto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `subjectId` | integer(int64) | ✓ |  |
| `levelId` | integer(int64) | ✓ |  |
| `name` | string |  |  |

---

### `UpdateSubmissionDeadlineDto` <a id="schema-updatesubmissiondeadlinedto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `termsDeadline` | [`TermDeadlineDto`](#schema-termdeadlinedto)[] |  |  |

---

### `UpdateSubscriptionDto` <a id="schema-updatesubscriptiondto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `planId` | integer(int64) |  |  |
| `studentCapacity` | integer(int64) |  |  |

---

### `UserDetailsResponse` <a id="schema-userdetailsresponse"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `image` | string |  |  |
| `firstName` | string |  |  |
| `middleName` | string |  |  |
| `lastName` | string |  |  |
| `phoneNumber` | string |  |  |
| `email` | string |  |  |
| `roles` | string[] |  |  |
| `timezone` | string |  |  |

---

### `UserUpdateDto` <a id="schema-userupdatedto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `image` | string |  |  |
| `firstName` | string |  |  |
| `middleName` | string |  |  |
| `lastName` | string |  |  |
| `phoneNumber` | string |  |  |
| `timezone` | string |  |  |

---

### `VerifyChangePasswordOtpDto` <a id="schema-verifychangepasswordotpdto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `otp` | string | ✓ |  |

---

### `VerifyOtpDto` <a id="schema-verifyotpdto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `email` | string | ✓ |  |
| `otp` | string | ✓ | minLength: 6; maxLength: 6 |

---

### `WeeklyAttendanceDto` <a id="schema-weeklyattendancedto"></a>

| Field | Type | Required | Notes |
|---|---|---|---|
| `week` | string |  |  |
| `days` | [`StudentTermAttendance`](#schema-studenttermattendance)[] |  |  |

---

