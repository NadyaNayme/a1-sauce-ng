import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VersionCheckerComponent } from './version-checker.component';

describe('VersionCheckerComponent', () => {
  let component: VersionCheckerComponent;
  let fixture: ComponentFixture<VersionCheckerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VersionCheckerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VersionCheckerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
