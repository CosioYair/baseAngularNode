import { TestBed } from '@angular/core/testing';

import { UserfiletypeService } from './userfiletype.service';

describe('UserfiletypeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UserfiletypeService = TestBed.get(UserfiletypeService);
    expect(service).toBeTruthy();
  });
});
