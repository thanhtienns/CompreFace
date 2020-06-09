/*
 * Copyright (c) 2020 the original author or authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { ApplicationService } from 'src/app/core/application/application.service';
import { ROUTERS_URL } from 'src/app/data/routers-url.variable';
import { SnackBarService } from 'src/app/features/snackbar/snackbar.service';

import {
  createApplication,
  createApplicationFail,
  createApplicationSuccess,
  deleteApplication,
  deleteApplicationFail,
  deleteApplicationSuccess,
  loadApplications,
  loadApplicationsFail,
  loadApplicationsSuccess,
  setSelectedIdEntityAction,
  updateApplication,
  updateApplicationFail,
  updateApplicationSuccess,
} from './action';

@Injectable()
export class ApplicationListEffect {
  constructor(
    private actions: Actions,
    private applicationService: ApplicationService,
    private snackBarService: SnackBarService,
    private router: Router,
  ) { }

  @Effect()
  loadApplications$ = this.actions.pipe(
    ofType(loadApplications),
    switchMap((action) => this.applicationService.getAll(action.organizationId).pipe(
      map(applications => loadApplicationsSuccess({ applications })),
      catchError(error => of(loadApplicationsFail({ error }))),
    )),
  );

  @Effect()
  createApplication$ = this.actions.pipe(
    ofType(createApplication),
    switchMap(({ organizationId, name }) => this.applicationService.create(organizationId, name).pipe(
      map(application => createApplicationSuccess({ application })),
      catchError(error => of(createApplicationFail({ error }))),
    )),
  );

  @Effect()
  updateApplication$ = this.actions.pipe(
    ofType(updateApplication),
    switchMap(({ organizationId, id, name }) => this.applicationService.put(organizationId, id, name).pipe(
      map(application => updateApplicationSuccess({ application })),
      catchError(error => of(updateApplicationFail({ error }))),
    )),
  );

  @Effect()
  deleteApplication$ = this.actions.pipe(
    ofType(deleteApplication),
    switchMap((app =>
      this.applicationService.delete(app.organizationId, app.id).pipe(
        switchMap(() => {
          this.router.navigate([`${ROUTERS_URL.ORGANIZATION}/${app.organizationId}`]);
          return [deleteApplicationSuccess({ id: app.id }), setSelectedIdEntityAction({ selectedAppId: null })];
        }),
        catchError(error => of(deleteApplicationFail({ error }))),
      )),
    )
  );

  @Effect({ dispatch: false })
  showError$ = this.actions.pipe(
    ofType(
      loadApplicationsFail,
      createApplicationFail,
      updateApplicationFail,
      deleteApplicationFail,
    ),
    tap(action => {
      this.snackBarService.openHttpError(action.error);
    })
  );
}
