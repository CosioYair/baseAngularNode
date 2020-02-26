import { TestBed } from '@angular/core/testing';

import { ActiveProcessGroupService } from './active-process-group.service';

describe('ActiveProcessGroupService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ActiveProcessGroupService = TestBed.get(ActiveProcessGroupService);
    expect(service).toBeTruthy();
  });
});
