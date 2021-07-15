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
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { loadApplications, setSelectedAppIdEntityAction } from '../../store/application/action';
import { getUserInfo } from '../../store/userInfo/action';
import { loadModels, setSelectedModelIdEntityAction } from '../../store/model/action';
import { Routes } from '../../data/enums/routers-url.enum';
import { loadSubjects, resetSubjects } from '../../store/manage-collectiom/action';
import { selectCurrentModel } from '../../store/model/selectors';
import { filter, finalize, take, tap } from 'rxjs/operators';

@Injectable()
export class ManageCollectionPageService {
  private appId: string;
  private modelId: string;
  private apiKey: string;

  constructor(private router: Router, private route: ActivatedRoute, private store: Store<any>) {}

  initUrlBindingStreams() {
    this.appId = this.route.snapshot.queryParams.app;
    this.modelId = this.route.snapshot.queryParams.model;

    if (this.appId && this.modelId) {
      this.store.dispatch(loadModels({ applicationId: this.appId }));
      this.store.dispatch(setSelectedAppIdEntityAction({ selectedAppId: this.appId }));
      this.store.dispatch(setSelectedModelIdEntityAction({ selectedModelId: this.modelId }));
      this.store.dispatch(loadApplications());
      this.store.dispatch(getUserInfo());
      this.store
        .select(selectCurrentModel)
        .pipe(
          take(2),
          filter(model => !!model),
          tap(({ apiKey }) => (this.apiKey = apiKey)),
          finalize(() => this.store.dispatch(loadSubjects({ apiKey: this.apiKey })))
        )
        .subscribe();
    } else {
      this.router.navigate([Routes.Home]);
    }
  }

  clearSelectedModelId() {
    this.store.dispatch(setSelectedModelIdEntityAction({ selectedModelId: null }));
  }

  unSubscribe() {
    this.store.dispatch(resetSubjects());
  }
}
